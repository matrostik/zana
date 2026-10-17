import React, { useState, useMemo, useRef, useEffect } from 'react';
import type {
  CodeReviewRecord,
  DiffViewMode,
  FileViewType,
  GitCommitComparison,
  GitCommitDetails,
  GitFileChange,
  GitFileContent,
  GitFileDiff,
  IssueLinkingRule
} from '../../server/types.js';
import {
  buildFileTree,
  buildSplitDiffRows,
  formatCommitTimestamp,
  tokenizeCommitMessage,
  type FileTreeNode
} from '../graph-layout.js';

export interface CommitDetailsPaneProps {
  mode: 'single' | 'comparison';
  details: GitCommitDetails | null;
  comparison: GitCommitComparison | null;
  loading: boolean;
  inline: boolean;
  fileViewType: FileViewType;
  compactFolders: boolean;
  diffViewMode: DiffViewMode;
  dateFormat: 'relative' | 'iso' | 'datetime';
  issueRules: readonly IssueLinkingRule[];
  codeReview: CodeReviewRecord | null;
  selectedFilePath: string | null;
  fileDiff: GitFileDiff | null;
  loadingDiff: boolean;
  fileContent?: GitFileContent | null;
  loadingContent?: boolean;
  onSelectFile: (file: GitFileChange) => void;
  onLoadFileContent?: (filePath: string) => void;
  onChangeFileViewType: (viewType: FileViewType) => void;
  onToggleCompactFolders: () => void;
  onChangeDiffViewMode: (mode: DiffViewMode) => void;
  onStartCodeReview: () => void;
  onToggleReviewedFile: (filePath: string, reviewed: boolean) => void;
  onEndCodeReview: () => void;
  onSelectParentHash: (hash: string) => void;
  onAskAgent: (filePath?: string) => void;
  onCopyText: (text: string, label: string) => void;
  onClose: () => void;
}

