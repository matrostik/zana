import { createRequire as __createRequire } from "node:module";
import { dirname as __pathDirname } from "node:path";
import { fileURLToPath as __fileURLToPath } from "node:url";
const require = __createRequire(import.meta.url);
var __filename = __fileURLToPath(import.meta.url);
var __dirname = __pathDirname(__filename);

// server.ts
var ICON = "./icons/antigravity.svg";
var MODEL_EFFORTS = [
  { reasoningEffort: "low", description: "Low" },
  { reasoningEffort: "medium", description: "Medium" },
  { reasoningEffort: "high", description: "High" },
  { reasoningEffort: "xhigh", description: "Extra high" },
  { reasoningEffort: "max", description: "Maximum" }
];
function fallbackModel(id, displayName, isDefault) {
  return {
    id,
    displayName,
    description: `Antigravity model via agy (${id})`,
    supportedReasoningEfforts: MODEL_EFFORTS,
    defaultReasoningEffort: "medium",
    isDefault
  };
}
var FALLBACK_MODELS = [
  fallbackModel("gemini-4-argon-medium", "Gemini 4 Argon (Medium)", true),
  fallbackModel("gemini-4-argon-high", "Gemini 4 Argon (High)", false),
  fallbackModel("gemini-4-argon-low", "Gemini 4 Argon (Low)", false),
  fallbackModel("gemini-3.8-flash-medium", "Gemini 3.8 Flash (Medium)", false),
  fallbackModel("gemini-3.8-flash-high", "Gemini 3.8 Flash (High)", false),
  fallbackModel("gemini-3.8-flash-low", "Gemini 3.8 Flash (Low)", false),
  fallbackModel("claude-opus-5-5-medium", "Claude Opus 5.5 (Medium)", false),
  fallbackModel("claude-sonnet-5-5-medium", "Claude Sonnet 5.5 (Medium)", false),
  fallbackModel("gpt-oss-120b-medium", "GPT-OSS 120B (Medium)", false)
];
function stringSetting(value, fallback) {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback;
}
function plugin(zcc) {
  zcc.settings.define({
    executable: {
      type: "string",
      label: "Antigravity executable",
      description: "Command or absolute path to the agy binary (logged in with your Google Pro account).",
      default: "agy"
    },
    defaultModel: {
      type: "string",
      label: "Default model",
      description: "Model id passed as agy --model (empty uses the agent default). See `agy models`.",
      default: ""
    },
    effort: {
      type: "select",
      label: "Reasoning effort",
      description: "Default agy --effort when the thread picks none.",
      options: ["low", "medium", "high", "xhigh", "max"],
      default: "medium"
    }
  });
  zcc.agents.experimental_registerProvider({
    id: "antigravity",
    displayName: "Antigravity",
    icon: ICON,
    visibility: "installed",
    maintenance: { health: true, usage: false, installation: true },
    capabilities: {
      supportsServiceTier: false,
      supportsNativeUserQuestion: false,
      fork: "none",
      supportsManualCompaction: false,
      supportsThreadArchive: false,
      supportsThreadRename: false,
      supportsWorkflows: false,
      permissionModes: ["accept-edits", "full"],
      reasoningLevels: ["low", "medium", "high", "xhigh", "max"]
    },
    models: { scope: "host", fallback: FALLBACK_MODELS },
    composerActions: [],
    deriveProviderOptions(context) {
      const executable = stringSetting(context.settings.executable, "agy");
      const model = stringSetting(context.settings.defaultModel, "");
      const effort = stringSetting(context.settings.effort, "medium");
      return {
        agyLaunchSpec: {
          command: executable,
          ...model ? { model } : {},
          effort
        }
      };
    }
  });
}
export {
  plugin as default
};
