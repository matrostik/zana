---
name: git-graph
description: Inspect project Git history, commit topology, branch/tag/stash refs, commit comparisons, and file diffs using the Git Graph plugin (`zcc git-graph` CLI and `git_graph_inspect` tool).
---

# Git Graph Skill

Use the Git Graph plugin when inspecting a project's commit graph, comparing two commits or branches, reviewing uncommitted changes, or checking remotes and stashes.

## CLI Usage

```bash
zcc git-graph repos --project <projectId>
zcc git-graph log --project <projectId> [--max-count 50] [--branches main,feature/foo]
zcc git-graph details --project <projectId> --commit <sha>
zcc git-graph compare --project <projectId> --from <baseSha> --to <headSha>
zcc git-graph diff --project <projectId> --commit <sha> --file <relPath>
zcc git-graph remotes --project <projectId>
```

## Agent Tool (`git_graph_inspect`)

Call `git_graph_inspect` with:
- `action: "log"` — Retrieve structured commits, parents, branches, tags, stashes, and uncommitted change summary.
- `action: "details"` — Retrieve full commit metadata and changed file list for `commit`.
- `action: "compare"` — Compare changed files between `fromCommit` and `toCommit`.
- `action: "diff"` — Retrieve unified and split diff hunks for `filePath` in `commit` (or between `fromCommit` and `toCommit`).
