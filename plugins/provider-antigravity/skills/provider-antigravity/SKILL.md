---
name: provider-antigravity
description: Run a thread on Google Antigravity with your Google Pro login. Use when the user asks about the Antigravity provider, its models, or its settings.
---

# Antigravity provider

Threads on provider `antigravity` run the `agy` CLI (logged in with a
Google Pro account), one `--print --output-format stream-json` process per
turn. No API key; the CLI inherits the user's login.

- Cheapest models: `gemini-3.8-flash-low`, then `-medium` / `-high`. Full
  catalog comes live from `agy models` (`gemini-4-argon-*`,
  `gemini-3.8-flash-*`, `claude-opus-5-5-*`, `claude-sonnet-5-5-*`,
  `gpt-oss-120b-medium`).
- Plugin settings (Plugins → Antigravity): `executable` (default `agy`),
  `defaultModel` (empty = agent default), `effort` (default `medium`).
- Threads may still pick model and effort per launch. `full` permission
  mode maps to `agy --dangerously-skip-permissions`.
- Limits (v0.1): no fork/rewind, no compaction, no archive/rename
  mirroring, no native approvals, attachments are noted in the prompt
  rather than sent.
