import { z } from 'zod';

const path = z.string().trim().min(1).max(1024).refine(value => !value.includes('\0') && !value.split(/[/\\]/u).includes('..'));
export const previewPathRequestSchema = z.object({
  path,
  projectId: z.string().min(1).max(256).optional(),
  candidates: z.array(path).max(50).optional()
}).strict();
export type { PreviewPathRequest, PreviewPathResult } from '@zana-ai/zcc-domain/product';
