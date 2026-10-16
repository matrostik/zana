import type {
  VoiceLocalModelId,
  VoiceLocalStatusResult,
  VoiceLocalTranscribeCommand,
  VoiceLocalTranscribeResult
} from '@zana-ai/zcc-contracts/host-rpc';
import type { AppConfig } from '@zana-ai/zcc-domain/product';
import { HostCommandError } from '../host-command-error.js';
import { VoiceModelStore, type VoiceModelStoreDeps } from './model-store.js';
import { runLocalTranscription, type LocalTranscribeDeps } from './transcribe.js';
import { WhisperBinaryResolver, type WhisperBinaryDeps } from './whisper-binary.js';

export interface LocalVoiceServiceDeps {
  dataDir: string;
  loadConfig: () => AppConfig;
  store?: Partial<Omit<VoiceModelStoreDeps, 'dataDir'>>;
  binary?: WhisperBinaryDeps;
  transcribe?: Partial<Pick<LocalTranscribeDeps, 'run' | 'cpuCount' | 'tmpDir'>>;
}

/** One transcription runs at a time; three more may wait. */
const MAX_TRANSCRIBE_WAITERS = 3;

function shutdownCancelled(): HostCommandError {
  return new HostCommandError('voice_transcribe_cancelled', 'Local transcription was cancelled because the host daemon is shutting down.');
}

/** Host-side state for local (whisper.cpp) dictation: binary discovery + model store. */
export class LocalVoiceService {
  readonly models: VoiceModelStore;
  readonly binary: WhisperBinaryResolver;
  private readonly loadConfig: () => AppConfig;
  private readonly transcribeDeps: Partial<Pick<LocalTranscribeDeps, 'run' | 'cpuCount' | 'tmpDir'>>;
  private transcribeRunning = false;
  private readonly transcribeWaiters: Array<{ resolve: () => void; reject: (error: Error) => void }> = [];
  private readonly shutdown = new AbortController();
  private activeTranscription: Promise<unknown> | null = null;

  constructor(deps: LocalVoiceServiceDeps) {
    this.models = new VoiceModelStore({ ...deps.store, dataDir: deps.dataDir });
    this.binary = new WhisperBinaryResolver(deps.binary);
    this.loadConfig = deps.loadConfig;
    // The transcribe step reuses the binary runner (tests inject a fake here).
    this.transcribeDeps = { run: deps.binary?.run, ...deps.transcribe };
  }

  async status(): Promise<VoiceLocalStatusResult> {
    const [binary, models] = await Promise.all([
      this.binary.resolve(this.loadConfig().voiceWhisperBinary),
      this.models.list()
    ]);
    return { binary, models };
  }

  async download(modelId: VoiceLocalModelId): Promise<VoiceLocalStatusResult> {
    await this.models.download(modelId);
    return this.status();
  }

  async cancel(modelId: VoiceLocalModelId): Promise<VoiceLocalStatusResult> {
    await this.models.cancel(modelId);
    return this.status();
  }

  async delete(modelId: VoiceLocalModelId): Promise<VoiceLocalStatusResult> {
    await this.models.delete(modelId);
    return this.status();
  }

  async transcribe(command: VoiceLocalTranscribeCommand): Promise<VoiceLocalTranscribeResult> {
    await this.acquireTranscribeSlot();
    const run = this.runTranscription(command);
    this.activeTranscription = run;
    try {
      return await run;
    } finally {
      this.activeTranscription = null;
      this.releaseTranscribeSlot();
    }
  }

  private async runTranscription(command: VoiceLocalTranscribeCommand): Promise<VoiceLocalTranscribeResult> {
    this.assertOpen();
    const binary = await this.binary.resolve(this.loadConfig().voiceWhisperBinary);
    if (binary.state === 'missing' || !binary.path) {
      throw new HostCommandError('voice_binary_missing', 'whisper-cli was not found. Install whisper.cpp or set its path.');
    }
    if (binary.state !== 'ready') {
      throw new HostCommandError('voice_binary_invalid', binary.message ?? 'The whisper-cli binary is not usable.');
    }
    const modelPath = await this.models.installedPath(command.modelId);
    if (!modelPath) {
      throw new HostCommandError('voice_model_missing', `The ${command.modelId} model is not downloaded on this host.`);
    }
    // Shutdown may have started while the binary and model were being resolved.
    this.assertOpen();
    return runLocalTranscription(command, {
      ...this.transcribeDeps,
      binaryPath: binary.path,
      modelPath,
      signal: this.shutdown.signal
    });
  }

  private assertOpen(): void {
    if (this.shutdown.signal.aborted) throw shutdownCancelled();
  }

  private acquireTranscribeSlot(): Promise<void> {
    try {
      this.assertOpen();
    } catch (error) {
      return Promise.reject(error);
    }
    if (!this.transcribeRunning) {
      this.transcribeRunning = true;
      return Promise.resolve();
    }
    if (this.transcribeWaiters.length >= MAX_TRANSCRIBE_WAITERS) {
      return Promise.reject(new HostCommandError(
        'voice_transcribe_busy',
        'Local transcription is busy. Try again when it finishes.'
      ));
    }
    return new Promise<void>((resolve, reject) => this.transcribeWaiters.push({ resolve, reject }));
  }

  private releaseTranscribeSlot(): void {
    const next = this.transcribeWaiters.shift();
    if (!next) this.transcribeRunning = false;
    else next.resolve();
  }

  /** Kills a running whisper-cli, rejects queued requests, and stops downloads. */
  async dispose(): Promise<void> {
    this.shutdown.abort();
    for (const waiter of this.transcribeWaiters.splice(0)) waiter.reject(shutdownCancelled());
    await Promise.all([
      this.activeTranscription?.catch(() => undefined),
      this.models.dispose()
    ]);
  }
}
