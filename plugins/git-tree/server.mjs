import { createRequire as __createRequire } from "node:module";
import { dirname as __pathDirname } from "node:path";
import { fileURLToPath as __fileURLToPath } from "node:url";
const require = __createRequire(import.meta.url);
var __filename = __fileURLToPath(import.meta.url);
var __dirname = __pathDirname(__filename);

// server.ts
import { existsSync as existsSync3, renameSync, unlinkSync, writeFileSync } from "node:fs";
import { join as join4 } from "node:path";

// src/server/git-details-diff.ts
import { existsSync as existsSync2, readFileSync as readFileSync2 } from "node:fs";
import { join as join3 } from "node:path";

// src/server/git-exec.ts
import { spawn } from "node:child_process";
import { closeSync, openSync, readFileSync, rmSync, statSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
var DEFAULT_TIMEOUT_MS = 3e4;
var DEFAULT_MAX_BYTES = 16 * 1024 * 1024;
var MAX_CONCURRENT_GIT_PROCS = 6;
function assertSafeGitToken(value, label = "git reference") {
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error(`${label} is required.`);
  }
  if (trimmed.startsWith("-")) {
    throw new Error(`Invalid ${label}: cannot start with '-'.`);
  }
  if (/[\0\r\n]/.test(trimmed)) {
    throw new Error(`Invalid ${label}: contains control characters.`);
  }
  return trimmed;
}
var ConcurrencyLimiter = class {
  constructor(maxConcurrency) {
    this.maxConcurrency = maxConcurrency;
  }
  maxConcurrency;
  active = 0;
  queue = [];
  async run(task) {
    if (this.active >= this.maxConcurrency) {
      await new Promise((resolve2) => this.queue.push(resolve2));
    }
    this.active += 1;
    try {
      return await task();
    } finally {
      this.active -= 1;
      const next = this.queue.shift();
      if (next) next();
    }
  }
};
function readBoundedFile(filePath, maxBytes) {
  try {
    const stat = statSync(filePath);
    if (stat.size === 0) return "";
    const buf = readFileSync(filePath);
    if (buf.byteLength > maxBytes) {
      return buf.subarray(0, maxBytes).toString("utf8");
    }
    return buf.toString("utf8");
  } catch {
    return "";
  }
}
function safeClose(fd) {
  if (fd === null) return;
  try {
    closeSync(fd);
  } catch {
  }
}
function safeRemove(filePath) {
  try {
    rmSync(filePath, { force: true });
  } catch {
  }
}
function createTempFileGitRunner() {
  const limiter = new ConcurrencyLimiter(MAX_CONCURRENT_GIT_PROCS);
  return (request) => limiter.run(
    () => new Promise((resolve2) => {
      const id = randomUUID();
      const stdoutPath = join(tmpdir(), `zcc-git-graph-out-${id}.tmp`);
      const stderrPath = join(tmpdir(), `zcc-git-graph-err-${id}.tmp`);
      const timeoutMs = request.timeoutMs ?? DEFAULT_TIMEOUT_MS;
      const maxBytes = request.maxBytes ?? DEFAULT_MAX_BYTES;
      let outFd = null;
      let errFd = null;
      let settled = false;
      let timer = null;
      const finish = (code, fallbackErr) => {
        if (settled) return;
        settled = true;
        if (timer) clearTimeout(timer);
        safeClose(outFd);
        safeClose(errFd);
        outFd = null;
        errFd = null;
        const stdout = readBoundedFile(stdoutPath, maxBytes);
        const stderrFile = readBoundedFile(stderrPath, maxBytes);
        safeRemove(stdoutPath);
        safeRemove(stderrPath);
        resolve2({
          code,
          stdout,
          stderr: fallbackErr ? `${stderrFile}
${fallbackErr}`.trim() : stderrFile
        });
      };
      try {
        outFd = openSync(stdoutPath, "w", 384);
        errFd = openSync(stderrPath, "w", 384);
      } catch (err) {
        safeClose(outFd);
        safeClose(errFd);
        safeRemove(stdoutPath);
        safeRemove(stderrPath);
        resolve2({
          code: 1,
          stdout: "",
          stderr: err instanceof Error ? err.message : String(err)
        });
        return;
      }
      const fullArgs = ["--no-pager", "-c", "core.fsmonitor=false", ...request.args];
      const child = spawn("git", fullArgs, {
        cwd: request.cwd,
        windowsHide: true,
        stdio: ["ignore", outFd, errFd],
        env: {
          ...process.env,
          GIT_TERMINAL_PROMPT: "0",
          GCM_INTERACTIVE: "never",
          LC_ALL: "C"
        }
      });
      timer = setTimeout(() => {
        try {
          child.kill("SIGKILL");
        } catch {
        }
        finish(124, `git command timed out after ${timeoutMs}ms`);
      }, timeoutMs);
      child.once("error", (err) => {
        const errno = err.code;
        finish(errno === "ENOENT" ? 127 : 1, err.message);
      });
      child.once("exit", (code) => {
        finish(typeof code === "number" ? code : 1);
      });
      child.once("close", (code) => {
        finish(typeof code === "number" ? code : 1);
      });
    })
  );
}

// src/server/project-repos.ts
import { existsSync, readdirSync, realpathSync, statSync as statSync2 } from "node:fs";
import { basename, isAbsolute, join as join2, relative, resolve, sep } from "node:path";
function createNodeFsDeps() {
  return {
    exists: (p) => existsSync(p),
    realpath: (p) => realpathSync(p),
    readdir: (p) => readdirSync(p, { withFileTypes: true }).map((ent) => ({
      name: ent.name,
      isDirectory: ent.isDirectory()
    })),
    isFile: (p) => {
      try {
        return statSync2(p).isFile();
      } catch {
        return false;
      }
    }
  };
}
var ProjectConfinementError = class extends Error {
  constructor(message, code = "project_unavailable") {
    super(message);
    this.code = code;
  }
  code;
};
var IGNORED_SEARCH_DIRS = /* @__PURE__ */ new Set([
  ".git",
  "node_modules",
  ".next",
  "dist",
  "out",
  "out-dev",
  "build",
  "target",
  "vendor",
  ".venv",
  "venv"
]);
function normalizeRelPath(relPath) {
  return relPath.split(sep).join("/").replace(/^\/+|\/+$/g, "");
}
function isPathConfinedToRoot(canonicalRoot, candidateCanonical) {
  const rel = relative(canonicalRoot, candidateCanonical);
  if (rel === "") return true;
  return !rel.startsWith("..") && !isAbsolute(rel);
}
async function resolveConfinedRepoPath(args) {
  const fs = args.fs ?? createNodeFsDeps();
  const projectId = (args.projectId ?? "").trim();
  if (!projectId) {
    throw new ProjectConfinementError("projectId is required.", "project_not_found");
  }
  const projects = await args.listProjects();
  const project = projects.find((row) => row.id === projectId);
  if (!project) {
    throw new ProjectConfinementError("Project is not registered in Zana.", "project_not_found");
  }
  if (!project.path || !project.path.trim()) {
    throw new ProjectConfinementError(
      "Git Tree requires a local project checkout path.",
      "project_unavailable"
    );
  }
  let canonicalProjectRoot;
  try {
    canonicalProjectRoot = fs.realpath(project.path);
  } catch {
    throw new ProjectConfinementError(
      "The project directory is unavailable on this machine.",
      "project_unavailable"
    );
  }
  const rawRel = normalizeRelPath(args.subRepoRelPath ?? "");
  if (rawRel.split("/").includes("..")) {
    throw new ProjectConfinementError("Repository relative path cannot traverse outside the project.", "path_escape");
  }
  const candidatePath = rawRel ? resolve(canonicalProjectRoot, rawRel) : canonicalProjectRoot;
  let canonicalRepoRoot;
  try {
    canonicalRepoRoot = fs.realpath(candidatePath);
  } catch {
    throw new ProjectConfinementError("The requested sub-repository does not exist.", "project_unavailable");
  }
  if (!isPathConfinedToRoot(canonicalProjectRoot, canonicalRepoRoot)) {
    throw new ProjectConfinementError("Repository path escaped the registered project root.", "path_escape");
  }
  const normalizedRel = normalizeRelPath(relative(canonicalProjectRoot, canonicalRepoRoot));
  return {
    project,
    canonicalProjectRoot,
    canonicalRepoRoot,
    subRepoRelPath: normalizedRel
  };
}
function validateRepoRelativeFilePath(filePath) {
  const trimmed = filePath.trim().replace(/\\/g, "/").replace(/^\/+/, "");
  if (!trimmed) {
    throw new Error("File path is required.");
  }
  if (trimmed.startsWith("-") || /[\0\r\n]/.test(trimmed)) {
    throw new Error("Invalid file path.");
  }
  const segments = trimmed.split("/");
  if (segments.includes("..") || segments.includes(".")) {
    throw new Error("File path must be a normalized repository-relative path.");
  }
  return trimmed;
}
function hasGitMarker(dirPath, fs) {
  const dotGit = join2(dirPath, ".git");
  if (!fs.exists(dotGit)) return { exists: false, isWorktree: false };
  return { exists: true, isWorktree: fs.isFile(dotGit) };
}
async function discoverProjectRepos(args) {
  const fs = args.fs ?? createNodeFsDeps();
  const maxDepth = Math.max(0, Math.min(5, Math.floor(args.maxDepth)));
  const found = [];
  function walk(currentDir, depth) {
    let realCurrent;
    try {
      realCurrent = fs.realpath(currentDir);
    } catch {
      return;
    }
    if (!isPathConfinedToRoot(args.canonicalProjectRoot, realCurrent)) return;
    const marker = hasGitMarker(realCurrent, fs);
    if (marker.exists) {
      const rel = normalizeRelPath(relative(args.canonicalProjectRoot, realCurrent));
      found.push({ absPath: realCurrent, relPath: rel, isWorktree: marker.isWorktree });
    }
    if (depth >= maxDepth) return;
    let entries = [];
    try {
      entries = fs.readdir(realCurrent);
    } catch {
      return;
    }
    for (const entry of entries) {
      if (!entry.isDirectory) continue;
      if (IGNORED_SEARCH_DIRS.has(entry.name)) continue;
      if (entry.name.startsWith(".") && entry.name !== ".worktrees") continue;
      walk(join2(realCurrent, entry.name), depth + 1);
    }
  }
  walk(args.canonicalProjectRoot, 0);
  if (found.length === 0) {
    const probe = await args.git({
      cwd: args.canonicalProjectRoot,
      args: ["rev-parse", "--is-inside-work-tree"],
      timeoutMs: 5e3
    });
    if (probe.code === 0 && probe.stdout.trim() === "true") {
      found.push({ absPath: args.canonicalProjectRoot, relPath: "", isWorktree: false });
    }
  }
  const repos = [];
  for (const item of found) {
    const headRes = await args.git({
      cwd: item.absPath,
      args: ["rev-parse", "--verify", "HEAD"],
      timeoutMs: 5e3
    });
    const branchRes = await args.git({
      cwd: item.absPath,
      args: ["symbolic-ref", "--quiet", "--short", "HEAD"],
      timeoutMs: 5e3
    });
    const headHash = headRes.code === 0 ? headRes.stdout.trim() || null : null;
    const currentBranch = branchRes.code === 0 ? branchRes.stdout.trim() || null : null;
    const rootName = basename(args.canonicalProjectRoot) || "root";
    repos.push({
      relPath: item.relPath,
      label: item.relPath ? `${rootName} / ${item.relPath}` : rootName,
      currentBranch,
      headHash,
      isWorktree: item.isWorktree
    });
  }
  return repos;
}

// src/server/types.ts
var UNCOMMITTED_COMMIT_HASH = "*";

