# React LLM - Browser-Native AI Coding Assistant

## Project Overview

React LLM is an easy-to-use AI chat interface that seamlessly integrates into any website, enabling developers to chat with components and code directly in the browser. Inspired by react-scan's architecture but focused on AI-powered development assistance, react-llm brings the power of Claude Code, Codex, and other LLMs natively to the browser environment.

## Current Status

### ✅ Completed
- **Monorepo Structure**: Properly organized packages and apps
- **Marketing Website**: Next.js 15 site at `apps/web` with hero, features, and demo components
- **Core Package Scaffold**: `packages/react-llm` with TypeScript, tsup build, and basic architecture
- **Browser Extension**: Manifest v3 scaffold with popup and content scripts
- **Framework Plugins**: Next.js and Vite plugin scaffolds in `packages/next` and `packages/vite`
- **Build System**: Turbo monorepo with proper workspaces and scripts
- **Documentation**: Comprehensive planning documents and vision

### 🔄 In Progress
- **Core Library**: Components exist but need integration with latest OpenRouter API and bippy
- **Documentation Site**: Empty `apps/docs` needs Fumadocs implementation
- **CI/CD**: Missing GitHub Actions for testing, building, and publishing

### ❌ Needs Work
- **Component Selection**: Missing canvas overlays and visual selection UI
- **File System Integration**: OPFS and File System Access API implementations incomplete
- **Multi-Model Support**: Currently Gemini-only, needs full OpenRouter integration
- **Testing**: No test suite or quality assurance
- **Live Demo**: Marketing site demo needs functional React LLM integration
- **Launch Preparation**: Missing npm publishing, CDN setup, and release workflows

### Vision
- **Primary Use Case**: Development servers - make live code changes through AI chat
- **Secondary Use Case**: Any website - explore components, save patterns, generate ideas
- **Core Philosophy**: Browser-native AI coding that understands your components and codebase

### Key Features
- 🎯 Zero-config integration - single script tag or npm package
- 💬 Floating chat interface with component-aware context
- 🤖 Multi-model LLM support (OpenAI, Anthropic, Google, OpenRouter)
- 🎨 Visual component selection and highlighting via bippy
- ✏️ Live code editing capabilities in development environments
- 🔍 Production-safe component exploration and analysis
- 📚 Component library management - save patterns you like
- 🛠️ Create new components/tasks/revisions seamlessly
- 📱 Shadow DOM isolation for zero style conflicts
- 🗄️ Persistent chat history with SQLite WASM (OPFS)
- 🚀 Works on any website - development or production

## Architecture Overview

### Technology Stack
- **Frontend Framework**: Preact (lightweight React alternative)
- **State Management**: Preact Signals
- **Styling**: CSS-in-JS with Shadow DOM isolation
- **AI Integration**: 
  - OpenRouter (unified API for multiple LLM providers)
  - Support for OpenAI, Anthropic Claude, Google Gemini
  - Model selection and switching capabilities
- **React Instrumentation**: bippy (React fiber traversal library)
- **Component Rendering**: Canvas-based overlays with Web Workers
- **Database**: SQLite WASM with OPFS persistence
- **File System**: 
  - OPFS (Origin Private File System) for browser storage
  - File System Access API for local file editing
- **Build Tool**: tsup with worker inlining
- **Code Quality**: Biome (linter/formatter)
- **Language**: TypeScript with strict mode

### Project Structure

