import { useEffect, useRef, useState, type ReactNode } from 'react';
import { product } from '../lib/product-client.js';
import { dispatchThreadOpenFile } from './thread/secondary-panel/useThreadOpenFileSignal.js';

type Resolution = Awaited<ReturnType<typeof product.threads.resolvePreviewPath>>;

export function MarkdownFileLink({
  token,
  title = token,
  threadId,
  projectId,
  hints = [],
  children,
  link = false,
  href
}: {
  token: string;
  title?: string;
  threadId: string;
  projectId?: string | null;
  hints?: readonly string[];
  children?: ReactNode;
  link?: boolean;
  href?: string;
}) {
  const [state, setState] = useState<
    | { kind: 'idle' | 'loading' }
    | { kind: 'choices'; paths: string[] }
    | { kind: 'incomplete'; paths: string[] }
    | { kind: 'error'; message: string }
  >({ kind: 'idle' });
  const requestGeneration = useRef(0);
  useEffect(() => () => { requestGeneration.current += 1; }, [token, threadId, projectId]);

  const resolve = async () => {
    const generation = ++requestGeneration.current;
    setState({ kind: 'loading' });
    try {
      const result: Resolution = await product.threads.resolvePreviewPath(threadId, {
        path: token,
        hints: [...hints],
        ...(projectId ? { projectId } : {})
      });
      if (requestGeneration.current !== generation) return;
      if (result.kind === 'resolved') {
        dispatchThreadOpenFile(threadId, result.path);
        setState({ kind: 'idle' });
      } else if (result.kind === 'ambiguous') {
        setState({ kind: 'choices', paths: result.paths });
      } else if (result.kind === 'incomplete') {
        setState({ kind: 'incomplete', paths: result.paths });
      } else {
        setState({ kind: 'error', message: `Could not find ${result.path}` });
      }
    } catch (error) {
      if (requestGeneration.current !== generation) return;
      setState({ kind: 'error', message: error instanceof Error ? error.message : 'Could not resolve this file' });
    }
  };

  return (
    <span className="inbox-md-file-link-wrap">
      {link ? (
        <a
          className="inbox-md-file-link"
          href={href ?? token}
          aria-label={`Preview ${token.split(/[/\\]/u).pop() ?? token}`}
          aria-disabled={state.kind === 'loading'}
          title={title}
          onClick={(event) => { event.preventDefault(); if (state.kind !== 'loading') void resolve(); }}
        >
          {state.kind === 'loading' ? 'Resolving…' : children ?? token}
        </a>
      ) : (
        <button
          type="button"
          className="inbox-md-file-chip"
          data-testid="inbox-md-file-chip"
          aria-label={`Preview ${token.split(/[/\\]/u).pop() ?? token}`}
          title={title}
          disabled={state.kind === 'loading'}
          onClick={() => { void resolve(); }}
        >
          {state.kind === 'loading' ? 'Resolving…' : children ?? token}
        </button>
      )}
      {state.kind === 'choices' ? (
        <span role="group" aria-label={`Choose a file matching ${token}`}>
          {state.paths.map((path) => (
            <button key={path} type="button" onClick={() => dispatchThreadOpenFile(threadId, path)}>{path}</button>
          ))}
        </span>
      ) : null}
      {state.kind === 'incomplete' ? (
        <span role="status">
          Could not check every folder. Choose a result or use a full path.
          {state.paths.map((path) => (
            <button key={path} type="button" onClick={() => dispatchThreadOpenFile(threadId, path)}>{path}</button>
          ))}
        </span>
      ) : null}
      {state.kind === 'error' ? (
        <span role="status">
          {state.message} <button type="button" onClick={() => { void resolve(); }}>Try again</button>
        </span>
      ) : null}
    </span>
  );
}