// src/server/git-details-diff.ts
var FIELD_SEP = "";
var HEADER_END = "";
function normalizeStatusChar(raw) {
  const first = raw.trim().charAt(0).toUpperCase();
  if (first === "A" || first === "M" || first === "D" || first === "R" || first === "C" || first === "U") {
    return first;
  }
  return "M";
}
function signatureInfoFromCode(code, signer, keyId) {
  const status = code.trim().charAt(0);
  if (!status || status === "N") return void 0;
  const labels = {
    G: "Good valid signature",
    B: "Bad signature",
    U: "Good signature with unknown validity",
    X: "Good signature that has expired",
    Y: "Good signature made by an expired key",
    R: "Good signature made by a revoked key",
    E: "Signature cannot be checked (missing key)"
  };
  return {
    status,
    signer: signer.trim() || void 0,
    keyId: keyId.trim() || void 0,
    label: labels[status] ?? "Signed commit"
  };
}
function parseDiffStatAndStatus(numstatZ, nameStatusZ) {
  const statusByPath = /* @__PURE__ */ new Map();
  const statusTokens = nameStatusZ.split("\0").filter((t) => t.length > 0);
  for (let i = 0; i < statusTokens.length; i++) {
    const statusRaw = statusTokens[i];
    const code = normalizeStatusChar(statusRaw);
    if (code === "R" || code === "C") {
      const oldPath = statusTokens[i + 1] ?? "";
      const newPath = statusTokens[i + 2] ?? oldPath;
      i += 2;
      if (newPath) statusByPath.set(`${oldPath}=>${newPath}`, { status: code, oldPath, newPath });
    } else {
      const filePath = statusTokens[i + 1] ?? "";
      i += 1;
      if (filePath) statusByPath.set(filePath, { status: code, oldPath: filePath, newPath: filePath });
    }
  }
  const changes = [];
  const numTokens = numstatZ.split("\0").filter((t) => t.length > 0);
  for (let i = 0; i < numTokens.length; i++) {
    const token = numTokens[i];
    const parts = token.split("	");
    if (parts.length < 3) continue;
    const addStr = parts[0];
    const delStr = parts[1];
    const restPath = parts.slice(2).join("	");
    const additions = addStr === "-" ? null : Number.parseInt(addStr, 10) || 0;
    const deletions = delStr === "-" ? null : Number.parseInt(delStr, 10) || 0;
    if (restPath === "") {
      const oldPath = numTokens[i + 1] ?? "";
      const newPath = numTokens[i + 2] ?? oldPath;
      i += 2;
      const meta = statusByPath.get(`${oldPath}=>${newPath}`);
      changes.push({
        oldPath,
        newPath,
        status: meta?.status ?? "R",
        additions,
        deletions
      });
    } else {
      const meta = statusByPath.get(restPath);
      changes.push({
        oldPath: meta?.oldPath ?? restPath,
        newPath: meta?.newPath ?? restPath,
        status: meta?.status ?? "M",
        additions,
        deletions
      });
    }
  }
  const seenNewPaths = new Set(changes.map((c) => `${c.oldPath}=>${c.newPath}`));
  for (const item of statusByPath.values()) {
    const key = `${item.oldPath}=>${item.newPath}`;
    if (!seenNewPaths.has(key)) {
      changes.push({
        oldPath: item.oldPath,
        newPath: item.newPath,
        status: item.status,
        additions: 0,
        deletions: 0
      });
    }
  }
  return changes;
}
function parsePorcelainFileChanges(stdout, includeUntracked) {
  const changes = [];
  if (!stdout) return changes;
  const tokens = stdout.split("\0");
  for (let i = 0; i < tokens.length; i++) {
    const entry = tokens[i];
    if (!entry || entry.length < 4) continue;
    const x = entry.charAt(0);
    const y = entry.charAt(1);
    const pathPart = entry.slice(3);
    if (x === "?" && y === "?") {
      if (!includeUntracked) continue;
      changes.push({
        oldPath: pathPart,
        newPath: pathPart,
        status: "U",
        additions: null,
        deletions: null,
        staged: false,
        untracked: true
      });
      continue;
    }
    if (x === "R" || y === "R" || x === "C" || y === "C") {
      const origPath = tokens[i + 1] ?? pathPart;
      i += 1;
      changes.push({
        oldPath: origPath,
        newPath: pathPart,
        status: x === "C" || y === "C" ? "C" : "R",
        additions: null,
        deletions: null,
        staged: x !== " " && x !== "?"
      });
      continue;
    }
    const effective = x !== " " && x !== "?" ? x : y;
    changes.push({
      oldPath: pathPart,
      newPath: pathPart,
      status: normalizeStatusChar(effective),
      additions: null,
      deletions: null,
      staged: x !== " " && x !== "?"
    });
  }
  return changes;
}
async function loadCommitDetails(args) {
  const { cwd, git } = args;
  const commitHash = args.commitHash.trim();
  if (commitHash === UNCOMMITTED_COMMIT_HASH) {
    const includeUntracked = args.showUntrackedFiles ?? true;
    const [headRes, statusRes, numstatRes2] = await Promise.all([
      git({ cwd, args: ["rev-parse", "--verify", "HEAD"], timeoutMs: 5e3 }),
      git({
        cwd,
        args: ["status", "--porcelain=v1", "-z", includeUntracked ? "-uall" : "-uno"],
        timeoutMs: 1e4
      }),
      git({ cwd, args: ["diff", "HEAD", "--numstat", "-z"], timeoutMs: 1e4 })
    ]);
    const headHash = headRes.code === 0 ? headRes.stdout.trim() : "";
    const fileChanges2 = parsePorcelainFileChanges(statusRes.stdout, includeUntracked);
    const statChanges = parseDiffStatAndStatus(numstatRes2.stdout, "");
    const statMap = new Map(statChanges.map((c) => [c.newPath, c]));
    for (const change of fileChanges2) {
      const stat = statMap.get(change.newPath);
      if (stat) {
        change.additions = stat.additions;
        change.deletions = stat.deletions;
      }
    }
    const nowSec = Math.floor(Date.now() / 1e3);
    return {
      hash: UNCOMMITTED_COMMIT_HASH,
      abbreviatedHash: "*",
      parents: headHash ? [headHash] : [],
      authorName: "Working Tree",
      authorEmail: "",
      authorDate: nowSec,
      committerName: "Working Tree",
      committerEmail: "",
      commitDate: nowSec,
      subject: `Uncommitted Changes (${fileChanges2.length})`,
      body: "Working tree and index modifications not yet committed.",
      fileChanges: fileChanges2
    };
  }
  const safeHash = assertSafeGitToken(commitHash, "commit hash");
  const format = [
    "%H",
    "%h",
    "%P",
    "%an",
    "%ae",
    "%at",
    "%cn",
    "%ce",
    "%ct",
    "%G?",
    "%GS",
    "%GK",
    "%s",
    "%b"
  ].join(FIELD_SEP) + HEADER_END;
  const [metaRes, numstatRes, nameStatusRes] = await Promise.all([
    git({ cwd, args: ["show", "--quiet", `--format=${format}`, safeHash, "--"], timeoutMs: 1e4 }),
    git({
      cwd,
      args: ["diff-tree", "--root", "--no-commit-id", "-m", "--first-parent", "--numstat", "-r", "-z", safeHash, "--"],
      timeoutMs: 15e3
    }),
    git({
      cwd,
      args: ["diff-tree", "--root", "--no-commit-id", "-m", "--first-parent", "--name-status", "-r", "-z", safeHash, "--"],
      timeoutMs: 15e3
    })
  ]);
  if (metaRes.code !== 0) {
    throw new Error(metaRes.stderr.trim() || `Commit not found: ${safeHash}`);
  }
  const headerEndIdx = metaRes.stdout.indexOf(HEADER_END);
  const rawHeader = headerEndIdx >= 0 ? metaRes.stdout.slice(0, headerEndIdx) : metaRes.stdout;
  const fields = rawHeader.split(FIELD_SEP);
  const [
    hash = safeHash,
    abbreviatedHash = safeHash.slice(0, 7),
    parentsStr = "",
    authorName = "",
    authorEmail = "",
    authorDateStr = "0",
    committerName = "",
    committerEmail = "",
    commitDateStr = "0",
    sigCode = "N",
    sigSigner = "",
    sigKey = "",
    subject = "",
    ...bodyParts
  ] = fields;
  const fileChanges = parseDiffStatAndStatus(
    numstatRes.code === 0 ? numstatRes.stdout : "",
    nameStatusRes.code === 0 ? nameStatusRes.stdout : ""
  );
  return {
    hash: hash.trim(),
    abbreviatedHash: abbreviatedHash.trim(),
    parents: parentsStr.trim().split(/\s+/).filter(Boolean),
    authorName: authorName.trim(),
    authorEmail: authorEmail.trim(),
    authorDate: Number.parseInt(authorDateStr, 10) || 0,
    committerName: committerName.trim(),
    committerEmail: committerEmail.trim(),
    commitDate: Number.parseInt(commitDateStr, 10) || 0,
    subject: subject.trim(),
    body: bodyParts.join(FIELD_SEP).trim(),
    signature: signatureInfoFromCode(sigCode, sigSigner, sigKey),
    fileChanges
  };
}
async function compareCommits(args) {
  const { cwd, git } = args;
  const fromHash = args.fromHash.trim();
  const toHash = args.toHash.trim();
  if (fromHash === UNCOMMITTED_COMMIT_HASH && toHash === UNCOMMITTED_COMMIT_HASH) {
    return { fromHash, toHash, fileChanges: [] };
  }
  const diffArgsBase = ["diff", "-r", "-z"];
  if (toHash === UNCOMMITTED_COMMIT_HASH) {
    diffArgsBase.push(assertSafeGitToken(fromHash, "fromHash"));
  } else if (fromHash === UNCOMMITTED_COMMIT_HASH) {
    diffArgsBase.push("-R", assertSafeGitToken(toHash, "toHash"));
  } else {
    diffArgsBase.push(
      assertSafeGitToken(fromHash, "fromHash"),
      assertSafeGitToken(toHash, "toHash")
    );
  }
  const [numstatRes, nameStatusRes] = await Promise.all([
    git({ cwd, args: [...diffArgsBase, "--numstat", "--"], timeoutMs: 15e3 }),
    git({ cwd, args: [...diffArgsBase, "--name-status", "--"], timeoutMs: 15e3 })
  ]);
  if (numstatRes.code !== 0 && nameStatusRes.code !== 0) {
    throw new Error(numstatRes.stderr.trim() || "Could not compare commits.");
  }
  return {
    fromHash,
    toHash,
    fileChanges: parseDiffStatAndStatus(numstatRes.stdout, nameStatusRes.stdout)
  };
}
function parseUnifiedDiff(rawDiff) {
  if (/Binary files .* differ/i.test(rawDiff) || /GIT binary patch/i.test(rawDiff)) {
    return { isBinary: true, hunks: [] };
  }
  const hunks = [];
  const lines = rawDiff.split(/\r?\n/);
  let currentHunk = null;
  let oldLine = 0;
  let newLine = 0;
  const hunkHeaderRegex = /^@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@(.*)$/;
  for (const line of lines) {
    const match = hunkHeaderRegex.exec(line);
    if (match) {
      const oldStart = Number.parseInt(match[1], 10) || 0;
      const oldLines = match[2] !== void 0 ? Number.parseInt(match[2], 10) : 1;
      const newStart = Number.parseInt(match[3], 10) || 0;
      const newLines = match[4] !== void 0 ? Number.parseInt(match[4], 10) : 1;
      currentHunk = {
        header: line,
        oldStart,
        oldLines,
        newStart,
        newLines,
        lines: []
      };
      hunks.push(currentHunk);
      oldLine = oldStart;
      newLine = newStart;
      continue;
    }
    if (!currentHunk) continue;
    if (line.startsWith("+")) {
      currentHunk.lines.push({
        type: "add",
        oldLineNumber: null,
        newLineNumber: newLine++,
        content: line.slice(1)
      });
    } else if (line.startsWith("-")) {
      currentHunk.lines.push({
        type: "del",
        oldLineNumber: oldLine++,
        newLineNumber: null,
        content: line.slice(1)
      });
    } else if (line.startsWith(" ")) {
      currentHunk.lines.push({
        type: "context",
        oldLineNumber: oldLine++,
        newLineNumber: newLine++,
        content: line.slice(1)
      });
    } else if (line.startsWith("\\")) {
      currentHunk.lines.push({
        type: "meta",
        oldLineNumber: null,
        newLineNumber: null,
        content: line
      });
    }
  }
  return { isBinary: false, hunks };
}
async function loadFileDiff(args) {
  const { cwd, git } = args;
  const filePath = validateRepoRelativeFilePath(args.filePath);
  const oldPath = args.oldPath ? validateRepoRelativeFilePath(args.oldPath) : void 0;
  const pathSpecs = oldPath && oldPath !== filePath ? [oldPath, filePath] : [filePath];
  const commitHash = args.commitHash.trim();
  const fromHash = args.fromHash?.trim();
  let rawDiff = "";
  if (fromHash && fromHash !== commitHash) {
    if (commitHash === UNCOMMITTED_COMMIT_HASH) {
      const res = await git({
        cwd,
        args: ["diff", "--unified=3", assertSafeGitToken(fromHash, "fromHash"), "--", ...pathSpecs],
        timeoutMs: 15e3
      });
      rawDiff = res.stdout;
    } else if (fromHash === UNCOMMITTED_COMMIT_HASH) {
      const res = await git({
        cwd,
        args: ["diff", "--unified=3", "-R", assertSafeGitToken(commitHash, "commitHash"), "--", ...pathSpecs],
        timeoutMs: 15e3
      });
      rawDiff = res.stdout;
    } else {
      const res = await git({
        cwd,
        args: [
          "diff",
          "--unified=3",
          assertSafeGitToken(fromHash, "fromHash"),
          assertSafeGitToken(commitHash, "commitHash"),
          "--",
          ...pathSpecs
        ],
        timeoutMs: 15e3
      });
      rawDiff = res.stdout;
    }
  } else if (commitHash === UNCOMMITTED_COMMIT_HASH) {
    const res = await git({
      cwd,
      args: ["diff", "--unified=3", "HEAD", "--", ...pathSpecs],
      timeoutMs: 15e3
    });
    rawDiff = res.stdout;
    if (!rawDiff.trim()) {
      const untrackedRes = await git({
        cwd,
        args: ["diff", "--no-index", "--unified=3", "--", "/dev/null", filePath],
        timeoutMs: 1e4
      });
      rawDiff = untrackedRes.stdout;
    }
  } else {
    const safeHash = assertSafeGitToken(commitHash, "commitHash");
    const res = await git({
      cwd,
      args: ["show", "--format=", "--first-parent", "--unified=3", safeHash, "--", ...pathSpecs],
      timeoutMs: 15e3
    });
    rawDiff = res.stdout;
  }
  const parsed = parseUnifiedDiff(rawDiff);
  return {
    filePath,
    oldPath,
    commitHash,
    fromHash,
    isBinary: parsed.isBinary,
    rawDiff,
    hunks: parsed.hunks
  };
}
async function loadFileContent(args) {
  const { cwd, git } = args;
  const filePath = validateRepoRelativeFilePath(args.filePath);
  const commitHash = args.commitHash.trim();
  if (commitHash === UNCOMMITTED_COMMIT_HASH) {
    try {
      const fullPath = join3(cwd, filePath);
      if (!existsSync2(fullPath)) {
        return { filePath, commitHash, content: "", isBinary: false };
      }
      const buf = readFileSync2(fullPath);
      const isBinary2 = buf.subarray(0, 8e3).includes(0);
      return {
        filePath,
        commitHash,
        content: isBinary2 ? "" : buf.toString("utf8"),
        isBinary: isBinary2
      };
    } catch {
      return { filePath, commitHash, content: "", isBinary: false };
    }
  }
  const safeHash = assertSafeGitToken(commitHash, "commitHash");
  const res = await git({
    cwd,
    args: ["show", `${safeHash}:${filePath}`],
    timeoutMs: 15e3,
    maxBytes: 8 * 1024 * 1024
  });
  if (res.code !== 0) {
    return { filePath, commitHash, content: "", isBinary: false };
  }
  const isBinary = res.stdout.slice(0, 8e3).includes("\0");
  return {
    filePath,
    commitHash,
    content: isBinary ? "" : res.stdout,
    isBinary
  };
}

