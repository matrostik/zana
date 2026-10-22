import { useEffect, useState } from 'react';
import { DelayedStencilList } from '../ui/Skeleton.js';
import { DIRECTORY_SLOW_MS } from './useDirectoryLoader.js';

export function DirectoryLoading({ label = 'Loading files' }: { label?: string }) {
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setSlow(true), DIRECTORY_SLOW_MS);
    return () => clearTimeout(timer);
  }, []);
  return slow ? (
    <div className="tree-loading">
      <p role="status">Taking longer than expected</p>
    </div>
  ) : <DelayedStencilList label={label} className="tree-loading" />;
}
