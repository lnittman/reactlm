import type { MDXComponents } from 'mdx/types';
import { Callout } from 'fumadocs-ui/components/callout';
import { Tab, Tabs } from 'fumadocs-ui/components/tabs';
import { Step, Steps } from 'fumadocs-ui/components/steps';
import { InteractiveDemo } from '@/components/InteractiveDemo';
import { Card } from '@/components/ui/card';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
    Callout,
    Card,
    Tab,
    Tabs,
    Step,
    Steps,
    InteractiveDemo,
    // Custom heading with anchor links
    h1: ({ children, id, ...props }) => (
      <h1 id={id} {...props}>
        {children}
      </h1>
    ),
    h2: ({ children, id, ...props }) => (
      <h2 id={id} {...props}>
        {children}
      </h2>
    ),
    h3: ({ children, id, ...props }) => (
      <h3 id={id} {...props}>
        {children}
      </h3>
    ),
    // Custom code blocks with syntax highlighting
    pre: ({ children, ...props }) => (
      <pre className="bg-slate-950 text-slate-50 p-4 rounded-lg overflow-x-auto" {...props}>
        {children}
      </pre>
    ),
    code: ({ children, className, ...props }) => {
      const isInline = !className;
      if (isInline) {
        return (
          <code 
            className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-sm font-mono" 
            {...props}
          >
            {children}
          </code>
        );
      }
      return <code className={className} {...props}>{children}</code>;
    },
  };
}