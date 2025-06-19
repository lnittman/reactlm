# Agent 3: Launch & Distribution

## Mission
Prepare React LLM as a browser-native AI coding assistant for public launch. Focus on multi-model LLM support, seamless distribution across all channels, and zero-friction developer experience from installation to production use.

## Deliverables

### 1. GitHub Repository Setup

#### Repository Structure
```
react-llm/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.yml
│   │   ├── feature_request.yml
│   │   └── config.yml
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── workflows/
│   │   ├── ci.yml              # Test, lint, type-check
│   │   ├── release.yml         # Auto-publish to npm
│   │   ├── docs.yml            # Deploy documentation
│   │   └── extension.yml       # Build browser extension
│   ├── FUNDING.yml
│   └── dependabot.yml
├── packages/                    # Monorepo packages
├── apps/                       # Web apps
├── .changeset/                 # Version management
│   └── config.json
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── SECURITY.md
├── LICENSE
└── README.md
```

#### Professional README
```markdown
# React LLM

<p align="center">
  <img src="https://react-llm.dev/logo.svg" width="120" alt="React LLM">
</p>

<p align="center">
  <strong>Visual debugging for React with AI assistance</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/react-llm">
    <img src="https://img.shields.io/npm/v/react-llm?style=flat-square" alt="npm version">
  </a>
  <a href="https://github.com/your-org/react-llm/actions">
    <img src="https://img.shields.io/github/actions/workflow/status/your-org/react-llm/ci.yml?style=flat-square" alt="CI Status">
  </a>
  <a href="https://bundlephobia.com/package/react-llm">
    <img src="https://img.shields.io/bundlephobia/minzip/react-llm?style=flat-square" alt="Bundle Size">
  </a>
  <a href="LICENSE">
    <img src="https://img.shields.io/npm/l/react-llm?style=flat-square" alt="License">
  </a>
</p>

<p align="center">
  <a href="https://react-llm.dev">Website</a> •
  <a href="https://docs.react-llm.dev">Documentation</a> •
  <a href="https://react-llm.dev/demo">Demo</a> •
  <a href="https://discord.gg/react-llm">Discord</a>
</p>

---

## ✨ Features

- 🎯 **Visual Component Selection** - Click any component to chat about it
- 🤖 **Multi-Model AI** - GPT-4, Claude 3 Opus, Gemini Ultra, and more
- ✏️ **Live Code Editing** - Make changes directly from chat (dev mode)
- 📚 **Component Library** - Save and reuse patterns across projects
- 🔍 **Production Exploration** - Learn from any website's components
- ⚡ **Zero Config** - Single script tag to get started
- 🎨 **Beautiful UI** - Minimal, non-intrusive floating interface

## 🚀 Quick Start

### Script Tag (Recommended)
```html
<script src="https://unpkg.com/react-llm@latest/dist/react-llm.js"></script>
<script>
  ReactLLM.init({ 
    providers: {
      openai: 'sk-...',      // Optional: OpenAI API key
      anthropic: 'sk-ant-...', // Optional: Anthropic API key
      openrouter: 'sk-or-...'  // Recommended: OpenRouter for all models
    },
    // Model selection happens after initialization
  });
</script>
```

### NPM
```bash
npm install --save-dev react-llm
```

```javascript
import { ReactLLM } from 'react-llm';