// src/server/git-log-parser.ts
var FIELD_SEP2 = "";
var RECORD_SEP = "";
var GIT_LOG_FORMAT = [
  "%H",
  "%h",
  "%P",
  "%an",
  "%ae",
  "%at",
  "%cn",
  "%ce",
  "%ct",
  "%s"
].join(FIELD_SEP2) + RECORD_SEP;
function parseShowRefOutput(stdout, currentBranch) {
  let headHash = null;
  const branches = [];
  const remoteBranches = [];
  const tags = [];
  const refsByHash = /* @__PURE__ */ new Map();
  const annotatedTagTarget = /* @__PURE__ */ new Map();
  const rawTags = [];
  const pushBadge = (hash, badge) => {
    const list = refsByHash.get(hash) ?? [];
    list.push(badge);
    refsByHash.set(hash, list);
  };
  for (const rawLine of stdout.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    const spaceIdx = line.indexOf(" ");
    if (spaceIdx <= 0) continue;
    const hash = line.slice(0, spaceIdx).trim();
    const refName = line.slice(spaceIdx + 1).trim();
    if (refName === "HEAD") {
      headHash = hash;
      continue;
    }
    if (refName.startsWith("refs/heads/")) {
      const name = refName.slice("refs/heads/".length);
      branches.push(name);
      pushBadge(hash, {
        type: "head",
        name,
        isHead: currentBranch === name
      });
      continue;
    }
    if (refName.startsWith("refs/remotes/")) {
      const rest = refName.slice("refs/remotes/".length);
      if (rest.endsWith("/HEAD")) continue;
      const slashIdx = rest.indexOf("/");
      const remote = slashIdx > 0 ? rest.slice(0, slashIdx) : void 0;
      remoteBranches.push(rest);
      pushBadge(hash, {
        type: "remote",
        name: rest,
        remote
      });
      continue;
    }
    if (refName.startsWith("refs/tags/")) {
      const tagRest = refName.slice("refs/tags/".length);
      if (tagRest.endsWith("^{}")) {
        const cleanTag = tagRest.slice(0, -3);
        annotatedTagTarget.set(cleanTag, hash);
      } else {
        rawTags.push({ name: tagRest, hash });
      }
    }
  }
  for (const tag of rawTags) {
    tags.push(tag.name);
    const targetHash = annotatedTagTarget.get(tag.name) ?? tag.hash;
    pushBadge(targetHash, {
      type: "tag",
      name: tag.name
    });
  }
  branches.sort((a, b) => a.localeCompare(b));
  remoteBranches.sort((a, b) => a.localeCompare(b));
  tags.sort((a, b) => a.localeCompare(b));
  return {
    headHash,
    currentBranch,
    branches,
    remoteBranches,
    tags,
    refsByHash
  };
}
function parseGitLogOutput(stdout, refsByHash, headHash) {
  const nodes = [];
  const records = stdout.split(RECORD_SEP);
  for (const rawRecord of records) {
    const record = rawRecord.replace(/^[\r\n]+|[\r\n]+$/g, "");
    if (!record) continue;
    const fields = record.split(FIELD_SEP2);
    if (fields.length < 10) continue;
    const [
      hash,
      abbreviatedHash,
      parentsStr,
      authorName,
      authorEmail,
      authorDateStr,
      committerName,
      committerEmail,
      commitDateStr,
      ...subjectParts
    ] = fields;
    const cleanHash = hash.trim();
    if (!cleanHash) continue;
    const parents = parentsStr.trim().split(/\s+/).filter(Boolean);
    const refs = (refsByHash.get(cleanHash) ?? []).map((r) => ({ ...r }));
    const authorDate = Number.parseInt(authorDateStr, 10) || 0;
    const commitDate = Number.parseInt(commitDateStr, 10) || 0;
    nodes.push({
      hash: cleanHash,
      abbreviatedHash: abbreviatedHash.trim() || cleanHash.slice(0, 7),
      parents,
      authorName: authorName.trim(),
      authorEmail: authorEmail.trim(),
      authorDate,
      committerName: committerName.trim(),
      committerEmail: committerEmail.trim(),
      commitDate,
      subject: subjectParts.join(FIELD_SEP2).trim(),
      refs,
      isHead: headHash === cleanHash
    });
  }
  return nodes;
}
function parseStashListOutput(stdout) {
  const stashes = [];
  for (const rawRecord of stdout.split(RECORD_SEP)) {
    const record = rawRecord.replace(/^[\r\n]+|[\r\n]+$/g, "");
    if (!record) continue;
    const fields = record.split(FIELD_SEP2);
    if (fields.length < 7) continue;
    const [selector, hash, abbreviatedHash, parentsStr, authorName, authorEmail, dateStr, ...subjectParts] = fields;
    const parents = parentsStr.trim().split(/\s+/).filter(Boolean);
    if (!hash.trim() || parents.length === 0) continue;
    stashes.push({
      selector: selector.trim(),
      hash: hash.trim(),
      abbreviatedHash: abbreviatedHash.trim() || hash.trim().slice(0, 7),
      baseHash: parents[0],
      authorName: authorName.trim(),
      authorEmail: authorEmail.trim(),
      authorDate: Number.parseInt(dateStr, 10) || 0,
      subject: subjectParts.join(FIELD_SEP2).trim()
    });
  }
  return stashes;
}
function countPorcelainStatusEntries(stdout, includeUntracked) {
  if (!stdout) return 0;
  const tokens = stdout.split("\0");
  let count = 0;
  for (let i = 0; i < tokens.length; i++) {
    const entry = tokens[i];
    if (!entry || entry.length < 3) continue;
    const xy = entry.slice(0, 2);
    if (xy === "??" && !includeUntracked) continue;
    count += 1;
    if (xy.includes("R") || xy.includes("C")) {
      i += 1;
    }
  }
  return count;
}
function parseGitRemotesOutput(stdout) {
  const map = /* @__PURE__ */ new Map();
  for (const rawLine of stdout.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line) continue;
    const match = /^([^\s]+)\s+([^\s]+)\s+\((fetch|push)\)$/.exec(line);
    if (!match) continue;
    const [, name, url, kind] = match;
    const current = map.get(name) ?? { name, fetchUrl: url, pushUrl: url };
    if (kind === "fetch") current.fetchUrl = url;
    if (kind === "push") current.pushUrl = url;
    map.set(name, current);
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}
async function loadRepositoryGraph(args) {
  const { cwd, git } = args;
  const maxCommits = Math.max(1, Math.min(2e3, Math.floor(args.maxCommits)));
  const [branchRes, showRefRes, remotesRes] = await Promise.all([
    git({ cwd, args: ["symbolic-ref", "--quiet", "--short", "HEAD"], timeoutMs: 8e3 }),
    git({ cwd, args: ["show-ref", "--head", "--dereference"], timeoutMs: 1e4 }),
    git({ cwd, args: ["remote", "-v"], timeoutMs: 8e3 })
  ]);
  const currentBranch = branchRes.code === 0 ? branchRes.stdout.trim() || null : null;
  const parsedRefs = parseShowRefOutput(showRefRes.code === 0 ? showRefRes.stdout : "", currentBranch);
  const remotes = parseGitRemotesOutput(remotesRes.code === 0 ? remotesRes.stdout : "");
  for (const [hash, badges] of parsedRefs.refsByHash.entries()) {
    const filtered = badges.filter((badge) => {
      if (badge.type === "remote" && !args.showRemoteBranches) return false;
      if (badge.type === "tag" && !args.showTags) return false;
      return true;
    });
    parsedRefs.refsByHash.set(hash, filtered);
  }
  const logArgs = ["log", `--max-count=${maxCommits + 1}`, `--format=${GIT_LOG_FORMAT}`];
  if (args.commitOrdering === "topo") {
    logArgs.push("--topo-order");
  } else if (args.commitOrdering === "author-date") {
    logArgs.push("--author-date-order");
  } else {
    logArgs.push("--date-order");
  }
  if (args.onlyFollowFirstParent) {
    logArgs.push("--first-parent");
  }
  if (args.useMailmap) {
    logArgs.push("--use-mailmap");
  }
  const validSelected = (args.selectedBranches ?? []).map((b) => b.trim()).filter((b) => b.length > 0 && !b.startsWith("-"));
  if (validSelected.length > 0) {
    for (const branch of validSelected) {
      logArgs.push(assertSafeGitToken(branch, "branch filter"));
    }
  } else {
    logArgs.push("--branches");
    if (args.showTags) logArgs.push("--tags");
    if (args.showRemoteBranches) logArgs.push("--remotes");
    if (parsedRefs.headHash) logArgs.push("HEAD");
  }
  logArgs.push("--");
  const logRes = await git({ cwd, args: logArgs, timeoutMs: 2e4 });
  const rawNodes = logRes.code === 0 ? parseGitLogOutput(logRes.stdout, parsedRefs.refsByHash, parsedRefs.headHash) : [];
  const hasMore = rawNodes.length > maxCommits;
  const commits = hasMore ? rawNodes.slice(0, maxCommits) : rawNodes;
  const stashes = [];
  if (args.showStashes) {
    const stashFormat = ["%gd", "%H", "%h", "%P", "%an", "%ae", "%at", "%gs"].join(FIELD_SEP2) + RECORD_SEP;
    const stashRes = await git({
      cwd,
      args: ["stash", "list", `--format=${stashFormat}`],
      timeoutMs: 8e3
    });
    if (stashRes.code === 0 && stashRes.stdout.trim()) {
      const parsedStashes = parseStashListOutput(stashRes.stdout);
      const existingHashes = new Set(commits.map((c) => c.hash));
      for (const stash of parsedStashes) {
        stashes.push({
          selector: stash.selector,
          hash: stash.hash,
          subject: stash.subject,
          baseHash: stash.baseHash
        });
        if (!existingHashes.has(stash.hash)) {
          const baseIdx = commits.findIndex((c) => c.hash === stash.baseHash);
          const stashNode = {
            hash: stash.hash,
            abbreviatedHash: stash.abbreviatedHash,
            parents: [stash.baseHash],
            authorName: stash.authorName,
            authorEmail: stash.authorEmail,
            authorDate: stash.authorDate,
            committerName: stash.authorName,
            committerEmail: stash.authorEmail,
            commitDate: stash.authorDate,
            subject: stash.subject,
            refs: [{ type: "stash", name: stash.selector, selector: stash.selector }],
            isStash: true,
            stashSelector: stash.selector
          };
          if (baseIdx >= 0) {
            commits.splice(baseIdx, 0, stashNode);
          } else {
            commits.unshift(stashNode);
          }
        }
      }
    }
  }
  let uncommittedCount = 0;
  if (args.showUncommittedChanges) {
    const statusArgs = ["status", "--porcelain=v1", "-z", ...args.showUntrackedFiles ? ["-uall"] : ["-uno"]];
    const statusRes = await git({ cwd, args: statusArgs, timeoutMs: 1e4 });
    if (statusRes.code === 0) {
      uncommittedCount = countPorcelainStatusEntries(statusRes.stdout, args.showUntrackedFiles);
      if (uncommittedCount > 0) {
        const nowSec = Math.floor(Date.now() / 1e3);
        commits.unshift({
          hash: UNCOMMITTED_COMMIT_HASH,
          abbreviatedHash: "*",
          parents: parsedRefs.headHash ? [parsedRefs.headHash] : [],
          authorName: "*",
          authorEmail: "",
          authorDate: nowSec,
          committerName: "*",
          committerEmail: "",
          commitDate: nowSec,
          subject: `Uncommitted Changes (${uncommittedCount})`,
          refs: [],
          isUncommitted: true
        });
      }
    }
  }
  return {
    commits,
    hasMore,
    branches: parsedRefs.branches,
    remoteBranches: parsedRefs.remoteBranches,
    tags: parsedRefs.tags,
    stashes,
    headHash: parsedRefs.headHash,
    currentBranch,
    uncommittedCount,
    remotes
  };
}