```
packages/
├── react-llm/             # Core library package
│   ├── package.json
│   ├── tsup.config.ts
│   └── src/
│       ├── components/
│       │   ├── Toolbar.tsx         # Main floating chat UI
│       │   ├── Toolbar.styles.ts   # Chat interface styles
│       │   ├── ComponentSelector.tsx # Visual component picker
│       │   ├── ComponentOverlay.tsx  # Canvas-based highlighting
│       │   └── ModelSelector.tsx     # LLM provider/model selection
│       ├── db/
│       │   ├── database.ts         # SQLite operations & persistence
│       │   └── schema.ts           # Database schema definitions
│       ├── filesystem/
│       │   ├── opfs-manager.ts     # OPFS file operations
│       │   └── file-access.ts      # File System Access API
│       ├── llm/
│       │   ├── openrouter.ts       # OpenRouter integration
│       │   └── providers.ts        # Provider management
│       ├── instrumentation/
│       │   └── bippy-adapter.ts    # bippy React fiber access
│       ├── gemini/
│       │   └── gemini.ts           # Legacy Gemini client
│       ├── utils/
│       │   ├── dom.ts             # Shadow DOM setup
│       │   ├── codebase.ts        # Codebase analysis
│       │   └── repomix-runner.ts  # Context generation
│       ├── types/
│       │   └── index.ts           # TypeScript definitions
│       └── index.ts               # Entry point & initialization
├── next/                   # Next.js plugin
│   ├── package.json
│   ├── tsconfig.json
│   └── src/index.ts
├── vite/                   # Vite plugin
│   ├── package.json
│   ├── tsconfig.json
│   └── src/index.ts
└── browser-extension/      # Browser extension
    ├── manifest.json
    ├── package.json
    └── src/

apps/
├── web/                    # Marketing website (Next.js 15)
│   ├── package.json
│   ├── next.config.ts
│   └── src/
│       ├── app/
│       ├── components/
│       └── lib/
└── docs/                   # Documentation site (empty)

scripts/
├── react-llm.js           # CLI tool for installation
├── generate-context.js    # Codebase context generation
└── upload-cdn.js          # CDN upload script
```

## Core Components

### 1. Entry Point (`src/index.ts`)
- Creates Shadow DOM container for style isolation
- Initializes Gemini AI client
- Renders Toolbar component
- Exposes global `window.ReactLLM.init(apiKey)` method

### 2. Toolbar Component (`src/components/Toolbar.tsx`)
- **Main UI component** handling all user interactions
- Features:
  - Chat session management (create, delete, switch)
  - Message history with SQLite persistence
  - Real-time Gemini AI responses
  - Structured response rendering (files, docs, suggestions)
  - Loading states and error handling
  - Minimizable interface
- Uses Preact Signals for reactive state management
- Handles database initialization on mount

### 3. Database Layer (`src/db/`)
- **Schema** (`schema.ts`):
  - `chat_sessions`: Stores chat metadata and project info
  - `messages`: Chat messages with roles and timestamps
  - `relevant_files`: Files mentioned in AI responses
  - `documentation_links`: External documentation references
  - `suggested_queries`: AI-suggested follow-up questions
  - `project_technologies`: Technologies used in the project
- **Operations** (`database.ts`):
  - OPFS (Origin Private File System) for persistence
  - Falls back to in-memory database if OPFS unavailable
  - CRUD operations for all entities
  - Foreign key constraints with CASCADE deletes

### 4. LLM Integration (`src/llm/`)

#### OpenRouter Client (`openrouter.ts`)
- Unified API for multiple LLM providers
- Features:
  - Model discovery and selection
  - Streaming response support
  - Token usage tracking
  - Cost estimation
  - Provider-specific optimizations

#### Supported Providers
- **OpenRouter**: Unified access to 100+ models (recommended)
  - `GET https://openrouter.ai/api/v1/models` for dynamic model discovery
  - Model fallback and cost optimization
  - Streaming responses with reasoning tokens
  - Provider-specific routing preferences
- **Direct Providers** (via OpenRouter or direct API):
  - OpenAI GPT-4o, GPT-4 Turbo, etc.
  - Anthropic Claude 3.5 Sonnet, Claude 3 Opus, etc.
  - Google Gemini 2.0 Flash, Gemini 1.5 Pro, etc.
  - Meta Llama, Mistral, and 100+ other models

Models are fetched dynamically from OpenRouter's `/api/v1/models` endpoint to ensure access to the latest models and pricing.

#### Context Management (`context.ts`)
- Component tree extraction via bippy
- Code snippet generation
- File content inclusion
- React props/state analysis
- Relevant documentation linking

### 5. Build System (`packages/react-llm/tsup.config.ts`)
- Multiple format outputs: ESM, CJS, IIFE for browser compatibility
- Global name: `ReactLLM`
- TypeScript declaration files (`--dts`)
- Source maps for debugging
- Custom esbuild plugins and loaders
- Watch mode with automatic rebuilds
- SQLite WASM asset copying via `onSuccess` hook

### 6. CLI Tool (`scripts/react-llm.js`)
- Commands:
  - `install`: Sets up react-llm in a project
  - `generate`: Creates codebase context using RepoMix
- Auto-detects framework (Next.js or plain React)
- Handles script tag injection
- Environment variable setup
- SQLite WASM file management

## Styling System

