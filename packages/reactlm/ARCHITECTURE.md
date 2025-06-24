# React LLM Architecture Documentation

## System Overview

React LLM is a browser-native AI coding assistant that seamlessly integrates into any React website. It provides an intelligent chat interface with deep understanding of React components, enabling developers to explore, analyze, and modify their codebase through natural language interactions.

```
┌─────────────────────────────────────────────────────────────────┐
│                          Host Website                            │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    React Application                      │   │
│  │  ┌──────────────────────────────────────────────────┐   │   │
│  │  │                React Components                   │   │   │
│  │  └──────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   React LLM System                        │   │
│  │  ┌────────────────┐  ┌─────────────────────────────┐   │   │
│  │  │  Shadow DOM     │  │    Bippy Instrumentation    │   │   │
│  │  │  Container      │  │    (React Fiber Access)     │   │   │
│  │  │  ┌──────────┐  │  └─────────────────────────────┘   │   │
│  │  │  │ Toolbar  │  │  ┌─────────────────────────────┐   │   │
│  │  │  │ (Preact) │  │  │    Monitoring System        │   │   │
│  │  │  └──────────┘  │  │  (Console/Network/DOM/Perf) │   │   │
│  │  └────────────────┘  └─────────────────────────────┘   │   │
│  │  ┌─────────────────────────────────────────────────┐   │   │
│  │  │              LLM Hub (Multi-Provider)            │   │   │
│  │  │  OpenRouter / OpenAI / Claude / Gemini / 100+   │   │   │
│  │  └─────────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## Core Architecture Principles

### 1. Complete Isolation via Shadow DOM
- **Problem**: Prevent style and script conflicts with host applications
- **Solution**: All UI components render inside a Shadow DOM boundary
- **Implementation**: Single container with `pointer-events: none`, toolbar has `pointer-events: auto`

### 2. Non-Intrusive Integration
- **Problem**: Must not interfere with host application functionality
- **Solution**: Event delegation, careful z-index management, capture phase listeners only for selection
- **Key Innovation**: Canvas overlay for component highlighting that doesn't block interactions

### 3. Framework-Agnostic React Instrumentation
- **Problem**: Need to inspect React components on any website
- **Solution**: Bippy library for React fiber tree traversal
- **Fallback**: Graceful degradation when React isn't detected

### 4. Multi-Model AI Integration
- **Problem**: Different models excel at different tasks
- **Solution**: LLMHub abstraction supporting 100+ models via OpenRouter
- **Features**: Model switching, cost optimization, streaming responses

## Component Hierarchy

```
index.ts (Entry Point)
├── Shadow DOM Container
│   └── Toolbar.tsx (Main UI - Preact)
│       ├── Chat Interface
│       │   ├── Message List
│       │   ├── Input Area
│       │   └── Context Selector (@mentions)
│       ├── Component Inspector
│       │   ├── Canvas Overlay
│       │   └── Selection Handler
│       ├── Model Selector
│       │   └── Provider Management
│       └── Settings/Components Views
│
├── Instrumentation Layer
│   ├── bippy-adapter.ts (React Fiber Access)
│   ├── react-detector.ts (React Detection)
│   └── ComponentInspector.tsx (Visual Selection)
│
├── LLM Integration
│   ├── providers.ts (LLMHub)
│   ├── openrouter-client.ts
│   └── Context Enhancement
│
├── Monitoring System
│   ├── monitor-manager.ts
│   ├── console-monitor.ts
│   ├── network-monitor.ts
│   ├── dom-monitor.ts
│   └── performance-monitor.ts
│
└── Storage Layer
    ├── simple-storage.ts (LocalStorage)
    └── database.ts (SQLite WASM - future)
```

## Data Flow Patterns

### 1. Component Selection Flow
```
User Click → ComponentInspector → Canvas Overlay
    ↓
Bippy Instrumentation → Fiber Tree Traversal
    ↓
Component Info Extraction → Context Building
    ↓
Selected Component State → Chat Context
```

### 2. Chat Interaction Flow
```
User Input → @ Mention Detection → Context Selector
    ↓
Message + Context → LLM Hub → Provider Selection
    ↓
Streaming Response → Markdown Rendering → UI Update
    ↓
Persistence Layer → Chat History Storage
```

### 3. Monitoring Data Flow
```
Browser APIs → Monitor Implementations → Event Capture
    ↓
Data Filtering → Signal Updates → UI Reactivity
    ↓
Context Queries → Formatted Output → LLM Context
```

## Key Design Decisions

### 1. Preact over React
- **Rationale**: Smaller bundle size (3KB vs 45KB)
- **Benefits**: Faster load times, reduced memory footprint
- **Trade-offs**: Limited ecosystem, manual optimizations

### 2. Preact Signals for State Management
- **Rationale**: Fine-grained reactivity without re-renders
- **Benefits**: Better performance, simpler state updates
- **Implementation**: Signals for chat state, monitoring data

### 3. Shadow DOM Architecture
```javascript
// Critical isolation pattern
const container = document.createElement('div');
container.style.cssText = `
  position: fixed;
  pointer-events: none; // Pass through all events
  z-index: 2147483645;  // Below browser DevTools
`;

