import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { createFakePluginHost } from "@zana-ai/zcc-plugin-sdk/testing";
import { readPluginManifest } from "@zana-ai/zcc-domain";
import plugin from "../server.js";

describe("antigravity plugin", () => {
  it("registers the antigravity provider with truthful capabilities", async () => {
    const { zcc, harness } = createFakePluginHost({
      pluginId: "provider-antigravity",
    });
    plugin(zcc);
    expect(harness.providers).toHaveLength(1);
    expect(harness.providers[0]).toMatchObject({
      id: "antigravity",
      displayName: "Antigravity",
      icon: "./icons/antigravity.svg",
      visibility: "installed",
      capabilities: {
        fork: "none",
        permissionModes: ["accept-edits", "full"],
        reasoningLevels: ["low", "medium", "high", "xhigh", "max"],
        supportsManualCompaction: false,
        supportsThreadArchive: false,
        supportsThreadRename: false,
      },
    });
    expect(
      harness.providers[0]?.models?.fallback?.filter((model) => model.isDefault),
    ).toHaveLength(1);
    await harness.dispose();
  });

  it.each([undefined, "", "  ", "C:\\tools\\agy.exe", "agy-dev"])(
    "derives the agy launch spec from settings: %s",
    async (executable) => {
      const { zcc, harness } = createFakePluginHost({
        pluginId: "provider-antigravity",
      });
      plugin(zcc);
      const result = harness.providers[0]?.deriveProviderOptions?.({
        projectId: "project",
        threadId: "thread",
        permissionMode: "full",
        settings: { executable, defaultModel: "", effort: "high" },
      });
      expect(result).toEqual({
        agyLaunchSpec: {
          command:
            typeof executable === "string" && executable.trim()
              ? executable.trim()
              : "agy",
          effort: "high",
        },
      });
      await harness.dispose();
    },
  );

  it("ships a host bridge artifact and icon", () => {
    const pkg = JSON.parse(
      readFileSync(new URL("../package.json", import.meta.url), "utf8"),
    );
    expect(readPluginManifest(pkg)).toMatchObject({
      hostEntry: "./host.ts",
      branding: { icon: "./icons/antigravity.svg" },
    });
    expect(
      readFileSync(new URL("../icons/antigravity.svg", import.meta.url), "utf8"),
    ).toContain("<svg");
    expect(
      readFileSync(new URL("../host.ts", import.meta.url), "utf8"),
    ).toContain("experimental_providerBridge");
  });
});
