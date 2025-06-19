import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-sf-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'React LLM - Browser-Native AI Coding Assistant',
  description: 'Chat with your React components using GPT-4, Claude, and more. Click to select, chat to modify, see changes instantly.',
  keywords: ['react', 'ai', 'llm', 'gpt-4', 'claude', 'developer tools', 'code assistant', 'browser'],
  authors: [{ name: 'React LLM Team' }],
  openGraph: {
    title: 'React LLM - Browser-Native AI Coding Assistant',
    description: 'Chat with your React components using GPT-4, Claude, and more.',
    images: ['/og-image.png'],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'React LLM - Browser-Native AI Coding Assistant',
    description: 'Chat with your React components using GPT-4, Claude, and more.',
    images: ['/twitter-image.png'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}