// src/server/cli-and-tools.ts
function readFlag(argv, flag) {
  const idx = argv.indexOf(flag);
  if (idx >= 0 && idx + 1 < argv.length) {
    return argv[idx + 1];
  }
  return void 0;
}
function registerGitTreeCliAndTools(args) {
  const { zcc, git, fs, storage, readGlobalSettings } = args;
  zcc.cli.register({
    name: "git-tree",
    summary: "Inspect project Git Tree commits, branches, comparisons, diffs, and remotes",
    commands: [
      {
        name: "repos",
        summary: "List discovered Git repositories in a project",
        usage: "zcc git-tree repos [--project <id>]"
      },
      {
        name: "log",
        summary: "Show commit graph log",
        usage: "zcc git-tree log [--project <id>] [--max-count 30] [--branches a,b]"
      },
      {
        name: "details",
        summary: "Show commit details and changed files",
        usage: "zcc git-tree details [--project <id>] --commit <sha>"
      },
      {
        name: "compare",
        summary: "Compare two commits",
        usage: "zcc git-tree compare [--project <id>] --from <sha> --to <sha>"
      },
      {
        name: "diff",
        summary: "Show file diff",
        usage: "zcc git-tree diff [--project <id>] --commit <sha> --file <path>"
      },
      {
        name: "remotes",
        summary: "List repository remotes",
        usage: "zcc git-tree remotes [--project <id>]"
      }
    ],
    async run(argv, ctx) {
      const sub = argv[0] ?? "log";
      if (sub === "--help" || sub === "-h" || sub === "help") {
        return {
          exitCode: 0,
          stdout: "Usage: zcc git-tree <repos|log|details|compare|diff|remotes> [--project <id>]\n"
        };
      }
      let projectId = readFlag(argv, "--project") ?? ctx.projectId ?? "";
      const subRepoRelPath = readFlag(argv, "--repo") ?? "";
      if (!projectId && ctx.cwd) {
        try {
          const allProjects = await zcc.sdk.projects.list();
          const canonicalCwd = fs.realpath(ctx.cwd);
          const matched = allProjects.find((p) => {
            try {
              if (!p.path) return false;
              const canonicalProj = fs.realpath(p.path);
              return isPathConfinedToRoot(canonicalProj, canonicalCwd);
            } catch {
              return false;
            }
          });
          if (matched) {
            projectId = matched.id;
          }
        } catch {
        }
      }
      if (!projectId) {
        return {
          exitCode: 1,
          stderr: "Missing --project <projectId>. Pass --project <id> or run inside a project directory.\n"
        };
      }
      try {
        const globalSettings = await readGlobalSettings();
        const confined = await resolveConfinedRepoPath({
          projectId,
          subRepoRelPath,
          listProjects: () => zcc.sdk.projects.list(),
          fs
        });
        if (sub === "repos") {
          const repos = await discoverProjectRepos({
            canonicalProjectRoot: confined.canonicalProjectRoot,
            maxDepth: globalSettings.maxDepthOfRepoSearch,
            git,
            fs
          });
          return {
            exitCode: 0,
            stdout: `${JSON.stringify({ projectId, repos }, null, 2)}
`
          };
        }
        if (sub === "remotes") {
          const res = await git({ cwd: confined.canonicalRepoRoot, args: ["remote", "-v"], timeoutMs: 8e3 });
          const remotes = parseGitRemotesOutput(res.stdout);
          return {
            exitCode: 0,
            stdout: `${JSON.stringify({ projectId, remotes }, null, 2)}
`
          };
        }
        if (sub === "details") {
          const commitHash = readFlag(argv, "--commit") ?? (argv[1] && !argv[1].startsWith("-") ? argv[1] : "HEAD");
          const details = await loadCommitDetails({
            cwd: confined.canonicalRepoRoot,
            git,
            commitHash
          });
          return {
            exitCode: 0,
            stdout: `${JSON.stringify(details, null, 2)}
`
          };
        }
        if (sub === "compare") {
          const fromHash = readFlag(argv, "--from") ?? (argv[1] && !argv[1].startsWith("-") ? argv[1] : "");
          const toHash = readFlag(argv, "--to") ?? (argv[2] && !argv[2].startsWith("-") ? argv[2] : "HEAD");
          if (!fromHash) {
            return { exitCode: 1, stderr: "Missing --from <commitHash> for compare.\n" };
          }
          const comparison = await compareCommits({
            cwd: confined.canonicalRepoRoot,
            git,
            fromHash,
            toHash
          });
          return {
            exitCode: 0,
            stdout: `${JSON.stringify(comparison, null, 2)}
`
          };
        }
        if (sub === "diff") {
          const commitHash = readFlag(argv, "--commit") ?? (argv[1] && !argv[1].startsWith("-") ? argv[1] : "HEAD");
          const fromHash = readFlag(argv, "--from");
          const filePath = readFlag(argv, "--file") ?? (argv[2] && !argv[2].startsWith("-") ? argv[2] : "");
          if (!filePath) {
            return { exitCode: 1, stderr: "Missing --file <relativePath> for diff.\n" };
          }
          const diff = await loadFileDiff({
            cwd: confined.canonicalRepoRoot,
            git,
            commitHash,
            fromHash,
            filePath
          });
          return {
            exitCode: 0,
            stdout: `${JSON.stringify(diff, null, 2)}
`
          };
        }
        if (sub === "log") {
          const maxCount = Number.parseInt(readFlag(argv, "--max-count") ?? "25", 10) || 25;
          const branchesCsv = readFlag(argv, "--branches");
          const repoSettings = await storage.getRepoSettings(projectId, confined.subRepoRelPath);
          const graph = await loadRepositoryGraph({
            cwd: confined.canonicalRepoRoot,
            git,
            maxCommits: maxCount,
            selectedBranches: branchesCsv ? branchesCsv.split(",").map((s) => s.trim()).filter(Boolean) : repoSettings.selectedBranches,
            showRemoteBranches: repoSettings.showRemoteBranches,
            showTags: repoSettings.showTags,
            showStashes: repoSettings.showStashes,
            showUncommittedChanges: repoSettings.showUncommittedChanges,
            showUntrackedFiles: repoSettings.showUntrackedFiles,
            onlyFollowFirstParent: repoSettings.onlyFollowFirstParent,
            commitOrdering: repoSettings.commitOrdering,
            useMailmap: globalSettings.useMailmap
          });
          return {
            exitCode: 0,
            stdout: `${JSON.stringify(graph, null, 2)}
`
          };
        }
        return {
          exitCode: 1,
          stderr: `Unknown subcommand: ${sub}. Expected repos, log, details, compare, diff, or remotes.
`
        };
      } catch (err) {
        return {
          exitCode: 1,
          stderr: `${err instanceof Error ? err.message : String(err)}
`
        };
      }
    }
  });
  const toolDef = {
    name: "git_tree_inspect",
    description: "Inspect the Git commit tree/graph, commit details, two-commit comparisons, or file diffs for a registered Zana project.",
    parameters: {
      type: "object",
      properties: {
        action: {
          type: "string",
          enum: ["log", "details", "compare", "diff"],
          description: "Inspection action to perform"
        },
        projectId: {
          type: "string",
          description: "Optional projectId (defaults to the current thread projectId)"
        },
        subRepoRelPath: {
          type: "string",
          description: "Optional sub-repository relative path inside the project"
        },
        maxCommits: {
          type: "number",
          description: 'Maximum commits to load for action="log" (default 30)'
        },
        commit: {
          type: "string",
          description: 'Commit SHA or "*" for uncommitted changes (used by details and diff)'
        },
        fromCommit: {
          type: "string",
          description: "Base commit SHA for compare or diff"
        },
        toCommit: {
          type: "string",
          description: "Target commit SHA for compare"
        },
        filePath: {
          type: "string",
          description: 'Repository-relative file path for action="diff"'
        }
      },
      required: ["action"]
    },
    async execute(rawInput, ctx) {
      const input = rawInput && typeof rawInput === "object" ? rawInput : {};
      const action = typeof input.action === "string" ? input.action : "log";
      const projectId = typeof input.projectId === "string" && input.projectId.trim() || ctx.projectId || "";
      const subRepoRelPath = typeof input.subRepoRelPath === "string" ? input.subRepoRelPath.trim() : "";
      const confined = await resolveConfinedRepoPath({
        projectId,
        subRepoRelPath,
        listProjects: () => zcc.sdk.projects.list(),
        fs
      });
      const globalSettings = await readGlobalSettings();
      const repoSettings = await storage.getRepoSettings(projectId, confined.subRepoRelPath);
      if (action === "details") {
        const commitHash = typeof input.commit === "string" && input.commit.trim() ? input.commit.trim() : "HEAD";
        return loadCommitDetails({
          cwd: confined.canonicalRepoRoot,
          git,
          commitHash
        });
      }
      if (action === "compare") {
        const fromHash = typeof input.fromCommit === "string" ? input.fromCommit.trim() : "";
        const toHash = typeof input.toCommit === "string" && input.toCommit.trim() ? input.toCommit.trim() : "HEAD";
        if (!fromHash) throw new Error('fromCommit is required for action="compare".');
        return compareCommits({
          cwd: confined.canonicalRepoRoot,
          git,
          fromHash,
          toHash
        });
      }
      if (action === "diff") {
        const commitHash = typeof input.commit === "string" && input.commit.trim() ? input.commit.trim() : "HEAD";
        const fromHash = typeof input.fromCommit === "string" && input.fromCommit.trim() ? input.fromCommit.trim() : void 0;
        const filePath = typeof input.filePath === "string" ? input.filePath.trim() : "";
        if (!filePath) throw new Error('filePath is required for action="diff".');
        return loadFileDiff({
          cwd: confined.canonicalRepoRoot,
          git,
          commitHash,
          fromHash,
          filePath
        });
      }
      const maxCommits = typeof input.maxCommits === "number" && Number.isFinite(input.maxCommits) ? Math.max(1, Math.min(200, Math.floor(input.maxCommits))) : 30;
      return loadRepositoryGraph({
        cwd: confined.canonicalRepoRoot,
        git,
        maxCommits,
        selectedBranches: repoSettings.selectedBranches,
        showRemoteBranches: repoSettings.showRemoteBranches,
        showTags: repoSettings.showTags,
        showStashes: repoSettings.showStashes,
        showUncommittedChanges: repoSettings.showUncommittedChanges,
        showUntrackedFiles: repoSettings.showUntrackedFiles,
        onlyFollowFirstParent: repoSettings.onlyFollowFirstParent,
        commitOrdering: repoSettings.commitOrdering,
        useMailmap: globalSettings.useMailmap
      });
    }
  };
  zcc.agents.registerTool(toolDef);
  zcc.agents.registerTool({ ...toolDef, name: "git_graph_inspect" });
}

