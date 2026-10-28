# Implementation plan: file previews (#508 and #417)

Date: 2026-10-27. Planning and research only; product fixes are not implemented.

Branch: `fix/508-417-file-preview`, created from freshly fetched `upstream/main` at `6a4c60869d2776d487a1ed894cf5ec4315ea8a72`. The original clean checkout was `main` at `05cf21273a63842c55efa78e614d6f53909d1dc0`.

## Scope and evidence

| Issue | Source review | Intended outcome |
| --- | --- | --- |
| [#508](https://github.com/salesforce/zana/issues/508) | `markdown-local-file.ts` decodes `URL.pathname`, leaving `/D:/…` for Windows file URLs. Unmatched inline basenames pass through, and multiple hinted matches silently select the latest. | Local file links decode correctly; a listed basename finds an eligible file in the owning checkout, or offers an explicit choice. |
| [#417](https://github.com/salesforce/zana/issues/417) | The issue says both report and generator were absent. Current conversation reads already use `environment.path`; PTY previews use the registered project. A wrong-cwd defect is unproven. | Existing relative reports open in the authoritative environment; absent reports show actionable diagnostics and recover after creation. |

Related findings:

- `preview-file.ts` acknowledges a delivered preview request without checking existence. Keep that delivery contract; do not introduce duplicate reads or asynchronous tool-call changes just to validate an open.
- `thread-host-file.ts` loses useful context by translating host `path_not_found` to `file not found`.
- `loadFilePreview` currently reduces structured API errors to a message, although `apiJson` preserves `status` and `code`.
- `resolveContainedReal` intentionally merges missing and escaped realpaths. Preserve this shared security contract; do not promise precise permission/escape diagnoses when the authority cannot establish them.
- Tab state already reuses identical kind/path and increments its refresh revision. Investigate path aliases and retain this behavior rather than replacing the tab system.
- [Earlier preview repairs](../agent-preview-review-2026-09-29.md) cover signal buffering, duplicate consumers, failed-read recovery, and refresh. Preserve their tests.

Primary documentation and detailed reasoning: [research note](../research/file-preview-508-417.md), [Node file URL conversion](https://nodejs.org/api/url.html#urlfileurltopathurl-options), [Node path semantics](https://nodejs.org/api/path.html#windows-vs-posix), [Electron security](https://www.electronjs.org/docs/latest/tutorial/security).

## Decisions

1. The server derives owner, host, checkout and storage scope from authoritative records. Renderer hints never authorize access. Relative paths refer to the recorded environment checkout, not the Electron process cwd or another machine's similarly named directory.
2. Explicit paths resolve exactly. For a bare name, a single distinct timeline hint is contextual evidence; multiple distinct matches require a choice. With no unique hint, try the exact root-relative file first, then bounded exact-basename lookup after a genuine missing result. A root file wins over an unhinted subdirectory file. A denied/unreadable/offline result never triggers search elsewhere.
3. A complete lookup with one eligible match opens it. Multiple matches show project-relative choices. Truncated/incomplete lookup never implies uniqueness, even when only one candidate is returned. Let users select a returned candidate or supply an explicit path; do not silently open the first match.
4. Lookup stays on the owning host and in the same source namespace. No HOME-wide search, machine selector, generated-script execution, or client-local fallback for thread files. Hidden/ignored directories follow existing listing exclusions; explicit authorized paths remain usable there.
5. `preview_file` success continues to mean the request reached the app, not that the file exists. The preview read supplies the file outcome. A missing-report hint is conditional: “If another step generates this file, run that step, then try again.” Never invent a generator.
6. File URL conversion is syntax handling, not access approval. Keep non-local file authorities rejected; this fix does not enable network-share URLs. Preserve permitted server-local artifact and thread-storage roots.

## Ordered implementation slices

### 1. Lock down regressions and path syntax

Files: `apps/app/src/components/markdown-local-file.ts` and its tests; `MarkdownContent.tsx`; relevant timeline presentation tests.

- Add failing cases for `file:///D:/Dev/code/project/docs/getting-started.md`, lowercase drives, localhost authority, POSIX paths, spaces, Unicode, percent-encoded `#`, fragments, malformed encoding, encoded separators, remote authorities and traversal attempts. Include direct Windows drive paths produced by agents.
- Use a narrow browser-safe file URL parser in the renderer: normalize only the file URL's leading slash before an absolute drive prefix, decode once, and reject malformed/unsupported inputs. Do not import `node:url` into renderer code. Compare supported cases against Node `fileURLToPath` in Node-side tests.
- Route local Markdown links and inline chips through consistent syntax normalization. Keep ordinary HTTP links and fenced code behavior intact. Preserve existing line-number behavior; avoid adding unrelated fragment syntax in this fix.
- Extract unique basename candidates rather than returning the last duplicate hint. De-duplicate equivalent hints before deciding ambiguity. Keep explicit paths unchanged by basename heuristics.

Acceptance: a Windows URL becomes a valid drive path, not `/D:/…`; ambiguous hints never silently select an unrelated file.

### 2. Add scoped, bounded filename resolution

Files: new `apps/server/src/services/threads/thread-preview-resolution.ts` and tests; thread routing in `apps/server/src/http/product-api.ts`; `apps/app/src/lib/product-client.ts`; corresponding server/client contracts and API tests.

- Add a narrow thread preview resolution endpoint, proposed `POST /api/v1/threads/:id/preview-path/resolve`. Inputs: requested token and, for CLI panels, project identity; optional bounded path candidates are untrusted hints. Derive conversation project/host/environment from the row. Reuse the existing CLI-owner project authorization rules; never let a supplied project override a conversation row.
- Return a discriminated result: `resolved` with canonical source/path, `ambiguous` with bounded candidates, `not_found`, or `incomplete`. Invalid scope, unavailable host/environment and denied access remain typed failures. Cap path length, candidate count and request body through existing contract conventions.
- Reuse `host.list_paths` against the **thread environment root**, not `listProjectPaths` blindly: a project root may differ from its thread checkout. Request files only; filter results to exact basename equality, never fuzzy score. Carry `truncated` through unchanged.
- Existing `listHostPaths` has a visit cap, excluded directories and symlink skipping, but catches directory-read failures. Before automatic unique selection, make incomplete traversal observable: mark such lookup incomplete or use a narrow bounded resolver that does. Do not treat skipped unreadable subtrees as proof of uniqueness. Preserve existing listing callers' compatibility.
- Start with at most 50 returned candidates, existing traversal cap, a 5-second resolution budget and at most 2 in-flight lookups per owning host. Match RPC timeout/cancellation facilities; stop host work on its own deadline even if transport cancellation is unavailable. No persistent index/cache is needed for this repair.
- Resolve case equivalence using the owning filesystem's established semantics; never globally lowercase paths. Use authoritative-root Windows/POSIX semantics in confinement where server and host platforms differ, with focused regression cases before changing shared callers.
- Final reads still enforce realpath containment and byte caps. Revalidate every selected candidate; exclude symlink/junction escapes, including replacements between lookup and read.

Acceptance: an untouched `docs/getting-started.md` can be found by basename within its thread checkout; duplicates, lookup caps and offline hosts never produce a guessed file.

### 3. Connect clicks and preserve preview identity

Files: `MarkdownContent.tsx`; `secondary-panel/useThreadOpenFileSignal.ts`; `threadSecondaryPanelState.ts` and tests; preview-path client helper and DOM tests.

- Resolve unresolved/ambiguous basename clicks asynchronously before dispatching the final file-open intent. Explicit paths retain the direct open flow. Keep renderer synchronous Markdown rendering free of host scans.
- Show pending/error/choice state for the clicked item; allow keyboard selection and retry. Coalesce rapid identical clicks, ignore stale responses after scope changes, and release request resources on unmount.
- Feed the authoritative normalized path into existing tab reuse. Keep owner/source separation, line jumps, explicit refresh revisions and server tab echoes. Test repeated identical requests and `./docs/report.md` aliases. Do not merge different project, environment or storage scopes.
- Before substantial choice UI work, show a small clickable Current/Proposed mock in the in-app browser, per root product-design rules. Exercise duplicate selection and missing-file retry; continue implementation within existing authorization.

Acceptance: choosing a candidate opens that file; repeated opens refresh one scoped tab; unrelated previews and scroll position retain existing behavior.

### 4. Make read failures actionable

Files: `thread-host-file.ts`; `threadSecondaryPanelLogic.ts`; `ThreadFilePreviewTab.tsx`; preview API error mapping/contracts and tests.

- Preserve typed error codes/status through the preview loader instead of flattening them immediately. Handle legacy string-only failures compatibly.
- For authorized missing paths, show the requested path and attempted absolute path derived from the registered root, plus the correct source context. For remote paths, identify the existing project/environment context without adding a Machine selector. Never disclose arbitrary out-of-scope resolved paths.
- Distinguish confirmed missing file, unavailable host/environment, explicitly reported unreadable file, out-of-scope/invalid request and size cap. When the underlying helper cannot distinguish missing from inaccessible, use honest neutral copy rather than manufacturing a diagnosis.
- Keep Try again. Create a missing report after the first failure and verify retry succeeds in the same tab. Preserve cancellation, retained successful content on refresh failure, and subsequent-file recovery.
- Do not change shared path-confine semantics globally or add tool preflight reads. Change host error classification only where covered tests establish the distinction safely.

Acceptance: `output/review-report.md` either renders from the recorded checkout or explains the authorized attempted location and next action; no claim that Zana generated an absent file.

### 5. Verify the complete boundary

Extend `e2e/agent-file-preview-recovery.spec.ts` and `e2e/cli-agent-file-preview.spec.ts`; add a focused `e2e/markdown-file-preview-resolution.spec.ts` for actual Markdown chip/link clicks. Use fake-provider fixtures and isolated homes; avoid network-dependent agent output.

Required scenarios:

- Windows drive file URL rendered in an assistant message, clicked through to displayed file content. Run on Windows; do not count a platform skip as verification.
- POSIX paths and a host whose filesystem semantics differ from the viewer/server. Cover authority routing with deterministic server/host tests and a remote-host integration fixture where available; state any untested runtime combinations.
- Listing untouched files in `docs/`, unique basename, root-vs-subdirectory precedence, duplicate hints and duplicate checkout matches, truncated/unreadable lookup, rapid clicks, host offline.
- Exact relative report, missing report with path diagnostics, create then retry, repeated open count, source isolation and same path text in different owners.
- Traversal, outside absolute path, symlink/junction escape, malicious candidate hints and incorrect project identity all fail without leaking outside content.
- Existing Markdown/image/PDF/HTML paths, CLI MCP and conversation previews, background buffering, refresh and split-pane recovery remain intact.

Commands after implementation:

```sh
pnpm exec vitest run apps/app/src/components/markdown-local-file.test.ts apps/app/src/components/thread/timeline/timeline-presentation.test.tsx apps/app/src/components/thread/secondary-panel/threadSecondaryPanelLogic.test.ts apps/app/src/components/thread/secondary-panel/threadSecondaryPanelState.test.ts apps/app/src/components/thread/secondary-panel/ThreadFilePreviewTab.dom.test.tsx apps/server/src/services/threads/preview-file.test.ts apps/server/src/services/threads/thread-host-file.test.ts apps/server/src/services/threads/thread-preview-resolution.test.ts
pnpm verify:fast
pnpm test:e2e -- e2e/markdown-file-preview-resolution.spec.ts e2e/agent-file-preview-recovery.spec.ts e2e/cli-agent-file-preview.spec.ts
```

Also run focused host listing, endpoint, contract and client tests for files actually changed. Collect V8 coverage with explicit changed implementation includes and require at least 80%, covering failure paths; aggregate suite pass counts alone do not satisfy coverage. Use [native runtime isolation](../native-runtime-isolation.md): no direct electron-vite build or installed SQLite ABI replacement.

[Live verification triggers](../live-zana-verification.md) were reviewed. This scoped plan does not change agent lifecycle/catalog injection, BrowserView, or other listed trigger surfaces. If implementation changes plugin session instructions/tool packing, run `pnpm live:mode-reasoning` then `pnpm live:memory`; if it changes BrowserView behavior, also run `pnpm live:browser`. Check real prerequisites and report skips honestly.

## Completion and reporting

- Keep slices independently reviewable: URL/parser regression; scoped resolver/contracts; click/choice integration; diagnostic propagation; E2E coverage. Add regression tests before each behavior change.
- No new package dependencies, persistent store, preference or machine-selection UI is expected.
- Document listing limits and explicit-path fallback. Record upstream issue links and attach Windows evidence when opening a PR.
- Before push, use repository pre-push verification. TinyNod remains opt-in; report base/head, checks run and actual review/skip reason. Do not claim TinyNod review from a skip or timeout.

## Work completed for this plan

- Retrieved both open upstream issues and comments via GitHub CLI; neither had comments at review time.
- Fetched upstream and created the branch above. Read root/renderer instructions, relevant preview source/tests, prior repair report, live-verification guide and native-runtime guide.
- Researched primary Node/Electron documentation in the linked note.
- Baseline command: six existing preview suites (`markdown-local-file`, `threadSecondaryPanelLogic`, `threadSecondaryPanelState`, `ThreadFilePreviewTab.dom`, `preview-file`, `thread-host-file`): **139 tests passed**, exit 0. Existing Vite/Node warnings and happy-dom disabled-iframe messages appeared.
- Product code unchanged. No new regression tests, coverage run, built-Electron E2E, full verification, TinyNod review, commit or push performed. Those remain implementation-stage work.