const shadow = container.attachShadow({ mode: 'open' });
// All UI renders inside shadow
```

### 4. Event Handling Strategy
- **Mouse Events**: Passive listeners, no blocking
- **Click Interception**: Capture phase only during selection
- **Keyboard**: Shadow DOM scoped, no global shortcuts
- **Key Innovation**: Component selection doesn't block page interactions

### 5. Bippy Integration
```javascript
// Safe instrumentation with error boundaries
const handlers = secure({
  onCommitFiberRoot: (rendererID, root) => {
    try {
      this.processFiberRoot(root);
    } catch (error) {
      // Graceful failure
    }
  },
});
instrument(handlers);
```

## Integration Points

### 1. React Detection and Instrumentation
- Automatic React detection via multiple methods
- Graceful fallback for non-React sites
- Support for React 16+ via fiber architecture

### 2. LLM Provider Integration
- **OpenRouter**: Unified API for 100+ models
- **Direct Providers**: OpenAI, Anthropic, Google
- **Demo Mode**: No API key required
- **API Proxy Mode**: Server-side key management

### 3. Browser API Integration
- Console API interception
- Fetch/XHR monitoring
- MutationObserver for DOM changes
- Performance Observer API
- Chrome DevTools Protocol (optional)

## How We Solved the Interactivity Problem

The biggest challenge was creating an overlay system that could:
1. Visually highlight components
2. Capture selection clicks
3. Not interfere with normal page interaction

### Solution Architecture:

```javascript
// 1. Container with no pointer events
container.style.pointerEvents = 'none';

// 2. Toolbar explicitly enables pointer events
.toolbar {
  pointer-events: auto;
}

// 3. Canvas overlay for highlighting (no pointer events)
canvas.style.pointerEvents = 'none';

// 4. Click capture only during selection mode
document.addEventListener('click', handleClick, true); // Capture phase

// 5. Immediate cleanup after selection
const handleClick = (e) => {
  const component = getComponentAtPoint(e.clientX, e.clientY);
  if (component) {
    e.preventDefault(); // Only prevent this click
    e.stopPropagation();
    onSelect(component);
    cleanup(); // Remove listener immediately
  }
};
```

This ensures:
- Normal browsing is never affected
- Clicks work everywhere except during active selection
- Visual feedback without interaction blocking
- Clean event handling with minimal overhead

## Performance Optimizations

### 1. Lazy Loading
- Components load on-demand
- Monitoring starts only in dev mode
- Models fetch only when needed

### 2. Efficient Rendering
- Preact's small VDOM
- Signals for targeted updates
- Canvas rendering in RAF
- Debounced hover detection

### 3. Memory Management
- WeakMap for DOM→Fiber mapping
- Structured clone for monitoring data
- Automatic cleanup on unmount
- Limited history retention

## Security Considerations

### 1. API Key Management
- LocalStorage with encryption
- Never exposed to host page
- Environment variable support
- Proxy mode for production

### 2. Isolation Boundaries
- Shadow DOM style isolation
- No global variable pollution
- Sandboxed script execution
- CSP-compliant implementation

### 3. Data Privacy
- No telemetry or analytics
- Local-only storage
- Direct LLM communication
- No proxy servers (optional)

## Build System

### 1. TSUP Configuration
- Multiple output formats (ESM, CJS, IIFE)
- Separate builds for different targets
- Source map generation
- Tree shaking enabled

### 2. Bundle Optimization
- Preact aliasing
- Dead code elimination
- Minification in production
- Dynamic imports for heavy deps

## Testing Strategy

### 1. Unit Tests
- Component behavior
- Monitor functionality
- LLM client operations
- Storage operations

### 2. Integration Tests
- Component selection flow
- Chat interactions
- Theme switching
- Multi-model support

### 3. E2E Tests
- Full user workflows
- Cross-browser testing
- Performance benchmarks
- Memory leak detection

## Future Architecture Considerations

### 1. Web Worker Integration
- Offload heavy computations
- Background monitoring
- Parallel processing

### 2. WASM Components
- SQLite for better persistence
- Advanced code analysis
- Performance-critical ops

### 3. Extension Architecture
- Deeper browser integration
- Enhanced DevTools
- Cross-tab communication

### 4. Collaborative Features
- WebRTC for pair programming
- Shared chat sessions
- Team knowledge base

## Deployment Architecture

### 1. CDN Distribution
```
unpkg.com/react-llm/
├── dist/
│   ├── react-llm.global.js      # IIFE bundle
│   ├── react-llm.global.js.map  # Source maps
│   ├── index.js                 # ESM
│   └── index.cjs                # CommonJS
```

### 2. NPM Package Structure
```
react-llm/
├── dist/          # Compiled outputs
├── src/           # Source files
├── package.json   # Main entry points
└── README.md      # Documentation
```

### 3. Framework Plugins
- Next.js: Webpack integration
- Vite: Rollup plugin
- CRA: Public HTML injection
- Custom: Direct script tag

## Conclusion

React LLM's architecture prioritizes:
1. **Zero interference** with host applications
2. **Universal compatibility** across React apps
3. **Performance** through careful optimization
4. **Extensibility** via plugin architecture
5. **Developer experience** with instant integration

The combination of Shadow DOM isolation, Preact's efficiency, and intelligent event handling creates a powerful yet unobtrusive development tool that enhances rather than disrupts the development workflow.