### Toolbar Styles (`src/components/Toolbar.styles.ts`)
- Custom font: IosevkaTerm (monospace)
- Dark theme with transparency and blur effects
- CSS animations for loading states
- Responsive design with overflow handling
- Comprehensive component styles:
  - Chat interface elements
  - Message formatting (markdown support)
  - Interactive elements (buttons, inputs)
  - Loading animations
  - Tab navigation
  - File/documentation cards

## Type System

### Core Types (`src/types.ts`)
- `Message`: Chat message with metadata
- `RelevantFile`: File references in responses
- `DocumentationLink`: External documentation
- `StructuredResponse`: Full AI response structure
- `ChatSession`: Complete chat state
- `ProjectInfo`: Project metadata

## Database Schema

```sql
-- Main tables with relationships:
chat_sessions (id, title, created_at, project_name, project_type, project_description, is_active)
├── messages (id, chat_session_id, role, content, timestamp)
│   ├── relevant_files (id, message_id, path, reason, file_type, snippet)
│   ├── documentation_links (id, message_id, url, title, description)
│   └── suggested_queries (id, message_id, query)
└── project_technologies (chat_session_id, technology)
```

## Security Considerations

1. **API Key Management**:
   - Secure browser storage with encryption
   - Support for multiple provider keys
   - Environment variable fallbacks
   - Key rotation and validation

2. **Production vs Development**:
   - **Development Mode**:
     - Full file system access via File System Access API
     - Live code editing capabilities
     - Hot module replacement integration
     - Source map access
   - **Production Mode**:
     - Read-only component exploration
     - No file system writes
     - Sandboxed execution
     - Limited to public component APIs

3. **Privacy & Isolation**:
   - Shadow DOM prevents style/script leaks
   - OPFS provides origin-isolated storage
   - No external analytics or tracking
   - All chat data stays local
   - Optional export/import of conversations

## Performance Optimizations

1. **Caching Strategy**:
   - Initial analysis cached in localStorage
   - 15-minute cache for repeated queries
   - Prevents redundant API calls

2. **Database Efficiency**:
   - Indexed columns for fast queries
   - Batch inserts for related data
   - Lazy loading of chat messages

3. **Build Optimizations**:
   - Tree shaking with ESBuild
   - Minification in production
   - IIFE format for smaller bundle

## Development Workflow

### Setup
1. Install dependencies: `pnpm install`
2. Start dev server: `pnpm dev`
3. Build for production: `pnpm build`

### Code Quality
- Linting: `pnpm lint` (uses Biome)
- Formatting: `pnpm format` (uses Biome)
- TypeScript: Strict mode enabled

### Testing
- No test files found in the project
- Consider adding tests for:
  - Database operations
  - Gemini API integration
  - Component rendering
  - CLI tool functionality

## Integration Guide

### Quick Start (Any Website)
```html
<script src="https://unpkg.com/react-llm/dist/react-llm.js"></script>
<script>
  ReactLLM.init({
    providers: {
      openrouter: 'sk-or-...' // Recommended: access to all models
      // Or use individual providers:
      // openai: 'sk-...',
      // anthropic: 'sk-ant-...',
    },
    mode: 'production' // or 'development' for file editing
  });
</script>
```

### Development Server Integration
```js
// vite.config.js or webpack.config.js
import { reactLLMPlugin } from 'react-llm/plugin';

export default {
  plugins: [
    reactLLMPlugin({
      enableHotReload: true,
      fileAccess: true,
      sourceMaps: true
    })
  ]
};
```

### NPM Installation
```bash
npm install react-llm
# or
pnpm add react-llm
```

### React Component
```tsx
import { ReactLLMProvider } from 'react-llm';

function App() {
  return (
    <ReactLLMProvider
      config={{
        providers: { /* your API keys */ },
        theme: 'dark',
        position: 'bottom-right'
      }}
    >
      {/* Your app */}
    </ReactLLMProvider>
  );
}
```

## Core Technologies

### React Scan / Component Instrumentation
- Inspired by `react-scan` for performance-focused component analysis
- Browser-native React fiber traversal for component inspection
- Key capabilities:
  - Visual component highlighting and selection
  - Props, state, and hooks inspection
  - Parent/child relationship mapping
  - Performance metrics and render analysis
  - Production-safe component detection