export function CommitDetailsPane({
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
}: CommitDetailsPaneProps) {
  const [collapsedFolders, setCollapsedFolders] = useState<Record<string, boolean>>({});
  const [viewMode, setViewMode] = useState<'diff' | 'source'>('diff');
  const diffViewerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (selectedFilePath && diffViewerRef.current) {
      diffViewerRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedFilePath]);

  const fileChanges: GitFileChange[] = useMemo(() => {
    if (mode === 'comparison') return comparison?.fileChanges ?? [];
    return details?.fileChanges ?? [];
  }, [mode, details, comparison]);

  const fileTree = useMemo(
    () => buildFileTree(fileChanges, compactFolders),
    [fileChanges, compactFolders]
  );

  const reviewedSet = useMemo(
    () => new Set(codeReview?.reviewedFiles ?? []),
    [codeReview]
  );

  const toggleFolder = (folderPath: string) => {
    setCollapsedFolders((prev) => ({
      ...prev,
      [folderPath]: !prev[folderPath]
    }));
  };

  const renderTokens = (text: string) => {
    const tokens = tokenizeCommitMessage(text, issueRules);
    return tokens.map((tok, idx) => {
      if (tok.kind === 'code') {
        return <code key={idx}>{tok.text}</code>;
      }
      if (tok.kind === 'link' && tok.href) {
        return (
          <a key={idx} href={tok.href} target="_blank" rel="noreferrer">
            {tok.text}
          </a>
        );
      }
      return <React.Fragment key={idx}>{tok.text}</React.Fragment>;
    });
  };

  const renderFileItem = (change: GitFileChange, label: string, depth = 0) => {
    const isSelected = selectedFilePath === change.newPath;
    const isReviewed = reviewedSet.has(change.newPath);

    return (
      <div
        key={`${change.newPath}:${change.staged ? 'staged' : 'work'}`}
        className={`gg-file-row ${isSelected ? 'selected' : ''}`}
        style={{ paddingLeft: `${12 + depth * 14}px` }}
        onClick={() => {
          onSelectFile(change);
          if (viewMode === 'source') {
            onLoadFileContent?.(change.newPath);
          }
        }}
        data-testid={`gg-file-row-${change.newPath}`}
      >
        {codeReview && (
          <input
            type="checkbox"
            checked={isReviewed}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onToggleReviewedFile(change.newPath, e.target.checked)}
            title="Mark file as reviewed"
          />
        )}
        <span className={`gg-file-status gg-file-status-${change.status}`}>
          {change.status}
        </span>
        <span
          className="gg-file-path"
          style={{
            textDecoration: isReviewed ? 'line-through' : undefined,
            opacity: isReviewed ? 0.65 : 1
          }}
          title={
            change.oldPath !== change.newPath
              ? `${change.oldPath} → ${change.newPath}`
              : change.newPath
          }
        >
          {label}
          {change.staged !== undefined && (
            <span style={{ opacity: 0.6, marginLeft: '6px', fontSize: '10px' }}>
              ({change.staged ? 'staged' : 'unstaged'})
            </span>
          )}
        </span>
        <span className="gg-file-stat">
          {change.additions !== null && change.additions > 0 && (
            <span className="gg-stat-add">+{change.additions}</span>
          )}
          {change.deletions !== null && change.deletions > 0 && (
            <span className="gg-stat-del">-{change.deletions}</span>
          )}
        </span>
        <button
          type="button"
          className="gg-btn gg-btn-icon"
          style={{ padding: '1px 4px', fontSize: '10px' }}
          title="Copy File Path"
          onClick={(e) => {
            e.stopPropagation();
            onCopyText(change.newPath, 'File path');
          }}
        >
          📋
        </button>
      </div>
    );
  };

  const renderTreeNodes = (nodes: FileTreeNode[], depth = 0): React.ReactNode => {
    return nodes.map((node) => {
      if (node.kind === 'file' && node.fileChange) {
        return renderFileItem(node.fileChange, node.name, depth);
      }
      const isCollapsed = Boolean(collapsedFolders[node.path]);
      return (
        <React.Fragment key={`folder:${node.path}`}>
          <div
            className="gg-folder-row"
            style={{ paddingLeft: `${12 + depth * 14}px` }}
            onClick={() => toggleFolder(node.path)}
          >
            <span>{isCollapsed ? '▸' : '▾'}</span>
            <span>📁 {node.name}</span>
          </div>
          {!isCollapsed && renderTreeNodes(node.children, depth + 1)}
        </React.Fragment>
      );
    });
  };

  return (
    <div
      className={`gg-details-pane ${inline ? 'gg-details-inline inline' : ''}`}
      data-testid="gg-details-pane"
    >
      <div className="gg-details-header">
        <div className="gg-details-header-title">
          {mode === 'comparison' && comparison ? (
            <>
              <span>Comparing</span>
              <span className="gg-commit-hash" style={{ width: 'auto' }}>
                {comparison.fromHash.slice(0, 7)}
              </span>
              <span>↔</span>
              <span className="gg-commit-hash" style={{ width: 'auto' }}>
                {comparison.toHash.slice(0, 7)}
              </span>
            </>
          ) : details ? (
            <>
              <span>
                {details.hash === '*' ? 'Uncommitted Changes' : `Commit ${details.abbreviatedHash}`}
              </span>
              {details.signature && (
                <span
                  className="gg-ref-badge gg-ref-tag"
                  title={details.signature.signer || details.signature.label}
                >
                  🔒 {details.signature.label}
                </span>
              )}
            </>
          ) : (
            <span>Commit Details</span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
          <button
            type="button"
            className="gg-btn gg-btn-primary"
            onClick={() => onAskAgent(selectedFilePath ?? undefined)}
            title="Spawn a Zana Agent thread with this commit and diff context"
            data-testid="gg-ask-agent-btn"
          >
            ✨ Ask Agent
          </button>
          {codeReview ? (
            <button
              type="button"
              className="gg-btn"
              onClick={onEndCodeReview}
              title="End Code Review"
              data-testid="gg-end-review-btn"
            >
              ✓ End Review ({reviewedSet.size}/{fileChanges.length})
            </button>
          ) : (
            <button
              type="button"
              className="gg-btn"
              onClick={onStartCodeReview}
              title="Start Persistent Code Review"
              data-testid="gg-start-review-btn"
            >
              👁 Code Review
            </button>
          )}
          <button
            type="button"
            className="gg-btn gg-btn-icon"
            onClick={onClose}
            title="Close Details (Esc)"
            data-testid="gg-close-details-btn"
          >
            ✕
          </button>
        </div>
      </div>

      {loading ? (
        <div className="gg-empty">Loading commit details…</div>
      ) : (
        <div className="gg-details-body">
          {mode === 'single' && details && details.hash !== '*' && (
            <div className="gg-details-meta">
              <div className="gg-details-meta-grid">
                <span className="gg-details-meta-label">Commit:</span>
                <span>
                  <code>{details.hash}</code>{' '}
                  <button
                    type="button"
                    className="gg-btn gg-btn-icon"
                    style={{ padding: '0 4px', fontSize: '10px' }}
                    onClick={() => onCopyText(details.hash, 'Commit hash')}
                  >
                    Copy
                  </button>
                </span>
                <span className="gg-details-meta-label">Parents:</span>
                <span>
                  {details.parents.length === 0
                    ? 'None (root commit)'
                    : details.parents.map((p, idx) => (
                        <React.Fragment key={p}>
                          {idx > 0 && ', '}
                          <span
                            className="gg-parent-link"
                            onClick={() => onSelectParentHash(p)}
                          >
                            {p.slice(0, 8)}
                          </span>
                        </React.Fragment>
                      ))}
                </span>
                <span className="gg-details-meta-label">Author:</span>
                <span>
                  {details.authorName} &lt;{details.authorEmail}&gt; (
                  {formatCommitTimestamp(details.authorDate, dateFormat)})
                </span>
                <span className="gg-details-meta-label">Committer:</span>
                <span>
                  {details.committerName} &lt;{details.committerEmail}&gt; (
                  {formatCommitTimestamp(details.commitDate, dateFormat)})
                </span>
              </div>
              <div className="gg-details-message">
                <strong>{renderTokens(details.subject)}</strong>
                {details.body ? `\n\n${details.body}` : ''}
              </div>
            </div>
          )}

          <div className="gg-details-columns" data-testid="gg-details-columns">
            <div className="gg-details-col-files">
              <div className="gg-files-toolbar">
                <span>
                  Changed Files ({fileChanges.length})
                  {codeReview
                    ? ` • Reviewed ${reviewedSet.size}/${fileChanges.length}`
                    : ''}
                </span>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button
                    type="button"
                    className={`gg-btn ${fileViewType === 'tree' ? 'gg-btn-active' : ''}`}
                    style={{ padding: '2px 6px', fontSize: '11px' }}
                    onClick={() => onChangeFileViewType('tree')}
                    data-testid="gg-view-tree-btn"
                  >
                    Tree
                  </button>
                  <button
                    type="button"
                    className={`gg-btn ${fileViewType === 'list' ? 'gg-btn-active' : ''}`}
                    style={{ padding: '2px 6px', fontSize: '11px' }}
                    onClick={() => onChangeFileViewType('list')}
                    data-testid="gg-view-list-btn"
                  >
                    List
                  </button>
                  {fileViewType === 'tree' && (
                    <button
                      type="button"
                      className={`gg-btn ${compactFolders ? 'gg-btn-active' : ''}`}
                      style={{ padding: '2px 6px', fontSize: '11px' }}
                      onClick={onToggleCompactFolders}
                      title="Compact single-child folders"
                    >
                      Compact
                    </button>
                  )}
                </div>
              </div>

              <div className="gg-file-list" data-testid="gg-file-list">
                {fileChanges.length === 0 ? (
                  <div className="gg-empty" style={{ padding: '12px' }}>
                    No file changes in this commit.
                  </div>
                ) : fileViewType === 'tree' ? (
                  renderTreeNodes(fileTree)
                ) : (
                  fileChanges.map((change) =>
                    renderFileItem(
                      change,
                      change.oldPath !== change.newPath
                        ? `${change.oldPath} → ${change.newPath}`
                        : change.newPath,
                      0
                    )
                  )
                )}
              </div>
            </div>

            <div className="gg-details-col-diff">
              {selectedFilePath ? (
                <div className="gg-diff-viewer" data-testid="gg-diff-viewer" ref={diffViewerRef}>
                  <div className="gg-diff-toolbar">
                    <span
                      style={{
                        fontFamily: 'var(--font-mono, monospace)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        fontWeight: 600
                      }}
                      title={selectedFilePath}
                    >
                      {selectedFilePath}
                    </span>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <button
                        type="button"
                        className={`gg-btn ${viewMode === 'diff' ? 'gg-btn-active' : ''}`}
                        style={{ padding: '2px 8px', fontSize: '11px' }}
                        onClick={() => setViewMode('diff')}
                        data-testid="gg-view-diff-btn"
                        title="View diff changes"
                      >
                        Diff
                      </button>
                      <button
                        type="button"
                        className={`gg-btn ${viewMode === 'source' ? 'gg-btn-active' : ''}`}
                        style={{ padding: '2px 8px', fontSize: '11px' }}
                        onClick={() => {
                          setViewMode('source');
                          if (selectedFilePath && !fileContent) {
                            onLoadFileContent?.(selectedFilePath);
                          }
                        }}
                        data-testid="gg-view-source-btn"
                        title="View full source code"
                      >
                        Source Code
                      </button>

                      {viewMode === 'diff' && (
                        <>
                          <button
                            type="button"
                            className={`gg-btn ${diffViewMode === 'unified' ? 'gg-btn-active' : ''}`}
                            style={{ padding: '2px 6px', fontSize: '11px' }}
                            onClick={() => onChangeDiffViewMode('unified')}
                            data-testid="gg-diff-unified-btn"
                          >
                            Unified
                          </button>
                          <button
                            type="button"
                            className={`gg-btn ${diffViewMode === 'split' ? 'gg-btn-active' : ''}`}
                            style={{ padding: '2px 6px', fontSize: '11px' }}
                            onClick={() => onChangeDiffViewMode('split')}
                            data-testid="gg-diff-split-btn"
                          >
                            Split
                          </button>
                        </>
                      )}

                      <button
                        type="button"
                        className="gg-btn gg-btn-icon"
                        style={{ padding: '2px 6px', fontSize: '11px' }}
                        title={viewMode === 'source' ? 'Copy file content' : 'Copy diff'}
                        onClick={() =>
                          onCopyText(
                            viewMode === 'source'
                              ? (fileContent?.content ?? '')
                              : (fileDiff?.rawDiff ?? ''),
                            viewMode === 'source' ? 'Source code' : 'Diff'
                          )
                        }
                      >
                        📋
                      </button>
                    </div>
                  </div>

                  <div className="gg-diff-content-scroll">
                    {viewMode === 'source' ? (
                      loadingContent ? (
                        <div className="gg-empty" style={{ padding: '16px' }}>
                          Loading source code…
                        </div>
                      ) : !fileContent ? (
                        <div className="gg-empty" style={{ padding: '16px' }}>
                          No source code available for this file.
                        </div>
                      ) : fileContent.isBinary ? (
                        <div className="gg-empty" style={{ padding: '16px' }}>
                          Binary file — cannot display text content.
                        </div>
                      ) : (
                        <table className="gg-source-table" data-testid="gg-source-code-table">
                          <tbody>
                            {fileContent.content.split(/\r?\n/).map((line, idx) => (
                              <tr key={idx} className="gg-source-line">
                                <td className="gg-diff-gutter">{idx + 1}</td>
                                <td className="gg-diff-code">{line || ' '}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )
                    ) : loadingDiff ? (
                      <div className="gg-empty" style={{ padding: '16px' }}>
                        Loading diff…
                      </div>
                    ) : !fileDiff ? (
                      <div className="gg-empty" style={{ padding: '16px' }}>
                        Select a file to inspect its diff.
                      </div>
                    ) : fileDiff.isBinary ? (
                      <div className="gg-empty" style={{ padding: '16px' }}>
                        Binary file changed — inline text diff not available.
                      </div>
                    ) : fileDiff.hunks.length === 0 ? (
                      <div className="gg-empty" style={{ padding: '16px' }}>
                        No textual diff hunks (empty file or mode-only change).
                      </div>
                    ) : diffViewMode === 'unified' ? (
                      <table className="gg-diff-table" data-testid="gg-diff-unified-table">
                        <tbody>
                          {fileDiff.hunks.map((hunk, hIdx) => (
                            <React.Fragment key={hIdx}>
                              <tr className="gg-diff-hunk-header">
                                <td colSpan={3} className="gg-diff-code">
                                  {hunk.header}
                                </td>
                              </tr>
                              {hunk.lines.map((line, lIdx) => (
                                <tr
                                  key={`${hIdx}-${lIdx}`}
                                  className={
                                    line.type === 'add'
                                      ? 'gg-diff-line-add'
                                      : line.type === 'del'
                                        ? 'gg-diff-line-del'
                                        : ''
                                  }
                                >
                                  <td className="gg-diff-gutter">
                                    {line.oldLineNumber ?? ''}
                                  </td>
                                  <td className="gg-diff-gutter">
                                    {line.newLineNumber ?? ''}
                                  </td>
                                  <td className="gg-diff-code">
                                    {line.type === 'add'
                                      ? `+${line.content}`
                                      : line.type === 'del'
                                        ? `-${line.content}`
                                        : ` ${line.content}`}
                                  </td>
                                </tr>
                              ))}
                            </React.Fragment>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <table className="gg-diff-table" data-testid="gg-diff-split-table">
                        <tbody>
                          {fileDiff.hunks.map((hunk, hIdx) => {
                            const splitRows = buildSplitDiffRows(hunk);
                            return (
                              <React.Fragment key={hIdx}>
                                <tr className="gg-diff-hunk-header">
                                  <td colSpan={4} className="gg-diff-code">
                                    {hunk.header}
                                  </td>
                                </tr>
                                {splitRows.map((row, rIdx) => (
                                  <tr key={`${hIdx}-${rIdx}`}>
                                    <td
                                      className={`gg-diff-gutter ${
                                        row.leftType === 'del' ? 'gg-diff-line-del' : ''
                                      }`}
                                    >
                                      {row.leftLineNumber ?? ''}
                                    </td>
                                    <td
                                      className={`gg-diff-code ${
                                        row.leftType === 'del' ? 'gg-diff-line-del' : ''
                                      }`}
                                      style={{ width: '50%' }}
                                    >
                                      {row.leftContent}
                                    </td>
                                    <td
                                      className={`gg-diff-gutter ${
                                        row.rightType === 'add' ? 'gg-diff-line-add' : ''
                                      }`}
                                    >
                                      {row.rightLineNumber ?? ''}
                                    </td>
                                    <td
                                      className={`gg-diff-code ${
                                        row.rightType === 'add' ? 'gg-diff-line-add' : ''
                                      }`}
                                      style={{ width: '50%' }}
                                    >
                                      {row.rightContent}
                                    </td>
                                  </tr>
                                ))}
                              </React.Fragment>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              ) : (
                <div
                  className="gg-empty"
                  style={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '24px'
                  }}
                >
                  Select a file from the list to inspect changes.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
