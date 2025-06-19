import './globals.css';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import { RootProvider } from 'fumadocs-ui/provider';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata = {
  title: {
    template: '%s | React LLM',
    default: 'React LLM Documentation',
  },
  description: 'Complete guide to using React LLM - browser-native AI coding assistant for React developers.',
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
  authors: [{ name: 'React LLM Team' }],
  creator: 'React LLM Team',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://docs.react-llm.dev',
    title: 'React LLM Documentation',
    description: 'Learn to use React LLM for AI-powered development',
    siteName: 'React LLM Documentation',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'React LLM Documentation',
    description: 'Learn to use React LLM for AI-powered development',
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
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body>
        <RootProvider>
          {children}
        </RootProvider>
      </body>
    </html>
  );
}