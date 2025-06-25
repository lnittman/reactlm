'use client';

import React, { useEffect, useState } from 'react';
import { codeToHtml } from 'shiki';

export interface CodeBlockProps {
  children: string;
  language?: string;
  copy?: boolean;
}

export function CodeBlock({ children, language = 'javascript', copy }: CodeBlockProps) {
  const [html, setHtml] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const highlight = async () => {
      try {
        const highlighted = await codeToHtml(children, {
          lang: language,
          theme: 'github-light',
          transformers: [
            {
              pre(node) {
                node.properties.class = 'code-block';
                node.properties.style = '';
              }
            }
          ]
        });
        setHtml(highlighted);
      } catch {
        // Fallback to plain text if highlighting fails
        setHtml(`<pre class="code-block"><code>${children}</code></pre>`);
      } finally {
        setLoading(false);
      }
    };

    highlight();
  }, [children, language]);

  if (loading) {
    return (
      <div className="relative">
        <pre className="code-block">
          <code>{children}</code>
        </pre>
        {copy && (
          <button
            onClick={() => navigator.clipboard.writeText(children)}
            className="absolute right-2 top-2 rounded-md bg-background/80 px-2 py-1 text-xs text-muted-foreground hover:bg-background"
          >
            Copy
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      <div dangerouslySetInnerHTML={{ __html: html }} />
      {copy && (
        <button
          onClick={() => navigator.clipboard.writeText(children)}
          className="absolute right-2 top-2 rounded-md bg-background/80 px-2 py-1 text-xs text-muted-foreground hover:bg-background"
        >
          Copy
        </button>
      )}
    </div>
  );
}