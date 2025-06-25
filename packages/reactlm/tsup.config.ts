import { defineConfig } from 'tsup';

export default defineConfig([
  // ESM and CJS builds
  {
    entry: ['src/index.ts'],
    splitting: false,
    sourcemap: true,
    clean: true,
    format: ['esm', 'cjs'],
    dts: false, // TODO: Fix TypeScript errors in bippy-adapter.ts
    minify: process.env.NODE_ENV === 'production',
    loader: {
      '.tsx': 'tsx',
    },
    esbuildOptions: (options) => {
      options.banner = {
        js: `/* ReactLM - Browser-native AI coding assistant - MIT License */`,
      };
      options.jsxFactory = 'h';
      options.jsxFragment = 'Fragment';
      options.jsx = 'transform';
      options.target = 'es2020';
      options.platform = 'browser';
    },
  },
  // IIFE build for browser script tag usage
  {
    entry: {
      'reactlm': 'src/index.ts'
    },
    splitting: false,
    sourcemap: true,
    clean: false,
    format: ['iife'],
    globalName: 'ReactLM',
    dts: false,
    minify: process.env.NODE_ENV === 'production',
    loader: {
      '.tsx': 'tsx',
    },
    esbuildOptions: (options) => {
      options.banner = {
        js: `/* ReactLM - Browser-native AI coding assistant - MIT License */`,
      };
      options.footer = {
        js: `
(function() {
  console.log('[ReactLM] Bundle loaded');
  
  // Set up public path for assets
  var scripts = document.getElementsByTagName('script');
  var currentScript = Array.from(scripts).find(script => script.src.includes('reactlm'));
  
  if (currentScript) {
    var scriptUrl = currentScript.src;
    window.__PUBLIC_PATH__ = scriptUrl.substring(0, scriptUrl.lastIndexOf('/') + 1);
    console.log('[ReactLM] Public path set to:', window.__PUBLIC_PATH__);
  }
  
  console.log('[ReactLM] Ready for initialization. Call ReactLM.init() with config.');
})();`,
      };
      options.jsxFactory = 'h';
      options.jsxFragment = 'Fragment';
      options.jsx = 'transform';
      options.target = 'es2020';
      options.platform = 'browser';
    },
  },
  // CLI build (if exists)
  {
    entry: ['src/cli.ts'],
    splitting: false,
    sourcemap: false,
    clean: false,
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
    // Skip if cli.ts doesn't exist
    skipNodeModulesBundle: true,
    onSuccess: async () => {
      const fs = await import('fs');
      const cliPath = './dist/cli.cjs';
      if (fs.existsSync(cliPath)) {
        fs.chmodSync(cliPath, '755');
      }
    }
  }
]);