### OpenRouter - Unified LLM API
- Single API for multiple LLM providers
- Benefits:
  - Automatic failover between models
  - Cost optimization
  - Consistent interface
  - Model comparison

### Browser File System APIs (2025)
- **OPFS (Origin Private File System)**:
  - High-performance storage
  - Worker-accessible
  - Persistent across sessions
- **File System Access API**:
  - Direct local file editing
  - User-granted permissions
  - Save without downloads

## Use Cases

### Development Mode
1. **Live Code Editing**:
   - Chat with AI to modify components
   - See changes instantly via HMR
   - Generate new components/features
   - Refactor existing code

2. **Component Exploration**:
   - Visual selection of components
   - Understand component structure
   - View props, state, and context
   - Navigate component tree

3. **AI-Assisted Development**:
   - Get implementation suggestions
   - Debug component issues
   - Generate test cases
   - Documentation lookup

### Production Mode
1. **Component Discovery**:
   - Explore any website's components
   - Save interesting patterns
   - Build component libraries
   - Learn from existing implementations

2. **Idea Generation**:
   - Prototype new features
   - Get design suggestions
   - Explore alternatives
   - Share discoveries

## File Sizes & Metrics

- Total source files: 18
- TypeScript/TSX files: 11
- JavaScript files: 2
- Total lines of code: ~2,500
- Largest file: Toolbar.tsx (481 lines)
- Bundle output: IIFE format with source maps

## Component Library Management

### Saving Components
- Visual selection and extraction
- Automatic prop type inference
- Usage examples generation
- Cross-site component collection

### Organization
- Tag-based categorization
- Search and filter capabilities
- Export as React/Vue/Svelte
- Share collections with team

## Workflow Examples

### Development Workflow
```typescript
// 1. Start your dev server with react-llm
npm run dev

// 2. Open browser, react-llm auto-initializes
// 3. Click on a component visually
// 4. Chat: "Make this button primary styled with hover effect"
// 5. AI generates code changes
// 6. Accept changes -> HMR updates instantly
```

### Production Exploration
```typescript
// 1. Visit any website
// 2. Activate react-llm via extension or bookmarklet
// 3. Explore component tree
// 4. Save interesting patterns
// 5. Chat: "How would I build something similar?"
```

## Technical Architecture

### Component Detection Flow
1. **bippy** traverses React fiber tree
2. **Canvas overlay** renders component boundaries
3. **Click handler** captures selected component
4. **Context builder** extracts:
   - Component source code
   - Props and state
   - Parent/child relationships
   - CSS styles
   - Event handlers

### Code Modification Pipeline
1. **AI generates** code changes
2. **Diff engine** compares changes
3. **File System Access API** writes files
4. **Dev server** detects changes
5. **HMR** updates browser instantly

### Multi-Model Architecture
```typescript
// Provider abstraction
interface LLMProvider {
  chat(messages: Message[]): AsyncGenerator<string>;
  complete(prompt: string): Promise<string>;
  embed(text: string): Promise<number[]>;
}

// OpenRouter handles provider selection
const LLM = new OpenRouterClient({
  providers: ['anthropic', 'openai', 'google'],
  model: 'claude-3-opus',
  fallbackModel: 'gpt-4-turbo'
});
```

## Performance Optimizations

### Rendering Performance
- Canvas rendering in Web Worker
- Debounced component highlighting
- Virtual scrolling for component lists
- Lazy loading of component details

### LLM Optimization
- Response streaming for faster feedback
- Context window management
- Smart caching of similar queries
- Parallel requests to multiple models

### Storage Optimization
- OPFS for high-performance file access
- IndexedDB for component library
- LRU cache for recent components
- Compressed storage for code snippets

## Browser Compatibility (2025)

### Required APIs
- Web Workers (for rendering)
- Shadow DOM (for isolation)
- WASM (for SQLite)
- OPFS (for storage)
- File System Access (for editing)

### Supported Browsers
- Chrome/Edge 120+
- Firefox 125+
- Safari 18+
- Arc, Brave, Opera (latest)

## Debugging & Development

### Debug Mode
```javascript
// Enable comprehensive logging
ReactLLM.debug = {
  logLevel: 'verbose',
  logLLMRequests: true,
  logComponentTree: true,
  logFileOperations: true,
  showPerformanceMetrics: true
};
```

### Development Tools
- Component tree visualizer
- LLM request inspector
- Performance profiler
- File operation logger
- Context size analyzer