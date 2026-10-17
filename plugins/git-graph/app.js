function Ge(){return globalThis.__ZCC_PLUGIN_RUNTIME__??{}}function st(o){throw new Error(`${o} is not available until the host plugin runtime is installed`)}function lt(o){return{__zccPluginApp:!0,setup:o}}function ct(){return Ge().useRpc?.()??st("useRpc")}function gt(o,c){Ge().useRealtime?.(o,c)}function dt(){return Ge().useZccContext?.()??{projectId:null,threadId:null}}function pt(){return Ge().useZccNavigate?.()??st("useZccNavigate")}var ut=`
/* ==========================================================================
   Git Graph \u2014 VS Code Authentic Styling
   ========================================================================== */

:root {
  --gg-bg-base: var(--background-base, #1e1e1e);
  --gg-bg-card: var(--background-card, #252526);
  --gg-bg-hover: var(--background-hover, rgba(255, 255, 255, 0.06));
  --gg-bg-selected: rgba(9, 71, 113, 0.65);
  --gg-border-subtle: var(--border-subtle, rgba(255, 255, 255, 0.08));
  --gg-border-strong: var(--border-strong, rgba(255, 255, 255, 0.16));
  --gg-text-normal: var(--text-normal, #cccccc);
  --gg-text-muted: var(--text-muted, #858585);
  --gg-accent: var(--accent, #007acc);
  --gg-accent-hover: #0098ff;
  --gg-font-sans: var(--font-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif);
  --gg-font-mono: var(--font-mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace);
}

/* --------------------------------------------------------------------------
   Root Container & Layout
   -------------------------------------------------------------------------- */
.gg-root,
.git-graph-root {
  height: 100%;
  width: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: var(--gg-bg-base);
  color: var(--gg-text-normal);
  font-family: var(--gg-font-sans);
  font-size: 13px;
  position: relative;
  user-select: none;
  overflow: hidden;
  box-sizing: border-box;
}

.gg-workspace,
.git-graph-workbench {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  position: relative;
  width: 100%;
}

/* --------------------------------------------------------------------------
   Control Bar / Toolbar
   -------------------------------------------------------------------------- */
.gg-control-bar,
.git-graph-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 6px;
  padding: 4px 10px;
  background: var(--gg-bg-card);
  border-bottom: 1px solid var(--gg-border-subtle);
  flex-shrink: 0;
  min-height: 36px;
  box-sizing: border-box;
  overflow: visible;
  position: relative;
  z-index: 20;
}

.git-graph-toolbar-left,
.git-graph-toolbar-right {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.git-graph-title {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-weight: 600;
  font-size: 12.5px;
  color: var(--gg-text-normal);
  margin-right: 4px;
}

/* Buttons */
.gg-btn,
.git-graph-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 3px 8px;
  height: 24px;
  border-radius: 4px;
  border: 1px solid var(--gg-border-subtle);
  background: rgba(255, 255, 255, 0.04);
  color: var(--gg-text-normal);
  font-family: var(--gg-font-sans);
  font-size: 12px;
  line-height: 1;
  cursor: pointer;
  box-sizing: border-box;
  transition: background 100ms ease, border-color 100ms ease, color 100ms ease;
  white-space: nowrap;
}

.gg-btn:hover:not(:disabled),
.git-graph-btn:hover:not(:disabled) {
  background: var(--gg-bg-hover);
  border-color: var(--gg-border-strong);
  color: #ffffff;
}

.gg-btn:disabled,
.git-graph-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.gg-btn-primary,
.git-graph-btn--primary {
  background: var(--gg-accent) !important;
  border-color: var(--gg-accent) !important;
  color: #ffffff !important;
}

.gg-btn-primary:hover:not(:disabled),
.git-graph-btn--primary:hover:not(:disabled) {
  filter: brightness(1.15);
}

.gg-btn-danger,
.git-graph-btn--danger {
  background: rgba(239, 68, 68, 0.2) !important;
  border-color: rgba(239, 68, 68, 0.5) !important;
  color: #fca5a5 !important;
}

.gg-btn-danger:hover:not(:disabled) {
  background: rgba(239, 68, 68, 0.35) !important;
}

.git-graph-btn--active,
.gg-btn.active {
  border-color: var(--gg-accent) !important;
  background: rgba(0, 122, 204, 0.25) !important;
  color: #ffffff !important;
}

.gg-btn-icon {
  padding: 0 6px;
  min-width: 24px;
}

/* Selects & Inputs */
.gg-select,
.git-graph-select {
  height: 24px;
  padding: 2px 6px;
  border-radius: 4px;
  border: 1px solid var(--gg-border-subtle);
  background: var(--gg-bg-base);
  color: var(--gg-text-normal);
  font-family: var(--gg-font-sans);
  font-size: 12px;
  cursor: pointer;
  box-sizing: border-box;
  outline: none;
}

.gg-select:focus,
.git-graph-select:focus {
  border-color: var(--gg-accent);
}

.gg-input,
.git-graph-input {
  height: 24px;
  padding: 2px 8px;
  border-radius: 4px;
  border: 1px solid var(--gg-border-subtle);
  background: var(--gg-bg-base);
  color: var(--gg-text-normal);
  font-family: var(--gg-font-sans);
  font-size: 12px;
  box-sizing: border-box;
  outline: none;
}

.gg-input:focus,
.git-graph-input:focus {
  border-color: var(--gg-accent);
}

/* --------------------------------------------------------------------------
   Branch Filter Popover
   -------------------------------------------------------------------------- */
.gg-popover,
.git-graph-popover {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  z-index: 100;
  min-width: 260px;
  max-width: 380px;
  max-height: 420px;
  overflow-y: auto;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid var(--gg-border-strong);
  background: #202228;
  color: var(--gg-text-normal);
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.75);
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-sizing: border-box;
}

.git-graph-checkbox-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  cursor: pointer;
  user-select: none;
}

/* --------------------------------------------------------------------------
   Find Widget Bar
   -------------------------------------------------------------------------- */
.gg-find-widget,
.git-graph-find-bar {
  position: absolute;
  top: 6px;
  right: 16px;
  z-index: 40;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid var(--gg-border-strong);
  background: #202228;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.55);
}

/* --------------------------------------------------------------------------
   Banners
   -------------------------------------------------------------------------- */
.gg-banner,
.git-graph-banner {
  padding: 6px 12px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  border-bottom: 1px solid var(--gg-border-subtle);
  flex-shrink: 0;
}

.gg-banner-error,
.git-graph-banner--error {
  background: rgba(239, 68, 68, 0.16);
  color: #fca5a5;
  border-bottom-color: rgba(239, 68, 68, 0.35);
}

.gg-banner-info,
.git-graph-banner--info {
  background: rgba(59, 130, 246, 0.16);
  color: #93c5fd;
  border-bottom-color: rgba(59, 130, 246, 0.35);
}

/* --------------------------------------------------------------------------
   Table Structure (Header & Rows)
   -------------------------------------------------------------------------- */
.gg-table-container,
.git-graph-table-container {
  flex: 1 1 auto;
  min-width: 220px;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  background: var(--gg-bg-base);
}

.gg-table-header,
.git-graph-header-row {
  display: flex !important;
  flex-direction: row !important;
  align-items: center;
  height: 26px;
  min-height: 26px;
  line-height: 26px;
  background: var(--gg-bg-card);
  border-bottom: 1px solid var(--gg-border-subtle);
  color: var(--gg-text-muted);
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 0 8px;
  box-sizing: border-box;
  flex-shrink: 0;
  user-select: none;
  width: 100%;
}

.gg-table-scroll,
.git-graph-scroll-body {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: scroll;
  overflow-x: auto;
  position: relative;
  background: var(--gg-bg-base);
}

.gg-rows-wrapper,
.git-graph-body-inner {
  position: relative;
  min-width: 100%;
  width: max-content;
  box-sizing: border-box;
}

/* SVG DAG Overlay */
.gg-svg-overlay,
.git-graph-svg-overlay {
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 2;
}

.gg-svg-vertex,
.git-graph-svg-vertex {
  pointer-events: auto;
  cursor: pointer;
}

/* Commit Row */
.gg-commit-row,
.git-graph-row {
  display: flex !important;
  flex-direction: row !important;
  align-items: center;
  height: 28px;
  min-height: 28px;
  line-height: 28px;
  padding: 0 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
  cursor: pointer;
  font-size: 12.5px;
  box-sizing: border-box;
  white-space: nowrap;
  position: relative;
  z-index: 1;
  min-width: 100%;
  width: max-content;
  transition: background 60ms ease;
}

.gg-commit-row:hover,
.git-graph-row:hover {
  background: var(--gg-bg-hover);
}

.gg-commit-row.selected,
.git-graph-row--selected {
  background: var(--gg-bg-selected) !important;
  outline: 1px solid var(--gg-accent);
  outline-offset: -1px;
}

.gg-commit-row.compared,
.git-graph-row--compared {
  background: rgba(106, 50, 159, 0.5) !important;
  outline: 1px solid #a855f7;
  outline-offset: -1px;
}

.gg-commit-row.search-match,
.git-graph-row--match {
  background: rgba(234, 179, 8, 0.18);
  outline: 1px solid rgba(234, 179, 8, 0.5);
  outline-offset: -1px;
}

.gg-commit-row.muted,
.git-graph-row--muted {
  opacity: 0.4;
}

.gg-commit-row.uncommitted {
  font-style: italic;
  color: #93c5fd;
}

/* Columns */
.gg-graph-spacer {
  flex-shrink: 0;
  height: 100%;
}

.gg-commit-desc,
.git-graph-cell--desc {
  flex: 1 1 auto;
  min-width: 260px;
  display: flex;
  align-items: center;
  gap: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding-right: 12px;
  box-sizing: border-box;
}

.gg-commit-subject {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #e1e1e1;
  font-size: 12.5px;
}

.gg-commit-date,
.git-graph-cell--date {
  width: 125px;
  flex-shrink: 0;
  color: var(--gg-text-muted);
  font-size: 11.5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 6px;
  box-sizing: border-box;
}

.gg-commit-author,
.git-graph-cell--author {
  width: 130px;
  flex-shrink: 0;
  color: #9a9a9a;
  font-size: 11.5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 6px;
  box-sizing: border-box;
}

.gg-commit-hash,
.git-graph-cell--mono {
  width: 74px;
  flex-shrink: 0;
  font-family: var(--gg-font-mono);
  font-size: 11px;
  color: var(--gg-text-muted);
  text-align: right;
  cursor: pointer;
  padding-left: 6px;
  box-sizing: border-box;
}

.gg-commit-hash:hover {
  text-decoration: underline;
  color: var(--gg-accent-hover);
}

/* --------------------------------------------------------------------------
   Branch, Tag & Stash Pills (Ref Badges)
   -------------------------------------------------------------------------- */
.gg-ref-badge,
.git-graph-ref-badge {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 1.5px 7px;
  border-radius: 4px;
  font-size: 11.5px;
  font-weight: 600;
  line-height: 1.35;
  flex-shrink: 0;
  border: 1px solid transparent;
  cursor: pointer;
  user-select: none;
  box-sizing: border-box;
  transition: filter 100ms ease, background 100ms ease, border-color 100ms ease;
  letter-spacing: 0.015em;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.45);
}

.gg-ref-badge:hover,
.git-graph-ref-badge:hover {
  filter: brightness(1.25);
}

.gg-ref-badge .gg-ref-icon {
  font-size: 11px;
  line-height: 1;
  display: inline-block;
  opacity: 0.95;
}

.gg-ref-badge .gg-ref-name {
  font-weight: 600;
  color: #ffffff !important;
}

/* Local branch (not current HEAD) */
.gg-ref-head,
.git-graph-ref-badge--head {
  background: #0f2744 !important;
  border-color: #3b82f6 !important;
  color: #ffffff !important;
}

.gg-ref-head .gg-ref-icon {
  color: #60a5fa;
}

/* Current HEAD branch */
.gg-ref-head.is-current,
.git-graph-ref-badge--current {
  background: #0284c7 !important;
  border-color: #38bdf8 !important;
  color: #ffffff !important;
  font-weight: 700;
  box-shadow: 0 0 8px rgba(14, 165, 233, 0.65) !important;
}

.gg-ref-head.is-current .gg-ref-icon {
  color: #ffffff;
}

/* Remote branch */
.gg-ref-remote,
.git-graph-ref-badge--remote {
  background: #2b134b !important;
  border-color: #8b5cf6 !important;
  color: #ffffff !important;
}

.gg-ref-remote .gg-ref-icon {
  color: #c084fc;
}

/* Tag */
.gg-ref-tag,
.git-graph-ref-badge--tag {
  background: #3b2204 !important;
  border-color: #f59e0b !important;
  color: #ffffff !important;
}

.gg-ref-tag .gg-ref-icon {
  color: #fbbf24;
}

/* Stash */
.gg-ref-stash,
.git-graph-ref-badge--stash {
  background: #1e293b !important;
  border-color: #64748b !important;
  color: #ffffff !important;
}

.gg-ref-stash .gg-ref-icon {
  color: #cbd5e1;
}

/* --------------------------------------------------------------------------
   Commit Details Pane (Docked & Inline)
   -------------------------------------------------------------------------- */
.gg-details-pane {
  container-type: inline-size;
}

.gg-details-pane:not(.inline),
.git-graph-details-pane:not(.inline) {
  width: 48%;
  min-width: 300px;
  max-width: 65%;
  border-left: 1px solid var(--gg-border-subtle);
  background: var(--gg-bg-card);
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
}

.gg-inline-details-wrapper {
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
}

.gg-details-pane.inline,
.gg-details-inline,
.git-graph-details-inline {
  width: 100% !important;
  min-width: 0 !important;
  max-width: 100% !important;
  border-left: none;
  margin: 0;
  border: 1px solid var(--gg-border-strong);
  border-radius: 6px;
  background: #181a20;
  height: clamp(420px, 60vh, 700px);
  max-height: 700px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
}

.gg-details-header,
.git-graph-details-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 8px 12px;
  border-bottom: 1px solid var(--gg-border-subtle);
  background: rgba(255, 255, 255, 0.02);
  flex-shrink: 0;
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.gg-details-header-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 13px;
  min-width: 0;
  overflow: hidden;
}

.gg-details-header-title > span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.gg-details-body,
.git-graph-details-body {
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;
  padding: 8px 12px 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  user-select: text;
  max-width: 100%;
  box-sizing: border-box;
}

.gg-details-meta {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-width: 100%;
  box-sizing: border-box;
}

.gg-details-meta-grid,
.git-graph-meta-grid {
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 4px 10px;
  font-size: 12px;
  max-width: 100%;
  box-sizing: border-box;
}

.gg-details-meta-grid > span:last-child {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
}

.gg-details-meta-label,
.git-graph-meta-label {
  color: var(--gg-text-muted);
  font-weight: 500;
}

.gg-parent-link {
  color: var(--gg-accent);
  cursor: pointer;
  font-family: var(--gg-font-mono);
  font-size: 11.5px;
}

.gg-parent-link:hover {
  text-decoration: underline;
}

.gg-details-message,
.git-graph-commit-message {
  white-space: pre-wrap;
  word-break: break-word;
  overflow-wrap: anywhere;
  overflow-x: hidden;
  max-width: 100%;
  box-sizing: border-box;
  padding: 8px 10px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid var(--gg-border-subtle);
  font-size: 12.5px;
  line-height: 1.45;
}

.gg-details-columns {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: row;
  gap: 12px;
  overflow: hidden;
  box-sizing: border-box;
}

.gg-details-col-files {
  width: 290px;
  min-width: 240px;
  max-width: 360px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 0;
  border-right: 1px solid var(--gg-border-subtle);
  padding-right: 10px;
  box-sizing: border-box;
}

.gg-details-col-diff {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  box-sizing: border-box;
}

.gg-file-list,
.gg-details-files,
.git-graph-details-files {
  flex: 1 1 auto;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  border: 1px solid var(--gg-border-subtle);
  border-radius: 4px;
  padding: 4px;
  background: rgba(0, 0, 0, 0.15);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.gg-files-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 4px;
  border-bottom: 1px solid var(--gg-border-subtle);
  font-size: 11.5px;
  font-weight: 600;
  color: var(--gg-text-muted);
}

.gg-folder-row {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 3px 6px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  color: var(--gg-text-muted);
  user-select: none;
}

.gg-folder-row:hover {
  background: var(--gg-bg-hover);
  color: var(--gg-text-normal);
}

/* File list & File rows */
.gg-file-row,
.git-graph-file-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 3px 6px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background 80ms ease;
}

.gg-file-row:hover,
.git-graph-file-row:hover {
  background: var(--gg-bg-hover);
}

.gg-file-row.selected,
.git-graph-file-row--active {
  background: rgba(0, 122, 204, 0.25) !important;
  color: #ffffff;
}

.gg-file-status,
.git-graph-status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 3px;
  font-size: 10.5px;
  font-weight: 700;
  flex-shrink: 0;
}

.gg-file-status-A,
.git-graph-status-A,
.git-graph-status-U {
  background: rgba(16, 185, 129, 0.2);
  color: #6ee7b7;
}

.gg-file-status-M,
.git-graph-status-M {
  background: rgba(245, 158, 11, 0.2);
  color: #fcd34d;
}

.gg-file-status-D,
.git-graph-status-D {
  background: rgba(239, 68, 68, 0.2);
  color: #fca5a5;
}

.gg-file-status-R,
.git-graph-status-R,
.git-graph-status-C {
  background: rgba(139, 92, 246, 0.2);
  color: #c4b5fd;
}

.gg-file-path {
  flex: 1 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.gg-file-stat {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-family: var(--gg-font-mono);
}

.gg-stat-add {
  color: #6ee7b7;
}

.gg-stat-del {
  color: #fca5a5;
}

/* Diff viewer */
.gg-diff-container,
.git-graph-diff-box {
  border: 1px solid var(--gg-border-subtle);
  border-radius: 4px;
  overflow-x: auto;
  overflow-y: hidden;
  max-width: 100%;
  box-sizing: border-box;
  background: #14161b;
  font-family: var(--gg-font-mono);
  font-size: 11.5px;
}

.gg-diff-hunk-header,
.git-graph-diff-hunk-header {
  padding: 4px 8px;
  background: rgba(59, 130, 246, 0.14);
  color: #93c5fd;
  font-size: 11px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.gg-diff-line,
.git-graph-diff-line {
  display: grid;
  grid-template-columns: 40px 40px minmax(0, 1fr);
  line-height: 1.45;
  white-space: pre-wrap;
  word-break: break-all;
}

.gg-diff-line-split,
.git-graph-diff-line--split {
  display: grid;
  grid-template-columns: 38px minmax(0, 1fr) 38px minmax(0, 1fr);
  line-height: 1.45;
  white-space: pre-wrap;
  word-break: break-all;
}

.gg-diff-num,
.git-graph-diff-ln {
  color: var(--gg-text-muted);
  text-align: right;
  padding: 0 6px;
  user-select: none;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
}

.gg-diff-code,
.git-graph-diff-code {
  padding: 1px 8px;
  font-family: var(--gg-font-mono) !important;
  font-size: 11.5px;
  line-height: 1.45;
  white-space: pre-wrap !important;
  word-break: break-all;
  color: var(--gg-text-normal);
  tab-size: 2;
}

.gg-diff-add,
.git-graph-diff-add {
  background: rgba(16, 185, 129, 0.18);
  color: #a7f3d0;
}

.gg-diff-del,
.git-graph-diff-del {
  background: rgba(239, 68, 68, 0.18);
  color: #fecaca;
}

.gg-diff-viewer {
  flex: 1 1 auto;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-width: 100%;
  box-sizing: border-box;
  overflow: hidden;
}

.gg-diff-toolbar {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid var(--gg-border-subtle);
  border-radius: 4px;
  box-sizing: border-box;
  font-size: 11.5px;
  color: var(--gg-text-muted);
}

.gg-diff-content-scroll {
  flex: 1 1 auto;
  min-height: 0;
  overflow: auto;
  border: 1px solid var(--gg-border-subtle);
  border-radius: 4px;
  background: #14161b;
  box-sizing: border-box;
}

/* Responsive side-by-side to stacked collapse */
@container (max-width: 640px) {
  .gg-details-body {
    overflow-y: auto !important;
  }
  .gg-details-columns {
    flex-direction: column !important;
    overflow: visible !important;
  }
  .gg-details-col-files {
    width: 100% !important;
    max-width: 100% !important;
    border-right: none !important;
    border-bottom: 1px solid var(--gg-border-subtle);
    padding-right: 0 !important;
    padding-bottom: 8px;
    height: 180px;
    flex-shrink: 0 !important;
  }
  .gg-details-col-diff {
    min-height: 250px;
    overflow: visible !important;
  }
}

@media (max-width: 640px) {
  .gg-details-body {
    overflow-y: auto !important;
  }
  .gg-details-columns {
    flex-direction: column !important;
    overflow: visible !important;
  }
  .gg-details-col-files {
    width: 100% !important;
    max-width: 100% !important;
    border-right: none !important;
    border-bottom: 1px solid var(--gg-border-subtle);
    padding-right: 0 !important;
    padding-bottom: 8px;
    height: 180px;
    flex-shrink: 0 !important;
  }
  .gg-details-col-diff {
    min-height: 250px;
    overflow: visible !important;
  }
}

.gg-diff-table,
.gg-source-table {
  width: 100%;
  border-collapse: collapse;
  font-family: var(--gg-font-mono);
  font-size: 11.5px;
  border: 1px solid var(--gg-border-subtle);
  border-radius: 4px;
  background: #14161b;
  overflow: hidden;
}

.gg-diff-gutter {
  color: var(--gg-text-muted);
  text-align: right;
  padding: 1px 8px;
  width: 44px;
  min-width: 44px;
  user-select: none;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 11px;
  font-family: var(--gg-font-mono) !important;
}

.gg-diff-line-add {
  background: rgba(16, 185, 129, 0.18) !important;
  color: #a7f3d0 !important;
}

.gg-diff-line-del {
  background: rgba(239, 68, 68, 0.18) !important;
  color: #fecaca !important;
}

.gg-source-line:hover {
  background: rgba(255, 255, 255, 0.03);
}

/* --------------------------------------------------------------------------
   Context Menus & Modals
   -------------------------------------------------------------------------- */
.gg-context-menu,
.git-graph-context-menu {
  position: fixed;
  z-index: 100;
  min-width: 220px;
  padding: 4px;
  border-radius: 6px;
  border: 1px solid var(--gg-border-strong);
  background: #202228;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  gap: 2px;
  box-sizing: border-box;
}

.gg-context-menu-header {
  padding: 5px 10px;
  font-size: 11px;
  font-weight: 600;
  color: var(--gg-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-bottom: 1px solid var(--gg-border-subtle);
  margin-bottom: 2px;
}

.gg-context-menu-item,
.git-graph-context-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: var(--gg-text-normal);
  font-family: var(--gg-font-sans);
  font-size: 12px;
  text-align: left;
  cursor: pointer;
  box-sizing: border-box;
}

.gg-context-menu-item:hover,
.git-graph-context-item:hover {
  background: var(--gg-accent);
  color: #ffffff;
}

.gg-context-menu-item.danger,
.git-graph-context-item--danger {
  color: #fca5a5;
}

.gg-context-menu-item.danger:hover {
  background: rgba(239, 68, 68, 0.8);
  color: #ffffff;
}

.gg-context-menu-sep,
.git-graph-context-sep {
  height: 1px;
  margin: 3px 4px;
  background: var(--gg-border-subtle);
}

/* Modals */
.gg-modal-backdrop,
.git-graph-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  box-sizing: border-box;
}

.gg-modal,
.git-graph-modal {
  width: 100%;
  max-width: 520px;
  max-height: 85vh;
  overflow-y: auto;
  border-radius: 8px;
  border: 1px solid var(--gg-border-strong);
  background: #202228;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7);
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  box-sizing: border-box;
}

.gg-modal-header {
  font-size: 14px;
  font-weight: 600;
  color: #ffffff;
  border-bottom: 1px solid var(--gg-border-subtle);
  padding-bottom: 8px;
}

.gg-modal-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-size: 12.5px;
}

.gg-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--gg-border-subtle);
}

.git-graph-form-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 12px;
}

/* Empty states */
.gg-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 40px;
  color: var(--gg-text-muted);
  font-size: 13px;
  text-align: center;
}
`;var F=globalThis.__ZCC_HOST_REACT__,ae=F,rn=F.Children,sn=F.Component,ln=F.Fragment,cn=F.StrictMode,gn=F.Suspense,dn=F.cloneElement,pn=F.createContext,un=F.createElement,mn=F.createRef,hn=F.forwardRef,bn=F.isValidElement,fn=F.lazy,xn=F.memo,vn=F.startTransition,O=F.useCallback,yn=F.useContext,Pn=F.useDebugValue,wn=F.useDeferredValue,ce=F.useEffect,Cn=F.useId,kn=F.useImperativeHandle,Nn=F.useInsertionEffect,Sn=F.useLayoutEffect,ee=F.useMemo,Rn=F.useReducer,ye=F.useRef,k=F.useState,An=F.useSyncExternalStore,Tn=F.useTransition,In=F.version;var mt=["#0085d9","#d9008f","#00d90a","#d98500","#a300d9","#ff0000","#00d9cc","#e138e8","#85d900","#dc5b23","#6f24d6","#ffcc00"];function ht(o,c,i=mt){let d=i.length>0?i:mt,b=new Map;o.forEach((N,p)=>b.set(N.hash,p));let w=new Set;if(c&&b.has(c)){let N=[c];for(w.add(c);N.length>0;){let p=N.shift(),T=b.get(p);if(T!==void 0)for(let C of o[T].parents)w.has(C)||(w.add(C),b.has(C)&&N.push(C))}}let s=[],h=[],l=[],v=0,m=0,f=()=>{let N=d[v%d.length];return v+=1,N},r=N=>{let p=s.findIndex(C=>C===null);if(p>=0)return s[p]=N,p>m&&(m=p),p;let T=s.length;return s.push(N),T>m&&(m=T),T};for(let N=0;N<o.length;N++){let p=o[N],T=[];for(let $=0;$<s.length;$++)s[$]?.targetHash===p.hash&&T.push($);let C,y;if(T.length>0){C=T[0],y=p.isUncommitted?"#8a94a6":s[C].color;for(let $ of T){let q=s[$];l.push({fromRow:q.fromRow,fromLane:q.fromLane,toRow:N,toLane:C,color:q.color,isUncommitted:q.isUncommitted}),s[$]=null}}else y=p.isUncommitted?"#8a94a6":f(),C=r({targetHash:p.hash,color:y,fromRow:N,fromLane:0,isUncommitted:p.isUncommitted}),s[C]=null;h.push({commit:p,row:N,lane:C,color:y,isAncestorOfHead:p.isUncommitted||(c?w.has(p.hash):!0),isMerge:p.parents.length>1}),p.parents.filter($=>b.has($)).forEach(($,q)=>{if(q===0)s[C]={targetHash:$,color:p.isUncommitted?f():y,fromRow:N,fromLane:C,isUncommitted:p.isUncommitted};else{let te=s.findIndex(D=>D?.targetHash===$),ne=te>=0?s[te].color:f();r({targetHash:$,color:ne,fromRow:N,fromLane:C})}})}return{nodes:h,segments:l,maxLane:m}}function bt(o){let{segment:c,rowHeight:i,laneWidth:d,padX:b,style:w,expandedRow:s=-1,detailsHeight:h=0}=o,l=p=>s>=0&&h>0&&p>s?p*i+h+i/2:p*i+i/2,v=b+c.fromLane*d,m=l(c.fromRow),f=b+c.toLane*d,r=l(c.toRow);if(v===f)return`M ${v} ${m} L ${f} ${r}`;if(w==="angular"){let p=m+i*.5;return p>=r?`M ${v} ${m} L ${f} ${r}`:`M ${v} ${m} L ${v} ${p} L ${f} ${r}`}if(c.toRow-c.fromRow<=1){if(s>=0&&h>0&&c.fromRow<=s&&c.toRow>s){let C=m+i,y=m+i*.45,u=C-i*.45;return`M ${v} ${m} C ${v} ${y}, ${f} ${u}, ${f} ${C} L ${f} ${r}`}let p=m+i*.5,T=r-i*.5;return`M ${v} ${m} C ${v} ${p}, ${f} ${T}, ${f} ${r}`}if(c.toLane>c.fromLane){let p=m+i,T=m+i*.45,C=p-i*.45;return`M ${v} ${m} C ${v} ${T}, ${f} ${C}, ${f} ${p} L ${f} ${r}`}else{let p=r-i,T=p+i*.45,C=r-i*.45;return`M ${v} ${m} L ${v} ${p} C ${v} ${T}, ${f} ${C}, ${f} ${r}`}}var Ht={":art:":"\u{1F3A8}",":zap:":"\u26A1",":fire:":"\u{1F525}",":bug:":"\u{1F41B}",":ambulance:":"\u{1F691}\uFE0F",":sparkles:":"\u2728",":memo:":"\u{1F4DD}",":rocket:":"\u{1F680}",":lipstick:":"\u{1F484}",":tada:":"\u{1F389}",":white_check_mark:":"\u2705",":lock:":"\u{1F512}\uFE0F",":bookmark:":"\u{1F516}",":rotating_light:":"\u{1F6A8}",":construction:":"\u{1F6A7}",":green_heart:":"\u{1F49A}",":arrow_down:":"\u2B07\uFE0F",":arrow_up:":"\u2B06\uFE0F",":pushpin:":"\u{1F4CC}",":construction_worker:":"\u{1F477}",":chart_with_upwards_trend:":"\u{1F4C8}",":recycle:":"\u267B\uFE0F",":heavy_plus_sign:":"\u2795",":heavy_minus_sign:":"\u2796",":wrench:":"\u{1F527}",":hammer:":"\u{1F528}",":globe_with_meridians:":"\u{1F310}",":pencil2:":"\u270F\uFE0F",":rewind:":"\u23EA\uFE0F",":twisted_rightwards_arrows:":"\u{1F500}",":package:":"\u{1F4E6}\uFE0F",":alien:":"\u{1F47D}\uFE0F",":truck:":"\u{1F69A}",":page_facing_up:":"\u{1F4C4}",":boom:":"\u{1F4A5}",":bento:":"\u{1F371}",":wheelchair:":"\u267F\uFE0F",":bulb:":"\u{1F4A1}",":speech_balloon:":"\u{1F4AC}",":card_file_box:":"\u{1F5C3}\uFE0F",":loud_sound:":"\u{1F50A}",":mute:":"\u{1F507}",":Coffin:":"\u26B0\uFE0F",":test_tube:":"\u{1F9EA}",":necktie:":"\u{1F454}",":stethoscope:":"\u{1FA7A}",":bricks:":"\u{1F9F1}"};function Ot(o){return o.replace(/:[a-z0-9_+-]+:/gi,c=>{let i=c.toLowerCase();return Ht[i]??c})}function Ee(o,c=[]){let i=Ot(o),d=[],b=/(`[^`]+`|https?:\/\/[^\s)]+)/g,w=0,s,h=l=>{if(l){if(c.length===0){d.push({kind:"text",text:l});return}for(let v of c)try{let m=new RegExp(v.pattern,"g"),f=0,r,N=[];for(;(r=m.exec(l))!==null;){r.index>f&&N.push({kind:"text",text:l.slice(f,r.index)});let p=v.urlTemplate;if(r.forEach((T,C)=>{T!==void 0&&(p=p.replace(new RegExp(`\\$${C}`,"g"),T))}),N.push({kind:"link",text:r[0],href:p}),f=r.index+r[0].length,r[0].length===0)break}if(N.length>0){f<l.length&&N.push({kind:"text",text:l.slice(f)}),d.push(...N);return}}catch{}d.push({kind:"text",text:l})}};for(;(s=b.exec(i))!==null;){s.index>w&&h(i.slice(w,s.index));let l=s[0];l.startsWith("`")&&l.endsWith("`")?d.push({kind:"code",text:l.slice(1,-1)}):d.push({kind:"link",text:l,href:l}),w=s.index+l.length}return w<i.length&&h(i.slice(w)),d.length>0?d:[{kind:"text",text:i}]}function ft(o,c){let i={name:"",path:"",kind:"folder",children:[]};for(let b of o){let w=b.newPath.split("/").filter(Boolean),s=i,h="";for(let l=0;l<w.length;l++){let v=w[l];if(h=h?`${h}/${v}`:v,l===w.length-1)s.children.push({name:v,path:b.newPath,kind:"file",children:[],fileChange:b});else{let f=s.children.find(r=>r.kind==="folder"&&r.name===v);f||(f={name:v,path:h,kind:"folder",children:[]},s.children.push(f)),s=f}}}function d(b){return b.map(s=>{if(s.kind==="file")return s;let h={...s,children:d(s.children)};for(;c&&h.children.length===1&&h.children[0].kind==="folder";){let l=h.children[0];h={name:`${h.name}/${l.name}`,path:l.path,kind:"folder",children:l.children}}return h}).sort((s,h)=>s.kind!==h.kind?s.kind==="folder"?-1:1:s.name.localeCompare(h.name))}return d(i.children)}function xt(o){let c=[],i=0,d=o.lines;for(;i<d.length;){let b=d[i];if(b.type==="context"){c.push({leftLineNumber:b.oldLineNumber,leftContent:b.content,leftType:"context",rightLineNumber:b.newLineNumber,rightContent:b.content,rightType:"context"}),i+=1;continue}if(b.type==="meta"){c.push({leftLineNumber:null,leftContent:b.content,leftType:"meta",rightLineNumber:null,rightContent:b.content,rightType:"meta"}),i+=1;continue}let w=[],s=[];for(;i<d.length&&d[i].type==="del";)w.push(d[i]),i+=1;for(;i<d.length&&d[i].type==="add";)s.push(d[i]),i+=1;let h=Math.max(w.length,s.length);for(let l=0;l<h;l++){let v=w[l],m=s[l];c.push({leftLineNumber:v?v.oldLineNumber:null,leftContent:v?v.content:"",leftType:v?"del":"empty",rightLineNumber:m?m.newLineNumber:null,rightContent:m?m.content:"",rightType:m?"add":"empty"})}}return c}function Se(o,c,i=Date.now()){if(!o)return"";let d=new Date(o*1e3);if(c==="iso")return d.toISOString().slice(0,16).replace("T"," ");if(c==="datetime")return d.toLocaleString();let b=Math.max(0,Math.floor((i-o*1e3)/1e3));if(b<60)return"just now";let w=Math.floor(b/60);if(w<60)return`${w}m ago`;let s=Math.floor(w/60);if(s<24)return`${s}h ago`;let h=Math.floor(s/24);if(h<30)return`${h}d ago`;let l=Math.floor(h/30);return l<12?`${l}mo ago`:`${Math.floor(h/365)}y ago`}var vt=globalThis.__ZCC_HOST_REACT__,j=vt.Fragment;function e(o,c,i){return vt.createElement(o,i===void 0?c:{...c,key:i})}var t=e;function yt(o){let[c,i]=k(!1),[d,b]=k(""),{repos:w,selectedRepoRelPath:s,onSelectRepo:h,branches:l,remoteBranches:v,repoSettings:m,globalSettings:f,onUpdateRepoSettings:r,onUpdateGlobalSettings:N,onFetch:p,onScrollToHead:T,onToggleFind:C,findOpen:y,onOpenRepoSettings:u,onRefresh:$,projects:q,selectedProjectId:te,onSelectProject:ne,loading:D,headerActions:R}=o,B=m.selectedBranches,A=B.length===0,Z=[...l,...m.showRemoteBranches?v.map(S=>`remotes/${S}`):[]].filter(S=>!d.trim()||S.toLowerCase().includes(d.trim().toLowerCase())),ge=S=>{let U=new Set(B);U.has(S)?U.delete(S):U.add(S),r({selectedBranches:[...U]})};return t("header",{className:"gg-control-bar git-graph-toolbar",role:"toolbar","aria-label":"Git Graph controls",children:[t("div",{className:"git-graph-toolbar-left",children:[e("span",{className:"git-graph-title",children:"\u2442 Git Graph"}),q&&q.length>1&&t("label",{style:{display:"inline-flex",alignItems:"center",gap:4},children:[e("span",{style:{color:"var(--text-muted)",fontSize:11},children:"Project:"}),e("select",{"aria-label":"Select project",className:"gg-select git-graph-select",value:te,onChange:S=>ne?.(S.target.value),children:q.map(S=>e("option",{value:S.id,children:S.name},S.id))})]}),w.length>1&&t("label",{style:{display:"inline-flex",alignItems:"center",gap:4},children:[e("span",{style:{color:"var(--text-muted)",fontSize:11},children:"Repo:"}),e("select",{"aria-label":"Select repository",className:"gg-select git-graph-select",value:s,onChange:S=>h(S.target.value),children:w.map(S=>t("option",{value:S.relPath,children:[S.label," ",S.currentBranch?`(${S.currentBranch})`:""]},S.relPath||"root"))})]}),t("div",{style:{position:"relative",zIndex:c?100:1},children:[e("button",{type:"button",className:`gg-btn git-graph-btn ${A?"":"git-graph-btn--active"}`,"aria-label":"Filter branches","aria-expanded":c,onClick:()=>i(S=>!S),"data-testid":"gg-branches-filter-btn",children:t("span",{children:["\u2442 Branches:"," ",A?"Show All":B.length===1?B[0]:`${B.length} selected`," \u25BE"]})}),c&&t(j,{children:[e("div",{style:{position:"fixed",inset:0,zIndex:99},onClick:()=>i(!1)}),t("div",{className:"gg-popover git-graph-popover",style:{zIndex:100},role:"dialog","aria-label":"Branch filter","data-testid":"gg-branches-popover",children:[t("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e("strong",{style:{fontSize:12},children:"Filter Branches"}),e("button",{type:"button",className:"gg-btn git-graph-btn",onClick:()=>i(!1),children:"Close"})]}),e("input",{type:"search",className:"git-graph-input",placeholder:"Filter branch list...",value:d,onChange:S=>b(S.target.value)}),t("label",{className:"git-graph-checkbox-row",children:[e("input",{type:"checkbox",checked:A,onChange:()=>r({selectedBranches:[]})}),e("span",{children:"Show All Branches"})]}),t("label",{className:"git-graph-checkbox-row",children:[e("input",{type:"checkbox",checked:m.showRemoteBranches,onChange:S=>r({showRemoteBranches:S.target.checked})}),e("span",{children:"Show Remote Branches"})]}),t("label",{className:"git-graph-checkbox-row",children:[e("input",{type:"checkbox",checked:m.showTags,onChange:S=>r({showTags:S.target.checked})}),e("span",{children:"Show Tags"})]}),t("label",{className:"git-graph-checkbox-row",children:[e("input",{type:"checkbox",checked:m.showStashes,onChange:S=>r({showStashes:S.target.checked})}),e("span",{children:"Show Stashes"})]}),t("label",{className:"git-graph-checkbox-row",children:[e("input",{type:"checkbox",checked:m.onlyFollowFirstParent,onChange:S=>r({onlyFollowFirstParent:S.target.checked})}),e("span",{children:"Only Follow First Parent"})]}),e("div",{className:"git-graph-context-sep"}),e("div",{style:{maxHeight:160,overflowY:"auto",display:"flex",flexDirection:"column",gap:4},children:Z.map(S=>t("label",{className:"git-graph-checkbox-row",children:[e("input",{type:"checkbox",checked:B.includes(S),onChange:()=>ge(S)}),e("span",{style:{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:S})]},S))})]})]})]}),t("select",{"aria-label":"Commit ordering",className:"gg-select git-graph-select",value:m.commitOrdering,onChange:S=>r({commitOrdering:S.target.value}),title:"Commit order",children:[e("option",{value:"date",children:"Order: Commit Date"}),e("option",{value:"author-date",children:"Order: Author Date"}),e("option",{value:"topo",children:"Order: Topological"})]}),t("button",{type:"button",className:"gg-btn git-graph-btn",title:"Toggle rounded or angular graph lines",onClick:()=>N({graphStyle:f.graphStyle==="rounded"?"angular":"rounded"}),children:["Style: ",f.graphStyle==="rounded"?"Rounded":"Angular"]}),t("button",{type:"button",className:"gg-btn git-graph-btn",title:"Toggle Commit Details location (Docked split vs Inline row)",onClick:()=>N({commitDetailsLocation:f.commitDetailsLocation==="docked"?"inline":"docked"}),children:["Details: ",f.commitDetailsLocation==="docked"?"Docked":"Inline"]})]}),t("div",{className:"git-graph-toolbar-right",children:[e("button",{type:"button",className:"gg-btn git-graph-btn",onClick:p,disabled:D,title:"Fetch from Remote(s)",children:"\u2B07 Fetch"}),e("button",{type:"button",className:"gg-btn git-graph-btn",onClick:T,title:"Scroll to HEAD (Ctrl/Cmd+H)",children:"\u2316 HEAD"}),e("button",{type:"button",className:`gg-btn git-graph-btn ${y?"git-graph-btn--active active":""}`,onClick:C,title:"Find commits, branches, or tags (Ctrl/Cmd+F)","data-testid":"gg-find-btn",children:"\u{1F50D} Find"}),e("button",{type:"button",className:"gg-btn git-graph-btn",onClick:u,title:"Repository Settings (Remotes, Issue Linking, Pull Requests)","data-testid":"gg-repo-settings-btn",children:"\u2699 Settings"}),t("button",{type:"button",className:"gg-btn git-graph-btn",onClick:$,disabled:D,title:"Refresh Git Graph (Ctrl/Cmd+R)",children:["\u21BB ",D?"Loading\u2026":"Refresh"]}),R]})]})}function Pt(o){let{query:c,onChangeQuery:i,matchCount:d,activeMatchIndex:b,onPrev:w,onNext:s,onClose:h}=o;return t("div",{className:"git-graph-find-bar",role:"search","aria-label":"Find in Git Graph","data-testid":"gg-find-widget",children:[e("input",{type:"search",className:"git-graph-input","aria-label":"Find commits",placeholder:"Find commit, hash, author, branch, tag...",value:c,autoFocus:!0,onChange:l=>i(l.target.value),onKeyDown:l=>{l.key==="Enter"?(l.preventDefault(),l.shiftKey?w():s()):l.key==="Escape"&&(l.preventDefault(),h())},style:{width:230},"data-testid":"gg-find-input"}),e("span",{style:{fontSize:11,color:"var(--text-muted)",minWidth:52,textAlign:"center"},children:c.trim()?d>0?`${b+1} / ${d}`:"0 / 0":""}),e("button",{type:"button",className:"git-graph-btn",disabled:d===0,onClick:w,title:"Previous match (Shift+Enter)","data-testid":"gg-find-prev",children:"\u2191"}),e("button",{type:"button",className:"git-graph-btn",disabled:d===0,onClick:s,title:"Next match (Enter)","data-testid":"gg-find-next",children:"\u2193"}),e("button",{type:"button",className:"git-graph-btn",onClick:h,"aria-label":"Close find widget",children:"\u2715"})]})}function We({mode:o,details:c,comparison:i,loading:d,inline:b,fileViewType:w,compactFolders:s,diffViewMode:h,dateFormat:l,issueRules:v,codeReview:m,selectedFilePath:f,fileDiff:r,loadingDiff:N,fileContent:p,loadingContent:T,onSelectFile:C,onLoadFileContent:y,onChangeFileViewType:u,onToggleCompactFolders:$,onChangeDiffViewMode:q,onStartCodeReview:te,onToggleReviewedFile:ne,onEndCodeReview:D,onSelectParentHash:R,onAskAgent:B,onCopyText:A,onClose:Z}){let[ge,S]=k({}),[U,he]=k("diff"),de=ye(null);ce(()=>{f&&de.current&&de.current?.scrollIntoView?.({behavior:"smooth",block:"nearest"})},[f]);let Q=ee(()=>o==="comparison"?i?.fileChanges??[]:c?.fileChanges??[],[o,c,i]),Re=ee(()=>ft(Q,s),[Q,s]),Y=ee(()=>new Set(m?.reviewedFiles??[]),[m]),Ae=x=>{S(E=>({...E,[x]:!E[x]}))},Pe=x=>Ee(x,v).map((I,L)=>I.kind==="code"?e("code",{children:I.text},L):I.kind==="link"&&I.href?e("a",{href:I.href,target:"_blank",rel:"noreferrer",children:I.text},L):e(ae.Fragment,{children:I.text},L)),be=(x,E,I=0)=>{let L=f===x.newPath,re=Y.has(x.newPath);return t("div",{className:`gg-file-row ${L?"selected":""}`,style:{paddingLeft:`${12+I*14}px`},onClick:()=>{C(x),U==="source"&&y?.(x.newPath)},"data-testid":`gg-file-row-${x.newPath}`,children:[m&&e("input",{type:"checkbox",checked:re,onClick:se=>se.stopPropagation(),onChange:se=>ne(x.newPath,se.target.checked),title:"Mark file as reviewed"}),e("span",{className:`gg-file-status gg-file-status-${x.status}`,children:x.status}),t("span",{className:"gg-file-path",style:{textDecoration:re?"line-through":void 0,opacity:re?.65:1},title:x.oldPath!==x.newPath?`${x.oldPath} \u2192 ${x.newPath}`:x.newPath,children:[E,x.staged!==void 0&&t("span",{style:{opacity:.6,marginLeft:"6px",fontSize:"10px"},children:["(",x.staged?"staged":"unstaged",")"]})]}),t("span",{className:"gg-file-stat",children:[x.additions!==null&&x.additions>0&&t("span",{className:"gg-stat-add",children:["+",x.additions]}),x.deletions!==null&&x.deletions>0&&t("span",{className:"gg-stat-del",children:["-",x.deletions]})]}),e("button",{type:"button",className:"gg-btn gg-btn-icon",style:{padding:"1px 4px",fontSize:"10px"},title:"Copy File Path",onClick:se=>{se.stopPropagation(),A(x.newPath,"File path")},children:"\u{1F4CB}"})]},`${x.newPath}:${x.staged?"staged":"work"}`)},fe=(x,E=0)=>x.map(I=>{if(I.kind==="file"&&I.fileChange)return be(I.fileChange,I.name,E);let L=!!ge[I.path];return t(ae.Fragment,{children:[t("div",{className:"gg-folder-row",style:{paddingLeft:`${12+E*14}px`},onClick:()=>Ae(I.path),children:[e("span",{children:L?"\u25B8":"\u25BE"}),t("span",{children:["\u{1F4C1} ",I.name]})]}),!L&&fe(I.children,E+1)]},`folder:${I.path}`)});return t("div",{className:`gg-details-pane ${b?"gg-details-inline inline":""}`,"data-testid":"gg-details-pane",children:[t("div",{className:"gg-details-header",children:[e("div",{className:"gg-details-header-title",children:o==="comparison"&&i?t(j,{children:[e("span",{children:"Comparing"}),e("span",{className:"gg-commit-hash",style:{width:"auto"},children:i.fromHash.slice(0,7)}),e("span",{children:"\u2194"}),e("span",{className:"gg-commit-hash",style:{width:"auto"},children:i.toHash.slice(0,7)})]}):c?t(j,{children:[e("span",{children:c.hash==="*"?"Uncommitted Changes":`Commit ${c.abbreviatedHash}`}),c.signature&&t("span",{className:"gg-ref-badge gg-ref-tag",title:c.signature.signer||c.signature.label,children:["\u{1F512} ",c.signature.label]})]}):e("span",{children:"Commit Details"})}),t("div",{style:{display:"flex",alignItems:"center",gap:"4px",flexShrink:0},children:[e("button",{type:"button",className:"gg-btn gg-btn-primary",onClick:()=>B(f??void 0),title:"Spawn a Zana Agent thread with this commit and diff context","data-testid":"gg-ask-agent-btn",children:"\u2728 Ask Agent"}),m?t("button",{type:"button",className:"gg-btn",onClick:D,title:"End Code Review","data-testid":"gg-end-review-btn",children:["\u2713 End Review (",Y.size,"/",Q.length,")"]}):e("button",{type:"button",className:"gg-btn",onClick:te,title:"Start Persistent Code Review","data-testid":"gg-start-review-btn",children:"\u{1F441} Code Review"}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:Z,title:"Close Details (Esc)","data-testid":"gg-close-details-btn",children:"\u2715"})]})]}),d?e("div",{className:"gg-empty",children:"Loading commit details\u2026"}):t("div",{className:"gg-details-body",children:[o==="single"&&c&&c.hash!=="*"&&t("div",{className:"gg-details-meta",children:[t("div",{className:"gg-details-meta-grid",children:[e("span",{className:"gg-details-meta-label",children:"Commit:"}),t("span",{children:[e("code",{children:c.hash})," ",e("button",{type:"button",className:"gg-btn gg-btn-icon",style:{padding:"0 4px",fontSize:"10px"},onClick:()=>A(c.hash,"Commit hash"),children:"Copy"})]}),e("span",{className:"gg-details-meta-label",children:"Parents:"}),e("span",{children:c.parents.length===0?"None (root commit)":c.parents.map((x,E)=>t(ae.Fragment,{children:[E>0&&", ",e("span",{className:"gg-parent-link",onClick:()=>R(x),children:x.slice(0,8)})]},x))}),e("span",{className:"gg-details-meta-label",children:"Author:"}),t("span",{children:[c.authorName," <",c.authorEmail,"> (",Se(c.authorDate,l),")"]}),e("span",{className:"gg-details-meta-label",children:"Committer:"}),t("span",{children:[c.committerName," <",c.committerEmail,"> (",Se(c.commitDate,l),")"]})]}),t("div",{className:"gg-details-message",children:[e("strong",{children:Pe(c.subject)}),c.body?`

${c.body}`:""]})]}),t("div",{className:"gg-details-columns","data-testid":"gg-details-columns",children:[t("div",{className:"gg-details-col-files",children:[t("div",{className:"gg-files-toolbar",children:[t("span",{children:["Changed Files (",Q.length,")",m?` \u2022 Reviewed ${Y.size}/${Q.length}`:""]}),t("div",{style:{display:"flex",gap:"4px"},children:[e("button",{type:"button",className:`gg-btn ${w==="tree"?"gg-btn-active":""}`,style:{padding:"2px 6px",fontSize:"11px"},onClick:()=>u("tree"),"data-testid":"gg-view-tree-btn",children:"Tree"}),e("button",{type:"button",className:`gg-btn ${w==="list"?"gg-btn-active":""}`,style:{padding:"2px 6px",fontSize:"11px"},onClick:()=>u("list"),"data-testid":"gg-view-list-btn",children:"List"}),w==="tree"&&e("button",{type:"button",className:`gg-btn ${s?"gg-btn-active":""}`,style:{padding:"2px 6px",fontSize:"11px"},onClick:$,title:"Compact single-child folders",children:"Compact"})]})]}),e("div",{className:"gg-file-list","data-testid":"gg-file-list",children:Q.length===0?e("div",{className:"gg-empty",style:{padding:"12px"},children:"No file changes in this commit."}):w==="tree"?fe(Re):Q.map(x=>be(x,x.oldPath!==x.newPath?`${x.oldPath} \u2192 ${x.newPath}`:x.newPath,0))})]}),e("div",{className:"gg-details-col-diff",children:f?t("div",{className:"gg-diff-viewer","data-testid":"gg-diff-viewer",ref:de,children:[t("div",{className:"gg-diff-toolbar",children:[e("span",{style:{fontFamily:"var(--font-mono, monospace)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontWeight:600},title:f,children:f}),t("div",{style:{display:"flex",gap:"4px",alignItems:"center"},children:[e("button",{type:"button",className:`gg-btn ${U==="diff"?"gg-btn-active":""}`,style:{padding:"2px 8px",fontSize:"11px"},onClick:()=>he("diff"),"data-testid":"gg-view-diff-btn",title:"View diff changes",children:"Diff"}),e("button",{type:"button",className:`gg-btn ${U==="source"?"gg-btn-active":""}`,style:{padding:"2px 8px",fontSize:"11px"},onClick:()=>{he("source"),f&&!p&&y?.(f)},"data-testid":"gg-view-source-btn",title:"View full source code",children:"Source Code"}),U==="diff"&&t(j,{children:[e("button",{type:"button",className:`gg-btn ${h==="unified"?"gg-btn-active":""}`,style:{padding:"2px 6px",fontSize:"11px"},onClick:()=>q("unified"),"data-testid":"gg-diff-unified-btn",children:"Unified"}),e("button",{type:"button",className:`gg-btn ${h==="split"?"gg-btn-active":""}`,style:{padding:"2px 6px",fontSize:"11px"},onClick:()=>q("split"),"data-testid":"gg-diff-split-btn",children:"Split"})]}),e("button",{type:"button",className:"gg-btn gg-btn-icon",style:{padding:"2px 6px",fontSize:"11px"},title:U==="source"?"Copy file content":"Copy diff",onClick:()=>A(U==="source"?p?.content??"":r?.rawDiff??"",U==="source"?"Source code":"Diff"),children:"\u{1F4CB}"})]})]}),e("div",{className:"gg-diff-content-scroll",children:U==="source"?T?e("div",{className:"gg-empty",style:{padding:"16px"},children:"Loading source code\u2026"}):p?p.isBinary?e("div",{className:"gg-empty",style:{padding:"16px"},children:"Binary file \u2014 cannot display text content."}):e("table",{className:"gg-source-table","data-testid":"gg-source-code-table",children:e("tbody",{children:p.content.split(/\r?\n/).map((x,E)=>t("tr",{className:"gg-source-line",children:[e("td",{className:"gg-diff-gutter",children:E+1}),e("td",{className:"gg-diff-code",children:x||" "})]},E))})}):e("div",{className:"gg-empty",style:{padding:"16px"},children:"No source code available for this file."}):N?e("div",{className:"gg-empty",style:{padding:"16px"},children:"Loading diff\u2026"}):r?r.isBinary?e("div",{className:"gg-empty",style:{padding:"16px"},children:"Binary file changed \u2014 inline text diff not available."}):r.hunks.length===0?e("div",{className:"gg-empty",style:{padding:"16px"},children:"No textual diff hunks (empty file or mode-only change)."}):h==="unified"?e("table",{className:"gg-diff-table","data-testid":"gg-diff-unified-table",children:e("tbody",{children:r.hunks.map((x,E)=>t(ae.Fragment,{children:[e("tr",{className:"gg-diff-hunk-header",children:e("td",{colSpan:3,className:"gg-diff-code",children:x.header})}),x.lines.map((I,L)=>t("tr",{className:I.type==="add"?"gg-diff-line-add":I.type==="del"?"gg-diff-line-del":"",children:[e("td",{className:"gg-diff-gutter",children:I.oldLineNumber??""}),e("td",{className:"gg-diff-gutter",children:I.newLineNumber??""}),e("td",{className:"gg-diff-code",children:I.type==="add"?`+${I.content}`:I.type==="del"?`-${I.content}`:` ${I.content}`})]},`${E}-${L}`))]},E))})}):e("table",{className:"gg-diff-table","data-testid":"gg-diff-split-table",children:e("tbody",{children:r.hunks.map((x,E)=>{let I=xt(x);return t(ae.Fragment,{children:[e("tr",{className:"gg-diff-hunk-header",children:e("td",{colSpan:4,className:"gg-diff-code",children:x.header})}),I.map((L,re)=>t("tr",{children:[e("td",{className:`gg-diff-gutter ${L.leftType==="del"?"gg-diff-line-del":""}`,children:L.leftLineNumber??""}),e("td",{className:`gg-diff-code ${L.leftType==="del"?"gg-diff-line-del":""}`,style:{width:"50%"},children:L.leftContent}),e("td",{className:`gg-diff-gutter ${L.rightType==="add"?"gg-diff-line-add":""}`,children:L.rightLineNumber??""}),e("td",{className:`gg-diff-code ${L.rightType==="add"?"gg-diff-line-add":""}`,style:{width:"50%"},children:L.rightContent})]},`${E}-${re}`))]},E)})})}):e("div",{className:"gg-empty",style:{padding:"16px"},children:"Select a file to inspect its diff."})})]}):e("div",{className:"gg-empty",style:{height:"100%",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px"},children:"Select a file from the list to inspect changes."})})]})]})]})}function wt({target:o,currentBranch:c,onClose:i,onRunAction:d,onOpenDialog:b,onOpenPullRequest:w,onViewTagDetails:s,onCopyText:h}){if(!o)return null;let l={left:`${Math.min(o.x,window.innerWidth-220)}px`,top:`${Math.min(o.y,window.innerHeight-320)}px`};return e("div",{style:{position:"fixed",inset:0,zIndex:99},onClick:i,onContextMenu:v=>{v.preventDefault(),i()},children:t("div",{className:"gg-context-menu",style:l,onClick:v=>v.stopPropagation(),"data-testid":"gg-context-menu",children:[o.kind==="branch"&&t(j,{children:[t("div",{className:"gg-context-menu-header",children:["Branch: ",o.ref.name]}),o.ref.name!==c&&e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{i(),d({kind:"checkout-branch",branchName:o.ref.name})},children:"Checkout Branch"}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{i(),b({kind:"rename-branch",branchName:o.ref.name})},children:"Rename Branch\u2026"}),o.ref.name!==c&&t(j,{children:[e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{i(),b({kind:"merge-branch",branchName:o.ref.name})},children:"Merge into Current Branch\u2026"}),t("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{i(),b({kind:"rebase-branch",ontoBranch:o.ref.name})},children:["Rebase Current Branch onto ",o.ref.name,"\u2026"]})]}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{i(),b({kind:"push-branch",branchName:o.ref.name})},children:"Push Branch\u2026"}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{i(),b({kind:"pull-branch",branchName:o.ref.name})},children:"Pull into Branch\u2026"}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{i(),w(o.ref.name)},children:"Create Pull Request\u2026"}),e("div",{className:"gg-context-menu-sep"}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{i(),h(o.ref.name,"Branch name")},children:"Copy Branch Name"}),o.ref.name!==c&&e("button",{type:"button",className:"gg-context-menu-item danger",onClick:()=>{i(),b({kind:"delete-branch",branchName:o.ref.name})},children:"Delete Branch\u2026"})]}),o.kind==="remote-branch"&&t(j,{children:[t("div",{className:"gg-context-menu-header",children:["Remote Branch: ",o.ref.remote,"/",o.ref.name]}),t("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{i(),d({kind:"checkout-branch",branchName:o.ref.name,createAndTrackFrom:`${o.ref.remote}/${o.ref.name}`})},children:["Checkout Branch (Track ",o.ref.remote,"/",o.ref.name,")"]}),t("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{i(),d({kind:"fetch-into-local-branch",remote:o.ref.remote||"origin",remoteBranch:o.ref.name,localBranch:o.ref.name,force:!1})},children:["Fetch into Local Branch (",o.ref.name,")"]}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{i(),b({kind:"merge-branch",branchName:`${o.ref.remote}/${o.ref.name}`})},children:"Merge into Current Branch\u2026"}),e("div",{className:"gg-context-menu-sep"}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{i(),h(`${o.ref.remote}/${o.ref.name}`,"Remote branch name")},children:"Copy Remote Branch Name"}),e("button",{type:"button",className:"gg-context-menu-item danger",onClick:()=>{i(),d({kind:"delete-remote-branch",remote:o.ref.remote||"origin",branchName:o.ref.name})},children:"Delete Remote Branch"})]}),o.kind==="tag"&&t(j,{children:[t("div",{className:"gg-context-menu-header",children:["Tag: ",o.ref.name]}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{i(),s(o.ref.name)},children:"View Tag Details"}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{i(),d({kind:"push-tag",tagName:o.ref.name,remote:"origin"})},children:"Push Tag to origin"}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{i(),h(o.ref.name,"Tag name")},children:"Copy Tag Name"}),e("div",{className:"gg-context-menu-sep"}),e("button",{type:"button",className:"gg-context-menu-item danger",onClick:()=>{i(),d({kind:"delete-tag",tagName:o.ref.name,deleteFromRemote:null})},children:"Delete Tag"})]}),o.kind==="stash"&&t(j,{children:[t("div",{className:"gg-context-menu-header",children:["Stash: ",o.selector]}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{i(),d({kind:"stash-apply",selector:o.selector,reinstateIndex:!1})},children:"Apply Stash"}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{i(),d({kind:"stash-pop",selector:o.selector,reinstateIndex:!1})},children:"Pop Stash"}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{i(),b({kind:"stash-branch",selector:o.selector})},children:"Create Branch from Stash\u2026"}),e("div",{className:"gg-context-menu-sep"}),e("button",{type:"button",className:"gg-context-menu-item danger",onClick:()=>{i(),d({kind:"stash-drop",selector:o.selector})},children:"Drop Stash"})]}),o.kind==="uncommitted"&&t(j,{children:[e("div",{className:"gg-context-menu-header",children:"Uncommitted Changes"}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{i(),b({kind:"stash-push"})},children:"Stash Uncommitted Changes\u2026"}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{i(),b({kind:"ask-agent",commitHash:"*"})},children:"\u2728 Ask Agent to Review Working Tree\u2026"}),e("div",{className:"gg-context-menu-sep"}),e("button",{type:"button",className:"gg-context-menu-item danger",onClick:()=>{i(),d({kind:"reset-uncommitted",mode:"hard"})},children:"Reset Working Tree (Hard)"}),e("button",{type:"button",className:"gg-context-menu-item danger",onClick:()=>{i(),b({kind:"clean-untracked"})},children:"Clean Untracked Files\u2026"})]}),o.kind==="commit"&&t(j,{children:[t("div",{className:"gg-context-menu-header",children:["Commit: ",o.commit.abbreviatedHash]}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{i(),b({kind:"create-branch",commit:o.commit})},children:"Create Branch\u2026"}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{i(),b({kind:"add-tag",commit:o.commit})},children:"Add Tag\u2026"}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{i(),d({kind:"checkout-commit",commitHash:o.commit.hash})},children:"Checkout Commit (Detached HEAD)"}),e("div",{className:"gg-context-menu-sep"}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{i(),b({kind:"cherry-pick",commit:o.commit})},children:"Cherry-Pick Commit\u2026"}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{i(),b({kind:"revert-commit",commit:o.commit})},children:"Revert Commit\u2026"}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{i(),b({kind:"reset-commit",commit:o.commit,defaultMode:"mixed"})},children:"Reset Current Branch to Here\u2026"}),e("button",{type:"button",className:"gg-context-menu-item danger",onClick:()=>{i(),b({kind:"drop-commit",commit:o.commit})},children:"Drop Commit\u2026"}),e("div",{className:"gg-context-menu-sep"}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{i(),b({kind:"ask-agent",commitHash:o.commit.hash})},children:"\u2728 Ask Agent about Commit\u2026"}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{i(),h(o.commit.hash,"Commit hash")},children:"Copy Commit Hash"}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{i(),h(o.commit.subject,"Commit subject")},children:"Copy Commit Subject"})]})]})})}function Ct({dialog:o,remotes:c,onClose:i,onRunAction:d,onAskAgentSubmit:b}){let w=c[0]?.name??"origin",[s,h]=k(""),[l,v]=k(""),[m,f]=k(!0),[r,N]=k(!1),[p,T]=k(!1),[C,y]=k("mixed");return o?e("div",{className:"gg-modal-backdrop",onClick:i,children:t("div",{className:"gg-modal",onClick:u=>u.stopPropagation(),"data-testid":`gg-dialog-${o.kind}`,children:[o.kind==="create-branch"&&t(j,{children:[t("div",{className:"gg-modal-header",children:[t("span",{children:["Create Branch at ",o.commit.abbreviatedHash]}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:i,children:"\u2715"})]}),t("div",{className:"gg-modal-body",children:[t("div",{className:"gg-field",children:[e("label",{className:"gg-field-label",children:"Branch Name"}),e("input",{type:"text",className:"gg-input",placeholder:"feature/my-branch",value:s,onChange:u=>h(u.target.value),autoFocus:!0})]}),t("label",{className:"gg-checkbox-row",children:[e("input",{type:"checkbox",checked:m,onChange:u=>f(u.target.checked)}),e("span",{children:"Check out branch after creation"})]})]}),t("div",{className:"gg-modal-footer",children:[e("button",{type:"button",className:"gg-btn",onClick:i,children:"Cancel"}),e("button",{type:"button",className:"gg-btn gg-btn-primary",disabled:!s.trim(),onClick:()=>{d({kind:"create-branch",branchName:s.trim(),startPoint:o.commit.hash,checkout:m}),i()},children:"Create Branch"})]})]}),o.kind==="rename-branch"&&t(j,{children:[t("div",{className:"gg-modal-header",children:[t("span",{children:["Rename Branch ",o.branchName]}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:i,children:"\u2715"})]}),e("div",{className:"gg-modal-body",children:t("div",{className:"gg-field",children:[e("label",{className:"gg-field-label",children:"New Branch Name"}),e("input",{type:"text",className:"gg-input",value:s,placeholder:o.branchName,onChange:u=>h(u.target.value),autoFocus:!0})]})}),t("div",{className:"gg-modal-footer",children:[e("button",{type:"button",className:"gg-btn",onClick:i,children:"Cancel"}),e("button",{type:"button",className:"gg-btn gg-btn-primary",disabled:!s.trim(),onClick:()=>{d({kind:"rename-branch",oldName:o.branchName,newName:s.trim()}),i()},children:"Rename"})]})]}),o.kind==="delete-branch"&&t(j,{children:[t("div",{className:"gg-modal-header",children:[t("span",{children:["Delete Branch ",o.branchName]}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:i,children:"\u2715"})]}),e("div",{className:"gg-modal-body",children:t("label",{className:"gg-checkbox-row",children:[e("input",{type:"checkbox",checked:r,onChange:u=>N(u.target.checked)}),e("span",{children:"Force delete (-D) even if unmerged"})]})}),t("div",{className:"gg-modal-footer",children:[e("button",{type:"button",className:"gg-btn",onClick:i,children:"Cancel"}),e("button",{type:"button",className:"gg-btn gg-btn-primary",onClick:()=>{d({kind:"delete-branch",branchName:o.branchName,force:r}),i()},children:"Delete Branch"})]})]}),o.kind==="merge-branch"&&t(j,{children:[t("div",{className:"gg-modal-header",children:[t("span",{children:["Merge ",o.branchName," into Current Branch"]}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:i,children:"\u2715"})]}),t("div",{className:"gg-modal-body",children:[t("label",{className:"gg-checkbox-row",children:[e("input",{type:"checkbox",checked:r,onChange:u=>N(u.target.checked)}),e("span",{children:"Create a new commit even if fast-forward is possible (--no-ff)"})]}),t("label",{className:"gg-checkbox-row",children:[e("input",{type:"checkbox",checked:p,onChange:u=>T(u.target.checked)}),e("span",{children:"Squash commits (--squash)"})]})]}),t("div",{className:"gg-modal-footer",children:[e("button",{type:"button",className:"gg-btn",onClick:i,children:"Cancel"}),e("button",{type:"button",className:"gg-btn gg-btn-primary",onClick:()=>{d({kind:"merge",target:o.branchName,noFastForward:r,squash:p,noCommit:!1}),i()},children:"Merge"})]})]}),o.kind==="rebase-branch"&&t(j,{children:[t("div",{className:"gg-modal-header",children:[t("span",{children:["Rebase Current Branch onto ",o.ontoBranch]}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:i,children:"\u2715"})]}),e("div",{className:"gg-modal-body",children:t("label",{className:"gg-checkbox-row",children:[e("input",{type:"checkbox",checked:m,onChange:u=>f(u.target.checked)}),e("span",{children:"Auto-stash uncommitted changes before rebase (--autostash)"})]})}),t("div",{className:"gg-modal-footer",children:[e("button",{type:"button",className:"gg-btn",onClick:i,children:"Cancel"}),e("button",{type:"button",className:"gg-btn gg-btn-primary",onClick:()=>{d({kind:"rebase",onto:o.ontoBranch,autostash:m}),i()},children:"Rebase"})]})]}),o.kind==="push-branch"&&t(j,{children:[t("div",{className:"gg-modal-header",children:[t("span",{children:["Push Branch ",o.branchName]}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:i,children:"\u2715"})]}),t("div",{className:"gg-modal-body",children:[t("div",{className:"gg-field",children:[e("label",{className:"gg-field-label",children:"Remote"}),e("input",{type:"text",className:"gg-input",value:s||w,onChange:u=>h(u.target.value)})]}),t("label",{className:"gg-checkbox-row",children:[e("input",{type:"checkbox",checked:m,onChange:u=>f(u.target.checked)}),e("span",{children:"Set upstream (-u)"})]}),t("label",{className:"gg-checkbox-row",children:[e("input",{type:"checkbox",checked:r,onChange:u=>N(u.target.checked)}),e("span",{children:"Force with lease (--force-with-lease)"})]})]}),t("div",{className:"gg-modal-footer",children:[e("button",{type:"button",className:"gg-btn",onClick:i,children:"Cancel"}),e("button",{type:"button",className:"gg-btn gg-btn-primary",onClick:()=>{d({kind:"push-branch",branchName:o.branchName,remote:(s||w).trim(),setUpstream:m,forceMode:r?"force-with-lease":"none"}),i()},children:"Push"})]})]}),o.kind==="pull-branch"&&t(j,{children:[t("div",{className:"gg-modal-header",children:[t("span",{children:["Pull Branch ",o.branchName]}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:i,children:"\u2715"})]}),t("div",{className:"gg-modal-body",children:[t("div",{className:"gg-field",children:[e("label",{className:"gg-field-label",children:"Remote"}),e("input",{type:"text",className:"gg-input",value:s||w,onChange:u=>h(u.target.value)})]}),t("label",{className:"gg-checkbox-row",children:[e("input",{type:"checkbox",checked:r,onChange:u=>N(u.target.checked)}),e("span",{children:"Rebase instead of merge (--rebase)"})]})]}),t("div",{className:"gg-modal-footer",children:[e("button",{type:"button",className:"gg-btn",onClick:i,children:"Cancel"}),e("button",{type:"button",className:"gg-btn gg-btn-primary",onClick:()=>{d({kind:"pull-branch",remote:(s||w).trim(),branchName:o.branchName,noFastForward:!1,squash:!1,rebase:r}),i()},children:"Pull"})]})]}),o.kind==="cherry-pick"&&t(j,{children:[t("div",{className:"gg-modal-header",children:[t("span",{children:["Cherry-Pick Commit ",o.commit.abbreviatedHash]}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:i,children:"\u2715"})]}),t("div",{className:"gg-modal-body",children:[t("label",{className:"gg-checkbox-row",children:[e("input",{type:"checkbox",checked:m,onChange:u=>f(u.target.checked)}),e("span",{children:"Record origin commit hash in message (-x)"})]}),t("label",{className:"gg-checkbox-row",children:[e("input",{type:"checkbox",checked:r,onChange:u=>N(u.target.checked)}),e("span",{children:"Stage changes without committing (--no-commit)"})]})]}),t("div",{className:"gg-modal-footer",children:[e("button",{type:"button",className:"gg-btn",onClick:i,children:"Cancel"}),e("button",{type:"button",className:"gg-btn gg-btn-primary",onClick:()=>{d({kind:"cherry-pick",commitHash:o.commit.hash,parentIndex:o.commit.parents.length>1?1:void 0,recordOrigin:m,noCommit:r}),i()},children:"Cherry-Pick"})]})]}),o.kind==="revert-commit"&&t(j,{children:[t("div",{className:"gg-modal-header",children:[t("span",{children:["Revert Commit ",o.commit.abbreviatedHash]}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:i,children:"\u2715"})]}),e("div",{className:"gg-modal-body",children:t("label",{className:"gg-checkbox-row",children:[e("input",{type:"checkbox",checked:r,onChange:u=>N(u.target.checked)}),e("span",{children:"Stage revert changes without committing (--no-commit)"})]})}),t("div",{className:"gg-modal-footer",children:[e("button",{type:"button",className:"gg-btn",onClick:i,children:"Cancel"}),e("button",{type:"button",className:"gg-btn gg-btn-primary",onClick:()=>{d({kind:"revert-commit",commitHash:o.commit.hash,parentIndex:o.commit.parents.length>1?1:void 0,noCommit:r}),i()},children:"Revert"})]})]}),o.kind==="reset-commit"&&t(j,{children:[t("div",{className:"gg-modal-header",children:[t("span",{children:["Reset Current Branch to ",o.commit.abbreviatedHash]}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:i,children:"\u2715"})]}),e("div",{className:"gg-modal-body",children:t("div",{className:"gg-field",children:[e("label",{className:"gg-field-label",children:"Reset Mode"}),t("select",{className:"gg-select",value:C,onChange:u=>y(u.target.value),children:[e("option",{value:"soft",children:"Soft \u2014 Keep all changes staged"}),e("option",{value:"mixed",children:"Mixed \u2014 Keep working tree, unstage index"}),e("option",{value:"hard",children:"Hard \u2014 Discard all uncommitted changes"})]})]})}),t("div",{className:"gg-modal-footer",children:[e("button",{type:"button",className:"gg-btn",onClick:i,children:"Cancel"}),t("button",{type:"button",className:"gg-btn gg-btn-primary",onClick:()=>{d({kind:"reset-to-commit",commitHash:o.commit.hash,mode:C}),i()},children:["Reset (",C,")"]})]})]}),o.kind==="drop-commit"&&t(j,{children:[t("div",{className:"gg-modal-header",children:[t("span",{children:["Drop Commit ",o.commit.abbreviatedHash,"?"]}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:i,children:"\u2715"})]}),e("div",{className:"gg-modal-body",children:t("p",{style:{margin:0,fontSize:"12px"},children:["This will rebase ",e("code",{children:"HEAD"})," onto the parent of"," ",e("code",{children:o.commit.abbreviatedHash}),", removing this commit from the current branch history."]})}),t("div",{className:"gg-modal-footer",children:[e("button",{type:"button",className:"gg-btn",onClick:i,children:"Cancel"}),e("button",{type:"button",className:"gg-btn gg-btn-primary",onClick:()=>{d({kind:"drop-commit",commitHash:o.commit.hash}),i()},children:"Drop Commit"})]})]}),o.kind==="add-tag"&&t(j,{children:[t("div",{className:"gg-modal-header",children:[t("span",{children:["Add Tag at ",o.commit.abbreviatedHash]}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:i,children:"\u2715"})]}),t("div",{className:"gg-modal-body",children:[t("div",{className:"gg-field",children:[e("label",{className:"gg-field-label",children:"Tag Name"}),e("input",{type:"text",className:"gg-input",placeholder:"v1.0.0",value:s,onChange:u=>h(u.target.value),autoFocus:!0})]}),t("label",{className:"gg-checkbox-row",children:[e("input",{type:"checkbox",checked:m,onChange:u=>f(u.target.checked)}),e("span",{children:"Annotated Tag (-a)"})]}),m&&t("div",{className:"gg-field",children:[e("label",{className:"gg-field-label",children:"Tag Message"}),e("input",{type:"text",className:"gg-input",placeholder:"Release v1.0.0",value:l,onChange:u=>v(u.target.value)})]}),t("label",{className:"gg-checkbox-row",children:[e("input",{type:"checkbox",checked:r,onChange:u=>N(u.target.checked)}),t("span",{children:["Push tag to ",w," immediately"]})]})]}),t("div",{className:"gg-modal-footer",children:[e("button",{type:"button",className:"gg-btn",onClick:i,children:"Cancel"}),e("button",{type:"button",className:"gg-btn gg-btn-primary",disabled:!s.trim(),onClick:()=>{d({kind:"create-tag",tagName:s.trim(),commitHash:o.commit.hash,annotated:m,message:l.trim()||s.trim(),pushToRemote:r?w:null}),i()},children:"Create Tag"})]})]}),o.kind==="tag-details"&&t(j,{children:[t("div",{className:"gg-modal-header",children:[t("span",{children:["Tag Details: ",o.tagName]}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:i,children:"\u2715"})]}),e("div",{className:"gg-modal-body",children:o.details?t("div",{className:"gg-details-meta-grid",children:[e("span",{className:"gg-details-meta-label",children:"Name:"}),e("span",{children:o.details.name}),e("span",{className:"gg-details-meta-label",children:"Type:"}),e("span",{children:o.details.isAnnotated?"Annotated":"Lightweight"}),e("span",{className:"gg-details-meta-label",children:"Target:"}),e("code",{children:o.details.hash}),o.details.taggerName&&t(j,{children:[e("span",{className:"gg-details-meta-label",children:"Tagger:"}),t("span",{children:[o.details.taggerName," <",o.details.taggerEmail,">"]})]}),o.details.message&&t(j,{children:[e("span",{className:"gg-details-meta-label",children:"Message:"}),e("span",{children:o.details.message})]})]}):e("div",{children:"Loading tag details\u2026"})}),e("div",{className:"gg-modal-footer",children:e("button",{type:"button",className:"gg-btn",onClick:i,children:"Close"})})]}),o.kind==="stash-push"&&t(j,{children:[t("div",{className:"gg-modal-header",children:[e("span",{children:"Stash Uncommitted Changes"}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:i,children:"\u2715"})]}),t("div",{className:"gg-modal-body",children:[t("div",{className:"gg-field",children:[e("label",{className:"gg-field-label",children:"Stash Message (optional)"}),e("input",{type:"text",className:"gg-input",placeholder:"WIP: feature changes",value:s,onChange:u=>h(u.target.value),autoFocus:!0})]}),t("label",{className:"gg-checkbox-row",children:[e("input",{type:"checkbox",checked:m,onChange:u=>f(u.target.checked)}),e("span",{children:"Include untracked files (-u)"})]})]}),t("div",{className:"gg-modal-footer",children:[e("button",{type:"button",className:"gg-btn",onClick:i,children:"Cancel"}),e("button",{type:"button",className:"gg-btn gg-btn-primary",onClick:()=>{d({kind:"stash-push",message:s.trim()||void 0,includeUntracked:m}),i()},children:"Stash Changes"})]})]}),o.kind==="stash-branch"&&t(j,{children:[t("div",{className:"gg-modal-header",children:[t("span",{children:["Create Branch from ",o.selector]}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:i,children:"\u2715"})]}),e("div",{className:"gg-modal-body",children:t("div",{className:"gg-field",children:[e("label",{className:"gg-field-label",children:"Branch Name"}),e("input",{type:"text",className:"gg-input",placeholder:"stash-recovery",value:s,onChange:u=>h(u.target.value),autoFocus:!0})]})}),t("div",{className:"gg-modal-footer",children:[e("button",{type:"button",className:"gg-btn",onClick:i,children:"Cancel"}),e("button",{type:"button",className:"gg-btn gg-btn-primary",disabled:!s.trim(),onClick:()=>{d({kind:"stash-branch",selector:o.selector,branchName:s.trim()}),i()},children:"Create Branch"})]})]}),o.kind==="clean-untracked"&&t(j,{children:[t("div",{className:"gg-modal-header",children:[e("span",{children:"Clean Untracked Files"}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:i,children:"\u2715"})]}),e("div",{className:"gg-modal-body",children:t("label",{className:"gg-checkbox-row",children:[e("input",{type:"checkbox",checked:m,onChange:u=>f(u.target.checked)}),e("span",{children:"Include untracked directories (-d)"})]})}),t("div",{className:"gg-modal-footer",children:[e("button",{type:"button",className:"gg-btn",onClick:i,children:"Cancel"}),e("button",{type:"button",className:"gg-btn gg-btn-primary",onClick:()=>{d({kind:"clean-untracked",includeDirectories:m}),i()},children:"Clean Files"})]})]}),o.kind==="ask-agent"&&t(j,{children:[t("div",{className:"gg-modal-header",children:[t("span",{children:["\u2728 Ask Zana Agent about"," ",o.commitHash==="*"?"Uncommitted Changes":`Commit ${o.commitHash.slice(0,8)}`]}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:i,children:"\u2715"})]}),t("div",{className:"gg-modal-body",children:[t("div",{className:"gg-field",children:[e("label",{className:"gg-field-label",children:"Instruction / Question for the Agent"}),e("input",{type:"text",className:"gg-input",placeholder:"Review this commit for regressions or explain the changes\u2026",value:s,onChange:u=>h(u.target.value),autoFocus:!0})]}),o.filePath&&t("div",{style:{fontSize:"11px",color:"var(--text-secondary)"},children:["Focused file: ",e("code",{children:o.filePath})]})]}),t("div",{className:"gg-modal-footer",children:[e("button",{type:"button",className:"gg-btn",onClick:i,children:"Cancel"}),e("button",{type:"button",className:"gg-btn gg-btn-primary",onClick:()=>{b(o.commitHash,o.filePath,s.trim()),i()},children:"Spawn Agent Thread"})]})]})]})}):null}function kt({open:o,remotes:c,repoSettings:i,globalSettings:d,onClose:b,onRunGitAction:w,onUpdateRepoSettings:s,onUpdateGlobalSettings:h,onExportRepoConfig:l}){let[v,m]=k(""),[f,r]=k(""),[N,p]=k(""),[T,C]=k("");return o?e("div",{className:"gg-modal-backdrop",onClick:b,children:t("div",{className:"gg-modal",style:{width:"560px"},onClick:y=>y.stopPropagation(),"data-testid":"gg-repo-settings-modal",children:[t("div",{className:"gg-modal-header",children:[e("span",{children:"Repository & Graph Settings"}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:b,children:"\u2715"})]}),t("div",{className:"gg-modal-body",style:{gap:"16px"},children:[t("div",{className:"gg-field",children:[t("label",{className:"gg-field-label",children:["Git Remotes (",c.length,")"]}),t("div",{style:{display:"flex",flexDirection:"column",gap:"6px"},children:[c.map(y=>t("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"8px",padding:"6px 8px",background:"var(--bg-secondary, #0f1318)",borderRadius:"4px",border:"1px solid var(--border-color, #252b35)"},children:[t("div",{style:{overflow:"hidden"},children:[e("strong",{children:y.name}),e("div",{style:{fontSize:"11px",color:"var(--text-secondary)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:y.fetchUrl})]}),t("div",{style:{display:"flex",gap:"4px",flexShrink:0},children:[e("button",{type:"button",className:"gg-btn",onClick:()=>w({kind:"remote-prune",name:y.name}),title:"Prune stale remote-tracking branches",children:"Prune"}),e("button",{type:"button",className:"gg-btn",onClick:()=>w({kind:"remote-delete",name:y.name}),title:"Remove Remote",children:"Delete"})]})]},y.name)),t("div",{style:{display:"flex",gap:"6px"},children:[e("input",{type:"text",className:"gg-input",style:{width:"110px"},placeholder:"upstream",value:v,onChange:y=>m(y.target.value)}),e("input",{type:"text",className:"gg-input",style:{flex:1},placeholder:"https://github.com/org/repo.git",value:f,onChange:y=>r(y.target.value)}),e("button",{type:"button",className:"gg-btn gg-btn-primary",disabled:!v.trim()||!f.trim(),onClick:()=>{w({kind:"remote-add",name:v.trim(),url:f.trim(),fetch:!0}),m(""),r("")},children:"Add Remote"})]})]})]}),t("div",{className:"gg-field",children:[e("label",{className:"gg-field-label",children:"Pull Request Creation"}),t("div",{style:{display:"flex",gap:"8px"},children:[t("select",{className:"gg-select",value:i.pullRequestConfig.provider,onChange:y=>s({pullRequestConfig:{...i.pullRequestConfig,provider:y.target.value}}),children:[e("option",{value:"github",children:"GitHub"}),e("option",{value:"gitlab",children:"GitLab"}),e("option",{value:"bitbucket",children:"Bitbucket"}),e("option",{value:"custom",children:"Custom URL Template"})]}),e("input",{type:"text",className:"gg-input",placeholder:"Remote (origin)",value:i.pullRequestConfig.remoteName,onChange:y=>s({pullRequestConfig:{...i.pullRequestConfig,remoteName:y.target.value}})}),e("input",{type:"text",className:"gg-input",placeholder:"Target branch (main)",value:i.pullRequestConfig.targetBranch,onChange:y=>s({pullRequestConfig:{...i.pullRequestConfig,targetBranch:y.target.value}})})]})]}),t("div",{className:"gg-field",children:[t("label",{className:"gg-field-label",children:["Issue Linking Rules (",i.issueLinkingRules.length,")"]}),t("div",{style:{display:"flex",flexDirection:"column",gap:"6px"},children:[i.issueLinkingRules.map(y=>t("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"8px",fontSize:"11px"},children:[t("code",{children:["/",y.pattern,"/ \u2192 ",y.urlTemplate]}),e("button",{type:"button",className:"gg-btn",onClick:()=>s({issueLinkingRules:i.issueLinkingRules.filter(u=>u.id!==y.id)}),children:"Remove"})]},y.id)),t("div",{style:{display:"flex",gap:"6px"},children:[e("input",{type:"text",className:"gg-input",style:{width:"150px"},placeholder:"#(\\d+)",value:N,onChange:y=>p(y.target.value)}),e("input",{type:"text",className:"gg-input",style:{flex:1},placeholder:"https://github.com/org/repo/issues/$1",value:T,onChange:y=>C(y.target.value)}),e("button",{type:"button",className:"gg-btn",disabled:!N.trim()||!T.trim(),onClick:()=>{let y={id:`rule-${Date.now()}`,pattern:N.trim(),urlTemplate:T.trim()};s({issueLinkingRules:[...i.issueLinkingRules,y]}),p(""),C("")},children:"Add Rule"})]})]})]}),t("div",{className:"gg-field",children:[e("label",{className:"gg-field-label",children:"Graph Display & Muting"}),t("label",{className:"gg-checkbox-row",children:[e("input",{type:"checkbox",checked:d.muteNonAncestors,onChange:y=>h({muteNonAncestors:y.target.checked})}),e("span",{children:"Dim commits that are not ancestors of HEAD"})]}),t("label",{className:"gg-checkbox-row",children:[e("input",{type:"checkbox",checked:d.muteMergeCommits,onChange:y=>h({muteMergeCommits:y.target.checked})}),e("span",{children:"Dim merge commits (commits with >1 parent)"})]}),t("div",{style:{display:"flex",gap:"8px",marginTop:"6px"},children:[t("select",{className:"gg-select",value:d.dateFormat,onChange:y=>h({dateFormat:y.target.value}),children:[e("option",{value:"relative",children:"Date Format: Relative"}),e("option",{value:"iso",children:"Date Format: ISO"}),e("option",{value:"datetime",children:"Date Format: Local Date/Time"})]}),t("select",{className:"gg-select",value:d.dateType,onChange:y=>h({dateType:y.target.value}),children:[e("option",{value:"author",children:"Show Author Date"}),e("option",{value:"commit",children:"Show Commit Date"})]})]})]})]}),t("div",{className:"gg-modal-footer",children:[e("button",{type:"button",className:"gg-btn",onClick:l,title:"Write .git-graph.json into the repository root",children:"Export .git-graph.json"}),e("button",{type:"button",className:"gg-btn gg-btn-primary",onClick:b,children:"Done"})]})]})}):null}var me=28,Je=14,Ke=14;function Nt({focusWindow:o,bringBack:c}){return e("div",{className:"gg-root","data-testid":"gg-detached-placeholder",children:t("div",{className:"gg-empty",style:{gap:"12px"},children:[e("div",{style:{fontSize:"14px",fontWeight:600},children:"Git Graph is open in its own window"}),t("div",{style:{display:"flex",gap:"8px"},children:[e("button",{type:"button",className:"gg-btn gg-btn-primary",onClick:o,children:"Focus Window"}),e("button",{type:"button",className:"gg-btn",onClick:c,children:"Bring Back Here"})]})]})})}function St({projectId:o,headerActions:c}){let i=ct(),d={projectId:null};try{d=dt()}catch{}let[b,w]=k([]),[s,h]=k(o||d.projectId||""),l=o||s||d.projectId||"",v=null;try{v=pt()}catch{v=null}ce(()=>{!o&&!s&&i.call("listProjects").then(n=>{let a=Array.isArray(n)?n:[];w(a),a.length>0&&!s&&h(a[0].id)}).catch(()=>{})},[o,s,i]);let[m,f]=k([]),[r,N]=k(""),[p,T]=k(null),[C,y]=k(300),[u,$]=k(!0),[q,te]=k(null),[ne,D]=k(null),[R,B]=k(null),[A,Z]=k(null),[ge,S]=k(null),[U,he]=k(null),[de,Q]=k(!1),[Re,Y]=k(null),[Ae,Pe]=k(null),[be,fe]=k(null),[x,E]=k(!1),[I,L]=k(null),[re,se]=k(!1),[Te,Ie]=k(!1),[je,At]=k(""),[$e,Be]=k(0),[ze,ie]=k(null),[He,pe]=k(null),[Tt,Qe]=k(!1),[Fe,Ye]=k(!1),Oe=ye(null),Ve=ye(null),W=O(async(n,a,g)=>{let P=g??l;if(!P){$(!1);return}$(!0),te(null);try{let M=await i.call("discoverRepos",{projectId:P}),H=Array.isArray(M)?M:M?.repos??[];if(f(H),H.length===0){T(null),$(!1);return}let V=n!==void 0?n:H.some(X=>X.relPath===r)?r:H[0].relPath;V!==r&&N(V);let _=await i.call("loadGraph",{projectId:P,subRepoRelPath:V,maxCommits:a??C});T(_)}catch(M){te(M instanceof Error?M.message:String(M))}finally{$(!1)}},[l,i,r,C]);ce(()=>{W()},[l]),gt("git-graph:changed",n=>{let a=n;(!a?.projectId||a.projectId===l)&&W(r,C)}),ce(()=>{if(!l||!R){S(null),he(null),Y(null),Pe(null),fe(null),L(null);return}let n=!1;return Q(!0),Pe(null),fe(null),L(null),(async()=>{try{if(A&&A!==R){let g=await i.call("compareCommits",{projectId:l,subRepoRelPath:r,fromHash:R,toHash:A});if(n)return;he(g.comparison),S(null),Y(g.codeReview),g.comparison.fileChanges.length>0&&_e(g.comparison.fileChanges[0],A,R)}else{let g=await i.call("getCommitDetails",{projectId:l,subRepoRelPath:r,commitHash:R});if(n)return;S(g.details),he(null),Y(g.codeReview),g.details.fileChanges.length>0&&_e(g.details.fileChanges[0],R,void 0)}}catch(g){n||D({kind:"error",text:g instanceof Error?g.message:String(g)})}finally{n||Q(!1)}})(),()=>{n=!0}},[l,r,R,A]);let De=O(async(n,a)=>{let g=a??A??R;if(g){se(!0);try{let P=await i.call("getFileContent",{projectId:l,subRepoRelPath:r,commitHash:g,filePath:n});L(P)}catch(P){D({kind:"error",text:P instanceof Error?P.message:String(P)})}finally{se(!1)}}},[l,i,r,R,A]),_e=O(async(n,a,g)=>{let P=a??A??R;if(!P)return;let M=g!==void 0?g:A?R??void 0:void 0;Pe(n.newPath),E(!0),L(null),De(n.newPath,P);try{let H=await i.call("getFileDiff",{projectId:l,subRepoRelPath:r,commitHash:P,fromHash:M,filePath:n.newPath,oldPath:n.oldPath!==n.newPath?n.oldPath:void 0,staged:n.staged,untracked:n.untracked});fe(H)}catch(H){D({kind:"error",text:H instanceof Error?H.message:String(H)})}finally{E(!1)}},[l,i,r,R,A,De]),z=p?.commits??[],ue=p?.headHash??null,G=p?.globalSettings??{graphStyle:"rounded",initialLoadCommits:300,loadMoreCommits:100,muteNonAncestors:!1,muteMergeCommits:!1,commitDetailsLocation:"docked",fileViewType:"tree",compactFolders:!0,diffViewMode:"unified",maxDepthOfRepoSearch:2,dateType:"author",dateFormat:"relative",fetchAndPrune:!1,fetchAndPruneTags:!1,signCommits:!1,signTags:!1,useMailmap:!0,graphColors:[]},we=p?.repoSettings??{selectedBranches:[],showRemoteBranches:!0,showStashes:!0,showTags:!0,showUncommittedChanges:!0,showUntrackedFiles:!0,onlyFollowFirstParent:!1,commitOrdering:"date",issueLinkingRules:[],pullRequestConfig:{provider:"github",remoteName:"origin",targetBranch:"main"}},Ce=ee(()=>ht(z,ue,G.graphColors),[z,ue,G.graphColors]),Me=ee(()=>Math.max(48,Ke*2+(Ce.maxLane+1)*Je),[Ce.maxLane]),oe=ee(()=>{let n=je.trim().toLowerCase();if(!n)return[];let a=[];return z.forEach((g,P)=>{[g.hash,g.abbreviatedHash,g.subject,g.authorName,g.authorEmail,...g.refs.map(H=>H.remote?`${H.remote}/${H.name}`:H.name)].join(" ").toLowerCase().includes(n)&&a.push(P)}),a},[z,je]),xe=O(n=>{let a=Oe.current;if(!a)return;let g=Math.max(0,n*me-a.clientHeight/3);a.scrollTo?.({top:g,behavior:"smooth"})},[]),Ue=O(()=>{if(!ue)return;let n=z.findIndex(a=>a.hash===ue);n>=0&&(B(ue),Z(null),xe(n))},[z,ue,xe]),ke=O(async n=>{try{D(null),await i.call("runGitAction",{projectId:l,subRepoRelPath:r,action:n}),await W(r,C)}catch(a){D({kind:"error",text:a instanceof Error?a.message:String(a)})}},[l,i,r,W,C]),It=O(async()=>{if(!(!l||Fe)){Ye(!0),D(null);try{await i.call("runGitAction",{projectId:l,subRepoRelPath:"",action:"init"}),await W()}catch(n){D({kind:"error",text:n instanceof Error?n.message:String(n)})}finally{Ye(!1)}}},[l,Fe,i,W]),Xe=O(async n=>{try{await i.call("updateRepoSettings",{projectId:l,subRepoRelPath:r,patch:n}),await W(r,C)}catch(a){D({kind:"error",text:a instanceof Error?a.message:String(a)})}},[l,i,r,W,C]),le=O(async n=>{try{await i.call("updateGlobalSettings",{patch:n}),T(a=>a&&{...a,globalSettings:{...a.globalSettings,...n}})}catch(a){D({kind:"error",text:a instanceof Error?a.message:String(a)})}},[i]),qe=O((n,a)=>{navigator.clipboard?.writeText(n),D({kind:"info",text:`${a} copied to clipboard.`})},[]),jt=O(async n=>{pe({kind:"tag-details",tagName:n,details:null});try{let a=await i.call("getTagDetails",{projectId:l,subRepoRelPath:r,tagName:n});pe({kind:"tag-details",tagName:n,details:a})}catch(a){D({kind:"error",text:a instanceof Error?a.message:String(a)})}},[l,i,r]),Ft=O(async n=>{try{let a=await i.call("buildPullRequestUrl",{projectId:l,subRepoRelPath:r,sourceBranch:n});a.url?window.open(a.url,"_blank","noopener,noreferrer"):D({kind:"error",text:"Could not derive a Pull Request URL from the configured remote."})}catch(a){D({kind:"error",text:a instanceof Error?a.message:String(a)})}},[l,i,r]),Dt=O(async(n,a,g)=>{try{let P=await i.call("askAgentAboutCommit",{projectId:l,subRepoRelPath:r,commitHash:n,filePath:a,userPrompt:g});D({kind:"info",text:`Spawned Agent thread: ${P.title}`}),v&&(v.openPanelAgent?.({threadId:P.threadId,title:P.title})||v.toThread(P.threadId))}catch(P){D({kind:"error",text:P instanceof Error?P.message:String(P)})}},[l,i,r,v]),et=O(async()=>{if(!R)return;let n=A?R:null,a=A??R;try{let g=await i.call("codeReviewStart",{projectId:l,subRepoRelPath:r,fromHash:n,toHash:a});Y(g)}catch(g){D({kind:"error",text:g instanceof Error?g.message:String(g)})}},[l,i,r,R,A]),tt=O(async(n,a)=>{if(!R)return;let g=A?R:null,P=A??R;try{let M=await i.call("codeReviewToggleFile",{projectId:l,subRepoRelPath:r,fromHash:g,toHash:P,filePath:n,reviewed:a});Y(M)}catch(M){D({kind:"error",text:M instanceof Error?M.message:String(M)})}},[l,i,r,R,A]),nt=O(async()=>{if(!R)return;let n=A?R:null,a=A??R;try{await i.call("codeReviewEnd",{projectId:l,subRepoRelPath:r,fromHash:n,toHash:a}),Y(null)}catch(g){D({kind:"error",text:g instanceof Error?g.message:String(g)})}},[l,i,r,R,A]),_t=O(n=>{if((n.ctrlKey||n.metaKey)&&n.key.toLowerCase()==="f"){n.preventDefault(),Ie(!0);return}if((n.ctrlKey||n.metaKey)&&n.key.toLowerCase()==="h"){n.preventDefault(),Ue();return}if((n.ctrlKey||n.metaKey)&&n.key.toLowerCase()==="r"){n.preventDefault(),W(r,C);return}if(n.key==="Escape"){ze?ie(null):He?pe(null):Te?Ie(!1):R&&(B(null),Z(null));return}if(n.key==="ArrowDown"||n.key==="ArrowUp"){if(z.length===0)return;let a=R?z.findIndex(M=>M.hash===R):-1,g=n.key==="ArrowDown"?Math.min(z.length-1,a+1):Math.max(0,a<=0?0:a-1),P=z[g];P&&(n.preventDefault(),B(P.hash),Z(null))}},[z,R,ze,He,Te,Ue,W,r,C]),Mt=(n,a,g)=>{let P=a.type==="head"?`gg-ref-badge gg-ref-head ${a.isHead?"is-current":""}`:a.type==="remote"?"gg-ref-badge gg-ref-remote":a.type==="tag"?"gg-ref-badge gg-ref-tag":"gg-ref-badge gg-ref-stash",M=a.type==="remote"?"\u2601":a.type==="tag"?"\u{1F3F7}":a.type==="stash"?"\u{1F4E6}":a.isHead?"\u25CF":"\u2442",H=a.type==="remote"&&a.remote?`${a.remote}/${a.name}`:a.name;return t("span",{className:P,title:a.type==="head"?a.isHead?`Current branch: ${a.name}`:`Branch: ${a.name} (Double-click to checkout)`:a.type==="remote"?`Remote branch: ${H}`:a.type==="tag"?`Tag: ${a.name}`:`Stash: ${a.name}`,onContextMenu:V=>{V.preventDefault(),V.stopPropagation(),a.type==="head"?ie({kind:"branch",commit:n,ref:a,x:V.clientX,y:V.clientY}):a.type==="remote"?ie({kind:"remote-branch",commit:n,ref:a,x:V.clientX,y:V.clientY}):a.type==="tag"?ie({kind:"tag",commit:n,ref:a,x:V.clientX,y:V.clientY}):a.type==="stash"&&ie({kind:"stash",commit:n,selector:a.selector||a.name,x:V.clientX,y:V.clientY})},onDoubleClick:V=>{V.stopPropagation(),a.type==="head"&&!a.isHead&&ke({kind:"checkout-branch",branchName:a.name})},children:[e("span",{className:"gg-ref-icon",children:M}),e("span",{className:"gg-ref-name",children:H})]},`${a.type}:${a.remote??""}:${a.name}:${g}`)},Lt=n=>Ee(n,we.issueLinkingRules).map((g,P)=>g.kind==="code"?e("code",{style:{background:"rgba(255,255,255,0.08)",padding:"0 4px",borderRadius:"3px",fontSize:"11px"},children:g.text},P):g.kind==="link"&&g.href?e("a",{href:g.href,target:"_blank",rel:"noreferrer",onClick:M=>M.stopPropagation(),style:{color:"var(--accent-color, #4da3ff)"},children:g.text},P):e(ae.Fragment,{children:g.text},P)),J=!!R,K=G.commitDetailsLocation==="inline",[Ne,Gt]=k(340),[it,Et]=k(0),[Ze,ot]=k(0),at=ye(null);ce(()=>{let n=Oe.current;if(!n)return;let a=()=>{n&&(Et(n.clientWidth),ot(n.scrollLeft))};if(a(),typeof ResizeObserver<"u"){let g=new ResizeObserver(a);return g.observe(n),()=>g.disconnect()}},[p,u,z.length]);let rt=Math.max(Me+8,Ze+8),Le=it>0?Math.max(280,Ze+it-rt-16):void 0,ve=ee(()=>{if(!J||!K)return-1;let n=A??R;return n?z.findIndex(a=>a.hash===n):-1},[J,K,A,R,z]);ce(()=>{let n=at.current;if(!n)return;let a=()=>{if(n){let g=n.offsetHeight;g>0&&Gt(g)}};if(a(),typeof ResizeObserver<"u"){let g=new ResizeObserver(a);return g.observe(n),()=>g.disconnect()}},[K,J,R,A,ge,U,be,de,x]);let $t=ee(()=>{let n=z.length*me;return K&&J&&ve>=0?n+Ne+12:n},[z.length,K,J,ve,Ne]),Bt=O(n=>K&&J&&ve>=0&&n>ve?n*me+Ne+12+me/2:n*me+me/2,[K,J,ve,Ne]);return t("div",{className:"gg-root",tabIndex:0,onKeyDown:_t,"data-testid":"gg-project-tab",children:[e(yt,{projects:b,selectedProjectId:l,onSelectProject:n=>{h(n),B(null),Z(null),W(void 0,void 0,n)},repos:m,selectedRepoRelPath:r,onSelectRepo:n=>{B(null),Z(null),N(n),W(n,C)},branches:p?.branches??[],remoteBranches:p?.remoteBranches??[],repoSettings:we,globalSettings:G,loading:u,findOpen:Te,headerActions:c,onUpdateRepoSettings:n=>{Xe(n)},onUpdateGlobalSettings:n=>{le(n)},onFetch:()=>{ke({kind:"fetch",all:!0,prune:G.fetchAndPrune,pruneTags:G.fetchAndPruneTags})},onScrollToHead:Ue,onToggleFind:()=>Ie(n=>!n),onOpenRepoSettings:()=>Qe(!0),onRefresh:()=>{W(r,C)}}),ne&&t("div",{className:`gg-banner ${ne.kind==="error"?"gg-banner-error":"gg-banner-info"}`,"data-testid":"gg-banner",children:[e("span",{children:ne.text}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:()=>D(null),children:"\u2715"})]}),t("div",{className:"gg-workspace",children:[Te&&e(Pt,{query:je,matchCount:oe.length,activeMatchIndex:$e,onChangeQuery:n=>{At(n),Be(0)},onNext:()=>{if(oe.length===0)return;let n=($e+1)%oe.length;Be(n);let a=oe[n];B(z[a].hash),xe(a)},onPrev:()=>{if(oe.length===0)return;let n=($e-1+oe.length)%oe.length;Be(n);let a=oe[n];B(z[a].hash),xe(a)},onClose:()=>Ie(!1)}),t("div",{className:"gg-table-container",children:[t("div",{className:"gg-table-header",ref:Ve,style:{overflow:"hidden"},children:[e("div",{style:{width:`${Me}px`,flexShrink:0,paddingLeft:"8px",boxSizing:"border-box"},children:"Graph"}),e("div",{style:{flex:"1 1 auto",minWidth:"260px",padding:"0 8px",boxSizing:"border-box"},children:"Description"}),e("div",{style:{width:"125px",flexShrink:0,padding:"0 6px",boxSizing:"border-box"},children:"Date"}),e("div",{style:{width:"130px",flexShrink:0,padding:"0 6px",boxSizing:"border-box"},children:"Author"}),e("div",{style:{width:"74px",flexShrink:0,textAlign:"right",paddingRight:"8px",boxSizing:"border-box"},children:"Commit"})]}),u&&!p?e("div",{className:"gg-empty",children:"Loading Git Graph\u2026"}):q?t("div",{className:"gg-empty",children:[t("div",{children:["Failed to load Git Graph: ",q]}),e("button",{type:"button",className:"gg-btn",style:{marginTop:"8px"},onClick:()=>{W(r,C)},children:"Retry"})]}):m.length===0?t("div",{className:"gg-empty",style:{gap:"12px"},children:[e("div",{children:"No Git repositories found in this project."}),e("button",{type:"button",className:"gg-btn gg-btn-primary","data-testid":"gg-init-repo-btn",disabled:Fe,onClick:()=>{It()},children:Fe?"Initializing\u2026":"Initialize Git Repository"})]}):z.length===0?e("div",{className:"gg-empty",children:ue?"No commits match the current branch filters.":"Repository initialized with no commits or uncommitted changes yet."}):t("div",{className:"gg-table-scroll",ref:Oe,onScroll:n=>{let a=n.currentTarget.scrollLeft;a!==Ze&&ot(a),Ve.current&&(Ve.current.scrollLeft=a)},children:[t("div",{className:"gg-rows-wrapper",children:[t("svg",{className:"gg-svg-overlay",width:Me,height:$t,"data-testid":"gg-svg-dag",children:[Ce.segments.map((n,a)=>e("path",{d:bt({segment:n,rowHeight:me,laneWidth:Je,padX:Ke,style:G.graphStyle,expandedRow:K&&J?ve:-1,detailsHeight:K&&J?Ne+12:0}),fill:"none",stroke:n.color,strokeWidth:2,strokeDasharray:n.isUncommitted?"3 3":void 0},a)),Ce.nodes.map(n=>{let a=Ke+n.lane*Je,g=Bt(n.row),P=R===n.commit.hash;return n.commit.isUncommitted?e("circle",{cx:a,cy:g,r:P?5.5:4.5,fill:"var(--bg-primary, #12151a)",stroke:n.color,strokeWidth:P?2.5:2,strokeDasharray:"2 2"},n.commit.hash):n.commit.isStash?e("rect",{x:a-(P?5:4),y:g-(P?5:4),width:P?10:8,height:P?10:8,rx:2,fill:"var(--bg-primary, #12151a)",stroke:n.color,strokeWidth:P?2.5:2},n.commit.hash):n.isMerge?t("g",{children:[e("circle",{cx:a,cy:g,r:P?5.5:4.5,fill:"var(--bg-primary, #12151a)",stroke:P?"#ffffff":n.color,strokeWidth:P?2.5:2}),e("circle",{cx:a,cy:g,r:2,fill:n.color})]},n.commit.hash):e("circle",{cx:a,cy:g,r:P?5.5:n.commit.isHead?5:4,fill:n.color,stroke:P||n.commit.isHead?"#ffffff":"var(--bg-primary, #12151a)",strokeWidth:P?2:n.commit.isHead?1.5:1},n.commit.hash)})]}),Ce.nodes.map(n=>{let{commit:a}=n,g=R===a.hash,P=A===a.hash,M=je.trim().length>0&&oe.includes(n.row),H=G.muteNonAncestors&&!n.isAncestorOfHead||G.muteMergeCommits&&n.isMerge,V=G.dateType==="commit"?a.commitDate:a.authorDate;return t(ae.Fragment,{children:[t("div",{className:["gg-commit-row",g?"selected":"",P?"compared":"",H?"muted":"",M?"search-match":"",a.isUncommitted?"uncommitted":""].filter(Boolean).join(" "),onClick:_=>{(_.ctrlKey||_.metaKey)&&R&&R!==a.hash?Z(a.hash):(B(X=>X===a.hash&&!A?null:a.hash),Z(null))},onContextMenu:_=>{_.preventDefault(),a.isUncommitted?ie({kind:"uncommitted",commit:a,x:_.clientX,y:_.clientY}):a.isStash&&a.stashSelector?ie({kind:"stash",commit:a,selector:a.stashSelector,x:_.clientX,y:_.clientY}):ie({kind:"commit",commit:a,x:_.clientX,y:_.clientY})},"data-testid":`gg-commit-row-${a.abbreviatedHash}`,children:[e("div",{className:"gg-graph-spacer",style:{width:`${Me}px`}}),t("div",{className:"gg-commit-desc",children:[a.refs.map((_,X)=>Mt(a,_,X)),e("span",{className:"gg-commit-subject",children:Lt(a.subject)})]}),e("div",{className:"gg-commit-date",children:a.isUncommitted?"Working Tree":Se(V,G.dateFormat)}),e("div",{className:"gg-commit-author",title:a.authorEmail,children:a.authorName}),e("div",{className:"gg-commit-hash",children:a.abbreviatedHash})]}),K&&J&&(!A&&g||A&&P)&&e("div",{ref:at,className:"gg-inline-details-wrapper",style:{marginLeft:`${rt}px`,width:Le!==void 0?`${Le}px`:void 0,maxWidth:Le!==void 0?`${Le}px`:"100%",marginBottom:"8px",boxSizing:"border-box"},children:e(We,{mode:A?"comparison":"single",details:ge,comparison:U,loading:de,inline:!0,fileViewType:G.fileViewType,compactFolders:G.compactFolders,diffViewMode:G.diffViewMode,dateFormat:G.dateFormat,issueRules:we.issueLinkingRules,codeReview:Re,selectedFilePath:Ae,fileDiff:be,loadingDiff:x,fileContent:I,loadingContent:re,onSelectFile:_=>{_e(_)},onLoadFileContent:_=>{De(_)},onChangeFileViewType:_=>{le({fileViewType:_})},onToggleCompactFolders:()=>{le({compactFolders:!G.compactFolders})},onChangeDiffViewMode:_=>{le({diffViewMode:_})},onStartCodeReview:()=>{et()},onToggleReviewedFile:(_,X)=>{tt(_,X)},onEndCodeReview:()=>{nt()},onSelectParentHash:_=>{B(_),Z(null);let X=z.findIndex(zt=>zt.hash===_);X>=0&&xe(X)},onAskAgent:_=>pe({kind:"ask-agent",commitHash:A??R??"*",filePath:_}),onCopyText:qe,onClose:()=>{B(null),Z(null)}})})]},a.hash)})]}),p?.hasMore&&e("div",{className:"gg-load-more-row",children:t("button",{type:"button",className:"gg-btn",onClick:()=>{let n=C+(G.loadMoreCommits||100);y(n),W(r,n)},"data-testid":"gg-load-more-btn",children:["Load ",G.loadMoreCommits||100," More Commits"]})})]})]}),!K&&J&&e(We,{mode:A?"comparison":"single",details:ge,comparison:U,loading:de,inline:!1,fileViewType:G.fileViewType,compactFolders:G.compactFolders,diffViewMode:G.diffViewMode,dateFormat:G.dateFormat,issueRules:we.issueLinkingRules,codeReview:Re,selectedFilePath:Ae,fileDiff:be,loadingDiff:x,fileContent:I,loadingContent:re,onSelectFile:n=>{_e(n)},onLoadFileContent:n=>{De(n)},onChangeFileViewType:n=>{le({fileViewType:n})},onToggleCompactFolders:()=>{le({compactFolders:!G.compactFolders})},onChangeDiffViewMode:n=>{le({diffViewMode:n})},onStartCodeReview:()=>{et()},onToggleReviewedFile:(n,a)=>{tt(n,a)},onEndCodeReview:()=>{nt()},onSelectParentHash:n=>{B(n),Z(null);let a=z.findIndex(g=>g.hash===n);a>=0&&xe(a)},onAskAgent:n=>pe({kind:"ask-agent",commitHash:A??R??"*",filePath:n}),onCopyText:qe,onClose:()=>{B(null),Z(null)}})]}),e(wt,{target:ze,currentBranch:p?.currentBranch??null,onClose:()=>ie(null),onRunAction:n=>{ke(n)},onOpenDialog:n=>pe(n),onOpenPullRequest:n=>{Ft(n)},onViewTagDetails:n=>{jt(n)},onCopyText:qe}),e(Ct,{dialog:He,remotes:p?.remotes??[],onClose:()=>pe(null),onRunAction:n=>{ke(n)},onAskAgentSubmit:(n,a,g)=>{Dt(n,a,g)}}),e(kt,{open:Tt,remotes:p?.remotes??[],repoSettings:we,globalSettings:G,onClose:()=>Qe(!1),onRunGitAction:n=>{ke(n)},onUpdateRepoSettings:n=>{Xe(n)},onUpdateGlobalSettings:n=>{le(n)},onExportRepoConfig:async()=>{try{let n=await i.call("exportRepoConfig",{projectId:l,subRepoRelPath:r});D({kind:"info",text:`Exported repository config to ${n.filePath}`})}catch(n){D({kind:"error",text:n instanceof Error?n.message:String(n)})}}})]})}var Rt="zcc-ext-git-graph-styles";function Vt(){if(typeof document>"u"||document.getElementById(Rt))return;let o=document.createElement("style");o.id=Rt,o.textContent=ut,document.head.appendChild(o)}var di=lt(o=>{Vt(),o.slots.projectTab({id:"git-graph",label:"Git Graph",icon:"GitBranch",order:40,global:!1,header:"custom",detachable:!0,component:St,detachedPlaceholder:Nt}),o.slots.commandPaletteAction({id:"open-git-graph",title:"Git Graph: View Git Graph",isAvailable:c=>!!c.projectId,run:c=>{c.projectId&&c.toProject(c.projectId,{tabId:"git-graph"})}})});export{di as default};
