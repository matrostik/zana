# File preview implementation: upstream #508 and #417

Branch: `fix/508-417-file-preview`. Base and current HEAD: `6a4c60869d2776d487a1ed894cf5ec4315ea8a72`; changes remain uncommitted. No push or TinyNod review was requested or performed. No verification hook was bypassed. TinyNod is opt-in and was not enabled in this checkout.

## Changes

- Browser-safe local-file URL parsing strips the extra slash before Windows drive letters, decodes once, and rejects unsupported authorities, encoded separators, malformed escapes and traversal. Direct Windows drive links survive Markdown URL sanitization and reach confined preview handling; unsupported file authorities do not become external links.
- Inline basenames no longer silently choose the most recent duplicate timeline hint. A thread-scoped resolution endpoint derives its checkout and host from authoritative records, tries the exact root file, then performs bounded exact-basename lookup only after a missing result. Explicit paths are confined without a basename search.
- Lookup allows at most 50 candidates, 2 concurrent requests per owning host, a 5-second budget and the existing 50,000-entry traversal cap. Unreadable or truncated traversal remains incomplete. Windows case equivalence is checked against the actual filesystem; returned path spelling is preserved. Existing listing exclusions remain in effect.
- Markdown links/chips show pending, failure or candidate-choice state, coalesce clicks and ignore results after scope changes. The server canonicalizes absolute and relative checkout paths before the existing preview tab/refresh mechanism; explicit paths do not trigger basename search. Server-owned artifact path identities remain consistent with tool-opened previews.
- Preview read failures retain their status/code. Missing or unavailable files show the requested path and authorized attempted absolute path, with a conditional generation hint and retry. Existing realpath checks, read caps, scope boundaries, successful-content retention and cancellation remain intact.
- `preview_file` retains its delivery acknowledgement contract. This change does not generate an absent report or run a generator.

## Verification

| Check | Result |
| --- | --- |
| `pnpm typecheck` | Passed after implementation. |
| Focused unit/DOM/API suites | 321 passed across 14 suites. |
| V8 coverage of selected preview implementation files | 86.92% statements, 83.48% branches, 94.87% functions, 90.74% lines. New click-handler and resolver modules both have 100% line coverage. |
| Built-Electron final combined run | **8 passed, exit 0** on Windows: all 6 recovery scenarios plus CLI MCP and Markdown resolution. Includes Windows file URL and direct drive link, untouched basename, keyboard duplicate choice, root-file precedence, absolute/relative tab reuse, generated-report retry and confined reads. |
| Final core guards | Rule 6 renderer literal and core/extension separation: 8 tests passed across 2 suites. |
| `pnpm verify:fast` | Failed in the broad changed-test selection: 126 suites failed, 1,206 passed, 5 skipped; 608 tests failed, 17,075 passed, 42 skipped; 12 errors. Typecheck passed; the chained guards were not reached. |
| Separate guard selection | 75 suites passed, 5 failed; 297 tests passed, 7 failed. |
| `git diff --check` | Passed. |

Focused logs and coverage are under `.zcc/preview-focused-final.log` and `.zcc/preview-coverage/`. These are local verification artifacts, not committed product files.

The broad gate includes failures outside the preview changes: POSIX path expectations on Windows, Unix-socket fixtures, process/worker failures, existing snapshot mismatches and source-text guards sensitive to checkout text. A targeted unchanged Claude transcript-path test reproduced a forward-slash regex failure against a Windows path. This establishes that example as unrelated to the preview changes; the entire broad failure set has not been independently baseline-audited.

Separate guard failures were the Salesforce SDK portability guard, SponsorNudge CSS mount guard, squad transport CSS guard, harness descriptor preload source-text guard and three worktree push-guard scenarios. These areas were not changed by this feature, apart from adding the required preview API placeholder to preload. The preload failure expects literal LF newlines in an existing descriptor block; that block's content was not changed.

Electron artifacts:

- Final run: `e2e/.artifacts/runs/1793168766293-38676-931fdfc6`, command log `.zcc/preview-e2e-verified.log`. All eight tests and teardown completed successfully.
- Command: `pnpm test:e2e -- e2e/markdown-file-preview-resolution.spec.ts e2e/agent-file-preview-recovery.spec.ts e2e/cli-agent-file-preview.spec.ts`.
- Earlier iterations exposed Windows POSIX-agent startup and fixture teardown problems. The Markdown fixture now seeds an idle thread and persisted assistant answer without starting an agent subprocess. An optional screenshot also timed out after all assertions; it was removed from the behavioral test. These fixture problems were corrected before the final passing run.
- An earlier successful screenshot, `e2e/.artifacts/runs/1793125264294-37148-7710f346/markdown-file-preview-reso-2c42f-s-preserve-authorized-reads/preview-resolution.png`, shows the generated report rendered in the panel.

## Limits and rollout

- Actual cross-OS remote execution was not available. Owning-root Windows/POSIX semantics and host routing have deterministic tests; real Windows local behavior was exercised in built Electron.
- The Windows CLI test exercises the existing session-scoped MCP and CLI panel using the app's isolated MCP port. Its POSIX fake-agent shell is not a Windows process-launch test. The POSIX branch still captures the agent-injected MCP URL.
- The standalone interactive mock could not be revealed because this session's in-app browser was unavailable. Its source is retained at `docs/plans/file-preview-mock.html`; the implemented interaction was tested in built Electron.
- The installed/running app was not replaced or restarted. Use an updated build to pick up the product changes.
- Generated plugin bundles and unrelated snapshot output from verification were restored; only scoped source, tests and documentation should remain changed.
- No agent lifecycle/catalog injection, BrowserView, packaged-plugin seam or other live-verification trigger was changed. Full CI and the broad local gate are not green.
