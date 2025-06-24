import { defineDocs, defineConfig } from 'fumadocs-mdx/config';
import { z } from 'zod';

export const { docs, meta } = defineDocs({
  dir: 'content/docs',
  docs: {
    schema: {
      frontmatter: z.object({
        title: z.string(),
        description: z.string().optional(),
        date: z.date().optional(),
        author: z.string().optional(),
        icon: z.string().optional(),
        image: z.string().optional(),
        badge: z.string().optional(),
        category: z.string().optional(),
      }).strict(),
    },
  },
  meta: {
    schema: {
      frontmatter: z.object({
        title: z.string(),
        description: z.string().optional(),
        icon: z.string().optional(),
        root: z.boolean().optional(),
        defaultOpen: z.boolean().optional(),
      }).strict(),
    },
  },
});

export default defineConfig({
  lastModifiedTime: 'git',
  basePath: '/docs',
});