# File preview repair: upstream issues #508 and #417

Date: 2026-10-28. Status: implementation in progress on `fix/508-417-file-preview-upstream`; Windows focused checks pass. Cross-platform CI evidence remains pending.

## Checkout and provenance

- Started on clean `main` at `3e2d980a9cb099a143715006ce0819a1c364b0b1`.
- Fetched both remotes and pulled `upstream/main` with `--ff-only` **before** creating this branch. The pull brought in 37 commits. Origin and upstream matched at research time.
- Planning branch: `plan/508-417-file-preview`; base/HEAD: `431bff20c03d8eaa2006cd2cd68f3ace78b5e17a`.
- Preserved existing `fix/508-417-file-preview`, headed by `4f5639202963b8a06d4d95f80b37dd52dc894654`. Its preview implementation is commit `dee932e84857a9c44d5fa5911a2ea76a55c78f3c`, based on `6a4c60869d2776d487a1ed894cf5ec4315ea8a72`. It was inspected as prior work, not applied or treated as verified on the new base.

## Issue review and evidence

Both upstream issues were open with no comments when retrieved through `gh issue view --repo salesforce/zana`.

| Issue | Evidence in current upstream source | Assessment |
| --- | --- | --- |
| [#508: chips/links cannot open files](https://github.com/salesforce/zana/issues/508) | [`parseLocalFileMarkdownHref`](../../apps/app/src/components/markdown-local-file.ts) decodes `URL.pathname` without removing the slash before a Windows drive. `resolveThreadFilePreviewPath` passes unmatched bare names unchanged and selects the last matching timeline hint when several exist. [`MarkdownContent`](../../apps/app/src/components/MarkdownContent.tsx) dispatches these paths directly. | Confirmed source-level path conversion and resolution gaps. Add a failing built-app reproduction before changing behavior. |
| [#417: relative report shows file not found](https://github.com/salesforce/zana/issues/417) | [`readThreadHostFile`](../../apps/server/src/services/threads/thread-host-file.ts) already uses the conversation environment's recorded path/host; CLI panels use a registered project. The issue itself says neither report nor generator existed when checked. Host missing errors become generic `file not found`; the preview loader reduces errors to strings. | A wrong-cwd bug is unproven. Verify existing files in an environment distinct from project root. Improve diagnostics and retry for truly missing files. |

[`openThreadFilePreview`](../../apps/server/src/services/threads/preview-file.ts) validates an open intent and emits it; success is delivery, not proof that a file exists or was viewed. Keep that contract. Existing [preview repair notes](../agent-preview-review-2026-09-29.md) explain buffering, cancellation, refresh revisions and tab reuse that must remain intact.

Primary documentation findings: [Node, URL, Electron and filesystem research](../research/issues-508-417-primary-sources.md). Repository authority: [root instructions](../../AGENTS.md), [renderer coupling](../../apps/app/AGENTS.md), [host coupling](../../apps/host-daemon/AGENTS.md), [native runtime isolation](../native-runtime-isolation.md), [live verification triggers](../live-zana-verification.md), and [shipped preview guidance](../../apps/server/src/plugins/builtin-skills/zcc-preview/SKILL.md).

## Recommended behavior

1. **Normalize syntax without granting access.** Support ordinary POSIX paths, absolute Windows drive paths, and local `file:` URLs. Use browser-safe parsing in the renderer; no Node import there. Decode URL paths once, preserve encoded filename characters, and reject malformed escapes, NULs, encoded separators and unsupported network authorities. Normalize the drive slash only for an absolute drive prefix. Check raw URL traversal before URL normalization loses it. Do not reinterpret URL encoding in ordinary filesystem path strings.
2. **Resolve within the owning scope.** Conversation host/environment comes from authoritative rows. Caller hints never authorize access or override that scope. Keep workspace, thread-storage and existing server-owned artifact namespaces distinct. No local-client fallback for thread files, HOME search, machine selector, or generator execution.
3. **Explicit paths are exact.** `output/review-report.md` must not fall back to an unrelated `review-report.md`. Bare tokens may use unique, confined, existing timeline hints as context; duplicate hints require an explicit choice. With no usable hint, check the exact root file, then perform bounded exact-basename discovery only after a confirmed missing result. An unreadable/offline/invalid result does not trigger searching elsewhere. A stale single hint falls back to the normal bare-token flow only after confirmed absence.
4. **Never infer uniqueness from incomplete results.** A complete search returning one eligible file opens it. Multiple matches show relative path choices. A timeout, cap or unreadable searched subtree returns an incomplete result even with zero or one candidate. Offer returned choices and an explicit-path fallback. Uniqueness refers only to the existing listing policy's searchable set; hidden/excluded paths remain available through exact authorized paths.
5. **Errors explain the attempted action.** Show the requested path, source context and authorized attempted location when available. Preserve machine-readable status/code. Distinguish established missing, invalid/outside-scope, unavailable environment/host and read-cap errors. Use neutral wording where shared realpath helpers intentionally merge missing, inaccessible and escaped paths. Keep retry and retained successful content on refresh failures. Conditional hint: “If another step generates this file, run that step, then try again.”
6. **Reuse existing preview tabs.** Normalize syntactic aliases inside the same owner/source before dispatching the tab identity; preserve refresh revision, line selection and scroll behavior. Do not merge tabs across owners or sources. Avoid broad realpath identity changes that would alter symlink behavior.

## Operating-system coverage

This plan covers **Windows, macOS and Linux**. Distinguish released desktop targets from execution-host and CI support: [getting started](../getting-started.md) lists macOS Apple Silicon/Intel and Windows x64, while Linux desktop is forthcoming. The [release workflow](../../.github/workflows/release.yml) builds macOS arm64/x64 and Windows x64. [Electron CI](../../.github/workflows/ci.yml) runs on Ubuntu, the [desktop build configuration](../../apps/desktop/electron-builder.yml) contains Linux packaging, and [multi-machine documentation](../multiple-devices.md) supports macOS/Linux execution-host installation. Linux compatibility is required; this repair must not imply a new Linux desktop release or expand remote CLI/Squad capabilities.

| Target | Required behavior and filesystem cases | Required evidence after implementation |
| --- | --- | --- |
| Windows x64 desktop | Drive-letter file URLs, raw drive paths with either separator, same/different drive confinement, drive-relative `C:report.md` rejection, case-preserving lookup, case-sensitive directory behavior, junction/symlink escapes, and path aliases. Unsupported UNC URL authorities stay rejected; do not broaden network-share access. | Focused unit/DOM/API/host suites and the built-Electron preview suites on Windows. Use a junction fixture where ordinary symlink creation lacks permission; do not skip containment coverage wholesale. |
| macOS arm64 desktop | POSIX absolute/relative paths and `file:///Users/...`; spaces and encoded filename characters; case sensitivity according to the actual volume; Unicode filename spelling; symlink escapes and physical temporary-root aliases. | Focused suites and built-Electron preview suites on an Apple Silicon runner with native dependencies prepared for that architecture. |
| macOS x64 desktop | The same functional cases as arm64, using the Intel build and native runtime. | Focused suites and built-Electron preview suites on an Intel runner. Apple Silicon results do not count as Intel runtime verification. |
| Linux CI and execution host | POSIX paths and `file:///home/...`; distinct `Report.md`/`report.md`; legal literal backslashes/colons in filenames; symlink escapes; unreadable-directory/incomplete-search behavior. Do not apply Windows separator/case rules to Linux paths. | Focused suites, built-Electron preview suites under the existing Xvfb setup, and a Linux-host file read/lookup through the authorized thread scope. |

Rules across all targets:

- Treat path **syntax** and filesystem **identity** separately. Root/host authority selects Windows/POSIX syntax; the owning filesystem establishes case equivalence. Do not assume every Windows/macOS volume is case-insensitive or collapse different POSIX filenames by lowercasing.
- Preserve Unicode returned by the owning filesystem. Test composed/decomposed names where the volume permits them; do not impose renderer-side Unicode normalization as an identity rule. Keep encoded URL characters distinct from literal characters in raw paths, including `%`, `#` and spaces.
- The Windows drive-slash repair must not corrupt valid POSIX filenames. Interpret backslashes as separators only for an authoritative Windows path; a backslash can be a filename character on POSIX. Reject incompatible absolute path flavors rather than resolving them against the server's current drive/directory.
- Keep registered UNC filesystem-root handling at its existing authorization level; rejection of non-local `file://server/...` URLs is a separate rule. Test supported registered-root confinement and unsupported URL authority rejection independently. No new device-path, drive-relative, alternate-stream or network-root access is introduced.
- Use temporary roots from `realpath`, portable Node fixture setup, and OS-aware absolute-path expectations. Avoid `/tmp` assumptions, `/bin/sh`-only fake agents, shell-specific quoting, and hard-coded drive letters. Preserve the session-scoped MCP-to-preview flow on Windows with a portable fixture.
- Permission tests must assert actual filesystem denial before using it as evidence. An elevated Linux runner or Windows ACL behavior can invalidate a `chmod` fixture. Cover denial deterministically everywhere and record the real-permission fixture's applicability; do not classify a skipped test as a passing OS check.

Cross-OS routing matrix: parameterize deterministic server/contract tests over all nine Windows/macOS/Linux server-to-owner combinations, plus a viewer with a different OS from the owner. The same relative path must reach the recorded host and environment; the viewer/server process cwd must never decide it. Include at least Windows-to-Linux and macOS/Linux-to-Windows root-flavor mismatches. Exercise actual supported remote configurations where available (especially desktop-to-Linux and desktop-to-macOS execution hosts); hypothetical pairings in deterministic tests do not establish remote product support. Report actual runtime combinations separately.

The implementation is complete only when all released desktop targets and Linux CI compatibility have passing evidence. If an OS/architecture runner or remote integration environment is unavailable, leave that row explicitly unverified; local Windows success is not cross-platform sign-off.

## Ordered implementation slices

### 1. Reproduce and repair path conversion

Touch `markdown-local-file.ts`, its tests, `MarkdownContent.tsx` and Markdown DOM tests.

- Add failing cases for Windows `file:///D:/...`, lowercase drives, localhost authority, direct drive links, POSIX paths, Unicode, spaces, `%23`, `%25`, fragments, malformed escapes, encoded slash/backslash, non-local authority and traversal.
- Cover React Markdown's URL transform: direct Windows links must survive sanitization only when recognized as supported local paths. Unsupported local schemes must not fall through to an external opener.
- Keep HTTP links, fenced code and existing line behavior intact. Compare supported file-URL conversions against Node's documented `fileURLToPath` behavior in Node-side tests.
- Replace “last hint wins” with distinct candidate collection. Normalization for hint equality must not globally lowercase paths.

Acceptance: the real Windows chip/link click yields a drive path inside the authorized project, and duplicate hints never silently choose the last file.

### 2. Add a narrow server-owned resolver

Touch a new thread preview resolver, `product-api.ts`, `product-client.ts`, server/desktop API contracts and focused API tests. Add optional exact-name/deadline support to host listing only if needed, preserving existing callers.

- Proposed endpoint: `POST /api/v1/threads/:id/preview-path/resolve`. Accept requested token, optional bounded hints and CLI project identity. Do not accept a caller-owned root or host. Reuse existing authorization patterns without broadening CLI project access.
- Return discriminated results: `resolved {source, path}`, `ambiguous {candidates}`, `not_found`, `incomplete {candidates}`. Invalid requests and unavailable scopes stay typed failures. Reject excess request/path/hint sizes through shared schemas.
- Derive root and host once from the same authority as preview reads. Do not call project-root listing for a linked-worktree thread: its environment may be elsewhere.
- Use `host.list_paths` only with exact basename matching; its current `query` behavior is fuzzy and cannot establish a match. Preserve listing exclusions and symlink skipping. Mark unreadable traversal incomplete.
- Initial limits: 50 returned matches/hints, existing 50,000-entry visit cap, five-second total lookup budget and two concurrent requests per owning host. Pass the remaining deadline to the host; transport timeout alone must not leave an unbounded scan. Release counters on every exit and avoid an unbounded persistent map/cache.
- Keep collection and per-directory work bounded. Prefer streaming directory enumeration for exact-name mode so a huge directory does not allocate an unbounded `readdir` array before applying the visit cap. Gather matches while walking rather than retaining all visited files.
- Determine path syntax from the authoritative root/host, using `path.win32` or `path.posix` where server and host differ. Do not change every shared path helper speculatively; test affected callers and Windows/POSIX root checks together.
- Candidate discovery and metadata checks are advisory. Final host reads retain realpath containment and byte caps, including symlink/junction replacement between search and read.

Acceptance: an untouched `docs/getting-started.md` is found by basename in the correct checkout; duplicates and incomplete scans produce a choice or explicit-path guidance.

### 3. Connect asynchronous clicks and candidate choice

Touch a small Markdown file-link component/helper, `MarkdownContent.tsx`, client API and secondary-panel identity code only where necessary.

- Keep scans out of rendering. On click, display pending state, resolve, then dispatch the authorized normalized path through the existing open-file signal.
- Show a compact keyboard-accessible choice list with full relative paths. Include retry and incomplete-search feedback. Coalesce repeated clicks and ignore stale responses after thread/project/source changes or unmount.
- Show a realistic clickable Current/Proposed mock early in this implementation slice, following root product guidance and the available UI-proposals skill. Exercise ambiguity and missing-file retry. This is an exploration step within authorized work, not an automatic approval gate.
- Preserve explicit open behavior, source ownership, tab refresh and plugin opener selection. Verify relative/absolute aliases reuse the same tab where their source identity is equivalent.

Acceptance: a choice opens the selected file, rapid clicks do not duplicate requests/tabs, and an old result never opens into another thread.

### 4. Carry useful diagnostics through the read path

Touch `thread-host-file.ts`, preview API error mapping, `threadSecondaryPanelLogic.ts`, `ThreadFilePreviewTab.tsx` and tests.

- Preserve status/code through the loader while supporting older string-only failures. Attach an attempted location only after scope authorization; never echo an arbitrary outside resolved path.
- Show missing report context and retry without adding tool preflight reads or promising precise permission errors the underlying authority cannot establish.
- Test a genuine missing file, create it in the recorded environment, retry in the same tab and display it. Also test subsequent-file recovery and successful-content retention after refresh failure.

Acceptance: #417's existing relative report opens correctly; an absent report has truthful diagnostics and recovers after creation.

### 5. Verify at the built Electron boundary

- Extend `e2e/cli-agent-file-preview.spec.ts` and `e2e/agent-file-preview-recovery.spec.ts`; add `e2e/markdown-file-preview-resolution.spec.ts` for real assistant-message chip/link clicks.
- Required: Windows file URL and direct drive link; untouched basename; duplicate hints and filesystem matches; stale hint; root-file precedence without hints; incomplete search; exact missing report and retry; relative/absolute tab reuse; same path in distinct owners/sources; linked-worktree authority; traversal and symlink/junction escape; forged scope; host unavailable; stale request cleanup.
- Exercise conversation and session-scoped MCP preview opens through IPC/API/UI, using isolated fixture homes. Keep fixtures cross-platform. Preserve image, HTML, PDF and attachment/artifact behavior with relevant existing suites.
- Execute the operating-system matrix above, including both macOS architectures and Linux CI. Deterministic cross-OS routing tests are required. Real remote-host execution should be exercised where available; report unavailable platform combinations explicitly. A platform skip is not verification.

## Review of prior implementation

Commit `dee932e8` contains reusable parser, resolver, choice UI, diagnostics and E2E work. Review and port coherent slices against this base rather than restoring its old tree, which would drop newer upstream changes.

Points requiring fresh checks:

- Its resolver returns a sole renderer hint before checking existence. This can preserve stale-hint failures; the new plan requires a confirmed-missing fallback and tests.
- Shared `thread-path-confine` changes select root syntax, but surrounding callers still contain native-OS `isAbsolute` checks. Cross-host support must be tested end to end, not inferred from the helper alone.
- Exact-name listing adds deadlines but still materializes directory arrays/all walked paths. Enforce bounded memory and completion semantics at the actual walk.
- It includes an unrelated Windows pnpm-shim commit; keep that separate from the preview repair unless independently necessary.
- Its checked-in implementation report records passing focused/Electron checks but a failing broad gate. Those are historical claims on another head, not evidence for this checkout. Do not inherit its coverage or pass counts.

## Verification commands and completion gates

After each slice, run the touched unit/DOM/API suites, adding behavioral regression cases before fixes. The initial focused selection is:

```sh
pnpm exec vitest run apps/app/src/components/markdown-local-file.test.ts apps/app/src/components/thread/secondary-panel/threadSecondaryPanelLogic.test.ts apps/app/src/components/thread/secondary-panel/threadSecondaryPanelState.test.ts apps/app/src/components/thread/secondary-panel/ThreadFilePreviewTab.dom.test.tsx apps/server/src/services/threads/preview-file.test.ts apps/server/src/services/threads/thread-host-file.test.ts
```

Add resolver, host-fs, client, API and Markdown link suites as they are changed. Run V8 coverage with those files explicitly included and require at least 80% coverage of modified code, covering failure branches. Then:

```sh
pnpm test:e2e -- e2e/markdown-file-preview-resolution.spec.ts e2e/agent-file-preview-recovery.spec.ts e2e/cli-agent-file-preview.spec.ts
pnpm test:e2e -- e2e/markdown-image-preview.spec.ts e2e/html-file-preview.spec.ts e2e/pdf-file-preview.spec.ts
pnpm verify:fast
git diff --check
```

Run the focused and Electron commands on Windows x64, macOS arm64, macOS x64 and Linux, using the repository-supported Node/pnpm/native-runtime setup per runner. Linux Electron commands require the CI display environment, e.g. `xvfb-run -a pnpm test:e2e -- e2e/markdown-file-preview-resolution.spec.ts e2e/agent-file-preview-recovery.spec.ts e2e/cli-agent-file-preview.spec.ts`. Add a focused preview verification matrix (or equivalent existing jobs) for `windows-2025`, `macos-15`, `macos-15-intel` and `ubuntu-latest`; preserve existing affected-test selection/sharding and ensure it selects the new resolver/Markdown preview spec. Ubuntu-only CI currently cannot establish Windows/macOS correctness. Keep platform-specific cases conditional while common regressions execute on every runner. Retain per-run platform/architecture, commit, test results and artifacts in the verification report.

Use private builds through the wrapper. Never run electron-vite directly, replace installed SQLite binaries, modify the user's real config, or clear another E2E run. Read live-verification triggers again if scope expands: launch/catalog injection requires `pnpm live:mode-reasoning` then `pnpm live:memory`; BrowserView changes require `pnpm live:browser`; packaged plugin changes require the documented packaged-provider E2E. The planned preview-only repair does not itself require those unrelated changes.

Before push, run repository hooks and report actual results. Diagnose any failures and reproduce suspected baseline failures on an isolated base before calling them unrelated. Full CI remains merge authority. TinyNod stays opt-in; do not describe skipped/failed review as clean.

## Work performed

- Retrieved both upstream issues, updated the checkout, reviewed current preview source, nearby tests, repository guidance and the prior local implementation; researched primary documentation.
- Follow-up OS review checked getting-started/multi-machine documentation, release targets, Linux packaging and Ubuntu Electron CI. Added explicit Windows x64, macOS arm64/x64, Linux and cross-host coverage requirements. No additional runtime tests were run for this documentation update.
- Baseline focused command above: **6 suites / 139 tests passed**, exit 0 on Windows. Vite/Node warnings and happy-dom disabled-iframe messages appeared; the test runner reported no failing tests.
- Implemented URL/path normalization and duplicate-hint handling in `markdown-local-file.ts`; added bounded, exact-basename search to the owning host-daemon and root-flavor path confinement for remote Windows/Linux hosts.
- Added the `preview-path/resolve` contract, scoped product API, thread/environment host resolver, ambiguity/incomplete UI choices, and actionable missing-file diagnostics. No local filesystem fallback or content-generator execution was added.
- Added unit/DOM regressions across the parser, resolver, host walk, confinement and contract. Latest focused Vitest run: **9 suites / 130 tests passed**. Renderer literal guard: **1 test passed**. `pnpm typecheck` passed.
- Targeted V8 coverage across the changed parser, link component, resolver, confinement and host filesystem code: **84.32% statements, 78.83% branches, 92% functions, 88.75% lines**. Each included changed source file met 80% statement coverage (the exact-basename host walker measured 81.68%).
- Added and ran `e2e/thread-file-preview-ambiguity.spec.ts` through `pnpm test:e2e -- e2e/thread-file-preview-ambiguity.spec.ts`: **1 built-Electron test passed** on Windows x64. This exercises duplicate selection through the product API and actual project filesystem.
- `pnpm verify:fast` typecheck passed, but its changed-test sweep failed: **45 files failed, 731 passed, 1 skipped; 148 tests failed, 8,329 passed, 4 skipped, plus one uncaught error**. The output includes Windows-incompatible `spawn sh ENOENT`, filesystem permission failures and unrelated suites. The source-guard phase did not run because the changed-test phase failed. Focused suites and the relevant source guard were run separately and passed. Investigate/reproduce any failures on the base before treating the broad gate as a baseline issue.
- `git diff --check` passed for the changed source/package paths. Generated plugin build outputs were restored after the E2E build.
- OS status: Windows x64 implementation and built-Electron regression were executed. Added a required CI preview regression matrix for `windows-2025`, `macos-15` (arm64), `macos-15-intel` (x64) and `ubuntu-latest`; its remote jobs have not run yet. macOS and Linux evidence therefore remains pending before claiming all-platform verification.
- No commit or push was performed. TinyNod was not run; no hook was bypassed.