// src/server/git-actions.ts
async function runGitMutation(cwd, git, args, timeoutMs = 45e3) {
  const res = await git({ cwd, args, timeoutMs });
  if (res.code !== 0) {
    return {
      ok: false,
      stdout: res.stdout,
      stderr: res.stderr,
      error: res.stderr.trim() || res.stdout.trim() || `git ${args[0]} failed (exit ${res.code})`
    };
  }
  return {
    ok: true,
    stdout: res.stdout,
    stderr: res.stderr
  };
}
async function executeGitAction(args) {
  const { cwd, git, action, params } = args;
  const str = (key) => typeof params[key] === "string" ? params[key].trim() : "";
  const bool = (key) => Boolean(params[key]);
  switch (action) {
    // --- Repository Lifecycle ---
    case "init": {
      const initialBranch = str("initialBranch");
      if (initialBranch) {
        const safeBranch = assertSafeGitToken(initialBranch, "branch");
        const res = await runGitMutation(cwd, git, ["init", "-b", safeBranch], 3e4);
        if (res.ok) return res;
      }
      return runGitMutation(cwd, git, ["init"], 3e4);
    }
    // --- Fetch / Pull / Push ---
    case "fetch": {
      const remote = str("remote");
      const branch = str("branch");
      const prune = bool("prune");
      const pruneTags = bool("pruneTags");
      const force = bool("force");
      const cmd = ["fetch"];
      if (remote) {
        cmd.push(assertSafeGitToken(remote, "remote"));
        if (branch) {
          const localBranch = str("localBranch");
          if (localBranch) {
            cmd.push(`${assertSafeGitToken(branch, "branch")}:${assertSafeGitToken(localBranch, "localBranch")}`);
          } else {
            cmd.push(assertSafeGitToken(branch, "branch"));
          }
        }
      } else {
        cmd.push("--all");
      }
      if (prune) cmd.push("--prune");
      if (pruneTags) cmd.push("--prune-tags");
      if (force) cmd.push("--force");
      return runGitMutation(cwd, git, cmd, 6e4);
    }
    case "pull": {
      const remote = assertSafeGitToken(str("remote") || "origin", "remote");
      const branch = str("branch");
      const noFastForward = bool("noFastForward");
      const squash = bool("squash");
      const cmd = ["pull"];
      if (noFastForward) cmd.push("--no-ff");
      if (squash) cmd.push("--squash");
      cmd.push(remote);
      if (branch) cmd.push(assertSafeGitToken(branch, "branch"));
      return runGitMutation(cwd, git, cmd, 6e4);
    }
    case "push": {
      const remote = assertSafeGitToken(str("remote") || "origin", "remote");
      const branch = assertSafeGitToken(str("branch"), "branch");
      const setUpstream = bool("setUpstream");
      const forceMode = str("forceMode");
      if (!setUpstream) {
        const remoteRef = `refs/remotes/${remote}/${branch}`;
        const hasRemoteRef = await git({ cwd, args: ["rev-parse", "--verify", "--quiet", remoteRef] });
        if (hasRemoteRef.code === 0) {
          const ahead = await git({ cwd, args: ["rev-list", "--count", `${remoteRef}..refs/heads/${branch}`] });
          if (ahead.code === 0 && Number(ahead.stdout.trim()) === 0) {
            return {
              ok: true,
              stdout: "",
              stderr: "",
              notice: `Nothing to push: ${branch} has no new commits compared with ${remote}/${branch}.`
            };
          }
        }
      }
      const cmd = ["push"];
      if (setUpstream) cmd.push("--set-upstream");
      if (forceMode === "force-with-lease") cmd.push("--force-with-lease");
      else if (forceMode === "force") cmd.push("--force");
      cmd.push(remote, branch);
      return runGitMutation(cwd, git, cmd, 6e4);
    }
    // --- Branch Actions ---
    case "checkoutBranch": {
      const branch = assertSafeGitToken(str("branch"), "branch");
      const remoteBranch = str("remoteBranch");
      if (remoteBranch) {
        return runGitMutation(cwd, git, [
          "checkout",
          "-b",
          branch,
          "--track",
          assertSafeGitToken(remoteBranch, "remoteBranch")
        ]);
      }
      return runGitMutation(cwd, git, ["checkout", branch]);
    }
    case "createBranch": {
      const branch = assertSafeGitToken(str("branch"), "branch");
      const target = assertSafeGitToken(str("target") || "HEAD", "target commit");
      const checkout = bool("checkout");
      if (checkout) {
        return runGitMutation(cwd, git, ["checkout", "-b", branch, target]);
      }
      return runGitMutation(cwd, git, ["branch", branch, target]);
    }
    case "renameBranch": {
      const oldName = assertSafeGitToken(str("oldName"), "old branch name");
      const newName = assertSafeGitToken(str("newName"), "new branch name");
      return runGitMutation(cwd, git, ["branch", "-m", oldName, newName]);
    }
    case "deleteBranch": {
      const branch = assertSafeGitToken(str("branch"), "branch");
      const force = bool("force");
      const deleteRemote = bool("deleteRemote");
      const remote = str("remote") || "origin";
      const localRes = await runGitMutation(cwd, git, ["branch", force ? "-D" : "-d", branch]);
      if (!localRes.ok || !deleteRemote) return localRes;
      return runGitMutation(
        cwd,
        git,
        ["push", assertSafeGitToken(remote, "remote"), "--delete", branch],
        6e4
      );
    }
    case "deleteRemoteBranch": {
      const remote = assertSafeGitToken(str("remote"), "remote");
      const branch = assertSafeGitToken(str("branch"), "branch");
      return runGitMutation(cwd, git, ["push", remote, "--delete", branch], 6e4);
    }
    case "merge": {
      const target = assertSafeGitToken(str("target"), "merge target");
      const noFastForward = bool("noFastForward");
      const noCommit = bool("noCommit");
      const squash = bool("squash");
      const cmd = ["merge"];
      if (args.signCommits) cmd.push("-S");
      if (noFastForward) cmd.push("--no-ff");
      if (noCommit) cmd.push("--no-commit");
      if (squash) cmd.push("--squash");
      cmd.push(target);
      return runGitMutation(cwd, git, cmd);
    }
    case "rebase": {
      const onto = assertSafeGitToken(str("onto"), "rebase target");
      const cmd = ["rebase"];
      if (args.signCommits) cmd.push("-S");
      cmd.push(onto);
      return runGitMutation(cwd, git, cmd);
    }
    // --- Commit Actions ---
    case "checkoutCommit": {
      const commit = assertSafeGitToken(str("commit"), "commit");
      return runGitMutation(cwd, git, ["checkout", commit]);
    }
    case "cherryPick": {
      const commit = assertSafeGitToken(str("commit"), "commit");
      const noCommit = bool("noCommit");
      const recordOrigin = bool("recordOrigin");
      const parentIndex = typeof params.parentIndex === "number" ? Math.max(1, Math.floor(params.parentIndex)) : 0;
      const cmd = ["cherry-pick"];
      if (args.signCommits) cmd.push("-S");
      if (noCommit) cmd.push("--no-commit");
      if (recordOrigin) cmd.push("-x");
      if (parentIndex > 0) cmd.push("-m", String(parentIndex));
      cmd.push(commit);
      return runGitMutation(cwd, git, cmd);
    }
    case "revertCommit": {
      const commit = assertSafeGitToken(str("commit"), "commit");
      const noCommit = bool("noCommit");
      const parentIndex = typeof params.parentIndex === "number" ? Math.max(1, Math.floor(params.parentIndex)) : 0;
      const cmd = ["revert"];
      if (args.signCommits) cmd.push("-S");
      if (noCommit) cmd.push("--no-commit");
      else cmd.push("--no-edit");
      if (parentIndex > 0) cmd.push("-m", String(parentIndex));
      cmd.push(commit);
      return runGitMutation(cwd, git, cmd);
    }
    case "resetToCommit": {
      const commit = assertSafeGitToken(str("commit"), "commit");
      const modeRaw = str("mode");
      const mode = modeRaw === "soft" || modeRaw === "hard" ? modeRaw : "mixed";
      return runGitMutation(cwd, git, ["reset", `--${mode}`, commit]);
    }
    case "dropCommit": {
      const commit = assertSafeGitToken(str("commit"), "commit");
      const branch = str("branch");
      const revParseRes = await git({
        cwd,
        args: ["rev-parse", "--verify", "-q", `${commit}^`],
        timeoutMs: 5e3
      });
      if (revParseRes.code !== 0) {
        return {
          ok: false,
          stdout: "",
          stderr: revParseRes.stderr,
          error: `Cannot drop commit ${commit.slice(0, 7)}: root commits have no parent to rebase onto.`
        };
      }
      const rebaseArgs = ["rebase", "--onto", `${commit}^`, commit];
      if (branch) {
        rebaseArgs.push(assertSafeGitToken(branch, "branch"));
      }
      return runGitMutation(cwd, git, rebaseArgs);
    }
    // --- Tag Actions ---
    case "addTag": {
      const tag = assertSafeGitToken(str("tag"), "tag name");
      const commit = assertSafeGitToken(str("commit") || "HEAD", "commit");
      const annotated = bool("annotated");
      const message = str("message");
      const force = bool("force");
      const pushToRemote = str("pushToRemote");
      const cmd = ["tag"];
      if (force) cmd.push("-f");
      if (annotated || args.signTags) {
        cmd.push(args.signTags ? "-s" : "-a", tag, "-m", message || tag, commit);
      } else {
        cmd.push(tag, commit);
      }
      const res = await runGitMutation(cwd, git, cmd);
      if (!res.ok || !pushToRemote) return res;
      return runGitMutation(
        cwd,
        git,
        ["push", assertSafeGitToken(pushToRemote, "remote"), `refs/tags/${tag}`],
        6e4
      );
    }
    case "deleteTag": {
      const tag = assertSafeGitToken(str("tag"), "tag name");
      const deleteFromRemote = str("deleteFromRemote");
      const res = await runGitMutation(cwd, git, ["tag", "-d", tag]);
      if (!res.ok || !deleteFromRemote) return res;
      return runGitMutation(
        cwd,
        git,
        ["push", assertSafeGitToken(deleteFromRemote, "remote"), "--delete", `refs/tags/${tag}`],
        6e4
      );
    }
    case "pushTag": {
      const tag = assertSafeGitToken(str("tag"), "tag name");
      const remote = assertSafeGitToken(str("remote") || "origin", "remote");
      return runGitMutation(cwd, git, ["push", remote, `refs/tags/${tag}`], 6e4);
    }
    // --- Stash & Uncommitted Actions ---
    case "commitUncommitted": {
      const message = str("message");
      if (!message) return { ok: false, error: "Commit message is required." };
      const staged = await runGitMutation(cwd, git, ["add", "-A"]);
      if (!staged.ok) return staged;
      return runGitMutation(cwd, git, ["commit", "-m", message]);
    }
    case "stashPush": {
      const message = str("message");
      const includeUntracked = bool("includeUntracked");
      const cmd = ["stash", "push"];
      if (includeUntracked) cmd.push("--include-untracked");
      if (message) cmd.push("-m", message);
      const res = await runGitMutation(cwd, git, cmd);
      if (!res.ok && res.error && /you do not have the initial commit yet/i.test(res.error)) {
        return {
          ...res,
          error: "Cannot stash: Git requires at least one commit in the repository before stashing. Please create an initial commit first."
        };
      }
      return res;
    }
    case "stashPop": {
      const selector = assertSafeGitToken(str("selector") || "stash@{0}", "stash selector");
      const reinstateIndex = bool("reinstateIndex");
      const cmd = ["stash", "pop"];
      if (reinstateIndex) cmd.push("--index");
      cmd.push(selector);
      return runGitMutation(cwd, git, cmd);
    }
    case "stashApply": {
      const selector = assertSafeGitToken(str("selector") || "stash@{0}", "stash selector");
      const reinstateIndex = bool("reinstateIndex");
      const cmd = ["stash", "apply"];
      if (reinstateIndex) cmd.push("--index");
      cmd.push(selector);
      return runGitMutation(cwd, git, cmd);
    }
    case "stashDrop": {
      const selector = assertSafeGitToken(str("selector") || "stash@{0}", "stash selector");
      return runGitMutation(cwd, git, ["stash", "drop", selector]);
    }
    case "stashBranch": {
      const branch = assertSafeGitToken(str("branch"), "branch name");
      const selector = assertSafeGitToken(str("selector") || "stash@{0}", "stash selector");
      return runGitMutation(cwd, git, ["stash", "branch", branch, selector]);
    }
    case "resetUncommitted": {
      const mode = str("mode") === "hard" ? "hard" : "mixed";
      return runGitMutation(cwd, git, ["reset", `--${mode}`, "HEAD"]);
    }
    case "cleanUntracked": {
      const includeDirectories = bool("includeDirectories");
      const cmd = ["clean", "-f"];
      if (includeDirectories) cmd.push("-d");
      return runGitMutation(cwd, git, cmd);
    }
    case "discardAll": {
      const resetRes = await runGitMutation(cwd, git, ["reset", "--hard", "HEAD"]);
      if (!resetRes.ok) return resetRes;
      return runGitMutation(cwd, git, ["clean", "-f", "-d"]);
    }
    // --- Remote Management ---
    case "addRemote": {
      const name = assertSafeGitToken(str("name"), "remote name");
      const url = assertSafeGitToken(str("url"), "remote URL");
      const fetchNow = bool("fetch");
      const cmd = ["remote", "add"];
      if (fetchNow) cmd.push("-f");
      cmd.push(name, url);
      return runGitMutation(cwd, git, cmd, 6e4);
    }
    case "editRemote": {
      const oldName = assertSafeGitToken(str("oldName"), "remote name");
      const newName = assertSafeGitToken(str("newName") || oldName, "new remote name");
      const url = assertSafeGitToken(str("url"), "remote URL");
      if (oldName !== newName) {
        const renameRes = await runGitMutation(cwd, git, ["remote", "rename", oldName, newName]);
        if (!renameRes.ok) return renameRes;
      }
      return runGitMutation(cwd, git, ["remote", "set-url", newName, url]);
    }
    case "deleteRemote": {
      const name = assertSafeGitToken(str("name"), "remote name");
      return runGitMutation(cwd, git, ["remote", "remove", name]);
    }
    case "pruneRemote": {
      const name = assertSafeGitToken(str("name"), "remote name");
      return runGitMutation(cwd, git, ["remote", "prune", name], 6e4);
    }
    default:
      return {
        ok: false,
        stdout: "",
        stderr: "",
        error: `Unsupported Git action: ${action}`
      };
  }
}
async function getTagDetails(args) {
  const safeTag = assertSafeGitToken(args.tagName, "tag name");
  const typeRes = await args.git({
    cwd: args.cwd,
    args: ["cat-file", "-t", `refs/tags/${safeTag}`],
    timeoutMs: 5e3
  });
  const isAnnotated = typeRes.code === 0 && typeRes.stdout.trim() === "tag";
  if (!isAnnotated) {
    const revRes = await args.git({
      cwd: args.cwd,
      args: ["rev-parse", `refs/tags/${safeTag}`],
      timeoutMs: 5e3
    });
    return {
      name: safeTag,
      hash: revRes.stdout.trim(),
      isAnnotated: false
    };
  }
  const format = "%(*objectname)%(taggername)%(taggeremail)%(taggerdate:unix)%(contents)";
  const refRes = await args.git({
    cwd: args.cwd,
    args: ["for-each-ref", `--format=${format}`, `refs/tags/${safeTag}`],
    timeoutMs: 5e3
  });
  const [hash = "", taggerName = "", taggerEmail = "", dateStr = "0", ...msgParts] = refRes.stdout.split("");
  return {
    name: safeTag,
    hash: hash.trim(),
    isAnnotated: true,
    taggerName: taggerName.trim() || void 0,
    taggerEmail: taggerEmail.trim().replace(/^<|>$/g, "") || void 0,
    taggerDate: Number.parseInt(dateStr.trim(), 10) || void 0,
    message: msgParts.join("").trim() || void 0
  };
}
function buildPullRequestUrl(args) {
  const { sourceBranch, config, remotes } = args;
  const remote = remotes.find((r) => r.name === config.remoteName) ?? remotes.find((r) => r.name === "origin") ?? remotes[0];
  if (!remote) return null;
  const rawUrl = remote.pushUrl || remote.fetchUrl;
  let host = "";
  let owner = "";
  let repo = "";
  const sshMatch = /^git@([^:]+):([^/]+)\/(.+?)(?:\.git)?$/.exec(rawUrl);
  const httpsMatch = /^https?:\/\/([^/]+)\/([^/]+)\/(.+?)(?:\.git)?$/.exec(rawUrl);
  const sshUrlMatch = /^ssh:\/\/(?:[^@]+@)?([^/:]+)(?::\d+)?\/([^/]+)\/(.+?)(?:\.git)?$/.exec(rawUrl);
  const match = sshMatch ?? httpsMatch ?? sshUrlMatch;
  if (match) {
    host = match[1];
    owner = match[2];
    repo = match[3].replace(/\.git$/i, "");
  }
  const target = config.targetBranch || "main";
  const encSource = encodeURIComponent(sourceBranch);
  const encTarget = encodeURIComponent(target);
  if (config.provider === "custom" && config.customUrlTemplate) {
    return config.customUrlTemplate.replace(/\$1/g, host).replace(/\$2/g, owner).replace(/\$3/g, repo).replace(/\$4/g, encSource).replace(/\$5/g, encTarget);
  }
  if (!host || !owner || !repo) return null;
  const baseUrl = `https://${host}/${owner}/${repo}`;
  if (config.provider === "gitlab" || host.includes("gitlab")) {
    return `${baseUrl}/-/merge_requests/new?merge_request[source_branch]=${encSource}&merge_request[target_branch]=${encTarget}`;
  }
  if (config.provider === "bitbucket" || host.includes("bitbucket")) {
    return `${baseUrl}/pull-requests/new?source=${encSource}&dest=${encTarget}&t=1`;
  }
  return `${baseUrl}/compare/${encTarget}...${encSource}?expand=1`;
}

