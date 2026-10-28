# File preview research: upstream #508 and #417

Research date: 2026-10-27. Scope: current checkout source review and primary documentation; no product changes or runtime verification.

## Evidence and limits

- [Upstream #508](https://github.com/salesforce/zana/issues/508) reports broken inline filename chips and Windows `file:///D:/...` links. In the current checkout, [`parseLocalFileMarkdownHref`](../../apps/app/src/components/markdown-local-file.ts) reads and decodes `URL.pathname`, retaining `/D:/...`. Its filename resolver selects the latest matching basename from hints, or returns an unmatched basename unchanged. Consequently it cannot infer `docs/getting-started.md` from `getting-started.md` without additional evidence. This is confirmed by inspection; the issue's exact end-to-end Windows error has not been reproduced here.
- [`TimelineRows`](../../apps/app/src/components/thread/timeline/TimelineRows.tsx) obtains hints from supplied props or `collectTimelineFilePreviewPaths(rows)`. Do not assume the issue's statement that hints contain only the active turn is universally true without checking each caller and archive behavior.
- [Upstream #417](https://github.com/salesforce/zana/issues/417) explicitly says the report and generator were absent when checked. A cwd-resolution bug is a hypothesis, not established. [`readThreadHostFile`](../../apps/server/src/services/threads/thread-host-file.ts) currently resolves conversation-relative paths against the authoritative environment path; PTY preview owners use the registered project path. [`openThreadFilePreview`](../../apps/server/src/services/threads/preview-file.ts) confines lexically and emits a signal without checking existence. Tool success therefore establishes delivery, not file readability.
- [`ThreadFilePreviewView`](../../apps/app/src/components/thread/secondary-panel/ThreadFilePreviewTab.tsx) shows a generic heading and error string, with retry. The backend currently collapses host `path_not_found` into `file not found`.
- [`resolveContainedReal`](../../packages/path-confine/src/index.ts) returns null for both missing files and realpath escapes. Do not globally change that helper merely to distinguish preview errors; its conservative behavior is shared security policy.

## Official platform guidance

Node documents that `URL.pathname` is unsuitable for converting file URLs: Windows drive paths retain a leading slash, and UNC hosts and encoded characters require proper conversion. `fileURLToPath` supports explicit Windows/POSIX semantics; use the file-owning host's platform, never infer the target from the viewer's OS. Conversion still requires confinement. Preserve the current rejection of non-local authorities unless support is separately designed; do not accidentally enable UNC browsing while fixing local drive paths. Test encoded separators, malformed encoding, Unicode, spaces and fragments. Renderer code cannot import `node:url` directly: either implement a deliberately narrow browser-safe parser or carry the URL to an authorized Node boundary. [Node URL documentation](https://nodejs.org/api/url.html#urlfileurltopathurl-options)

`node:path` defaults to the executing OS; explicit `win32`/`posix` operations are needed when handling another host's paths. Absolute-path checks do not establish containment. [Node path documentation](https://nodejs.org/api/path.html#windows-vs-posix), [absolute-path guidance](https://nodejs.org/api/path.html#pathisabsolutepath)

Electron recommends validating IPC senders and exposing narrow APIs across the renderer boundary. Preview requests should retain the existing scoped product/host read flow; opening an untrusted `file://` URL directly would bypass that design. [Electron security guidance](https://www.electronjs.org/docs/latest/tutorial/security)

## Recommended resolution policy

These are design recommendations inferred from the evidence and repository rules, not claims that an upstream standard mandates a particular UX.

1. Preserve explicit project-relative and absolute paths. Authorize them against the owning thread/environment or registered PTY project; `thread-storage` stays a separate namespace. Do not add cwd or machine selectors to the user flow.
2. For a bare basename, prefer explicit scoped context or a unique known path. If multiple paths match, request a choice instead of silently selecting the latest. Specify precedence when a root file and a subdirectory file share a basename.
3. If an exact bare path is absent, any project lookup must execute on the owning host, be asynchronous, bounded and cancellable, and return only confined candidates. Reuse an existing scoped file index/search where possible. Never perform an unbounded recursive scan in Electron main. Limit-exceeded or truncated results cannot prove uniqueness. Reauthorize the selected candidate on read and reject symlink/junction escapes.
4. Keep missing, unreadable, unavailable environment/host, invalid/out-of-scope and too-large outcomes distinct where the underlying authority can prove them. Show the requested path and authorized attempted path/root; do not disclose arbitrary outside-scope resolved paths. A missing generated report may show a conditional hint to generate it, without inventing or automatically executing a generator.
5. Decide explicitly whether `preview_file` success remains an acknowledgement or becomes an existence check. If adding a check, use the same scoped owning-host read/metadata boundary for both MCP and dynamic tools, account for offline hosts and TOCTOU, and avoid loading full file content just to validate an open.
6. Reuse a preview tab by canonical scoped identity (owner, source, normalized path), preserving line/reveal behavior. Scope prevents identically named files in different projects, hosts or thread storage from colliding.

## Verification implications

Follow [repository rules](../../AGENTS.md): at least 80% meaningful changed-code coverage, focused tests, `pnpm verify:fast`, and built-Electron E2E for the seam. Include a real Windows drive URL case, POSIX/remote semantics independent of viewer OS, unique/ambiguous/missing basename cases, symlink/junction escape attempts, source isolation, retry after creating a missing report, repeated open/tab reuse and offline host behavior. Keep Node/Electron native-runtime isolation intact. Read [live verification triggers](../live-zana-verification.md) if implementation touches tool/catalog injection, lifecycle or BrowserView behavior.
