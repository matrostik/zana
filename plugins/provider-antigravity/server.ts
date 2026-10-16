import type { ZccPluginApi } from "@zana-ai/zcc-plugin-sdk";

const ICON = "./icons/antigravity.svg";

/** Mirrors PluginProviderFallbackModel (not re-exported from the SDK root). */
interface FallbackModel {
  id: string;
  displayName: string;
  description: string;
  supportedReasoningEfforts: {
    reasoningEffort: "low" | "medium" | "high" | "xhigh" | "max";
    description: string;
  }[];
  defaultReasoningEffort: "low" | "medium" | "high" | "xhigh" | "max";
  isDefault: boolean;
}

const MODEL_EFFORTS: FallbackModel["supportedReasoningEfforts"] = [
  { reasoningEffort: "low", description: "Low" },
  { reasoningEffort: "medium", description: "Medium" },
  { reasoningEffort: "high", description: "High" },
  { reasoningEffort: "xhigh", description: "Extra high" },
  { reasoningEffort: "max", description: "Maximum" },
];

function fallbackModel(
  id: string,
  displayName: string,
  isDefault: boolean,
): FallbackModel {
  return {
    id,
    displayName,
    description: `Antigravity model via agy (${id})`,
    supportedReasoningEfforts: MODEL_EFFORTS,
    defaultReasoningEffort: "medium",
    isDefault,
  };
}

/**
 * Fallback model catalog (host scope: `agy models` answers from the logged-in
 * account, ignoring cwd). Refreshed from a live `agy models` probe; the first
 * entry is the default. The bridge's `model/list` always replaces these.
 */
const FALLBACK_MODELS: FallbackModel[] = [
  fallbackModel("gemini-4-argon-medium", "Gemini 4 Argon (Medium)", true),
  fallbackModel("gemini-4-argon-high", "Gemini 4 Argon (High)", false),
  fallbackModel("gemini-4-argon-low", "Gemini 4 Argon (Low)", false),
  fallbackModel("gemini-3.8-flash-medium", "Gemini 3.8 Flash (Medium)", false),
  fallbackModel("gemini-3.8-flash-high", "Gemini 3.8 Flash (High)", false),
  fallbackModel("gemini-3.8-flash-low", "Gemini 3.8 Flash (Low)", false),
  fallbackModel("claude-opus-5-5-medium", "Claude Opus 5.5 (Medium)", false),
  fallbackModel("claude-sonnet-5-5-medium", "Claude Sonnet 5.5 (Medium)", false),
  fallbackModel("gpt-oss-120b-medium", "GPT-OSS 120B (Medium)", false),
];

function stringSetting(
  value: string | number | boolean | undefined,
  fallback: string,
): string {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : fallback;
}

/**
 * Antigravity thread provider (Google Pro via the `agy` CLI).
 *
 * The declaration is the only source of this provider: disabling the plugin
 * removes it. Execution is one `agy --print --output-format stream-json`
 * process per turn in the plugin's host bridge (`host.ts`); the CLI inherits
 * the user's Google login, so no token ever crosses the plugin boundary.
 */
export default function plugin(zcc: ZccPluginApi) {
  zcc.settings.define({
    executable: {
      type: "string",
      label: "Antigravity executable",
      description:
        "Command or absolute path to the agy binary (logged in with your Google Pro account).",
      default: "agy",
    },
    defaultModel: {
      type: "string",
      label: "Default model",
      description:
        "Model id passed as agy --model (empty uses the agent default). See `agy models`.",
      default: "",
    },
    effort: {
      type: "select",
      label: "Reasoning effort",
      description: "Default agy --effort when the thread picks none.",
      options: ["low", "medium", "high", "xhigh", "max"],
      default: "medium",
    },
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
      reasoningLevels: ["low", "medium", "high", "xhigh", "max"],
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
          ...(model ? { model } : {}),
          effort,
        },
      };
    },
  });
}
