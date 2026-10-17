import React, { useState } from 'react';
import type {
  GitGraphGlobalSettings,
  GitRemoteInfo,
  IssueLinkingRule,
  PullRequestProviderKind,
  RepoSettings
} from '../../server/types.js';
import type { GitMutationAction } from '../../server/git-actions.js';

export interface RepoSettingsWidgetProps {
  open: boolean;
  remotes: readonly GitRemoteInfo[];
  repoSettings: RepoSettings;
  globalSettings: GitGraphGlobalSettings;
  onClose: () => void;
  onRunGitAction: (action: GitMutationAction) => void;
  onUpdateRepoSettings: (patch: Partial<RepoSettings>) => void;
  onUpdateGlobalSettings: (patch: Partial<GitGraphGlobalSettings>) => void;
  onExportRepoConfig: () => void;
}

export function RepoSettingsWidget({
  open,
  remotes,
  repoSettings,
  globalSettings,
  onClose,
  onRunGitAction,
  onUpdateRepoSettings,
  onUpdateGlobalSettings,
  onExportRepoConfig
}: RepoSettingsWidgetProps) {
  const [newRemoteName, setNewRemoteName] = useState('');
  const [newRemoteUrl, setNewRemoteUrl] = useState('');
  const [newIssuePattern, setNewIssuePattern] = useState('');
  const [newIssueUrl, setNewIssueUrl] = useState('');

  if (!open) return null;

  return (
    <div className="gg-modal-backdrop" onClick={onClose}>
      <div
        className="gg-modal"
        style={{ width: '560px' }}
        onClick={(e) => e.stopPropagation()}
        data-testid="gg-repo-settings-modal"
      >
        <div className="gg-modal-header">
          <span>Repository & Graph Settings</span>
          <button type="button" className="gg-btn gg-btn-icon" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="gg-modal-body" style={{ gap: '16px' }}>
          {/* Remotes Management */}
          <div className="gg-field">
            <label className="gg-field-label">Git Remotes ({remotes.length})</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {remotes.map((r) => (
                <div
                  key={r.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                    padding: '6px 8px',
                    background: 'var(--bg-secondary, #0f1318)',
                    borderRadius: '4px',
                    border: '1px solid var(--border-color, #252b35)'
                  }}
                >
                  <div style={{ overflow: 'hidden' }}>
                    <strong>{r.name}</strong>
                    <div
                      style={{
                        fontSize: '11px',
                        color: 'var(--text-secondary)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {r.fetchUrl}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }}>
                    <button
                      type="button"
                      className="gg-btn"
                      onClick={() =>
                        onRunGitAction({ kind: 'remote-prune', name: r.name })
                      }
                      title="Prune stale remote-tracking branches"
                    >
                      Prune
                    </button>
                    <button
                      type="button"
                      className="gg-btn"
                      onClick={() =>
                        onRunGitAction({ kind: 'remote-delete', name: r.name })
                      }
                      title="Remove Remote"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="text"
                  className="gg-input"
                  style={{ width: '110px' }}
                  placeholder="upstream"
                  value={newRemoteName}
                  onChange={(e) => setNewRemoteName(e.target.value)}
                />
                <input
                  type="text"
                  className="gg-input"
                  style={{ flex: 1 }}
                  placeholder="https://github.com/org/repo.git"
                  value={newRemoteUrl}
                  onChange={(e) => setNewRemoteUrl(e.target.value)}
                />
                <button
                  type="button"
                  className="gg-btn gg-btn-primary"
                  disabled={!newRemoteName.trim() || !newRemoteUrl.trim()}
                  onClick={() => {
                    onRunGitAction({
                      kind: 'remote-add',
                      name: newRemoteName.trim(),
                      url: newRemoteUrl.trim(),
                      fetch: true
                    });
                    setNewRemoteName('');
                    setNewRemoteUrl('');
                  }}
                >
                  Add Remote
                </button>
              </div>
            </div>
          </div>

          {/* Pull Request Creation Config */}
          <div className="gg-field">
            <label className="gg-field-label">Pull Request Creation</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <select
                className="gg-select"
                value={repoSettings.pullRequestConfig.provider}
                onChange={(e) =>
                  onUpdateRepoSettings({
                    pullRequestConfig: {
                      ...repoSettings.pullRequestConfig,
                      provider: e.target.value as PullRequestProviderKind
                    }
                  })
                }
              >
                <option value="github">GitHub</option>
                <option value="gitlab">GitLab</option>
                <option value="bitbucket">Bitbucket</option>
                <option value="custom">Custom URL Template</option>
              </select>
              <input
                type="text"
                className="gg-input"
                placeholder="Remote (origin)"
                value={repoSettings.pullRequestConfig.remoteName}
                onChange={(e) =>
                  onUpdateRepoSettings({
                    pullRequestConfig: {
                      ...repoSettings.pullRequestConfig,
                      remoteName: e.target.value
                    }
                  })
                }
              />
              <input
                type="text"
                className="gg-input"
                placeholder="Target branch (main)"
                value={repoSettings.pullRequestConfig.targetBranch}
                onChange={(e) =>
                  onUpdateRepoSettings({
                    pullRequestConfig: {
                      ...repoSettings.pullRequestConfig,
                      targetBranch: e.target.value
                    }
                  })
                }
              />
            </div>
          </div>

          {/* Issue Linking Rules */}
          <div className="gg-field">
            <label className="gg-field-label">
              Issue Linking Rules ({repoSettings.issueLinkingRules.length})
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {repoSettings.issueLinkingRules.map((rule) => (
                <div
                  key={rule.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                    fontSize: '11px'
                  }}
                >
                  <code>
                    /{rule.pattern}/ → {rule.urlTemplate}
                  </code>
                  <button
                    type="button"
                    className="gg-btn"
                    onClick={() =>
                      onUpdateRepoSettings({
                        issueLinkingRules: repoSettings.issueLinkingRules.filter(
                          (r) => r.id !== rule.id
                        )
                      })
                    }
                  >
                    Remove
                  </button>
                </div>
              ))}
              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="text"
                  className="gg-input"
                  style={{ width: '150px' }}
                  placeholder="#(\d+)"
                  value={newIssuePattern}
                  onChange={(e) => setNewIssuePattern(e.target.value)}
                />
                <input
                  type="text"
                  className="gg-input"
                  style={{ flex: 1 }}
                  placeholder="https://github.com/org/repo/issues/$1"
                  value={newIssueUrl}
                  onChange={(e) => setNewIssueUrl(e.target.value)}
                />
                <button
                  type="button"
                  className="gg-btn"
                  disabled={!newIssuePattern.trim() || !newIssueUrl.trim()}
                  onClick={() => {
                    const nextRule: IssueLinkingRule = {
                      id: `rule-${Date.now()}`,
                      pattern: newIssuePattern.trim(),
                      urlTemplate: newIssueUrl.trim()
                    };
                    onUpdateRepoSettings({
                      issueLinkingRules: [...repoSettings.issueLinkingRules, nextRule]
                    });
                    setNewIssuePattern('');
                    setNewIssueUrl('');
                  }}
                >
                  Add Rule
                </button>
              </div>
            </div>
          </div>

          {/* Graph Display Options */}
          <div className="gg-field">
            <label className="gg-field-label">Graph Display & Muting</label>
            <label className="gg-checkbox-row">
              <input
                type="checkbox"
                checked={globalSettings.muteNonAncestors}
                onChange={(e) =>
                  onUpdateGlobalSettings({ muteNonAncestors: e.target.checked })
                }
              />
              <span>Dim commits that are not ancestors of HEAD</span>
            </label>
            <label className="gg-checkbox-row">
              <input
                type="checkbox"
                checked={globalSettings.muteMergeCommits}
                onChange={(e) =>
                  onUpdateGlobalSettings({ muteMergeCommits: e.target.checked })
                }
              />
              <span>Dim merge commits (commits with &gt;1 parent)</span>
            </label>
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <select
                className="gg-select"
                value={globalSettings.dateFormat}
                onChange={(e) =>
                  onUpdateGlobalSettings({
                    dateFormat: e.target.value as 'relative' | 'iso' | 'datetime'
                  })
                }
              >
                <option value="relative">Date Format: Relative</option>
                <option value="iso">Date Format: ISO</option>
                <option value="datetime">Date Format: Local Date/Time</option>
              </select>
              <select
                className="gg-select"
                value={globalSettings.dateType}
                onChange={(e) =>
                  onUpdateGlobalSettings({
                    dateType: e.target.value as 'author' | 'commit'
                  })
                }
              >
                <option value="author">Show Author Date</option>
                <option value="commit">Show Commit Date</option>
              </select>
            </div>
          </div>
        </div>

        <div className="gg-modal-footer">
          <button
            type="button"
            className="gg-btn"
            onClick={onExportRepoConfig}
            title="Write .git-graph.json into the repository root"
          >
            Export .git-graph.json
          </button>
          <button type="button" className="gg-btn gg-btn-primary" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
