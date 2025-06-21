import { defineConfig } from 'tsup';
import fs from 'fs';
import path from 'path';

export default defineConfig([
  // Main library build
  {
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
        
        // Set up public path for assets
        var scripts = document.getElementsByTagName('script');
        var currentScript = Array.from(scripts).find(script => script.src.includes('react-llm.js'));
        
        if (currentScript) {
          var scriptUrl = currentScript.src;
          window.__PUBLIC_PATH__ = scriptUrl.substring(0, scriptUrl.lastIndexOf('/') + 1);
          console.log('[ReactLLM] Public path set to:', window.__PUBLIC_PATH__);
        }
        
        console.log('[ReactLLM] Ready for initialization. Call ReactLLM.init() with config.');
      })();`,
    };
    options.jsxFactory = 'h';
    options.jsxFragment = 'Fragment';
    options.jsx = 'transform';
    options.target = 'es2020';
    options.platform = 'browser';
    },
    // No onSuccess needed since we're not using SQLite WASM anymore
  },
  // CLI build
  {
    entry: {
      'cli': 'src/cli.ts'
    },
    splitting: false,
    sourcemap: false,
    clean: false, // Don't clean so we keep the main library files
    format: ['cjs'],
    dts: false,
    minify: false,
    banner: {
      js: '#!/usr/bin/env node'
    },
    esbuildOptions: (options) => {
      options.platform = 'node';
      options.target = 'node18';
    },
  }
]);
