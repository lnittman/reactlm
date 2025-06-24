import './globals.css';
import type { ReactNode } from 'react';
import { RootProvider } from 'fumadocs-ui/provider';

export const metadata = {
  title: {
    template: '%s | ReactLM',
    default: 'ReactLM Documentation',
  },
  description: 'Complete guide to using ReactLM - browser-native AI coding assistant for React developers.',
  keywords: [
    'react',
    'ai',
    'documentation',
    'llm',
    'openrouter',
    'component selection',
    'live coding',
    'developer tools',
    'gpt-4',
    'claude',
    'gemini',
  ],
  authors: [{ name: 'ReactLM Team' }],
  creator: 'ReactLM Team',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://docs.reactlm.dev',
    title: 'ReactLM Documentation',
    description: 'Learn to use ReactLM for AI-powered development',
    siteName: 'ReactLM Documentation',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ReactLM Documentation',
    description: 'Learn to use ReactLM for AI-powered development',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <RootProvider>
          {children}
        </RootProvider>
      </body>
    </html>
  );
}