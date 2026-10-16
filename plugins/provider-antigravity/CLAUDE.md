# provider-antigravity plugin

This is a Zana Command Center plugin. The manifest lives in `package.json` → `zcc`.
Id: `provider-antigravity`.

## Loop

```bash
zcc plugin install .
```

After install the plugin is live. Then, only as needed:

- Backend edits: `zcc plugin reload provider-antigravity` (`zcc plugin dev` optional).
- UI (`zcc.app`) edits: `zcc plugin dev` (watch) or `zcc plugin build` then `reload`.
- Compile check: `zcc plugin build` (no running app).

`zcc plugin dev` is an optional watch loop **after** a path install. It is not required to create or run a plugin. Path installs load `server.ts` from source. A failed rebuild keeps the last good generation. Plugins are full-trust in-process on the server after install. Do not request host-daemon tokens.
Fill the host panel slot (`height: 100%`). Skills live in `skills/<name>/SKILL.md`.
MCP servers belong in `zcc.mcpServers`. Author against `@zana-ai/zcc-plugin-sdk` (`definePluginApp`, `ZccPluginApi`).

This starter has no app slot — add `zcc.app` if you need a panel.
The server factory default-exports `(zcc) => { … }` and registers `zcc.rpc` methods the panel can call after a reload.

## Verify in running ZCC

Follow `LIVE_TEST.md` before claiming completion. Use `zcc plugin dev --once`
for an agent-controlled rebuild and reload without a background watcher.
A successful command checks backend health; it does not prove the UI rendered.
Exercise the contributed CLI or RPC in the running app and verify its result after reloading.
Report what you observed and any blocked checks. Do not claim live verification from unit tests alone.
