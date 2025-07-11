import { z } from 'zod';

export const ListWorkspacesInputSchema = z.object({
  query: z.string().optional().describe('Optional query string to filter workspaces by name')
}).strict();

export type ListWorkspacesInputType = z.infer<typeof ListWorkspacesInputSchema>;