ReactLLM.init({ 
  providers: {
    openrouter: process.env.OPENROUTER_API_KEY // Access all models with one key
  },
  // User selects model from available options
  mode: 'development' // Enables file editing features
});
```

## 📸 Screenshots

<p align="center">
  <img src="https://react-llm.dev/screenshots/inspection.png" width="600" alt="Component Inspection">
</p>

## 🎯 Use Cases

### Development Mode
- **Live Code Editing**: Chat with AI to modify components in real-time
- **Component Understanding**: Ask AI to explain complex components
- **Refactoring Assistant**: Get help restructuring your code
- **Test Generation**: Create tests based on component behavior

### Production Mode  
- **Component Discovery**: Explore how any website is built
- **Pattern Learning**: Save UI patterns you like for future use
- **Implementation Help**: Ask AI how to recreate components
- **Team Knowledge Sharing**: Export and share component libraries

## 🛠️ Configuration

```javascript
ReactLLM.init({
  // LLM Provider Configuration
  providers: {
    openrouter: 'sk-or-...',    // Recommended: Access all models
    openai: 'sk-...',           // Optional: Direct OpenAI access
    anthropic: 'sk-ant-...',    // Optional: Direct Anthropic access
  },
  
  // Model Selection
  // Models are fetched dynamically from providers
  
  // Mode Configuration
  mode: 'development',          // 'development' | 'production'
  fileAccess: true,            // Enable local file editing (dev only)
  
  // UI Settings
  theme: 'dark',               // 'light' | 'dark' | 'auto'
  position: 'bottom-right',    // UI position
  
  // Hotkeys
  hotkeys: {
    toggle: 'cmd+shift+l',     // Toggle React LLM
    select: 'cmd+shift+c',     // Component selection mode
    chat: 'cmd+shift+k',       // Focus chat input
  }
});
```

## 🔌 Framework Integration

### Next.js
```bash
npm install --save-dev @react-llm/next
```

```javascript
// next.config.js
const withReactLLM = require('@react-llm/next');

module.exports = withReactLLM({
  reactLLM: {
    providers: {
      openrouter: process.env.OPENROUTER_API_KEY,
    },
    // Models fetched from OpenRouter API
    enableFileAccess: true, // For dev mode features
  }
});
```

### Vite
```bash
npm install --save-dev @react-llm/vite
```

```javascript
// vite.config.js
import reactLLM from '@react-llm/vite';

export default {
  plugins: [
    reactLLM({
      providers: {
        openrouter: process.env.VITE_OPENROUTER_API_KEY,
      },
      // Models fetched dynamically
      enableHMR: true, // Auto-refresh on AI-generated changes
    })
  ]
};
```

## 📚 Documentation

Visit [docs.react-llm.dev](https://docs.react-llm.dev) for:
- [Getting Started Guide](https://docs.react-llm.dev/getting-started)
- [API Reference](https://docs.react-llm.dev/api)
- [Examples](https://docs.react-llm.dev/examples)
- [Troubleshooting](https://docs.react-llm.dev/troubleshooting)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

MIT © [Your Name]

---

<p align="center">
  Made with ❤️ by developers, for developers
</p>
```

### 2. NPM Package Configuration

#### Root package.json
```json
{
  "name": "react-llm-monorepo",
  "private": true,
  "workspaces": [
    "packages/*",
    "apps/*"
  ],
  "scripts": {
    "build": "turbo run build",
    "dev": "turbo run dev",
    "lint": "turbo run lint",
    "test": "turbo run test",
    "changeset": "changeset",
    "version": "changeset version",
    "release": "turbo run build --filter=./packages/* && changeset publish"
  },
  "devDependencies": {
    "@changesets/cli": "^2.26.2",
    "turbo": "^1.10.0",
    "typescript": "^5.3.0"
  }
}
```

#### Core Package (packages/react-llm/package.json)
```json
{
  "name": "react-llm",
  "version": "0.1.0",
  "description": "Browser-native AI coding assistant for React developers",
  "keywords": [
    "react",
    "ai",
    "LLM",
    "gpt-4",
    "claude",
    "developer-tools",
    "code-assistant",
    "browser-native",
    "component-selection",
    "live-editing"
  ],
  "homepage": "https://react-llm.dev",
  "bugs": {
    "url": "https://github.com/your-org/react-llm/issues"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/your-org/react-llm.git"
  },
  "license": "MIT",
  "author": "Your Name <email@example.com>",
  "sideEffects": false,
  "type": "module",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./package.json": "./package.json"
  },
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "files": [
    "dist",
    "README.md"
  ],
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "lint": "eslint src --ext .ts,.tsx",
    "test": "vitest",
    "typecheck": "tsc --noEmit"
  },
  "dependencies": {
    "@openrouter/sdk": "^1.0.0",
    "bippy": "^0.4.0",
    "preact": "^10.19.3",
    "@preact/signals": "^1.2.0",
    "@sqlite.org/sqlite-wasm": "^3.45.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "tsup": "^8.0.0",
    "vitest": "^1.0.0"
  },
  "peerDependencies": {
    "react": ">=16.8.0",
    "react-dom": ">=16.8.0"
  },
  "peerDependenciesMeta": {
    "react": {
      "optional": true
    },
    "react-dom": {
      "optional": true
    }
  },
  "engines": {
    "node": ">=14.0.0"
  },
  "publishConfig": {
    "access": "public"
  }
}
```

