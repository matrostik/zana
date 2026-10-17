import { definePluginApp } from '@zana-ai/zcc-plugin-sdk/app';
import { GIT_GRAPH_STYLES } from './src/app/styles.js';
import {
  GitGraphProjectTab,
  GitGraphDetachedPlaceholder
} from './src/app/GitGraphProjectTab.js';

const STYLE_ELEMENT_ID = 'zcc-ext-git-graph-styles';

function ensureStylesInjected(): void {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ELEMENT_ID)) return;
  const styleEl = document.createElement('style');
  styleEl.id = STYLE_ELEMENT_ID;
  styleEl.textContent = GIT_GRAPH_STYLES;
  document.head.appendChild(styleEl);
}

export default definePluginApp((app) => {
  ensureStylesInjected();

  // Project Tab (left menu inside each project)
  app.slots.projectTab({
    id: 'git-graph',
    label: 'Git Graph',
    icon: 'GitBranch',
    order: 40,
    global: false,
    header: 'custom',
    detachable: true,
    component: GitGraphProjectTab,
    detachedPlaceholder: GitGraphDetachedPlaceholder
  });

  // Command Palette Quick Open Action (available when viewing a project)
  app.slots.commandPaletteAction({
    id: 'open-git-graph',
    title: 'Git Graph: View Git Graph',
    isAvailable: (ctx) => Boolean(ctx.projectId),
    run: (ctx) => {
      if (ctx.projectId) {
        ctx.toProject(ctx.projectId, { tabId: 'git-graph' });
      }
    }
  });
});
