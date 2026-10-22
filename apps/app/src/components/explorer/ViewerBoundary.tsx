import { Component, Suspense, type ReactNode } from 'react';
import { StencilLines } from '../ui/Skeleton.js';

function sanitizeErrorMessage(error: string): string {
  const firstLine = error.split('\n')[0].trim();
  return firstLine.length > 200 ? `${firstLine.slice(0, 197)}...` : firstLine;
}

const ViewerLoadingFallback = (
  <div className="explorer-viewer-empty">
    <div className="explorer-viewer-loading">
      <StencilLines label="Loading file viewer" />
    </div>
  </div>
);

/** A failed editor/preview chunk must never take the file tree down with it. */
export class ViewerBoundary extends Component<{ children: ReactNode }, { error: string | null }> {
  state: { error: string | null } = { error: null };

  static getDerivedStateFromError(error: unknown) {
    return { error: sanitizeErrorMessage(error instanceof Error ? error.message : String(error)) };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="explorer-viewer-empty" role="alert">
          Could not load file viewer: {this.state.error}
        </div>
      );
    }
    return <Suspense fallback={ViewerLoadingFallback}>{this.props.children}</Suspense>;
  }
}
