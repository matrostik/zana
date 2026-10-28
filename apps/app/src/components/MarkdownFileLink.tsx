import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { PreviewPathResult } from '@zana-ai/zcc-server-contract';
import { product } from '../lib/product-client.js';
import { dispatchThreadOpenFile } from './thread/secondary-panel/useThreadOpenFileSignal.js';
import './markdown-file-link.css';

/** Inline host-scoped lookup; Markdown rendering itself performs no I/O. */
export function MarkdownFileLink({ path, threadId, projectId, candidates, children, href }: {
  path: string; threadId: string; projectId?: string | null;
  candidates?: readonly string[]; children: ReactNode; href?: string;
}) {
  const [state, setState] = useState<PreviewPathResult | string | 'pending' | null>(null);
  const generation = useRef(0);
  const pending = useRef(false);
  useEffect(() => {
    setState(null); pending.current = false;
    return () => { generation.current++; pending.current = false; };
  }, [path, threadId, projectId]);
  const open = (value: string) => { setState(null); dispatchThreadOpenFile(threadId, value); };
  const activate = () => {
    if (pending.current) return;
    pending.current = true;
    const requestGeneration = generation.current;
    setState('pending');
    const hints = candidates ? [...new Set(candidates.filter(p => p.split(/[/\\]/u).pop() === path)
      .map(p => p.replace(/\\/gu, '/').replace(/^(\.\/)+/u, '')))].slice(0, 50) : undefined;
    void product.threads.resolvePreviewPath(threadId, { path, ...(projectId ? { projectId } : {}), ...(hints?.length ? { candidates: [...hints] } : {}) })
      .then(result => {
        if (requestGeneration !== generation.current) return;
        if (result.kind === 'resolved' || result.kind === 'not_found') open(result.path);
        else setState(result);
      }).catch(error => {
        if (requestGeneration === generation.current) setState(error instanceof Error ? error.message : 'Could not resolve file. Try again.');
      }).finally(() => { if (requestGeneration === generation.current) pending.current = false; });
  };
  const name = path.split(/[/\\]/u).pop() ?? path;
  return <span className="markdown-file-link">
    {href ? <a href={href} title={path} onClick={event => { event.preventDefault(); activate(); }}>{children}</a>
      : <button type="button" className="inbox-md-file-chip" data-testid="inbox-md-file-chip" aria-label={`Preview ${name}`} title={path}
        onClick={event => { event.preventDefault(); event.stopPropagation(); activate(); }}>{children}</button>}
    {typeof state === 'string' ? <span role="status">{state === 'pending' ? ' Finding file…' : state}</span> : state && (state.kind === 'ambiguous' || state.kind === 'incomplete') ?
      <span role="group" aria-label="Choose a file" className="markdown-file-choices">
        <span role="status">{state.kind === 'incomplete' ? 'Lookup was incomplete. Choose a result or use an explicit path.' : 'Choose a file:'}</span>
        {state.candidates.map(candidate => <button type="button" key={candidate} onClick={() => open(candidate)}>{candidate}</button>)}
        <button type="button" onClick={() => setState(null)}>Dismiss</button>
      </span> : null}
  </span>;
}
