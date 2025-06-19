import { defineConfig } from 'tsup';
import fs from 'fs';
import path from 'path';

export default defineConfig({
  entry: {
    'react-llm': 'src/index.ts'
  },
  splitting: false,
  sourcemap: true,
  clean: true,
  format: ['iife'],
  globalName: 'ReactLLM',
  dts: false,
  minify: process.env.NODE_ENV === 'production',
  loader: {
    '.tsx': 'tsx',
  },
  esbuildOptions: (options) => {
    options.banner = {
      js: `/* React LLM - A floating chat interface powered by Gemini - MIT License */`,
    };
    options.footer = {
      js: `
      (function() {
        console.log('[ReactLLM] Bundle loaded');
        
        function initReactLLM() {
          console.log('[ReactLLM] Initializing...');
          var scripts = document.getElementsByTagName('script');
          var currentScript = Array.from(scripts).find(script => script.src.includes('react-llm.js'));
          
          if (!currentScript) {
            console.warn('[ReactLLM] Could not find react-llm.js script tag');
            return;
          }
          
          console.log('[ReactLLM] Script URL:', currentScript.src);
          var scriptUrl = currentScript.src;
          window.__PUBLIC_PATH__ = scriptUrl.substring(0, scriptUrl.lastIndexOf('/') + 1);
          
          var apiKey = window.GEMINI_API_KEY;
          console.log('[ReactLLM] API Key available:', !!apiKey);
          
          if (apiKey && window.ReactLLM) {
            window.ReactLLM.init(apiKey);
          } else {
            console.warn('[ReactLLM] Initialization failed. API Key:', !!apiKey, 'ReactLLM:', !!window.ReactLLM);
          }
        }

        // Try to initialize immediately if document is already loaded
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
          console.log('[ReactLLM] Document already loaded, initializing immediately');
          initReactLLM();
        } else {
          // Otherwise wait for DOMContentLoaded
          console.log('[ReactLLM] Waiting for DOMContentLoaded');
          document.addEventListener('DOMContentLoaded', initReactLLM);
        }
      })();`,
    };
    options.jsxFactory = 'h';
    options.jsxFragment = 'Fragment';
    options.jsx = 'transform';
    options.target = 'es2020';
  },
  async onSuccess() {
    // Copy SQLite WASM files to dist
    const nodeModulesPath = path.resolve('node_modules');
    const sqliteWasmPath = path.join(nodeModulesPath, '@sqlite.org', 'sqlite-wasm', 'sqlite-wasm', 'jswasm');
    const files = ['sqlite3.wasm'];
    
    for (const file of files) {
      const src = path.join(sqliteWasmPath, file);
      const dest = path.join('dist', file);
      if (fs.existsSync(src)) {
        fs.copyFileSync(src, dest);
        console.log(`Copied ${file} to dist/`);
      } else {
        console.warn(`Warning: Could not find ${file} in ${sqliteWasmPath}`);
      }
    }
  },
});
