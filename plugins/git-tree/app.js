// ../../../../../../../Applications/Zana.app/Contents/Resources/zcc-cli/runtime/plugin-sdk-app.js
function pluginRuntime() {
  return globalThis.__ZCC_PLUGIN_RUNTIME__ ?? {};
}
function missing(name) {
  throw new Error(`${name} is not available until the host plugin runtime is installed`);
}
function definePluginApp(setup) {
  return { __zccPluginApp: true, setup };
}
function useRpc() {
  return pluginRuntime().useRpc?.() ?? missing("useRpc");
}
function useRealtime(channel, handler) {
  pluginRuntime().useRealtime?.(channel, handler);
}
function useZccContext() {
  return pluginRuntime().useZccContext?.() ?? { projectId: null, threadId: null };
}
function useZccNavigate() {
  return pluginRuntime().useZccNavigate?.() ?? missing("useZccNavigate");
}

// src/app/styles.ts
var GIT_GRAPH_STYLES = `
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

.gg-table-header-scroll {
  width: 100%;
  overflow: hidden;
  flex-shrink: 0;
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
  min-width: 100%;
  width: max-content;
}

.gg-col-resizer {
  position: relative;
  width: 0px;
  flex: 0 0 0px;
  height: 100%;
  cursor: col-resize;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  user-select: none;
}

.gg-col-resizer::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: -4px;
  width: 9px;
  cursor: col-resize;
}

.gg-col-resizer::after {
  content: '';
  position: absolute;
  top: 4px;
  bottom: 4px;
  left: -1px;
  width: 1px;
  background: var(--gg-border-subtle, rgba(255, 255, 255, 0.12));
  transition: background 120ms ease;
}

.gg-col-resizer:hover::after,
.gg-col-resizer.active::after {
  background: var(--gg-accent, #3b82f6);
  box-shadow: 0 0 4px var(--gg-accent, #3b82f6);
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
  display: flex;
  align-items: center;
  gap: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  box-sizing: border-box;
}

.gg-commit-subject {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #e1e1e1;
  font-size: 12.5px;
  min-width: 0;
  flex: 1 1 auto;
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
  position: relative;
}

.gg-details-pane:not(.inline),
.git-graph-details-pane:not(.inline) {
  width: 48%;
  min-width: 300px;
  max-width: 75%;
  border-left: 1px solid var(--gg-border-subtle);
  background: var(--gg-bg-card);
  display: flex;
  flex-direction: column;
  min-height: 0;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  position: relative;
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
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  position: relative;
}

/* Resizers for Commit Details Pane */
.gg-details-top-resizer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 6px;
  cursor: row-resize;
  z-index: 20;
  user-select: none;
}

.gg-details-top-resizer::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: transparent;
  transition: background-color 0.15s ease;
}

.gg-details-top-resizer:hover::after,
.gg-details-top-resizer:active::after {
  background: var(--accent-color, #4da3ff);
}

.gg-details-bottom-resizer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 6px;
  cursor: row-resize;
  z-index: 20;
  user-select: none;
}

.gg-details-bottom-resizer::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: transparent;
  transition: background-color 0.15s ease;
}

.gg-details-bottom-resizer:hover::after,
.gg-details-bottom-resizer:active::after {
  background: var(--accent-color, #4da3ff);
}

.gg-details-left-resizer {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 6px;
  cursor: col-resize;
  z-index: 20;
  user-select: none;
}

.gg-details-left-resizer::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 2px;
  background: transparent;
  transition: background-color 0.15s ease;
}

.gg-details-left-resizer:hover::after,
.gg-details-left-resizer:active::after {
  background: var(--accent-color, #4da3ff);
}

.gg-details-col-resizer {
  width: 8px;
  cursor: col-resize;
  position: relative;
  flex-shrink: 0;
  z-index: 5;
  user-select: none;
}

.gg-details-col-resizer::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 3px;
  width: 1px;
  background: var(--gg-border-subtle);
  transition: background-color 0.15s ease, width 0.15s ease, left 0.15s ease;
}

.gg-details-col-resizer:hover::after,
.gg-details-col-resizer:active::after {
  background: var(--accent-color, #4da3ff);
  width: 2px;
  left: 3px;
}

.gg-details-row-resizer {
  height: 8px;
  cursor: row-resize;
  position: relative;
  flex-shrink: 0;
  z-index: 5;
  user-select: none;
}

.gg-details-row-resizer::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  top: 3px;
  height: 1px;
  background: var(--gg-border-subtle);
  transition: background-color 0.15s ease, height 0.15s ease, top 0.15s ease;
}

.gg-details-row-resizer:hover::after,
.gg-details-row-resizer:active::after {
  background: var(--accent-color, #4da3ff);
  height: 2px;
  top: 3px;
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
  overflow: hidden;
  box-sizing: border-box;
}

.gg-details-col-files {
  min-width: 180px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 0;
  box-sizing: border-box;
  padding-right: 6px;
  overflow: hidden;
}

.gg-details-col-diff {
  flex: 1 1 0;
  min-width: 0;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
  box-sizing: border-box;
  padding-left: 6px;
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
.gg-details-columns.stacked {
  flex-direction: column !important;
  overflow: hidden !important;
}

.gg-details-columns.stacked .gg-details-col-resizer {
  display: none !important;
}

.gg-details-columns.stacked .gg-details-col-files {
  width: 100% !important;
  max-width: 100% !important;
  border-right: none !important;
  padding-right: 0 !important;
  padding-bottom: 4px;
  min-height: 80px;
  overflow: hidden !important;
}

.gg-details-columns.stacked .gg-details-col-diff {
  width: 100% !important;
  min-width: 0 !important;
  padding-left: 0 !important;
  padding-top: 4px;
  flex: 1 1 0 !important;
  min-height: 100px !important;
  overflow: hidden !important;
}

.gg-details-columns:not(.stacked) .gg-details-row-resizer {
  display: none !important;
}

@container (max-width: 640px) {
  .gg-details-columns {
    flex-direction: column !important;
    overflow: hidden !important;
  }
  .gg-details-col-resizer {
    display: none !important;
  }
  .gg-details-col-files {
    width: 100% !important;
    max-width: 100% !important;
    border-right: none !important;
    padding-right: 0 !important;
    padding-bottom: 4px;
    min-height: 80px;
    overflow: hidden !important;
  }
  .gg-details-col-diff {
    width: 100% !important;
    min-width: 0 !important;
    padding-left: 0 !important;
    padding-top: 4px;
    flex: 1 1 0 !important;
    min-height: 100px !important;
    overflow: hidden !important;
  }
}

@media (max-width: 640px) {
  .gg-details-columns {
    flex-direction: column !important;
    overflow: hidden !important;
  }
  .gg-details-col-resizer {
    display: none !important;
  }
  .gg-details-col-files {
    width: 100% !important;
    max-width: 100% !important;
    border-right: none !important;
    padding-right: 0 !important;
    padding-bottom: 4px;
    min-height: 80px;
    overflow: hidden !important;
  }
  .gg-details-col-diff {
    width: 100% !important;
    min-width: 0 !important;
    padding-left: 0 !important;
    padding-top: 4px;
    flex: 1 1 0 !important;
    min-height: 100px !important;
    overflow: hidden !important;
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

.gg-context-menu-item:disabled,
.git-graph-context-item:disabled {
  opacity: 0.45;
  cursor: not-allowed;
  pointer-events: auto;
}

.gg-context-menu-item:disabled:hover,
.git-graph-context-item:disabled:hover {
  background: transparent;
  color: var(--gg-text-normal);
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
/* Utility & component layout classes (avoids inline styles) */
.gg-flex-row {
  display: flex;
  align-items: center;
}
.gg-flex-col {
  display: flex;
  flex-direction: column;
}
.gg-gap-4 { gap: 4px; }
.gg-gap-6 { gap: 6px; }
.gg-gap-8 { gap: 8px; }
.gg-gap-16 { gap: 16px; }
.gg-margin-0 { margin: 0; }
.gg-margin-top-6 { margin-top: 6px; }
.gg-font-10 { font-size: 10px; }
.gg-font-11 { font-size: 11px; }
.gg-font-12 { font-size: 12px; }
.gg-font-13 { font-size: 13px; }
.gg-text-muted { color: var(--gg-text-muted); }
.gg-text-secondary { color: var(--text-secondary, var(--gg-text-muted)); }
.gg-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.gg-overflow-hidden { overflow: hidden; }
.gg-flex-shrink-0 { flex-shrink: 0; }
.gg-flex-1 { flex: 1; }
.gg-pad-12 { padding: 12px; }
.gg-pad-16 { padding: 16px; }
.gg-diff-half-width { width: 50%; }
.gg-find-input-width { width: 230px; }
.gg-find-count-badge {
  font-size: 11px;
  color: var(--gg-text-muted);
  min-width: 52px;
  text-align: center;
}
.gg-modal-width-settings { width: 560px; }
.gg-remote-name-width { width: 110px; }
.gg-issue-prefix-width { width: 150px; }
.gg-remote-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 6px 8px;
  background: var(--bg-secondary, #0f1318);
  border-radius: 4px;
  border: 1px solid var(--border-color, #252b35);
}
.gg-issue-rule-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 11px;
}
.gg-file-badge {
  opacity: 0.6;
  margin-left: 6px;
  font-size: 10px;
}
.gg-file-row-content {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
}
.gg-btn-compact-10 {
  padding: 1px 4px;
  font-size: 10px;
}
.gg-btn-compact-11 {
  padding: 2px 6px;
  font-size: 11px;
}
.gg-btn-pad-8 {
  padding: 2px 8px;
  font-size: 11px;
}
.gg-branch-scroll-list {
  max-height: 160px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.gg-branch-filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.gg-control-project-label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.gg-control-muted-label {
  color: var(--text-muted, var(--gg-text-muted));
  font-size: 11px;
}
.gg-commit-hash-auto { width: auto; }
.gg-context-overlay-fixed {
  position: fixed;
  inset: 0;
  z-index: 99;
}
`;

// zcc-host-react:react
var React = globalThis.__ZCC_HOST_REACT__;
var react_default = React;
var Children = React.Children;
var Component = React.Component;
var Fragment = React.Fragment;
var StrictMode = React.StrictMode;
var Suspense = React.Suspense;
var cloneElement = React.cloneElement;
var createContext = React.createContext;
var createElement = React.createElement;
var createRef = React.createRef;
var forwardRef = React.forwardRef;
var isValidElement = React.isValidElement;
var lazy = React.lazy;
var memo = React.memo;
var startTransition = React.startTransition;
var useCallback = React.useCallback;
var useContext = React.useContext;
var useDebugValue = React.useDebugValue;
var useDeferredValue = React.useDeferredValue;
var useEffect = React.useEffect;
var useId = React.useId;
var useImperativeHandle = React.useImperativeHandle;
var useInsertionEffect = React.useInsertionEffect;
var useLayoutEffect = React.useLayoutEffect;
var useMemo = React.useMemo;
var useReducer = React.useReducer;
var useRef = React.useRef;
var useState = React.useState;
var useSyncExternalStore = React.useSyncExternalStore;
var useTransition = React.useTransition;
var version = React.version;

