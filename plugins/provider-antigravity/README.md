# Antigravity provider for Zana Command Center

Run Zana threads on Google Antigravity with your **Google Pro** subscription.
The plugin drives the [`agy`](https://antigravity.google) CLI you already
use — logged in with your Google account — one `--print --output-format
stream-json` process per turn, resuming the same agy conversation across
turns. No API key, no token handling: the CLI inherits your login.

## Requirements

- `agy` on `PATH` (see **Agents settings** below for a custom location)
- `agy` logged in (`agy models` must list models)

## Install

From this directory (path install, live immediately):

```bash
zcc plugin install .
```

Backend edits: `zcc plugin reload provider-antigravity`.
To share: push this directory (or its own repo) and install with
`zcc plugin install git:<url>` / `npm:<package>`.

## Settings

| Key | Default | Meaning |
| --- | ------- | ------- |
| `executable` | `agy` | Command or absolute path to the agy binary |
| `defaultModel` | `` (agent default) | Value for `agy --model` (`agy models` lists ids) |
| `effort` | `medium` | Default `agy --effort` when the thread picks none |

Threads can still pick model (`gemini-4-argon-*`, `gemini-3.8-flash-*`,
`claude-opus-5-5-*`, …) and effort per launch; permission mode maps to
`agy --mode accept-edits|auto` (`full` uses
`--dangerously-skip-permissions`).

## Scope (v0.1)

- Text turns with streaming, usage reporting, stop/steer, model catalog,
  health + installation probes.
- Not yet: fork/rewind, archive/rename mirroring, native approvals,
  skill injection, image/file attachments (noted in the prompt instead).
