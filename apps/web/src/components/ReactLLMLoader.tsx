'use client';

import Script from 'next/script';

export function ReactLLMLoader() {
  return (
    <Script
      src="/react-llm.js"
      strategy="lazyOnload"
      onLoad={() => {
        // Initialize React LLM in demo mode
        if (typeof window !== 'undefined' && (window as any).ReactLLM) {
          (window as any).ReactLLM.init({
            mode: 'demo', // Demo mode with Gemini 2.5 Flash
            position: 'bottom-right',
            theme: 'dark'
          });
        }
      }}
    />
  );
}