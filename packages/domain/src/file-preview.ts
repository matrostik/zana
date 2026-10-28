export interface PreviewPathRequest { path: string; projectId?: string; candidates?: string[] }
export type PreviewPathResult =
  | { kind: 'resolved'; source: 'workspace'; path: string }
  | { kind: 'ambiguous' | 'incomplete'; candidates: string[] }
  | { kind: 'not_found'; path: string };
