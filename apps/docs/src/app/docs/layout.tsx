import type { ReactNode } from 'react';
import { DocsLayout } from 'fumadocs-ui/layout';
import { pageTree } from '@/app/source';

export default function RootDocsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <DocsLayout
      tree={pageTree}
      nav={{
        title: 'React LLM',
        url: '/',
      }}
      sidebar={{
        defaultOpenLevel: 1,
        banner: (
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-lg text-sm">
            <strong>New:</strong> React LLM now supports 100+ AI models via OpenRouter!
          </div>
        ),
      }}
    >
      {children}
    </DocsLayout>
  );
}