// src/server/storage.ts
var NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1e3;
var DEFAULT_COLUMN_WIDTHS = {
  date: 125,
  author: 130,
  commit: 74
};
var DEFAULT_GRAPH_COLORS = [
  "#0085d9",
  "#d9008f",
  "#00d90a",
  "#d98500",
  "#a300d9",
  "#ff0000",
  "#00d9cc",
  "#e138e8",
  "#85d900",
  "#dc5b23",
  "#6f24d6",
  "#ffcc00"
];
var DEFAULT_GLOBAL_SETTINGS = {
  graphStyle: "rounded",
  initialLoadCommits: 300,
  loadMoreCommits: 100,
  muteNonAncestors: false,
  muteMergeCommits: true,
  commitDetailsLocation: "docked",
  fileViewType: "tree",
  compactFolders: true,
  diffViewMode: "unified",
  maxDepthOfRepoSearch: 2,
  dateType: "author",
  dateFormat: "relative",
  fetchAndPrune: false,
  fetchAndPruneTags: false,
  signCommits: false,
  signTags: false,
  useMailmap: true,
  graphColors: DEFAULT_GRAPH_COLORS,
  columnWidths: DEFAULT_COLUMN_WIDTHS
};
var DEFAULT_REPO_SETTINGS = {
  selectedBranches: [],
  showRemoteBranches: true,
  showStashes: true,
  showTags: true,
  showUncommittedChanges: true,
  showUntrackedFiles: true,
  onlyFollowFirstParent: false,
  commitOrdering: "date",
  issueLinkingRules: [],
  pullRequestConfig: {
    provider: "github",
    remoteName: "origin",
    targetBranch: "main"
  }
};
function repoSettingsKey(projectId, subRepoRelPath) {
  return `repo-settings:${projectId}:${subRepoRelPath || "root"}`;
}
function codeReviewKey(projectId, subRepoRelPath, fromHash, toHash) {
  return `code-review:${projectId}:${subRepoRelPath || "root"}:${fromHash || "single"}:${toHash}`;
}
var GitGraphStorage = class {
  constructor(kv, now = () => Date.now()) {
    this.kv = kv;
    this.now = now;
  }
  kv;
  now;
  async getRepoSettings(projectId, subRepoRelPath = "") {
    const stored = await this.kv.get(repoSettingsKey(projectId, subRepoRelPath));
    if (!stored || typeof stored !== "object") {
      return {
        ...DEFAULT_REPO_SETTINGS,
        pullRequestConfig: { ...DEFAULT_REPO_SETTINGS.pullRequestConfig }
      };
    }
    return {
      ...DEFAULT_REPO_SETTINGS,
      ...stored,
      selectedBranches: Array.isArray(stored.selectedBranches) ? stored.selectedBranches : [],
      issueLinkingRules: Array.isArray(stored.issueLinkingRules) ? stored.issueLinkingRules : [],
      pullRequestConfig: {
        ...DEFAULT_REPO_SETTINGS.pullRequestConfig,
        ...stored.pullRequestConfig ?? {}
      }
    };
  }
  async saveRepoSettings(projectId, subRepoRelPath, patch) {
    const current = await this.getRepoSettings(projectId, subRepoRelPath);
    const updated = {
      ...current,
      ...patch,
      pullRequestConfig: {
        ...current.pullRequestConfig,
        ...patch.pullRequestConfig ?? {}
      }
    };
    await this.kv.set(repoSettingsKey(projectId, subRepoRelPath), updated);
    return updated;
  }
  async getCodeReview(args) {
    const key = codeReviewKey(args.projectId, args.subRepoRelPath, args.fromHash, args.toHash);
    const record = await this.kv.get(key);
    if (!record) return null;
    if (this.now() - record.lastActiveAt > NINETY_DAYS_MS) {
      await this.kv.delete(key);
      return null;
    }
    return record;
  }
  async startCodeReview(args) {
    const key = codeReviewKey(args.projectId, args.subRepoRelPath, args.fromHash, args.toHash);
    const existing = await this.getCodeReview(args);
    if (existing) return existing;
    const now = this.now();
    const record = {
      key,
      projectId: args.projectId,
      subRepoRelPath: args.subRepoRelPath,
      fromHash: args.fromHash,
      toHash: args.toHash,
      reviewedFiles: [],
      startedAt: now,
      lastActiveAt: now
    };
    await this.kv.set(key, record);
    return record;
  }
  async setCodeReviewFileReviewed(args) {
    const current = await this.getCodeReview(args) ?? await this.startCodeReview(args);
    const set = new Set(current.reviewedFiles);
    if (args.reviewed) {
      set.add(args.filePath);
    } else {
      set.delete(args.filePath);
    }
    const updated = {
      ...current,
      reviewedFiles: [...set],
      lastActiveAt: this.now()
    };
    await this.kv.set(current.key, updated);
    return updated;
  }
  async endCodeReview(args) {
    const key = codeReviewKey(args.projectId, args.subRepoRelPath, args.fromHash, args.toHash);
    await this.kv.delete(key);
  }
  async listProjectCodeReviews(projectId) {
    const prefix = `code-review:${projectId}:`;
    const keys = await this.kv.list(prefix);
    const records = [];
    const now = this.now();
    for (const key of keys) {
      const record = await this.kv.get(key);
      if (!record) continue;
      if (now - record.lastActiveAt > NINETY_DAYS_MS) {
        await this.kv.delete(key);
        continue;
      }
      records.push(record);
    }
    return records.sort((a, b) => b.lastActiveAt - a.lastActiveAt);
  }
};