### 3. GitHub Actions Workflows

#### CI Workflow (.github/workflows/ci.yml)
```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint

  typecheck:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm typecheck

  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm test

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - uses: actions/upload-artifact@v4
        with:
          name: dist
          path: packages/*/dist
```

#### Release Workflow (.github/workflows/release.yml)
```yaml
name: Release

on:
  push:
    branches: [main]

concurrency: ${{ github.workflow }}-${{ github.ref }}

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      
      - run: pnpm install --frozen-lockfile
      
      - name: Create Release Pull Request or Publish
        id: changesets
        uses: changesets/action@v1
        with:
          publish: pnpm release
          version: pnpm version
          commit: 'chore: release packages'
          title: 'chore: release packages'
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
      
      - name: Upload to CDN
        if: steps.changesets.outputs.published == 'true'
        run: |
          pnpm upload-cdn
        env:
          CDN_UPLOAD_KEY: ${{ secrets.CDN_UPLOAD_KEY }}
```

### 4. Browser Extension

#### Extension Structure
```
packages/browser-extension/
├── manifest.json
├── background.js
├── content.js
├── popup/
│   ├── popup.html
│   └── popup.js
├── options/
│   ├── options.html
│   └── options.js
└── icons/
    ├── icon-16.png
    ├── icon-48.png
    └── icon-128.png
```

#### Manifest V3 (manifest.json)
```json
{
  "manifest_version": 3,
  "name": "React LLM",
  "version": "1.0.0",
  "description": "Visual debugging for React with AI assistance",
  "permissions": [
    "activeTab",
    "storage",
    "scripting"
  ],
  "host_permissions": [
    "http://localhost/*",
    "https://*/*"
  ],
  "background": {
    "service_worker": "background.js",
    "type": "module"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"],
      "run_at": "document_idle"
    }
  ],
  "action": {
    "default_popup": "popup/popup.html",
    "default_icon": {
      "16": "icons/icon-16.png",
      "48": "icons/icon-48.png",
      "128": "icons/icon-128.png"
    }
  },
  "options_page": "options/options.html",
  "icons": {
    "16": "icons/icon-16.png",
    "48": "icons/icon-48.png",
    "128": "icons/icon-128.png"
  },
  "web_accessible_resources": [
    {
      "resources": ["react-llm.js"],
      "matches": ["<all_urls>"]
    }
  ]
}
```

### 5. Framework Plugins

#### Next.js Plugin
```typescript
// packages/next/src/index.ts
import type { NextConfig } from 'next';

export interface ReactLLMOptions {
  apiKey?: string;
  enabled?: boolean;
  mode?: 'development' | 'production' | 'always';
}

export function withReactLLM(
  nextConfig: NextConfig = {},
  options: ReactLLMOptions = {}
): NextConfig {
  return {
    ...nextConfig,
    
    webpack(config, context) {
      if (options.enabled ?? context.dev) {
        // Inject React LLM script
        config.plugins.push(
          new ReactLLMWebpackPlugin(options)
        );
      }
      
      // Call existing webpack config
      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, context);
      }
      
      return config;
    },
    
    // Add React LLM to app HTML
    async headers() {
      const headers = await nextConfig.headers?.() || [];
      
      if (options.enabled ?? process.env.NODE_ENV === 'development') {
        headers.push({
          source: '/:path*',
          headers: [
            {
              key: 'X-React-LLM-Enabled',
              value: 'true',
            },
          ],
        });
      }
      
      return headers;
    },
  };
}
```

