'use client';

import Script from 'next/script';

export function ReactLLMLoader() {
  return (
    <Script
      src="/react-llm.js"
      strategy="afterInteractive"
      onLoad={() => {
        console.log('[ReactLLMLoader] Script loaded, initializing...');
        // Initialize React LLM in demo mode
        if (typeof window !== 'undefined' && (window as any).ReactLLM) {
          console.log('[ReactLLMLoader] ReactLLM found, calling init...');
          try {
            (window as any).ReactLLM.init({
              mode: 'demo', // Demo mode with Gemini 2.5 Flash
              position: 'bottom-right',
              theme: 'dark',
              debug: true // Enable debug logging
            });
            console.log('[ReactLLMLoader] ReactLLM initialized successfully');
          } catch (error) {
            console.error('[ReactLLMLoader] Failed to initialize ReactLLM:', error);
          }
        } else {
          console.error('[ReactLLMLoader] ReactLLM not found on window');
        }
      }}
      onError={(e) => {
        console.error('[ReactLLMLoader] Failed to load script:', e);
      }}
    />
  );
}