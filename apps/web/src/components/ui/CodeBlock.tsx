'use client';

import React, { useEffect, useState } from 'react';
import { codeToHtml } from 'shiki';

export interface CodeBlockProps {
  children: string;
  language?: string;
}

export function CodeBlock({ children, language = 'javascript' }: CodeBlockProps) {
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
      } catch (error) {
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
      <pre className="code-block">
        <code>{children}</code>
      </pre>
    );
  }

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}