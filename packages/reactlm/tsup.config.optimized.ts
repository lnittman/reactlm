import { defineConfig } from 'tsup';

export default defineConfig([
  // Main entry without monitoring (for smaller bundle)
  {
    entry: {
      'reactlm.lite.global': 'src/index.lite.ts'
    },
    splitting: false,
    sourcemap: true,
    clean: true,
    format: ['iife'],
    globalName: 'ReactLM',
    dts: false,
    minify: true,
    loader: {
      '.tsx': 'tsx',
    },
    external: [
      // Exclude heavy dependencies that can be loaded on demand
      './monitoring',
      './db/database',
      'sql.js'
    ],
    esbuildOptions: (options) => {
      options.banner = {
        js: `/* ReactLM Lite - Optimized bundle - MIT License */`,
      };
      options.jsxFactory = 'h';
      options.jsxFragment = 'Fragment';
      options.jsx = 'transform';
      options.target = 'es2020';
      options.platform = 'browser';
      options.treeShaking = true;
      options.drop = ['console', 'debugger'];
    },
  },
  // Monitoring module (loaded on demand)
  {
    entry: {
      'reactlm.monitoring': 'src/monitoring/index.ts'
    },
    splitting: false,
    sourcemap: true,
    clean: false,
    format: ['esm'],
    dts: false,
    minify: true,
    loader: {
      '.tsx': 'tsx',
    },
    esbuildOptions: (options) => {
      options.jsxFactory = 'h';
      options.jsxFragment = 'Fragment';
      options.jsx = 'transform';
      options.target = 'es2020';
      options.platform = 'browser';
      options.treeShaking = true;
    },
  },
  // Database module (loaded on demand)
  {
    entry: {
      'reactlm.database': 'src/db/database.ts'
    },
    splitting: false,
    sourcemap: true,
    clean: false,
    format: ['esm'],
    dts: false,
    minify: true,
    external: ['sql.js'],
    esbuildOptions: (options) => {
      options.target = 'es2020';
      options.platform = 'browser';
      options.treeShaking = true;
    },
  }
]);