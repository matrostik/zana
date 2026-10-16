import type { VoiceLocalModelId, VoiceLocalStatusResult } from '@zana-ai/zcc-contracts/host-rpc';
import type { AppConfig } from '@zana-ai/zcc-domain/product';
import { VoiceModelStore, type VoiceModelStoreDeps } from './model-store.js';
import { WhisperBinaryResolver, type WhisperBinaryDeps } from './whisper-binary.js';

export interface LocalVoiceServiceDeps {
  dataDir: string;
  loadConfig: () => AppConfig;
  store?: Partial<Omit<VoiceModelStoreDeps, 'dataDir'>>;
  binary?: WhisperBinaryDeps;
}

/** Host-side state for local (whisper.cpp) dictation: binary discovery + model store. */
export class LocalVoiceService {
  readonly models: VoiceModelStore;
  readonly binary: WhisperBinaryResolver;
  private readonly loadConfig: () => AppConfig;

  constructor(deps: LocalVoiceServiceDeps) {
    this.models = new VoiceModelStore({ ...deps.store, dataDir: deps.dataDir });
    this.binary = new WhisperBinaryResolver(deps.binary);
    this.loadConfig = deps.loadConfig;
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

  dispose(): Promise<void> {
    return this.models.dispose();
  }
}
