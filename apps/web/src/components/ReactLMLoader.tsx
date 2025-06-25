'use client';

import Script from 'next/script';

interface ReactLMConfig {
  mode: string;
  position: string;
  theme: string;
  debug: boolean;
}

interface ReactLMGlobal {
  init: (config: ReactLMConfig) => void;
}

declare global {
  interface Window {
    ReactLM?: ReactLMGlobal;
  }
}

export function ReactLMLoader() {
  return (
    <Script
      src="/reactlm.js"
      strategy="afterInteractive"
      onLoad={() => {
        console.log('[ReactLMLoader] Script loaded, initializing...');
        // Initialize ReactLM in demo mode
        if (typeof window !== 'undefined' && window.ReactLM) {
          console.log('[ReactLMLoader] ReactLM found, calling init...');
          try {
            window.ReactLM.init({
              mode: 'demo', // Demo mode with Gemini 2.5 Flash
              position: 'bottom-right',
              theme: 'dark',
              debug: true // Enable debug logging
            });
            console.log('[ReactLMLoader] ReactLM initialized successfully');
          } catch (error) {
            console.error('[ReactLMLoader] Failed to initialize ReactLM:', error);
          }
        } else {
          console.error('[ReactLMLoader] ReactLM not found on window');
        }
      }}
      onError={(e) => {
        console.error('[ReactLMLoader] Failed to load script:', e);
      }}
    />
  );
}