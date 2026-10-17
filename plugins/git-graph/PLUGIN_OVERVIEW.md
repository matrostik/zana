# Git Graph

View an interactive Git Graph of your project repository in Zana Command Center, modelled after `mhutchie/vscode-git-graph`.

## What you get

- **Per-Project Left Menu Tab (`Git Graph`)**: Opens directly inside any Project workbench (and can be detached into its own window or split pane).
- **Rich Commit DAG Visualization**: Renders local and remote branches, tags, stashes, `HEAD`, and uncommitted changes with rounded or angular SVG branch lanes.
- **Commit Details, Diffs & 2-Commit Comparison**: Click any commit to inspect metadata, GPG signature status, and changed files (Tree or List view) with an inline or side-by-side diff viewer. `Ctrl/Cmd+Click` any second commit to compare two commits or compare uncommitted changes against a commit.
- **Persistent Code Review**: Track which files you have reviewed in any commit or comparison across Zana sessions.
- **Full Git Context-Menu Actions**: Create, checkout, rename, delete, merge, rebase, push, pull, and fetch branches; cherry-pick, revert, reset (`soft` / `mixed` / `hard`), or drop commits; manage tags and stashes; and configure remotes, issue links, and pull request creation links.
- **Zana Agent & CLI Integration**: Spawn a thread with commit or diff context directly from the graph, run `zcc git-graph` from the terminal, or let agents inspect repository history with `git_graph_inspect`.
