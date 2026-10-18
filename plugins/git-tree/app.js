function ct(){return globalThis.__ZCC_PLUGIN_RUNTIME__??{}}function Dt(o){throw new Error(`${o} is not available until the host plugin runtime is installed`)}function Et(o){return{__zccPluginApp:!0,setup:o}}function Lt(){return ct().useRpc?.()??Dt("useRpc")}function ft(o,s){ct().useRealtime?.(o,s)}function $t(){return ct().useZccContext?.()??{projectId:null,threadId:null}}function zt(){return ct().useZccNavigate?.()??Dt("useZccNavigate")}var _t=`
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
`;var G=globalThis.__ZCC_HOST_REACT__,ve=G,Ln=G.Children,$n=G.Component,zn=G.Fragment,_n=G.StrictMode,Fn=G.Suspense,jn=G.cloneElement,Hn=G.createContext,Gn=G.createElement,Bn=G.createRef,On=G.forwardRef,Wn=G.isValidElement,Vn=G.lazy,Un=G.memo,qn=G.startTransition,Z=G.useCallback,Zn=G.useContext,Yn=G.useDebugValue,Kn=G.useDeferredValue,le=G.useEffect,Jn=G.useId,Xn=G.useImperativeHandle,Qn=G.useInsertionEffect,Ft=G.useLayoutEffect,pe=G.useMemo,eo=G.useReducer,Q=G.useRef,w=G.useState,to=G.useSyncExternalStore,no=G.useTransition,oo=G.version;var jt=["#0085d9","#d9008f","#00d90a","#d98500","#a300d9","#ff0000","#00d9cc","#e138e8","#85d900","#dc5b23","#6f24d6","#ffcc00"];function Ht(o,s,r=jt){let a=r.length>0?r:jt,u=new Map;o.forEach((A,h)=>u.set(A.hash,h));let m=new Set;if(s&&u.has(s)){let A=[s];for(m.add(s);A.length>0;){let h=A.shift(),$=u.get(h);if($!==void 0)for(let S of o[$].parents)m.has(S)||(m.add(S),u.has(S)&&A.push(S))}}let d=[],P=[],l=[],N=0,b=0,x=()=>{let A=a[N%a.length];return N+=1,A},c=A=>{let h=d.findIndex(S=>S===null);if(h>=0)return d[h]=A,h>b&&(b=h),h;let $=d.length;return d.push(A),$>b&&(b=$),$};for(let A=0;A<o.length;A++){let h=o[A],$=[];for(let V=0;V<d.length;V++)d[V]?.targetHash===h.hash&&$.push(V);let S,C;if($.length>0){S=$[0],C=h.isUncommitted?"#8a94a6":d[S].color;for(let V of $){let ee=d[V];l.push({fromRow:ee.fromRow,fromLane:ee.fromLane,toRow:A,toLane:S,color:ee.color,isUncommitted:ee.isUncommitted}),d[V]=null}}else C=h.isUncommitted?"#8a94a6":x(),S=c({targetHash:h.hash,color:C,fromRow:A,fromLane:0,isUncommitted:h.isUncommitted}),d[S]=null;P.push({commit:h,row:A,lane:S,color:C,isAncestorOfHead:h.isUncommitted||(s?m.has(h.hash):!0),isMerge:h.parents.length>1}),h.parents.filter(V=>u.has(V)).forEach((V,ee)=>{if(ee===0)d[S]={targetHash:V,color:h.isUncommitted?x():C,fromRow:A,fromLane:S,isUncommitted:h.isUncommitted};else{let ue=d.findIndex(H=>H?.targetHash===V),me=ue>=0?d[ue].color:x();c({targetHash:V,color:me,fromRow:A,fromLane:S})}})}return{nodes:P,segments:l,maxLane:b}}function Gt(o){let{segment:s,rowHeight:r,laneWidth:a,padX:u,style:m,expandedRow:d=-1,detailsHeight:P=0}=o,l=h=>d>=0&&P>0&&h>d?h*r+P+r/2:h*r+r/2,N=u+s.fromLane*a,b=l(s.fromRow),x=u+s.toLane*a,c=l(s.toRow);if(N===x)return`M ${N} ${b} L ${x} ${c}`;if(m==="angular"){let h=b+r*.5;return h>=c?`M ${N} ${b} L ${x} ${c}`:`M ${N} ${b} L ${N} ${h} L ${x} ${c}`}if(s.toRow-s.fromRow<=1){if(d>=0&&P>0&&s.fromRow<=d&&s.toRow>d){let S=b+r,C=b+r*.45,f=S-r*.45;return`M ${N} ${b} C ${N} ${C}, ${x} ${f}, ${x} ${S} L ${x} ${c}`}let h=b+r*.5,$=c-r*.5;return`M ${N} ${b} C ${N} ${h}, ${x} ${$}, ${x} ${c}`}if(s.toLane>s.fromLane){let h=b+r,$=b+r*.45,S=h-r*.45;return`M ${N} ${b} C ${N} ${$}, ${x} ${S}, ${x} ${h} L ${x} ${c}`}else{let h=c-r,$=h+r*.45,S=c-r*.45;return`M ${N} ${b} L ${N} ${h} C ${N} ${$}, ${x} ${S}, ${x} ${c}`}}var bn={":art:":"\u{1F3A8}",":zap:":"\u26A1",":fire:":"\u{1F525}",":bug:":"\u{1F41B}",":ambulance:":"\u{1F691}\uFE0F",":sparkles:":"\u2728",":memo:":"\u{1F4DD}",":rocket:":"\u{1F680}",":lipstick:":"\u{1F484}",":tada:":"\u{1F389}",":white_check_mark:":"\u2705",":lock:":"\u{1F512}\uFE0F",":bookmark:":"\u{1F516}",":rotating_light:":"\u{1F6A8}",":construction:":"\u{1F6A7}",":green_heart:":"\u{1F49A}",":arrow_down:":"\u2B07\uFE0F",":arrow_up:":"\u2B06\uFE0F",":pushpin:":"\u{1F4CC}",":construction_worker:":"\u{1F477}",":chart_with_upwards_trend:":"\u{1F4C8}",":recycle:":"\u267B\uFE0F",":heavy_plus_sign:":"\u2795",":heavy_minus_sign:":"\u2796",":wrench:":"\u{1F527}",":hammer:":"\u{1F528}",":globe_with_meridians:":"\u{1F310}",":pencil2:":"\u270F\uFE0F",":rewind:":"\u23EA\uFE0F",":twisted_rightwards_arrows:":"\u{1F500}",":package:":"\u{1F4E6}\uFE0F",":alien:":"\u{1F47D}\uFE0F",":truck:":"\u{1F69A}",":page_facing_up:":"\u{1F4C4}",":boom:":"\u{1F4A5}",":bento:":"\u{1F371}",":wheelchair:":"\u267F\uFE0F",":bulb:":"\u{1F4A1}",":speech_balloon:":"\u{1F4AC}",":card_file_box:":"\u{1F5C3}\uFE0F",":loud_sound:":"\u{1F50A}",":mute:":"\u{1F507}",":Coffin:":"\u26B0\uFE0F",":test_tube:":"\u{1F9EA}",":necktie:":"\u{1F454}",":stethoscope:":"\u{1FA7A}",":bricks:":"\u{1F9F1}"};function fn(o){return o.replace(/:[a-z0-9_+-]+:/gi,s=>{let r=s.toLowerCase();return bn[r]??s})}function dt(o,s=[]){let r=fn(o),a=[],u=/(`[^`]+`|https?:\/\/[^\s)]+)/g,m=0,d,P=l=>{if(l){if(s.length===0){a.push({kind:"text",text:l});return}for(let N of s)try{let b=new RegExp(N.pattern,"g"),x=0,c,A=[];for(;(c=b.exec(l))!==null;){c.index>x&&A.push({kind:"text",text:l.slice(x,c.index)});let h=N.urlTemplate;if(c.forEach(($,S)=>{$!==void 0&&(h=h.replace(new RegExp(`\\$${S}`,"g"),$))}),A.push({kind:"link",text:c[0],href:h}),x=c.index+c[0].length,c[0].length===0)break}if(A.length>0){x<l.length&&A.push({kind:"text",text:l.slice(x)}),a.push(...A);return}}catch{}a.push({kind:"text",text:l})}};for(;(d=u.exec(r))!==null;){d.index>m&&P(r.slice(m,d.index));let l=d[0];l.startsWith("`")&&l.endsWith("`")?a.push({kind:"code",text:l.slice(1,-1)}):a.push({kind:"link",text:l,href:l}),m=d.index+l.length}return m<r.length&&P(r.slice(m)),a.length>0?a:[{kind:"text",text:r}]}function Bt(o,s){let r={name:"",path:"",kind:"folder",children:[]};for(let u of o){let m=u.newPath.split("/").filter(Boolean),d=r,P="";for(let l=0;l<m.length;l++){let N=m[l];if(P=P?`${P}/${N}`:N,l===m.length-1)d.children.push({name:N,path:u.newPath,kind:"file",children:[],fileChange:u});else{let x=d.children.find(c=>c.kind==="folder"&&c.name===N);x||(x={name:N,path:P,kind:"folder",children:[]},d.children.push(x)),d=x}}}function a(u){return u.map(d=>{if(d.kind==="file")return d;let P={...d,children:a(d.children)};for(;s&&P.children.length===1&&P.children[0].kind==="folder";){let l=P.children[0];P={name:`${P.name}/${l.name}`,path:l.path,kind:"folder",children:l.children}}return P}).sort((d,P)=>d.kind!==P.kind?d.kind==="folder"?-1:1:d.name.localeCompare(P.name))}return a(r.children)}function Ot(o){let s=[],r=0,a=o.lines;for(;r<a.length;){let u=a[r];if(u.type==="context"){s.push({leftLineNumber:u.oldLineNumber,leftContent:u.content,leftType:"context",rightLineNumber:u.newLineNumber,rightContent:u.content,rightType:"context"}),r+=1;continue}if(u.type==="meta"){s.push({leftLineNumber:null,leftContent:u.content,leftType:"meta",rightLineNumber:null,rightContent:u.content,rightType:"meta"}),r+=1;continue}let m=[],d=[];for(;r<a.length&&a[r].type==="del";)m.push(a[r]),r+=1;for(;r<a.length&&a[r].type==="add";)d.push(a[r]),r+=1;let P=Math.max(m.length,d.length);for(let l=0;l<P;l++){let N=m[l],b=d[l];s.push({leftLineNumber:N?N.oldLineNumber:null,leftContent:N?N.content:"",leftType:N?"del":"empty",rightLineNumber:b?b.newLineNumber:null,rightContent:b?b.content:"",rightType:b?"add":"empty"})}}return s}function ot(o,s,r=Date.now()){if(!o)return"";let a=new Date(o*1e3);if(s==="iso")return a.toISOString().slice(0,16).replace("T"," ");if(s==="datetime")return a.toLocaleString();let u=Math.max(0,Math.floor((r-o*1e3)/1e3));if(u<60)return"just now";let m=Math.floor(u/60);if(m<60)return`${m}m ago`;let d=Math.floor(m/60);if(d<24)return`${d}h ago`;let P=Math.floor(d/24);if(P<30)return`${P}d ago`;let l=Math.floor(P/30);return l<12?`${l}mo ago`:`${Math.floor(P/365)}y ago`}var Wt=globalThis.__ZCC_HOST_REACT__,j=Wt.Fragment;function e(o,s,r){return Wt.createElement(o,r===void 0?s:{...s,key:r})}var t=e;function Vt(o){let[s,r]=w(!1),[a,u]=w(""),{repos:m,selectedRepoRelPath:d,onSelectRepo:P,branches:l,remoteBranches:N,repoSettings:b,globalSettings:x,onUpdateRepoSettings:c,onUpdateGlobalSettings:A,onFetch:h,onScrollToHead:$,onToggleFind:S,findOpen:C,onOpenRepoSettings:f,onRefresh:V,projects:ee,selectedProjectId:ue,onSelectProject:me,loading:H,headerActions:I}=o,q=b.selectedBranches,D=q.length===0,oe=[...l,...b.showRemoteBranches?N.map(T=>`remotes/${T}`):[]].filter(T=>!a.trim()||T.toLowerCase().includes(a.trim().toLowerCase())),Re=T=>{let J=new Set(q);J.has(T)?J.delete(T):J.add(T),c({selectedBranches:[...J]})};return t("header",{className:"gg-control-bar git-graph-toolbar",role:"toolbar","aria-label":"Git Tree controls",children:[t("div",{className:"git-graph-toolbar-left",children:[e("span",{className:"git-graph-title",children:"\u2442 Git Tree"}),ee&&ee.length>1&&t("label",{className:"gg-control-project-label",children:[e("span",{className:"gg-control-muted-label",children:"Project:"}),e("select",{"aria-label":"Select project",className:"gg-select git-graph-select",value:ue,onChange:T=>me?.(T.target.value),children:ee.map(T=>e("option",{value:T.id,children:T.name},T.id))})]}),m.length>1&&t("label",{className:"gg-control-project-label",children:[e("span",{className:"gg-control-muted-label",children:"Repo:"}),e("select",{"aria-label":"Select repository",className:"gg-select git-graph-select",value:d,onChange:T=>P(T.target.value),children:m.map(T=>t("option",{value:T.relPath,children:[T.label," ",T.currentBranch?`(${T.currentBranch})`:""]},T.relPath||"root"))})]}),t("div",{style:{position:"relative",zIndex:s?100:1},children:[e("button",{type:"button",className:`gg-btn git-graph-btn ${D?"":"git-graph-btn--active"}`,"aria-label":"Filter branches","aria-expanded":s,onClick:()=>r(T=>!T),"data-testid":"gg-branches-filter-btn",children:t("span",{children:["\u2442 Branches:"," ",D?"Show All":q.length===1?q[0]:`${q.length} selected`," \u25BE"]})}),s&&t(j,{children:[e("div",{className:"gg-context-overlay-fixed",onClick:()=>r(!1)}),t("div",{className:"gg-popover git-graph-popover",role:"dialog","aria-label":"Branch filter","data-testid":"gg-branches-popover",children:[t("div",{className:"gg-branch-filter-header",children:[e("strong",{className:"gg-font-12",children:"Filter Branches"}),e("button",{type:"button",className:"gg-btn git-graph-btn",onClick:()=>r(!1),children:"Close"})]}),e("input",{type:"search",className:"git-graph-input",placeholder:"Filter branch list...",value:a,onChange:T=>u(T.target.value)}),t("label",{className:"git-graph-checkbox-row",children:[e("input",{type:"checkbox",checked:D,onChange:()=>c({selectedBranches:[]})}),e("span",{children:"Show All Branches"})]}),t("label",{className:"git-graph-checkbox-row",children:[e("input",{type:"checkbox",checked:b.showRemoteBranches,onChange:T=>c({showRemoteBranches:T.target.checked})}),e("span",{children:"Show Remote Branches"})]}),t("label",{className:"git-graph-checkbox-row",children:[e("input",{type:"checkbox",checked:b.showTags,onChange:T=>c({showTags:T.target.checked})}),e("span",{children:"Show Tags"})]}),t("label",{className:"git-graph-checkbox-row",children:[e("input",{type:"checkbox",checked:b.showStashes,onChange:T=>c({showStashes:T.target.checked})}),e("span",{children:"Show Stashes"})]}),t("label",{className:"git-graph-checkbox-row",children:[e("input",{type:"checkbox",checked:b.onlyFollowFirstParent,onChange:T=>c({onlyFollowFirstParent:T.target.checked})}),e("span",{children:"Only Follow First Parent"})]}),e("div",{className:"git-graph-context-sep"}),e("div",{className:"gg-branch-scroll-list",children:oe.map(T=>t("label",{className:"git-graph-checkbox-row",children:[e("input",{type:"checkbox",checked:q.includes(T),onChange:()=>Re(T)}),e("span",{className:"gg-ellipsis",children:T})]},T))})]})]})]}),t("select",{"aria-label":"Commit ordering",className:"gg-select git-graph-select",value:b.commitOrdering,onChange:T=>c({commitOrdering:T.target.value}),title:"Commit order",children:[e("option",{value:"date",children:"Order: Commit Date"}),e("option",{value:"author-date",children:"Order: Author Date"}),e("option",{value:"topo",children:"Order: Topological"})]}),t("button",{type:"button",className:"gg-btn git-graph-btn",title:"Toggle rounded or angular graph lines",onClick:()=>A({graphStyle:x.graphStyle==="rounded"?"angular":"rounded"}),children:["Style: ",x.graphStyle==="rounded"?"Rounded":"Angular"]}),t("button",{type:"button",className:"gg-btn git-graph-btn",title:"Toggle Commit Details location (Docked split vs Inline row)",onClick:()=>A({commitDetailsLocation:x.commitDetailsLocation==="docked"?"inline":"docked"}),children:["Details: ",x.commitDetailsLocation==="docked"?"Docked":"Inline"]})]}),t("div",{className:"git-graph-toolbar-right",children:[e("button",{type:"button",className:"gg-btn git-graph-btn",onClick:h,disabled:H,title:"Fetch from Remote(s)",children:"\u2B07 Fetch"}),e("button",{type:"button",className:"gg-btn git-graph-btn",onClick:$,title:"Scroll to HEAD (Ctrl/Cmd+H)",children:"\u2316 HEAD"}),e("button",{type:"button",className:`gg-btn git-graph-btn ${C?"git-graph-btn--active active":""}`,onClick:S,title:"Find commits, branches, or tags (Ctrl/Cmd+F)","data-testid":"gg-find-btn",children:"\u{1F50D} Find"}),e("button",{type:"button",className:"gg-btn git-graph-btn",onClick:f,title:"Repository Settings (Remotes, Issue Linking, Pull Requests)","data-testid":"gg-repo-settings-btn",children:"\u2699 Settings"}),t("button",{type:"button",className:"gg-btn git-graph-btn",onClick:V,disabled:H,title:"Refresh Git Tree (Ctrl/Cmd+R)",children:["\u21BB ",H?"Loading\u2026":"Refresh"]}),I]})]})}function Ut(o){let{query:s,onChangeQuery:r,matchCount:a,activeMatchIndex:u,onPrev:m,onNext:d,onClose:P}=o;return t("div",{className:"git-graph-find-bar",role:"search","aria-label":"Find in Git Tree","data-testid":"gg-find-widget",children:[e("input",{type:"search",className:"git-graph-input gg-find-input-width","aria-label":"Find commits",placeholder:"Find commit, hash, author, branch, tag...",value:s,autoFocus:!0,onChange:l=>r(l.target.value),onKeyDown:l=>{l.key==="Enter"?(l.preventDefault(),l.shiftKey?m():d()):l.key==="Escape"&&(l.preventDefault(),P())},"data-testid":"gg-find-input"}),e("span",{className:"gg-find-count-badge",children:s.trim()?a>0?`${u+1} / ${a}`:"0 / 0":""}),e("button",{type:"button",className:"git-graph-btn",disabled:a===0,onClick:m,title:"Previous match (Shift+Enter)","data-testid":"gg-find-prev",children:"\u2191"}),e("button",{type:"button",className:"git-graph-btn",disabled:a===0,onClick:d,title:"Next match (Enter)","data-testid":"gg-find-next",children:"\u2193"}),e("button",{type:"button",className:"git-graph-btn",onClick:P,"aria-label":"Close find widget",children:"\u2715"})]})}var qt="zcc.gitTree.commitDetailsFilesWidth",Zt="zcc.gitTree.commitDetailsFilesHeight",gt="zcc.gitTree.commitDetailsHeight",xt="zcc.gitTree.commitDetailsWidth",vt=200,pt=100,Yt=260,xn=320;function Kt(o){try{if(typeof localStorage>"u")return null;let s=Number(localStorage.getItem(o));return Number.isFinite(s)&&s>0?s:null}catch{return null}}function ye(o,s){try{if(typeof localStorage>"u")return;s===null?localStorage.removeItem(o):localStorage.setItem(o,String(s))}catch{}}function Jt(o,s){if(!o.length)return 290;let r=0;for(let a of o){let u=s==="list"?a.oldPath!==a.newPath?`${a.oldPath} \u2192 ${a.newPath}`:a.newPath:a.newPath.split("/").pop()||a.newPath;u.length>r&&(r=u.length)}return Math.max(260,Math.min(650,Math.round(r*7.8+120)))}function yt({mode:o,details:s,comparison:r,loading:a,inline:u,fileViewType:m,compactFolders:d,diffViewMode:P,dateFormat:l,issueRules:N,codeReview:b,selectedFilePath:x,fileDiff:c,loadingDiff:A,fileContent:h,loadingContent:$,onSelectFile:S,onLoadFileContent:C,onChangeFileViewType:f,onToggleCompactFolders:V,onChangeDiffViewMode:ee,onStartCodeReview:ue,onToggleReviewedFile:me,onEndCodeReview:H,onSelectParentHash:I,onAskAgent:q,onCopyText:D,onClose:oe}){let[Re,T]=w({}),[J,Fe]=w("diff"),Ae=Q(null),Te=Q(null),Pe=Q(null),he=Q(null),te=pe(()=>o==="comparison"?r?.fileChanges??[]:s?.fileChanges??[],[o,s,r]),we=o==="comparison"?`${r?.fromHash??""}..${r?.toHash??""}`:s?.hash??"",[be,Ie]=w(()=>Kt(gt)),[ke,qe]=w(()=>Kt(xt)),[Ce,je]=w(!1),[Ze,He]=w(!1),[Ne,Me]=w(()=>Jt(te,m)),[De,Ye]=w(!1),[Ee,Ge]=w(()=>{let g=te.length*28+48;return Math.min(260,Math.max(pt,g))}),Be=Q(we);le(()=>{Be.current!==we&&(Be.current=we,He(!1),Ye(!1))},[we]);let ae=Q(null),Le=Q(null),ce=Q(null),Ke=Q(null);le(()=>()=>{ae.current?.(),Le.current?.(),ce.current?.(),Ke.current?.(),document.body.style.cursor="",document.body.style.userSelect=""},[]),le(()=>{let g=Pe.current;if(!g)return;let M=()=>{g&&g.clientWidth>0&&je(g.clientWidth<=640)};if(M(),window.addEventListener("resize",M),typeof ResizeObserver<"u"){let v=new ResizeObserver(M);return v.observe(g),()=>{window.removeEventListener("resize",M),v.disconnect()}}return()=>window.removeEventListener("resize",M)},[]),Ft(()=>{if(te.length===0)return;let g=()=>{let v=he.current,R=Pe.current;if(!(!v||!R))if(Ce){if(De)return;let F=R.clientHeight>0?R.clientHeight:500,L=Math.floor(F*.5),y=0,Y=v.querySelectorAll(".gg-file-row, .gg-folder-row");Y.length>0?(Y.forEach(xe=>{y+=(xe.offsetHeight||26)+2}),y+=8):y=te.length*26+8;let K=Math.max(v.scrollHeight+48,y+48),W=K>L?L:Math.max(pt,K),ne=Math.max(pt,Math.min(Math.floor(F*.8),W));Ge(ne)}else{if(Ze)return;let F=0;v.querySelectorAll(".gg-file-row, .gg-folder-row").forEach(W=>{let ne=W.querySelector(".gg-file-path");if(ne){let xe=Math.max(0,ne.scrollWidth-ne.clientWidth),et=W.offsetWidth+xe;et>F&&(F=et)}else W.scrollWidth>F&&(F=W.scrollWidth)});let y=F>0?F+24:0;y<=0&&(y=Jt(te,m));let Y=R.clientWidth>0?Math.floor(R.clientWidth*.6):650,K=Math.max(vt,Math.min(Math.max(vt,Y),y));Me(K)}};g();let M=requestAnimationFrame(g);return()=>cancelAnimationFrame(M)},[te,m,d,Ze,De,Ce]);let it=g=>{g.preventDefault(),document.body.style.cursor="row-resize",document.body.style.userSelect="none";let M=g.clientY,v=Ee,R=v,F=Y=>{let K=Y.clientY-M,W=Pe.current,ne=W&&W.clientHeight>0?W.clientHeight:600,xe=Math.floor(ne*.8);R=Math.max(pt,Math.min(xe,Math.round(v+K))),Ge(R),Ye(!0)},L=()=>{document.body.style.cursor="",document.body.style.userSelect="",window.removeEventListener("mousemove",F),window.removeEventListener("mouseup",y),Le.current=null},y=()=>{L(),ye(Zt,R)};Le.current=L,window.addEventListener("mousemove",F),window.addEventListener("mouseup",y)},Oe=()=>{Ye(!1),ye(Zt,null)},at=g=>{g.preventDefault(),document.body.style.cursor="col-resize",document.body.style.userSelect="none";let M=g.clientX,v=Ne,R=v,F=Y=>{let K=Y.clientX-M,W=Pe.current,ne=W&&W.clientWidth>0?Math.floor(W.clientWidth*.75):800;R=Math.max(vt,Math.min(ne,Math.round(v+K))),Me(R),He(!0)},L=()=>{document.body.style.cursor="",document.body.style.userSelect="",window.removeEventListener("mousemove",F),window.removeEventListener("mouseup",y),ae.current=null},y=()=>{L(),ye(qt,R)};ae.current=L,window.addEventListener("mousemove",F),window.addEventListener("mouseup",y)},Je=()=>{He(!1),ye(qt,null)},Xe=g=>{g.preventDefault(),document.body.style.cursor="row-resize",document.body.style.userSelect="none";let M=g.clientY,v=Te.current?.offsetHeight??(be||480),R=v,F=Y=>{let K=M-Y.clientY,W=typeof window<"u"?Math.round(window.innerHeight*.88):900;R=Math.max(Yt,Math.min(W,Math.round(v+K))),Ie(R)},L=()=>{document.body.style.cursor="",document.body.style.userSelect="",window.removeEventListener("mousemove",F),window.removeEventListener("mouseup",y),ce.current=null},y=()=>{L(),ye(gt,R)};ce.current=L,window.addEventListener("mousemove",F),window.addEventListener("mouseup",y)},X=g=>{g.preventDefault(),document.body.style.cursor="row-resize",document.body.style.userSelect="none";let M=g.clientY,v=Te.current?.offsetHeight??(be||480),R=v,F=Y=>{let K=Y.clientY-M,W=typeof window<"u"?Math.round(window.innerHeight*.88):900;R=Math.max(Yt,Math.min(W,Math.round(v+K))),Ie(R)},L=()=>{document.body.style.cursor="",document.body.style.userSelect="",window.removeEventListener("mousemove",F),window.removeEventListener("mouseup",y),ce.current=null},y=()=>{L(),ye(gt,R)};ce.current=L,window.addEventListener("mousemove",F),window.addEventListener("mouseup",y)},Qe=()=>{Ie(null),ye(gt,null)},We=g=>{g.preventDefault(),document.body.style.cursor="col-resize",document.body.style.userSelect="none";let M=g.clientX,v=Te.current?.offsetWidth??(ke||500),R=v,F=Y=>{let K=M-Y.clientX,W=typeof window<"u"?Math.round(window.innerWidth*.8):1e3;R=Math.max(xn,Math.min(W,Math.round(v+K))),qe(R)},L=()=>{document.body.style.cursor="",document.body.style.userSelect="",window.removeEventListener("mousemove",F),window.removeEventListener("mouseup",y),Ke.current=null},y=()=>{L(),ye(xt,R)};Ke.current=L,window.addEventListener("mousemove",F),window.addEventListener("mouseup",y)},Ve=()=>{qe(null),ye(xt,null)},O=pe(()=>{let g={};return be&&(g.height=`${be}px`,g.maxHeight="88vh"),!u&&ke&&(g.width=`${ke}px`,g.maxWidth="80%"),Object.keys(g).length>0?g:void 0},[u,be,ke]);le(()=>{x&&Ae.current&&Ae.current?.scrollIntoView?.({behavior:"smooth",block:"nearest"})},[x]);let fe=pe(()=>Bt(te,d),[te,d]),E=pe(()=>new Set(b?.reviewedFiles??[]),[b]),$e=g=>{T(M=>({...M,[g]:!M[g]}))},ze=g=>dt(g,N).map((v,R)=>v.kind==="code"?e("code",{children:v.text},R):v.kind==="link"&&v.href?e("a",{href:v.href,target:"_blank",rel:"noreferrer",children:v.text},R):e(ve.Fragment,{children:v.text},R)),re=(g,M,v=0)=>{let R=x===g.newPath,F=E.has(g.newPath);return t("div",{className:`gg-file-row ${R?"selected":""}`,style:{paddingLeft:`${12+v*14}px`},onClick:()=>{S(g),J==="source"&&C?.(g.newPath)},"data-testid":`gg-file-row-${g.newPath}`,children:[b&&e("input",{type:"checkbox",checked:F,onClick:L=>L.stopPropagation(),onChange:L=>me(g.newPath,L.target.checked),title:"Mark file as reviewed"}),e("span",{className:`gg-file-status gg-file-status-${g.status}`,children:g.status}),t("span",{className:"gg-file-path",style:{textDecoration:F?"line-through":void 0,opacity:F?.65:1},title:g.oldPath!==g.newPath?`${g.oldPath} \u2192 ${g.newPath}`:g.newPath,children:[M,g.staged!==void 0&&t("span",{className:"gg-file-badge",children:["(",g.staged?"staged":"unstaged",")"]})]}),t("span",{className:"gg-file-stat",children:[g.additions!==null&&g.additions>0&&t("span",{className:"gg-stat-add",children:["+",g.additions]}),g.deletions!==null&&g.deletions>0&&t("span",{className:"gg-stat-del",children:["-",g.deletions]})]}),e("button",{type:"button",className:"gg-btn gg-btn-icon gg-btn-compact-10",title:"Copy File Path",onClick:L=>{L.stopPropagation(),D(g.newPath,"File path")},children:"\u{1F4CB}"})]},`${g.newPath}:${g.staged?"staged":"work"}`)},se=(g,M=0)=>g.map(v=>{if(v.kind==="file"&&v.fileChange)return re(v.fileChange,v.name,M);let R=!!Re[v.path];return t(ve.Fragment,{children:[t("div",{className:"gg-folder-row",style:{paddingLeft:`${12+M*14}px`},onClick:()=>$e(v.path),children:[e("span",{children:R?"\u25B8":"\u25BE"}),t("span",{children:["\u{1F4C1} ",v.name]})]}),!R&&se(v.children,M+1)]},`folder:${v.path}`)});return t("div",{ref:Te,className:`gg-details-pane ${u?"gg-details-inline inline":""}`,style:O,"data-testid":"gg-details-pane",children:[e("div",{className:"gg-details-top-resizer",onMouseDown:Xe,onDoubleClick:Qe,title:"Drag to resize height \xB7 Double-click to reset","data-testid":"gg-details-top-resizer"}),u&&e("div",{className:"gg-details-bottom-resizer",onMouseDown:X,onDoubleClick:Qe,title:"Drag to resize height \xB7 Double-click to reset","data-testid":"gg-details-bottom-resizer"}),!u&&e("div",{className:"gg-details-left-resizer",onMouseDown:We,onDoubleClick:Ve,title:"Drag to resize pane width \xB7 Double-click to reset","data-testid":"gg-details-left-resizer"}),t("div",{className:"gg-details-header",children:[e("div",{className:"gg-details-header-title",children:o==="comparison"&&r?t(j,{children:[e("span",{children:"Comparing"}),e("span",{className:"gg-commit-hash gg-commit-hash-auto",children:r.fromHash.slice(0,7)}),e("span",{children:"\u2194"}),e("span",{className:"gg-commit-hash gg-commit-hash-auto",children:r.toHash.slice(0,7)})]}):s?t(j,{children:[e("span",{children:s.hash==="*"?"Uncommitted Changes":`Commit ${s.abbreviatedHash}`}),s.signature&&t("span",{className:"gg-ref-badge gg-ref-tag",title:s.signature.signer||s.signature.label,children:["\u{1F512} ",s.signature.label]})]}):e("span",{children:"Commit Details"})}),t("div",{className:"gg-flex-row gg-gap-4 gg-flex-shrink-0",children:[e("button",{type:"button",className:"gg-btn gg-btn-primary",onClick:()=>q(x??void 0),title:"Spawn a Zana Agent thread with this commit and diff context","data-testid":"gg-ask-agent-btn",children:"\u2728 Ask Agent"}),b?t("button",{type:"button",className:"gg-btn",onClick:H,title:"End Code Review","data-testid":"gg-end-review-btn",children:["\u2713 End Review (",E.size,"/",te.length,")"]}):e("button",{type:"button",className:"gg-btn",onClick:ue,title:"Start Persistent Code Review","data-testid":"gg-start-review-btn",children:"\u{1F441} Code Review"}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:oe,title:"Close Details (Esc)","data-testid":"gg-close-details-btn",children:"\u2715"})]})]}),a?e("div",{className:"gg-empty",children:"Loading commit details\u2026"}):t("div",{className:"gg-details-body",children:[o==="single"&&s&&s.hash!=="*"&&t("div",{className:"gg-details-meta",children:[t("div",{className:"gg-details-meta-grid",children:[e("span",{className:"gg-details-meta-label",children:"Commit:"}),t("span",{children:[e("code",{children:s.hash})," ",e("button",{type:"button",className:"gg-btn gg-btn-icon gg-btn-compact-10",onClick:()=>D(s.hash,"Commit hash"),children:"Copy"})]}),e("span",{className:"gg-details-meta-label",children:"Parents:"}),e("span",{children:s.parents.length===0?"None (root commit)":s.parents.map((g,M)=>t(ve.Fragment,{children:[M>0&&", ",e("span",{className:"gg-parent-link",onClick:()=>I(g),children:g.slice(0,8)})]},g))}),e("span",{className:"gg-details-meta-label",children:"Author:"}),t("span",{children:[s.authorName," <",s.authorEmail,"> (",ot(s.authorDate,l),")"]}),e("span",{className:"gg-details-meta-label",children:"Committer:"}),t("span",{children:[s.committerName," <",s.committerEmail,"> (",ot(s.commitDate,l),")"]})]}),t("div",{className:"gg-details-message",children:[e("strong",{children:ze(s.subject)}),s.body?`

${s.body}`:""]})]}),t("div",{ref:Pe,className:`gg-details-columns ${Ce?"stacked":"side-by-side"}`,"data-testid":"gg-details-columns",children:[t("div",{className:"gg-details-col-files",style:Ce?{height:`${Ee}px`,flexBasis:`${Ee}px`,width:"100%"}:{width:`${Ne}px`,flexBasis:`${Ne}px`},children:[t("div",{className:"gg-files-toolbar",children:[t("span",{children:["Changed Files (",te.length,")",b?` \u2022 Reviewed ${E.size}/${te.length}`:""]}),t("div",{className:"gg-flex-row gg-gap-4",children:[e("button",{type:"button",className:`gg-btn gg-btn-compact-11 ${m==="tree"?"gg-btn-active":""}`,onClick:()=>f("tree"),"data-testid":"gg-view-tree-btn",children:"Tree"}),e("button",{type:"button",className:`gg-btn gg-btn-compact-11 ${m==="list"?"gg-btn-active":""}`,onClick:()=>f("list"),"data-testid":"gg-view-list-btn",children:"List"}),m==="tree"&&e("button",{type:"button",className:`gg-btn gg-btn-compact-11 ${d?"gg-btn-active":""}`,onClick:V,title:"Compact single-child folders",children:"Compact"})]})]}),e("div",{ref:he,className:"gg-file-list","data-testid":"gg-file-list",children:te.length===0?e("div",{className:"gg-empty gg-pad-12",children:"No file changes in this commit."}):m==="tree"?se(fe):te.map(g=>re(g,g.oldPath!==g.newPath?`${g.oldPath} \u2192 ${g.newPath}`:g.newPath,0))})]}),Ce?e("div",{className:"gg-details-row-resizer",onMouseDown:it,onDoubleClick:Oe,title:"Drag to resize \xB7 Double-click to auto-split","data-testid":"gg-details-row-resizer"}):e("div",{className:"gg-details-col-resizer",onMouseDown:at,onDoubleClick:Je,title:"Drag to resize column \xB7 Double-click to auto-fit","data-testid":"gg-details-col-resizer"}),e("div",{className:"gg-details-col-diff",children:x?t("div",{className:"gg-diff-viewer","data-testid":"gg-diff-viewer",ref:Ae,children:[t("div",{className:"gg-diff-toolbar",children:[e("span",{style:{fontFamily:"var(--font-mono, monospace)",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",fontWeight:600},title:x,children:x}),t("div",{className:"gg-flex-row gg-gap-4",children:[e("button",{type:"button",className:`gg-btn gg-btn-pad-8 ${J==="diff"?"gg-btn-active":""}`,onClick:()=>Fe("diff"),"data-testid":"gg-view-diff-btn",title:"View diff changes",children:"Diff"}),e("button",{type:"button",className:`gg-btn gg-btn-pad-8 ${J==="source"?"gg-btn-active":""}`,onClick:()=>{Fe("source"),x&&!h&&C?.(x)},"data-testid":"gg-view-source-btn",title:"View full source code",children:"Source Code"}),J==="diff"&&t(j,{children:[e("button",{type:"button",className:`gg-btn gg-btn-compact-11 ${P==="unified"?"gg-btn-active":""}`,onClick:()=>ee("unified"),"data-testid":"gg-diff-unified-btn",children:"Unified"}),e("button",{type:"button",className:`gg-btn gg-btn-compact-11 ${P==="split"?"gg-btn-active":""}`,onClick:()=>ee("split"),"data-testid":"gg-diff-split-btn",children:"Split"})]}),e("button",{type:"button",className:"gg-btn gg-btn-icon gg-btn-compact-11",title:J==="source"?"Copy file content":"Copy diff",onClick:()=>D(J==="source"?h?.content??"":c?.rawDiff??"",J==="source"?"Source code":"Diff"),children:"\u{1F4CB}"})]})]}),e("div",{className:"gg-diff-content-scroll",children:J==="source"?$?e("div",{className:"gg-empty gg-pad-16",children:"Loading source code\u2026"}):h?h.isBinary?e("div",{className:"gg-empty gg-pad-16",children:"Binary file \u2014 cannot display text content."}):e("table",{className:"gg-source-table","data-testid":"gg-source-code-table",children:e("tbody",{children:h.content.split(/\r?\n/).map((g,M)=>t("tr",{className:"gg-source-line",children:[e("td",{className:"gg-diff-gutter",children:M+1}),e("td",{className:"gg-diff-code",children:g||" "})]},M))})}):e("div",{className:"gg-empty gg-pad-16",children:"No source code available for this file."}):A?e("div",{className:"gg-empty gg-pad-16",children:"Loading diff\u2026"}):c?c.isBinary?e("div",{className:"gg-empty gg-pad-16",children:"Binary file changed \u2014 inline text diff not available."}):c.hunks.length===0?e("div",{className:"gg-empty gg-pad-16",children:"No textual diff hunks (empty file or mode-only change)."}):P==="unified"?e("table",{className:"gg-diff-table","data-testid":"gg-diff-unified-table",children:e("tbody",{children:c.hunks.map((g,M)=>t(ve.Fragment,{children:[e("tr",{className:"gg-diff-hunk-header",children:e("td",{colSpan:3,className:"gg-diff-code",children:g.header})}),g.lines.map((v,R)=>t("tr",{className:v.type==="add"?"gg-diff-line-add":v.type==="del"?"gg-diff-line-del":"",children:[e("td",{className:"gg-diff-gutter",children:v.oldLineNumber??""}),e("td",{className:"gg-diff-gutter",children:v.newLineNumber??""}),e("td",{className:"gg-diff-code",children:v.type==="add"?`+${v.content}`:v.type==="del"?`-${v.content}`:` ${v.content}`})]},`${M}-${R}`))]},M))})}):e("table",{className:"gg-diff-table","data-testid":"gg-diff-split-table",children:e("tbody",{children:c.hunks.map((g,M)=>{let v=Ot(g);return t(ve.Fragment,{children:[e("tr",{className:"gg-diff-hunk-header",children:e("td",{colSpan:4,className:"gg-diff-code",children:g.header})}),v.map((R,F)=>t("tr",{children:[e("td",{className:`gg-diff-gutter ${R.leftType==="del"?"gg-diff-line-del":""}`,children:R.leftLineNumber??""}),e("td",{className:`gg-diff-code gg-diff-half-width ${R.leftType==="del"?"gg-diff-line-del":""}`,children:R.leftContent}),e("td",{className:`gg-diff-gutter ${R.rightType==="add"?"gg-diff-line-add":""}`,children:R.rightLineNumber??""}),e("td",{className:`gg-diff-code gg-diff-half-width ${R.rightType==="add"?"gg-diff-line-add":""}`,children:R.rightContent})]},`${M}-${F}`))]},M)})})}):e("div",{className:"gg-empty gg-pad-16",children:"Select a file to inspect its diff."})})]}):e("div",{className:"gg-empty",style:{height:"100%",display:"flex",alignItems:"center",justifyContent:"center",padding:"24px"},children:"Select a file from the list to inspect changes."})})]})]})]})}function Xt({target:o,currentBranch:s,hasCommits:r=!0,onClose:a,onRunAction:u,onOpenDialog:m,onOpenPullRequest:d,onViewTagDetails:P,onCopyText:l,onAskAgent:N}){if(!o)return null;let b={left:`${Math.min(o.x,window.innerWidth-220)}px`,top:`${Math.min(o.y,window.innerHeight-320)}px`};return e("div",{className:"gg-context-overlay-fixed",onClick:a,onContextMenu:x=>{x.preventDefault(),a()},children:t("div",{className:"gg-context-menu",style:b,onClick:x=>x.stopPropagation(),"data-testid":"gg-context-menu",children:[o.kind==="branch"&&t(j,{children:[t("div",{className:"gg-context-menu-header",children:["Branch: ",o.ref.name]}),o.ref.name!==s&&e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{a(),u({kind:"checkout-branch",branchName:o.ref.name})},children:"Checkout Branch"}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{a(),m({kind:"rename-branch",branchName:o.ref.name})},children:"Rename Branch\u2026"}),o.ref.name!==s&&t(j,{children:[e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{a(),m({kind:"merge-branch",branchName:o.ref.name})},children:"Merge into Current Branch\u2026"}),t("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{a(),m({kind:"rebase-branch",ontoBranch:o.ref.name})},children:["Rebase Current Branch onto ",o.ref.name,"\u2026"]})]}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{a(),m({kind:"push-branch",branchName:o.ref.name})},children:"Push Branch\u2026"}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{a(),m({kind:"pull-branch",branchName:o.ref.name})},children:"Pull into Branch\u2026"}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{a(),d(o.ref.name)},children:"Create Pull Request\u2026"}),e("div",{className:"gg-context-menu-sep"}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{a(),l(o.ref.name,"Branch name")},children:"Copy Branch Name"}),o.ref.name!==s&&e("button",{type:"button",className:"gg-context-menu-item danger",onClick:()=>{a(),m({kind:"delete-branch",branchName:o.ref.name})},children:"Delete Branch\u2026"})]}),o.kind==="remote-branch"&&t(j,{children:[t("div",{className:"gg-context-menu-header",children:["Remote Branch: ",o.ref.remote,"/",o.ref.name]}),t("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{a(),u({kind:"checkout-branch",branchName:o.ref.name,createAndTrackFrom:`${o.ref.remote}/${o.ref.name}`})},children:["Checkout Branch (Track ",o.ref.remote,"/",o.ref.name,")"]}),t("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{a(),u({kind:"fetch-into-local-branch",remote:o.ref.remote||"origin",remoteBranch:o.ref.name,localBranch:o.ref.name,force:!1})},children:["Fetch into Local Branch (",o.ref.name,")"]}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{a(),m({kind:"merge-branch",branchName:`${o.ref.remote}/${o.ref.name}`})},children:"Merge into Current Branch\u2026"}),e("div",{className:"gg-context-menu-sep"}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{a(),l(`${o.ref.remote}/${o.ref.name}`,"Remote branch name")},children:"Copy Remote Branch Name"}),e("button",{type:"button",className:"gg-context-menu-item danger",onClick:()=>{a(),u({kind:"delete-remote-branch",remote:o.ref.remote||"origin",branchName:o.ref.name})},children:"Delete Remote Branch"})]}),o.kind==="tag"&&t(j,{children:[t("div",{className:"gg-context-menu-header",children:["Tag: ",o.ref.name]}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{a(),P(o.ref.name)},children:"View Tag Details"}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{a(),u({kind:"push-tag",tagName:o.ref.name,remote:"origin"})},children:"Push Tag to origin"}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{a(),l(o.ref.name,"Tag name")},children:"Copy Tag Name"}),e("div",{className:"gg-context-menu-sep"}),e("button",{type:"button",className:"gg-context-menu-item danger",onClick:()=>{a(),u({kind:"delete-tag",tagName:o.ref.name,deleteFromRemote:null})},children:"Delete Tag"})]}),o.kind==="stash"&&t(j,{children:[t("div",{className:"gg-context-menu-header",children:["Stash: ",o.selector]}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{a(),u({kind:"stash-apply",selector:o.selector,reinstateIndex:!1})},children:"Apply Stash"}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{a(),u({kind:"stash-pop",selector:o.selector,reinstateIndex:!1})},children:"Pop Stash"}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{a(),m({kind:"stash-branch",selector:o.selector})},children:"Create Branch from Stash\u2026"}),e("div",{className:"gg-context-menu-sep"}),e("button",{type:"button",className:"gg-context-menu-item danger",onClick:()=>{a(),u({kind:"stash-drop",selector:o.selector})},children:"Drop Stash"})]}),o.kind==="uncommitted"&&t(j,{children:[e("div",{className:"gg-context-menu-header",children:"Uncommitted Changes"}),e("button",{type:"button",className:"gg-context-menu-item",disabled:!r,title:r?void 0:"Cannot stash: Git requires an initial commit before stashing",onClick:()=>{r&&(a(),m({kind:"stash-push"}))},children:"Stash Uncommitted Changes\u2026"}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{a(),N?.("*")},children:"\u2728 Ask Agent to Review Working Tree\u2026"}),e("div",{className:"gg-context-menu-sep"}),e("button",{type:"button",className:"gg-context-menu-item danger",onClick:()=>{a(),u({kind:"reset-uncommitted",mode:"hard"})},children:"Reset Working Tree (Hard)"}),e("button",{type:"button",className:"gg-context-menu-item danger",onClick:()=>{a(),m({kind:"clean-untracked"})},children:"Clean Untracked Files\u2026"})]}),o.kind==="commit"&&t(j,{children:[t("div",{className:"gg-context-menu-header",children:["Commit: ",o.commit.abbreviatedHash]}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{a(),m({kind:"create-branch",commit:o.commit})},children:"Create Branch\u2026"}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{a(),m({kind:"add-tag",commit:o.commit})},children:"Add Tag\u2026"}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{a(),u({kind:"checkout-commit",commitHash:o.commit.hash})},children:"Checkout Commit (Detached HEAD)"}),e("div",{className:"gg-context-menu-sep"}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{a(),m({kind:"cherry-pick",commit:o.commit})},children:"Cherry-Pick Commit\u2026"}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{a(),m({kind:"revert-commit",commit:o.commit})},children:"Revert Commit\u2026"}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{a(),m({kind:"reset-commit",commit:o.commit,defaultMode:"mixed"})},children:"Reset Current Branch to Here\u2026"}),e("button",{type:"button",className:"gg-context-menu-item danger",disabled:o.commit.parents.length===0,title:o.commit.parents.length===0?"Cannot drop the initial (root) commit":void 0,onClick:()=>{o.commit.parents.length!==0&&(a(),m({kind:"drop-commit",commit:o.commit}))},children:"Drop Commit\u2026"}),e("div",{className:"gg-context-menu-sep"}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{a(),N?.(o.commit.hash)},children:"\u2728 Ask Agent about Commit\u2026"}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{a(),l(o.commit.hash,"Commit hash")},children:"Copy Commit Hash"}),e("button",{type:"button",className:"gg-context-menu-item",onClick:()=>{a(),l(o.commit.subject,"Commit subject")},children:"Copy Commit Subject"})]})]})})}function Qt({dialog:o,remotes:s,currentBranch:r,onClose:a,onRunAction:u}){let m=s[0]?.name??"origin",[d,P]=w(""),[l,N]=w(""),[b,x]=w(!0),[c,A]=w(!1),[h,$]=w(!1),[S,C]=w("mixed");return o?e("div",{className:"gg-modal-backdrop",onClick:a,children:t("div",{className:"gg-modal",onClick:f=>f.stopPropagation(),"data-testid":`gg-dialog-${o.kind}`,children:[o.kind==="create-branch"&&t(j,{children:[t("div",{className:"gg-modal-header",children:[t("span",{children:["Create Branch at ",o.commit.abbreviatedHash]}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:a,children:"\u2715"})]}),t("div",{className:"gg-modal-body",children:[t("div",{className:"gg-field",children:[e("label",{className:"gg-field-label",children:"Branch Name"}),e("input",{type:"text",className:"gg-input",placeholder:"feature/my-branch",value:d,onChange:f=>P(f.target.value),autoFocus:!0})]}),t("label",{className:"gg-checkbox-row",children:[e("input",{type:"checkbox",checked:b,onChange:f=>x(f.target.checked)}),e("span",{children:"Check out branch after creation"})]})]}),t("div",{className:"gg-modal-footer",children:[e("button",{type:"button",className:"gg-btn",onClick:a,children:"Cancel"}),e("button",{type:"button",className:"gg-btn gg-btn-primary",disabled:!d.trim(),onClick:()=>{u({kind:"create-branch",branchName:d.trim(),startPoint:o.commit.hash,checkout:b}),a()},children:"Create Branch"})]})]}),o.kind==="rename-branch"&&t(j,{children:[t("div",{className:"gg-modal-header",children:[t("span",{children:["Rename Branch ",o.branchName]}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:a,children:"\u2715"})]}),e("div",{className:"gg-modal-body",children:t("div",{className:"gg-field",children:[e("label",{className:"gg-field-label",children:"New Branch Name"}),e("input",{type:"text",className:"gg-input",value:d,placeholder:o.branchName,onChange:f=>P(f.target.value),autoFocus:!0})]})}),t("div",{className:"gg-modal-footer",children:[e("button",{type:"button",className:"gg-btn",onClick:a,children:"Cancel"}),e("button",{type:"button",className:"gg-btn gg-btn-primary",disabled:!d.trim(),onClick:()=>{u({kind:"rename-branch",oldName:o.branchName,newName:d.trim()}),a()},children:"Rename"})]})]}),o.kind==="delete-branch"&&t(j,{children:[t("div",{className:"gg-modal-header",children:[t("span",{children:["Delete Branch ",o.branchName]}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:a,children:"\u2715"})]}),e("div",{className:"gg-modal-body",children:t("label",{className:"gg-checkbox-row",children:[e("input",{type:"checkbox",checked:c,onChange:f=>A(f.target.checked)}),e("span",{children:"Force delete (-D) even if unmerged"})]})}),t("div",{className:"gg-modal-footer",children:[e("button",{type:"button",className:"gg-btn",onClick:a,children:"Cancel"}),e("button",{type:"button",className:"gg-btn gg-btn-primary",onClick:()=>{u({kind:"delete-branch",branchName:o.branchName,force:c}),a()},children:"Delete Branch"})]})]}),o.kind==="merge-branch"&&t(j,{children:[t("div",{className:"gg-modal-header",children:[t("span",{children:["Merge ",o.branchName," into Current Branch"]}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:a,children:"\u2715"})]}),t("div",{className:"gg-modal-body",children:[t("label",{className:"gg-checkbox-row",children:[e("input",{type:"checkbox",checked:c,onChange:f=>A(f.target.checked)}),e("span",{children:"Create a new commit even if fast-forward is possible (--no-ff)"})]}),t("label",{className:"gg-checkbox-row",children:[e("input",{type:"checkbox",checked:h,onChange:f=>$(f.target.checked)}),e("span",{children:"Squash commits (--squash)"})]})]}),t("div",{className:"gg-modal-footer",children:[e("button",{type:"button",className:"gg-btn",onClick:a,children:"Cancel"}),e("button",{type:"button",className:"gg-btn gg-btn-primary",onClick:()=>{u({kind:"merge",target:o.branchName,noFastForward:c,squash:h,noCommit:!1}),a()},children:"Merge"})]})]}),o.kind==="rebase-branch"&&t(j,{children:[t("div",{className:"gg-modal-header",children:[t("span",{children:["Rebase Current Branch onto ",o.ontoBranch]}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:a,children:"\u2715"})]}),e("div",{className:"gg-modal-body",children:t("label",{className:"gg-checkbox-row",children:[e("input",{type:"checkbox",checked:b,onChange:f=>x(f.target.checked)}),e("span",{children:"Auto-stash uncommitted changes before rebase (--autostash)"})]})}),t("div",{className:"gg-modal-footer",children:[e("button",{type:"button",className:"gg-btn",onClick:a,children:"Cancel"}),e("button",{type:"button",className:"gg-btn gg-btn-primary",onClick:()=>{u({kind:"rebase",onto:o.ontoBranch,autostash:b}),a()},children:"Rebase"})]})]}),o.kind==="push-branch"&&t(j,{children:[t("div",{className:"gg-modal-header",children:[t("span",{children:["Push Branch ",o.branchName]}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:a,children:"\u2715"})]}),t("div",{className:"gg-modal-body",children:[t("div",{className:"gg-field",children:[e("label",{className:"gg-field-label",children:"Remote"}),e("input",{type:"text",className:"gg-input",value:d||m,onChange:f=>P(f.target.value)})]}),t("label",{className:"gg-checkbox-row",children:[e("input",{type:"checkbox",checked:b,onChange:f=>x(f.target.checked)}),e("span",{children:"Set upstream (-u)"})]}),t("label",{className:"gg-checkbox-row",children:[e("input",{type:"checkbox",checked:c,onChange:f=>A(f.target.checked)}),e("span",{children:"Force with lease (--force-with-lease)"})]})]}),t("div",{className:"gg-modal-footer",children:[e("button",{type:"button",className:"gg-btn",onClick:a,children:"Cancel"}),e("button",{type:"button",className:"gg-btn gg-btn-primary",onClick:()=>{u({kind:"push-branch",branchName:o.branchName,remote:(d||m).trim(),setUpstream:b,forceMode:c?"force-with-lease":"none"}),a()},children:"Push"})]})]}),o.kind==="pull-branch"&&t(j,{children:[t("div",{className:"gg-modal-header",children:[t("span",{children:["Pull Branch ",o.branchName]}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:a,children:"\u2715"})]}),t("div",{className:"gg-modal-body",children:[t("div",{className:"gg-field",children:[e("label",{className:"gg-field-label",children:"Remote"}),e("input",{type:"text",className:"gg-input",value:d||m,onChange:f=>P(f.target.value)})]}),t("label",{className:"gg-checkbox-row",children:[e("input",{type:"checkbox",checked:c,onChange:f=>A(f.target.checked)}),e("span",{children:"Rebase instead of merge (--rebase)"})]})]}),t("div",{className:"gg-modal-footer",children:[e("button",{type:"button",className:"gg-btn",onClick:a,children:"Cancel"}),e("button",{type:"button",className:"gg-btn gg-btn-primary",onClick:()=>{u({kind:"pull-branch",remote:(d||m).trim(),branchName:o.branchName,noFastForward:!1,squash:!1,rebase:c}),a()},children:"Pull"})]})]}),o.kind==="cherry-pick"&&t(j,{children:[t("div",{className:"gg-modal-header",children:[t("span",{children:["Cherry-Pick Commit ",o.commit.abbreviatedHash]}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:a,children:"\u2715"})]}),t("div",{className:"gg-modal-body",children:[t("label",{className:"gg-checkbox-row",children:[e("input",{type:"checkbox",checked:b,onChange:f=>x(f.target.checked)}),e("span",{children:"Record origin commit hash in message (-x)"})]}),t("label",{className:"gg-checkbox-row",children:[e("input",{type:"checkbox",checked:c,onChange:f=>A(f.target.checked)}),e("span",{children:"Stage changes without committing (--no-commit)"})]})]}),t("div",{className:"gg-modal-footer",children:[e("button",{type:"button",className:"gg-btn",onClick:a,children:"Cancel"}),e("button",{type:"button",className:"gg-btn gg-btn-primary",onClick:()=>{u({kind:"cherry-pick",commitHash:o.commit.hash,parentIndex:o.commit.parents.length>1?1:void 0,recordOrigin:b,noCommit:c}),a()},children:"Cherry-Pick"})]})]}),o.kind==="revert-commit"&&t(j,{children:[t("div",{className:"gg-modal-header",children:[t("span",{children:["Revert Commit ",o.commit.abbreviatedHash]}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:a,children:"\u2715"})]}),e("div",{className:"gg-modal-body",children:t("label",{className:"gg-checkbox-row",children:[e("input",{type:"checkbox",checked:c,onChange:f=>A(f.target.checked)}),e("span",{children:"Stage revert changes without committing (--no-commit)"})]})}),t("div",{className:"gg-modal-footer",children:[e("button",{type:"button",className:"gg-btn",onClick:a,children:"Cancel"}),e("button",{type:"button",className:"gg-btn gg-btn-primary",onClick:()=>{u({kind:"revert-commit",commitHash:o.commit.hash,parentIndex:o.commit.parents.length>1?1:void 0,noCommit:c}),a()},children:"Revert"})]})]}),o.kind==="reset-commit"&&t(j,{children:[t("div",{className:"gg-modal-header",children:[t("span",{children:["Reset Current Branch to ",o.commit.abbreviatedHash]}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:a,children:"\u2715"})]}),e("div",{className:"gg-modal-body",children:t("div",{className:"gg-field",children:[e("label",{className:"gg-field-label",children:"Reset Mode"}),t("select",{className:"gg-select",value:S,onChange:f=>C(f.target.value),children:[e("option",{value:"soft",children:"Soft \u2014 Keep all changes staged"}),e("option",{value:"mixed",children:"Mixed \u2014 Keep working tree, unstage index"}),e("option",{value:"hard",children:"Hard \u2014 Discard all uncommitted changes"})]})]})}),t("div",{className:"gg-modal-footer",children:[e("button",{type:"button",className:"gg-btn",onClick:a,children:"Cancel"}),t("button",{type:"button",className:"gg-btn gg-btn-primary",onClick:()=>{u({kind:"reset-to-commit",commitHash:o.commit.hash,mode:S}),a()},children:["Reset (",S,")"]})]})]}),o.kind==="drop-commit"&&t(j,{children:[t("div",{className:"gg-modal-header",children:[t("span",{children:["Drop Commit ",o.commit.abbreviatedHash,"?"]}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:a,children:"\u2715"})]}),e("div",{className:"gg-modal-body",children:t("p",{className:"gg-margin-0 gg-font-12",children:["This will rebase ",e("code",{children:"HEAD"})," onto the parent of"," ",e("code",{children:o.commit.abbreviatedHash}),", removing this commit from the current branch history."]})}),t("div",{className:"gg-modal-footer",children:[e("button",{type:"button",className:"gg-btn",onClick:a,children:"Cancel"}),e("button",{type:"button",className:"gg-btn gg-btn-primary",onClick:()=>{u({kind:"drop-commit",commitHash:o.commit.hash,branch:r??void 0}),a()},children:"Drop Commit"})]})]}),o.kind==="add-tag"&&t(j,{children:[t("div",{className:"gg-modal-header",children:[t("span",{children:["Add Tag at ",o.commit.abbreviatedHash]}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:a,children:"\u2715"})]}),t("div",{className:"gg-modal-body",children:[t("div",{className:"gg-field",children:[e("label",{className:"gg-field-label",children:"Tag Name"}),e("input",{type:"text",className:"gg-input",placeholder:"v1.0.0",value:d,onChange:f=>P(f.target.value),autoFocus:!0})]}),t("label",{className:"gg-checkbox-row",children:[e("input",{type:"checkbox",checked:b,onChange:f=>x(f.target.checked)}),e("span",{children:"Annotated Tag (-a)"})]}),b&&t("div",{className:"gg-field",children:[e("label",{className:"gg-field-label",children:"Tag Message"}),e("input",{type:"text",className:"gg-input",placeholder:"Release v1.0.0",value:l,onChange:f=>N(f.target.value)})]}),t("label",{className:"gg-checkbox-row",children:[e("input",{type:"checkbox",checked:c,onChange:f=>A(f.target.checked)}),t("span",{children:["Push tag to ",m," immediately"]})]})]}),t("div",{className:"gg-modal-footer",children:[e("button",{type:"button",className:"gg-btn",onClick:a,children:"Cancel"}),e("button",{type:"button",className:"gg-btn gg-btn-primary",disabled:!d.trim(),onClick:()=>{u({kind:"create-tag",tagName:d.trim(),commitHash:o.commit.hash,annotated:b,message:l.trim()||d.trim(),pushToRemote:c?m:null}),a()},children:"Create Tag"})]})]}),o.kind==="tag-details"&&t(j,{children:[t("div",{className:"gg-modal-header",children:[t("span",{children:["Tag Details: ",o.tagName]}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:a,children:"\u2715"})]}),e("div",{className:"gg-modal-body",children:o.details?t("div",{className:"gg-details-meta-grid",children:[e("span",{className:"gg-details-meta-label",children:"Name:"}),e("span",{children:o.details.name}),e("span",{className:"gg-details-meta-label",children:"Type:"}),e("span",{children:o.details.isAnnotated?"Annotated":"Lightweight"}),e("span",{className:"gg-details-meta-label",children:"Target:"}),e("code",{children:o.details.hash}),o.details.taggerName&&t(j,{children:[e("span",{className:"gg-details-meta-label",children:"Tagger:"}),t("span",{children:[o.details.taggerName," <",o.details.taggerEmail,">"]})]}),o.details.message&&t(j,{children:[e("span",{className:"gg-details-meta-label",children:"Message:"}),e("span",{children:o.details.message})]})]}):e("div",{children:"Loading tag details\u2026"})}),e("div",{className:"gg-modal-footer",children:e("button",{type:"button",className:"gg-btn",onClick:a,children:"Close"})})]}),o.kind==="stash-push"&&t(j,{children:[t("div",{className:"gg-modal-header",children:[e("span",{children:"Stash Uncommitted Changes"}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:a,children:"\u2715"})]}),t("div",{className:"gg-modal-body",children:[t("div",{className:"gg-field",children:[e("label",{className:"gg-field-label",children:"Stash Message (optional)"}),e("input",{type:"text",className:"gg-input",placeholder:"WIP: feature changes",value:d,onChange:f=>P(f.target.value),autoFocus:!0})]}),t("label",{className:"gg-checkbox-row",children:[e("input",{type:"checkbox",checked:b,onChange:f=>x(f.target.checked)}),e("span",{children:"Include untracked files (-u)"})]})]}),t("div",{className:"gg-modal-footer",children:[e("button",{type:"button",className:"gg-btn",onClick:a,children:"Cancel"}),e("button",{type:"button",className:"gg-btn gg-btn-primary",onClick:()=>{u({kind:"stash-push",message:d.trim()||void 0,includeUntracked:b}),a()},children:"Stash Changes"})]})]}),o.kind==="stash-branch"&&t(j,{children:[t("div",{className:"gg-modal-header",children:[t("span",{children:["Create Branch from ",o.selector]}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:a,children:"\u2715"})]}),e("div",{className:"gg-modal-body",children:t("div",{className:"gg-field",children:[e("label",{className:"gg-field-label",children:"Branch Name"}),e("input",{type:"text",className:"gg-input",placeholder:"stash-recovery",value:d,onChange:f=>P(f.target.value),autoFocus:!0})]})}),t("div",{className:"gg-modal-footer",children:[e("button",{type:"button",className:"gg-btn",onClick:a,children:"Cancel"}),e("button",{type:"button",className:"gg-btn gg-btn-primary",disabled:!d.trim(),onClick:()=>{u({kind:"stash-branch",selector:o.selector,branchName:d.trim()}),a()},children:"Create Branch"})]})]}),o.kind==="clean-untracked"&&t(j,{children:[t("div",{className:"gg-modal-header",children:[e("span",{children:"Clean Untracked Files"}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:a,children:"\u2715"})]}),e("div",{className:"gg-modal-body",children:t("label",{className:"gg-checkbox-row",children:[e("input",{type:"checkbox",checked:b,onChange:f=>x(f.target.checked)}),e("span",{children:"Include untracked directories (-d)"})]})}),t("div",{className:"gg-modal-footer",children:[e("button",{type:"button",className:"gg-btn",onClick:a,children:"Cancel"}),e("button",{type:"button",className:"gg-btn gg-btn-primary",onClick:()=>{u({kind:"clean-untracked",includeDirectories:b}),a()},children:"Clean Files"})]})]})]})}):null}function en({open:o,remotes:s,repoSettings:r,globalSettings:a,onClose:u,onRunGitAction:m,onUpdateRepoSettings:d,onUpdateGlobalSettings:P,onExportRepoConfig:l}){let[N,b]=w(""),[x,c]=w(""),[A,h]=w(""),[$,S]=w("");return o?e("div",{className:"gg-modal-backdrop",onClick:u,children:t("div",{className:"gg-modal gg-modal-width-settings",onClick:C=>C.stopPropagation(),"data-testid":"gg-repo-settings-modal",children:[t("div",{className:"gg-modal-header",children:[e("span",{children:"Repository & Graph Settings"}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:u,children:"\u2715"})]}),t("div",{className:"gg-modal-body gg-gap-16",children:[t("div",{className:"gg-field",children:[t("label",{className:"gg-field-label",children:["Git Remotes (",s.length,")"]}),t("div",{className:"gg-flex-col gg-gap-6",children:[s.map(C=>t("div",{className:"gg-remote-card",children:[t("div",{className:"gg-overflow-hidden",children:[e("strong",{children:C.name}),e("div",{className:"gg-font-11 gg-text-secondary gg-ellipsis",children:C.fetchUrl})]}),t("div",{className:"gg-flex-row gg-gap-4 gg-flex-shrink-0",children:[e("button",{type:"button",className:"gg-btn",onClick:()=>m({kind:"remote-prune",name:C.name}),title:"Prune stale remote-tracking branches",children:"Prune"}),e("button",{type:"button",className:"gg-btn",onClick:()=>m({kind:"remote-delete",name:C.name}),title:"Remove Remote",children:"Delete"})]})]},C.name)),t("div",{className:"gg-flex-row gg-gap-6",children:[e("input",{type:"text",className:"gg-input gg-remote-name-width",placeholder:"upstream",value:N,onChange:C=>b(C.target.value)}),e("input",{type:"text",className:"gg-input gg-flex-1",placeholder:"https://github.com/org/repo.git",value:x,onChange:C=>c(C.target.value)}),e("button",{type:"button",className:"gg-btn gg-btn-primary",disabled:!N.trim()||!x.trim(),onClick:()=>{m({kind:"remote-add",name:N.trim(),url:x.trim(),fetch:!0}),b(""),c("")},children:"Add Remote"})]})]})]}),t("div",{className:"gg-field",children:[e("label",{className:"gg-field-label",children:"Pull Request Creation"}),t("div",{style:{display:"flex",gap:"8px"},children:[t("select",{className:"gg-select",value:r.pullRequestConfig.provider,onChange:C=>d({pullRequestConfig:{...r.pullRequestConfig,provider:C.target.value}}),children:[e("option",{value:"github",children:"GitHub"}),e("option",{value:"gitlab",children:"GitLab"}),e("option",{value:"bitbucket",children:"Bitbucket"}),e("option",{value:"custom",children:"Custom URL Template"})]}),e("input",{type:"text",className:"gg-input",placeholder:"Remote (origin)",value:r.pullRequestConfig.remoteName,onChange:C=>d({pullRequestConfig:{...r.pullRequestConfig,remoteName:C.target.value}})}),e("input",{type:"text",className:"gg-input",placeholder:"Target branch (main)",value:r.pullRequestConfig.targetBranch,onChange:C=>d({pullRequestConfig:{...r.pullRequestConfig,targetBranch:C.target.value}})})]})]}),t("div",{className:"gg-field",children:[t("label",{className:"gg-field-label",children:["Issue Linking Rules (",r.issueLinkingRules.length,")"]}),t("div",{className:"gg-flex-col gg-gap-6",children:[r.issueLinkingRules.map(C=>t("div",{className:"gg-issue-rule-row",children:[t("code",{children:["/",C.pattern,"/ \u2192 ",C.urlTemplate]}),e("button",{type:"button",className:"gg-btn",onClick:()=>d({issueLinkingRules:r.issueLinkingRules.filter(f=>f.id!==C.id)}),children:"Remove"})]},C.id)),t("div",{className:"gg-flex-row gg-gap-6",children:[e("input",{type:"text",className:"gg-input gg-issue-prefix-width",placeholder:"#(\\d+)",value:A,onChange:C=>h(C.target.value)}),e("input",{type:"text",className:"gg-input gg-flex-1",placeholder:"https://github.com/org/repo/issues/$1",value:$,onChange:C=>S(C.target.value)}),e("button",{type:"button",className:"gg-btn",disabled:!A.trim()||!$.trim(),onClick:()=>{let C={id:`rule-${Date.now()}`,pattern:A.trim(),urlTemplate:$.trim()};d({issueLinkingRules:[...r.issueLinkingRules,C]}),h(""),S("")},children:"Add Rule"})]})]})]}),t("div",{className:"gg-field",children:[e("label",{className:"gg-field-label",children:"Graph Display & Muting"}),t("label",{className:"gg-checkbox-row",children:[e("input",{type:"checkbox",checked:a.muteNonAncestors,onChange:C=>P({muteNonAncestors:C.target.checked})}),e("span",{children:"Dim commits that are not ancestors of HEAD"})]}),t("label",{className:"gg-checkbox-row",children:[e("input",{type:"checkbox",checked:a.muteMergeCommits,onChange:C=>P({muteMergeCommits:C.target.checked})}),e("span",{children:"Dim merge commits (commits with >1 parent)"})]}),t("div",{className:"gg-flex-row gg-gap-8 gg-margin-top-6",children:[t("select",{className:"gg-select",value:a.dateFormat,onChange:C=>P({dateFormat:C.target.value}),children:[e("option",{value:"relative",children:"Date Format: Relative"}),e("option",{value:"iso",children:"Date Format: ISO"}),e("option",{value:"datetime",children:"Date Format: Local Date/Time"})]}),t("select",{className:"gg-select",value:a.dateType,onChange:C=>P({dateType:C.target.value}),children:[e("option",{value:"author",children:"Show Author Date"}),e("option",{value:"commit",children:"Show Commit Date"})]})]})]})]}),t("div",{className:"gg-modal-footer",children:[e("button",{type:"button",className:"gg-btn",onClick:l,title:"Write .git-tree.json into the repository root",children:"Export .git-tree.json"}),e("button",{type:"button",className:"gg-btn gg-btn-primary",onClick:u,children:"Done"})]})]})}):null}var Se={date:125,author:130,commit:74},_e=28,Pt=14,wt=14;function tn({focusWindow:o,bringBack:s}){return e("div",{className:"gg-root","data-testid":"gg-detached-placeholder",children:t("div",{className:"gg-empty",style:{gap:"12px"},children:[e("div",{style:{fontSize:"14px",fontWeight:600},children:"Git Tree is open in its own window"}),t("div",{style:{display:"flex",gap:"8px"},children:[e("button",{type:"button",className:"gg-btn gg-btn-primary",onClick:o,children:"Focus Window"}),e("button",{type:"button",className:"gg-btn",onClick:s,children:"Bring Back Here"})]})]})})}function nn({projectId:o,headerActions:s}){let r=Lt(),a={projectId:null};try{a=$t()}catch{}let[u,m]=w([]),[d,P]=w(o||a.projectId||""),l=o||d||a.projectId||"",N=null;try{N=zt()}catch{N=null}le(()=>{!o&&!d&&r.call("listProjects").then(n=>{let i=Array.isArray(n)?n:[];m(i),i.length>0&&!d&&P(i[0].id)}).catch(()=>{})},[o,d,r]);let[b,x]=w([]),[c,A]=w(""),[h,$]=w(null),[S,C]=w(300),[f,V]=w(!0),[ee,ue]=w(null),[me,H]=w(null),[I,q]=w(null),[D,oe]=w(null),[Re,T]=w(null),[J,Fe]=w(null),[Ae,Te]=w(!1),[Pe,he]=w(null),[te,we]=w(null),[be,Ie]=w(null),[ke,qe]=w(!1),[Ce,je]=w(null),[Ze,He]=w(!1),[Ne,Me]=w(!1),[De,Ye]=w(""),[Ee,Ge]=w(0),[Be,ae]=w(null),[Le,ce]=w(null),[Ke,it]=w(!1),[Oe,at]=w(!1),Je=Q(null),Xe=Q(null),X=Z(async(n,i,p)=>{let k=p??l;if(!k){V(!1);return}V(!0),ue(null);try{let z=await r.call("discoverRepos",{projectId:k}),B=Array.isArray(z)?z:z?.repos??[];if(x(B),B.length===0){$(null),V(!1);return}let U=n!==void 0?n:B.some(ie=>ie.relPath===c)?c:B[0].relPath;U!==c&&A(U);let _=await r.call("loadGraph",{projectId:k,subRepoRelPath:U,maxCommits:i??S});$(_)}catch(z){ue(z instanceof Error?z.message:String(z))}finally{V(!1)}},[l,r,c,S]);le(()=>{X()},[l]);let Qe=n=>{let i=n;(!i?.projectId||i.projectId===l)&&X(c,S)};ft("git-tree:changed",Qe),ft("git-graph:changed",Qe),le(()=>{if(!l||!I){T(null),Fe(null),he(null),we(null),Ie(null),je(null);return}let n=!1;return Te(!0),we(null),Ie(null),je(null),(async()=>{try{if(D&&D!==I){let p=await r.call("compareCommits",{projectId:l,subRepoRelPath:c,fromHash:I,toHash:D});if(n)return;Fe(p.comparison),T(null),he(p.codeReview),p.comparison.fileChanges.length>0&&Ve(p.comparison.fileChanges[0],D,I)}else{let p=await r.call("getCommitDetails",{projectId:l,subRepoRelPath:c,commitHash:I});if(n)return;T(p.details),Fe(null),he(p.codeReview),p.details.fileChanges.length>0&&Ve(p.details.fileChanges[0],I,void 0)}}catch(p){n||H({kind:"error",text:p instanceof Error?p.message:String(p)})}finally{n||Te(!1)}})(),()=>{n=!0}},[l,c,I,D]);let We=Z(async(n,i)=>{let p=i??D??I;if(p){He(!0);try{let k=await r.call("getFileContent",{projectId:l,subRepoRelPath:c,commitHash:p,filePath:n});je(k)}catch(k){H({kind:"error",text:k instanceof Error?k.message:String(k)})}finally{He(!1)}}},[l,r,c,I,D]),Ve=Z(async(n,i,p)=>{let k=i??D??I;if(!k)return;let z=p!==void 0?p:D?I??void 0:void 0;we(n.newPath),qe(!0),je(null),We(n.newPath,k);try{let B=await r.call("getFileDiff",{projectId:l,subRepoRelPath:c,commitHash:k,fromHash:z,filePath:n.newPath,oldPath:n.oldPath!==n.newPath?n.oldPath:void 0,staged:n.staged,untracked:n.untracked});Ie(B)}catch(B){H({kind:"error",text:B instanceof Error?B.message:String(B)})}finally{qe(!1)}},[l,r,c,I,D,We]),O=h?.commits??[],fe=h?.headHash??null,E=h?.globalSettings??{graphStyle:"rounded",initialLoadCommits:300,loadMoreCommits:100,muteNonAncestors:!1,muteMergeCommits:!1,commitDetailsLocation:"docked",fileViewType:"tree",compactFolders:!0,diffViewMode:"unified",maxDepthOfRepoSearch:2,dateType:"author",dateFormat:"relative",fetchAndPrune:!1,fetchAndPruneTags:!1,signCommits:!1,signTags:!1,useMailmap:!0,graphColors:[],columnWidths:Se},$e=h?.repoSettings??{selectedBranches:[],showRemoteBranches:!0,showStashes:!0,showTags:!0,showUncommittedChanges:!0,showUntrackedFiles:!0,onlyFollowFirstParent:!1,commitOrdering:"date",issueLinkingRules:[],pullRequestConfig:{provider:"github",remoteName:"origin",targetBranch:"main"}},ze=pe(()=>Ht(O,fe,E.graphColors),[O,fe,E.graphColors]),re=pe(()=>Math.max(48,wt*2+(ze.maxLane+1)*Pt),[ze.maxLane]),se=pe(()=>{let n=De.trim().toLowerCase();if(!n)return[];let i=[];return O.forEach((p,k)=>{[p.hash,p.abbreviatedHash,p.subject,p.authorName,p.authorEmail,...p.refs.map(B=>B.remote?`${B.remote}/${B.name}`:B.name)].join(" ").toLowerCase().includes(n)&&i.push(k)}),i},[O,De]),g=Z(n=>{let i=Je.current;if(!i)return;let p=Math.max(0,n*_e-i.clientHeight/3);i.scrollTo?.({top:p,behavior:"smooth"})},[]),M=Z(()=>{if(!fe)return;let n=O.findIndex(i=>i.hash===fe);n>=0&&(q(fe),oe(null),g(n))},[O,fe,g]),v=Z(async n=>{try{H(null),await r.call("runGitAction",{projectId:l,subRepoRelPath:c,action:n}),await X(c,S)}catch(i){H({kind:"error",text:i instanceof Error?i.message:String(i)})}},[l,r,c,X,S]),R=Z(async()=>{if(!(!l||Oe)){at(!0),H(null);try{await r.call("runGitAction",{projectId:l,subRepoRelPath:"",action:"init"}),await X()}catch(n){H({kind:"error",text:n instanceof Error?n.message:String(n)})}finally{at(!1)}}},[l,Oe,r,X]),F=Z(async n=>{try{await r.call("updateRepoSettings",{projectId:l,subRepoRelPath:c,patch:n}),await X(c,S)}catch(i){H({kind:"error",text:i instanceof Error?i.message:String(i)})}},[l,r,c,X,S]),L=Z(async n=>{try{await r.call("updateGlobalSettings",{patch:n}),$(i=>i&&{...i,globalSettings:{...i.globalSettings,...n}})}catch(i){H({kind:"error",text:i instanceof Error?i.message:String(i)})}},[r]),[y,Y]=w(()=>({description:E.columnWidths?.description,date:E.columnWidths?.date??Se.date,author:E.columnWidths?.author??Se.author,commit:E.columnWidths?.commit??Se.commit})),[K,W]=w(null),ne=Q(y);ne.current=y;let xe=Q(!1),et=Q(null);le(()=>{!xe.current&&E.columnWidths&&Y({description:E.columnWidths.description,date:E.columnWidths.date??Se.date,author:E.columnWidths.author??Se.author,commit:E.columnWidths.commit??Se.commit})},[E.columnWidths]);let rt=Z((n,i)=>{n.preventDefault(),n.stopPropagation(),xe.current=!0,W(i);let p=n.clientX,k=i==="description"?ne.current.description??et.current?.getBoundingClientRect().width??260:ne.current[i],z=k,B=document.body.style.userSelect,U=document.body.style.cursor;document.body.style.userSelect="none",document.body.style.cursor="col-resize";let _=i==="commit"?50:i==="description"?150:60,ie=i==="description"?1200:500,nt=bt=>{let mn=bt.clientX-p,Mt=Math.max(_,Math.min(ie,Math.round(k+mn)));z=Mt,Y(hn=>({...hn,[i]:Mt}))},It=()=>{window.removeEventListener("mousemove",nt),window.removeEventListener("mouseup",It),document.body.style.userSelect=B,document.body.style.cursor=U,xe.current=!1,W(null);let bt={...ne.current,[i]:z};L({columnWidths:bt})};window.addEventListener("mousemove",nt),window.addEventListener("mouseup",It)},[L]),st=Z(n=>{if(n==="description"){let k={...ne.current};delete k.description,Y(k),L({columnWidths:k});return}let i=Se[n],p={...ne.current,[n]:i};Y(p),L({columnWidths:p})},[L]),ut=Z((n,i)=>{navigator.clipboard?.writeText(n),H({kind:"info",text:`${i} copied to clipboard.`})},[]),an=Z(async n=>{ce({kind:"tag-details",tagName:n,details:null});try{let i=await r.call("getTagDetails",{projectId:l,subRepoRelPath:c,tagName:n});ce({kind:"tag-details",tagName:n,details:i})}catch(i){H({kind:"error",text:i instanceof Error?i.message:String(i)})}},[l,r,c]),rn=Z(async n=>{try{let i=await r.call("buildPullRequestUrl",{projectId:l,subRepoRelPath:c,sourceBranch:n});i.url?window.open(i.url,"_blank","noopener,noreferrer"):H({kind:"error",text:"Could not derive a Pull Request URL from the configured remote."})}catch(i){H({kind:"error",text:i instanceof Error?i.message:String(i)})}},[l,r,c]),mt=Z(async n=>{let{commitHash:i,fromHash:p,filePath:k}=n;try{H({kind:"info",text:"Preparing agent draft\u2026"});let z=await r.call("draftAgentAboutCommit",{projectId:l,subRepoRelPath:c,commitHash:i,fromHash:p,filePath:k}),B=z.title,U=k?`${i}:${k}`:i;if(N?.openPanelAgent&&N.openPanelAgent({draft:{prompt:z.prompt,view:U,...l?{projectId:l}:{}},title:B})){H({kind:"info",text:`Draft opened in side panel: ${B}`});return}let _=await r.call("askAgentAboutCommit",{projectId:l,subRepoRelPath:c,commitHash:i,fromHash:p,filePath:k});H({kind:"info",text:`Spawned Agent thread: ${_.title}`}),N?.toThread?.(_.threadId)}catch(z){H({kind:"error",text:z instanceof Error?z.message:String(z)})}},[l,r,c,N]),kt=Z(async()=>{if(!I)return;let n=D?I:null,i=D??I;try{let p=await r.call("codeReviewStart",{projectId:l,subRepoRelPath:c,fromHash:n,toHash:i});he(p)}catch(p){H({kind:"error",text:p instanceof Error?p.message:String(p)})}},[l,r,c,I,D]),Ct=Z(async(n,i)=>{if(!I)return;let p=D?I:null,k=D??I;try{let z=await r.call("codeReviewToggleFile",{projectId:l,subRepoRelPath:c,fromHash:p,toHash:k,filePath:n,reviewed:i});he(z)}catch(z){H({kind:"error",text:z instanceof Error?z.message:String(z)})}},[l,r,c,I,D]),Nt=Z(async()=>{if(!I)return;let n=D?I:null,i=D??I;try{await r.call("codeReviewEnd",{projectId:l,subRepoRelPath:c,fromHash:n,toHash:i}),he(null)}catch(p){H({kind:"error",text:p instanceof Error?p.message:String(p)})}},[l,r,c,I,D]),sn=Z(n=>{if((n.ctrlKey||n.metaKey)&&n.key.toLowerCase()==="f"){n.preventDefault(),Me(!0);return}if((n.ctrlKey||n.metaKey)&&n.key.toLowerCase()==="h"){n.preventDefault(),M();return}if((n.ctrlKey||n.metaKey)&&n.key.toLowerCase()==="r"){n.preventDefault(),X(c,S);return}if(n.key==="Escape"){Be?ae(null):Le?ce(null):Ne?Me(!1):I&&(q(null),oe(null));return}if(n.key==="ArrowDown"||n.key==="ArrowUp"){if(O.length===0)return;let i=I?O.findIndex(z=>z.hash===I):-1,p=n.key==="ArrowDown"?Math.min(O.length-1,i+1):Math.max(0,i<=0?0:i-1),k=O[p];k&&(n.preventDefault(),q(k.hash),oe(null))}},[O,I,Be,Le,Ne,M,X,c,S]),ln=(n,i,p)=>{let k=i.type==="head"?`gg-ref-badge gg-ref-head ${i.isHead?"is-current":""}`:i.type==="remote"?"gg-ref-badge gg-ref-remote":i.type==="tag"?"gg-ref-badge gg-ref-tag":"gg-ref-badge gg-ref-stash",z=i.type==="remote"?"\u2601":i.type==="tag"?"\u{1F3F7}":i.type==="stash"?"\u{1F4E6}":i.isHead?"\u25CF":"\u2442",B=i.type==="remote"&&i.remote?`${i.remote}/${i.name}`:i.name;return t("span",{className:k,title:i.type==="head"?i.isHead?`Current branch: ${i.name}`:`Branch: ${i.name} (Double-click to checkout)`:i.type==="remote"?`Remote branch: ${B}`:i.type==="tag"?`Tag: ${i.name}`:`Stash: ${i.name}`,onContextMenu:U=>{U.preventDefault(),U.stopPropagation(),i.type==="head"?ae({kind:"branch",commit:n,ref:i,x:U.clientX,y:U.clientY}):i.type==="remote"?ae({kind:"remote-branch",commit:n,ref:i,x:U.clientX,y:U.clientY}):i.type==="tag"?ae({kind:"tag",commit:n,ref:i,x:U.clientX,y:U.clientY}):i.type==="stash"&&ae({kind:"stash",commit:n,selector:i.selector||i.name,x:U.clientX,y:U.clientY})},onDoubleClick:U=>{U.stopPropagation(),i.type==="head"&&!i.isHead&&v({kind:"checkout-branch",branchName:i.name})},children:[e("span",{className:"gg-ref-icon",children:z}),e("span",{className:"gg-ref-name",children:B})]},`${i.type}:${i.remote??""}:${i.name}:${p}`)},cn=n=>dt(n,$e.issueLinkingRules).map((p,k)=>p.kind==="code"?e("code",{style:{background:"rgba(255,255,255,0.08)",padding:"0 4px",borderRadius:"3px",fontSize:"11px"},children:p.text},k):p.kind==="link"&&p.href?e("a",{href:p.href,target:"_blank",rel:"noreferrer",onClick:z=>z.stopPropagation(),style:{color:"var(--accent-color, #4da3ff)"},children:p.text},k):e(ve.Fragment,{children:p.text},k)),de=!!I,ge=E.commitDetailsLocation==="inline",[tt,dn]=w(340),[St,gn]=w(0),[ht,Rt]=w(0),At=Q(null);le(()=>{let n=Je.current;if(!n)return;let i=()=>{n&&(gn(n.clientWidth),Rt(n.scrollLeft))};if(i(),typeof ResizeObserver<"u"){let p=new ResizeObserver(i);return p.observe(n),()=>p.disconnect()}},[h,f,O.length]);let Tt=Math.max(re+8,ht+8),lt=St>0?Math.max(280,ht+St-Tt-16):void 0,Ue=pe(()=>{if(!de||!ge)return-1;let n=D??I;return n?O.findIndex(i=>i.hash===n):-1},[de,ge,D,I,O]);le(()=>{let n=At.current;if(!n)return;let i=()=>{if(n){let p=n.offsetHeight;p>0&&dn(p)}};if(i(),typeof ResizeObserver<"u"){let p=new ResizeObserver(i);return p.observe(n),()=>p.disconnect()}},[ge,de,I,D,Re,J,be,Ae,ke]);let pn=pe(()=>{let n=O.length*_e;return ge&&de&&Ue>=0?n+tt+12:n},[O.length,ge,de,Ue,tt]),un=Z(n=>ge&&de&&Ue>=0&&n>Ue?n*_e+tt+12+_e/2:n*_e+_e/2,[ge,de,Ue,tt]);return t("div",{className:"gg-root",tabIndex:0,onKeyDown:sn,"data-testid":"gg-project-tab",children:[e(Vt,{projects:u,selectedProjectId:l,onSelectProject:n=>{P(n),q(null),oe(null),X(void 0,void 0,n)},repos:b,selectedRepoRelPath:c,onSelectRepo:n=>{q(null),oe(null),A(n),X(n,S)},branches:h?.branches??[],remoteBranches:h?.remoteBranches??[],repoSettings:$e,globalSettings:E,loading:f,findOpen:Ne,headerActions:s,onUpdateRepoSettings:n=>{F(n)},onUpdateGlobalSettings:n=>{L(n)},onFetch:()=>{v({kind:"fetch",all:!0,prune:E.fetchAndPrune,pruneTags:E.fetchAndPruneTags})},onScrollToHead:M,onToggleFind:()=>Me(n=>!n),onOpenRepoSettings:()=>it(!0),onRefresh:()=>{X(c,S)}}),me&&t("div",{className:`gg-banner ${me.kind==="error"?"gg-banner-error":"gg-banner-info"}`,"data-testid":"gg-banner",children:[e("span",{children:me.text}),e("button",{type:"button",className:"gg-btn gg-btn-icon",onClick:()=>H(null),children:"\u2715"})]}),t("div",{className:"gg-workspace",children:[Ne&&e(Ut,{query:De,matchCount:se.length,activeMatchIndex:Ee,onChangeQuery:n=>{Ye(n),Ge(0)},onNext:()=>{if(se.length===0)return;let n=(Ee+1)%se.length;Ge(n);let i=se[n];q(O[i].hash),g(i)},onPrev:()=>{if(se.length===0)return;let n=(Ee-1+se.length)%se.length;Ge(n);let i=se[n];q(O[i].hash),g(i)},onClose:()=>Me(!1)}),t("div",{className:"gg-table-container",children:[e("div",{className:"gg-table-header-scroll",ref:Xe,children:t("div",{className:"gg-table-header",children:[e("div",{style:{width:`${re}px`,minWidth:`${re}px`,maxWidth:`${re}px`,flex:`0 0 ${re}px`,paddingLeft:"8px",boxSizing:"border-box"},children:"Graph"}),e("div",{ref:et,style:{...y.description!==void 0?{width:`${y.description}px`,minWidth:`${y.description}px`,maxWidth:`${y.description}px`,flex:`0 0 ${y.description}px`}:{flex:"1 1 0px",minWidth:"150px"},padding:"0 8px",boxSizing:"border-box"},children:"Description"}),e("div",{className:`gg-col-resizer ${K==="description"?"active":""}`,title:"Resize Description \xB7 Double-click to auto-fit","data-testid":"gg-col-resizer-description",onMouseDown:n=>rt(n,"description"),onDoubleClick:()=>st("description")}),e("div",{style:{width:`${y.date}px`,minWidth:`${y.date}px`,maxWidth:`${y.date}px`,flex:`0 0 ${y.date}px`,padding:"0 6px",boxSizing:"border-box"},children:"Date"}),e("div",{className:`gg-col-resizer ${K==="date"?"active":""}`,title:"Resize Date \xB7 Double-click to reset","data-testid":"gg-col-resizer-date",onMouseDown:n=>rt(n,"date"),onDoubleClick:()=>st("date")}),e("div",{style:{width:`${y.author}px`,minWidth:`${y.author}px`,maxWidth:`${y.author}px`,flex:`0 0 ${y.author}px`,padding:"0 6px",boxSizing:"border-box"},children:"Author"}),e("div",{className:`gg-col-resizer ${K==="author"?"active":""}`,title:"Resize Author \xB7 Double-click to reset","data-testid":"gg-col-resizer-author",onMouseDown:n=>rt(n,"author"),onDoubleClick:()=>st("author")}),e("div",{style:{width:`${y.commit}px`,minWidth:`${y.commit}px`,maxWidth:`${y.commit}px`,flex:`0 0 ${y.commit}px`,textAlign:"right",padding:"0 6px",boxSizing:"border-box"},children:"Commit"}),e("div",{className:`gg-col-resizer ${K==="commit"?"active":""}`,title:"Resize Commit \xB7 Double-click to reset","data-testid":"gg-col-resizer-commit",onMouseDown:n=>rt(n,"commit"),onDoubleClick:()=>st("commit")})]})}),f&&!h?e("div",{className:"gg-empty",children:"Loading Git Tree\u2026"}):ee?t("div",{className:"gg-empty",children:[t("div",{children:["Failed to load Git Tree: ",ee]}),e("button",{type:"button",className:"gg-btn",style:{marginTop:"8px"},onClick:()=>{X(c,S)},children:"Retry"})]}):b.length===0?t("div",{className:"gg-empty",style:{gap:"12px"},children:[e("div",{children:"No Git repositories found in this project."}),e("button",{type:"button",className:"gg-btn gg-btn-primary","data-testid":"gg-init-repo-btn",disabled:Oe,onClick:()=>{R()},children:Oe?"Initializing\u2026":"Initialize Git Repository"})]}):O.length===0?e("div",{className:"gg-empty",children:fe?"No commits match the current branch filters.":"Repository initialized with no commits or uncommitted changes yet."}):t("div",{className:"gg-table-scroll",ref:Je,onScroll:n=>{let i=n.currentTarget.scrollLeft;i!==ht&&Rt(i),Xe.current&&(Xe.current.scrollLeft=i)},children:[t("div",{className:"gg-rows-wrapper",children:[t("svg",{className:"gg-svg-overlay",width:re,height:pn,"data-testid":"gg-svg-dag",children:[ze.segments.map((n,i)=>e("path",{d:Gt({segment:n,rowHeight:_e,laneWidth:Pt,padX:wt,style:E.graphStyle,expandedRow:ge&&de?Ue:-1,detailsHeight:ge&&de?tt+12:0}),fill:"none",stroke:n.color,strokeWidth:2,strokeDasharray:n.isUncommitted?"3 3":void 0},i)),ze.nodes.map(n=>{let i=wt+n.lane*Pt,p=un(n.row),k=I===n.commit.hash;return n.commit.isUncommitted?e("circle",{cx:i,cy:p,r:k?5.5:4.5,fill:"var(--bg-primary, #12151a)",stroke:n.color,strokeWidth:k?2.5:2,strokeDasharray:"2 2"},n.commit.hash):n.commit.isStash?e("rect",{x:i-(k?5:4),y:p-(k?5:4),width:k?10:8,height:k?10:8,rx:2,fill:"var(--bg-primary, #12151a)",stroke:n.color,strokeWidth:k?2.5:2},n.commit.hash):n.isMerge?t("g",{children:[e("circle",{cx:i,cy:p,r:k?5.5:4.5,fill:"var(--bg-primary, #12151a)",stroke:k?"#ffffff":n.color,strokeWidth:k?2.5:2}),e("circle",{cx:i,cy:p,r:2,fill:n.color})]},n.commit.hash):e("circle",{cx:i,cy:p,r:k?5.5:n.commit.isHead?5:4,fill:n.color,stroke:k||n.commit.isHead?"#ffffff":"var(--bg-primary, #12151a)",strokeWidth:k?2:n.commit.isHead?1.5:1},n.commit.hash)})]}),ze.nodes.map(n=>{let{commit:i}=n,p=I===i.hash,k=D===i.hash,z=De.trim().length>0&&se.includes(n.row),B=E.muteNonAncestors&&!n.isAncestorOfHead||E.muteMergeCommits&&n.isMerge,U=E.dateType==="commit"?i.commitDate:i.authorDate;return t(ve.Fragment,{children:[t("div",{className:["gg-commit-row",p?"selected":"",k?"compared":"",B?"muted":"",z?"search-match":"",i.isUncommitted?"uncommitted":""].filter(Boolean).join(" "),onClick:_=>{(_.ctrlKey||_.metaKey)&&I&&I!==i.hash?oe(i.hash):(q(ie=>ie===i.hash&&!D?null:i.hash),oe(null))},onContextMenu:_=>{_.preventDefault(),i.isUncommitted?ae({kind:"uncommitted",commit:i,x:_.clientX,y:_.clientY}):i.isStash&&i.stashSelector?ae({kind:"stash",commit:i,selector:i.stashSelector,x:_.clientX,y:_.clientY}):ae({kind:"commit",commit:i,x:_.clientX,y:_.clientY})},"data-testid":`gg-commit-row-${i.abbreviatedHash}`,children:[e("div",{className:"gg-graph-spacer",style:{width:`${re}px`,minWidth:`${re}px`,maxWidth:`${re}px`,flex:`0 0 ${re}px`,boxSizing:"border-box"}}),t("div",{className:"gg-commit-desc",style:{...y.description!==void 0?{width:`${y.description}px`,minWidth:`${y.description}px`,maxWidth:`${y.description}px`,flex:`0 0 ${y.description}px`}:{flex:"1 1 0px",minWidth:"150px"},padding:"0 8px",boxSizing:"border-box"},children:[i.refs.map((_,ie)=>ln(i,_,ie)),e("span",{className:"gg-commit-subject",children:cn(i.subject)})]}),e("div",{className:"gg-commit-date",style:{width:`${y.date}px`,minWidth:`${y.date}px`,maxWidth:`${y.date}px`,flex:`0 0 ${y.date}px`,padding:"0 6px",boxSizing:"border-box"},children:i.isUncommitted?"Working Tree":ot(U,E.dateFormat)}),e("div",{className:"gg-commit-author",style:{width:`${y.author}px`,minWidth:`${y.author}px`,maxWidth:`${y.author}px`,flex:`0 0 ${y.author}px`,padding:"0 6px",boxSizing:"border-box"},title:i.authorEmail,children:i.authorName}),e("div",{className:"gg-commit-hash",style:{width:`${y.commit}px`,minWidth:`${y.commit}px`,maxWidth:`${y.commit}px`,flex:`0 0 ${y.commit}px`,textAlign:"right",padding:"0 6px",boxSizing:"border-box"},children:i.abbreviatedHash})]}),ge&&de&&(!D&&p||D&&k)&&e("div",{ref:At,className:"gg-inline-details-wrapper",style:{marginLeft:`${Tt}px`,width:lt!==void 0?`${lt}px`:void 0,maxWidth:lt!==void 0?`${lt}px`:"100%",marginBottom:"8px",boxSizing:"border-box"},children:e(yt,{mode:D?"comparison":"single",details:Re,comparison:J,loading:Ae,inline:!0,fileViewType:E.fileViewType,compactFolders:E.compactFolders,diffViewMode:E.diffViewMode,dateFormat:E.dateFormat,issueRules:$e.issueLinkingRules,codeReview:Pe,selectedFilePath:te,fileDiff:be,loadingDiff:ke,fileContent:Ce,loadingContent:Ze,onSelectFile:_=>{Ve(_)},onLoadFileContent:_=>{We(_)},onChangeFileViewType:_=>{L({fileViewType:_})},onToggleCompactFolders:()=>{L({compactFolders:!E.compactFolders})},onChangeDiffViewMode:_=>{L({diffViewMode:_})},onStartCodeReview:()=>{kt()},onToggleReviewedFile:(_,ie)=>{Ct(_,ie)},onEndCodeReview:()=>{Nt()},onSelectParentHash:_=>{q(_),oe(null);let ie=O.findIndex(nt=>nt.hash===_);ie>=0&&g(ie)},onAskAgent:_=>{mt({commitHash:D??I??"*",fromHash:(D?I:null)??void 0,filePath:_})},onCopyText:ut,onClose:()=>{q(null),oe(null)}})})]},i.hash)})]}),h?.hasMore&&e("div",{className:"gg-load-more-row",children:t("button",{type:"button",className:"gg-btn",onClick:()=>{let n=S+(E.loadMoreCommits||100);C(n),X(c,n)},"data-testid":"gg-load-more-btn",children:["Load ",E.loadMoreCommits||100," More Commits"]})})]})]}),!ge&&de&&e(yt,{mode:D?"comparison":"single",details:Re,comparison:J,loading:Ae,inline:!1,fileViewType:E.fileViewType,compactFolders:E.compactFolders,diffViewMode:E.diffViewMode,dateFormat:E.dateFormat,issueRules:$e.issueLinkingRules,codeReview:Pe,selectedFilePath:te,fileDiff:be,loadingDiff:ke,fileContent:Ce,loadingContent:Ze,onSelectFile:n=>{Ve(n)},onLoadFileContent:n=>{We(n)},onChangeFileViewType:n=>{L({fileViewType:n})},onToggleCompactFolders:()=>{L({compactFolders:!E.compactFolders})},onChangeDiffViewMode:n=>{L({diffViewMode:n})},onStartCodeReview:()=>{kt()},onToggleReviewedFile:(n,i)=>{Ct(n,i)},onEndCodeReview:()=>{Nt()},onSelectParentHash:n=>{q(n),oe(null);let i=O.findIndex(p=>p.hash===n);i>=0&&g(i)},onAskAgent:n=>{mt({commitHash:D??I??"*",fromHash:(D?I:null)??void 0,filePath:n})},onCopyText:ut,onClose:()=>{q(null),oe(null)}})]}),e(Xt,{target:Be,currentBranch:h?.currentBranch??null,hasCommits:O.some(n=>!n.isUncommitted),onClose:()=>ae(null),onRunAction:n=>{v(n)},onOpenDialog:n=>ce(n),onOpenPullRequest:n=>{rn(n)},onViewTagDetails:n=>{an(n)},onCopyText:ut,onAskAgent:(n,i)=>{mt({commitHash:n,filePath:i})}}),e(Qt,{dialog:Le,remotes:h?.remotes??[],currentBranch:h?.currentBranch??null,onClose:()=>ce(null),onRunAction:n=>{v(n)}}),e(en,{open:Ke,remotes:h?.remotes??[],repoSettings:$e,globalSettings:E,onClose:()=>it(!1),onRunGitAction:n=>{v(n)},onUpdateRepoSettings:n=>{F(n)},onUpdateGlobalSettings:n=>{L(n)},onExportRepoConfig:async()=>{try{let n=await r.call("exportRepoConfig",{projectId:l,subRepoRelPath:c});H({kind:"info",text:`Exported repository config to ${n.filePath}`})}catch(n){H({kind:"error",text:n instanceof Error?n.message:String(n)})}}})]})}var on="zcc-ext-git-tree-styles";function vn(){if(typeof document>"u"||document.getElementById(on))return;let o=document.createElement("style");o.id=on,o.textContent=_t,document.head.appendChild(o)}var jo=Et(o=>{vn(),o.slots.projectTab({id:"git-tree",label:"Git Tree",icon:"GitBranch",order:40,global:!1,header:"custom",detachable:!0,component:nn,detachedPlaceholder:tn}),o.slots.commandPaletteAction({id:"open-git-tree",title:"Git Tree: View Git Tree",isAvailable:s=>!!s.projectId,run:s=>{s.projectId&&s.toProject(s.projectId,{tabId:"git-tree"})}})});export{jo as default};
