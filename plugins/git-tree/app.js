function ct(){return globalThis.__ZCC_PLUGIN_RUNTIME__??{}}function Mt(i){throw new Error(`${i} is not available until the host plugin runtime is installed`)}function Dt(i){return{__zccPluginApp:!0,setup:i}}function Et(){return ct().useRpc?.()??Mt("useRpc")}function bt(i,r){ct().useRealtime?.(i,r)}function zt(){return ct().useZccContext?.()??{projectId:null,threadId:null}}function Lt(){return ct().useZccNavigate?.()??Mt("useZccNavigate")}var $t=`
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
`;var j=globalThis.__ZCC_HOST_REACT__,ve=j,zn=j.Children,Ln=j.Component,$n=j.Fragment,_n=j.StrictMode,Fn=j.Suspense,jn=j.cloneElement,Gn=j.createContext,Hn=j.createElement,Bn=j.createRef,Wn=j.forwardRef,On=j.isValidElement,Vn=j.lazy,Un=j.memo,qn=j.startTransition,q=j.useCallback,Zn=j.useContext,Yn=j.useDebugValue,Kn=j.useDeferredValue,ce=j.useEffect,Jn=j.useId,Xn=j.useImperativeHandle,Qn=j.useInsertionEffect,_t=j.useLayoutEffect,pe=j.useMemo,eo=j.useReducer,Q=j.useRef,w=j.useState,to=j.useSyncExternalStore,no=j.useTransition,oo=j.version;var Ft=["#0085d9","#d9008f","#00d90a","#d98500","#a300d9","#ff0000","#00d9cc","#e138e8","#85d900","#dc5b23","#6f24d6","#ffcc00"];function jt(i,r,o=Ft){let g=o.length>0?o:Ft,u=new Map;i.forEach((A,m)=>u.set(A.hash,m));let k=new Set;if(r&&u.has(r)){let A=[r];for(k.add(r);A.length>0;){let m=A.shift(),L=u.get(m);if(L!==void 0)for(let S of i[L].parents)k.has(S)||(k.add(S),u.has(S)&&A.push(S))}}let l=[],f=[],c=[],C=0,b=0,P=()=>{let A=g[C%g.length];return C+=1,A},s=A=>{let m=l.findIndex(S=>S===null);if(m>=0)return l[m]=A,m>b&&(b=m),m;let L=l.length;return l.push(A),L>b&&(b=L),L};for(let A=0;A<i.length;A++){let m=i[A],L=[];for(let O=0;O<l.length;O++)l[O]?.targetHash===m.hash&&L.push(O);let S,N;if(L.length>0){S=L[0],N=m.isUncommitted?"#8a94a6":l[S].color;for(let O of L){let ee=l[O];c.push({fromRow:ee.fromRow,fromLane:ee.fromLane,toRow:A,toLane:S,color:ee.color,isUncommitted:ee.isUncommitted}),l[O]=null}}else N=m.isUncommitted?"#8a94a6":P(),S=s({targetHash:m.hash,color:N,fromRow:A,fromLane:0,isUncommitted:m.isUncommitted}),l[S]=null;f.push({commit:m,row:A,lane:S,color:N,isAncestorOfHead:m.isUncommitted||(r?k.has(m.hash):!0),isMerge:m.parents.length>1}),m.parents.filter(O=>u.has(O)).forEach((O,ee)=>{if(ee===0)l[S]={targetHash:O,color:m.isUncommitted?P():N,fromRow:A,fromLane:S,isUncommitted:m.isUncommitted};else{let ue=l.findIndex(G=>G?.targetHash===O),me=ue>=0?l[ue].color:P();s({targetHash:O,color:me,fromRow:A,fromLane:S})}})}return{nodes:f,segments:c,maxLane:b}}function Gt(i){let{segment:r,rowHeight:o,laneWidth:g,padX:u,style:k,expandedRow:l=-1,detailsHeight:f=0}=i,c=m=>l>=0&&f>0&&m>l?m*o+f+o/2:m*o+o/2,C=u+r.fromLane*g,b=c(r.fromRow),P=u+r.toLane*g,s=c(r.toRow);if(C===P)return`M ${C} ${b} L ${P} ${s}`;if(k==="angular"){let m=b+o*.5;return m>=s?`M ${C} ${b} L ${P} ${s}`:`M ${C} ${b} L ${C} ${m} L ${P} ${s}`}if(r.toRow-r.fromRow<=1){if(l>=0&&f>0&&r.fromRow<=l&&r.toRow>l){let S=b+o,N=b+o*.45,h=S-o*.45;return`M ${C} ${b} C ${C} ${N}, ${P} ${h}, ${P} ${S} L ${P} ${s}`}let m=b+o*.5,L=s-o*.5;return`M ${C} ${b} C ${C} ${m}, ${P} ${L}, ${P} ${s}`}if(r.toLane>r.fromLane){let m=b+o,L=b+o*.45,S=m-o*.45;return`M ${C} ${b} C ${C} ${L}, ${P} ${S}, ${P} ${m} L ${P} ${s}`}else{let m=s-o,L=m+o*.45,S=s-o*.45;return`M ${C} ${b} L ${C} ${m} C ${C} ${L}, ${P} ${S}, ${P} ${s}`}}var bn={":art:":"\u{1F3A8}",":zap:":"\u26A1",":fire:":"\u{1F525}",":bug:":"\u{1F41B}",":ambulance:":"\u{1F691}\uFE0F",":sparkles:":"\u2728",":memo:":"\u{1F4DD}",":rocket:":"\u{1F680}",":lipstick:":"\u{1F484}",":tada:":"\u{1F389}",":white_check_mark:":"\u2705",":lock:":"\u{1F512}\uFE0F",":bookmark:":"\u{1F516}",":rotating_light:":"\u{1F6A8}",":construction:":"\u{1F6A7}",":green_heart:":"\u{1F49A}",":arrow_down:":"\u2B07\uFE0F",":arrow_up:":"\u2B06\uFE0F",":pushpin:":"\u{1F4CC}",":construction_worker:":"\u{1F477}",":chart_with_upwards_trend:":"\u{1F4C8}",":recycle:":"\u267B\uFE0F",":heavy_plus_sign:":"\u2795",":heavy_minus_sign:":"\u2796",":wrench:":"\u{1F527}",":hammer:":"\u{1F528}",":globe_with_meridians:":"\u{1F310}",":pencil2:":"\u270F\uFE0F",":rewind:":"\u23EA\uFE0F",":twisted_rightwards_arrows:":"\u{1F500}",":package:":"\u{1F4E6}\uFE0F",":alien:":"\u{1F47D}\uFE0F",":truck:":"\u{1F69A}",":page_facing_up:":"\u{1F4C4}",":boom:":"\u{1F4A5}",":bento:":"\u{1F371}",":wheelchair:":"\u267F\uFE0F",":bulb:":"\u{1F4A1}",":speech_balloon:":"\u{1F4AC}",":card_file_box:":"\u{1F5C3}\uFE0F",":loud_sound:":"\u{1F50A}",":mute:":"\u{1F507}",":Coffin:":"\u26B0\uFE0F",":test_tube:":"\u{1F9EA}",":necktie:":"\u{1F454}",":stethoscope:":"\u{1FA7A}",":bricks:":"\u{1F9F1}"};function fn(i){return i.replace(/:[a-z0-9_+-]+:/gi,r=>{let o=r.toLowerCase();return bn[o]??r})}function dt(i,r=[]){let o=fn(i),g=[],u=/(`[^`]+`|https?:\/\/[^\s)]+)/g,k=0,l,f=c=>{if(c){if(r.length===0){g.push({kind:"text",text:c});return}for(let C of r)try{let b=new RegExp(C.pattern,"g"),P=0,s,A=[];for(;(s=b.exec(c))!==null;){s.index>P&&A.push({kind:"text",text:c.slice(P,s.index)});let m=C.urlTemplate;if(s.forEach((L,S)=>{L!==void 0&&(m=m.replace(new RegExp(`\\$${S}`,"g"),L))}),A.push({kind:"link",text:s[0],href:m}),P=s.index+s[0].length,s[0].length===0)break}if(A.length>0){P<c.length&&A.push({kind:"text",text:c.slice(P)}),g.push(...A);return}}catch{}g.push({kind:"text",text:c})}};for(;(l=u.exec(o))!==null;){l.index>k&&f(o.slice(k,l.index));let c=l[0];c.startsWith("`")&&c.endsWith("`")?g.push({kind:"code",text:c.slice(1,-1)}):g.push({kind:"link",text:c,href:c}),k=l.index+c.length}return k<o.length&&f(o.slice(k)),g.length>0?g:[{kind:"text",text:o}]}function Ht(i,r){let o={name:"",path:"",kind:"folder",children:[]};for(let u of i){let k=u.newPath.split("/").filter(Boolean),l=o,f="";for(let c=0;c<k.length;c++){let C=k[c];if(f=f?`${f}/${C}`:C,c===k.length-1)l.children.push({name:C,path:u.newPath,kind:"file",children:[],fileChange:u});else{let P=l.children.find(s=>s.kind==="folder"&&s.name===C);P||(P={name:C,path:f,kind:"folder",children:[]},l.children.push(P)),l=P}}}function g(u){return u.map(l=>{if(l.kind==="file")return l;let f={...l,children:g(l.children)};for(;r&&f.children.length===1&&f.children[0].kind==="folder";){let c=f.children[0];f={name:`${f.name}/${c.name}`,path:c.path,kind:"folder",children:c.children}}return f}).sort((l,f)=>l.kind!==f.kind?l.kind==="folder"?-1:1:l.name.localeCompare(f.name))}return g(o.children)}function Bt(i){let r=[],o=0,g=i.lines;for(;o<g.length;){let u=g[o];if(u.type==="context"){r.push({leftLineNumber:u.oldLineNumber,leftContent:u.content,leftType:"context",rightLineNumber:u.newLineNumber,rightContent:u.content,rightType:"context"}),o+=1;continue}if(u.type==="meta"){r.push({leftLineNumber:null,leftContent:u.content,leftType:"meta",rightLineNumber:null,rightContent:u.content,rightType:"meta"}),o+=1;continue}let k=[],l=[];for(;o<g.length&&g[o].type==="del";)k.push(g[o]),o+=1;for(;o<g.length&&g[o].type==="add";)l.push(g[o]),o+=1;let f=Math.max(k.length,l.length);for(let c=0;c<f;c++){let C=k[c],b=l[c];r.push({leftLineNumber:C?C.oldLineNumber:null,leftContent:C?C.content:"",leftType:C?"del":"empty",rightLineNumber:b?b.newLineNumber:null,rightContent:b?b.content:"",rightType:b?"add":"empty"})}}return r}function nt(i,r,o=Date.now()){if(!i)return"";let g=new Date(i*1e3);if(r==="iso")return g.toISOString().slice(0,16).replace("T"," ");if(r==="datetime")return g.toLocaleString();let u=Math.max(0,Math.floor((o-i*1e3)/1e3));if(u<60)return"just now";let k=Math.floor(u/60);if(k<60)return`${k}m ago`;let l=Math.floor(k/60);if(l<24)return`${l}h ago`;let f=Math.floor(l/24);if(f<30)return`${f}d ago`;let c=Math.floor(f/30);return c<12?`${c}mo ago`:`${Math.floor(f/365)}y ago`}var Wt=globalThis.__ZCC_HOST_REACT__,_=Wt.Fragment;function e(i,r,o){return Wt.createElement(i,o===void 0?r:{...r,key:o})}var t=e;function Ot(i){let[r,o]=w(!1),[g,u]=w(""),{repos:k,selectedRepoRelPath:l,onSelectRepo:f,branches:c,remoteBranches:C,repoSettings:b,globalSettings:P,onUpdateRepoSettings:s,onUpdateGlobalSettings:A,onFetch:m,onScrollToHead:L,onToggleFind:S,findOpen:N,onOpenRepoSettings:h,onRefresh:O,projects:ee,selectedProjectId:ue,onSelectProject:me,loading:G,headerActions:I}=i,U=b.selectedBranches,D=U.length===0,oe=[...c,...b.showRemoteBranches?C.map(T=>`remotes/${T}`):[]].filter(T=>!g.trim()||T.toLowerCase().includes(g.trim().toLowerCase())),Re=T=>{let J=new Set(U);J.has(T)?J.delete(T):J.add(T),s({selectedBranches:[...J]})};return t("header",{className:"gg-control-bar git-graph-toolbar",role:"toolbar","aria-label":"Git Tree controls",children:[t("div",{className:"git-graph-toolbar-left",children:[e("span",{className:"git-graph-title",children:"\u2442 Git Tree"}),ee&&ee.length>1&&t("label",{style:{display:"inline-flex",alignItems:"center",gap:4},children:[e("span",{style:{color:"var(--text-muted)",fontSize:11},children:"Project:"}),e("select",{"aria-label":"Select project",className:"gg-select git-graph-select",value:ue,onChange:T=>me?.(T.target.value),children:ee.map(T=>e("option",{value:T.id,children:T.name},T.id))})]}),k.length>1&&t("label",{style:{display:"inline-flex",alignItems:"center",gap:4},children:[e("span",{style:{color:"var(--text-muted)",fontSize:11},children:"Repo:"}),e("select",{"aria-label":"Select repository",className:"gg-select git-graph-select",value:l,onChange:T=>f(T.target.value),children:k.map(T=>t("option",{value:T.relPath,children:[T.label," ",T.currentBranch?`(${T.currentBranch})`:""]},T.relPath||"root"))})]}),t("div",{style:{position:"relative",zIndex:r?100:1},children:[e("button",{type:"button",className:`gg-btn git-graph-btn ${D?"":"git-graph-btn--active"}`,"aria-label":"Filter branches","aria-expanded":r,onClick:()=>o(T=>!T),"data-testid":"gg-branches-filter-btn",children:t("span",{children:["\u2442 Branches:"," ",D?"Show All":U.length===1?U[0]:`${U.length} selected`," \u25BE"]})}),r&&t(_,{children:[e("div",{style:{position:"fixed",inset:0,zIndex:99},onClick:()=>o(!1)}),t("div",{className:"gg-popover git-graph-popover",style:{zIndex:100},role:"dialog","aria-label":"Branch filter","data-testid":"gg-branches-popover",children:[t("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center"},children:[e("strong",{style:{fontSize:12},children:"Filter Branches"}),e("button",{type:"button",className:"gg-btn git-graph-btn",onClick:()=>o(!1),children:"Close"})]}),e("input",{type:"search",className:"git-graph-input",placeholder:"Filter branch list...",value:g,onChange:T=>u(T.target.value)}),t("label",{className:"git-graph-checkbox-row",children:[e("input",{type:"checkbox",checked:D,onChange:()=>s({selectedBranches:[]})}),e("span",{children:"Show All Branches"})]}),t("label",{className:"git-graph-checkbox-row",children:[e("input",{type:"checkbox",checked:b.showRemoteBranches,onChange:T=>s({showRemoteBranches:T.target.checked})}),e("span",{children:"Show Remote Branches"})]}),t("label",{className:"git-graph-checkbox-row",children:[e("input",{type:"checkbox",checked:b.showTags,onChange:T=>s({showTags:T.target.checked})}),e("span",{children:"Show Tags"})]}),t("label",{className:"git-graph-checkbox-row",children:[e("input",{type:"checkbox",checked:b.showStashes,onChange:T=>s({showStashes:T.target.checked})}),e("span",{children:"Show Stashes"})]}),t("label",{className:"git-graph-checkbox-row",children:[e("input",{type:"checkbox",checked:b.onlyFollowFirstParent,onChange:T=>s({onlyFollowFirstParent:T.target.checked})}),e("span",{children:"Only Follow First Parent"})]}),e("div",{className:"git-graph-context-sep"}),e("div",{style:{maxHeight:160,overflowY:"auto",display:"flex",flexDirection:"column",gap:4},children:oe.map(T=>t("label",{className:"git-graph-checkbox-row",children:[e("input",{type:"checkbox",checked:U.includes(T),onChange:()=>Re(T)}),e("span",{style:{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:T})]},T))})]})]})]}),t("select",{"aria-label":"Commit ordering",className:"gg-select git-graph-select",value:b.commitOrdering,onChange:T=>s({commitOrdering:T.target.value}),title:"Commit order",children:[e("option",{value:"date",children:"Order: Commit Date"}),e("option",{value:"author-date",children:"Order: Author Date"}),e("option",{value:"topo",children:"Order: Topological"})]}),t("button",{type:"button",className:"gg-btn git-graph-btn",title:"Toggle rounded or angular graph lines",onClick:()=>A({graphStyle:P.graphStyle==="rounded"?"angular":"rounded"}),children:["Style: ",P.graphStyle==="rounded"?"Rounded":"Angular"]}),t("button",{type:"button",className:"gg-btn git-graph-btn",title:"Toggle Commit Details location (Docked split vs Inline row)",onClick:()=>A({commitDetailsLocation:P.commitDetailsLocation==="docked"?"inline":"docked"}),children:["Details: ",P.commitDetailsLocation==="docked"?"Docked":"Inline"]})]}),t("div",{className:"git-graph-toolbar-right",children:[e("button",{type:"button",className:"gg-btn git-graph-btn",onClick:m,disabled:G,title:"Fetch from Remote(s)",children:"\u2B07 Fetch"}),e("button",{type:"button",className:"gg-btn git-graph-btn",onClick:L,title:"Scroll to HEAD (Ctrl/Cmd+H)",children:"\u2316 HEAD"}),e("button",{type:"button",className:`gg-btn git-graph-btn ${N?"git-graph-btn--active active":""}`,onClick:S,title:"Find commits, branches, or tags (Ctrl/Cmd+F)","data-testid":"gg-find-btn",children:"\u{1F50D} Find"}),e("button",{type:"button",className:"gg-btn git-graph-btn",onClick:h,title:"Repository Settings (Remotes, Issue Linking, Pull Requests)","data-testid":"gg-repo-settings-btn",children:"\u2699 Settings"}),t("button",{type:"button",className:"gg-btn git-graph-btn",onClick:O,disabled:G,title:"Refresh Git Tree (Ctrl/Cmd+R)",children:["\u21BB ",G?"Loading\u2026":"Refresh"]}),I]})]})}function Vt(i){let{query:r,onChangeQuery:o,matchCount:g,activeMatchIndex:u,onPrev:k,onNext:l,onClose:f}=i;return t("div",{className:"git-graph-find-bar",role:"search","aria-label":"Find in Git Tree","data-testid":"gg-find-widget",children:[e("input",{type:"search",className:"git-graph-input","aria-label":"Find commits",placeholder:"Find commit, hash, author, branch, tag...",value:r,autoFocus:!0,onChange:c=>o(c.target.value),onKeyDown:c=>{c.key==="Enter"?(c.preventDefault(),c.shiftKey?k():l()):c.key==="Escape"&&(c.preventDefault(),f())},style:{width:230},"data-testid":"gg-find-input"}),e("span",{style:{fontSize:11,color:"var(--text-muted)",minWidth:52,textAlign:"center"},children:r.trim()?g>0?`${u+1} / ${g}`:"0 / 0":""}),e("button",{type:"button",className:"git-graph-btn",disabled:g===0,onClick:k,title:"Previous match (Shift+Enter)","data-testid":"gg-find-prev",children:"\u2191"}),e("button",{type:"button",className:"git-graph-btn",disabled:g===0,onClick:l,title:"Next match (Enter)","data-testid":"gg-find-next",children:"\u2193"}),e("button",{type:"button",className:"git-graph-btn",onClick:f,"aria-label":"Close find widget",children:"\u2715"})]})}var Ut="zcc.gitTree.commitDetailsFilesWidth",qt="zcc.gitTree.commitDetailsFilesHeight",gt="zcc.gitTree.commitDetailsHeight",ft="zcc.gitTree.commitDetailsWidth",xt=200,pt=100,Zt=260,xn=320;function Yt(i){try{if(typeof localStorage>"u")return null;let r=Number(localStorage.getItem(i));return Number.isFinite(r)&&r>0?r:null}catch{return null}}function ye(i,r){try{if(typeof localStorage>"u")return;r===null?localStorage.removeItem(i):localStorage.setItem(i,String(r))}catch{}}function Kt(i,r){if(!i.length)return 290;let o=0;for(let g of i){let u=r==="list"?g.oldPath!==g.newPath?`${g.oldPath} \u2192 ${g.newPath}`:g.newPath:g.newPath.split("/").pop()||g.newPath;u.length>o&&(o=u.length)}return Math.max(260,Math.min(650,Math.round(o*7.8+120)))}function vt({mode:i,details:r,comparison:o,loading:g,inline:u,fileViewType:k,compactFolders:l,diffViewMode:f,dateFormat:c,issueRules:C,codeReview:b,selectedFilePath:P,fileDiff:s,loadingDiff:A,fileContent:m,loadingContent:L,onSelectFile:S,onLoadFileContent:N,onChangeFileViewType:h,onToggleCompactFolders:O,onChangeDiffViewMode:ee,onStartCodeReview:ue,onToggleReviewedFile:me,onEndCodeReview:G,onSelectParentHash:I,onAskAgent:U,onCopyText:D,onClose:oe}){let[Re,T]=w({}),[J,Fe]=w("diff"),Ae=Q(null),Te=Q(null),Pe=Q(null),he=Q(null),te=pe(()=>i==="comparison"?o?.fileChanges??[]:r?.fileChanges??[],[i,r,o]),we=i==="comparison"?`${o?.fromHash??""}..${o?.toHash??""}`:r?.hash??"",[be,Ie]=w(()=>Yt(gt)),[ke,qe]=w(()=>Yt(ft)),[Ce,je]=w(!1),[Ze,Ge]=w(!1),[Ne,Me]=w(()=>Kt(te,k)),[De,Ye]=w(!1),[Ee,He]=w(()=>{let d=te.length*28+48;return Math.min(260,Math.max(pt,d))}),Be=Q(we);ce(()=>{Be.current!==we&&(Be.current=we,Ge(!1),Ye(!1))},[we]);let ie=Q(null),ze=Q(null),ae=Q(null),Ke=Q(null);ce(()=>()=>{ie.current?.(),ze.current?.(),ae.current?.(),Ke.current?.(),document.body.style.cursor="",document.body.style.userSelect=""},[]),ce(()=>{let d=Pe.current;if(!d)return;let M=()=>{d&&d.clientWidth>0&&je(d.clientWidth<=640)};if(M(),window.addEventListener("resize",M),typeof ResizeObserver<"u"){let x=new ResizeObserver(M);return x.observe(d),()=>{window.removeEventListener("resize",M),x.disconnect()}}return()=>window.removeEventListener("resize",M)},[]),_t(()=>{if(te.length===0)return;let d=()=>{let x=he.current,R=Pe.current;if(!(!x||!R))if(Ce){if(De)return;let $=R.clientHeight>0?R.clientHeight:500,z=Math.floor($*.5),v=0,Y=x.querySelectorAll(".gg-file-row, .gg-folder-row");Y.length>0?(Y.forEach(xe=>{v+=(xe.offsetHeight||26)+2}),v+=8):v=te.length*26+8;let K=Math.max(x.scrollHeight+48,v+48),W=K>z?z:Math.max(pt,K),ne=Math.max(pt,Math.min(Math.floor($*.8),W));He(ne)}else{if(Ze)return;let $=0;x.querySelectorAll(".gg-file-row, .gg-folder-row").forEach(W=>{let ne=W.querySelector(".gg-file-path");if(ne){let xe=Math.max(0,ne.scrollWidth-ne.clientWidth),et=W.offsetWidth+xe;et>$&&($=et)}else W.scrollWidth>$&&($=W.scrollWidth)});let v=$>0?$+24:0;v<=0&&(v=Kt(te,k));let Y=R.clientWidth>0?Math.floor(R.clientWidth*.6):650,K=Math.max(xt,Math.min(Math.max(xt,Y),v));Me(K)}};d();let M=requestAnimationFrame(d);return()=>cancelAnimationFrame(M)},[te,k,l,Ze,De,Ce]);let ot=d=>{d.preventDefault(),document.body.style.cursor="row-resize",document.body.style.userSelect="none";let M=d.clientY,x=Ee,R=x,$=Y=>{let K=Y.clientY-M,W=Pe.current,ne=W&&W.clientHeight>0?W.clientHeight:600,xe=Math.floor(ne*.8);R=Math.max(pt,Math.min(xe,Math.round(x+K))),He(R),Ye(!0)},z=()=>{document.body.style.cursor="",document.body.style.userSelect="",window.removeEventListener("mousemove",$),window.removeEventListener("mouseup",v),ze.current=null},v=()=>{z(),ye(qt,R)};ze.current=z,window.addEventListener("mousemove",$),window.addEventListener("mouseup",v)},We=()=>{Ye(!1),ye(qt,null)},it=d=>{d.preventDefault(),document.body.style.cursor="col-resize",document.body.style.userSelect="none";let M=d.clientX,x=Ne,R=x,$=Y=>{let K=Y.clientX-M,W=Pe.current,ne=W&&W.clientWidth>0?Math.floor(W.clientWidth*.75):800;R=Math.max(xt,Math.min(ne,Math.round(x+K))),Me(R),Ge(!0)},z=()=>{document.body.style.cursor="",document.body.style.userSelect="",window.removeEventListener("mousemove",$),window.removeEventListener("mouseup",v),ie.current=null},v=()=>{z(),ye(Ut,R)};ie.current=z,window.addEventListener("mousemove",$),window.addEventListener("mouseup",v)},Je=()=>{Ge(!1),ye(Ut,null)},Xe=d=>{d.preventDefault(),document.body.style.cursor="row-resize",document.body.style.userSelect="none";let M=d.clientY,x=Te.current?.offsetHeight??(be||480),R=x,$=Y=>{let K=M-Y.clientY,W=typeof window<"u"?Math.round(window.innerHeight*.88):900;R=Math.max(Zt,Math.min(W,Math.round(x+K))),Ie(R)},z=()=>{document.body.style.cursor="",document.body.style.userSelect="",window.removeEventListener("mousemove",$),window.removeEventListener("mouseup",v),ae.current=null},v=()=>{z(),ye(gt,R)};ae.current=z,window.addEventListener("mousemove",$),window.addEventListener("mouseup",v)},X=d=>{d.preventDefault(),document.body.style.cursor="row-resize",document.body.style.userSelect="none";let M=d.clientY,x=Te.current?.offsetHeight??(be||480),R=x,$=Y=>{let K=Y.clientY-M,W=typeof window<"u"?Math.round(window.innerHeight*.88):900;R=Math.max(Zt,Math.min(W,Math.round(x+K))),Ie(R)},z=()=>{document.body.style.cursor="",document.body.style.userSelect="",window.removeEventListener("mousemove",$),window.removeEventListener("mouseup",v),ae.current=null},v=()=>{z(),ye(gt,R)};ae.current=z,window.addEventListener("mousemove",$),window.addEventListener("mouseup",v)},Qe=()=>{Ie(null),ye(gt,null)},Oe=d=>{d.preventDefault(),document.body.style.cursor="col-resize",document.body.style.userSelect="none";let M=d.clientX,x=Te.current?.offsetWidth??(ke||500),R=x,$=Y=>{let K=M-Y.clientX,W=typeof window<"u"?Math.round(window.innerWidth*.8):1e3;R=Math.max(xn,Math.min(W,Math.round(x+K))),qe(R)},z=()=>{document.body.style.cursor="",document.body.style.userSelect="",window.removeEventListener("mousemove",$),window.removeEventListener("mouseup",v),Ke.current=null},v=()=>{z(),ye(ft,R)};Ke.current=z,window.addEventListener("mousemove",$),window.addEventListener("mouseup",v)},Ve=()=>{qe(null),ye(ft,null)},B=pe(()=>{let d={};return be&&(d.height=`${be}px`,d.maxHeight="88vh"),!u&&ke&&(d.width=`${ke}px`,d.maxWidth="80%"),Object.keys(d).length>0?d:void 0},[u,be,ke]);ce(()=>{P&&Ae.current&&Ae.current?.scrollIntoView?.({behavior:"smooth",block:"nearest"})},[P]);let fe=pe(()=>Ht(te,l),[te,l]),E=pe(()=>new Set(b?.reviewedFiles??[]),[b]),Le=d=>{T(M=>({...M,[d]:!M[d]}))},$e=d=>dt(d,C).map((x,R)=>x.kind==="code"?e("code",{children:x.text},R):x.kind==="link"&&x.href?e("a",{href:x.href,target:"_blank",rel:"noreferrer",children:x.text},R):e(ve.Fragment,{children:x.text},R)),re=(d,M,x=0)=>{let R=P===d.newPath,$=E.has(d.newPath);return t("div",{className:`gg-file-row ${R?"selected":""}`,style:{paddingLeft:`${12+x*14}px`},onClick:()=>{S(d),J==="source"&&N?.(d.newPath)},"data-testid":`gg-file-row-${d.newPath}`,children:[b&&e("input",{type:"checkbox",checked:$,onClick:z=>z.stopPropagation(),onChange:z=>me(d.newPath,z.target.checked),title:"Mark file as reviewed"}),e("span",{className:`gg-file-status gg-file-status-${d.status}`,children:d.status}),t("span",{className:"gg-file-path",style:{textDecoration:$?"line-through":void 0,opacity:$?.65:1},title:d.oldPath!==d.newPath?`${d.oldPath} \u2192 ${d.newPath}`:d.newPath,children:[M,d.staged!==void 0&&t("span",{style:{opacity:.6,marginLeft:"6px",fontSize:"10px"},children:["(",d.staged?"staged":"unstaged",")"]})]}),t("span",{className:"gg-file-stat",children:[d.additions!==null&&d.additions>0&&t("span",{className:"gg-stat-add",children:["+",d.additions]}),d.deletions!==null&&d.deletions>0&&t("span",{className:"gg-stat-del",children:["-",d.deletions]})]}),e("button",{type:"button",className:"gg-btn gg-btn-icon",style:{padding:"1px 4px",fontSize:"10px"},title:"Copy File Path",onClick:z=>{z.stopPropagation(),D(d.newPath,"File path")},children:"\u{1F4CB}"})]},`${d.newPath}:${d.staged?"staged":"work"}`)},se=(d,M=0)=>d.map(x=>{if(x.kind==="file"&&x.fileChange)return re(x.fileChange,x.name,M);let R=!!Re[x.path];return t(ve.Fragment,{children:[t("div",{className:"gg-folder-row",style:{paddingLeft:`${12+M*14}px`},onClick:()=>Le(x.path),children:[e("span",{children:R?"\u25B8":"\u25BE"}),t("span",{children:["\u{1F4C1} ",x.name]})]}),!R&&se(x.children,M+1)]},`folder:${x.path}`)});return t("div",{ref:Te,className:`gg-details-pane ${u?"gg-details-inline inline":""}`,style:B,"data-testid":"gg-details-pane",children:[e("div",{className:"gg-details-top-resizer",onMouseDown:Xe,onDoubleClick:Qe,title:"Drag to resize height \xB7 Double-click to reset","data-testid":"gg-details-top-resizer"}),u&&e("div",{className:"gg-details-bottom-resizer",onMouseDown:X,onDoubleClick:Qe,title:"Drag to resize height \xB7 Double-click to reset","data-testid":"gg-details-bottom-resizer"}),!u&&e("div",{className:"gg-details-left-resizer",onMouseDown:Oe,onDoubleClick:Ve,title:"Drag to resize pane width \xB7 Double-click to reset","data-testid":"gg-details-left-resizer"}),t("div",{className:"gg-details-header",children:[e("div",{className:"gg-details-header-title",children:i==="comparison"&&o?t(_,{children:[e("span",{children:"Comparing"}),e("span",{className:"gg-commit-hash",style:{width:"auto"},children:o.fromHash.slice(0,7)}),e("span",{children:"\u2194"}),e("span",{className:"gg-commit-hash",style:{width:"auto"},children:o.toHash.slice(0,7)})]}):r?t(_,{children:[e("span",{children:r.hash==="*"?"Uncommitted Changes":`Commit ${r.abbreviatedHash}`}),r.signature&&t("span",{className:"gg-ref-badge gg-ref-tag",title:r.signature.signer||r.signature.label,children:["\u{1F512} ",r.signature.label]})]}):e("span",{children:"Commit Details"})}),t("div",{style:{display:"flex",alignItems:"center",gap:"4px",flexShrink:0},children:[e("button",{type:"button",className:"gg-btn gg-btn-primary",onClick:()=>U(P??void 0),title:"Spawn a Zana Agent thread with this commit and diff context","data-testid":"gg-ask-agent-btn",children:"\u2728 Ask Agent"}),b?t("button",{type:"button",className:"gg-btn",onClick:G,title:"End Code Review","data-testid":"gg-end-review-btn",children:["\u2713 End Review (",E.size,"/",te.length,")"]}):e("button",{type:"button",className:"gg-btn",onClick:ue,title:"Start Persistent Code Review","data-testid":"gg-start-review-btn",children:"\u{1F441} Code Review"}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:oe,title:"Close Details (Esc)","data-testid":"gg-close-details-btn",children:"\u2715"})]})]}),g?e("div",{className:"gg-empty",children:"Loading commit details\u2026"}):t("div",{className:"gg-details-body",children:[i==="single"&&r&&r.hash!=="*"&&t("div",{className:"gg-details-meta",children:[t("div",{className:"gg-details-meta-grid",children:[e("span",{className:"gg-details-meta-label",children:"Commit:"}),t("span",{children:[e("code",{children:r.hash})," ",e("button",{type:"button",className:"gg-btn gg-btn-icon",style:{padding:"0 4px",fontSize:"10px"},onClick:()=>D(r.hash,"Commit hash"),children:"Copy"})]}),e("span",{className:"gg-details-meta-label",children:"Parents:"}),e("span",{children:r.parents.length===0?"None (root commit)":r.parents.map((d,M)=>t(ve.Fragment,{children:[M>0&&", ",e("span",{className:"gg-parent-link",onClick:()=>I(d),children:d.slice(0,8)})]},d))}),e("span",{className:"gg-details-meta-label",children:"Author:"}),t("span",{children:[r.authorName," <",r.authorEmail,"> (",nt(r.authorDate,c),")"]}),e("span",{className:"gg-details-meta-label",children:"Committer:"}),t("span",{children:[r.committerName," <",r.committerEmail,"> (",nt(r.commitDate,c),")"]})]}),t("div",{className:"gg-details-message",children:[e("strong",{children:$e(r.subject)}),r.body?`

${r.body}`:""]})]}),t("div",{ref:Pe,className:`gg-details-columns ${Ce?"stacked":"side-by-side"}`,"data-testid":"gg-details-columns",children:[t("div",{className:"gg-details-col-files",style:Ce?{height:`${Ee}px`,flexBasis:`${Ee}px`,width:"100%"}:{width:`${Ne}px`,flexBasis:`${Ne}px`},children:[t("div",{className:"gg-files-toolbar",children:[t("span",{children:["Changed Files (",te.length,")",b?` \u2022 Reviewed ${E.size}/${te.length}`:""]}),t("div",{style:{display:"flex",gap:"4px"},children:[e("button",{type:"button",className:`gg-btn ${k==="tree"?"gg-btn-active":""}`,style:{padding:"2px 6px",fontSize:"11px"},onClick:()=>h("tree"),"data-testid":"gg-view-tree-btn",children:"Tree"}),e("button",{type:"button",className:`gg-btn ${k==="list"?"gg-btn-active":""}`,style:{padding:"2px 6px",fontSize:"11px"},onClick:()=>h("list"),"data-testid":"gg-view-list-btn",children:"List"}),k==="tree"&&e("button",{type:"button",className:`gg-btn ${l?"gg-btn-active":""}`,style:{padding:"2px 6px",fontSize:"11px"},onClick:O,title:"Compact single-child folders",children:"Compact"})]})]}),e("div",{ref:he,className:"gg-file-list","data-testid":"gg-file-list",children:te.length===0?e("div",{className:"gg-empty",style:{padding:"12px"},children:"No file changes in this commit."}):k==="tree"?se(fe):te.map(d=>re(d,d.oldPath!==d.newPath?`${d.oldPath} \u2192 ${d.newPath}`:d.newPath,0))})]}),Ce?e("div",{className:"gg-details-row-resizer",onMouseDown:ot,onDoubleClick:We,title:"Drag to resize \xB7 Double-click to auto-split","data-testid":"gg-details-row-resizer"}):e("div",{className:"gg-details-col-resizer",onMouseDown:it,onDoubleClick:Je,title:"Drag to resize column \xB7 Double-click to auto-fit","data-testid":"gg-details-col-resizer"}),e("div",{className:"gg-details-col-diff",children:P?t("div",{className:"gg-diff-viewer","data-testid":"gg-diff-viewer",ref:Ae,children:[t("div",{className:"gg-diff-toolbar",children:[e("span",{style:{fontFamily:"var(--font-mono, monospace)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontWeight:600},title:P,children:P}),t("div",{style:{display:"flex",gap:"4px",alignItems:"center"},children:[e("button",{type:"button",className:`gg-btn ${J==="diff"?"gg-btn-active":""}`,style:{padding:"2px 8px",fontSize:"11px"},onClick:()=>Fe("diff"),"data-testid":"gg-view-diff-btn",title:"View diff changes",children:"Diff"}),e("button",{type:"button",className:`gg-btn ${J==="source"?"gg-btn-active":""}`,style:{padding:"2px 8px",fontSize:"11px"},onClick:()=>{Fe("source"),P&&!m&&N?.(P)},"data-testid":"gg-view-source-btn",title:"View full source code",children:"Source Code"}),J==="diff"&&t(_,{children:[e("button",{type:"button",className:`gg-btn ${f==="unified"?"gg-btn-active":""}`,style:{padding:"2px 6px",fontSize:"11px"},onClick:()=>ee("unified"),"data-testid":"gg-diff-unified-btn",children:"Unified"}),e("button",{type:"button",className:`gg-btn ${f==="split"?"gg-btn-active":""}`,style:{padding:"2px 6px",fontSize:"11px"},onClick:()=>ee("split"),"data-testid":"gg-diff-split-btn",children:"Split"})]}),e("button",{type:"button",className:"gg-btn gg-btn-icon",style:{padding:"2px 6px",fontSize:"11px"},title:J==="source"?"Copy file content":"Copy diff",onClick:()=>D(J==="source"?m?.content??"":s?.rawDiff??"",J==="source"?"Source code":"Diff"),children:"\u{1F4CB}"})]})]}),e("div",{className:"gg-diff-content-scroll",children:J==="source"?L?e("div",{className:"gg-empty",style:{padding:"16px"},children:"Loading source code\u2026"}):m?m.isBinary?e("div",{className:"gg-empty",style:{padding:"16px"},children:"Binary file \u2014 cannot display text content."}):e("table",{className:"gg-source-table","data-testid":"gg-source-code-table",children:e("tbody",{children:m.content.split(/\r?\n/).map((d,M)=>t("tr",{className:"gg-source-line",children:[e("td",{className:"gg-diff-gutter",children:M+1}),e("td",{className:"gg-diff-code",children:d||" "})]},M))})}):e("div",{className:"gg-empty",style:{padding:"16px"},children:"No source code available for this file."}):A?e("div",{className:"gg-empty",style:{padding:"16px"},children:"Loading diff\u2026"}):s?s.isBinary?e("div",{className:"gg-empty",style:{padding:"16px"},children:"Binary file changed \u2014 inline text diff not available."}):s.hunks.length===0?e("div",{className:"gg-empty",style:{padding:"16px"},children:"No textual diff hunks (empty file or mode-only change)."}):f==="unified"?e("table",{className:"gg-diff-table","data-testid":"gg-diff-unified-table",children:e("tbody",{children:s.hunks.map((d,M)=>t(ve.Fragment,{children:[e("tr",{className:"gg-diff-hunk-header",children:e("td",{colSpan:3,className:"gg-diff-code",children:d.header})}),d.lines.map((x,R)=>t("tr",{className:x.type==="add"?"gg-diff-line-add":x.type==="del"?"gg-diff-line-del":"",children:[e("td",{className:"gg-diff-gutter",children:x.oldLineNumber??""}),e("td",{className:"gg-diff-gutter",children:x.newLineNumber??""}),e("td",{className:"gg-diff-code",children:x.type==="add"?`+${x.content}`:x.type==="del"?`-${x.content}`:` ${x.content}`})]},`${M}-${R}`))]},M))})}):e("table",{className:"gg-diff-table","data-testid":"gg-diff-split-table",children:e("tbody",{children:s.hunks.map((d,M)=>{let x=Bt(d);return t(ve.Fragment,{children:[e("tr",{className:"gg-diff-hunk-header",children:e("td",{colSpan:4,className:"gg-diff-code",children:d.header})}),x.map((R,$)=>t("tr",{children:[e("td",{className:`gg-diff-gutter ${R.leftType==="del"?"gg-diff-line-del":""}`,children:R.leftLineNumber??""}),e("td",{className:`gg-diff-code ${R.leftType==="del"?"gg-diff-line-del":""}`,style:{width:"50%"},children:R.leftContent}),e("td",{className:`gg-diff-gutter ${R.rightType==="add"?"gg-diff-line-add":""}`,children:R.rightLineNumber??""}),e("td",{className:`gg-diff-code ${R.rightType==="add"?"gg-diff-line-add":""}`,style:{width:"50%"},children:R.rightContent})]},`${M}-${$}`))]},M)})})}):e("div",{className:"gg-empty",style:{padding:"16px"},children:"Select a file to inspect its diff."})})]}):e("div",{className:"gg-empty",style:{height:"100%",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px"},children:"Select a file from the list to inspect changes."})})]})]})]})}function Jt({target:i,currentBranch:r,onClose:o,onRunAction:g,onOpenDialog:u,onOpenPullRequest:k,onViewTagDetails:l,onCopyText:f}){if(!i)return null;let c={left:`${Math.min(i.x,window.innerWidth-220)}px`,top:`${Math.min(i.y,window.innerHeight-320)}px`};return e("div",{style:{position:"fixed",inset:0,zIndex:99},onClick:o,onContextMenu:C=>{C.preventDefault(),o()},children:t("div",{className:"gg-context-menu",style:c,onClick:C=>C.stopPropagation(),"data-testid":"gg-context-menu",children:[i.kind==="branch"&&t(_,{children:[t("div",{className:"gg-context-menu-header",children:["Branch: ",i.ref.name]}),i.ref.name!==r&&e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{o(),g({kind:"checkout-branch",branchName:i.ref.name})},children:"Checkout Branch"}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{o(),u({kind:"rename-branch",branchName:i.ref.name})},children:"Rename Branch\u2026"}),i.ref.name!==r&&t(_,{children:[e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{o(),u({kind:"merge-branch",branchName:i.ref.name})},children:"Merge into Current Branch\u2026"}),t("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{o(),u({kind:"rebase-branch",ontoBranch:i.ref.name})},children:["Rebase Current Branch onto ",i.ref.name,"\u2026"]})]}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{o(),u({kind:"push-branch",branchName:i.ref.name})},children:"Push Branch\u2026"}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{o(),u({kind:"pull-branch",branchName:i.ref.name})},children:"Pull into Branch\u2026"}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{o(),k(i.ref.name)},children:"Create Pull Request\u2026"}),e("div",{className:"gg-context-menu-sep"}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{o(),f(i.ref.name,"Branch name")},children:"Copy Branch Name"}),i.ref.name!==r&&e("button",{type:"button",className:"gg-context-menu-item danger",onClick:()=>{o(),u({kind:"delete-branch",branchName:i.ref.name})},children:"Delete Branch\u2026"})]}),i.kind==="remote-branch"&&t(_,{children:[t("div",{className:"gg-context-menu-header",children:["Remote Branch: ",i.ref.remote,"/",i.ref.name]}),t("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{o(),g({kind:"checkout-branch",branchName:i.ref.name,createAndTrackFrom:`${i.ref.remote}/${i.ref.name}`})},children:["Checkout Branch (Track ",i.ref.remote,"/",i.ref.name,")"]}),t("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{o(),g({kind:"fetch-into-local-branch",remote:i.ref.remote||"origin",remoteBranch:i.ref.name,localBranch:i.ref.name,force:!1})},children:["Fetch into Local Branch (",i.ref.name,")"]}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{o(),u({kind:"merge-branch",branchName:`${i.ref.remote}/${i.ref.name}`})},children:"Merge into Current Branch\u2026"}),e("div",{className:"gg-context-menu-sep"}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{o(),f(`${i.ref.remote}/${i.ref.name}`,"Remote branch name")},children:"Copy Remote Branch Name"}),e("button",{type:"button",className:"gg-context-menu-item danger",onClick:()=>{o(),g({kind:"delete-remote-branch",remote:i.ref.remote||"origin",branchName:i.ref.name})},children:"Delete Remote Branch"})]}),i.kind==="tag"&&t(_,{children:[t("div",{className:"gg-context-menu-header",children:["Tag: ",i.ref.name]}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{o(),l(i.ref.name)},children:"View Tag Details"}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{o(),g({kind:"push-tag",tagName:i.ref.name,remote:"origin"})},children:"Push Tag to origin"}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{o(),f(i.ref.name,"Tag name")},children:"Copy Tag Name"}),e("div",{className:"gg-context-menu-sep"}),e("button",{type:"button",className:"gg-context-menu-item danger",onClick:()=>{o(),g({kind:"delete-tag",tagName:i.ref.name,deleteFromRemote:null})},children:"Delete Tag"})]}),i.kind==="stash"&&t(_,{children:[t("div",{className:"gg-context-menu-header",children:["Stash: ",i.selector]}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{o(),g({kind:"stash-apply",selector:i.selector,reinstateIndex:!1})},children:"Apply Stash"}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{o(),g({kind:"stash-pop",selector:i.selector,reinstateIndex:!1})},children:"Pop Stash"}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{o(),u({kind:"stash-branch",selector:i.selector})},children:"Create Branch from Stash\u2026"}),e("div",{className:"gg-context-menu-sep"}),e("button",{type:"button",className:"gg-context-menu-item danger",onClick:()=>{o(),g({kind:"stash-drop",selector:i.selector})},children:"Drop Stash"})]}),i.kind==="uncommitted"&&t(_,{children:[e("div",{className:"gg-context-menu-header",children:"Uncommitted Changes"}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{o(),u({kind:"stash-push"})},children:"Stash Uncommitted Changes\u2026"}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{o(),u({kind:"ask-agent",commitHash:"*"})},children:"\u2728 Ask Agent to Review Working Tree\u2026"}),e("div",{className:"gg-context-menu-sep"}),e("button",{type:"button",className:"gg-context-menu-item danger",onClick:()=>{o(),g({kind:"reset-uncommitted",mode:"hard"})},children:"Reset Working Tree (Hard)"}),e("button",{type:"button",className:"gg-context-menu-item danger",onClick:()=>{o(),u({kind:"clean-untracked"})},children:"Clean Untracked Files\u2026"})]}),i.kind==="commit"&&t(_,{children:[t("div",{className:"gg-context-menu-header",children:["Commit: ",i.commit.abbreviatedHash]}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{o(),u({kind:"create-branch",commit:i.commit})},children:"Create Branch\u2026"}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{o(),u({kind:"add-tag",commit:i.commit})},children:"Add Tag\u2026"}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{o(),g({kind:"checkout-commit",commitHash:i.commit.hash})},children:"Checkout Commit (Detached HEAD)"}),e("div",{className:"gg-context-menu-sep"}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{o(),u({kind:"cherry-pick",commit:i.commit})},children:"Cherry-Pick Commit\u2026"}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{o(),u({kind:"revert-commit",commit:i.commit})},children:"Revert Commit\u2026"}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{o(),u({kind:"reset-commit",commit:i.commit,defaultMode:"mixed"})},children:"Reset Current Branch to Here\u2026"}),e("button",{type:"button",className:"gg-context-menu-item danger",onClick:()=>{o(),u({kind:"drop-commit",commit:i.commit})},children:"Drop Commit\u2026"}),e("div",{className:"gg-context-menu-sep"}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{o(),u({kind:"ask-agent",commitHash:i.commit.hash})},children:"\u2728 Ask Agent about Commit\u2026"}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{o(),f(i.commit.hash,"Commit hash")},children:"Copy Commit Hash"}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{o(),f(i.commit.subject,"Commit subject")},children:"Copy Commit Subject"})]})]})})}function Xt({dialog:i,remotes:r,onClose:o,onRunAction:g,onAskAgentSubmit:u}){let k=r[0]?.name??"origin",[l,f]=w(""),[c,C]=w(""),[b,P]=w(!0),[s,A]=w(!1),[m,L]=w(!1),[S,N]=w("mixed");return i?e("div",{className:"gg-modal-backdrop",onClick:o,children:t("div",{className:"gg-modal",onClick:h=>h.stopPropagation(),"data-testid":`gg-dialog-${i.kind}`,children:[i.kind==="create-branch"&&t(_,{children:[t("div",{className:"gg-modal-header",children:[t("span",{children:["Create Branch at ",i.commit.abbreviatedHash]}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:o,children:"\u2715"})]}),t("div",{className:"gg-modal-body",children:[t("div",{className:"gg-field",children:[e("label",{className:"gg-field-label",children:"Branch Name"}),e("input",{type:"text",className:"gg-input",placeholder:"feature/my-branch",value:l,onChange:h=>f(h.target.value),autoFocus:!0})]}),t("label",{className:"gg-checkbox-row",children:[e("input",{type:"checkbox",checked:b,onChange:h=>P(h.target.checked)}),e("span",{children:"Check out branch after creation"})]})]}),t("div",{className:"gg-modal-footer",children:[e("button",{type:"button",className:"gg-btn",onClick:o,children:"Cancel"}),e("button",{type:"button",className:"gg-btn gg-btn-primary",disabled:!l.trim(),onClick:()=>{g({kind:"create-branch",branchName:l.trim(),startPoint:i.commit.hash,checkout:b}),o()},children:"Create Branch"})]})]}),i.kind==="rename-branch"&&t(_,{children:[t("div",{className:"gg-modal-header",children:[t("span",{children:["Rename Branch ",i.branchName]}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:o,children:"\u2715"})]}),e("div",{className:"gg-modal-body",children:t("div",{className:"gg-field",children:[e("label",{className:"gg-field-label",children:"New Branch Name"}),e("input",{type:"text",className:"gg-input",value:l,placeholder:i.branchName,onChange:h=>f(h.target.value),autoFocus:!0})]})}),t("div",{className:"gg-modal-footer",children:[e("button",{type:"button",className:"gg-btn",onClick:o,children:"Cancel"}),e("button",{type:"button",className:"gg-btn gg-btn-primary",disabled:!l.trim(),onClick:()=>{g({kind:"rename-branch",oldName:i.branchName,newName:l.trim()}),o()},children:"Rename"})]})]}),i.kind==="delete-branch"&&t(_,{children:[t("div",{className:"gg-modal-header",children:[t("span",{children:["Delete Branch ",i.branchName]}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:o,children:"\u2715"})]}),e("div",{className:"gg-modal-body",children:t("label",{className:"gg-checkbox-row",children:[e("input",{type:"checkbox",checked:s,onChange:h=>A(h.target.checked)}),e("span",{children:"Force delete (-D) even if unmerged"})]})}),t("div",{className:"gg-modal-footer",children:[e("button",{type:"button",className:"gg-btn",onClick:o,children:"Cancel"}),e("button",{type:"button",className:"gg-btn gg-btn-primary",onClick:()=>{g({kind:"delete-branch",branchName:i.branchName,force:s}),o()},children:"Delete Branch"})]})]}),i.kind==="merge-branch"&&t(_,{children:[t("div",{className:"gg-modal-header",children:[t("span",{children:["Merge ",i.branchName," into Current Branch"]}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:o,children:"\u2715"})]}),t("div",{className:"gg-modal-body",children:[t("label",{className:"gg-checkbox-row",children:[e("input",{type:"checkbox",checked:s,onChange:h=>A(h.target.checked)}),e("span",{children:"Create a new commit even if fast-forward is possible (--no-ff)"})]}),t("label",{className:"gg-checkbox-row",children:[e("input",{type:"checkbox",checked:m,onChange:h=>L(h.target.checked)}),e("span",{children:"Squash commits (--squash)"})]})]}),t("div",{className:"gg-modal-footer",children:[e("button",{type:"button",className:"gg-btn",onClick:o,children:"Cancel"}),e("button",{type:"button",className:"gg-btn gg-btn-primary",onClick:()=>{g({kind:"merge",target:i.branchName,noFastForward:s,squash:m,noCommit:!1}),o()},children:"Merge"})]})]}),i.kind==="rebase-branch"&&t(_,{children:[t("div",{className:"gg-modal-header",children:[t("span",{children:["Rebase Current Branch onto ",i.ontoBranch]}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:o,children:"\u2715"})]}),e("div",{className:"gg-modal-body",children:t("label",{className:"gg-checkbox-row",children:[e("input",{type:"checkbox",checked:b,onChange:h=>P(h.target.checked)}),e("span",{children:"Auto-stash uncommitted changes before rebase (--autostash)"})]})}),t("div",{className:"gg-modal-footer",children:[e("button",{type:"button",className:"gg-btn",onClick:o,children:"Cancel"}),e("button",{type:"button",className:"gg-btn gg-btn-primary",onClick:()=>{g({kind:"rebase",onto:i.ontoBranch,autostash:b}),o()},children:"Rebase"})]})]}),i.kind==="push-branch"&&t(_,{children:[t("div",{className:"gg-modal-header",children:[t("span",{children:["Push Branch ",i.branchName]}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:o,children:"\u2715"})]}),t("div",{className:"gg-modal-body",children:[t("div",{className:"gg-field",children:[e("label",{className:"gg-field-label",children:"Remote"}),e("input",{type:"text",className:"gg-input",value:l||k,onChange:h=>f(h.target.value)})]}),t("label",{className:"gg-checkbox-row",children:[e("input",{type:"checkbox",checked:b,onChange:h=>P(h.target.checked)}),e("span",{children:"Set upstream (-u)"})]}),t("label",{className:"gg-checkbox-row",children:[e("input",{type:"checkbox",checked:s,onChange:h=>A(h.target.checked)}),e("span",{children:"Force with lease (--force-with-lease)"})]})]}),t("div",{className:"gg-modal-footer",children:[e("button",{type:"button",className:"gg-btn",onClick:o,children:"Cancel"}),e("button",{type:"button",className:"gg-btn gg-btn-primary",onClick:()=>{g({kind:"push-branch",branchName:i.branchName,remote:(l||k).trim(),setUpstream:b,forceMode:s?"force-with-lease":"none"}),o()},children:"Push"})]})]}),i.kind==="pull-branch"&&t(_,{children:[t("div",{className:"gg-modal-header",children:[t("span",{children:["Pull Branch ",i.branchName]}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:o,children:"\u2715"})]}),t("div",{className:"gg-modal-body",children:[t("div",{className:"gg-field",children:[e("label",{className:"gg-field-label",children:"Remote"}),e("input",{type:"text",className:"gg-input",value:l||k,onChange:h=>f(h.target.value)})]}),t("label",{className:"gg-checkbox-row",children:[e("input",{type:"checkbox",checked:s,onChange:h=>A(h.target.checked)}),e("span",{children:"Rebase instead of merge (--rebase)"})]})]}),t("div",{className:"gg-modal-footer",children:[e("button",{type:"button",className:"gg-btn",onClick:o,children:"Cancel"}),e("button",{type:"button",className:"gg-btn gg-btn-primary",onClick:()=>{g({kind:"pull-branch",remote:(l||k).trim(),branchName:i.branchName,noFastForward:!1,squash:!1,rebase:s}),o()},children:"Pull"})]})]}),i.kind==="cherry-pick"&&t(_,{children:[t("div",{className:"gg-modal-header",children:[t("span",{children:["Cherry-Pick Commit ",i.commit.abbreviatedHash]}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:o,children:"\u2715"})]}),t("div",{className:"gg-modal-body",children:[t("label",{className:"gg-checkbox-row",children:[e("input",{type:"checkbox",checked:b,onChange:h=>P(h.target.checked)}),e("span",{children:"Record origin commit hash in message (-x)"})]}),t("label",{className:"gg-checkbox-row",children:[e("input",{type:"checkbox",checked:s,onChange:h=>A(h.target.checked)}),e("span",{children:"Stage changes without committing (--no-commit)"})]})]}),t("div",{className:"gg-modal-footer",children:[e("button",{type:"button",className:"gg-btn",onClick:o,children:"Cancel"}),e("button",{type:"button",className:"gg-btn gg-btn-primary",onClick:()=>{g({kind:"cherry-pick",commitHash:i.commit.hash,parentIndex:i.commit.parents.length>1?1:void 0,recordOrigin:b,noCommit:s}),o()},children:"Cherry-Pick"})]})]}),i.kind==="revert-commit"&&t(_,{children:[t("div",{className:"gg-modal-header",children:[t("span",{children:["Revert Commit ",i.commit.abbreviatedHash]}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:o,children:"\u2715"})]}),e("div",{className:"gg-modal-body",children:t("label",{className:"gg-checkbox-row",children:[e("input",{type:"checkbox",checked:s,onChange:h=>A(h.target.checked)}),e("span",{children:"Stage revert changes without committing (--no-commit)"})]})}),t("div",{className:"gg-modal-footer",children:[e("button",{type:"button",className:"gg-btn",onClick:o,children:"Cancel"}),e("button",{type:"button",className:"gg-btn gg-btn-primary",onClick:()=>{g({kind:"revert-commit",commitHash:i.commit.hash,parentIndex:i.commit.parents.length>1?1:void 0,noCommit:s}),o()},children:"Revert"})]})]}),i.kind==="reset-commit"&&t(_,{children:[t("div",{className:"gg-modal-header",children:[t("span",{children:["Reset Current Branch to ",i.commit.abbreviatedHash]}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:o,children:"\u2715"})]}),e("div",{className:"gg-modal-body",children:t("div",{className:"gg-field",children:[e("label",{className:"gg-field-label",children:"Reset Mode"}),t("select",{className:"gg-select",value:S,onChange:h=>N(h.target.value),children:[e("option",{value:"soft",children:"Soft \u2014 Keep all changes staged"}),e("option",{value:"mixed",children:"Mixed \u2014 Keep working tree, unstage index"}),e("option",{value:"hard",children:"Hard \u2014 Discard all uncommitted changes"})]})]})}),t("div",{className:"gg-modal-footer",children:[e("button",{type:"button",className:"gg-btn",onClick:o,children:"Cancel"}),t("button",{type:"button",className:"gg-btn gg-btn-primary",onClick:()=>{g({kind:"reset-to-commit",commitHash:i.commit.hash,mode:S}),o()},children:["Reset (",S,")"]})]})]}),i.kind==="drop-commit"&&t(_,{children:[t("div",{className:"gg-modal-header",children:[t("span",{children:["Drop Commit ",i.commit.abbreviatedHash,"?"]}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:o,children:"\u2715"})]}),e("div",{className:"gg-modal-body",children:t("p",{style:{margin:0,fontSize:"12px"},children:["This will rebase ",e("code",{children:"HEAD"})," onto the parent of"," ",e("code",{children:i.commit.abbreviatedHash}),", removing this commit from the current branch history."]})}),t("div",{className:"gg-modal-footer",children:[e("button",{type:"button",className:"gg-btn",onClick:o,children:"Cancel"}),e("button",{type:"button",className:"gg-btn gg-btn-primary",onClick:()=>{g({kind:"drop-commit",commitHash:i.commit.hash}),o()},children:"Drop Commit"})]})]}),i.kind==="add-tag"&&t(_,{children:[t("div",{className:"gg-modal-header",children:[t("span",{children:["Add Tag at ",i.commit.abbreviatedHash]}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:o,children:"\u2715"})]}),t("div",{className:"gg-modal-body",children:[t("div",{className:"gg-field",children:[e("label",{className:"gg-field-label",children:"Tag Name"}),e("input",{type:"text",className:"gg-input",placeholder:"v1.0.0",value:l,onChange:h=>f(h.target.value),autoFocus:!0})]}),t("label",{className:"gg-checkbox-row",children:[e("input",{type:"checkbox",checked:b,onChange:h=>P(h.target.checked)}),e("span",{children:"Annotated Tag (-a)"})]}),b&&t("div",{className:"gg-field",children:[e("label",{className:"gg-field-label",children:"Tag Message"}),e("input",{type:"text",className:"gg-input",placeholder:"Release v1.0.0",value:c,onChange:h=>C(h.target.value)})]}),t("label",{className:"gg-checkbox-row",children:[e("input",{type:"checkbox",checked:s,onChange:h=>A(h.target.checked)}),t("span",{children:["Push tag to ",k," immediately"]})]})]}),t("div",{className:"gg-modal-footer",children:[e("button",{type:"button",className:"gg-btn",onClick:o,children:"Cancel"}),e("button",{type:"button",className:"gg-btn gg-btn-primary",disabled:!l.trim(),onClick:()=>{g({kind:"create-tag",tagName:l.trim(),commitHash:i.commit.hash,annotated:b,message:c.trim()||l.trim(),pushToRemote:s?k:null}),o()},children:"Create Tag"})]})]}),i.kind==="tag-details"&&t(_,{children:[t("div",{className:"gg-modal-header",children:[t("span",{children:["Tag Details: ",i.tagName]}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:o,children:"\u2715"})]}),e("div",{className:"gg-modal-body",children:i.details?t("div",{className:"gg-details-meta-grid",children:[e("span",{className:"gg-details-meta-label",children:"Name:"}),e("span",{children:i.details.name}),e("span",{className:"gg-details-meta-label",children:"Type:"}),e("span",{children:i.details.isAnnotated?"Annotated":"Lightweight"}),e("span",{className:"gg-details-meta-label",children:"Target:"}),e("code",{children:i.details.hash}),i.details.taggerName&&t(_,{children:[e("span",{className:"gg-details-meta-label",children:"Tagger:"}),t("span",{children:[i.details.taggerName," <",i.details.taggerEmail,">"]})]}),i.details.message&&t(_,{children:[e("span",{className:"gg-details-meta-label",children:"Message:"}),e("span",{children:i.details.message})]})]}):e("div",{children:"Loading tag details\u2026"})}),e("div",{className:"gg-modal-footer",children:e("button",{type:"button",className:"gg-btn",onClick:o,children:"Close"})})]}),i.kind==="stash-push"&&t(_,{children:[t("div",{className:"gg-modal-header",children:[e("span",{children:"Stash Uncommitted Changes"}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:o,children:"\u2715"})]}),t("div",{className:"gg-modal-body",children:[t("div",{className:"gg-field",children:[e("label",{className:"gg-field-label",children:"Stash Message (optional)"}),e("input",{type:"text",className:"gg-input",placeholder:"WIP: feature changes",value:l,onChange:h=>f(h.target.value),autoFocus:!0})]}),t("label",{className:"gg-checkbox-row",children:[e("input",{type:"checkbox",checked:b,onChange:h=>P(h.target.checked)}),e("span",{children:"Include untracked files (-u)"})]})]}),t("div",{className:"gg-modal-footer",children:[e("button",{type:"button",className:"gg-btn",onClick:o,children:"Cancel"}),e("button",{type:"button",className:"gg-btn gg-btn-primary",onClick:()=>{g({kind:"stash-push",message:l.trim()||void 0,includeUntracked:b}),o()},children:"Stash Changes"})]})]}),i.kind==="stash-branch"&&t(_,{children:[t("div",{className:"gg-modal-header",children:[t("span",{children:["Create Branch from ",i.selector]}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:o,children:"\u2715"})]}),e("div",{className:"gg-modal-body",children:t("div",{className:"gg-field",children:[e("label",{className:"gg-field-label",children:"Branch Name"}),e("input",{type:"text",className:"gg-input",placeholder:"stash-recovery",value:l,onChange:h=>f(h.target.value),autoFocus:!0})]})}),t("div",{className:"gg-modal-footer",children:[e("button",{type:"button",className:"gg-btn",onClick:o,children:"Cancel"}),e("button",{type:"button",className:"gg-btn gg-btn-primary",disabled:!l.trim(),onClick:()=>{g({kind:"stash-branch",selector:i.selector,branchName:l.trim()}),o()},children:"Create Branch"})]})]}),i.kind==="clean-untracked"&&t(_,{children:[t("div",{className:"gg-modal-header",children:[e("span",{children:"Clean Untracked Files"}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:o,children:"\u2715"})]}),e("div",{className:"gg-modal-body",children:t("label",{className:"gg-checkbox-row",children:[e("input",{type:"checkbox",checked:b,onChange:h=>P(h.target.checked)}),e("span",{children:"Include untracked directories (-d)"})]})}),t("div",{className:"gg-modal-footer",children:[e("button",{type:"button",className:"gg-btn",onClick:o,children:"Cancel"}),e("button",{type:"button",className:"gg-btn gg-btn-primary",onClick:()=>{g({kind:"clean-untracked",includeDirectories:b}),o()},children:"Clean Files"})]})]}),i.kind==="ask-agent"&&t(_,{children:[t("div",{className:"gg-modal-header",children:[t("span",{children:["\u2728 Ask Zana Agent about"," ",i.commitHash==="*"?"Uncommitted Changes":`Commit ${i.commitHash.slice(0,8)}`]}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:o,children:"\u2715"})]}),t("div",{className:"gg-modal-body",children:[t("div",{className:"gg-field",children:[e("label",{className:"gg-field-label",children:"Instruction / Question for the Agent"}),e("input",{type:"text",className:"gg-input",placeholder:"Review this commit for regressions or explain the changes\u2026",value:l,onChange:h=>f(h.target.value),autoFocus:!0})]}),i.filePath&&t("div",{style:{fontSize:"11px",color:"var(--text-secondary)"},children:["Focused file: ",e("code",{children:i.filePath})]})]}),t("div",{className:"gg-modal-footer",children:[e("button",{type:"button",className:"gg-btn",onClick:o,children:"Cancel"}),e("button",{type:"button",className:"gg-btn gg-btn-primary",onClick:()=>{u(i.commitHash,i.filePath,l.trim()),o()},children:"Spawn Agent Thread"})]})]})]})}):null}function Qt({open:i,remotes:r,repoSettings:o,globalSettings:g,onClose:u,onRunGitAction:k,onUpdateRepoSettings:l,onUpdateGlobalSettings:f,onExportRepoConfig:c}){let[C,b]=w(""),[P,s]=w(""),[A,m]=w(""),[L,S]=w("");return i?e("div",{className:"gg-modal-backdrop",onClick:u,children:t("div",{className:"gg-modal",style:{width:"560px"},onClick:N=>N.stopPropagation(),"data-testid":"gg-repo-settings-modal",children:[t("div",{className:"gg-modal-header",children:[e("span",{children:"Repository & Graph Settings"}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:u,children:"\u2715"})]}),t("div",{className:"gg-modal-body",style:{gap:"16px"},children:[t("div",{className:"gg-field",children:[t("label",{className:"gg-field-label",children:["Git Remotes (",r.length,")"]}),t("div",{style:{display:"flex",flexDirection:"column",gap:"6px"},children:[r.map(N=>t("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"8px",padding:"6px 8px",background:"var(--bg-secondary, #0f1318)",borderRadius:"4px",border:"1px solid var(--border-color, #252b35)"},children:[t("div",{style:{overflow:"hidden"},children:[e("strong",{children:N.name}),e("div",{style:{fontSize:"11px",color:"var(--text-secondary)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"},children:N.fetchUrl})]}),t("div",{style:{display:"flex",gap:"4px",flexShrink:0},children:[e("button",{type:"button",className:"gg-btn",onClick:()=>k({kind:"remote-prune",name:N.name}),title:"Prune stale remote-tracking branches",children:"Prune"}),e("button",{type:"button",className:"gg-btn",onClick:()=>k({kind:"remote-delete",name:N.name}),title:"Remove Remote",children:"Delete"})]})]},N.name)),t("div",{style:{display:"flex",gap:"6px"},children:[e("input",{type:"text",className:"gg-input",style:{width:"110px"},placeholder:"upstream",value:C,onChange:N=>b(N.target.value)}),e("input",{type:"text",className:"gg-input",style:{flex:1},placeholder:"https://github.com/org/repo.git",value:P,onChange:N=>s(N.target.value)}),e("button",{type:"button",className:"gg-btn gg-btn-primary",disabled:!C.trim()||!P.trim(),onClick:()=>{k({kind:"remote-add",name:C.trim(),url:P.trim(),fetch:!0}),b(""),s("")},children:"Add Remote"})]})]})]}),t("div",{className:"gg-field",children:[e("label",{className:"gg-field-label",children:"Pull Request Creation"}),t("div",{style:{display:"flex",gap:"8px"},children:[t("select",{className:"gg-select",value:o.pullRequestConfig.provider,onChange:N=>l({pullRequestConfig:{...o.pullRequestConfig,provider:N.target.value}}),children:[e("option",{value:"github",children:"GitHub"}),e("option",{value:"gitlab",children:"GitLab"}),e("option",{value:"bitbucket",children:"Bitbucket"}),e("option",{value:"custom",children:"Custom URL Template"})]}),e("input",{type:"text",className:"gg-input",placeholder:"Remote (origin)",value:o.pullRequestConfig.remoteName,onChange:N=>l({pullRequestConfig:{...o.pullRequestConfig,remoteName:N.target.value}})}),e("input",{type:"text",className:"gg-input",placeholder:"Target branch (main)",value:o.pullRequestConfig.targetBranch,onChange:N=>l({pullRequestConfig:{...o.pullRequestConfig,targetBranch:N.target.value}})})]})]}),t("div",{className:"gg-field",children:[t("label",{className:"gg-field-label",children:["Issue Linking Rules (",o.issueLinkingRules.length,")"]}),t("div",{style:{display:"flex",flexDirection:"column",gap:"6px"},children:[o.issueLinkingRules.map(N=>t("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",gap:"8px",fontSize:"11px"},children:[t("code",{children:["/",N.pattern,"/ \u2192 ",N.urlTemplate]}),e("button",{type:"button",className:"gg-btn",onClick:()=>l({issueLinkingRules:o.issueLinkingRules.filter(h=>h.id!==N.id)}),children:"Remove"})]},N.id)),t("div",{style:{display:"flex",gap:"6px"},children:[e("input",{type:"text",className:"gg-input",style:{width:"150px"},placeholder:"#(\\d+)",value:A,onChange:N=>m(N.target.value)}),e("input",{type:"text",className:"gg-input",style:{flex:1},placeholder:"https://github.com/org/repo/issues/$1",value:L,onChange:N=>S(N.target.value)}),e("button",{type:"button",className:"gg-btn",disabled:!A.trim()||!L.trim(),onClick:()=>{let N={id:`rule-${Date.now()}`,pattern:A.trim(),urlTemplate:L.trim()};l({issueLinkingRules:[...o.issueLinkingRules,N]}),m(""),S("")},children:"Add Rule"})]})]})]}),t("div",{className:"gg-field",children:[e("label",{className:"gg-field-label",children:"Graph Display & Muting"}),t("label",{className:"gg-checkbox-row",children:[e("input",{type:"checkbox",checked:g.muteNonAncestors,onChange:N=>f({muteNonAncestors:N.target.checked})}),e("span",{children:"Dim commits that are not ancestors of HEAD"})]}),t("label",{className:"gg-checkbox-row",children:[e("input",{type:"checkbox",checked:g.muteMergeCommits,onChange:N=>f({muteMergeCommits:N.target.checked})}),e("span",{children:"Dim merge commits (commits with >1 parent)"})]}),t("div",{style:{display:"flex",gap:"8px",marginTop:"6px"},children:[t("select",{className:"gg-select",value:g.dateFormat,onChange:N=>f({dateFormat:N.target.value}),children:[e("option",{value:"relative",children:"Date Format: Relative"}),e("option",{value:"iso",children:"Date Format: ISO"}),e("option",{value:"datetime",children:"Date Format: Local Date/Time"})]}),t("select",{className:"gg-select",value:g.dateType,onChange:N=>f({dateType:N.target.value}),children:[e("option",{value:"author",children:"Show Author Date"}),e("option",{value:"commit",children:"Show Commit Date"})]})]})]})]}),t("div",{className:"gg-modal-footer",children:[e("button",{type:"button",className:"gg-btn",onClick:c,title:"Write .git-graph.json into the repository root",children:"Export .git-graph.json"}),e("button",{type:"button",className:"gg-btn gg-btn-primary",onClick:u,children:"Done"})]})]})}):null}var Se={date:125,author:130,commit:74},_e=28,yt=14,Pt=14;function en({focusWindow:i,bringBack:r}){return e("div",{className:"gg-root","data-testid":"gg-detached-placeholder",children:t("div",{className:"gg-empty",style:{gap:"12px"},children:[e("div",{style:{fontSize:"14px",fontWeight:600},children:"Git Tree is open in its own window"}),t("div",{style:{display:"flex",gap:"8px"},children:[e("button",{type:"button",className:"gg-btn gg-btn-primary",onClick:i,children:"Focus Window"}),e("button",{type:"button",className:"gg-btn",onClick:r,children:"Bring Back Here"})]})]})})}function tn({projectId:i,headerActions:r}){let o=Et(),g={projectId:null};try{g=zt()}catch{}let[u,k]=w([]),[l,f]=w(i||g.projectId||""),c=i||l||g.projectId||"",C=null;try{C=Lt()}catch{C=null}ce(()=>{!i&&!l&&o.call("listProjects").then(n=>{let a=Array.isArray(n)?n:[];k(a),a.length>0&&!l&&f(a[0].id)}).catch(()=>{})},[i,l,o]);let[b,P]=w([]),[s,A]=w(""),[m,L]=w(null),[S,N]=w(300),[h,O]=w(!0),[ee,ue]=w(null),[me,G]=w(null),[I,U]=w(null),[D,oe]=w(null),[Re,T]=w(null),[J,Fe]=w(null),[Ae,Te]=w(!1),[Pe,he]=w(null),[te,we]=w(null),[be,Ie]=w(null),[ke,qe]=w(!1),[Ce,je]=w(null),[Ze,Ge]=w(!1),[Ne,Me]=w(!1),[De,Ye]=w(""),[Ee,He]=w(0),[Be,ie]=w(null),[ze,ae]=w(null),[Ke,ot]=w(!1),[We,it]=w(!1),Je=Q(null),Xe=Q(null),X=q(async(n,a,p)=>{let y=p??c;if(!y){O(!1);return}O(!0),ue(null);try{let H=await o.call("discoverRepos",{projectId:y}),V=Array.isArray(H)?H:H?.repos??[];if(P(V),V.length===0){L(null),O(!1);return}let Z=n!==void 0?n:V.some(le=>le.relPath===s)?s:V[0].relPath;Z!==s&&A(Z);let F=await o.call("loadGraph",{projectId:y,subRepoRelPath:Z,maxCommits:a??S});L(F)}catch(H){ue(H instanceof Error?H.message:String(H))}finally{O(!1)}},[c,o,s,S]);ce(()=>{X()},[c]);let Qe=n=>{let a=n;(!a?.projectId||a.projectId===c)&&X(s,S)};bt("git-tree:changed",Qe),bt("git-graph:changed",Qe),ce(()=>{if(!c||!I){T(null),Fe(null),he(null),we(null),Ie(null),je(null);return}let n=!1;return Te(!0),we(null),Ie(null),je(null),(async()=>{try{if(D&&D!==I){let p=await o.call("compareCommits",{projectId:c,subRepoRelPath:s,fromHash:I,toHash:D});if(n)return;Fe(p.comparison),T(null),he(p.codeReview),p.comparison.fileChanges.length>0&&Ve(p.comparison.fileChanges[0],D,I)}else{let p=await o.call("getCommitDetails",{projectId:c,subRepoRelPath:s,commitHash:I});if(n)return;T(p.details),Fe(null),he(p.codeReview),p.details.fileChanges.length>0&&Ve(p.details.fileChanges[0],I,void 0)}}catch(p){n||G({kind:"error",text:p instanceof Error?p.message:String(p)})}finally{n||Te(!1)}})(),()=>{n=!0}},[c,s,I,D]);let Oe=q(async(n,a)=>{let p=a??D??I;if(p){Ge(!0);try{let y=await o.call("getFileContent",{projectId:c,subRepoRelPath:s,commitHash:p,filePath:n});je(y)}catch(y){G({kind:"error",text:y instanceof Error?y.message:String(y)})}finally{Ge(!1)}}},[c,o,s,I,D]),Ve=q(async(n,a,p)=>{let y=a??D??I;if(!y)return;let H=p!==void 0?p:D?I??void 0:void 0;we(n.newPath),qe(!0),je(null),Oe(n.newPath,y);try{let V=await o.call("getFileDiff",{projectId:c,subRepoRelPath:s,commitHash:y,fromHash:H,filePath:n.newPath,oldPath:n.oldPath!==n.newPath?n.oldPath:void 0,staged:n.staged,untracked:n.untracked});Ie(V)}catch(V){G({kind:"error",text:V instanceof Error?V.message:String(V)})}finally{qe(!1)}},[c,o,s,I,D,Oe]),B=m?.commits??[],fe=m?.headHash??null,E=m?.globalSettings??{graphStyle:"rounded",initialLoadCommits:300,loadMoreCommits:100,muteNonAncestors:!1,muteMergeCommits:!1,commitDetailsLocation:"docked",fileViewType:"tree",compactFolders:!0,diffViewMode:"unified",maxDepthOfRepoSearch:2,dateType:"author",dateFormat:"relative",fetchAndPrune:!1,fetchAndPruneTags:!1,signCommits:!1,signTags:!1,useMailmap:!0,graphColors:[],columnWidths:Se},Le=m?.repoSettings??{selectedBranches:[],showRemoteBranches:!0,showStashes:!0,showTags:!0,showUncommittedChanges:!0,showUntrackedFiles:!0,onlyFollowFirstParent:!1,commitOrdering:"date",issueLinkingRules:[],pullRequestConfig:{provider:"github",remoteName:"origin",targetBranch:"main"}},$e=pe(()=>jt(B,fe,E.graphColors),[B,fe,E.graphColors]),re=pe(()=>Math.max(48,Pt*2+($e.maxLane+1)*yt),[$e.maxLane]),se=pe(()=>{let n=De.trim().toLowerCase();if(!n)return[];let a=[];return B.forEach((p,y)=>{[p.hash,p.abbreviatedHash,p.subject,p.authorName,p.authorEmail,...p.refs.map(V=>V.remote?`${V.remote}/${V.name}`:V.name)].join(" ").toLowerCase().includes(n)&&a.push(y)}),a},[B,De]),d=q(n=>{let a=Je.current;if(!a)return;let p=Math.max(0,n*_e-a.clientHeight/3);a.scrollTo?.({top:p,behavior:"smooth"})},[]),M=q(()=>{if(!fe)return;let n=B.findIndex(a=>a.hash===fe);n>=0&&(U(fe),oe(null),d(n))},[B,fe,d]),x=q(async n=>{try{G(null),await o.call("runGitAction",{projectId:c,subRepoRelPath:s,action:n}),await X(s,S)}catch(a){G({kind:"error",text:a instanceof Error?a.message:String(a)})}},[c,o,s,X,S]),R=q(async()=>{if(!(!c||We)){it(!0),G(null);try{await o.call("runGitAction",{projectId:c,subRepoRelPath:"",action:"init"}),await X()}catch(n){G({kind:"error",text:n instanceof Error?n.message:String(n)})}finally{it(!1)}}},[c,We,o,X]),$=q(async n=>{try{await o.call("updateRepoSettings",{projectId:c,subRepoRelPath:s,patch:n}),await X(s,S)}catch(a){G({kind:"error",text:a instanceof Error?a.message:String(a)})}},[c,o,s,X,S]),z=q(async n=>{try{await o.call("updateGlobalSettings",{patch:n}),L(a=>a&&{...a,globalSettings:{...a.globalSettings,...n}})}catch(a){G({kind:"error",text:a instanceof Error?a.message:String(a)})}},[o]),[v,Y]=w(()=>({description:E.columnWidths?.description,date:E.columnWidths?.date??Se.date,author:E.columnWidths?.author??Se.author,commit:E.columnWidths?.commit??Se.commit})),[K,W]=w(null),ne=Q(v);ne.current=v;let xe=Q(!1),et=Q(null);ce(()=>{!xe.current&&E.columnWidths&&Y({description:E.columnWidths.description,date:E.columnWidths.date??Se.date,author:E.columnWidths.author??Se.author,commit:E.columnWidths.commit??Se.commit})},[E.columnWidths]);let at=q((n,a)=>{n.preventDefault(),n.stopPropagation(),xe.current=!0,W(a);let p=n.clientX,y=a==="description"?ne.current.description??et.current?.getBoundingClientRect().width??260:ne.current[a],H=y,V=document.body.style.userSelect,Z=document.body.style.cursor;document.body.style.userSelect="none",document.body.style.cursor="col-resize";let F=a==="commit"?50:a==="description"?150:60,le=a==="description"?1200:500,lt=ht=>{let mn=ht.clientX-p,It=Math.max(F,Math.min(le,Math.round(y+mn)));H=It,Y(hn=>({...hn,[a]:It}))},Tt=()=>{window.removeEventListener("mousemove",lt),window.removeEventListener("mouseup",Tt),document.body.style.userSelect=V,document.body.style.cursor=Z,xe.current=!1,W(null);let ht={...ne.current,[a]:H};z({columnWidths:ht})};window.addEventListener("mousemove",lt),window.addEventListener("mouseup",Tt)},[z]),rt=q(n=>{if(n==="description"){let y={...ne.current};delete y.description,Y(y),z({columnWidths:y});return}let a=Se[n],p={...ne.current,[n]:a};Y(p),z({columnWidths:p})},[z]),ut=q((n,a)=>{navigator.clipboard?.writeText(n),G({kind:"info",text:`${a} copied to clipboard.`})},[]),on=q(async n=>{ae({kind:"tag-details",tagName:n,details:null});try{let a=await o.call("getTagDetails",{projectId:c,subRepoRelPath:s,tagName:n});ae({kind:"tag-details",tagName:n,details:a})}catch(a){G({kind:"error",text:a instanceof Error?a.message:String(a)})}},[c,o,s]),an=q(async n=>{try{let a=await o.call("buildPullRequestUrl",{projectId:c,subRepoRelPath:s,sourceBranch:n});a.url?window.open(a.url,"_blank","noopener,noreferrer"):G({kind:"error",text:"Could not derive a Pull Request URL from the configured remote."})}catch(a){G({kind:"error",text:a instanceof Error?a.message:String(a)})}},[c,o,s]),rn=q(async(n,a,p)=>{try{let y=await o.call("askAgentAboutCommit",{projectId:c,subRepoRelPath:s,commitHash:n,filePath:a,userPrompt:p});G({kind:"info",text:`Spawned Agent thread: ${y.title}`}),C&&(C.openPanelAgent?.({threadId:y.threadId,title:y.title})||C.toThread(y.threadId))}catch(y){G({kind:"error",text:y instanceof Error?y.message:String(y)})}},[c,o,s,C]),wt=q(async()=>{if(!I)return;let n=D?I:null,a=D??I;try{let p=await o.call("codeReviewStart",{projectId:c,subRepoRelPath:s,fromHash:n,toHash:a});he(p)}catch(p){G({kind:"error",text:p instanceof Error?p.message:String(p)})}},[c,o,s,I,D]),kt=q(async(n,a)=>{if(!I)return;let p=D?I:null,y=D??I;try{let H=await o.call("codeReviewToggleFile",{projectId:c,subRepoRelPath:s,fromHash:p,toHash:y,filePath:n,reviewed:a});he(H)}catch(H){G({kind:"error",text:H instanceof Error?H.message:String(H)})}},[c,o,s,I,D]),Ct=q(async()=>{if(!I)return;let n=D?I:null,a=D??I;try{await o.call("codeReviewEnd",{projectId:c,subRepoRelPath:s,fromHash:n,toHash:a}),he(null)}catch(p){G({kind:"error",text:p instanceof Error?p.message:String(p)})}},[c,o,s,I,D]),sn=q(n=>{if((n.ctrlKey||n.metaKey)&&n.key.toLowerCase()==="f"){n.preventDefault(),Me(!0);return}if((n.ctrlKey||n.metaKey)&&n.key.toLowerCase()==="h"){n.preventDefault(),M();return}if((n.ctrlKey||n.metaKey)&&n.key.toLowerCase()==="r"){n.preventDefault(),X(s,S);return}if(n.key==="Escape"){Be?ie(null):ze?ae(null):Ne?Me(!1):I&&(U(null),oe(null));return}if(n.key==="ArrowDown"||n.key==="ArrowUp"){if(B.length===0)return;let a=I?B.findIndex(H=>H.hash===I):-1,p=n.key==="ArrowDown"?Math.min(B.length-1,a+1):Math.max(0,a<=0?0:a-1),y=B[p];y&&(n.preventDefault(),U(y.hash),oe(null))}},[B,I,Be,ze,Ne,M,X,s,S]),ln=(n,a,p)=>{let y=a.type==="head"?`gg-ref-badge gg-ref-head ${a.isHead?"is-current":""}`:a.type==="remote"?"gg-ref-badge gg-ref-remote":a.type==="tag"?"gg-ref-badge gg-ref-tag":"gg-ref-badge gg-ref-stash",H=a.type==="remote"?"\u2601":a.type==="tag"?"\u{1F3F7}":a.type==="stash"?"\u{1F4E6}":a.isHead?"\u25CF":"\u2442",V=a.type==="remote"&&a.remote?`${a.remote}/${a.name}`:a.name;return t("span",{className:y,title:a.type==="head"?a.isHead?`Current branch: ${a.name}`:`Branch: ${a.name} (Double-click to checkout)`:a.type==="remote"?`Remote branch: ${V}`:a.type==="tag"?`Tag: ${a.name}`:`Stash: ${a.name}`,onContextMenu:Z=>{Z.preventDefault(),Z.stopPropagation(),a.type==="head"?ie({kind:"branch",commit:n,ref:a,x:Z.clientX,y:Z.clientY}):a.type==="remote"?ie({kind:"remote-branch",commit:n,ref:a,x:Z.clientX,y:Z.clientY}):a.type==="tag"?ie({kind:"tag",commit:n,ref:a,x:Z.clientX,y:Z.clientY}):a.type==="stash"&&ie({kind:"stash",commit:n,selector:a.selector||a.name,x:Z.clientX,y:Z.clientY})},onDoubleClick:Z=>{Z.stopPropagation(),a.type==="head"&&!a.isHead&&x({kind:"checkout-branch",branchName:a.name})},children:[e("span",{className:"gg-ref-icon",children:H}),e("span",{className:"gg-ref-name",children:V})]},`${a.type}:${a.remote??""}:${a.name}:${p}`)},cn=n=>dt(n,Le.issueLinkingRules).map((p,y)=>p.kind==="code"?e("code",{style:{background:"rgba(255,255,255,0.08)",padding:"0 4px",borderRadius:"3px",fontSize:"11px"},children:p.text},y):p.kind==="link"&&p.href?e("a",{href:p.href,target:"_blank",rel:"noreferrer",onClick:H=>H.stopPropagation(),style:{color:"var(--accent-color, #4da3ff)"},children:p.text},y):e(ve.Fragment,{children:p.text},y)),de=!!I,ge=E.commitDetailsLocation==="inline",[tt,dn]=w(340),[Nt,gn]=w(0),[mt,St]=w(0),Rt=Q(null);ce(()=>{let n=Je.current;if(!n)return;let a=()=>{n&&(gn(n.clientWidth),St(n.scrollLeft))};if(a(),typeof ResizeObserver<"u"){let p=new ResizeObserver(a);return p.observe(n),()=>p.disconnect()}},[m,h,B.length]);let At=Math.max(re+8,mt+8),st=Nt>0?Math.max(280,mt+Nt-At-16):void 0,Ue=pe(()=>{if(!de||!ge)return-1;let n=D??I;return n?B.findIndex(a=>a.hash===n):-1},[de,ge,D,I,B]);ce(()=>{let n=Rt.current;if(!n)return;let a=()=>{if(n){let p=n.offsetHeight;p>0&&dn(p)}};if(a(),typeof ResizeObserver<"u"){let p=new ResizeObserver(a);return p.observe(n),()=>p.disconnect()}},[ge,de,I,D,Re,J,be,Ae,ke]);let pn=pe(()=>{let n=B.length*_e;return ge&&de&&Ue>=0?n+tt+12:n},[B.length,ge,de,Ue,tt]),un=q(n=>ge&&de&&Ue>=0&&n>Ue?n*_e+tt+12+_e/2:n*_e+_e/2,[ge,de,Ue,tt]);return t("div",{className:"gg-root",tabIndex:0,onKeyDown:sn,"data-testid":"gg-project-tab",children:[e(Ot,{projects:u,selectedProjectId:c,onSelectProject:n=>{f(n),U(null),oe(null),X(void 0,void 0,n)},repos:b,selectedRepoRelPath:s,onSelectRepo:n=>{U(null),oe(null),A(n),X(n,S)},branches:m?.branches??[],remoteBranches:m?.remoteBranches??[],repoSettings:Le,globalSettings:E,loading:h,findOpen:Ne,headerActions:r,onUpdateRepoSettings:n=>{$(n)},onUpdateGlobalSettings:n=>{z(n)},onFetch:()=>{x({kind:"fetch",all:!0,prune:E.fetchAndPrune,pruneTags:E.fetchAndPruneTags})},onScrollToHead:M,onToggleFind:()=>Me(n=>!n),onOpenRepoSettings:()=>ot(!0),onRefresh:()=>{X(s,S)}}),me&&t("div",{className:`gg-banner ${me.kind==="error"?"gg-banner-error":"gg-banner-info"}`,"data-testid":"gg-banner",children:[e("span",{children:me.text}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:()=>G(null),children:"\u2715"})]}),t("div",{className:"gg-workspace",children:[Ne&&e(Vt,{query:De,matchCount:se.length,activeMatchIndex:Ee,onChangeQuery:n=>{Ye(n),He(0)},onNext:()=>{if(se.length===0)return;let n=(Ee+1)%se.length;He(n);let a=se[n];U(B[a].hash),d(a)},onPrev:()=>{if(se.length===0)return;let n=(Ee-1+se.length)%se.length;He(n);let a=se[n];U(B[a].hash),d(a)},onClose:()=>Me(!1)}),t("div",{className:"gg-table-container",children:[e("div",{className:"gg-table-header-scroll",ref:Xe,children:t("div",{className:"gg-table-header",children:[e("div",{style:{width:`${re}px`,minWidth:`${re}px`,maxWidth:`${re}px`,flex:`0 0 ${re}px`,paddingLeft:"8px",boxSizing:"border-box"},children:"Graph"}),e("div",{ref:et,style:{...v.description!==void 0?{width:`${v.description}px`,minWidth:`${v.description}px`,maxWidth:`${v.description}px`,flex:`0 0 ${v.description}px`}:{flex:"1 1 0px",minWidth:"150px"},padding:"0 8px",boxSizing:"border-box"},children:"Description"}),e("div",{className:`gg-col-resizer ${K==="description"?"active":""}`,title:"Resize Description \xB7 Double-click to auto-fit","data-testid":"gg-col-resizer-description",onMouseDown:n=>at(n,"description"),onDoubleClick:()=>rt("description")}),e("div",{style:{width:`${v.date}px`,minWidth:`${v.date}px`,maxWidth:`${v.date}px`,flex:`0 0 ${v.date}px`,padding:"0 6px",boxSizing:"border-box"},children:"Date"}),e("div",{className:`gg-col-resizer ${K==="date"?"active":""}`,title:"Resize Date \xB7 Double-click to reset","data-testid":"gg-col-resizer-date",onMouseDown:n=>at(n,"date"),onDoubleClick:()=>rt("date")}),e("div",{style:{width:`${v.author}px`,minWidth:`${v.author}px`,maxWidth:`${v.author}px`,flex:`0 0 ${v.author}px`,padding:"0 6px",boxSizing:"border-box"},children:"Author"}),e("div",{className:`gg-col-resizer ${K==="author"?"active":""}`,title:"Resize Author \xB7 Double-click to reset","data-testid":"gg-col-resizer-author",onMouseDown:n=>at(n,"author"),onDoubleClick:()=>rt("author")}),e("div",{style:{width:`${v.commit}px`,minWidth:`${v.commit}px`,maxWidth:`${v.commit}px`,flex:`0 0 ${v.commit}px`,textAlign:"right",padding:"0 6px",boxSizing:"border-box"},children:"Commit"}),e("div",{className:`gg-col-resizer ${K==="commit"?"active":""}`,title:"Resize Commit \xB7 Double-click to reset","data-testid":"gg-col-resizer-commit",onMouseDown:n=>at(n,"commit"),onDoubleClick:()=>rt("commit")})]})}),h&&!m?e("div",{className:"gg-empty",children:"Loading Git Tree\u2026"}):ee?t("div",{className:"gg-empty",children:[t("div",{children:["Failed to load Git Tree: ",ee]}),e("button",{type:"button",className:"gg-btn",style:{marginTop:"8px"},onClick:()=>{X(s,S)},children:"Retry"})]}):b.length===0?t("div",{className:"gg-empty",style:{gap:"12px"},children:[e("div",{children:"No Git repositories found in this project."}),e("button",{type:"button",className:"gg-btn gg-btn-primary","data-testid":"gg-init-repo-btn",disabled:We,onClick:()=>{R()},children:We?"Initializing\u2026":"Initialize Git Repository"})]}):B.length===0?e("div",{className:"gg-empty",children:fe?"No commits match the current branch filters.":"Repository initialized with no commits or uncommitted changes yet."}):t("div",{className:"gg-table-scroll",ref:Je,onScroll:n=>{let a=n.currentTarget.scrollLeft;a!==mt&&St(a),Xe.current&&(Xe.current.scrollLeft=a)},children:[t("div",{className:"gg-rows-wrapper",children:[t("svg",{className:"gg-svg-overlay",width:re,height:pn,"data-testid":"gg-svg-dag",children:[$e.segments.map((n,a)=>e("path",{d:Gt({segment:n,rowHeight:_e,laneWidth:yt,padX:Pt,style:E.graphStyle,expandedRow:ge&&de?Ue:-1,detailsHeight:ge&&de?tt+12:0}),fill:"none",stroke:n.color,strokeWidth:2,strokeDasharray:n.isUncommitted?"3 3":void 0},a)),$e.nodes.map(n=>{let a=Pt+n.lane*yt,p=un(n.row),y=I===n.commit.hash;return n.commit.isUncommitted?e("circle",{cx:a,cy:p,r:y?5.5:4.5,fill:"var(--bg-primary, #12151a)",stroke:n.color,strokeWidth:y?2.5:2,strokeDasharray:"2 2"},n.commit.hash):n.commit.isStash?e("rect",{x:a-(y?5:4),y:p-(y?5:4),width:y?10:8,height:y?10:8,rx:2,fill:"var(--bg-primary, #12151a)",stroke:n.color,strokeWidth:y?2.5:2},n.commit.hash):n.isMerge?t("g",{children:[e("circle",{cx:a,cy:p,r:y?5.5:4.5,fill:"var(--bg-primary, #12151a)",stroke:y?"#ffffff":n.color,strokeWidth:y?2.5:2}),e("circle",{cx:a,cy:p,r:2,fill:n.color})]},n.commit.hash):e("circle",{cx:a,cy:p,r:y?5.5:n.commit.isHead?5:4,fill:n.color,stroke:y||n.commit.isHead?"#ffffff":"var(--bg-primary, #12151a)",strokeWidth:y?2:n.commit.isHead?1.5:1},n.commit.hash)})]}),$e.nodes.map(n=>{let{commit:a}=n,p=I===a.hash,y=D===a.hash,H=De.trim().length>0&&se.includes(n.row),V=E.muteNonAncestors&&!n.isAncestorOfHead||E.muteMergeCommits&&n.isMerge,Z=E.dateType==="commit"?a.commitDate:a.authorDate;return t(ve.Fragment,{children:[t("div",{className:["gg-commit-row",p?"selected":"",y?"compared":"",V?"muted":"",H?"search-match":"",a.isUncommitted?"uncommitted":""].filter(Boolean).join(" "),onClick:F=>{(F.ctrlKey||F.metaKey)&&I&&I!==a.hash?oe(a.hash):(U(le=>le===a.hash&&!D?null:a.hash),oe(null))},onContextMenu:F=>{F.preventDefault(),a.isUncommitted?ie({kind:"uncommitted",commit:a,x:F.clientX,y:F.clientY}):a.isStash&&a.stashSelector?ie({kind:"stash",commit:a,selector:a.stashSelector,x:F.clientX,y:F.clientY}):ie({kind:"commit",commit:a,x:F.clientX,y:F.clientY})},"data-testid":`gg-commit-row-${a.abbreviatedHash}`,children:[e("div",{className:"gg-graph-spacer",style:{width:`${re}px`,minWidth:`${re}px`,maxWidth:`${re}px`,flex:`0 0 ${re}px`,boxSizing:"border-box"}}),t("div",{className:"gg-commit-desc",style:{...v.description!==void 0?{width:`${v.description}px`,minWidth:`${v.description}px`,maxWidth:`${v.description}px`,flex:`0 0 ${v.description}px`}:{flex:"1 1 0px",minWidth:"150px"},padding:"0 8px",boxSizing:"border-box"},children:[a.refs.map((F,le)=>ln(a,F,le)),e("span",{className:"gg-commit-subject",children:cn(a.subject)})]}),e("div",{className:"gg-commit-date",style:{width:`${v.date}px`,minWidth:`${v.date}px`,maxWidth:`${v.date}px`,flex:`0 0 ${v.date}px`,padding:"0 6px",boxSizing:"border-box"},children:a.isUncommitted?"Working Tree":nt(Z,E.dateFormat)}),e("div",{className:"gg-commit-author",style:{width:`${v.author}px`,minWidth:`${v.author}px`,maxWidth:`${v.author}px`,flex:`0 0 ${v.author}px`,padding:"0 6px",boxSizing:"border-box"},title:a.authorEmail,children:a.authorName}),e("div",{className:"gg-commit-hash",style:{width:`${v.commit}px`,minWidth:`${v.commit}px`,maxWidth:`${v.commit}px`,flex:`0 0 ${v.commit}px`,textAlign:"right",padding:"0 6px",boxSizing:"border-box"},children:a.abbreviatedHash})]}),ge&&de&&(!D&&p||D&&y)&&e("div",{ref:Rt,className:"gg-inline-details-wrapper",style:{marginLeft:`${At}px`,width:st!==void 0?`${st}px`:void 0,maxWidth:st!==void 0?`${st}px`:"100%",marginBottom:"8px",boxSizing:"border-box"},children:e(vt,{mode:D?"comparison":"single",details:Re,comparison:J,loading:Ae,inline:!0,fileViewType:E.fileViewType,compactFolders:E.compactFolders,diffViewMode:E.diffViewMode,dateFormat:E.dateFormat,issueRules:Le.issueLinkingRules,codeReview:Pe,selectedFilePath:te,fileDiff:be,loadingDiff:ke,fileContent:Ce,loadingContent:Ze,onSelectFile:F=>{Ve(F)},onLoadFileContent:F=>{Oe(F)},onChangeFileViewType:F=>{z({fileViewType:F})},onToggleCompactFolders:()=>{z({compactFolders:!E.compactFolders})},onChangeDiffViewMode:F=>{z({diffViewMode:F})},onStartCodeReview:()=>{wt()},onToggleReviewedFile:(F,le)=>{kt(F,le)},onEndCodeReview:()=>{Ct()},onSelectParentHash:F=>{U(F),oe(null);let le=B.findIndex(lt=>lt.hash===F);le>=0&&d(le)},onAskAgent:F=>ae({kind:"ask-agent",commitHash:D??I??"*",filePath:F}),onCopyText:ut,onClose:()=>{U(null),oe(null)}})})]},a.hash)})]}),m?.hasMore&&e("div",{className:"gg-load-more-row",children:t("button",{type:"button",className:"gg-btn",onClick:()=>{let n=S+(E.loadMoreCommits||100);N(n),X(s,n)},"data-testid":"gg-load-more-btn",children:["Load ",E.loadMoreCommits||100," More Commits"]})})]})]}),!ge&&de&&e(vt,{mode:D?"comparison":"single",details:Re,comparison:J,loading:Ae,inline:!1,fileViewType:E.fileViewType,compactFolders:E.compactFolders,diffViewMode:E.diffViewMode,dateFormat:E.dateFormat,issueRules:Le.issueLinkingRules,codeReview:Pe,selectedFilePath:te,fileDiff:be,loadingDiff:ke,fileContent:Ce,loadingContent:Ze,onSelectFile:n=>{Ve(n)},onLoadFileContent:n=>{Oe(n)},onChangeFileViewType:n=>{z({fileViewType:n})},onToggleCompactFolders:()=>{z({compactFolders:!E.compactFolders})},onChangeDiffViewMode:n=>{z({diffViewMode:n})},onStartCodeReview:()=>{wt()},onToggleReviewedFile:(n,a)=>{kt(n,a)},onEndCodeReview:()=>{Ct()},onSelectParentHash:n=>{U(n),oe(null);let a=B.findIndex(p=>p.hash===n);a>=0&&d(a)},onAskAgent:n=>ae({kind:"ask-agent",commitHash:D??I??"*",filePath:n}),onCopyText:ut,onClose:()=>{U(null),oe(null)}})]}),e(Jt,{target:Be,currentBranch:m?.currentBranch??null,onClose:()=>ie(null),onRunAction:n=>{x(n)},onOpenDialog:n=>ae(n),onOpenPullRequest:n=>{an(n)},onViewTagDetails:n=>{on(n)},onCopyText:ut}),e(Xt,{dialog:ze,remotes:m?.remotes??[],onClose:()=>ae(null),onRunAction:n=>{x(n)},onAskAgentSubmit:(n,a,p)=>{rn(n,a,p)}}),e(Qt,{open:Ke,remotes:m?.remotes??[],repoSettings:Le,globalSettings:E,onClose:()=>ot(!1),onRunGitAction:n=>{x(n)},onUpdateRepoSettings:n=>{$(n)},onUpdateGlobalSettings:n=>{z(n)},onExportRepoConfig:async()=>{try{let n=await o.call("exportRepoConfig",{projectId:c,subRepoRelPath:s});G({kind:"info",text:`Exported repository config to ${n.filePath}`})}catch(n){G({kind:"error",text:n instanceof Error?n.message:String(n)})}}})]})}var nn="zcc-ext-git-tree-styles";function vn(){if(typeof document>"u"||document.getElementById(nn))return;let i=document.createElement("style");i.id=nn,i.textContent=$t,document.head.appendChild(i)}var jo=Dt(i=>{vn(),i.slots.projectTab({id:"git-tree",label:"Git Tree",icon:"GitBranch",order:40,global:!1,header:"custom",detachable:!0,component:tn,detachedPlaceholder:en}),i.slots.commandPaletteAction({id:"open-git-tree",title:"Git Tree: View Git Tree",isAvailable:r=>!!r.projectId,run:r=>{r.projectId&&r.toProject(r.projectId,{tabId:"git-tree"})}})});export{jo as default};
