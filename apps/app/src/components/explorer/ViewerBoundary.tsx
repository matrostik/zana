import { Component, Suspense, type ReactNode } from 'react';
import { StencilLines } from '../ui/Skeleton.js';

/** A failed editor/preview chunk must never take the file tree down with it. */
export class ViewerBoundary extends Component<{ children: ReactNode }, { error: string | null }> {
  state: { error: string | null } = { error: null };
  static getDerivedStateFromError(error: unknown) {
    return { error: error instanceof Error ? error.message : String(error) };
  }
  render() {
    if (this.state.error) return <div className="explorer-viewer-empty" role="alert">Could not load file viewer: {this.state.error}</div>;
    return <Suspense fallback={<div className="explorer-viewer-empty"><div className="explorer-viewer-loading"><StencilLines label="Loading file viewer" /></div></div>}>{this.props.children}</Suspense>;
  }
}
