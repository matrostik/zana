import type { VoiceLocalModelId } from '@zana-ai/zcc-contracts/host-rpc';

export interface VoiceModelEntry {
  id: VoiceLocalModelId;
  label: string;
  fileName: string;
  sizeBytes: number;
  sha256: string;
  url: string;
}

/** Revision of huggingface.co/ggerganov/whisper.cpp the digests below were read from. */
const WHISPER_CPP_REVISION = '5359861c739e955e79d9a303bcbc70fb988958b1';

function entry(id: VoiceLocalModelId, label: string, fileName: string, sizeBytes: number, sha256: string): VoiceModelEntry {
  return {
    id,
    label,
    fileName,
    sizeBytes,
    sha256,
    url: `https://huggingface.co/ggerganov/whisper.cpp/resolve/${WHISPER_CPP_REVISION}/${fileName}`
  };
}

/** Sizes and sha256 are the Hugging Face LFS metadata at the pinned revision. */
export const VOICE_MODEL_CATALOG: readonly VoiceModelEntry[] = [
  entry('tiny', 'Tiny', 'ggml-tiny.bin', 77_691_713, 'be07e048e1e599ad46341c8d2a135645097a538221678b7acdd1b1919c6e1b21'),
  entry('base', 'Base', 'ggml-base.bin', 147_951_465, '60ed5bc3dd14eea856493d334349b405782ddcaf0028d4b5df4088345fba2efe'),
  entry('small', 'Small', 'ggml-small.bin', 487_601_967, '1be3a9b2063867b937e64e2ec7483364a79917e157fa98c5d94b5c1fffea987b'),
  entry('medium', 'Medium', 'ggml-medium.bin', 1_533_763_059, '6c14d5adee5f86394037b4e4e8b59f1673b6cee10e3cf0b11bbdbee79c156208')
];