#### Vite Plugin
```typescript
// packages/vite/src/index.ts
import type { Plugin } from 'vite';

export interface ReactLLMViteOptions {
  apiKey?: string;
  enabled?: boolean;
}

export function reactLLM(options: ReactLLMViteOptions = {}): Plugin {
  return {
    name: 'react-llm',
    
    transformIndexHtml(html) {
      if (options.enabled ?? true) {
        return {
          html,
          tags: [
            {
              tag: 'script',
              attrs: {
                src: 'https://unpkg.com/react-llm@latest/dist/react-llm.js',
                defer: true,
              },
              injectTo: 'body',
            },
            {
              tag: 'script',
              children: `
                window.addEventListener('DOMContentLoaded', () => {
                  if (window.ReactLLM) {
                    window.ReactLLM.init({
                      providers: {
                        openrouter: '${options.openrouterKey || process.env.VITE_OPENROUTER_API_KEY}'
                      },
                      // Model selection UI shown on init
                      mode: '${options.mode || 'development'}'
                    });
                  }
                });
              `,
              injectTo: 'body',
            },
          ],
        };
      }
      return html;
    },
  };
}
```

### 6. CDN Distribution

#### CDN Upload Script
```typescript
// scripts/upload-cdn.ts
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { readFile } from 'fs/promises';
import { resolve } from 'path';

const s3 = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

async function uploadToCDN() {
  const version = process.env.npm_package_version;
  const files = [
    'dist/react-llm.js',
    'dist/react-llm.js.map',
    'dist/react-llm.min.js',
    'dist/react-llm.min.js.map',
  ];
  
  for (const file of files) {
    const filePath = resolve('packages/react-llm', file);
    const content = await readFile(filePath);
    
    // Upload versioned
    await s3.send(new PutObjectCommand({
      Bucket: 'react-llm-cdn',
      Key: `v${version}/${file}`,
      Body: content,
      ContentType: 'application/javascript',
      CacheControl: 'public, max-age=31536000', // 1 year
    }));
    
    // Upload latest
    await s3.send(new PutObjectCommand({
      Bucket: 'react-llm-cdn',
      Key: `latest/${file}`,
      Body: content,
      ContentType: 'application/javascript',
      CacheControl: 'public, max-age=300', // 5 minutes
    }));
  }
  
  console.log(`✅ Uploaded version ${version} to CDN`);
}

uploadToCDN().catch(console.error);
```

### 7. Documentation

#### API Documentation
```typescript
// docs/content/api/index.mdx
---
title: API Reference
---

# API Reference

## ReactLLM.init(config)

Initialize React LLM with your configuration.

### Parameters

- `config` (ReactLLMConfig): Configuration object

### ReactLLMConfig

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `providers` | `object` | Required | API keys for LLM providers |
| `modelSelection` | `'auto' \| 'manual'` | `'manual'` | Model selection mode |
| `mode` | `'development' \| 'production'` | `'production'` | Operating mode |
| `fileAccess` | `boolean` | `false` | Enable file system access (dev only) |
| `theme` | `'light' \| 'dark' \| 'auto'` | `'auto'` | Color theme |
| `position` | `'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left'` | `'bottom-right'` | UI position |
| `hotkeys` | `object` | See below | Keyboard shortcuts |

### Example

\`\`\`javascript
ReactLLM.init({
  providers: {
    openrouter: 'sk-or-...', // Get from openrouter.ai
  },
  // Model selected by user from available options
  mode: 'development',
  fileAccess: true,
  theme: 'dark',
  position: 'bottom-right',
  hotkeys: {
    toggle: 'cmd+shift+l',
    select: 'cmd+shift+c',
    chat: 'cmd+shift+k',
  }
});
\`\`\`

## ReactLLM.models()

Get available AI models from configured providers.

### Returns

Promise<Model[]> - Array of available models with pricing info

### Example

\`\`\`javascript
const models = await ReactLLM.models();
// Returns current available models from all providers
// Models are fetched directly from provider APIs:
// - OpenAI: /v1/models endpoint
// - Anthropic: /v1/models endpoint  
// - Google: /v1/models endpoint
// - OpenRouter: /api/v1/models (aggregates all)
\`\`\`

## ReactLLM.inspect(selector)

Programmatically inspect a component.

### Parameters

- `selector` (string): CSS selector for the element

### Example

\`\`\`javascript
ReactLLM.inspect('.my-component');
\`\`\`

## ReactLLM.showMetrics()

Display performance overlay showing render metrics.

### Example

\`\`\`javascript
ReactLLM.showMetrics();
\`\`\`

## ReactLLM.hideMetrics()

Hide the performance overlay.

### Example

\`\`\`javascript
ReactLLM.hideMetrics();
\`\`\`

## Events

React LLM emits events you can listen to:

### componentSelected

Fired when a component is selected.

\`\`\`javascript
window.addEventListener('ReactLLM:componentSelected', (event) => {
  console.log('Selected:', event.detail);
  // event.detail includes: name, props, state, path
});
\`\`\`

### modelChanged

Fired when the AI model is changed.

\`\`\`javascript
window.addEventListener('ReactLLM:modelChanged', (event) => {
  console.log('New model:', event.detail.model);
  console.log('Provider:', event.detail.provider);
});
\`\`\`

### codeModified

Fired when code is modified through AI chat.

\`\`\`javascript
window.addEventListener('ReactLLM:codeModified', (event) => {
  console.log('File:', event.detail.file);
  console.log('Changes:', event.detail.changes);
});
\`\`\`
```