// server.ts
var GIT_TREE_CHANGED_CHANNEL = "git-tree:changed";
var GIT_GRAPH_CHANGED_CHANNEL = "git-graph:changed";
function asRecord(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}
function asString(record, key) {
  const val = record[key];
  return typeof val === "string" ? val.trim() : "";
}
async function createGitTreePlugin(zcc, deps = {}) {
  const git = deps.git ?? createTempFileGitRunner();
  const fs = deps.fs ?? createNodeFsDeps();
  const storage = new GitGraphStorage(zcc.storage.kv, deps.now);
  const settingsHandle = zcc.settings.define({
    graphStyle: {
      type: "select",
      label: "Graph style",
      description: "Render branch and merge lines with rounded curves or angular segments.",
      options: ["rounded", "angular"],
      default: DEFAULT_GLOBAL_SETTINGS.graphStyle
    },
    initialLoadCommits: {
      type: "number",
      label: "Initial commits to load",
      description: "Number of commits loaded initially when opening Git Graph.",
      default: DEFAULT_GLOBAL_SETTINGS.initialLoadCommits,
      min: 25,
      max: 2e3
    },
    loadMoreCommits: {
      type: "number",
      label: "Load more batch size",
      description: "Additional commits loaded when clicking Load More Commits.",
      default: DEFAULT_GLOBAL_SETTINGS.loadMoreCommits,
      min: 25,
      max: 1e3
    },
    commitDetailsLocation: {
      type: "select",
      label: "Commit Details view location",
      description: "Render Commit Details in a docked split inspector or inline below the selected commit row.",
      options: ["docked", "inline"],
      default: DEFAULT_GLOBAL_SETTINGS.commitDetailsLocation
    },
    fileViewType: {
      type: "select",
      label: "Default File View type",
      description: "Display changed files as a hierarchical File Tree or flat File List.",
      options: ["tree", "list"],
      default: DEFAULT_GLOBAL_SETTINGS.fileViewType
    },
    compactFolders: {
      type: "boolean",
      label: "Compact folders in File Tree",
      description: "Compress single-child folders into a single combined folder path.",
      default: DEFAULT_GLOBAL_SETTINGS.compactFolders
    },
    diffViewMode: {
      type: "select",
      label: "Default Diff viewer layout",
      description: "Show file diffs in unified or side-by-side split mode.",
      options: ["unified", "split"],
      default: DEFAULT_GLOBAL_SETTINGS.diffViewMode
    },
    muteNonAncestors: {
      type: "boolean",
      label: "Mute commits that are not ancestors of HEAD",
      description: "Render commits outside the checked-out branch ancestry with muted text.",
      default: DEFAULT_GLOBAL_SETTINGS.muteNonAncestors
    },
    muteMergeCommits: {
      type: "boolean",
      label: "Mute merge commits",
      description: "Display merge commits with a slightly muted text color.",
      default: DEFAULT_GLOBAL_SETTINGS.muteMergeCommits
    },
    dateType: {
      type: "select",
      label: "Date column type",
      description: "Display either author date or commit date in the Date column.",
      options: ["author", "commit"],
      default: DEFAULT_GLOBAL_SETTINGS.dateType
    },
    dateFormat: {
      type: "select",
      label: "Date column format",
      description: "Format timestamps as relative age, ISO date, or full date & time.",
      options: ["relative", "iso", "datetime"],
      default: DEFAULT_GLOBAL_SETTINGS.dateFormat
    },
    maxDepthOfRepoSearch: {
      type: "number",
      label: "Max depth of repository search",
      description: "Maximum depth of subfolders to scan when discovering nested repositories in a project.",
      default: DEFAULT_GLOBAL_SETTINGS.maxDepthOfRepoSearch,
      min: 0,
      max: 5
    },
    fetchAndPrune: {
      type: "boolean",
      label: "Fetch and prune remotes by default",
      description: "Automatically pass --prune when fetching from remotes.",
      default: DEFAULT_GLOBAL_SETTINGS.fetchAndPrune
    },
    fetchAndPruneTags: {
      type: "boolean",
      label: "Fetch and prune tags by default",
      description: "Automatically pass --prune-tags when fetching from remotes.",
      default: DEFAULT_GLOBAL_SETTINGS.fetchAndPruneTags
    },
    signCommits: {
      type: "boolean",
      label: "Sign commits (GPG / X.509)",
      description: "Pass -S when creating merge, cherry-pick, or revert commits.",
      default: DEFAULT_GLOBAL_SETTINGS.signCommits
    },
    signTags: {
      type: "boolean",
      label: "Sign tags (GPG / X.509)",
      description: "Pass -s when creating tags.",
      default: DEFAULT_GLOBAL_SETTINGS.signTags
    },
    useMailmap: {
      type: "boolean",
      label: "Respect .mailmap",
      description: "Use .mailmap when resolving author and committer names and emails.",
      default: DEFAULT_GLOBAL_SETTINGS.useMailmap
    }
  });
  async function readGlobalSettings() {
    const raw = await settingsHandle.get();
    const customOverride = await zcc.storage.kv.get("global-settings-override");
    const merged = { ...raw, ...customOverride ?? {} };
    return {
      graphStyle: merged.graphStyle === "angular" ? "angular" : "rounded",
      initialLoadCommits: typeof merged.initialLoadCommits === "number" ? Math.max(25, Math.min(2e3, merged.initialLoadCommits)) : DEFAULT_GLOBAL_SETTINGS.initialLoadCommits,
      loadMoreCommits: typeof merged.loadMoreCommits === "number" ? Math.max(25, Math.min(1e3, merged.loadMoreCommits)) : DEFAULT_GLOBAL_SETTINGS.loadMoreCommits,
      muteNonAncestors: typeof merged.muteNonAncestors === "boolean" ? merged.muteNonAncestors : DEFAULT_GLOBAL_SETTINGS.muteNonAncestors,
      muteMergeCommits: typeof merged.muteMergeCommits === "boolean" ? merged.muteMergeCommits : DEFAULT_GLOBAL_SETTINGS.muteMergeCommits,
      commitDetailsLocation: merged.commitDetailsLocation === "inline" ? "inline" : "docked",
      fileViewType: merged.fileViewType === "list" ? "list" : "tree",
      compactFolders: typeof merged.compactFolders === "boolean" ? merged.compactFolders : DEFAULT_GLOBAL_SETTINGS.compactFolders,
      diffViewMode: merged.diffViewMode === "split" ? "split" : "unified",
      maxDepthOfRepoSearch: typeof merged.maxDepthOfRepoSearch === "number" ? Math.max(0, Math.min(5, merged.maxDepthOfRepoSearch)) : DEFAULT_GLOBAL_SETTINGS.maxDepthOfRepoSearch,
      dateType: merged.dateType === "commit" ? "commit" : "author",
      dateFormat: merged.dateFormat === "iso" || merged.dateFormat === "datetime" ? merged.dateFormat : "relative",
      fetchAndPrune: typeof merged.fetchAndPrune === "boolean" ? merged.fetchAndPrune : DEFAULT_GLOBAL_SETTINGS.fetchAndPrune,
      fetchAndPruneTags: typeof merged.fetchAndPruneTags === "boolean" ? merged.fetchAndPruneTags : DEFAULT_GLOBAL_SETTINGS.fetchAndPruneTags,
      signCommits: typeof merged.signCommits === "boolean" ? merged.signCommits : DEFAULT_GLOBAL_SETTINGS.signCommits,
      signTags: typeof merged.signTags === "boolean" ? merged.signTags : DEFAULT_GLOBAL_SETTINGS.signTags,
      useMailmap: typeof merged.useMailmap === "boolean" ? merged.useMailmap : DEFAULT_GLOBAL_SETTINGS.useMailmap,
      graphColors: Array.isArray(merged.graphColors) && merged.graphColors.length > 0 ? merged.graphColors : DEFAULT_GLOBAL_SETTINGS.graphColors
    };
  }
  zcc.ui.registerProjectTabAvailability({
    tabId: "git-tree",
    async evaluate({ projectId }) {
      try {
        await resolveConfinedRepoPath({
          projectId,
          listProjects: () => zcc.sdk.projects.list(),
          fs
        });
        return { available: true };
      } catch (err) {
        return {
          available: false,
          reason: err instanceof Error ? err.message : "Project folder is unavailable"
        };
      }
    }
  });
  async function resolveRepoContext(rec) {
    const projectId = asString(rec, "projectId");
    const subRepoRelPath = asString(rec, "subRepoRelPath");
    const confined = await resolveConfinedRepoPath({
      projectId,
      subRepoRelPath,
      listProjects: () => zcc.sdk.projects.list(),
      fs
    });
    return { projectId, subRepoRelPath, confined };
  }
  zcc.rpc.method("listProjects", async () => {
    const list = await zcc.sdk.projects.list();
    return list.map((p) => ({
      id: p.id,
      name: p.name,
      path: p.path
    }));
  });
  zcc.rpc.method("discoverRepos", async (rawArgs) => {
    const rec = asRecord(rawArgs);
    const globalSettings = await readGlobalSettings();
    const { confined } = await resolveRepoContext(rec);
    const repos = await discoverProjectRepos({
      canonicalProjectRoot: confined.canonicalProjectRoot,
      maxDepth: globalSettings.maxDepthOfRepoSearch,
      git,
      fs
    });
    return { repos, globalSettings };
  });
  zcc.rpc.method("loadGraph", async (rawArgs) => {
    const rec = asRecord(rawArgs);
    const globalSettings = await readGlobalSettings();
    const { projectId, confined } = await resolveRepoContext(rec);
    const repoSettings = await storage.getRepoSettings(projectId, confined.subRepoRelPath);
    const maxCommits = typeof rec.maxCommits === "number" && Number.isFinite(rec.maxCommits) ? Math.max(25, Math.min(2e3, Math.floor(rec.maxCommits))) : globalSettings.initialLoadCommits;
    const graph = await loadRepositoryGraph({
      cwd: confined.canonicalRepoRoot,
      git,
      maxCommits,
      selectedBranches: Array.isArray(rec.selectedBranches) ? rec.selectedBranches : repoSettings.selectedBranches,
      showRemoteBranches: typeof rec.showRemoteBranches === "boolean" ? rec.showRemoteBranches : repoSettings.showRemoteBranches,
      showTags: typeof rec.showTags === "boolean" ? rec.showTags : repoSettings.showTags,
      showStashes: typeof rec.showStashes === "boolean" ? rec.showStashes : repoSettings.showStashes,
      showUncommittedChanges: typeof rec.showUncommittedChanges === "boolean" ? rec.showUncommittedChanges : repoSettings.showUncommittedChanges,
      showUntrackedFiles: typeof rec.showUntrackedFiles === "boolean" ? rec.showUntrackedFiles : repoSettings.showUntrackedFiles,
      onlyFollowFirstParent: typeof rec.onlyFollowFirstParent === "boolean" ? rec.onlyFollowFirstParent : repoSettings.onlyFollowFirstParent,
      commitOrdering: rec.commitOrdering === "topo" || rec.commitOrdering === "author-date" || rec.commitOrdering === "date" ? rec.commitOrdering : repoSettings.commitOrdering,
      useMailmap: globalSettings.useMailmap
    });
    return {
      repo: {
        relPath: confined.subRepoRelPath,
        label: confined.subRepoRelPath ? `${confined.project.name} / ${confined.subRepoRelPath}` : confined.project.name,
        currentBranch: graph.currentBranch,
        headHash: graph.headHash,
        isWorktree: false
      },
      ...graph,
      repoSettings,
      globalSettings
    };
  });
  zcc.rpc.method("getCommitDetails", async (rawArgs) => {
    const rec = asRecord(rawArgs);
    const commitHash = asString(rec, "commitHash");
    const { projectId, confined } = await resolveRepoContext(rec);
    const repoSettings = await storage.getRepoSettings(projectId, confined.subRepoRelPath);
    const details = await loadCommitDetails({
      cwd: confined.canonicalRepoRoot,
      git,
      commitHash,
      showUntrackedFiles: repoSettings.showUntrackedFiles
    });
    const codeReview = await storage.getCodeReview({
      projectId,
      subRepoRelPath: confined.subRepoRelPath,
      fromHash: null,
      toHash: commitHash
    });
    return { details, codeReview };
  });
  zcc.rpc.method("compareCommits", async (rawArgs) => {
    const rec = asRecord(rawArgs);
    const fromHash = asString(rec, "fromHash");
    const toHash = asString(rec, "toHash");
    const { projectId, confined } = await resolveRepoContext(rec);
    const comparison = await compareCommits({
      cwd: confined.canonicalRepoRoot,
      git,
      fromHash,
      toHash
    });
    const codeReview = await storage.getCodeReview({
      projectId,
      subRepoRelPath: confined.subRepoRelPath,
      fromHash,
      toHash
    });
    return { comparison, codeReview };
  });
  zcc.rpc.method("getFileDiff", async (rawArgs) => {
    const rec = asRecord(rawArgs);
    const commitHash = asString(rec, "commitHash");
    const fromHash = asString(rec, "fromHash") || void 0;
    const filePath = asString(rec, "filePath");
    const oldPath = asString(rec, "oldPath") || void 0;
    const { confined } = await resolveRepoContext(rec);
    return loadFileDiff({
      cwd: confined.canonicalRepoRoot,
      git,
      commitHash,
      fromHash,
      filePath,
      oldPath
    });
  });
  zcc.rpc.method("getFileContent", async (rawArgs) => {
    const rec = asRecord(rawArgs);
    const commitHash = asString(rec, "commitHash");
    const filePath = asString(rec, "filePath");
    const { confined } = await resolveRepoContext(rec);
    return loadFileContent({
      cwd: confined.canonicalRepoRoot,
      git,
      commitHash,
      filePath
    });
  });
  zcc.rpc.method("runGitAction", async (rawArgs) => {
    const rec = asRecord(rawArgs);
    let action = "";
    let params = {};
    if (typeof rec.action === "string") {
      action = rec.action.trim();
      params = asRecord(rec.params);
    } else if (rec.action && typeof rec.action === "object") {
      const actionObj = asRecord(rec.action);
      const rawKind = asString(actionObj, "kind");
      const kindMap = {
        init: "init",
        "init-repo": "init",
        "checkout-branch": "checkoutBranch",
        "create-branch": "createBranch",
        "rename-branch": "renameBranch",
        "delete-branch": "deleteBranch",
        "delete-remote-branch": "deleteRemoteBranch",
        "push-branch": "push",
        "pull-branch": "pull",
        "fetch-into-local-branch": "fetch",
        "checkout-commit": "checkoutCommit",
        "cherry-pick": "cherryPick",
        "revert-commit": "revertCommit",
        "reset-to-commit": "resetToCommit",
        "drop-commit": "dropCommit",
        "create-tag": "addTag",
        "delete-tag": "deleteTag",
        "push-tag": "pushTag",
        "commit-uncommitted": "commitUncommitted",
        "stash-push": "stashPush",
        "stash-pop": "stashPop",
        "stash-apply": "stashApply",
        "stash-drop": "stashDrop",
        "stash-branch": "stashBranch",
        "reset-uncommitted": "resetUncommitted",
        "clean-untracked": "cleanUntracked",
        "discard-all": "discardAll",
        "remote-add": "addRemote",
        "remote-edit": "editRemote",
        "remote-delete": "deleteRemote",
        "remote-prune": "pruneRemote"
      };
      action = kindMap[rawKind] ?? rawKind;
      params = {
        ...actionObj,
        branch: actionObj.branch ?? actionObj.branchName,
        remoteBranch: actionObj.remoteBranch ?? actionObj.createAndTrackFrom,
        target: actionObj.target ?? actionObj.startPoint,
        commit: actionObj.commit ?? actionObj.commitHash,
        tag: actionObj.tag ?? actionObj.tagName
      };
    }
    const { projectId, confined } = await resolveRepoContext(rec);
    const globalSettings = await readGlobalSettings();
    const outcome = await executeGitAction({
      cwd: confined.canonicalRepoRoot,
      git,
      action,
      params,
      signCommits: globalSettings.signCommits,
      signTags: globalSettings.signTags
    });
    if (outcome.ok) {
      const payload = {
        projectId,
        subRepoRelPath: confined.subRepoRelPath,
        action
      };
      zcc.realtime.publish(GIT_TREE_CHANGED_CHANNEL, payload);
      zcc.realtime.publish(GIT_GRAPH_CHANGED_CHANNEL, payload);
    } else if (outcome.error) {
      throw new Error(outcome.error);
    }
    return outcome;
  });
  zcc.rpc.method("getTagDetails", async (rawArgs) => {
    const rec = asRecord(rawArgs);
    const tagName = asString(rec, "tagName");
    const { confined } = await resolveRepoContext(rec);
    return getTagDetails({
      cwd: confined.canonicalRepoRoot,
      git,
      tagName
    });
  });
  zcc.rpc.method("buildPullRequestUrl", async (rawArgs) => {
    const rec = asRecord(rawArgs);
    const sourceBranch = asString(rec, "sourceBranch");
    const { projectId, confined } = await resolveRepoContext(rec);
    const repoSettings = await storage.getRepoSettings(projectId, confined.subRepoRelPath);
    const remotesRes = await git({
      cwd: confined.canonicalRepoRoot,
      args: ["remote", "-v"],
      timeoutMs: 8e3
    });
    const remotes = parseGitRemotesOutput(remotesRes.stdout);
    const url = buildPullRequestUrl({
      sourceBranch,
      config: repoSettings.pullRequestConfig,
      remotes
    });
    return { url };
  });
  zcc.rpc.method("codeReviewStart", async (rawArgs) => {
    const rec = asRecord(rawArgs);
    const projectId = asString(rec, "projectId");
    const subRepoRelPath = asString(rec, "subRepoRelPath");
    const fromHash = asString(rec, "fromHash") || null;
    const toHash = asString(rec, "toHash");
    return storage.startCodeReview({ projectId, subRepoRelPath, fromHash, toHash });
  });
  zcc.rpc.method("codeReviewToggleFile", async (rawArgs) => {
    const rec = asRecord(rawArgs);
    const projectId = asString(rec, "projectId");
    const subRepoRelPath = asString(rec, "subRepoRelPath");
    const fromHash = asString(rec, "fromHash") || null;
    const toHash = asString(rec, "toHash");
    const filePath = asString(rec, "filePath");
    const reviewed = Boolean(rec.reviewed);
    return storage.setCodeReviewFileReviewed({
      projectId,
      subRepoRelPath,
      fromHash,
      toHash,
      filePath,
      reviewed
    });
  });
  zcc.rpc.method("codeReviewEnd", async (rawArgs) => {
    const rec = asRecord(rawArgs);
    const projectId = asString(rec, "projectId");
    const subRepoRelPath = asString(rec, "subRepoRelPath");
    const fromHash = asString(rec, "fromHash") || null;
    const toHash = asString(rec, "toHash");
    await storage.endCodeReview({ projectId, subRepoRelPath, fromHash, toHash });
    return { ok: true };
  });
  zcc.rpc.method("listCodeReviews", async (rawArgs) => {
    const rec = asRecord(rawArgs);
    const projectId = asString(rec, "projectId");
    return storage.listProjectCodeReviews(projectId);
  });
  zcc.rpc.method("updateRepoSettings", async (rawArgs) => {
    const rec = asRecord(rawArgs);
    const patch = asRecord(rec.settings ?? rec.patch);
    const { projectId, confined } = await resolveRepoContext(rec);
    const updated = await storage.saveRepoSettings(projectId, confined.subRepoRelPath, patch);
    const repoPayload = {
      projectId,
      subRepoRelPath: confined.subRepoRelPath,
      action: "updateRepoSettings"
    };
    zcc.realtime.publish(GIT_TREE_CHANGED_CHANNEL, repoPayload);
    zcc.realtime.publish(GIT_GRAPH_CHANGED_CHANNEL, repoPayload);
    return updated;
  });
  zcc.rpc.method("updateGlobalSettings", async (rawArgs) => {
    const rec = asRecord(rawArgs);
    const patch = asRecord(rec.settings ?? rec.patch);
    const current = await zcc.storage.kv.get("global-settings-override") ?? {};
    await zcc.storage.kv.set("global-settings-override", { ...current, ...patch });
    const next = await readGlobalSettings();
    zcc.realtime.publish(GIT_TREE_CHANGED_CHANNEL, { action: "updateGlobalSettings" });
    zcc.realtime.publish(GIT_GRAPH_CHANGED_CHANNEL, { action: "updateGlobalSettings" });
    return next;
  });
  zcc.rpc.method("exportRepoConfig", async (rawArgs) => {
    const rec = asRecord(rawArgs);
    const { projectId, confined } = await resolveRepoContext(rec);
    const repoSettings = await storage.getRepoSettings(projectId, confined.subRepoRelPath);
    const targetFile = join4(confined.canonicalRepoRoot, ".git-tree.json");
    const tmp = `${targetFile}.${process.pid}.${Date.now()}.${Math.random().toString(36).slice(2)}.tmp`;
    try {
      writeFileSync(tmp, `${JSON.stringify(repoSettings, null, 2)}
`, "utf8");
      renameSync(tmp, targetFile);
    } catch (err) {
      try {
        if (existsSync3(tmp)) unlinkSync(tmp);
      } catch {
      }
      throw err;
    }
    return { ok: true, path: ".git-tree.json", filePath: targetFile };
  });
  async function buildCommitAgentPromptContext(rawArgs) {
    const rec = asRecord(rawArgs);
    const commitHash = asString(rec, "commitHash") || "HEAD";
    const fromHash = asString(rec, "fromHash");
    const filePath = asString(rec, "filePath");
    const userPrompt = asString(rec, "prompt") || asString(rec, "userPrompt") || (commitHash === "*" ? "Review the working tree changes and highlight any potential regressions or issues." : fromHash ? `Compare the changes between ${fromHash.slice(0, 8)} and ${commitHash.slice(0, 8)} and highlight any potential regressions or issues.` : filePath ? `Review the changes in ${filePath} and explain potential regressions or issues.` : `Explain commit ${commitHash.slice(0, 8)} and highlight any potential issues.`);
    const { projectId, confined } = await resolveRepoContext(rec);
    let contextSummary = "";
    if (filePath) {
      const diff = await loadFileDiff({
        cwd: confined.canonicalRepoRoot,
        git,
        commitHash,
        fromHash: fromHash || void 0,
        filePath
      });
      contextSummary = [
        `Repository: ${confined.subRepoRelPath || "."}`,
        fromHash ? `Comparison: ${fromHash} .. ${commitHash}` : `Commit: ${commitHash}`,
        `File: ${filePath}`,
        "```diff",
        diff.rawDiff.slice(0, 12e3),
        "```"
      ].join("\n");
    } else if (fromHash) {
      const comp = await compareCommits({
        cwd: confined.canonicalRepoRoot,
        git,
        fromHash,
        toHash: commitHash
      });
      contextSummary = [
        `Repository: ${confined.subRepoRelPath || "."}`,
        `Comparison: ${fromHash} .. ${commitHash}`,
        `Changed files (${comp.fileChanges.length}):`,
        ...comp.fileChanges.slice(0, 60).map((f) => `- [${f.status}] ${f.newPath} (+${f.additions ?? 0}/-${f.deletions ?? 0})`)
      ].join("\n");
    } else {
      const details = await loadCommitDetails({
        cwd: confined.canonicalRepoRoot,
        git,
        commitHash
      });
      contextSummary = [
        `Repository: ${confined.subRepoRelPath || "."}`,
        `Commit: ${details.hash} (${details.subject})`,
        `Author: ${details.authorName} <${details.authorEmail}>`,
        details.body ? `
${details.body}
` : "",
        `Changed files (${details.fileChanges.length}):`,
        ...details.fileChanges.slice(0, 60).map((f) => `- [${f.status}] ${f.newPath} (+${f.additions ?? 0}/-${f.deletions ?? 0})`)
      ].join("\n");
    }
    const fullPrompt = `${userPrompt}

---
${contextSummary}`;
    const title = `Git Tree: ${filePath ? filePath : commitHash === "*" ? "Working Tree" : commitHash.slice(0, 8)}`;
    return { projectId, prompt: fullPrompt, title };
  }
  zcc.rpc.method("draftAgentAboutCommit", async (rawArgs) => {
    const { projectId, prompt, title } = await buildCommitAgentPromptContext(rawArgs);
    return { ok: true, prompt, title, projectId };
  });
  zcc.rpc.method("askAgentAboutCommit", async (rawArgs) => {
    const { projectId, prompt, title } = await buildCommitAgentPromptContext(rawArgs);
    const spawned = await zcc.sdk.threads.spawn({
      projectId,
      title,
      prompt
    });
    return { ok: true, threadId: spawned.id, title };
  });
  registerGitTreeCliAndTools({
    zcc,
    git,
    fs,
    storage,
    readGlobalSettings
  });
  zcc.log.info("git-tree plugin initialized");
}
export {
  GIT_GRAPH_CHANGED_CHANNEL,
  GIT_TREE_CHANGED_CHANNEL,
  createGitTreePlugin as default
};
//# sourceMappingURL=server.mjs.map
