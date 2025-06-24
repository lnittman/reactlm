# React LLM

> Browser-native AI coding assistant for React developers

![Status](https://img.shields.io/badge/status-alpha-orange.svg)
![Framework](https://img.shields.io/badge/framework-preact-673ab8.svg)
![AI Models](https://img.shields.io/badge/models-100+-brightgreen.svg)
![Bundle Size](https://img.shields.io/badge/bundle-~150KB-blue.svg)

React LLM brings the power of AI coding assistants directly to your browser. Chat with your React components, get instant code suggestions, and make live edits—all without leaving your development environment.

**🚀 Current Status: Alpha Release** - Core functionality complete, preparing for beta launch.

## Features

### ✅ Implemented
- 🎯 **Zero Configuration** - Single script tag initialization
- 💬 **Component-Aware Chat** - AI understands your component context via bippy
- 🤖 **Multi-Model Support** - 100+ models via OpenRouter (Claude, GPT-4, Gemini, etc.)
- 🎨 **Visual Component Selection** - Canvas-based highlighting with click selection
- 📱 **Complete Isolation** - Shadow DOM prevents all style/script conflicts
- 🔍 **Production-Safe** - Read-only component exploration
- 🎙️ **@ Mention Context** - Include console logs, network requests, performance metrics
- 📊 **Monitoring System** - Console, Network, DOM, and Performance tracking
- 💾 **Chat Persistence** - LocalStorage-based history (SQLite planned)

### 🚧 In Development
- ✏️ **Live Code Editing** - File System Access API integration
- 📚 **Component Library** - Save and reuse patterns
- 🔌 **Framework Plugins** - Next.js and Vite plugins
- 🌐 **Browser Extension** - Enhanced DevTools integration

## Quick Start

### 1. Demo Mode (No API Key Required)

```html
<script src="https://unpkg.com/react-llm/dist/react-llm.global.js"></script>
<script>
  ReactLLM.init({ mode: 'demo' });
</script>
```

### 2. With API Key (Full Features)

```html
<script src="https://unpkg.com/react-llm/dist/react-llm.global.js"></script>
<script>
  ReactLLM.init({
    providers: {
      openrouter: 'sk-or-...' // Get your key at openrouter.ai/keys
    }
  });
</script>
```

### 3. Server-Side Proxy (Hide API Keys)

```html
<script src="https://unpkg.com/react-llm/dist/react-llm.global.js"></script>
<script>
  ReactLLM.init({
    apiEndpoint: '/api/chat',      // Your proxy endpoint
    modelsEndpoint: '/api/models'  // Optional: for model list
  });
</script>
```

### NPM Installation

```bash
npm install react-llm
```

```javascript
import ReactLLM from 'react-llm';

// Option 1: Direct initialization
ReactLLM.init({
  providers: {
    openrouter: process.env.OPENROUTER_API_KEY
  }
});

// Option 2: Auto-init with global config
window.__REACT_LLM_CONFIG__ = {
  providers: {
    openrouter: process.env.OPENROUTER_API_KEY
  }
};
```

### Framework Integration (Coming Soon)

```javascript
// Currently, use the script tag method or import directly
// Framework plugins are in development
```

## Configuration

```javascript
ReactLLM.init({
  // API Configuration (choose one)
  providers: {
    openrouter: 'sk-or-...'      // Recommended: Access to 100+ models
  },
  // OR
  apiEndpoint: '/api/chat',      // Server-side proxy
  // OR
  mode: 'demo',                  // Demo mode (no API key)
  
  // UI Options
  position: 'bottom-right',      // Widget position (default)
  theme: 'dark',                 // Currently dark only
  debug: true,                   // Enable debug logging
  
  // Development Options
  mode: 'development',           // Enable monitoring (console, network, etc.)
  
  // Site Information (for OpenRouter)
  siteUrl: 'https://myapp.com',
  siteName: 'My React App'
});
```

## Usage

### Basic Chat

The AI automatically understands:
- ✅ React component tree via bippy instrumentation
- ✅ Component props, state, and hooks
- ✅ Parent/child relationships
- ✅ DOM element associations
- ✅ Available context via @ mentions

### Visual Component Selection

1. Click the component selection button (crosshair icon)
2. Hover over any component to see it highlighted
3. Click to select and add to context
4. Press Escape to cancel selection

### Context-Aware Mentions

Type `@` in the chat to access:
- `@console` - Recent console logs
- `@errors` - Console errors only  
- `@network` - Network requests
- `@failed-requests` - Failed API calls
- `@performance` - Performance metrics
- `@dom-changes` - Recent DOM mutations
- `@components` - Selected React components

### Example Interactions

```
You: @components explain how this component works
AI: Looking at the Header component you selected...

You: @errors what's causing these errors?
AI: I see 3 errors in the console. The main issue is...

You: @network why is this API call failing?
AI: The /api/users endpoint is returning 404...
```

## API Reference

### Core API

```javascript
// Initialize React LLM
ReactLLM.init(config: ReactLLMConfig)

// Access internal systems (for debugging)
ReactLLM.hub         // LLM Hub instance
ReactLLM.inspector   // Component Inspector
ReactLLM.monitorManager // Monitoring System
ReactLLM.debug       // Enable debug mode
```

### TypeScript Types

```typescript
interface ReactLLMConfig {
  providers?: {
    openrouter?: string;
    openai?: string;
    anthropic?: string;
    google?: string;
  };
  apiEndpoint?: string;
  modelsEndpoint?: string;
  mode?: 'development' | 'production' | 'demo';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  theme?: 'dark' | 'light';
  siteUrl?: string;
  siteName?: string;
  debug?: boolean;
}
```

## Development

### Prerequisites
- Node.js 18+
- pnpm 8+

### Setup

```bash
# Clone the repository
git clone https://github.com/your-org/react-llm.git
cd react-llm

# Install dependencies
pnpm install

# Start development
pnpm dev

# Build packages
pnpm build

# Run tests
pnpm test

# Type check
pnpm typecheck
```

### Project Structure

```
packages/
├── react-llm/         # Core library
├── browser-extension/ # Chrome extension (planned)
├── next/             # Next.js plugin (planned)
└── vite/             # Vite plugin (planned)

apps/
├── web/              # Marketing website
└── docs/             # Documentation site
```

## Browser Support

React LLM requires modern browser features:
- Chrome/Edge 90+ ✅
- Firefox 90+ ✅
- Safari 15+ ✅
- Arc Browser ✅

Required APIs:
- Shadow DOM
- MutationObserver
- Fetch API
- LocalStorage
- ES2020 features

## Architecture Highlights

- **Shadow DOM Isolation**: Zero style conflicts guaranteed
- **Preact + Signals**: Ultra-fast UI with 3KB runtime
- **Bippy Integration**: Direct React fiber tree access
- **Canvas Overlays**: Non-blocking component highlighting
- **Event Delegation**: Preserves all page interactions

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed technical documentation.

## Security & Privacy

- ✅ API keys stored in LocalStorage (browser only)
- ✅ No telemetry or analytics
- ✅ Direct provider communication (no proxy)
- ✅ All data stays local
- ✅ Production mode is read-only
- ⚠️ File editing requires explicit permission (coming soon)

## Known Limitations

- Theme support limited to dark mode
- File editing not yet implemented
- Component library feature pending
- Framework plugins in development
- Firefox may have performance issues with large component trees

## Roadmap

### Beta Release (Q1 2025)
- [ ] File System Access API for live editing
- [ ] Component library with export
- [ ] Light theme support
- [ ] Framework plugins (Next.js, Vite)
- [ ] npm package publication

### v1.0 (Q2 2025)
- [ ] Browser extension
- [ ] Collaborative features
- [ ] Advanced code generation
- [ ] Test generation
- [ ] Performance profiling

## Contributing

We welcome contributions! Key areas:
- Model provider integrations
- Framework-specific plugins  
- UI/UX improvements
- Documentation
- Test coverage

## License

MIT

## Acknowledgments

- [react-scan](https://github.com/aidenybai/react-scan) - Inspiration for React instrumentation
- [bippy](https://github.com/aidenybai/bippy) - React fiber tree traversal
- [Preact](https://preactjs.com/) - Lightweight React alternative
- [OpenRouter](https://openrouter.ai/) - Unified LLM API

---

<p align="center">
  Built with ❤️ for the React community
</p>