import { createMDXSource } from 'fumadocs-mdx';
import { loader } from 'fumadocs-core/source';
import { map } from '@/.map';

export const { getPage, getPages, pageTree } = loader({
  baseUrl: '/docs',
  rootDir: 'docs',
  source: createMDXSource(map),
});

// Temporary static tree as fallback
export const staticPageTree = {
  name: 'Docs',
  children: [
    {
      type: 'page' as const,
      name: 'Introduction',
      url: '/docs',
    },
    {
      type: 'folder' as const,
      name: 'Getting Started',
      index: {
        type: 'page' as const,
        name: 'Overview',
        url: '/docs/getting-started',
      },
      children: [
        {
          type: 'page' as const,
          name: 'Installation',
          url: '/docs/getting-started/installation',
        },
        {
          type: 'page' as const,
          name: 'Quick Start',
          url: '/docs/getting-started/quick-start',
        },
      ],
    },
    {
      type: 'folder' as const,
      name: 'Configuration',
      index: {
        type: 'page' as const,
        name: 'Overview',
        url: '/docs/configuration',
      },
      children: [
        {
          type: 'page' as const,
          name: 'API Keys',
          url: '/docs/configuration/api-keys',
        },
        {
          type: 'page' as const,
          name: 'Options',
          url: '/docs/configuration/options',
        },
      ],
    },
    {
      type: 'folder' as const,
      name: 'API Reference',
      index: {
        type: 'page' as const,
        name: 'Overview',
        url: '/docs/api',
      },
      children: [
        {
          type: 'page' as const,
          name: 'ReactLLM',
          url: '/docs/api/react-llm',
        },
        {
          type: 'page' as const,
          name: 'Components',
          url: '/docs/api/components',
        },
      ],
    },
  ],
};