// src/app/graph-layout.ts
var DEFAULT_PALETTE = [
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
function computeGraphLayout(commits, headHash, colors = DEFAULT_PALETTE) {
  const palette = colors.length > 0 ? colors : DEFAULT_PALETTE;
  const rowByHash = /* @__PURE__ */ new Map();
  commits.forEach((c, idx) => rowByHash.set(c.hash, idx));
  const headAncestors = /* @__PURE__ */ new Set();
  if (headHash && rowByHash.has(headHash)) {
    const queue = [headHash];
    headAncestors.add(headHash);
    while (queue.length > 0) {
      const current = queue.shift();
      const idx = rowByHash.get(current);
      if (idx === void 0) continue;
      for (const parent of commits[idx].parents) {
        if (!headAncestors.has(parent)) {
          headAncestors.add(parent);
          if (rowByHash.has(parent)) queue.push(parent);
        }
      }
    }
  }
  const activeSlots = [];
  const nodes = [];
  const segments = [];
  let colorCursor = 0;
  let maxLane = 0;
  const nextColor = () => {
    const c = palette[colorCursor % palette.length];
    colorCursor += 1;
    return c;
  };
  const allocateEmptyLane = (slot) => {
    const emptyIdx = activeSlots.findIndex((s) => s === null);
    if (emptyIdx >= 0) {
      activeSlots[emptyIdx] = slot;
      if (emptyIdx > maxLane) maxLane = emptyIdx;
      return emptyIdx;
    }
    const newLane = activeSlots.length;
    activeSlots.push(slot);
    if (newLane > maxLane) maxLane = newLane;
    return newLane;
  };
  for (let row = 0; row < commits.length; row++) {
    const commit = commits[row];
    const matchingLanes = [];
    for (let l = 0; l < activeSlots.length; l++) {
      if (activeSlots[l]?.targetHash === commit.hash) {
        matchingLanes.push(l);
      }
    }
    let commitLane;
    let commitColor;
    if (matchingLanes.length > 0) {
      commitLane = matchingLanes[0];
      commitColor = commit.isUncommitted ? "#8a94a6" : activeSlots[commitLane].color;
      for (const l of matchingLanes) {
        const incoming = activeSlots[l];
        segments.push({
          fromRow: incoming.fromRow,
          fromLane: incoming.fromLane,
          toRow: row,
          toLane: commitLane,
          color: incoming.color,
          isUncommitted: incoming.isUncommitted
        });
        activeSlots[l] = null;
      }
    } else {
      commitColor = commit.isUncommitted ? "#8a94a6" : nextColor();
      commitLane = allocateEmptyLane({
        targetHash: commit.hash,
        color: commitColor,
        fromRow: row,
        fromLane: 0,
        isUncommitted: commit.isUncommitted
      });
      activeSlots[commitLane] = null;
    }
    nodes.push({
      commit,
      row,
      lane: commitLane,
      color: commitColor,
      isAncestorOfHead: commit.isUncommitted || (headHash ? headAncestors.has(commit.hash) : true),
      isMerge: commit.parents.length > 1
    });
    const visibleParents = commit.parents.filter((p) => rowByHash.has(p));
    visibleParents.forEach((parentHash, pIdx) => {
      if (pIdx === 0) {
        activeSlots[commitLane] = {
          targetHash: parentHash,
          color: commit.isUncommitted ? nextColor() : commitColor,
          fromRow: row,
          fromLane: commitLane,
          isUncommitted: commit.isUncommitted
        };
      } else {
        const existingLane = activeSlots.findIndex((s) => s?.targetHash === parentHash);
        const branchColor = existingLane >= 0 ? activeSlots[existingLane].color : nextColor();
        allocateEmptyLane({
          targetHash: parentHash,
          color: branchColor,
          fromRow: row,
          fromLane: commitLane
        });
      }
    });
  }
  return {
    nodes,
    segments,
    maxLane
  };
}
function buildSegmentSvgPath(args) {
  const { segment, rowHeight, laneWidth, padX, style, expandedRow = -1, detailsHeight = 0 } = args;
  const getY = (row) => {
    if (expandedRow >= 0 && detailsHeight > 0 && row > expandedRow) {
      return row * rowHeight + detailsHeight + rowHeight / 2;
    }
    return row * rowHeight + rowHeight / 2;
  };
  const x1 = padX + segment.fromLane * laneWidth;
  const y1 = getY(segment.fromRow);
  const x2 = padX + segment.toLane * laneWidth;
  const y2 = getY(segment.toRow);
  if (x1 === x2) {
    return `M ${x1} ${y1} L ${x2} ${y2}`;
  }
  if (style === "angular") {
    const midY = y1 + rowHeight * 0.5;
    if (midY >= y2) {
      return `M ${x1} ${y1} L ${x2} ${y2}`;
    }
    return `M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${y2}`;
  }
  const deltaRows = segment.toRow - segment.fromRow;
  if (deltaRows <= 1) {
    if (expandedRow >= 0 && detailsHeight > 0 && segment.fromRow <= expandedRow && segment.toRow > expandedRow) {
      const turnY = y1 + rowHeight;
      const cy12 = y1 + rowHeight * 0.45;
      const cy22 = turnY - rowHeight * 0.45;
      return `M ${x1} ${y1} C ${x1} ${cy12}, ${x2} ${cy22}, ${x2} ${turnY} L ${x2} ${y2}`;
    }
    const cy1 = y1 + rowHeight * 0.5;
    const cy2 = y2 - rowHeight * 0.5;
    return `M ${x1} ${y1} C ${x1} ${cy1}, ${x2} ${cy2}, ${x2} ${y2}`;
  }
  if (segment.toLane > segment.fromLane) {
    const turnY = y1 + rowHeight;
    const cy1 = y1 + rowHeight * 0.45;
    const cy2 = turnY - rowHeight * 0.45;
    return `M ${x1} ${y1} C ${x1} ${cy1}, ${x2} ${cy2}, ${x2} ${turnY} L ${x2} ${y2}`;
  } else {
    const turnY = y2 - rowHeight;
    const cy1 = turnY + rowHeight * 0.45;
    const cy2 = y2 - rowHeight * 0.45;
    return `M ${x1} ${y1} L ${x1} ${turnY} C ${x1} ${cy1}, ${x2} ${cy2}, ${x2} ${y2}`;
  }
}
var GITMOJI_MAP = {
  ":art:": "\u{1F3A8}",
  ":zap:": "\u26A1",
  ":fire:": "\u{1F525}",
  ":bug:": "\u{1F41B}",
  ":ambulance:": "\u{1F691}\uFE0F",
  ":sparkles:": "\u2728",
  ":memo:": "\u{1F4DD}",
  ":rocket:": "\u{1F680}",
  ":lipstick:": "\u{1F484}",
  ":tada:": "\u{1F389}",
  ":white_check_mark:": "\u2705",
  ":lock:": "\u{1F512}\uFE0F",
  ":bookmark:": "\u{1F516}",
  ":rotating_light:": "\u{1F6A8}",
  ":construction:": "\u{1F6A7}",
  ":green_heart:": "\u{1F49A}",
  ":arrow_down:": "\u2B07\uFE0F",
  ":arrow_up:": "\u2B06\uFE0F",
  ":pushpin:": "\u{1F4CC}",
  ":construction_worker:": "\u{1F477}",
  ":chart_with_upwards_trend:": "\u{1F4C8}",
  ":recycle:": "\u267B\uFE0F",
  ":heavy_plus_sign:": "\u2795",
  ":heavy_minus_sign:": "\u2796",
  ":wrench:": "\u{1F527}",
  ":hammer:": "\u{1F528}",
  ":globe_with_meridians:": "\u{1F310}",
  ":pencil2:": "\u270F\uFE0F",
  ":rewind:": "\u23EA\uFE0F",
  ":twisted_rightwards_arrows:": "\u{1F500}",
  ":package:": "\u{1F4E6}\uFE0F",
  ":alien:": "\u{1F47D}\uFE0F",
  ":truck:": "\u{1F69A}",
  ":page_facing_up:": "\u{1F4C4}",
  ":boom:": "\u{1F4A5}",
  ":bento:": "\u{1F371}",
  ":wheelchair:": "\u267F\uFE0F",
  ":bulb:": "\u{1F4A1}",
  ":speech_balloon:": "\u{1F4AC}",
  ":card_file_box:": "\u{1F5C3}\uFE0F",
  ":loud_sound:": "\u{1F50A}",
  ":mute:": "\u{1F507}",
  ":Coffin:": "\u26B0\uFE0F",
  ":test_tube:": "\u{1F9EA}",
  ":necktie:": "\u{1F454}",
  ":stethoscope:": "\u{1FA7A}",
  ":bricks:": "\u{1F9F1}"
};
function replaceGitmojiShortcodes(text) {
  return text.replace(/:[a-z0-9_+-]+:/gi, (shortcode) => {
    const lower = shortcode.toLowerCase();
    return GITMOJI_MAP[lower] ?? shortcode;
  });
}
function tokenizeCommitMessage(rawText, issueRules = []) {
  const withEmoji = replaceGitmojiShortcodes(rawText);
  const tokens = [];
  const baseRegex = /(`[^`]+`|https?:\/\/[^\s)]+)/g;
  let lastIdx = 0;
  let match;
  const pushPlainWithIssues = (segment) => {
    if (!segment) return;
    if (issueRules.length === 0) {
      tokens.push({ kind: "text", text: segment });
      return;
    }
    for (const rule of issueRules) {
      try {
        const rx = new RegExp(rule.pattern, "g");
        let subLast = 0;
        let m;
        const subTokens = [];
        while ((m = rx.exec(segment)) !== null) {
          if (m.index > subLast) {
            subTokens.push({ kind: "text", text: segment.slice(subLast, m.index) });
          }
          let url = rule.urlTemplate;
          m.forEach((group, idx) => {
            if (group !== void 0) {
              url = url.replace(new RegExp(`\\$${idx}`, "g"), group);
            }
          });
          subTokens.push({ kind: "link", text: m[0], href: url });
          subLast = m.index + m[0].length;
          if (m[0].length === 0) break;
        }
        if (subTokens.length > 0) {
          if (subLast < segment.length) {
            subTokens.push({ kind: "text", text: segment.slice(subLast) });
          }
          tokens.push(...subTokens);
          return;
        }
      } catch {
      }
    }
    tokens.push({ kind: "text", text: segment });
  };
  while ((match = baseRegex.exec(withEmoji)) !== null) {
    if (match.index > lastIdx) {
      pushPlainWithIssues(withEmoji.slice(lastIdx, match.index));
    }
    const tokenStr = match[0];
    if (tokenStr.startsWith("`") && tokenStr.endsWith("`")) {
      tokens.push({ kind: "code", text: tokenStr.slice(1, -1) });
    } else {
      tokens.push({ kind: "link", text: tokenStr, href: tokenStr });
    }
    lastIdx = match.index + tokenStr.length;
  }
  if (lastIdx < withEmoji.length) {
    pushPlainWithIssues(withEmoji.slice(lastIdx));
  }
  return tokens.length > 0 ? tokens : [{ kind: "text", text: withEmoji }];
}
function buildFileTree(files, compactFolders) {
  const root = { name: "", path: "", kind: "folder", children: [] };
  for (const change of files) {
    const parts = change.newPath.split("/").filter(Boolean);
    let current = root;
    let currentPath = "";
    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      currentPath = currentPath ? `${currentPath}/${part}` : part;
      const isLast = i === parts.length - 1;
      if (isLast) {
        current.children.push({
          name: part,
          path: change.newPath,
          kind: "file",
          children: [],
          fileChange: change
        });
      } else {
        let folder = current.children.find((c) => c.kind === "folder" && c.name === part);
        if (!folder) {
          folder = { name: part, path: currentPath, kind: "folder", children: [] };
          current.children.push(folder);
        }
        current = folder;
      }
    }
  }
  function sortAndCompact(nodes) {
    const processed = nodes.map((node) => {
      if (node.kind === "file") return node;
      let current = { ...node, children: sortAndCompact(node.children) };
      while (compactFolders && current.children.length === 1 && current.children[0].kind === "folder") {
        const onlyChild = current.children[0];
        current = {
          name: `${current.name}/${onlyChild.name}`,
          path: onlyChild.path,
          kind: "folder",
          children: onlyChild.children
        };
      }
      return current;
    });
    return processed.sort((a, b) => {
      if (a.kind !== b.kind) return a.kind === "folder" ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  }
  return sortAndCompact(root.children);
}
function buildSplitDiffRows(hunk) {
  const rows = [];
  let i = 0;
  const lines = hunk.lines;
  while (i < lines.length) {
    const line = lines[i];
    if (line.type === "context") {
      rows.push({
        leftLineNumber: line.oldLineNumber,
        leftContent: line.content,
        leftType: "context",
        rightLineNumber: line.newLineNumber,
        rightContent: line.content,
        rightType: "context"
      });
      i += 1;
      continue;
    }
    if (line.type === "meta") {
      rows.push({
        leftLineNumber: null,
        leftContent: line.content,
        leftType: "meta",
        rightLineNumber: null,
        rightContent: line.content,
        rightType: "meta"
      });
      i += 1;
      continue;
    }
    const dels = [];
    const adds = [];
    while (i < lines.length && lines[i].type === "del") {
      dels.push(lines[i]);
      i += 1;
    }
    while (i < lines.length && lines[i].type === "add") {
      adds.push(lines[i]);
      i += 1;
    }
    const maxLen = Math.max(dels.length, adds.length);
    for (let k = 0; k < maxLen; k++) {
      const d = dels[k];
      const a = adds[k];
      rows.push({
        leftLineNumber: d ? d.oldLineNumber : null,
        leftContent: d ? d.content : "",
        leftType: d ? "del" : "empty",
        rightLineNumber: a ? a.newLineNumber : null,
        rightContent: a ? a.content : "",
        rightType: a ? "add" : "empty"
      });
    }
  }
  return rows;
}
function formatCommitTimestamp(unixSeconds, format, nowMs = Date.now()) {
  if (!unixSeconds) return "";
  const date = new Date(unixSeconds * 1e3);
  if (format === "iso") {
    return date.toISOString().slice(0, 16).replace("T", " ");
  }
  if (format === "datetime") {
    return date.toLocaleString();
  }
  const diffSec = Math.max(0, Math.floor((nowMs - unixSeconds * 1e3) / 1e3));
  if (diffSec < 60) return "just now";
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.floor(diffHr / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  return `${Math.floor(diffDays / 365)}y ago`;
}

// zcc-host-react:react/jsx-runtime
var React2 = globalThis.__ZCC_HOST_REACT__;
var Fragment2 = React2.Fragment;
function jsx(type, props, key) {
  return React2.createElement(type, key === void 0 ? props : { ...props, key });
}
var jsxs = jsx;

// src/app/components/ControlBar.tsx
function ControlBar(props) {
  const [branchMenuOpen, setBranchMenuOpen] = useState(false);
  const [branchFilterQuery, setBranchFilterQuery] = useState("");
  const {
    repos,
    selectedRepoRelPath,
    onSelectRepo,
    branches,
    remoteBranches,
    repoSettings,
    globalSettings,
    onUpdateRepoSettings,
    onUpdateGlobalSettings,
    onFetch,
    onPush,
    canPush,
    onScrollToHead,
    onToggleFind,
    findOpen,
    onOpenRepoSettings,
    onRefresh,
    projects,
    selectedProjectId,
    onSelectProject,
    loading,
    headerActions
  } = props;
  const selectedBranches = repoSettings.selectedBranches;
  const allBranchesOption = selectedBranches.length === 0;
  const combinedBranches = [
    ...branches,
    ...repoSettings.showRemoteBranches ? remoteBranches.map((r) => `remotes/${r}`) : []
  ].filter((b) => !branchFilterQuery.trim() || b.toLowerCase().includes(branchFilterQuery.trim().toLowerCase()));
  const toggleBranch = (branchName) => {
    const set = new Set(selectedBranches);
    if (set.has(branchName)) {
      set.delete(branchName);
    } else {
      set.add(branchName);
    }
    onUpdateRepoSettings({ selectedBranches: [...set] });
  };
  return /* @__PURE__ */ jsxs("header", { className: "gg-control-bar git-graph-toolbar", role: "toolbar", "aria-label": "Git Tree controls", children: [
    /* @__PURE__ */ jsxs("div", { className: "git-graph-toolbar-left", children: [
      /* @__PURE__ */ jsx("span", { className: "git-graph-title", children: "\u2442 Git Tree" }),
      projects && projects.length > 1 && /* @__PURE__ */ jsxs("label", { className: "gg-control-project-label", children: [
        /* @__PURE__ */ jsx("span", { className: "gg-control-muted-label", children: "Project:" }),
        /* @__PURE__ */ jsx(
          "select",
          {
            "aria-label": "Select project",
            className: "gg-select git-graph-select",
            value: selectedProjectId,
            onChange: (e) => onSelectProject?.(e.target.value),
            children: projects.map((p) => /* @__PURE__ */ jsx("option", { value: p.id, children: p.name }, p.id))
          }
        )
      ] }),
      repos.length > 1 && /* @__PURE__ */ jsxs("label", { className: "gg-control-project-label", children: [
        /* @__PURE__ */ jsx("span", { className: "gg-control-muted-label", children: "Repo:" }),
        /* @__PURE__ */ jsx(
          "select",
          {
            "aria-label": "Select repository",
            className: "gg-select git-graph-select",
            value: selectedRepoRelPath,
            onChange: (e) => onSelectRepo(e.target.value),
            children: repos.map((r) => /* @__PURE__ */ jsxs("option", { value: r.relPath, children: [
              r.label,
              " ",
              r.currentBranch ? `(${r.currentBranch})` : ""
            ] }, r.relPath || "root"))
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { style: { position: "relative", zIndex: branchMenuOpen ? 100 : 1 }, children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            className: `gg-btn git-graph-btn ${!allBranchesOption ? "git-graph-btn--active" : ""}`,
            "aria-label": "Filter branches",
            "aria-expanded": branchMenuOpen,
            onClick: () => setBranchMenuOpen((v) => !v),
            "data-testid": "gg-branches-filter-btn",
            children: /* @__PURE__ */ jsxs("span", { children: [
              "\u2442 Branches:",
              " ",
              allBranchesOption ? "Show All" : selectedBranches.length === 1 ? selectedBranches[0] : `${selectedBranches.length} selected`,
              " \u25BE"
            ] })
          }
        ),
        branchMenuOpen && /* @__PURE__ */ jsxs(Fragment2, { children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              className: "gg-context-overlay-fixed",
              onClick: () => setBranchMenuOpen(false)
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "gg-popover git-graph-popover",
              role: "dialog",
              "aria-label": "Branch filter",
              "data-testid": "gg-branches-popover",
              children: [
                /* @__PURE__ */ jsxs("div", { className: "gg-branch-filter-header", children: [
                  /* @__PURE__ */ jsx("strong", { className: "gg-font-12", children: "Filter Branches" }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      className: "gg-btn git-graph-btn",
                      onClick: () => setBranchMenuOpen(false),
                      children: "Close"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "search",
                    className: "git-graph-input",
                    placeholder: "Filter branch list...",
                    value: branchFilterQuery,
                    onChange: (e) => setBranchFilterQuery(e.target.value)
                  }
                ),
                /* @__PURE__ */ jsxs("label", { className: "git-graph-checkbox-row", children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "checkbox",
                      checked: allBranchesOption,
                      onChange: () => onUpdateRepoSettings({ selectedBranches: [] })
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { children: "Show All Branches" })
                ] }),
                /* @__PURE__ */ jsxs("label", { className: "git-graph-checkbox-row", children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "checkbox",
                      checked: repoSettings.showRemoteBranches,
                      onChange: (e) => onUpdateRepoSettings({ showRemoteBranches: e.target.checked })
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { children: "Show Remote Branches" })
                ] }),
                /* @__PURE__ */ jsxs("label", { className: "git-graph-checkbox-row", children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "checkbox",
                      checked: repoSettings.showTags,
                      onChange: (e) => onUpdateRepoSettings({ showTags: e.target.checked })
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { children: "Show Tags" })
                ] }),
                /* @__PURE__ */ jsxs("label", { className: "git-graph-checkbox-row", children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "checkbox",
                      checked: repoSettings.showStashes,
                      onChange: (e) => onUpdateRepoSettings({ showStashes: e.target.checked })
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { children: "Show Stashes" })
                ] }),
                /* @__PURE__ */ jsxs("label", { className: "git-graph-checkbox-row", children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "checkbox",
                      checked: repoSettings.onlyFollowFirstParent,
                      onChange: (e) => onUpdateRepoSettings({ onlyFollowFirstParent: e.target.checked })
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { children: "Only Follow First Parent" })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "git-graph-context-sep" }),
                /* @__PURE__ */ jsx("div", { className: "gg-branch-scroll-list", children: combinedBranches.map((branchName) => /* @__PURE__ */ jsxs("label", { className: "git-graph-checkbox-row", children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "checkbox",
                      checked: selectedBranches.includes(branchName),
                      onChange: () => toggleBranch(branchName)
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { className: "gg-ellipsis", children: branchName })
                ] }, branchName)) })
              ]
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxs(
        "select",
        {
          "aria-label": "Commit ordering",
          className: "gg-select git-graph-select",
          value: repoSettings.commitOrdering,
          onChange: (e) => onUpdateRepoSettings({ commitOrdering: e.target.value }),
          title: "Commit order",
          children: [
            /* @__PURE__ */ jsx("option", { value: "date", children: "Order: Commit Date" }),
            /* @__PURE__ */ jsx("option", { value: "author-date", children: "Order: Author Date" }),
            /* @__PURE__ */ jsx("option", { value: "topo", children: "Order: Topological" })
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          className: "gg-btn git-graph-btn",
          title: "Toggle rounded or angular graph lines",
          onClick: () => onUpdateGlobalSettings({
            graphStyle: globalSettings.graphStyle === "rounded" ? "angular" : "rounded"
          }),
          children: [
            "Style: ",
            globalSettings.graphStyle === "rounded" ? "Rounded" : "Angular"
          ]
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          className: "gg-btn git-graph-btn",
          title: "Toggle Commit Details location (Docked split vs Inline row)",
          onClick: () => onUpdateGlobalSettings({
            commitDetailsLocation: globalSettings.commitDetailsLocation === "docked" ? "inline" : "docked"
          }),
          children: [
            "Details: ",
            globalSettings.commitDetailsLocation === "docked" ? "Docked" : "Inline"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "git-graph-toolbar-right", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: "gg-btn git-graph-btn",
          onClick: onFetch,
          disabled: loading,
          title: "Fetch from Remote(s)",
          children: "\u2B07 Fetch"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: "gg-btn git-graph-btn",
          onClick: onPush,
          disabled: loading || !canPush,
          title: "Push current branch to remote",
          children: "\u2B06 Push"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: "gg-btn git-graph-btn",
          onClick: onScrollToHead,
          title: "Scroll to HEAD (Ctrl/Cmd+H)",
          children: "\u2316 HEAD"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: `gg-btn git-graph-btn ${findOpen ? "git-graph-btn--active active" : ""}`,
          onClick: onToggleFind,
          title: "Find commits, branches, or tags (Ctrl/Cmd+F)",
          "data-testid": "gg-find-btn",
          children: "\u{1F50D} Find"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: "gg-btn git-graph-btn",
          onClick: onOpenRepoSettings,
          title: "Repository Settings (Remotes, Issue Linking, Pull Requests)",
          "data-testid": "gg-repo-settings-btn",
          children: "\u2699 Settings"
        }
      ),
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          className: "gg-btn git-graph-btn",
          onClick: onRefresh,
          disabled: loading,
          title: "Refresh Git Tree (Ctrl/Cmd+R)",
          children: [
            "\u21BB ",
            loading ? "Loading\u2026" : "Refresh"
          ]
        }
      ),
      headerActions
    ] })
  ] });
}

// src/app/components/FindWidget.tsx
function FindWidget(props) {
  const {
    query,
    onChangeQuery,
    matchCount,
    activeMatchIndex,
    onPrev,
    onNext,
    onClose
  } = props;
  return /* @__PURE__ */ jsxs("div", { className: "git-graph-find-bar", role: "search", "aria-label": "Find in Git Tree", "data-testid": "gg-find-widget", children: [
    /* @__PURE__ */ jsx(
      "input",
      {
        type: "search",
        className: "git-graph-input gg-find-input-width",
        "aria-label": "Find commits",
        placeholder: "Find commit, hash, author, branch, tag...",
        value: query,
        autoFocus: true,
        onChange: (e) => onChangeQuery(e.target.value),
        onKeyDown: (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            if (e.shiftKey) onPrev();
            else onNext();
          } else if (e.key === "Escape") {
            e.preventDefault();
            onClose();
          }
        },
        "data-testid": "gg-find-input"
      }
    ),
    /* @__PURE__ */ jsx("span", { className: "gg-find-count-badge", children: query.trim() ? matchCount > 0 ? `${activeMatchIndex + 1} / ${matchCount}` : "0 / 0" : "" }),
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        className: "git-graph-btn",
        disabled: matchCount === 0,
        onClick: onPrev,
        title: "Previous match (Shift+Enter)",
        "data-testid": "gg-find-prev",
        children: "\u2191"
      }
    ),
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        className: "git-graph-btn",
        disabled: matchCount === 0,
        onClick: onNext,
        title: "Next match (Enter)",
        "data-testid": "gg-find-next",
        children: "\u2193"
      }
    ),
    /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        className: "git-graph-btn",
        onClick: onClose,
        "aria-label": "Close find widget",
        children: "\u2715"
      }
    )
  ] });
}

// src/app/components/CommitDetailsPane.tsx
var STORAGE_FILES_WIDTH_KEY = "zcc.gitTree.commitDetailsFilesWidth";
var STORAGE_FILES_HEIGHT_KEY = "zcc.gitTree.commitDetailsFilesHeight";
var STORAGE_PANE_HEIGHT_KEY = "zcc.gitTree.commitDetailsHeight";
var STORAGE_PANE_WIDTH_KEY = "zcc.gitTree.commitDetailsWidth";
var MIN_FILES_WIDTH = 200;
var MIN_FILES_HEIGHT = 100;
var MIN_PANE_HEIGHT = 260;
var MIN_PANE_WIDTH = 320;
function loadStoredNumber(key) {
  try {
    if (typeof localStorage === "undefined") return null;
    const val = Number(localStorage.getItem(key));
    return Number.isFinite(val) && val > 0 ? val : null;
  } catch {
    return null;
  }
}
function saveStoredNumber(key, val) {
  try {
    if (typeof localStorage === "undefined") return;
    if (val === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, String(val));
    }
  } catch {
  }
}
function computeDefaultFilesWidth(fileChanges, fileViewType) {
  if (!fileChanges.length) return 290;
  let maxLen = 0;
  for (const c of fileChanges) {
    const text = fileViewType === "list" ? c.oldPath !== c.newPath ? `${c.oldPath} \u2192 ${c.newPath}` : c.newPath : c.newPath.split("/").pop() || c.newPath;
    if (text.length > maxLen) maxLen = text.length;
  }
  return Math.max(260, Math.min(650, Math.round(maxLen * 7.8 + 120)));
}
function CommitDetailsPane({
  mode,
  details,
  comparison,
  loading,
  inline,
  fileViewType,
  compactFolders,
  diffViewMode,
  dateFormat,
  issueRules,
  codeReview,
  selectedFilePath,
  fileDiff,
  loadingDiff,
  fileContent,
  loadingContent,
  onSelectFile,
  onLoadFileContent,
  onChangeFileViewType,
  onToggleCompactFolders,
  onChangeDiffViewMode,
  onStartCodeReview,
  onToggleReviewedFile,
  onEndCodeReview,
  onSelectParentHash,
  onAskAgent,
  onCopyText,
  onClose
}) {
  const [collapsedFolders, setCollapsedFolders] = useState({});
  const [viewMode, setViewMode] = useState("diff");
  const diffViewerRef = useRef(null);
  const containerRef = useRef(null);
  const columnsRef = useRef(null);
  const fileListRef = useRef(null);
  const fileChanges = useMemo(() => {
    if (mode === "comparison") return comparison?.fileChanges ?? [];
    return details?.fileChanges ?? [];
  }, [mode, details, comparison]);
  const commitKey = mode === "comparison" ? `${comparison?.fromHash ?? ""}..${comparison?.toHash ?? ""}` : details?.hash ?? "";
  const [paneHeight, setPaneHeight] = useState(() => {
    return loadStoredNumber(STORAGE_PANE_HEIGHT_KEY);
  });
  const [paneWidth, setPaneWidth] = useState(() => {
    return loadStoredNumber(STORAGE_PANE_WIDTH_KEY);
  });
  const [isStacked, setIsStacked] = useState(false);
  const [isManualWidth, setIsManualWidth] = useState(false);
  const [filesWidth, setFilesWidth] = useState(() => {
    return computeDefaultFilesWidth(fileChanges, fileViewType);
  });
  const [isManualHeight, setIsManualHeight] = useState(false);
  const [filesHeight, setFilesHeight] = useState(() => {
    const est = fileChanges.length * 28 + 48;
    return Math.min(260, Math.max(MIN_FILES_HEIGHT, est));
  });
  const prevCommitKeyRef = useRef(commitKey);
  useEffect(() => {
    if (prevCommitKeyRef.current !== commitKey) {
      prevCommitKeyRef.current = commitKey;
      setIsManualWidth(false);
      setIsManualHeight(false);
    }
  }, [commitKey]);
  const colDragCleanupRef = useRef(null);
  const rowDragCleanupRef = useRef(null);
  const heightDragCleanupRef = useRef(null);
  const widthDragCleanupRef = useRef(null);
  useEffect(() => {
    return () => {
      colDragCleanupRef.current?.();
      rowDragCleanupRef.current?.();
      heightDragCleanupRef.current?.();
      widthDragCleanupRef.current?.();
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, []);
  useEffect(() => {
    const colEl = columnsRef.current;
    if (!colEl) return;
    const checkStacked = () => {
      if (colEl && colEl.clientWidth > 0) {
        setIsStacked(colEl.clientWidth <= 640);
      }
    };
    checkStacked();
    window.addEventListener("resize", checkStacked);
    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(checkStacked);
      ro.observe(colEl);
      return () => {
        window.removeEventListener("resize", checkStacked);
        ro.disconnect();
      };
    }
    return () => window.removeEventListener("resize", checkStacked);
  }, []);
  useLayoutEffect(() => {
    if (fileChanges.length === 0) return;
    const measure = () => {
      const listEl = fileListRef.current;
      const colEl = columnsRef.current;
      if (!listEl || !colEl) return;
      if (isStacked) {
        if (isManualHeight) return;
        const totalHeight = colEl.clientHeight > 0 ? colEl.clientHeight : 500;
        const halfHeight = Math.floor(totalHeight * 0.5);
        let actualItemsHeight = 0;
        const items = listEl.querySelectorAll(".gg-file-row, .gg-folder-row");
        if (items.length > 0) {
          items.forEach((it) => {
            actualItemsHeight += (it.offsetHeight || 26) + 2;
          });
          actualItemsHeight += 8;
        } else {
          actualItemsHeight = fileChanges.length * 26 + 8;
        }
        const neededHeight = Math.max(listEl.scrollHeight + 48, actualItemsHeight + 48);
        const targetHeight = neededHeight > halfHeight ? halfHeight : Math.max(MIN_FILES_HEIGHT, neededHeight);
        const clamped = Math.max(
          MIN_FILES_HEIGHT,
          Math.min(Math.floor(totalHeight * 0.8), targetHeight)
        );
        setFilesHeight(clamped);
      } else {
        if (isManualWidth) return;
        let maxRowNeeded = 0;
        const rows = listEl.querySelectorAll(".gg-file-row, .gg-folder-row");
        rows.forEach((row) => {
          const pathEl = row.querySelector(".gg-file-path");
          if (pathEl) {
            const pathDiff = Math.max(0, pathEl.scrollWidth - pathEl.clientWidth);
            const needed = row.offsetWidth + pathDiff;
            if (needed > maxRowNeeded) maxRowNeeded = needed;
          } else {
            if (row.scrollWidth > maxRowNeeded) maxRowNeeded = row.scrollWidth;
          }
        });
        let calculated = maxRowNeeded > 0 ? maxRowNeeded + 24 : 0;
        if (calculated <= 0) {
          calculated = computeDefaultFilesWidth(fileChanges, fileViewType);
        }
        const maxAllowed = colEl.clientWidth > 0 ? Math.floor(colEl.clientWidth * 0.6) : 650;
        const target = Math.max(
          MIN_FILES_WIDTH,
          Math.min(Math.max(MIN_FILES_WIDTH, maxAllowed), calculated)
        );
        setFilesWidth(target);
      }
    };
    measure();
    const rafId = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(rafId);
  }, [fileChanges, fileViewType, compactFolders, isManualWidth, isManualHeight, isStacked]);
  const handleRowResizeMouseDown = (e) => {
    e.preventDefault();
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
    const startY = e.clientY;
    const startHeight = filesHeight;
    let latestHeight = startHeight;
    const onMouseMove = (ev) => {
      const deltaY = ev.clientY - startY;
      const colEl = columnsRef.current;
      const totalH = colEl && colEl.clientHeight > 0 ? colEl.clientHeight : 600;
      const maxAllowed = Math.floor(totalH * 0.8);
      latestHeight = Math.max(MIN_FILES_HEIGHT, Math.min(maxAllowed, Math.round(startHeight + deltaY)));
      setFilesHeight(latestHeight);
      setIsManualHeight(true);
    };
    const cleanup = () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      rowDragCleanupRef.current = null;
    };
    const onMouseUp = () => {
      cleanup();
      saveStoredNumber(STORAGE_FILES_HEIGHT_KEY, latestHeight);
    };
    rowDragCleanupRef.current = cleanup;
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };
  const handleRowResizeDoubleClick = () => {
    setIsManualHeight(false);
    saveStoredNumber(STORAGE_FILES_HEIGHT_KEY, null);
  };
  const handleColResizeMouseDown = (e) => {
    e.preventDefault();
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    const startX = e.clientX;
    const startWidth = filesWidth;
    let latestWidth = startWidth;
    const onMouseMove = (ev) => {
      const deltaX = ev.clientX - startX;
      const colEl = columnsRef.current;
      const maxAllowed = colEl && colEl.clientWidth > 0 ? Math.floor(colEl.clientWidth * 0.75) : 800;
      latestWidth = Math.max(MIN_FILES_WIDTH, Math.min(maxAllowed, Math.round(startWidth + deltaX)));
      setFilesWidth(latestWidth);
      setIsManualWidth(true);
    };
    const cleanup = () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      colDragCleanupRef.current = null;
    };
    const onMouseUp = () => {
      cleanup();
      saveStoredNumber(STORAGE_FILES_WIDTH_KEY, latestWidth);
    };
    colDragCleanupRef.current = cleanup;
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };
  const handleColResizeDoubleClick = () => {
    setIsManualWidth(false);
    saveStoredNumber(STORAGE_FILES_WIDTH_KEY, null);
  };
  const handleTopResizeMouseDown = (e) => {
    e.preventDefault();
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
    const startY = e.clientY;
    const currentHeight = containerRef.current?.offsetHeight ?? (paneHeight || 480);
    let latestHeight = currentHeight;
    const onMouseMove = (ev) => {
      const deltaY = startY - ev.clientY;
      const maxHeight = typeof window !== "undefined" ? Math.round(window.innerHeight * 0.88) : 900;
      latestHeight = Math.max(MIN_PANE_HEIGHT, Math.min(maxHeight, Math.round(currentHeight + deltaY)));
      setPaneHeight(latestHeight);
    };
    const cleanup = () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      heightDragCleanupRef.current = null;
    };
    const onMouseUp = () => {
      cleanup();
      saveStoredNumber(STORAGE_PANE_HEIGHT_KEY, latestHeight);
    };
    heightDragCleanupRef.current = cleanup;
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };
  const handleBottomResizeMouseDown = (e) => {
    e.preventDefault();
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
    const startY = e.clientY;
    const currentHeight = containerRef.current?.offsetHeight ?? (paneHeight || 480);
    let latestHeight = currentHeight;
    const onMouseMove = (ev) => {
      const deltaY = ev.clientY - startY;
      const maxHeight = typeof window !== "undefined" ? Math.round(window.innerHeight * 0.88) : 900;
      latestHeight = Math.max(MIN_PANE_HEIGHT, Math.min(maxHeight, Math.round(currentHeight + deltaY)));
      setPaneHeight(latestHeight);
    };
    const cleanup = () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      heightDragCleanupRef.current = null;
    };
    const onMouseUp = () => {
      cleanup();
      saveStoredNumber(STORAGE_PANE_HEIGHT_KEY, latestHeight);
    };
    heightDragCleanupRef.current = cleanup;
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };
  const handleHeightResizeDoubleClick = () => {
    setPaneHeight(null);
    saveStoredNumber(STORAGE_PANE_HEIGHT_KEY, null);
  };
  const handleLeftResizeMouseDown = (e) => {
    e.preventDefault();
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
    const startX = e.clientX;
    const currentWidth = containerRef.current?.offsetWidth ?? (paneWidth || 500);
    let latestWidth = currentWidth;
    const onMouseMove = (ev) => {
      const deltaX = startX - ev.clientX;
      const maxWidth = typeof window !== "undefined" ? Math.round(window.innerWidth * 0.8) : 1e3;
      latestWidth = Math.max(MIN_PANE_WIDTH, Math.min(maxWidth, Math.round(currentWidth + deltaX)));
      setPaneWidth(latestWidth);
    };
    const cleanup = () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      widthDragCleanupRef.current = null;
    };
    const onMouseUp = () => {
      cleanup();
      saveStoredNumber(STORAGE_PANE_WIDTH_KEY, latestWidth);
    };
    widthDragCleanupRef.current = cleanup;
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };
  const handleLeftResizeDoubleClick = () => {
    setPaneWidth(null);
    saveStoredNumber(STORAGE_PANE_WIDTH_KEY, null);
  };
  const containerStyle = useMemo(() => {
    const style = {};
    if (paneHeight) {
      style.height = `${paneHeight}px`;
      style.maxHeight = "88vh";
    }
    if (!inline && paneWidth) {
      style.width = `${paneWidth}px`;
      style.maxWidth = "80%";
    }
    return Object.keys(style).length > 0 ? style : void 0;
  }, [inline, paneHeight, paneWidth]);
  useEffect(() => {
    if (selectedFilePath && diffViewerRef.current) {
      diffViewerRef.current?.scrollIntoView?.({ behavior: "smooth", block: "nearest" });
    }
  }, [selectedFilePath]);
  const fileTree = useMemo(
    () => buildFileTree(fileChanges, compactFolders),
    [fileChanges, compactFolders]
  );
  const reviewedSet = useMemo(
    () => new Set(codeReview?.reviewedFiles ?? []),
    [codeReview]
  );
  const toggleFolder = (folderPath) => {
    setCollapsedFolders((prev) => ({
      ...prev,
      [folderPath]: !prev[folderPath]
    }));
  };
  const renderTokens = (text) => {
    const tokens = tokenizeCommitMessage(text, issueRules);
    return tokens.map((tok, idx) => {
      if (tok.kind === "code") {
        return /* @__PURE__ */ jsx("code", { children: tok.text }, idx);
      }
      if (tok.kind === "link" && tok.href) {
        return /* @__PURE__ */ jsx("a", { href: tok.href, target: "_blank", rel: "noreferrer", children: tok.text }, idx);
      }
      return /* @__PURE__ */ jsx(react_default.Fragment, { children: tok.text }, idx);
    });
  };
  const renderFileItem = (change, label, depth = 0) => {
    const isSelected = selectedFilePath === change.newPath;
    const isReviewed = reviewedSet.has(change.newPath);
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: `gg-file-row ${isSelected ? "selected" : ""}`,
        style: { paddingLeft: `${12 + depth * 14}px` },
        onClick: () => {
          onSelectFile(change);
          if (viewMode === "source") {
            onLoadFileContent?.(change.newPath);
          }
        },
        "data-testid": `gg-file-row-${change.newPath}`,
        children: [
          codeReview && /* @__PURE__ */ jsx(
            "input",
            {
              type: "checkbox",
              checked: isReviewed,
              onClick: (e) => e.stopPropagation(),
              onChange: (e) => onToggleReviewedFile(change.newPath, e.target.checked),
              title: "Mark file as reviewed"
            }
          ),
          /* @__PURE__ */ jsx("span", { className: `gg-file-status gg-file-status-${change.status}`, children: change.status }),
          /* @__PURE__ */ jsxs(
            "span",
            {
              className: "gg-file-path",
              style: {
                textDecoration: isReviewed ? "line-through" : void 0,
                opacity: isReviewed ? 0.65 : 1
              },
              title: change.oldPath !== change.newPath ? `${change.oldPath} \u2192 ${change.newPath}` : change.newPath,
              children: [
                label,
                change.staged !== void 0 && /* @__PURE__ */ jsxs("span", { className: "gg-file-badge", children: [
                  "(",
                  change.staged ? "staged" : "unstaged",
                  ")"
                ] })
              ]
            }
          ),
          /* @__PURE__ */ jsxs("span", { className: "gg-file-stat", children: [
            change.additions !== null && change.additions > 0 && /* @__PURE__ */ jsxs("span", { className: "gg-stat-add", children: [
              "+",
              change.additions
            ] }),
            change.deletions !== null && change.deletions > 0 && /* @__PURE__ */ jsxs("span", { className: "gg-stat-del", children: [
              "-",
              change.deletions
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              className: "gg-btn gg-btn-icon gg-btn-compact-10",
              title: "Copy File Path",
              onClick: (e) => {
                e.stopPropagation();
                onCopyText(change.newPath, "File path");
              },
              children: "\u{1F4CB}"
            }
          )
        ]
      },
      `${change.newPath}:${change.staged ? "staged" : "work"}`
    );
  };
  const renderTreeNodes = (nodes, depth = 0) => {
    return nodes.map((node) => {
      if (node.kind === "file" && node.fileChange) {
        return renderFileItem(node.fileChange, node.name, depth);
      }
      const isCollapsed = Boolean(collapsedFolders[node.path]);
      return /* @__PURE__ */ jsxs(react_default.Fragment, { children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "gg-folder-row",
            style: { paddingLeft: `${12 + depth * 14}px` },
            onClick: () => toggleFolder(node.path),
            children: [
              /* @__PURE__ */ jsx("span", { children: isCollapsed ? "\u25B8" : "\u25BE" }),
              /* @__PURE__ */ jsxs("span", { children: [
                "\u{1F4C1} ",
                node.name
              ] })
            ]
          }
        ),
        !isCollapsed && renderTreeNodes(node.children, depth + 1)
      ] }, `folder:${node.path}`);
    });
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: containerRef,
      className: `gg-details-pane ${inline ? "gg-details-inline inline" : ""}`,
      style: containerStyle,
      "data-testid": "gg-details-pane",
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "gg-details-top-resizer",
            onMouseDown: handleTopResizeMouseDown,
            onDoubleClick: handleHeightResizeDoubleClick,
            title: "Drag to resize height \xB7 Double-click to reset",
            "data-testid": "gg-details-top-resizer"
          }
        ),
        inline && /* @__PURE__ */ jsx(
          "div",
          {
            className: "gg-details-bottom-resizer",
            onMouseDown: handleBottomResizeMouseDown,
            onDoubleClick: handleHeightResizeDoubleClick,
            title: "Drag to resize height \xB7 Double-click to reset",
            "data-testid": "gg-details-bottom-resizer"
          }
        ),
        !inline && /* @__PURE__ */ jsx(
          "div",
          {
            className: "gg-details-left-resizer",
            onMouseDown: handleLeftResizeMouseDown,
            onDoubleClick: handleLeftResizeDoubleClick,
            title: "Drag to resize pane width \xB7 Double-click to reset",
            "data-testid": "gg-details-left-resizer"
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "gg-details-header", children: [
          /* @__PURE__ */ jsx("div", { className: "gg-details-header-title", children: mode === "comparison" && comparison ? /* @__PURE__ */ jsxs(Fragment2, { children: [
            /* @__PURE__ */ jsx("span", { children: "Comparing" }),
            /* @__PURE__ */ jsx("span", { className: "gg-commit-hash gg-commit-hash-auto", children: comparison.fromHash.slice(0, 7) }),
            /* @__PURE__ */ jsx("span", { children: "\u2194" }),
            /* @__PURE__ */ jsx("span", { className: "gg-commit-hash gg-commit-hash-auto", children: comparison.toHash.slice(0, 7) })
          ] }) : details ? /* @__PURE__ */ jsxs(Fragment2, { children: [
            /* @__PURE__ */ jsx("span", { children: details.hash === "*" ? "Uncommitted Changes" : `Commit ${details.abbreviatedHash}` }),
            details.signature && /* @__PURE__ */ jsxs(
              "span",
              {
                className: "gg-ref-badge gg-ref-tag",
                title: details.signature.signer || details.signature.label,
                children: [
                  "\u{1F512} ",
                  details.signature.label
                ]
              }
            )
          ] }) : /* @__PURE__ */ jsx("span", { children: "Commit Details" }) }),
          /* @__PURE__ */ jsxs("div", { className: "gg-flex-row gg-gap-4 gg-flex-shrink-0", children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "gg-btn gg-btn-primary",
                onClick: () => onAskAgent(selectedFilePath ?? void 0),
                title: "Spawn a Zana Agent thread with this commit and diff context",
                "data-testid": "gg-ask-agent-btn",
                children: "\u2728 Ask Agent"
              }
            ),
            codeReview ? /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                className: "gg-btn",
                onClick: onEndCodeReview,
                title: "End Code Review",
                "data-testid": "gg-end-review-btn",
                children: [
                  "\u2713 End Review (",
                  reviewedSet.size,
                  "/",
                  fileChanges.length,
                  ")"
                ]
              }
            ) : /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "gg-btn",
                onClick: onStartCodeReview,
                title: "Start Persistent Code Review",
                "data-testid": "gg-start-review-btn",
                children: "\u{1F441} Code Review"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "gg-btn gg-btn-icon",
                onClick: onClose,
                title: "Close Details (Esc)",
                "data-testid": "gg-close-details-btn",
                children: "\u2715"
              }
            )
          ] })
        ] }),
        loading ? /* @__PURE__ */ jsx("div", { className: "gg-empty", children: "Loading commit details\u2026" }) : /* @__PURE__ */ jsxs("div", { className: "gg-details-body", children: [
          mode === "single" && details && details.hash !== "*" && /* @__PURE__ */ jsxs("div", { className: "gg-details-meta", children: [
            /* @__PURE__ */ jsxs("div", { className: "gg-details-meta-grid", children: [
              /* @__PURE__ */ jsx("span", { className: "gg-details-meta-label", children: "Commit:" }),
              /* @__PURE__ */ jsxs("span", { children: [
                /* @__PURE__ */ jsx("code", { children: details.hash }),
                " ",
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    className: "gg-btn gg-btn-icon gg-btn-compact-10",
                    onClick: () => onCopyText(details.hash, "Commit hash"),
                    children: "Copy"
                  }
                )
              ] }),
              /* @__PURE__ */ jsx("span", { className: "gg-details-meta-label", children: "Parents:" }),
              /* @__PURE__ */ jsx("span", { children: details.parents.length === 0 ? "None (root commit)" : details.parents.map((p, idx) => /* @__PURE__ */ jsxs(react_default.Fragment, { children: [
                idx > 0 && ", ",
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    className: "gg-parent-link",
                    onClick: () => onSelectParentHash(p),
                    children: p.slice(0, 8)
                  }
                )
              ] }, p)) }),
              /* @__PURE__ */ jsx("span", { className: "gg-details-meta-label", children: "Author:" }),
              /* @__PURE__ */ jsxs("span", { children: [
                details.authorName,
                " <",
                details.authorEmail,
                "> (",
                formatCommitTimestamp(details.authorDate, dateFormat),
                ")"
              ] }),
              /* @__PURE__ */ jsx("span", { className: "gg-details-meta-label", children: "Committer:" }),
              /* @__PURE__ */ jsxs("span", { children: [
                details.committerName,
                " <",
                details.committerEmail,
                "> (",
                formatCommitTimestamp(details.commitDate, dateFormat),
                ")"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "gg-details-message", children: [
              /* @__PURE__ */ jsx("strong", { children: renderTokens(details.subject) }),
              details.body ? `

${details.body}` : ""
            ] })
          ] }),
          /* @__PURE__ */ jsxs(
            "div",
            {
              ref: columnsRef,
              className: `gg-details-columns ${isStacked ? "stacked" : "side-by-side"}`,
              "data-testid": "gg-details-columns",
              children: [
                /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: "gg-details-col-files",
                    style: isStacked ? {
                      height: `${filesHeight}px`,
                      flexBasis: `${filesHeight}px`,
                      width: "100%"
                    } : {
                      width: `${filesWidth}px`,
                      flexBasis: `${filesWidth}px`
                    },
                    children: [
                      /* @__PURE__ */ jsxs("div", { className: "gg-files-toolbar", children: [
                        /* @__PURE__ */ jsxs("span", { children: [
                          "Changed Files (",
                          fileChanges.length,
                          ")",
                          codeReview ? ` \u2022 Reviewed ${reviewedSet.size}/${fileChanges.length}` : ""
                        ] }),
                        /* @__PURE__ */ jsxs("div", { className: "gg-flex-row gg-gap-4", children: [
                          /* @__PURE__ */ jsx(
                            "button",
                            {
                              type: "button",
                              className: `gg-btn gg-btn-compact-11 ${fileViewType === "tree" ? "gg-btn-active" : ""}`,
                              onClick: () => onChangeFileViewType("tree"),
                              "data-testid": "gg-view-tree-btn",
                              children: "Tree"
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            "button",
                            {
                              type: "button",
                              className: `gg-btn gg-btn-compact-11 ${fileViewType === "list" ? "gg-btn-active" : ""}`,
                              onClick: () => onChangeFileViewType("list"),
                              "data-testid": "gg-view-list-btn",
                              children: "List"
                            }
                          ),
                          fileViewType === "tree" && /* @__PURE__ */ jsx(
                            "button",
                            {
                              type: "button",
                              className: `gg-btn gg-btn-compact-11 ${compactFolders ? "gg-btn-active" : ""}`,
                              onClick: onToggleCompactFolders,
                              title: "Compact single-child folders",
                              children: "Compact"
                            }
                          )
                        ] })
                      ] }),
                      /* @__PURE__ */ jsx(
                        "div",
                        {
                          ref: fileListRef,
                          className: "gg-file-list",
                          "data-testid": "gg-file-list",
                          children: fileChanges.length === 0 ? /* @__PURE__ */ jsx("div", { className: "gg-empty gg-pad-12", children: "No file changes in this commit." }) : fileViewType === "tree" ? renderTreeNodes(fileTree) : fileChanges.map(
                            (change) => renderFileItem(
                              change,
                              change.oldPath !== change.newPath ? `${change.oldPath} \u2192 ${change.newPath}` : change.newPath,
                              0
                            )
                          )
                        }
                      )
                    ]
                  }
                ),
                isStacked ? /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "gg-details-row-resizer",
                    onMouseDown: handleRowResizeMouseDown,
                    onDoubleClick: handleRowResizeDoubleClick,
                    title: "Drag to resize \xB7 Double-click to auto-split",
                    "data-testid": "gg-details-row-resizer"
                  }
                ) : /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "gg-details-col-resizer",
                    onMouseDown: handleColResizeMouseDown,
                    onDoubleClick: handleColResizeDoubleClick,
                    title: "Drag to resize column \xB7 Double-click to auto-fit",
                    "data-testid": "gg-details-col-resizer"
                  }
                ),
                /* @__PURE__ */ jsx("div", { className: "gg-details-col-diff", children: selectedFilePath ? /* @__PURE__ */ jsxs("div", { className: "gg-diff-viewer", "data-testid": "gg-diff-viewer", ref: diffViewerRef, children: [
                  /* @__PURE__ */ jsxs("div", { className: "gg-diff-toolbar", children: [
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        style: {
                          fontFamily: "var(--font-mono, monospace)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          fontWeight: 600
                        },
                        title: selectedFilePath,
                        children: selectedFilePath
                      }
                    ),
                    /* @__PURE__ */ jsxs("div", { className: "gg-flex-row gg-gap-4", children: [
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          className: `gg-btn gg-btn-pad-8 ${viewMode === "diff" ? "gg-btn-active" : ""}`,
                          onClick: () => setViewMode("diff"),
                          "data-testid": "gg-view-diff-btn",
                          title: "View diff changes",
                          children: "Diff"
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          className: `gg-btn gg-btn-pad-8 ${viewMode === "source" ? "gg-btn-active" : ""}`,
                          onClick: () => {
                            setViewMode("source");
                            if (selectedFilePath && !fileContent) {
                              onLoadFileContent?.(selectedFilePath);
                            }
                          },
                          "data-testid": "gg-view-source-btn",
                          title: "View full source code",
                          children: "Source Code"
                        }
                      ),
                      viewMode === "diff" && /* @__PURE__ */ jsxs(Fragment2, { children: [
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            type: "button",
                            className: `gg-btn gg-btn-compact-11 ${diffViewMode === "unified" ? "gg-btn-active" : ""}`,
                            onClick: () => onChangeDiffViewMode("unified"),
                            "data-testid": "gg-diff-unified-btn",
                            children: "Unified"
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "button",
                          {
                            type: "button",
                            className: `gg-btn gg-btn-compact-11 ${diffViewMode === "split" ? "gg-btn-active" : ""}`,
                            onClick: () => onChangeDiffViewMode("split"),
                            "data-testid": "gg-diff-split-btn",
                            children: "Split"
                          }
                        )
                      ] }),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          className: "gg-btn gg-btn-icon gg-btn-compact-11",
                          title: viewMode === "source" ? "Copy file content" : "Copy diff",
                          onClick: () => onCopyText(
                            viewMode === "source" ? fileContent?.content ?? "" : fileDiff?.rawDiff ?? "",
                            viewMode === "source" ? "Source code" : "Diff"
                          ),
                          children: "\u{1F4CB}"
                        }
                      )
                    ] })
                  ] }),
                  /* @__PURE__ */ jsx("div", { className: "gg-diff-content-scroll", children: viewMode === "source" ? loadingContent ? /* @__PURE__ */ jsx("div", { className: "gg-empty gg-pad-16", children: "Loading source code\u2026" }) : !fileContent ? /* @__PURE__ */ jsx("div", { className: "gg-empty gg-pad-16", children: "No source code available for this file." }) : fileContent.isBinary ? /* @__PURE__ */ jsx("div", { className: "gg-empty gg-pad-16", children: "Binary file \u2014 cannot display text content." }) : /* @__PURE__ */ jsx("table", { className: "gg-source-table", "data-testid": "gg-source-code-table", children: /* @__PURE__ */ jsx("tbody", { children: fileContent.content.split(/\r?\n/).map((line, idx) => /* @__PURE__ */ jsxs("tr", { className: "gg-source-line", children: [
                    /* @__PURE__ */ jsx("td", { className: "gg-diff-gutter", children: idx + 1 }),
                    /* @__PURE__ */ jsx("td", { className: "gg-diff-code", children: line || " " })
                  ] }, idx)) }) }) : loadingDiff ? /* @__PURE__ */ jsx("div", { className: "gg-empty gg-pad-16", children: "Loading diff\u2026" }) : !fileDiff ? /* @__PURE__ */ jsx("div", { className: "gg-empty gg-pad-16", children: "Select a file to inspect its diff." }) : fileDiff.isBinary ? /* @__PURE__ */ jsx("div", { className: "gg-empty gg-pad-16", children: "Binary file changed \u2014 inline text diff not available." }) : fileDiff.hunks.length === 0 ? /* @__PURE__ */ jsx("div", { className: "gg-empty gg-pad-16", children: "No textual diff hunks (empty file or mode-only change)." }) : diffViewMode === "unified" ? /* @__PURE__ */ jsx("table", { className: "gg-diff-table", "data-testid": "gg-diff-unified-table", children: /* @__PURE__ */ jsx("tbody", { children: fileDiff.hunks.map((hunk, hIdx) => /* @__PURE__ */ jsxs(react_default.Fragment, { children: [
                    /* @__PURE__ */ jsx("tr", { className: "gg-diff-hunk-header", children: /* @__PURE__ */ jsx("td", { colSpan: 3, className: "gg-diff-code", children: hunk.header }) }),
                    hunk.lines.map((line, lIdx) => /* @__PURE__ */ jsxs(
                      "tr",
                      {
                        className: line.type === "add" ? "gg-diff-line-add" : line.type === "del" ? "gg-diff-line-del" : "",
                        children: [
                          /* @__PURE__ */ jsx("td", { className: "gg-diff-gutter", children: line.oldLineNumber ?? "" }),
                          /* @__PURE__ */ jsx("td", { className: "gg-diff-gutter", children: line.newLineNumber ?? "" }),
                          /* @__PURE__ */ jsx("td", { className: "gg-diff-code", children: line.type === "add" ? `+${line.content}` : line.type === "del" ? `-${line.content}` : ` ${line.content}` })
                        ]
                      },
                      `${hIdx}-${lIdx}`
                    ))
                  ] }, hIdx)) }) }) : /* @__PURE__ */ jsx("table", { className: "gg-diff-table", "data-testid": "gg-diff-split-table", children: /* @__PURE__ */ jsx("tbody", { children: fileDiff.hunks.map((hunk, hIdx) => {
                    const splitRows = buildSplitDiffRows(hunk);
                    return /* @__PURE__ */ jsxs(react_default.Fragment, { children: [
                      /* @__PURE__ */ jsx("tr", { className: "gg-diff-hunk-header", children: /* @__PURE__ */ jsx("td", { colSpan: 4, className: "gg-diff-code", children: hunk.header }) }),
                      splitRows.map((row, rIdx) => /* @__PURE__ */ jsxs("tr", { children: [
                        /* @__PURE__ */ jsx(
                          "td",
                          {
                            className: `gg-diff-gutter ${row.leftType === "del" ? "gg-diff-line-del" : ""}`,
                            children: row.leftLineNumber ?? ""
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "td",
                          {
                            className: `gg-diff-code gg-diff-half-width ${row.leftType === "del" ? "gg-diff-line-del" : ""}`,
                            children: row.leftContent
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "td",
                          {
                            className: `gg-diff-gutter ${row.rightType === "add" ? "gg-diff-line-add" : ""}`,
                            children: row.rightLineNumber ?? ""
                          }
                        ),
                        /* @__PURE__ */ jsx(
                          "td",
                          {
                            className: `gg-diff-code gg-diff-half-width ${row.rightType === "add" ? "gg-diff-line-add" : ""}`,
                            children: row.rightContent
                          }
                        )
                      ] }, `${hIdx}-${rIdx}`))
                    ] }, hIdx);
                  }) }) }) })
                ] }) : /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "gg-empty",
                    style: {
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "24px"
                    },
                    children: "Select a file from the list to inspect changes."
                  }
                ) })
              ]
            }
          )
        ] })
      ]
    }
  );
}

// src/app/clipboard.ts
function copyViaTextarea(text) {
  if (typeof document === "undefined") return false;
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.top = "-9999px";
  ta.setAttribute("readonly", "");
  document.body.appendChild(ta);
  try {
    ta.select();
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    document.body.removeChild(ta);
  }
}
async function copyText(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
  }
  return copyViaTextarea(text);
}

// src/app/components/ContextMenuAndDialogs.tsx
function ContextMenuOverlay({
  target,
  currentBranch,
  hasCommits = true,
  onClose,
  onRunAction,
  onOpenDialog,
  onOpenPullRequest,
  onViewTagDetails,
  onCopyText,
  onAskAgent
}) {
  if (!target) return null;
  const style = {
    left: `${Math.min(target.x, window.innerWidth - 220)}px`,
    top: `${Math.min(target.y, window.innerHeight - 320)}px`
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: "gg-context-overlay-fixed",
      onClick: onClose,
      onContextMenu: (e) => {
        e.preventDefault();
        onClose();
      },
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          className: "gg-context-menu",
          style,
          onClick: (e) => e.stopPropagation(),
          "data-testid": "gg-context-menu",
          children: [
            target.kind === "branch" && /* @__PURE__ */ jsxs(Fragment2, { children: [
              /* @__PURE__ */ jsxs("div", { className: "gg-context-menu-header", children: [
                "Branch: ",
                target.ref.name
              ] }),
              target.ref.name !== currentBranch && /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "gg-context-menu-item",
                  onClick: () => {
                    onClose();
                    onRunAction({
                      kind: "checkout-branch",
                      branchName: target.ref.name
                    });
                  },
                  children: "Checkout Branch"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "gg-context-menu-item",
                  onClick: () => {
                    onClose();
                    onOpenDialog({ kind: "rename-branch", branchName: target.ref.name });
                  },
                  children: "Rename Branch\u2026"
                }
              ),
              target.ref.name !== currentBranch && /* @__PURE__ */ jsxs(Fragment2, { children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    className: "gg-context-menu-item",
                    onClick: () => {
                      onClose();
                      onOpenDialog({ kind: "merge-branch", branchName: target.ref.name });
                    },
                    children: "Merge into Current Branch\u2026"
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    className: "gg-context-menu-item",
                    onClick: () => {
                      onClose();
                      onOpenDialog({ kind: "rebase-branch", ontoBranch: target.ref.name });
                    },
                    children: [
                      "Rebase Current Branch onto ",
                      target.ref.name,
                      "\u2026"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "gg-context-menu-item",
                  onClick: () => {
                    onClose();
                    onOpenDialog({ kind: "push-branch", branchName: target.ref.name });
                  },
                  children: "Push Branch\u2026"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "gg-context-menu-item",
                  onClick: () => {
                    onClose();
                    onOpenDialog({ kind: "pull-branch", branchName: target.ref.name });
                  },
                  children: "Pull into Branch\u2026"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "gg-context-menu-item",
                  onClick: () => {
                    onClose();
                    onOpenPullRequest(target.ref.name);
                  },
                  children: "Create Pull Request\u2026"
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "gg-context-menu-sep" }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "gg-context-menu-item",
                  onClick: () => {
                    onClose();
                    onCopyText(target.ref.name, "Branch name");
                  },
                  children: "Copy Branch Name"
                }
              ),
              target.ref.name !== currentBranch && /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "gg-context-menu-item danger",
                  onClick: () => {
                    onClose();
                    onOpenDialog({ kind: "delete-branch", branchName: target.ref.name });
                  },
                  children: "Delete Branch\u2026"
                }
              )
            ] }),
            target.kind === "remote-branch" && /* @__PURE__ */ jsxs(Fragment2, { children: [
              /* @__PURE__ */ jsxs("div", { className: "gg-context-menu-header", children: [
                "Remote Branch: ",
                target.ref.remote,
                "/",
                target.ref.name
              ] }),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  className: "gg-context-menu-item",
                  onClick: () => {
                    onClose();
                    onRunAction({
                      kind: "checkout-branch",
                      branchName: target.ref.name,
                      createAndTrackFrom: `${target.ref.remote}/${target.ref.name}`
                    });
                  },
                  children: [
                    "Checkout Branch (Track ",
                    target.ref.remote,
                    "/",
                    target.ref.name,
                    ")"
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  className: "gg-context-menu-item",
                  onClick: () => {
                    onClose();
                    onRunAction({
                      kind: "fetch-into-local-branch",
                      remote: target.ref.remote || "origin",
                      remoteBranch: target.ref.name,
                      localBranch: target.ref.name,
                      force: false
                    });
                  },
                  children: [
                    "Fetch into Local Branch (",
                    target.ref.name,
                    ")"
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "gg-context-menu-item",
                  onClick: () => {
                    onClose();
                    onOpenDialog({
                      kind: "merge-branch",
                      branchName: `${target.ref.remote}/${target.ref.name}`
                    });
                  },
                  children: "Merge into Current Branch\u2026"
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "gg-context-menu-sep" }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "gg-context-menu-item",
                  onClick: () => {
                    onClose();
                    onCopyText(`${target.ref.remote}/${target.ref.name}`, "Remote branch name");
                  },
                  children: "Copy Remote Branch Name"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "gg-context-menu-item danger",
                  onClick: () => {
                    onClose();
                    onRunAction({
                      kind: "delete-remote-branch",
                      remote: target.ref.remote || "origin",
                      branchName: target.ref.name
                    });
                  },
                  children: "Delete Remote Branch"
                }
              )
            ] }),
            target.kind === "tag" && /* @__PURE__ */ jsxs(Fragment2, { children: [
              /* @__PURE__ */ jsxs("div", { className: "gg-context-menu-header", children: [
                "Tag: ",
                target.ref.name
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "gg-context-menu-item",
                  onClick: () => {
                    onClose();
                    onViewTagDetails(target.ref.name);
                  },
                  children: "View Tag Details"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "gg-context-menu-item",
                  onClick: () => {
                    onClose();
                    onRunAction({
                      kind: "push-tag",
                      tagName: target.ref.name,
                      remote: "origin"
                    });
                  },
                  children: "Push Tag to origin"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "gg-context-menu-item",
                  onClick: () => {
                    onClose();
                    onCopyText(target.ref.name, "Tag name");
                  },
                  children: "Copy Tag Name"
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "gg-context-menu-sep" }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "gg-context-menu-item danger",
                  onClick: () => {
                    onClose();
                    onRunAction({
                      kind: "delete-tag",
                      tagName: target.ref.name,
                      deleteFromRemote: null
                    });
                  },
                  children: "Delete Tag"
                }
              )
            ] }),
            target.kind === "stash" && /* @__PURE__ */ jsxs(Fragment2, { children: [
              /* @__PURE__ */ jsxs("div", { className: "gg-context-menu-header", children: [
                "Stash: ",
                target.selector
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "gg-context-menu-item",
                  onClick: () => {
                    onClose();
                    onRunAction({
                      kind: "stash-apply",
                      selector: target.selector,
                      reinstateIndex: false
                    });
                  },
                  children: "Apply Stash"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "gg-context-menu-item",
                  onClick: () => {
                    onClose();
                    onRunAction({
                      kind: "stash-pop",
                      selector: target.selector,
                      reinstateIndex: false
                    });
                  },
                  children: "Pop Stash"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "gg-context-menu-item",
                  onClick: () => {
                    onClose();
                    onOpenDialog({ kind: "stash-branch", selector: target.selector });
                  },
                  children: "Create Branch from Stash\u2026"
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "gg-context-menu-sep" }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "gg-context-menu-item danger",
                  onClick: () => {
                    onClose();
                    onRunAction({
                      kind: "stash-drop",
                      selector: target.selector
                    });
                  },
                  children: "Drop Stash"
                }
              )
            ] }),
            target.kind === "uncommitted" && /* @__PURE__ */ jsxs(Fragment2, { children: [
              /* @__PURE__ */ jsx("div", { className: "gg-context-menu-header", children: "Uncommitted Changes" }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "gg-context-menu-item",
                  onClick: () => {
                    onClose();
                    onOpenDialog({ kind: "commit-uncommitted" });
                  },
                  children: "Commit\u2026"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "gg-context-menu-item",
                  disabled: !hasCommits,
                  title: !hasCommits ? "Cannot stash: Git requires an initial commit before stashing" : void 0,
                  onClick: () => {
                    if (!hasCommits) return;
                    onClose();
                    onOpenDialog({ kind: "stash-push" });
                  },
                  children: "Stash Uncommitted Changes\u2026"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "gg-context-menu-item danger",
                  onClick: () => {
                    onClose();
                    onOpenDialog({ kind: "discard-all" });
                  },
                  children: "Discard All Changes\u2026"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "gg-context-menu-item",
                  onClick: () => {
                    onClose();
                    onAskAgent?.("*");
                  },
                  children: "\u2728 Ask Agent to Review Working Tree\u2026"
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "gg-context-menu-sep" }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "gg-context-menu-item danger",
                  onClick: () => {
                    onClose();
                    onRunAction({ kind: "reset-uncommitted", mode: "hard" });
                  },
                  children: "Reset Working Tree (Hard)"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "gg-context-menu-item danger",
                  onClick: () => {
                    onClose();
                    onOpenDialog({ kind: "clean-untracked" });
                  },
                  children: "Clean Untracked Files\u2026"
                }
              )
            ] }),
            target.kind === "commit" && /* @__PURE__ */ jsxs(Fragment2, { children: [
              /* @__PURE__ */ jsxs("div", { className: "gg-context-menu-header", children: [
                "Commit: ",
                target.commit.abbreviatedHash
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "gg-context-menu-item",
                  onClick: () => {
                    onClose();
                    onOpenDialog({ kind: "create-branch", commit: target.commit });
                  },
                  children: "Create Branch\u2026"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "gg-context-menu-item",
                  onClick: () => {
                    onClose();
                    onOpenDialog({ kind: "add-tag", commit: target.commit });
                  },
                  children: "Add Tag\u2026"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "gg-context-menu-item",
                  onClick: () => {
                    onClose();
                    onRunAction({
                      kind: "checkout-commit",
                      commitHash: target.commit.hash
                    });
                  },
                  children: "Checkout Commit (Detached HEAD)"
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "gg-context-menu-sep" }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "gg-context-menu-item",
                  onClick: () => {
                    onClose();
                    onOpenDialog({ kind: "cherry-pick", commit: target.commit });
                  },
                  children: "Cherry-Pick Commit\u2026"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "gg-context-menu-item",
                  onClick: () => {
                    onClose();
                    onOpenDialog({ kind: "revert-commit", commit: target.commit });
                  },
                  children: "Revert Commit\u2026"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "gg-context-menu-item",
                  onClick: () => {
                    onClose();
                    onOpenDialog({
                      kind: "reset-commit",
                      commit: target.commit,
                      defaultMode: "mixed"
                    });
                  },
                  children: "Reset Current Branch to Here\u2026"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "gg-context-menu-item danger",
                  disabled: target.commit.parents.length === 0,
                  title: target.commit.parents.length === 0 ? "Cannot drop the initial (root) commit" : void 0,
                  onClick: () => {
                    if (target.commit.parents.length === 0) return;
                    onClose();
                    onOpenDialog({ kind: "drop-commit", commit: target.commit });
                  },
                  children: "Drop Commit\u2026"
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "gg-context-menu-sep" }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "gg-context-menu-item",
                  onClick: () => {
                    onClose();
                    onAskAgent?.(target.commit.hash);
                  },
                  children: "\u2728 Ask Agent about Commit\u2026"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "gg-context-menu-item",
                  onClick: () => {
                    onClose();
                    onCopyText(target.commit.hash, "Commit hash");
                  },
                  children: "Copy Commit Hash"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "gg-context-menu-item",
                  onClick: () => {
                    onClose();
                    onCopyText(target.commit.subject, "Commit subject");
                  },
                  children: "Copy Commit Subject"
                }
              )
            ] })
          ]
        }
      )
    }
  );
}
function GitActionDialogModal({
  dialog,
  remotes,
  currentBranch,
  onClose,
  onRunAction
}) {
  const defaultRemote = remotes[0]?.name ?? "origin";
  const [textA, setTextA] = useState("");
  const [textB, setTextB] = useState("");
  const [flagA, setFlagA] = useState(true);
  const [flagB, setFlagB] = useState(false);
  const [flagC, setFlagC] = useState(false);
  const [resetMode, setResetMode] = useState("mixed");
  if (!dialog) return null;
  return /* @__PURE__ */ jsx("div", { className: "gg-modal-backdrop", onClick: onClose, children: /* @__PURE__ */ jsxs(
    "div",
    {
      className: "gg-modal",
      onClick: (e) => e.stopPropagation(),
      "data-testid": `gg-dialog-${dialog.kind}`,
      children: [
        dialog.kind === "create-branch" && /* @__PURE__ */ jsxs(Fragment2, { children: [
          /* @__PURE__ */ jsxs("div", { className: "gg-modal-header", children: [
            /* @__PURE__ */ jsxs("span", { children: [
              "Create Branch at ",
              dialog.commit.abbreviatedHash
            ] }),
            /* @__PURE__ */ jsx("button", { type: "button", className: "gg-btn gg-btn-icon", onClick: onClose, children: "\u2715" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "gg-modal-body", children: [
            /* @__PURE__ */ jsxs("div", { className: "gg-field", children: [
              /* @__PURE__ */ jsx("label", { className: "gg-field-label", children: "Branch Name" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  className: "gg-input",
                  placeholder: "feature/my-branch",
                  value: textA,
                  onChange: (e) => setTextA(e.target.value),
                  autoFocus: true
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "gg-checkbox-row", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  checked: flagA,
                  onChange: (e) => setFlagA(e.target.checked)
                }
              ),
              /* @__PURE__ */ jsx("span", { children: "Check out branch after creation" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "gg-modal-footer", children: [
            /* @__PURE__ */ jsx("button", { type: "button", className: "gg-btn", onClick: onClose, children: "Cancel" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "gg-btn gg-btn-primary",
                disabled: !textA.trim(),
                onClick: () => {
                  onRunAction({
                    kind: "create-branch",
                    branchName: textA.trim(),
                    startPoint: dialog.commit.hash,
                    checkout: flagA
                  });
                  onClose();
                },
                children: "Create Branch"
              }
            )
          ] })
        ] }),
        dialog.kind === "rename-branch" && /* @__PURE__ */ jsxs(Fragment2, { children: [
          /* @__PURE__ */ jsxs("div", { className: "gg-modal-header", children: [
            /* @__PURE__ */ jsxs("span", { children: [
              "Rename Branch ",
              dialog.branchName
            ] }),
            /* @__PURE__ */ jsx("button", { type: "button", className: "gg-btn gg-btn-icon", onClick: onClose, children: "\u2715" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "gg-modal-body", children: /* @__PURE__ */ jsxs("div", { className: "gg-field", children: [
            /* @__PURE__ */ jsx("label", { className: "gg-field-label", children: "New Branch Name" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                className: "gg-input",
                value: textA,
                placeholder: dialog.branchName,
                onChange: (e) => setTextA(e.target.value),
                autoFocus: true
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "gg-modal-footer", children: [
            /* @__PURE__ */ jsx("button", { type: "button", className: "gg-btn", onClick: onClose, children: "Cancel" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "gg-btn gg-btn-primary",
                disabled: !textA.trim(),
                onClick: () => {
                  onRunAction({
                    kind: "rename-branch",
                    oldName: dialog.branchName,
                    newName: textA.trim()
                  });
                  onClose();
                },
                children: "Rename"
              }
            )
          ] })
        ] }),
        dialog.kind === "delete-branch" && /* @__PURE__ */ jsxs(Fragment2, { children: [
          /* @__PURE__ */ jsxs("div", { className: "gg-modal-header", children: [
            /* @__PURE__ */ jsxs("span", { children: [
              "Delete Branch ",
              dialog.branchName
            ] }),
            /* @__PURE__ */ jsx("button", { type: "button", className: "gg-btn gg-btn-icon", onClick: onClose, children: "\u2715" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "gg-modal-body", children: /* @__PURE__ */ jsxs("label", { className: "gg-checkbox-row", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                checked: flagB,
                onChange: (e) => setFlagB(e.target.checked)
              }
            ),
            /* @__PURE__ */ jsx("span", { children: "Force delete (-D) even if unmerged" })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "gg-modal-footer", children: [
            /* @__PURE__ */ jsx("button", { type: "button", className: "gg-btn", onClick: onClose, children: "Cancel" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "gg-btn gg-btn-primary",
                onClick: () => {
                  onRunAction({
                    kind: "delete-branch",
                    branchName: dialog.branchName,
                    force: flagB
                  });
                  onClose();
                },
                children: "Delete Branch"
              }
            )
          ] })
        ] }),
        dialog.kind === "merge-branch" && /* @__PURE__ */ jsxs(Fragment2, { children: [
          /* @__PURE__ */ jsxs("div", { className: "gg-modal-header", children: [
            /* @__PURE__ */ jsxs("span", { children: [
              "Merge ",
              dialog.branchName,
              " into Current Branch"
            ] }),
            /* @__PURE__ */ jsx("button", { type: "button", className: "gg-btn gg-btn-icon", onClick: onClose, children: "\u2715" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "gg-modal-body", children: [
            /* @__PURE__ */ jsxs("label", { className: "gg-checkbox-row", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  checked: flagB,
                  onChange: (e) => setFlagB(e.target.checked)
                }
              ),
              /* @__PURE__ */ jsx("span", { children: "Create a new commit even if fast-forward is possible (--no-ff)" })
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "gg-checkbox-row", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  checked: flagC,
                  onChange: (e) => setFlagC(e.target.checked)
                }
              ),
              /* @__PURE__ */ jsx("span", { children: "Squash commits (--squash)" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "gg-modal-footer", children: [
            /* @__PURE__ */ jsx("button", { type: "button", className: "gg-btn", onClick: onClose, children: "Cancel" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "gg-btn gg-btn-primary",
                onClick: () => {
                  onRunAction({
                    kind: "merge",
                    target: dialog.branchName,
                    noFastForward: flagB,
                    squash: flagC,
                    noCommit: false
                  });
                  onClose();
                },
                children: "Merge"
              }
            )
          ] })
        ] }),
        dialog.kind === "rebase-branch" && /* @__PURE__ */ jsxs(Fragment2, { children: [
          /* @__PURE__ */ jsxs("div", { className: "gg-modal-header", children: [
            /* @__PURE__ */ jsxs("span", { children: [
              "Rebase Current Branch onto ",
              dialog.ontoBranch
            ] }),
            /* @__PURE__ */ jsx("button", { type: "button", className: "gg-btn gg-btn-icon", onClick: onClose, children: "\u2715" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "gg-modal-body", children: /* @__PURE__ */ jsxs("label", { className: "gg-checkbox-row", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                checked: flagA,
                onChange: (e) => setFlagA(e.target.checked)
              }
            ),
            /* @__PURE__ */ jsx("span", { children: "Auto-stash uncommitted changes before rebase (--autostash)" })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "gg-modal-footer", children: [
            /* @__PURE__ */ jsx("button", { type: "button", className: "gg-btn", onClick: onClose, children: "Cancel" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "gg-btn gg-btn-primary",
                onClick: () => {
                  onRunAction({
                    kind: "rebase",
                    onto: dialog.ontoBranch,
                    autostash: flagA
                  });
                  onClose();
                },
                children: "Rebase"
              }
            )
          ] })
        ] }),
        dialog.kind === "push-branch" && /* @__PURE__ */ jsxs(Fragment2, { children: [
          /* @__PURE__ */ jsxs("div", { className: "gg-modal-header", children: [
            /* @__PURE__ */ jsxs("span", { children: [
              "Push Branch ",
              dialog.branchName
            ] }),
            /* @__PURE__ */ jsx("button", { type: "button", className: "gg-btn gg-btn-icon", onClick: onClose, children: "\u2715" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "gg-modal-body", children: [
            /* @__PURE__ */ jsxs("div", { className: "gg-field", children: [
              /* @__PURE__ */ jsx("label", { className: "gg-field-label", children: "Remote" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  className: "gg-input",
                  value: textA || defaultRemote,
                  onChange: (e) => setTextA(e.target.value)
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "gg-checkbox-row", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  checked: flagA,
                  onChange: (e) => setFlagA(e.target.checked)
                }
              ),
              /* @__PURE__ */ jsx("span", { children: "Set upstream (-u)" })
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "gg-checkbox-row", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  checked: flagB,
                  onChange: (e) => setFlagB(e.target.checked)
                }
              ),
              /* @__PURE__ */ jsx("span", { children: "Force with lease (--force-with-lease)" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "gg-modal-footer", children: [
            /* @__PURE__ */ jsx("button", { type: "button", className: "gg-btn", onClick: onClose, children: "Cancel" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "gg-btn gg-btn-primary",
                onClick: () => {
                  onRunAction({
                    kind: "push-branch",
                    branchName: dialog.branchName,
                    remote: (textA || defaultRemote).trim(),
                    setUpstream: flagA,
                    forceMode: flagB ? "force-with-lease" : "none"
                  });
                  onClose();
                },
                children: "Push"
              }
            )
          ] })
        ] }),
        dialog.kind === "pull-branch" && /* @__PURE__ */ jsxs(Fragment2, { children: [
          /* @__PURE__ */ jsxs("div", { className: "gg-modal-header", children: [
            /* @__PURE__ */ jsxs("span", { children: [
              "Pull Branch ",
              dialog.branchName
            ] }),
            /* @__PURE__ */ jsx("button", { type: "button", className: "gg-btn gg-btn-icon", onClick: onClose, children: "\u2715" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "gg-modal-body", children: [
            /* @__PURE__ */ jsxs("div", { className: "gg-field", children: [
              /* @__PURE__ */ jsx("label", { className: "gg-field-label", children: "Remote" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  className: "gg-input",
                  value: textA || defaultRemote,
                  onChange: (e) => setTextA(e.target.value)
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "gg-checkbox-row", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  checked: flagB,
                  onChange: (e) => setFlagB(e.target.checked)
                }
              ),
              /* @__PURE__ */ jsx("span", { children: "Rebase instead of merge (--rebase)" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "gg-modal-footer", children: [
            /* @__PURE__ */ jsx("button", { type: "button", className: "gg-btn", onClick: onClose, children: "Cancel" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "gg-btn gg-btn-primary",
                onClick: () => {
                  onRunAction({
                    kind: "pull-branch",
                    remote: (textA || defaultRemote).trim(),
                    branchName: dialog.branchName,
                    noFastForward: false,
                    squash: false,
                    rebase: flagB
                  });
                  onClose();
                },
                children: "Pull"
              }
            )
          ] })
        ] }),
        dialog.kind === "cherry-pick" && /* @__PURE__ */ jsxs(Fragment2, { children: [
          /* @__PURE__ */ jsxs("div", { className: "gg-modal-header", children: [
            /* @__PURE__ */ jsxs("span", { children: [
              "Cherry-Pick Commit ",
              dialog.commit.abbreviatedHash
            ] }),
            /* @__PURE__ */ jsx("button", { type: "button", className: "gg-btn gg-btn-icon", onClick: onClose, children: "\u2715" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "gg-modal-body", children: [
            /* @__PURE__ */ jsxs("label", { className: "gg-checkbox-row", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  checked: flagA,
                  onChange: (e) => setFlagA(e.target.checked)
                }
              ),
              /* @__PURE__ */ jsx("span", { children: "Record origin commit hash in message (-x)" })
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "gg-checkbox-row", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  checked: flagB,
                  onChange: (e) => setFlagB(e.target.checked)
                }
              ),
              /* @__PURE__ */ jsx("span", { children: "Stage changes without committing (--no-commit)" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "gg-modal-footer", children: [
            /* @__PURE__ */ jsx("button", { type: "button", className: "gg-btn", onClick: onClose, children: "Cancel" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "gg-btn gg-btn-primary",
                onClick: () => {
                  onRunAction({
                    kind: "cherry-pick",
                    commitHash: dialog.commit.hash,
                    parentIndex: dialog.commit.parents.length > 1 ? 1 : void 0,
                    recordOrigin: flagA,
                    noCommit: flagB
                  });
                  onClose();
                },
                children: "Cherry-Pick"
              }
            )
          ] })
        ] }),
        dialog.kind === "revert-commit" && /* @__PURE__ */ jsxs(Fragment2, { children: [
          /* @__PURE__ */ jsxs("div", { className: "gg-modal-header", children: [
            /* @__PURE__ */ jsxs("span", { children: [
              "Revert Commit ",
              dialog.commit.abbreviatedHash
            ] }),
            /* @__PURE__ */ jsx("button", { type: "button", className: "gg-btn gg-btn-icon", onClick: onClose, children: "\u2715" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "gg-modal-body", children: /* @__PURE__ */ jsxs("label", { className: "gg-checkbox-row", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                checked: flagB,
                onChange: (e) => setFlagB(e.target.checked)
              }
            ),
            /* @__PURE__ */ jsx("span", { children: "Stage revert changes without committing (--no-commit)" })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "gg-modal-footer", children: [
            /* @__PURE__ */ jsx("button", { type: "button", className: "gg-btn", onClick: onClose, children: "Cancel" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "gg-btn gg-btn-primary",
                onClick: () => {
                  onRunAction({
                    kind: "revert-commit",
                    commitHash: dialog.commit.hash,
                    parentIndex: dialog.commit.parents.length > 1 ? 1 : void 0,
                    noCommit: flagB
                  });
                  onClose();
                },
                children: "Revert"
              }
            )
          ] })
        ] }),
        dialog.kind === "reset-commit" && /* @__PURE__ */ jsxs(Fragment2, { children: [
          /* @__PURE__ */ jsxs("div", { className: "gg-modal-header", children: [
            /* @__PURE__ */ jsxs("span", { children: [
              "Reset Current Branch to ",
              dialog.commit.abbreviatedHash
            ] }),
            /* @__PURE__ */ jsx("button", { type: "button", className: "gg-btn gg-btn-icon", onClick: onClose, children: "\u2715" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "gg-modal-body", children: /* @__PURE__ */ jsxs("div", { className: "gg-field", children: [
            /* @__PURE__ */ jsx("label", { className: "gg-field-label", children: "Reset Mode" }),
            /* @__PURE__ */ jsxs(
              "select",
              {
                className: "gg-select",
                value: resetMode,
                onChange: (e) => setResetMode(e.target.value),
                children: [
                  /* @__PURE__ */ jsx("option", { value: "soft", children: "Soft \u2014 Keep all changes staged" }),
                  /* @__PURE__ */ jsx("option", { value: "mixed", children: "Mixed \u2014 Keep working tree, unstage index" }),
                  /* @__PURE__ */ jsx("option", { value: "hard", children: "Hard \u2014 Discard all uncommitted changes" })
                ]
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "gg-modal-footer", children: [
            /* @__PURE__ */ jsx("button", { type: "button", className: "gg-btn", onClick: onClose, children: "Cancel" }),
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                className: "gg-btn gg-btn-primary",
                onClick: () => {
                  onRunAction({
                    kind: "reset-to-commit",
                    commitHash: dialog.commit.hash,
                    mode: resetMode
                  });
                  onClose();
                },
                children: [
                  "Reset (",
                  resetMode,
                  ")"
                ]
              }
            )
          ] })
        ] }),
        dialog.kind === "drop-commit" && /* @__PURE__ */ jsxs(Fragment2, { children: [
          /* @__PURE__ */ jsxs("div", { className: "gg-modal-header", children: [
            /* @__PURE__ */ jsxs("span", { children: [
              "Drop Commit ",
              dialog.commit.abbreviatedHash,
              "?"
            ] }),
            /* @__PURE__ */ jsx("button", { type: "button", className: "gg-btn gg-btn-icon", onClick: onClose, children: "\u2715" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "gg-modal-body", children: /* @__PURE__ */ jsxs("p", { className: "gg-margin-0 gg-font-12", children: [
            "This will rebase ",
            /* @__PURE__ */ jsx("code", { children: "HEAD" }),
            " onto the parent of",
            " ",
            /* @__PURE__ */ jsx("code", { children: dialog.commit.abbreviatedHash }),
            ", removing this commit from the current branch history."
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "gg-modal-footer", children: [
            /* @__PURE__ */ jsx("button", { type: "button", className: "gg-btn", onClick: onClose, children: "Cancel" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "gg-btn gg-btn-primary",
                onClick: () => {
                  onRunAction({
                    kind: "drop-commit",
                    commitHash: dialog.commit.hash,
                    branch: currentBranch ?? void 0
                  });
                  onClose();
                },
                children: "Drop Commit"
              }
            )
          ] })
        ] }),
        dialog.kind === "add-tag" && /* @__PURE__ */ jsxs(Fragment2, { children: [
          /* @__PURE__ */ jsxs("div", { className: "gg-modal-header", children: [
            /* @__PURE__ */ jsxs("span", { children: [
              "Add Tag at ",
              dialog.commit.abbreviatedHash
            ] }),
            /* @__PURE__ */ jsx("button", { type: "button", className: "gg-btn gg-btn-icon", onClick: onClose, children: "\u2715" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "gg-modal-body", children: [
            /* @__PURE__ */ jsxs("div", { className: "gg-field", children: [
              /* @__PURE__ */ jsx("label", { className: "gg-field-label", children: "Tag Name" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  className: "gg-input",
                  placeholder: "v1.0.0",
                  value: textA,
                  onChange: (e) => setTextA(e.target.value),
                  autoFocus: true
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "gg-checkbox-row", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  checked: flagA,
                  onChange: (e) => setFlagA(e.target.checked)
                }
              ),
              /* @__PURE__ */ jsx("span", { children: "Annotated Tag (-a)" })
            ] }),
            flagA && /* @__PURE__ */ jsxs("div", { className: "gg-field", children: [
              /* @__PURE__ */ jsx("label", { className: "gg-field-label", children: "Tag Message" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  className: "gg-input",
                  placeholder: "Release v1.0.0",
                  value: textB,
                  onChange: (e) => setTextB(e.target.value)
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "gg-checkbox-row", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  checked: flagB,
                  onChange: (e) => setFlagB(e.target.checked)
                }
              ),
              /* @__PURE__ */ jsxs("span", { children: [
                "Push tag to ",
                defaultRemote,
                " immediately"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "gg-modal-footer", children: [
            /* @__PURE__ */ jsx("button", { type: "button", className: "gg-btn", onClick: onClose, children: "Cancel" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "gg-btn gg-btn-primary",
                disabled: !textA.trim(),
                onClick: () => {
                  onRunAction({
                    kind: "create-tag",
                    tagName: textA.trim(),
                    commitHash: dialog.commit.hash,
                    annotated: flagA,
                    message: textB.trim() || textA.trim(),
                    pushToRemote: flagB ? defaultRemote : null
                  });
                  onClose();
                },
                children: "Create Tag"
              }
            )
          ] })
        ] }),
        dialog.kind === "tag-details" && /* @__PURE__ */ jsxs(Fragment2, { children: [
          /* @__PURE__ */ jsxs("div", { className: "gg-modal-header", children: [
            /* @__PURE__ */ jsxs("span", { children: [
              "Tag Details: ",
              dialog.tagName
            ] }),
            /* @__PURE__ */ jsx("button", { type: "button", className: "gg-btn gg-btn-icon", onClick: onClose, children: "\u2715" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "gg-modal-body", children: !dialog.details ? /* @__PURE__ */ jsx("div", { children: "Loading tag details\u2026" }) : /* @__PURE__ */ jsxs("div", { className: "gg-details-meta-grid", children: [
            /* @__PURE__ */ jsx("span", { className: "gg-details-meta-label", children: "Name:" }),
            /* @__PURE__ */ jsx("span", { children: dialog.details.name }),
            /* @__PURE__ */ jsx("span", { className: "gg-details-meta-label", children: "Type:" }),
            /* @__PURE__ */ jsx("span", { children: dialog.details.isAnnotated ? "Annotated" : "Lightweight" }),
            /* @__PURE__ */ jsx("span", { className: "gg-details-meta-label", children: "Target:" }),
            /* @__PURE__ */ jsx("code", { children: dialog.details.hash }),
            dialog.details.taggerName && /* @__PURE__ */ jsxs(Fragment2, { children: [
              /* @__PURE__ */ jsx("span", { className: "gg-details-meta-label", children: "Tagger:" }),
              /* @__PURE__ */ jsxs("span", { children: [
                dialog.details.taggerName,
                " <",
                dialog.details.taggerEmail,
                ">"
              ] })
            ] }),
            dialog.details.message && /* @__PURE__ */ jsxs(Fragment2, { children: [
              /* @__PURE__ */ jsx("span", { className: "gg-details-meta-label", children: "Message:" }),
              /* @__PURE__ */ jsx("span", { children: dialog.details.message })
            ] })
          ] }) }),
          /* @__PURE__ */ jsx("div", { className: "gg-modal-footer", children: /* @__PURE__ */ jsx("button", { type: "button", className: "gg-btn", onClick: onClose, children: "Close" }) })
        ] }),
        dialog.kind === "commit-uncommitted" && /* @__PURE__ */ jsxs(Fragment2, { children: [
          /* @__PURE__ */ jsxs("div", { className: "gg-modal-header", children: [
            /* @__PURE__ */ jsx("span", { children: "Commit Uncommitted Changes" }),
            /* @__PURE__ */ jsx("button", { type: "button", className: "gg-btn gg-btn-icon", onClick: onClose, children: "\u2715" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "gg-modal-body", children: /* @__PURE__ */ jsxs("div", { className: "gg-field", children: [
            /* @__PURE__ */ jsx("label", { className: "gg-field-label", children: "Commit Message" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                className: "gg-input",
                placeholder: "Describe your changes",
                value: textA,
                onChange: (e) => setTextA(e.target.value),
                autoFocus: true
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "gg-modal-footer", children: [
            /* @__PURE__ */ jsx("button", { type: "button", className: "gg-btn", onClick: onClose, children: "Cancel" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "gg-btn gg-btn-primary",
                disabled: !textA.trim(),
                onClick: () => {
                  onRunAction({ kind: "commit-uncommitted", message: textA.trim() });
                  onClose();
                },
                children: "Commit"
              }
            )
          ] })
        ] }),
        dialog.kind === "stash-push" && /* @__PURE__ */ jsxs(Fragment2, { children: [
          /* @__PURE__ */ jsxs("div", { className: "gg-modal-header", children: [
            /* @__PURE__ */ jsx("span", { children: "Stash Uncommitted Changes" }),
            /* @__PURE__ */ jsx("button", { type: "button", className: "gg-btn gg-btn-icon", onClick: onClose, children: "\u2715" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "gg-modal-body", children: [
            /* @__PURE__ */ jsxs("div", { className: "gg-field", children: [
              /* @__PURE__ */ jsx("label", { className: "gg-field-label", children: "Stash Message (optional)" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  className: "gg-input",
                  placeholder: "WIP: feature changes",
                  value: textA,
                  onChange: (e) => setTextA(e.target.value),
                  autoFocus: true
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "gg-checkbox-row", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  checked: flagA,
                  onChange: (e) => setFlagA(e.target.checked)
                }
              ),
              /* @__PURE__ */ jsx("span", { children: "Include untracked files (-u)" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "gg-modal-footer", children: [
            /* @__PURE__ */ jsx("button", { type: "button", className: "gg-btn", onClick: onClose, children: "Cancel" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "gg-btn gg-btn-primary",
                onClick: () => {
                  onRunAction({
                    kind: "stash-push",
                    message: textA.trim() || void 0,
                    includeUntracked: flagA
                  });
                  onClose();
                },
                children: "Stash Changes"
              }
            )
          ] })
        ] }),
        dialog.kind === "stash-branch" && /* @__PURE__ */ jsxs(Fragment2, { children: [
          /* @__PURE__ */ jsxs("div", { className: "gg-modal-header", children: [
            /* @__PURE__ */ jsxs("span", { children: [
              "Create Branch from ",
              dialog.selector
            ] }),
            /* @__PURE__ */ jsx("button", { type: "button", className: "gg-btn gg-btn-icon", onClick: onClose, children: "\u2715" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "gg-modal-body", children: /* @__PURE__ */ jsxs("div", { className: "gg-field", children: [
            /* @__PURE__ */ jsx("label", { className: "gg-field-label", children: "Branch Name" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                className: "gg-input",
                placeholder: "stash-recovery",
                value: textA,
                onChange: (e) => setTextA(e.target.value),
                autoFocus: true
              }
            )
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "gg-modal-footer", children: [
            /* @__PURE__ */ jsx("button", { type: "button", className: "gg-btn", onClick: onClose, children: "Cancel" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "gg-btn gg-btn-primary",
                disabled: !textA.trim(),
                onClick: () => {
                  onRunAction({
                    kind: "stash-branch",
                    selector: dialog.selector,
                    branchName: textA.trim()
                  });
                  onClose();
                },
                children: "Create Branch"
              }
            )
          ] })
        ] }),
        dialog.kind === "clean-untracked" && /* @__PURE__ */ jsxs(Fragment2, { children: [
          /* @__PURE__ */ jsxs("div", { className: "gg-modal-header", children: [
            /* @__PURE__ */ jsx("span", { children: "Clean Untracked Files" }),
            /* @__PURE__ */ jsx("button", { type: "button", className: "gg-btn gg-btn-icon", onClick: onClose, children: "\u2715" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "gg-modal-body", children: /* @__PURE__ */ jsxs("label", { className: "gg-checkbox-row", children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                checked: flagA,
                onChange: (e) => setFlagA(e.target.checked)
              }
            ),
            /* @__PURE__ */ jsx("span", { children: "Include untracked directories (-d)" })
          ] }) }),
          /* @__PURE__ */ jsxs("div", { className: "gg-modal-footer", children: [
            /* @__PURE__ */ jsx("button", { type: "button", className: "gg-btn", onClick: onClose, children: "Cancel" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "gg-btn gg-btn-primary",
                onClick: () => {
                  onRunAction({
                    kind: "clean-untracked",
                    includeDirectories: flagA
                  });
                  onClose();
                },
                children: "Clean Files"
              }
            )
          ] })
        ] }),
        dialog.kind === "discard-all" && /* @__PURE__ */ jsxs(Fragment2, { children: [
          /* @__PURE__ */ jsxs("div", { className: "gg-modal-header", children: [
            /* @__PURE__ */ jsx("span", { children: "Discard All Changes" }),
            /* @__PURE__ */ jsx("button", { type: "button", className: "gg-btn gg-btn-icon", onClick: onClose, children: "\u2715" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "gg-modal-body", children: /* @__PURE__ */ jsx("p", { children: "This resets all tracked files to HEAD and deletes all untracked files and directories. This cannot be undone." }) }),
          /* @__PURE__ */ jsxs("div", { className: "gg-modal-footer", children: [
            /* @__PURE__ */ jsx("button", { type: "button", className: "gg-btn", onClick: onClose, children: "Cancel" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "gg-btn gg-btn-danger",
                onClick: () => {
                  onRunAction({ kind: "discard-all" });
                  onClose();
                },
                children: "Discard All"
              }
            )
          ] })
        ] })
      ]
    }
  ) });
}

// src/app/components/RepoSettingsWidget.tsx
function RepoSettingsWidget({
  open,
  remotes,
  repoSettings,
  globalSettings,
  onClose,
  onRunGitAction,
  onUpdateRepoSettings,
  onUpdateGlobalSettings,
  onExportRepoConfig
}) {
  const [newRemoteName, setNewRemoteName] = useState("");
  const [newRemoteUrl, setNewRemoteUrl] = useState("");
  const [newIssuePattern, setNewIssuePattern] = useState("");
  const [newIssueUrl, setNewIssueUrl] = useState("");
  if (!open) return null;
  return /* @__PURE__ */ jsx("div", { className: "gg-modal-backdrop", onClick: onClose, children: /* @__PURE__ */ jsxs(
    "div",
    {
      className: "gg-modal gg-modal-width-settings",
      onClick: (e) => e.stopPropagation(),
      "data-testid": "gg-repo-settings-modal",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "gg-modal-header", children: [
          /* @__PURE__ */ jsx("span", { children: "Repository & Graph Settings" }),
          /* @__PURE__ */ jsx("button", { type: "button", className: "gg-btn gg-btn-icon", onClick: onClose, children: "\u2715" })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "gg-modal-body gg-gap-16", children: [
          /* @__PURE__ */ jsxs("div", { className: "gg-field", children: [
            /* @__PURE__ */ jsxs("label", { className: "gg-field-label", children: [
              "Git Remotes (",
              remotes.length,
              ")"
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "gg-flex-col gg-gap-6", children: [
              remotes.map((r) => /* @__PURE__ */ jsxs("div", { className: "gg-remote-card", children: [
                /* @__PURE__ */ jsxs("div", { className: "gg-overflow-hidden", children: [
                  /* @__PURE__ */ jsx("strong", { children: r.name }),
                  /* @__PURE__ */ jsx("div", { className: "gg-font-11 gg-text-secondary gg-ellipsis", children: r.fetchUrl })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "gg-flex-row gg-gap-4 gg-flex-shrink-0", children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      className: "gg-btn",
                      onClick: () => onRunGitAction({ kind: "remote-prune", name: r.name }),
                      title: "Prune stale remote-tracking branches",
                      children: "Prune"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      className: "gg-btn",
                      onClick: () => onRunGitAction({ kind: "remote-delete", name: r.name }),
                      title: "Remove Remote",
                      children: "Delete"
                    }
                  )
                ] })
              ] }, r.name)),
              /* @__PURE__ */ jsxs("div", { className: "gg-flex-row gg-gap-6", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    className: "gg-input gg-remote-name-width",
                    placeholder: "upstream",
                    value: newRemoteName,
                    onChange: (e) => setNewRemoteName(e.target.value)
                  }
                ),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    className: "gg-input gg-flex-1",
                    placeholder: "https://github.com/org/repo.git",
                    value: newRemoteUrl,
                    onChange: (e) => setNewRemoteUrl(e.target.value)
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    className: "gg-btn gg-btn-primary",
                    disabled: !newRemoteName.trim() || !newRemoteUrl.trim(),
                    onClick: () => {
                      onRunGitAction({
                        kind: "remote-add",
                        name: newRemoteName.trim(),
                        url: newRemoteUrl.trim(),
                        fetch: true
                      });
                      setNewRemoteName("");
                      setNewRemoteUrl("");
                    },
                    children: "Add Remote"
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "gg-field", children: [
            /* @__PURE__ */ jsx("label", { className: "gg-field-label", children: "Pull Request Creation" }),
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "8px" }, children: [
              /* @__PURE__ */ jsxs(
                "select",
                {
                  className: "gg-select",
                  value: repoSettings.pullRequestConfig.provider,
                  onChange: (e) => onUpdateRepoSettings({
                    pullRequestConfig: {
                      ...repoSettings.pullRequestConfig,
                      provider: e.target.value
                    }
                  }),
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "github", children: "GitHub" }),
                    /* @__PURE__ */ jsx("option", { value: "gitlab", children: "GitLab" }),
                    /* @__PURE__ */ jsx("option", { value: "bitbucket", children: "Bitbucket" }),
                    /* @__PURE__ */ jsx("option", { value: "custom", children: "Custom URL Template" })
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  className: "gg-input",
                  placeholder: "Remote (origin)",
                  value: repoSettings.pullRequestConfig.remoteName,
                  onChange: (e) => onUpdateRepoSettings({
                    pullRequestConfig: {
                      ...repoSettings.pullRequestConfig,
                      remoteName: e.target.value
                    }
                  })
                }
              ),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  className: "gg-input",
                  placeholder: "Target branch (main)",
                  value: repoSettings.pullRequestConfig.targetBranch,
                  onChange: (e) => onUpdateRepoSettings({
                    pullRequestConfig: {
                      ...repoSettings.pullRequestConfig,
                      targetBranch: e.target.value
                    }
                  })
                }
              )
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "gg-field", children: [
            /* @__PURE__ */ jsxs("label", { className: "gg-field-label", children: [
              "Issue Linking Rules (",
              repoSettings.issueLinkingRules.length,
              ")"
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "gg-flex-col gg-gap-6", children: [
              repoSettings.issueLinkingRules.map((rule) => /* @__PURE__ */ jsxs("div", { className: "gg-issue-rule-row", children: [
                /* @__PURE__ */ jsxs("code", { children: [
                  "/",
                  rule.pattern,
                  "/ \u2192 ",
                  rule.urlTemplate
                ] }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    className: "gg-btn",
                    onClick: () => onUpdateRepoSettings({
                      issueLinkingRules: repoSettings.issueLinkingRules.filter(
                        (r) => r.id !== rule.id
                      )
                    }),
                    children: "Remove"
                  }
                )
              ] }, rule.id)),
              /* @__PURE__ */ jsxs("div", { className: "gg-flex-row gg-gap-6", children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    className: "gg-input gg-issue-prefix-width",
                    placeholder: "#(\\d+)",
                    value: newIssuePattern,
                    onChange: (e) => setNewIssuePattern(e.target.value)
                  }
                ),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "text",
                    className: "gg-input gg-flex-1",
                    placeholder: "https://github.com/org/repo/issues/$1",
                    value: newIssueUrl,
                    onChange: (e) => setNewIssueUrl(e.target.value)
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    className: "gg-btn",
                    disabled: !newIssuePattern.trim() || !newIssueUrl.trim(),
                    onClick: () => {
                      const nextRule = {
                        id: `rule-${Date.now()}`,
                        pattern: newIssuePattern.trim(),
                        urlTemplate: newIssueUrl.trim()
                      };
                      onUpdateRepoSettings({
                        issueLinkingRules: [...repoSettings.issueLinkingRules, nextRule]
                      });
                      setNewIssuePattern("");
                      setNewIssueUrl("");
                    },
                    children: "Add Rule"
                  }
                )
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "gg-field", children: [
            /* @__PURE__ */ jsx("label", { className: "gg-field-label", children: "Graph Display & Muting" }),
            /* @__PURE__ */ jsxs("label", { className: "gg-checkbox-row", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  checked: globalSettings.muteNonAncestors,
                  onChange: (e) => onUpdateGlobalSettings({ muteNonAncestors: e.target.checked })
                }
              ),
              /* @__PURE__ */ jsx("span", { children: "Dim commits that are not ancestors of HEAD" })
            ] }),
            /* @__PURE__ */ jsxs("label", { className: "gg-checkbox-row", children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  checked: globalSettings.muteMergeCommits,
                  onChange: (e) => onUpdateGlobalSettings({ muteMergeCommits: e.target.checked })
                }
              ),
              /* @__PURE__ */ jsx("span", { children: "Dim merge commits (commits with >1 parent)" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "gg-flex-row gg-gap-8 gg-margin-top-6", children: [
              /* @__PURE__ */ jsxs(
                "select",
                {
                  className: "gg-select",
                  value: globalSettings.dateFormat,
                  onChange: (e) => onUpdateGlobalSettings({
                    dateFormat: e.target.value
                  }),
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "relative", children: "Date Format: Relative" }),
                    /* @__PURE__ */ jsx("option", { value: "iso", children: "Date Format: ISO" }),
                    /* @__PURE__ */ jsx("option", { value: "datetime", children: "Date Format: Local Date/Time" })
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "select",
                {
                  className: "gg-select",
                  value: globalSettings.dateType,
                  onChange: (e) => onUpdateGlobalSettings({
                    dateType: e.target.value
                  }),
                  children: [
                    /* @__PURE__ */ jsx("option", { value: "author", children: "Show Author Date" }),
                    /* @__PURE__ */ jsx("option", { value: "commit", children: "Show Commit Date" })
                  ]
                }
              )
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "gg-modal-footer", children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              className: "gg-btn",
              onClick: onExportRepoConfig,
              title: "Write .git-tree.json into the repository root",
              children: "Export .git-tree.json"
            }
          ),
          /* @__PURE__ */ jsx("button", { type: "button", className: "gg-btn gg-btn-primary", onClick: onClose, children: "Done" })
        ] })
      ]
    }
  ) });
}

// src/app/GitTreeProjectTab.tsx
var DEFAULT_COLUMN_WIDTHS = {
  date: 125,
  author: 130,
  commit: 74
};
var ROW_HEIGHT = 28;
var LANE_WIDTH = 14;
var PAD_X = 14;
function GitTreeDetachedPlaceholder({
  focusWindow,
  bringBack
}) {
  return /* @__PURE__ */ jsx("div", { className: "gg-root", "data-testid": "gg-detached-placeholder", children: /* @__PURE__ */ jsxs("div", { className: "gg-empty", style: { gap: "12px" }, children: [
    /* @__PURE__ */ jsx("div", { style: { fontSize: "14px", fontWeight: 600 }, children: "Git Tree is open in its own window" }),
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "8px" }, children: [
      /* @__PURE__ */ jsx("button", { type: "button", className: "gg-btn gg-btn-primary", onClick: focusWindow, children: "Focus Window" }),
      /* @__PURE__ */ jsx("button", { type: "button", className: "gg-btn", onClick: bringBack, children: "Bring Back Here" })
    ] })
  ] }) });
}
function GitTreeProjectTab({
  projectId: propProjectId,
  headerActions
}) {
  const rpc = useRpc();
  let zccCtx = { projectId: null };
  try {
    zccCtx = useZccContext();
  } catch {
  }
  const [projectList, setProjectList] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(
    propProjectId || zccCtx.projectId || ""
  );
  const projectId = propProjectId || selectedProjectId || zccCtx.projectId || "";
  let navigate = null;
  try {
    navigate = useZccNavigate();
  } catch {
    navigate = null;
  }
  useEffect(() => {
    if (!propProjectId && !selectedProjectId) {
      void rpc.call("listProjects").then((raw) => {
        const list = Array.isArray(raw) ? raw : [];
        setProjectList(list);
        if (list.length > 0 && !selectedProjectId) {
          setSelectedProjectId(list[0].id);
        }
      }).catch(() => {
      });
    }
  }, [propProjectId, selectedProjectId, rpc]);
  const [repos, setRepos] = useState([]);
  const [selectedRepoRelPath, setSelectedRepoRelPath] = useState("");
  const [graphData, setGraphData] = useState(null);
  const [maxCommits, setMaxCommits] = useState(300);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null);
  const [banner, setBanner] = useState(
    null
  );
  const [selectedHash, setSelectedHash] = useState(null);
  const [compareWithHash, setCompareWithHash] = useState(null);
  const [commitDetails, setCommitDetails] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [codeReview, setCodeReview] = useState(null);
  const [selectedFilePath, setSelectedFilePath] = useState(null);
  const [fileDiff, setFileDiff] = useState(null);
  const [loadingDiff, setLoadingDiff] = useState(false);
  const [fileContent, setFileContent] = useState(null);
  const [loadingContent, setLoadingContent] = useState(false);
  const [findOpen, setFindOpen] = useState(false);
  const [findQuery, setFindQuery] = useState("");
  const [activeMatchIdx, setActiveMatchIdx] = useState(0);
  const [contextMenu, setContextMenu] = useState(null);
  const [activeDialog, setActiveDialog] = useState(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [initializingRepo, setInitializingRepo] = useState(false);
  const tableScrollRef = useRef(null);
  const headerScrollRef = useRef(null);
  const loadReposAndGraph = useCallback(
    async (repoRelPathOverride, maxCountOverride, projectIdOverride) => {
      const activePid = projectIdOverride ?? projectId;
      if (!activePid) {
        setLoading(false);
        return;
      }
      setLoading(true);
      setErrorMessage(null);
      try {
        const rawDiscovered = await rpc.call("discoverRepos", {
          projectId: activePid
        });
        const discovered = Array.isArray(rawDiscovered) ? rawDiscovered : rawDiscovered?.repos ?? [];
        setRepos(discovered);
        if (discovered.length === 0) {
          setGraphData(null);
          setLoading(false);
          return;
        }
        const effectiveRelPath = repoRelPathOverride !== void 0 ? repoRelPathOverride : discovered.some((r) => r.relPath === selectedRepoRelPath) ? selectedRepoRelPath : discovered[0].relPath;
        if (effectiveRelPath !== selectedRepoRelPath) {
          setSelectedRepoRelPath(effectiveRelPath);
        }
        const data = await rpc.call("loadGraph", {
          projectId: activePid,
          subRepoRelPath: effectiveRelPath,
          maxCommits: maxCountOverride ?? maxCommits
        });
        setGraphData(data);
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : String(err));
      } finally {
        setLoading(false);
      }
    },
    [projectId, rpc, selectedRepoRelPath, maxCommits]
  );
  useEffect(() => {
    void loadReposAndGraph();
  }, [projectId]);
  const onDataChanged = (payload) => {
    const evt = payload;
    if (!evt?.projectId || evt.projectId === projectId) {
      void loadReposAndGraph(selectedRepoRelPath, maxCommits);
    }
  };
  useRealtime("git-tree:changed", onDataChanged);
  useRealtime("git-graph:changed", onDataChanged);
  useEffect(() => {
    if (!projectId || !selectedHash) {
      setCommitDetails(null);
      setComparison(null);
      setCodeReview(null);
      setSelectedFilePath(null);
      setFileDiff(null);
      setFileContent(null);
      return;
    }
    let cancelled = false;
    setLoadingDetails(true);
    setSelectedFilePath(null);
    setFileDiff(null);
    setFileContent(null);
    const fetchDetails = async () => {
      try {
        if (compareWithHash && compareWithHash !== selectedHash) {
          const res = await rpc.call("compareCommits", {
            projectId,
            subRepoRelPath: selectedRepoRelPath,
            fromHash: selectedHash,
            toHash: compareWithHash
          });
          if (cancelled) return;
          setComparison(res.comparison);
          setCommitDetails(null);
          setCodeReview(res.codeReview);
          if (res.comparison.fileChanges.length > 0) {
            void handleSelectFile(
              res.comparison.fileChanges[0],
              compareWithHash,
              selectedHash
            );
          }
        } else {
          const res = await rpc.call("getCommitDetails", {
            projectId,
            subRepoRelPath: selectedRepoRelPath,
            commitHash: selectedHash
          });
          if (cancelled) return;
          setCommitDetails(res.details);
          setComparison(null);
          setCodeReview(res.codeReview);
          if (res.details.fileChanges.length > 0) {
            void handleSelectFile(res.details.fileChanges[0], selectedHash, void 0);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setBanner({
            kind: "error",
            text: err instanceof Error ? err.message : String(err)
          });
        }
      } finally {
        if (!cancelled) setLoadingDetails(false);
      }
    };
    void fetchDetails();
    return () => {
      cancelled = true;
    };
  }, [projectId, selectedRepoRelPath, selectedHash, compareWithHash]);
  const handleLoadFileContent = useCallback(
    async (filePath, commitHashOverride) => {
      const targetCommit = commitHashOverride ?? compareWithHash ?? selectedHash;
      if (!targetCommit) return;
      setLoadingContent(true);
      try {
        const res = await rpc.call("getFileContent", {
          projectId,
          subRepoRelPath: selectedRepoRelPath,
          commitHash: targetCommit,
          filePath
        });
        setFileContent(res);
      } catch (err) {
        setBanner({
          kind: "error",
          text: err instanceof Error ? err.message : String(err)
        });
      } finally {
        setLoadingContent(false);
      }
    },
    [projectId, rpc, selectedRepoRelPath, selectedHash, compareWithHash]
  );
  const handleSelectFile = useCallback(
    async (file, commitHashOverride, fromHashOverride) => {
      const targetCommit = commitHashOverride ?? compareWithHash ?? selectedHash;
      if (!targetCommit) return;
      const effectiveFrom = fromHashOverride !== void 0 ? fromHashOverride : compareWithHash ? selectedHash ?? void 0 : void 0;
      setSelectedFilePath(file.newPath);
      setLoadingDiff(true);
      setFileContent(null);
      void handleLoadFileContent(file.newPath, targetCommit);
      try {
        const diff = await rpc.call("getFileDiff", {
          projectId,
          subRepoRelPath: selectedRepoRelPath,
          commitHash: targetCommit,
          fromHash: effectiveFrom,
          filePath: file.newPath,
          oldPath: file.oldPath !== file.newPath ? file.oldPath : void 0,
          staged: file.staged,
          untracked: file.untracked
        });
        setFileDiff(diff);
      } catch (err) {
        setBanner({
          kind: "error",
          text: err instanceof Error ? err.message : String(err)
        });
      } finally {
        setLoadingDiff(false);
      }
    },
    [projectId, rpc, selectedRepoRelPath, selectedHash, compareWithHash, handleLoadFileContent]
  );
  const commits = graphData?.commits ?? [];
  const headHash = graphData?.headHash ?? null;
  const globalSettings = graphData?.globalSettings ?? {
    graphStyle: "rounded",
    initialLoadCommits: 300,
    loadMoreCommits: 100,
    muteNonAncestors: false,
    muteMergeCommits: false,
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
    graphColors: [],
    columnWidths: DEFAULT_COLUMN_WIDTHS
  };
  const repoSettings = graphData?.repoSettings ?? {
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
  const layout = useMemo(
    () => computeGraphLayout(commits, headHash, globalSettings.graphColors),
    [commits, headHash, globalSettings.graphColors]
  );
  const graphColumnWidth = useMemo(
    () => Math.max(48, PAD_X * 2 + (layout.maxLane + 1) * LANE_WIDTH),
    [layout.maxLane]
  );
  const matchingCommitIndices = useMemo(() => {
    const q = findQuery.trim().toLowerCase();
    if (!q) return [];
    const indices = [];
    commits.forEach((c, idx) => {
      const hay = [
        c.hash,
        c.abbreviatedHash,
        c.subject,
        c.authorName,
        c.authorEmail,
        ...c.refs.map((r) => r.remote ? `${r.remote}/${r.name}` : r.name)
      ].join(" ").toLowerCase();
      if (hay.includes(q)) indices.push(idx);
    });
    return indices;
  }, [commits, findQuery]);
  const scrollToRow = useCallback((rowIdx) => {
    const container = tableScrollRef.current;
    if (!container) return;
    const targetTop = Math.max(0, rowIdx * ROW_HEIGHT - container.clientHeight / 3);
    container.scrollTo?.({ top: targetTop, behavior: "smooth" });
  }, []);
  const handleScrollToHead = useCallback(() => {
    if (!headHash) return;
    const idx = commits.findIndex((c) => c.hash === headHash);
    if (idx >= 0) {
      setSelectedHash(headHash);
      setCompareWithHash(null);
      scrollToRow(idx);
    }
  }, [commits, headHash, scrollToRow]);
  const handleRunGitAction = useCallback(
    async (action) => {
      try {
        setBanner(null);
        const outcome = await rpc.call("runGitAction", {
          projectId,
          subRepoRelPath: selectedRepoRelPath,
          action
        });
        await loadReposAndGraph(selectedRepoRelPath, maxCommits);
        if (outcome?.notice) setBanner({ kind: "info", text: outcome.notice });
      } catch (err) {
        setBanner({
          kind: "error",
          text: err instanceof Error ? err.message : String(err)
        });
      }
    },
    [projectId, rpc, selectedRepoRelPath, loadReposAndGraph, maxCommits]
  );
  const handleInitRepo = useCallback(async () => {
    if (!projectId || initializingRepo) return;
    setInitializingRepo(true);
    setBanner(null);
    try {
      await rpc.call("runGitAction", {
        projectId,
        subRepoRelPath: "",
        action: "init"
      });
      await loadReposAndGraph();
    } catch (err) {
      setBanner({
        kind: "error",
        text: err instanceof Error ? err.message : String(err)
      });
    } finally {
      setInitializingRepo(false);
    }
  }, [projectId, initializingRepo, rpc, loadReposAndGraph]);
  const handleUpdateRepoSettings = useCallback(
    async (patch) => {
      try {
        await rpc.call("updateRepoSettings", {
          projectId,
          subRepoRelPath: selectedRepoRelPath,
          patch
        });
        await loadReposAndGraph(selectedRepoRelPath, maxCommits);
      } catch (err) {
        setBanner({
          kind: "error",
          text: err instanceof Error ? err.message : String(err)
        });
      }
    },
    [projectId, rpc, selectedRepoRelPath, loadReposAndGraph, maxCommits]
  );
  const handleUpdateGlobalSettings = useCallback(
    async (patch) => {
      try {
        await rpc.call("updateGlobalSettings", { patch });
        setGraphData(
          (prev) => prev ? {
            ...prev,
            globalSettings: { ...prev.globalSettings, ...patch }
          } : prev
        );
      } catch (err) {
        setBanner({
          kind: "error",
          text: err instanceof Error ? err.message : String(err)
        });
      }
    },
    [rpc]
  );
  const [colWidths, setColWidths] = useState(() => ({
    description: globalSettings.columnWidths?.description,
    date: globalSettings.columnWidths?.date ?? DEFAULT_COLUMN_WIDTHS.date,
    author: globalSettings.columnWidths?.author ?? DEFAULT_COLUMN_WIDTHS.author,
    commit: globalSettings.columnWidths?.commit ?? DEFAULT_COLUMN_WIDTHS.commit
  }));
  const [activeResizeCol, setActiveResizeCol] = useState(null);
  const colWidthsRef = useRef(colWidths);
  colWidthsRef.current = colWidths;
  const isResizingRef = useRef(false);
  const descHeaderRef = useRef(null);
  useEffect(() => {
    if (!isResizingRef.current && globalSettings.columnWidths) {
      setColWidths({
        description: globalSettings.columnWidths.description,
        date: globalSettings.columnWidths.date ?? DEFAULT_COLUMN_WIDTHS.date,
        author: globalSettings.columnWidths.author ?? DEFAULT_COLUMN_WIDTHS.author,
        commit: globalSettings.columnWidths.commit ?? DEFAULT_COLUMN_WIDTHS.commit
      });
    }
  }, [globalSettings.columnWidths]);
  const startResize = useCallback(
    (e, column) => {
      e.preventDefault();
      e.stopPropagation();
      isResizingRef.current = true;
      setActiveResizeCol(column);
      const startX = e.clientX;
      const startWidth = column === "description" ? colWidthsRef.current.description ?? descHeaderRef.current?.getBoundingClientRect().width ?? 260 : colWidthsRef.current[column];
      let latestWidth = startWidth;
      const prevUserSelect = document.body.style.userSelect;
      const prevCursor = document.body.style.cursor;
      document.body.style.userSelect = "none";
      document.body.style.cursor = "col-resize";
      const minWidth = column === "commit" ? 50 : column === "description" ? 150 : 60;
      const maxWidth = column === "description" ? 1200 : 500;
      const onPointerMove = (moveEvt) => {
        const deltaX = moveEvt.clientX - startX;
        const nextWidth = Math.max(minWidth, Math.min(maxWidth, Math.round(startWidth + deltaX)));
        latestWidth = nextWidth;
        setColWidths((prev) => ({
          ...prev,
          [column]: nextWidth
        }));
      };
      const onPointerUp = () => {
        window.removeEventListener("mousemove", onPointerMove);
        window.removeEventListener("mouseup", onPointerUp);
        document.body.style.userSelect = prevUserSelect;
        document.body.style.cursor = prevCursor;
        isResizingRef.current = false;
        setActiveResizeCol(null);
        const nextAll = {
          ...colWidthsRef.current,
          [column]: latestWidth
        };
        void handleUpdateGlobalSettings({
          columnWidths: nextAll
        });
      };
      window.addEventListener("mousemove", onPointerMove);
      window.addEventListener("mouseup", onPointerUp);
    },
    [handleUpdateGlobalSettings]
  );
  const resetColumnWidth = useCallback(
    (column) => {
      if (column === "description") {
        const nextAll2 = { ...colWidthsRef.current };
        delete nextAll2.description;
        setColWidths(nextAll2);
        void handleUpdateGlobalSettings({
          columnWidths: nextAll2
        });
        return;
      }
      const nextWidth = DEFAULT_COLUMN_WIDTHS[column];
      const nextAll = {
        ...colWidthsRef.current,
        [column]: nextWidth
      };
      setColWidths(nextAll);
      void handleUpdateGlobalSettings({
        columnWidths: nextAll
      });
    },
    [handleUpdateGlobalSettings]
  );
  const handleCopyText = useCallback(async (text, label) => {
    if (!text) {
      setBanner({ kind: "info", text: `Nothing to copy: ${label} is empty.` });
      return;
    }
    if (await copyText(text)) {
      setBanner({ kind: "info", text: `${label} copied to clipboard.` });
    } else {
      setBanner({ kind: "error", text: `Could not copy ${label.toLowerCase()}.` });
    }
  }, []);
  const handleViewTagDetails = useCallback(
    async (tagName) => {
      setActiveDialog({ kind: "tag-details", tagName, details: null });
      try {
        const details = await rpc.call("getTagDetails", {
          projectId,
          subRepoRelPath: selectedRepoRelPath,
          tagName
        });
        setActiveDialog({ kind: "tag-details", tagName, details });
      } catch (err) {
        setBanner({
          kind: "error",
          text: err instanceof Error ? err.message : String(err)
        });
      }
    },
    [projectId, rpc, selectedRepoRelPath]
  );
  const handleOpenPullRequest = useCallback(
    async (branchName) => {
      try {
        const res = await rpc.call("buildPullRequestUrl", {
          projectId,
          subRepoRelPath: selectedRepoRelPath,
          sourceBranch: branchName
        });
        if (res.url) {
          window.open(res.url, "_blank", "noopener,noreferrer");
        } else {
          setBanner({
            kind: "error",
            text: "Could not derive a Pull Request URL from the configured remote."
          });
        }
      } catch (err) {
        setBanner({
          kind: "error",
          text: err instanceof Error ? err.message : String(err)
        });
      }
    },
    [projectId, rpc, selectedRepoRelPath]
  );
  const handleAskAgent = useCallback(
    async (target) => {
      const { commitHash, fromHash, filePath } = target;
      try {
        setBanner({
          kind: "info",
          text: "Preparing agent draft\u2026"
        });
        const res = await rpc.call("draftAgentAboutCommit", {
          projectId,
          subRepoRelPath: selectedRepoRelPath,
          commitHash,
          fromHash,
          filePath
        });
        const targetTitle = res.title;
        const targetView = filePath ? `${commitHash}:${filePath}` : commitHash;
        if (navigate?.openPanelAgent) {
          const opened = navigate.openPanelAgent({
            draft: {
              prompt: res.prompt,
              view: targetView,
              ...projectId ? { projectId } : {}
            },
            title: targetTitle
          });
          if (opened) {
            setBanner({
              kind: "info",
              text: `Draft opened in side panel: ${targetTitle}`
            });
            return;
          }
        }
        const fallback = await rpc.call("askAgentAboutCommit", {
          projectId,
          subRepoRelPath: selectedRepoRelPath,
          commitHash,
          fromHash,
          filePath
        });
        setBanner({
          kind: "info",
          text: `Spawned Agent thread: ${fallback.title}`
        });
        navigate?.toThread?.(fallback.threadId);
      } catch (err) {
        setBanner({
          kind: "error",
          text: err instanceof Error ? err.message : String(err)
        });
      }
    },
    [projectId, rpc, selectedRepoRelPath, navigate]
  );
  const handleStartCodeReview = useCallback(async () => {
    if (!selectedHash) return;
    const fromHash = compareWithHash ? selectedHash : null;
    const toHash = compareWithHash ?? selectedHash;
    try {
      const review = await rpc.call("codeReviewStart", {
        projectId,
        subRepoRelPath: selectedRepoRelPath,
        fromHash,
        toHash
      });
      setCodeReview(review);
    } catch (err) {
      setBanner({
        kind: "error",
        text: err instanceof Error ? err.message : String(err)
      });
    }
  }, [projectId, rpc, selectedRepoRelPath, selectedHash, compareWithHash]);
  const handleToggleReviewedFile = useCallback(
    async (filePath, reviewed) => {
      if (!selectedHash) return;
      const fromHash = compareWithHash ? selectedHash : null;
      const toHash = compareWithHash ?? selectedHash;
      try {
        const review = await rpc.call("codeReviewToggleFile", {
          projectId,
          subRepoRelPath: selectedRepoRelPath,
          fromHash,
          toHash,
          filePath,
          reviewed
        });
        setCodeReview(review);
      } catch (err) {
        setBanner({
          kind: "error",
          text: err instanceof Error ? err.message : String(err)
        });
      }
    },
    [projectId, rpc, selectedRepoRelPath, selectedHash, compareWithHash]
  );
  const handleEndCodeReview = useCallback(async () => {
    if (!selectedHash) return;
    const fromHash = compareWithHash ? selectedHash : null;
    const toHash = compareWithHash ?? selectedHash;
    try {
      await rpc.call("codeReviewEnd", {
        projectId,
        subRepoRelPath: selectedRepoRelPath,
        fromHash,
        toHash
      });
      setCodeReview(null);
    } catch (err) {
      setBanner({
        kind: "error",
        text: err instanceof Error ? err.message : String(err)
      });
    }
  }, [projectId, rpc, selectedRepoRelPath, selectedHash, compareWithHash]);
  const handleKeyDown = useCallback(
    (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "f") {
        e.preventDefault();
        setFindOpen(true);
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "h") {
        e.preventDefault();
        handleScrollToHead();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "r") {
        e.preventDefault();
        void loadReposAndGraph(selectedRepoRelPath, maxCommits);
        return;
      }
      if (e.key === "Escape") {
        if (contextMenu) {
          setContextMenu(null);
        } else if (activeDialog) {
          setActiveDialog(null);
        } else if (findOpen) {
          setFindOpen(false);
        } else if (selectedHash) {
          setSelectedHash(null);
          setCompareWithHash(null);
        }
        return;
      }
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        if (commits.length === 0) return;
        const currentIdx = selectedHash ? commits.findIndex((c) => c.hash === selectedHash) : -1;
        const nextIdx = e.key === "ArrowDown" ? Math.min(commits.length - 1, currentIdx + 1) : Math.max(0, currentIdx <= 0 ? 0 : currentIdx - 1);
        const nextCommit = commits[nextIdx];
        if (nextCommit) {
          e.preventDefault();
          setSelectedHash(nextCommit.hash);
          setCompareWithHash(null);
        }
      }
    },
    [
      commits,
      selectedHash,
      contextMenu,
      activeDialog,
      findOpen,
      handleScrollToHead,
      loadReposAndGraph,
      selectedRepoRelPath,
      maxCommits
    ]
  );
  const renderRefBadge = (commit, ref, idx) => {
    const className = ref.type === "head" ? `gg-ref-badge gg-ref-head ${ref.isHead ? "is-current" : ""}` : ref.type === "remote" ? "gg-ref-badge gg-ref-remote" : ref.type === "tag" ? "gg-ref-badge gg-ref-tag" : "gg-ref-badge gg-ref-stash";
    const icon = ref.type === "remote" ? "\u2601" : ref.type === "tag" ? "\u{1F3F7}" : ref.type === "stash" ? "\u{1F4E6}" : ref.isHead ? "\u25CF" : "\u2442";
    const displayName = ref.type === "remote" && ref.remote ? `${ref.remote}/${ref.name}` : ref.name;
    return /* @__PURE__ */ jsxs(
      "span",
      {
        className,
        title: ref.type === "head" ? ref.isHead ? `Current branch: ${ref.name}` : `Branch: ${ref.name} (Double-click to checkout)` : ref.type === "remote" ? `Remote branch: ${displayName}` : ref.type === "tag" ? `Tag: ${ref.name}` : `Stash: ${ref.name}`,
        onContextMenu: (e) => {
          e.preventDefault();
          e.stopPropagation();
          if (ref.type === "head") {
            setContextMenu({
              kind: "branch",
              commit,
              ref,
              x: e.clientX,
              y: e.clientY
            });
          } else if (ref.type === "remote") {
            setContextMenu({
              kind: "remote-branch",
              commit,
              ref,
              x: e.clientX,
              y: e.clientY
            });
          } else if (ref.type === "tag") {
            setContextMenu({
              kind: "tag",
              commit,
              ref,
              x: e.clientX,
              y: e.clientY
            });
          } else if (ref.type === "stash") {
            setContextMenu({
              kind: "stash",
              commit,
              selector: ref.selector || ref.name,
              x: e.clientX,
              y: e.clientY
            });
          }
        },
        onDoubleClick: (e) => {
          e.stopPropagation();
          if (ref.type === "head" && !ref.isHead) {
            void handleRunGitAction({
              kind: "checkout-branch",
              branchName: ref.name
            });
          }
        },
        children: [
          /* @__PURE__ */ jsx("span", { className: "gg-ref-icon", children: icon }),
          /* @__PURE__ */ jsx("span", { className: "gg-ref-name", children: displayName })
        ]
      },
      `${ref.type}:${ref.remote ?? ""}:${ref.name}:${idx}`
    );
  };
  const renderCommitSubject = (subject) => {
    const tokens = tokenizeCommitMessage(subject, repoSettings.issueLinkingRules);
    return tokens.map((tok, idx) => {
      if (tok.kind === "code") {
        return /* @__PURE__ */ jsx(
          "code",
          {
            style: {
              background: "rgba(255,255,255,0.08)",
              padding: "0 4px",
              borderRadius: "3px",
              fontSize: "11px"
            },
            children: tok.text
          },
          idx
        );
      }
      if (tok.kind === "link" && tok.href) {
        return /* @__PURE__ */ jsx(
          "a",
          {
            href: tok.href,
            target: "_blank",
            rel: "noreferrer",
            onClick: (e) => e.stopPropagation(),
            style: { color: "var(--accent-color, #4da3ff)" },
            children: tok.text
          },
          idx
        );
      }
      return /* @__PURE__ */ jsx(react_default.Fragment, { children: tok.text }, idx);
    });
  };
  const detailsOpen = Boolean(selectedHash);
  const isInlineDetails = globalSettings.commitDetailsLocation === "inline";
  const [inlineDetailsHeight, setInlineDetailsHeight] = useState(340);
  const [visibleWidth, setVisibleWidth] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const inlineDetailsRef = useRef(null);
  useEffect(() => {
    const el = tableScrollRef.current;
    if (!el) return;
    const updateSize = () => {
      if (el) {
        setVisibleWidth(el.clientWidth);
        setScrollLeft(el.scrollLeft);
      }
    };
    updateSize();
    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(updateSize);
      ro.observe(el);
      return () => ro.disconnect();
    }
  }, [graphData, loading, commits.length]);
  const inlineMarginLeft = Math.max(graphColumnWidth + 8, scrollLeft + 8);
  const inlineWidth = visibleWidth > 0 ? Math.max(280, scrollLeft + visibleWidth - inlineMarginLeft - 16) : void 0;
  const expandedRow = useMemo(() => {
    if (!detailsOpen || !isInlineDetails) return -1;
    const targetHash = compareWithHash ?? selectedHash;
    if (!targetHash) return -1;
    return commits.findIndex((c) => c.hash === targetHash);
  }, [detailsOpen, isInlineDetails, compareWithHash, selectedHash, commits]);
  useEffect(() => {
    const el = inlineDetailsRef.current;
    if (!el) return;
    const update = () => {
      if (el) {
        const h = el.offsetHeight;
        if (h > 0) setInlineDetailsHeight(h);
      }
    };
    update();
    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(update);
      ro.observe(el);
      return () => ro.disconnect();
    }
  }, [
    isInlineDetails,
    detailsOpen,
    selectedHash,
    compareWithHash,
    commitDetails,
    comparison,
    fileDiff,
    loadingDetails,
    loadingDiff
  ]);
  const svgHeight = useMemo(() => {
    const base = commits.length * ROW_HEIGHT;
    if (isInlineDetails && detailsOpen && expandedRow >= 0) {
      return base + inlineDetailsHeight + 12;
    }
    return base;
  }, [commits.length, isInlineDetails, detailsOpen, expandedRow, inlineDetailsHeight]);
  const getNodeY = useCallback(
    (row) => {
      if (isInlineDetails && detailsOpen && expandedRow >= 0 && row > expandedRow) {
        return row * ROW_HEIGHT + inlineDetailsHeight + 12 + ROW_HEIGHT / 2;
      }
      return row * ROW_HEIGHT + ROW_HEIGHT / 2;
    },
    [isInlineDetails, detailsOpen, expandedRow, inlineDetailsHeight]
  );
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "gg-root",
      tabIndex: 0,
      onKeyDown: handleKeyDown,
      "data-testid": "gg-project-tab",
      children: [
        /* @__PURE__ */ jsx(
          ControlBar,
          {
            projects: projectList,
            selectedProjectId: projectId,
            onSelectProject: (pId) => {
              setSelectedProjectId(pId);
              setSelectedHash(null);
              setCompareWithHash(null);
              void loadReposAndGraph(void 0, void 0, pId);
            },
            repos,
            selectedRepoRelPath,
            onSelectRepo: (relPath) => {
              setSelectedHash(null);
              setCompareWithHash(null);
              setSelectedRepoRelPath(relPath);
              void loadReposAndGraph(relPath, maxCommits);
            },
            branches: graphData?.branches ?? [],
            remoteBranches: graphData?.remoteBranches ?? [],
            repoSettings,
            globalSettings,
            loading,
            findOpen,
            headerActions,
            onUpdateRepoSettings: (patch) => void handleUpdateRepoSettings(patch),
            onUpdateGlobalSettings: (patch) => void handleUpdateGlobalSettings(patch),
            onFetch: () => void handleRunGitAction({
              kind: "fetch",
              all: true,
              prune: globalSettings.fetchAndPrune,
              pruneTags: globalSettings.fetchAndPruneTags
            }),
            onPush: () => {
              const branch = graphData?.currentBranch;
              if (branch) setActiveDialog({ kind: "push-branch", branchName: branch });
            },
            canPush: Boolean(graphData?.currentBranch),
            onScrollToHead: handleScrollToHead,
            onToggleFind: () => setFindOpen((prev) => !prev),
            onOpenRepoSettings: () => setSettingsOpen(true),
            onRefresh: () => void loadReposAndGraph(selectedRepoRelPath, maxCommits)
          }
        ),
        banner && /* @__PURE__ */ jsxs(
          "div",
          {
            className: `gg-banner ${banner.kind === "error" ? "gg-banner-error" : "gg-banner-info"}`,
            "data-testid": "gg-banner",
            children: [
              /* @__PURE__ */ jsx("span", { children: banner.text }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "gg-btn gg-btn-icon",
                  onClick: () => setBanner(null),
                  children: "\u2715"
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { className: "gg-workspace", children: [
          findOpen && /* @__PURE__ */ jsx(
            FindWidget,
            {
              query: findQuery,
              matchCount: matchingCommitIndices.length,
              activeMatchIndex: activeMatchIdx,
              onChangeQuery: (q) => {
                setFindQuery(q);
                setActiveMatchIdx(0);
              },
              onNext: () => {
                if (matchingCommitIndices.length === 0) return;
                const next = (activeMatchIdx + 1) % matchingCommitIndices.length;
                setActiveMatchIdx(next);
                const rowIdx = matchingCommitIndices[next];
                setSelectedHash(commits[rowIdx].hash);
                scrollToRow(rowIdx);
              },
              onPrev: () => {
                if (matchingCommitIndices.length === 0) return;
                const prev = (activeMatchIdx - 1 + matchingCommitIndices.length) % matchingCommitIndices.length;
                setActiveMatchIdx(prev);
                const rowIdx = matchingCommitIndices[prev];
                setSelectedHash(commits[rowIdx].hash);
                scrollToRow(rowIdx);
              },
              onClose: () => setFindOpen(false)
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "gg-table-container", children: [
            /* @__PURE__ */ jsx("div", { className: "gg-table-header-scroll", ref: headerScrollRef, children: /* @__PURE__ */ jsxs("div", { className: "gg-table-header", children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  style: {
                    width: `${graphColumnWidth}px`,
                    minWidth: `${graphColumnWidth}px`,
                    maxWidth: `${graphColumnWidth}px`,
                    flex: `0 0 ${graphColumnWidth}px`,
                    paddingLeft: "8px",
                    boxSizing: "border-box"
                  },
                  children: "Graph"
                }
              ),
              /* @__PURE__ */ jsx(
                "div",
                {
                  ref: descHeaderRef,
                  style: {
                    ...colWidths.description !== void 0 ? {
                      width: `${colWidths.description}px`,
                      minWidth: `${colWidths.description}px`,
                      maxWidth: `${colWidths.description}px`,
                      flex: `0 0 ${colWidths.description}px`
                    } : {
                      flex: "1 1 0px",
                      minWidth: "150px"
                    },
                    padding: "0 8px",
                    boxSizing: "border-box"
                  },
                  children: "Description"
                }
              ),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: `gg-col-resizer ${activeResizeCol === "description" ? "active" : ""}`,
                  title: "Resize Description \xB7 Double-click to auto-fit",
                  "data-testid": "gg-col-resizer-description",
                  onMouseDown: (e) => startResize(e, "description"),
                  onDoubleClick: () => resetColumnWidth("description")
                }
              ),
              /* @__PURE__ */ jsx(
                "div",
                {
                  style: {
                    width: `${colWidths.date}px`,
                    minWidth: `${colWidths.date}px`,
                    maxWidth: `${colWidths.date}px`,
                    flex: `0 0 ${colWidths.date}px`,
                    padding: "0 6px",
                    boxSizing: "border-box"
                  },
                  children: "Date"
                }
              ),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: `gg-col-resizer ${activeResizeCol === "date" ? "active" : ""}`,
                  title: "Resize Date \xB7 Double-click to reset",
                  "data-testid": "gg-col-resizer-date",
                  onMouseDown: (e) => startResize(e, "date"),
                  onDoubleClick: () => resetColumnWidth("date")
                }
              ),
              /* @__PURE__ */ jsx(
                "div",
                {
                  style: {
                    width: `${colWidths.author}px`,
                    minWidth: `${colWidths.author}px`,
                    maxWidth: `${colWidths.author}px`,
                    flex: `0 0 ${colWidths.author}px`,
                    padding: "0 6px",
                    boxSizing: "border-box"
                  },
                  children: "Author"
                }
              ),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: `gg-col-resizer ${activeResizeCol === "author" ? "active" : ""}`,
                  title: "Resize Author \xB7 Double-click to reset",
                  "data-testid": "gg-col-resizer-author",
                  onMouseDown: (e) => startResize(e, "author"),
                  onDoubleClick: () => resetColumnWidth("author")
                }
              ),
              /* @__PURE__ */ jsx(
                "div",
                {
                  style: {
                    width: `${colWidths.commit}px`,
                    minWidth: `${colWidths.commit}px`,
                    maxWidth: `${colWidths.commit}px`,
                    flex: `0 0 ${colWidths.commit}px`,
                    textAlign: "right",
                    padding: "0 6px",
                    boxSizing: "border-box"
                  },
                  children: "Commit"
                }
              ),
              /* @__PURE__ */ jsx(
                "div",
                {
                  className: `gg-col-resizer ${activeResizeCol === "commit" ? "active" : ""}`,
                  title: "Resize Commit \xB7 Double-click to reset",
                  "data-testid": "gg-col-resizer-commit",
                  onMouseDown: (e) => startResize(e, "commit"),
                  onDoubleClick: () => resetColumnWidth("commit")
                }
              )
            ] }) }),
            loading && !graphData ? /* @__PURE__ */ jsx("div", { className: "gg-empty", children: "Loading Git Tree\u2026" }) : errorMessage ? /* @__PURE__ */ jsxs("div", { className: "gg-empty", children: [
              /* @__PURE__ */ jsxs("div", { children: [
                "Failed to load Git Tree: ",
                errorMessage
              ] }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "gg-btn",
                  style: { marginTop: "8px" },
                  onClick: () => void loadReposAndGraph(selectedRepoRelPath, maxCommits),
                  children: "Retry"
                }
              )
            ] }) : repos.length === 0 ? /* @__PURE__ */ jsxs("div", { className: "gg-empty", style: { gap: "12px" }, children: [
              /* @__PURE__ */ jsx("div", { children: "No Git repositories found in this project." }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  className: "gg-btn gg-btn-primary",
                  "data-testid": "gg-init-repo-btn",
                  disabled: initializingRepo,
                  onClick: () => void handleInitRepo(),
                  children: initializingRepo ? "Initializing\u2026" : "Initialize Git Repository"
                }
              )
            ] }) : commits.length === 0 ? /* @__PURE__ */ jsx("div", { className: "gg-empty", children: headHash ? "No commits match the current branch filters." : "Repository initialized with no commits or uncommitted changes yet." }) : /* @__PURE__ */ jsxs(
              "div",
              {
                className: "gg-table-scroll",
                ref: tableScrollRef,
                onScroll: (e) => {
                  const sl = e.currentTarget.scrollLeft;
                  if (sl !== scrollLeft) {
                    setScrollLeft(sl);
                  }
                  if (headerScrollRef.current) {
                    headerScrollRef.current.scrollLeft = sl;
                  }
                },
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "gg-rows-wrapper", children: [
                    /* @__PURE__ */ jsxs(
                      "svg",
                      {
                        className: "gg-svg-overlay",
                        width: graphColumnWidth,
                        height: svgHeight,
                        "data-testid": "gg-svg-dag",
                        children: [
                          layout.segments.map((seg, idx) => /* @__PURE__ */ jsx(
                            "path",
                            {
                              d: buildSegmentSvgPath({
                                segment: seg,
                                rowHeight: ROW_HEIGHT,
                                laneWidth: LANE_WIDTH,
                                padX: PAD_X,
                                style: globalSettings.graphStyle,
                                expandedRow: isInlineDetails && detailsOpen ? expandedRow : -1,
                                detailsHeight: isInlineDetails && detailsOpen ? inlineDetailsHeight + 12 : 0
                              }),
                              fill: "none",
                              stroke: seg.color,
                              strokeWidth: 2,
                              strokeDasharray: seg.isUncommitted ? "3 3" : void 0
                            },
                            idx
                          )),
                          layout.nodes.map((node) => {
                            const cx = PAD_X + node.lane * LANE_WIDTH;
                            const cy = getNodeY(node.row);
                            const isSelected = selectedHash === node.commit.hash;
                            if (node.commit.isUncommitted) {
                              return /* @__PURE__ */ jsx(
                                "circle",
                                {
                                  cx,
                                  cy,
                                  r: isSelected ? 5.5 : 4.5,
                                  fill: "var(--bg-primary, #12151a)",
                                  stroke: node.color,
                                  strokeWidth: isSelected ? 2.5 : 2,
                                  strokeDasharray: "2 2"
                                },
                                node.commit.hash
                              );
                            }
                            if (node.commit.isStash) {
                              return /* @__PURE__ */ jsx(
                                "rect",
                                {
                                  x: cx - (isSelected ? 5 : 4),
                                  y: cy - (isSelected ? 5 : 4),
                                  width: isSelected ? 10 : 8,
                                  height: isSelected ? 10 : 8,
                                  rx: 2,
                                  fill: "var(--bg-primary, #12151a)",
                                  stroke: node.color,
                                  strokeWidth: isSelected ? 2.5 : 2
                                },
                                node.commit.hash
                              );
                            }
                            if (node.isMerge) {
                              return /* @__PURE__ */ jsxs("g", { children: [
                                /* @__PURE__ */ jsx(
                                  "circle",
                                  {
                                    cx,
                                    cy,
                                    r: isSelected ? 5.5 : 4.5,
                                    fill: "var(--bg-primary, #12151a)",
                                    stroke: isSelected ? "#ffffff" : node.color,
                                    strokeWidth: isSelected ? 2.5 : 2
                                  }
                                ),
                                /* @__PURE__ */ jsx("circle", { cx, cy, r: 2, fill: node.color })
                              ] }, node.commit.hash);
                            }
                            return /* @__PURE__ */ jsx(
                              "circle",
                              {
                                cx,
                                cy,
                                r: isSelected ? 5.5 : node.commit.isHead ? 5 : 4,
                                fill: node.color,
                                stroke: isSelected || node.commit.isHead ? "#ffffff" : "var(--bg-primary, #12151a)",
                                strokeWidth: isSelected ? 2 : node.commit.isHead ? 1.5 : 1
                              },
                              node.commit.hash
                            );
                          })
                        ]
                      }
                    ),
                    layout.nodes.map((node) => {
                      const { commit } = node;
                      const isSelected = selectedHash === commit.hash;
                      const isCompared = compareWithHash === commit.hash;
                      const isMatch = findQuery.trim().length > 0 && matchingCommitIndices.includes(node.row);
                      const isMuted = globalSettings.muteNonAncestors && !node.isAncestorOfHead || globalSettings.muteMergeCommits && node.isMerge;
                      const displayDate = globalSettings.dateType === "commit" ? commit.commitDate : commit.authorDate;
                      return /* @__PURE__ */ jsxs(react_default.Fragment, { children: [
                        /* @__PURE__ */ jsxs(
                          "div",
                          {
                            className: [
                              "gg-commit-row",
                              isSelected ? "selected" : "",
                              isCompared ? "compared" : "",
                              isMuted ? "muted" : "",
                              isMatch ? "search-match" : "",
                              commit.isUncommitted ? "uncommitted" : ""
                            ].filter(Boolean).join(" "),
                            onClick: (e) => {
                              if ((e.ctrlKey || e.metaKey) && selectedHash && selectedHash !== commit.hash) {
                                setCompareWithHash(commit.hash);
                              } else {
                                setSelectedHash(
                                  (prev) => prev === commit.hash && !compareWithHash ? null : commit.hash
                                );
                                setCompareWithHash(null);
                              }
                            },
                            onContextMenu: (e) => {
                              e.preventDefault();
                              if (commit.isUncommitted) {
                                setContextMenu({
                                  kind: "uncommitted",
                                  commit,
                                  x: e.clientX,
                                  y: e.clientY
                                });
                              } else if (commit.isStash && commit.stashSelector) {
                                setContextMenu({
                                  kind: "stash",
                                  commit,
                                  selector: commit.stashSelector,
                                  x: e.clientX,
                                  y: e.clientY
                                });
                              } else {
                                setContextMenu({
                                  kind: "commit",
                                  commit,
                                  x: e.clientX,
                                  y: e.clientY
                                });
                              }
                            },
                            "data-testid": `gg-commit-row-${commit.abbreviatedHash}`,
                            children: [
                              /* @__PURE__ */ jsx(
                                "div",
                                {
                                  className: "gg-graph-spacer",
                                  style: {
                                    width: `${graphColumnWidth}px`,
                                    minWidth: `${graphColumnWidth}px`,
                                    maxWidth: `${graphColumnWidth}px`,
                                    flex: `0 0 ${graphColumnWidth}px`,
                                    boxSizing: "border-box"
                                  }
                                }
                              ),
                              /* @__PURE__ */ jsxs(
                                "div",
                                {
                                  className: "gg-commit-desc",
                                  style: {
                                    ...colWidths.description !== void 0 ? {
                                      width: `${colWidths.description}px`,
                                      minWidth: `${colWidths.description}px`,
                                      maxWidth: `${colWidths.description}px`,
                                      flex: `0 0 ${colWidths.description}px`
                                    } : {
                                      flex: "1 1 0px",
                                      minWidth: "150px"
                                    },
                                    padding: "0 8px",
                                    boxSizing: "border-box"
                                  },
                                  children: [
                                    commit.refs.map((ref, rIdx) => renderRefBadge(commit, ref, rIdx)),
                                    /* @__PURE__ */ jsx("span", { className: "gg-commit-subject", children: renderCommitSubject(commit.subject) })
                                  ]
                                }
                              ),
                              /* @__PURE__ */ jsx(
                                "div",
                                {
                                  className: "gg-commit-date",
                                  style: {
                                    width: `${colWidths.date}px`,
                                    minWidth: `${colWidths.date}px`,
                                    maxWidth: `${colWidths.date}px`,
                                    flex: `0 0 ${colWidths.date}px`,
                                    padding: "0 6px",
                                    boxSizing: "border-box"
                                  },
                                  children: commit.isUncommitted ? "Working Tree" : formatCommitTimestamp(displayDate, globalSettings.dateFormat)
                                }
                              ),
                              /* @__PURE__ */ jsx(
                                "div",
                                {
                                  className: "gg-commit-author",
                                  style: {
                                    width: `${colWidths.author}px`,
                                    minWidth: `${colWidths.author}px`,
                                    maxWidth: `${colWidths.author}px`,
                                    flex: `0 0 ${colWidths.author}px`,
                                    padding: "0 6px",
                                    boxSizing: "border-box"
                                  },
                                  title: commit.authorEmail,
                                  children: commit.authorName
                                }
                              ),
                              /* @__PURE__ */ jsx(
                                "div",
                                {
                                  className: "gg-commit-hash",
                                  style: {
                                    width: `${colWidths.commit}px`,
                                    minWidth: `${colWidths.commit}px`,
                                    maxWidth: `${colWidths.commit}px`,
                                    flex: `0 0 ${colWidths.commit}px`,
                                    textAlign: "right",
                                    padding: "0 6px",
                                    boxSizing: "border-box"
                                  },
                                  children: commit.abbreviatedHash
                                }
                              )
                            ]
                          }
                        ),
                        isInlineDetails && detailsOpen && (!compareWithHash && isSelected || compareWithHash && isCompared) && /* @__PURE__ */ jsx(
                          "div",
                          {
                            ref: inlineDetailsRef,
                            className: "gg-inline-details-wrapper",
                            style: {
                              marginLeft: `${inlineMarginLeft}px`,
                              width: inlineWidth !== void 0 ? `${inlineWidth}px` : void 0,
                              maxWidth: inlineWidth !== void 0 ? `${inlineWidth}px` : "100%",
                              marginBottom: "8px",
                              boxSizing: "border-box"
                            },
                            children: /* @__PURE__ */ jsx(
                              CommitDetailsPane,
                              {
                                mode: compareWithHash ? "comparison" : "single",
                                details: commitDetails,
                                comparison,
                                loading: loadingDetails,
                                inline: true,
                                fileViewType: globalSettings.fileViewType,
                                compactFolders: globalSettings.compactFolders,
                                diffViewMode: globalSettings.diffViewMode,
                                dateFormat: globalSettings.dateFormat,
                                issueRules: repoSettings.issueLinkingRules,
                                codeReview,
                                selectedFilePath,
                                fileDiff,
                                loadingDiff,
                                fileContent,
                                loadingContent,
                                onSelectFile: (f) => void handleSelectFile(f),
                                onLoadFileContent: (fp) => void handleLoadFileContent(fp),
                                onChangeFileViewType: (vt) => void handleUpdateGlobalSettings({ fileViewType: vt }),
                                onToggleCompactFolders: () => void handleUpdateGlobalSettings({
                                  compactFolders: !globalSettings.compactFolders
                                }),
                                onChangeDiffViewMode: (dm) => void handleUpdateGlobalSettings({ diffViewMode: dm }),
                                onStartCodeReview: () => void handleStartCodeReview(),
                                onToggleReviewedFile: (fp, rev) => void handleToggleReviewedFile(fp, rev),
                                onEndCodeReview: () => void handleEndCodeReview(),
                                onSelectParentHash: (hash) => {
                                  setSelectedHash(hash);
                                  setCompareWithHash(null);
                                  const idx = commits.findIndex((c) => c.hash === hash);
                                  if (idx >= 0) scrollToRow(idx);
                                },
                                onAskAgent: (fp) => {
                                  const fromHash = compareWithHash ? selectedHash : null;
                                  const toHash = compareWithHash ?? selectedHash ?? "*";
                                  void handleAskAgent({
                                    commitHash: toHash,
                                    fromHash: fromHash ?? void 0,
                                    filePath: fp
                                  });
                                },
                                onCopyText: handleCopyText,
                                onClose: () => {
                                  setSelectedHash(null);
                                  setCompareWithHash(null);
                                }
                              }
                            )
                          }
                        )
                      ] }, commit.hash);
                    })
                  ] }),
                  graphData?.hasMore && /* @__PURE__ */ jsx("div", { className: "gg-load-more-row", children: /* @__PURE__ */ jsxs(
                    "button",
                    {
                      type: "button",
                      className: "gg-btn",
                      onClick: () => {
                        const nextMax = maxCommits + (globalSettings.loadMoreCommits || 100);
                        setMaxCommits(nextMax);
                        void loadReposAndGraph(selectedRepoRelPath, nextMax);
                      },
                      "data-testid": "gg-load-more-btn",
                      children: [
                        "Load ",
                        globalSettings.loadMoreCommits || 100,
                        " More Commits"
                      ]
                    }
                  ) })
                ]
              }
            )
          ] }),
          !isInlineDetails && detailsOpen && /* @__PURE__ */ jsx(
            CommitDetailsPane,
            {
              mode: compareWithHash ? "comparison" : "single",
              details: commitDetails,
              comparison,
              loading: loadingDetails,
              inline: false,
              fileViewType: globalSettings.fileViewType,
              compactFolders: globalSettings.compactFolders,
              diffViewMode: globalSettings.diffViewMode,
              dateFormat: globalSettings.dateFormat,
              issueRules: repoSettings.issueLinkingRules,
              codeReview,
              selectedFilePath,
              fileDiff,
              loadingDiff,
              fileContent,
              loadingContent,
              onSelectFile: (f) => void handleSelectFile(f),
              onLoadFileContent: (fp) => void handleLoadFileContent(fp),
              onChangeFileViewType: (vt) => void handleUpdateGlobalSettings({ fileViewType: vt }),
              onToggleCompactFolders: () => void handleUpdateGlobalSettings({
                compactFolders: !globalSettings.compactFolders
              }),
              onChangeDiffViewMode: (dm) => void handleUpdateGlobalSettings({ diffViewMode: dm }),
              onStartCodeReview: () => void handleStartCodeReview(),
              onToggleReviewedFile: (fp, rev) => void handleToggleReviewedFile(fp, rev),
              onEndCodeReview: () => void handleEndCodeReview(),
              onSelectParentHash: (hash) => {
                setSelectedHash(hash);
                setCompareWithHash(null);
                const idx = commits.findIndex((c) => c.hash === hash);
                if (idx >= 0) scrollToRow(idx);
              },
              onAskAgent: (fp) => {
                const fromHash = compareWithHash ? selectedHash : null;
                const toHash = compareWithHash ?? selectedHash ?? "*";
                void handleAskAgent({
                  commitHash: toHash,
                  fromHash: fromHash ?? void 0,
                  filePath: fp
                });
              },
              onCopyText: handleCopyText,
              onClose: () => {
                setSelectedHash(null);
                setCompareWithHash(null);
              }
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          ContextMenuOverlay,
          {
            target: contextMenu,
            currentBranch: graphData?.currentBranch ?? null,
            hasCommits: commits.some((c) => !c.isUncommitted),
            onClose: () => setContextMenu(null),
            onRunAction: (action) => void handleRunGitAction(action),
            onOpenDialog: (dialog) => setActiveDialog(dialog),
            onOpenPullRequest: (branch) => void handleOpenPullRequest(branch),
            onViewTagDetails: (tag) => void handleViewTagDetails(tag),
            onCopyText: handleCopyText,
            onAskAgent: (commitHash, filePath) => {
              void handleAskAgent({ commitHash, filePath });
            }
          }
        ),
        /* @__PURE__ */ jsx(
          GitActionDialogModal,
          {
            dialog: activeDialog,
            remotes: graphData?.remotes ?? [],
            currentBranch: graphData?.currentBranch ?? null,
            onClose: () => setActiveDialog(null),
            onRunAction: (action) => void handleRunGitAction(action)
          }
        ),
        /* @__PURE__ */ jsx(
          RepoSettingsWidget,
          {
            open: settingsOpen,
            remotes: graphData?.remotes ?? [],
            repoSettings,
            globalSettings,
            onClose: () => setSettingsOpen(false),
            onRunGitAction: (action) => void handleRunGitAction(action),
            onUpdateRepoSettings: (patch) => void handleUpdateRepoSettings(patch),
            onUpdateGlobalSettings: (patch) => void handleUpdateGlobalSettings(patch),
            onExportRepoConfig: async () => {
              try {
                const res = await rpc.call("exportRepoConfig", {
                  projectId,
                  subRepoRelPath: selectedRepoRelPath
                });
                setBanner({
                  kind: "info",
                  text: `Exported repository config to ${res.filePath}`
                });
              } catch (err) {
                setBanner({
                  kind: "error",
                  text: err instanceof Error ? err.message : String(err)
                });
              }
            }
          }
        )
      ]
    }
  );
}

// app.tsx
var STYLE_ELEMENT_ID = "zcc-ext-git-tree-styles";
function ensureStylesInjected() {
  if (typeof document === "undefined") return;
  if (document.getElementById(STYLE_ELEMENT_ID)) return;
  const styleEl = document.createElement("style");
  styleEl.id = STYLE_ELEMENT_ID;
  styleEl.textContent = GIT_GRAPH_STYLES;
  document.head.appendChild(styleEl);
}
var app_default = definePluginApp((app) => {
  ensureStylesInjected();
  app.slots.projectTab({
    id: "git-tree",
    label: "Git Tree",
    icon: "GitBranch",
    order: 40,
    global: false,
    header: "custom",
    detachable: true,
    component: GitTreeProjectTab,
    detachedPlaceholder: GitTreeDetachedPlaceholder
  });
  app.slots.commandPaletteAction({
    id: "open-git-tree",
    title: "Git Tree: View Git Tree",
    isAvailable: (ctx) => Boolean(ctx.projectId),
    run: (ctx) => {
      if (ctx.projectId) {
        ctx.toProject(ctx.projectId, { tabId: "git-tree" });
      }
    }
  });
});
export {
  app_default as default
};
//# sourceMappingURL=app.js.map
