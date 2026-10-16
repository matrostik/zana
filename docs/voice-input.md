# Voice input (dictation)

Push-to-talk dictation in the prompt composer. Record, transcribe, edit, send.
Settings live under **Settings → Experimental → Voice input (dictation)** and
are gated by the master **Enable voice input** toggle.

## Engines

| | Cloud (default) | Local (experimental) |
|---|---|---|
| Transcription | Codex ChatGPT login on the host, optional OpenAI API-key fallback | whisper.cpp `whisper-cli` on the connected host |
| Network | Needs connectivity + login/key | Fully offline after the one-time model download |
| Cost | Per audio-minute on your key (Codex login: your plan) | Free |
| Models | `gpt-transcribe`, `whisper-1`, `gpt-4o-transcribe`, `gpt-4o-mini-transcribe` | `tiny` (74 MB), `base` (141 MB, default), `small` (465 MB), `medium` (1.4 GB) |

The engine is the `voiceEngine` setting (`cloud` | `local`). An unset or
unknown value behaves as `cloud`. There is no silent fallback: when `local`
is selected and not ready, the mic is disabled with the reason
(`voice-status` below), and transcription attempts fail instead of going to
the cloud.

`voiceLanguage` (ISO-639, e.g. `en`) is sent as a hint to OpenAI API-key and
local transcription; empty means auto-detect. The Codex ChatGPT backend
always auto-detects.

## Setting up local transcription

1. Install `whisper-cli` **on the host computer** (the machine whose daemon
   the app is connected to), e.g. `brew install whisper-cpp` on macOS.
   The daemon finds it on `PATH` (plus Homebrew locations on macOS), or set
   an absolute path in **whisper-cli path** (`voiceWhisperBinary`).
2. Pick a **Local model** and press **Download** in the model manager. The
   host streams the file from Hugging Face (`ggerganov/whisper.cpp`, pinned
   revision), verifies length + sha256, then installs it under
   `<dataDir>/voice-models/<sha256>/`. Progress polls every 2 s; downloads
   can be cancelled, retried after failure, or deleted.
3. When the binary and the selected model are both ready, the mic enables.

What the renderer sends for local: the recording is decoded with Web Audio
and re-encoded as 16 kHz mono 16-bit PCM WAV (`recording.wav`) before
upload — browsers never record that shape directly. Retry re-converts the
original recording. The daemon re-validates the RIFF header and rejects
anything else with `400 invalid_request`.

## Status and errors

`GET /api/v1/system/voice-status` returns `{ enabled, engine, ready, reason }`:

| reason | meaning |
|---|---|
| `no_host` | no host daemon connected |
| `binary_missing` / `binary_invalid` | `whisper-cli` not found / not usable on the host |
| `model_not_installed` / `model_downloading` / `model_failed` | selected-model state |
| `daemon_outdated` | host daemon predates local transcription — update it |
| `ambiguous_host` / `status_failed` | several hosts / host unreachable |

Transcription failures surface the same vocabulary over
`POST /api/v1/system/voice-transcription` (and the model routes below):

| HTTP | cause |
|---|---|
| 400 | bad audio (`invalid_request`) |
| 501 | outdated daemon (`unknown_command`) or missing Codex login (cloud) |
| 503 | binary/model missing, transcriber busy, rate-limit, keychain locked |
| 504 | transcription or RPC timeout |

Model management for Settings / automation:

- `GET /api/v1/system/voice-local/status` → `{ binary, models }`
- `POST /api/v1/system/voice-local/model-download|model-cancel|model-delete`
  with `{ "modelId": "tiny" | "base" | "small" | "medium" }` → fresh status

## Architecture (for contributors)

- Contracts: `voice.local.status|model_download|model_cancel|model_delete|transcribe`
  in `packages/contracts/src/host-rpc.ts`. Only model ids cross the wire —
  never paths or URLs.
- Host: `apps/host-daemon/src/local-voice/` — `whisper-binary.ts`
  (discovery + `--help` probe, cached by path+mtime+size), `model-store.ts`
  (verified streaming downloads, max 2 concurrent, stall timeout),
  `transcribe.ts` (WAV validation, one-at-a-time runner with a 3-deep queue,
  `-m/-f/-l/-nt/-t/-otxt -of`, prompt-voice transcript cleanup).
  Child output is captured to 0600 temp files, never pipes
  (`captured-run.ts`). Timeouts: child `min(120 s, 15 s + 2×audio)`,
  server RPC 145 s.
- Server: `apps/server/src/services/threads/voice-transcription.ts`
  (engine routing, `voiceStatus()`, error mapping),
  `apps/server/src/http/product-api.ts` (the routes above).
- Renderer: `apps/app/src/components/thread/voice/` (capture session),
  `product-client.ts` `voice` (status gating, WAV conversion, model calls),
  `apps/app/src/views/settings/ExperimentalView.tsx` +
  `VoiceModelManager.tsx`.
- Tests: unit per layer plus a fake-`whisper-cli` child run through
  `process.execPath`; built-Electron coverage in `e2e/mobile-voice.spec.ts`;
  an opt-in real-binary smoke test behind `ZCC_WHISPER_CLI` /
  `ZCC_WHISPER_MODEL`.