### 8. Community & Support

#### Discord Server Structure
```
React LLM Community
├── 📢 announcements
├── 🎯 general
├── 💬 help
├── 🐛 bug-reports
├── 💡 feature-requests
├── 🎨 showcase
├── 🔧 contributing
└── 🤖 ai-discussions
```

#### Issue Templates
```yaml
# .github/ISSUE_TEMPLATE/bug_report.yml
name: Bug Report
description: Create a report to help us improve
title: "[Bug]: "
labels: ["bug", "triage"]
body:
  - type: textarea
    id: description
    attributes:
      label: Describe the bug
      description: A clear description of the bug
      placeholder: Tell us what happened
    validations:
      required: true
  
  - type: textarea
    id: reproduction
    attributes:
      label: Steps to reproduce
      description: Steps to reproduce the behavior
      value: |
        1. Go to '...'
        2. Click on '...'
        3. See error
    validations:
      required: true
  
  - type: input
    id: version
    attributes:
      label: React LLM version
      placeholder: ex. 1.0.0
    validations:
      required: true
  
  - type: dropdown
    id: browsers
    attributes:
      label: Browser
      multiple: true
      options:
        - Chrome
        - Firefox
        - Safari
        - Edge
```

### 9. Launch Strategy

#### Pre-Launch Checklist
- [ ] Security audit completed
- [ ] Performance benchmarks documented
- [ ] Cross-browser testing passed
- [ ] Documentation reviewed
- [ ] Demo site live
- [ ] CDN configured
- [ ] npm package tested
- [ ] Extension approved in stores

#### Launch Week Plan
1. **Monday**: Soft launch to beta testers
2. **Tuesday**: Fix critical issues
3. **Wednesday**: Public announcement
4. **Thursday**: Product Hunt launch
5. **Friday**: Hacker News post

#### Marketing Assets
- Product Hunt gallery images
- Twitter announcement thread
- Dev.to article
- YouTube demo video
- Comparison table vs alternatives

### 10. Monitoring & Analytics

```typescript
// packages/react-llm/src/analytics.ts
export class Analytics {
  track(event: string, properties?: Record<string, any>) {
    // Only in production, only aggregated data
    if (process.env.NODE_ENV === 'production') {
      // Send to privacy-respecting analytics
      fetch('https://api.react-llm.dev/events', {
        method: 'POST',
        body: JSON.stringify({
          event,
          properties: {
            version: VERSION,
            ...properties,
          },
        }),
      }).catch(() => {
        // Fail silently
      });
    }
  }
}

// Track key metrics
analytics.track('init', { 
  mode: config.mode,
  providers: Object.keys(config.providers)
});
analytics.track('component_selected');
analytics.track('ai_chat', { 
  model: currentModel,
  responseTime: time 
});
analytics.track('code_modified', {
  fileType: getFileExtension(file)
});
```

## Success Metrics

1. **Week 1**
   - 1,000 GitHub stars
   - 100 Discord members
   - 10,000 npm downloads

2. **Month 1**
   - 5,000 GitHub stars
   - 1,000 Discord members
   - 100,000 npm downloads
   - 50+ GitHub contributors

3. **Month 3**
   - 15,000 GitHub stars
   - 5,000 Discord members
   - 1M npm downloads
   - Browser extension: 10,000 users