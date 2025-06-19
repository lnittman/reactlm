# Agent 4: Core Library Integration

## Mission
Complete the core React LLM library by implementing OpenRouter multi-model support, visual component selection, and file system integration. Transform the current Gemini-only prototype into a production-ready library with comprehensive LLM provider support.

## Current State Analysis

### ✅ What Exists
- **Package Structure**: `packages/react-llm` with proper TypeScript setup
- **Basic Components**: Toolbar, ModelSelector, ComponentSelector scaffolds
- **Database Layer**: SQLite WASM integration and schema
- **Build System**: tsup configuration with multiple format outputs
- **Legacy Gemini**: Working but single-provider implementation

### ❌ What's Missing
- **OpenRouter Integration**: Multi-provider LLM support
- **Visual Component Selection**: Canvas overlays and highlighting
- **File System APIs**: OPFS and File System Access implementations
- **Component Tree Analysis**: React fiber instrumentation
- **Testing Infrastructure**: No tests exist

## Technical Priorities

### 1. OpenRouter Multi-Model Integration

Based on Context7 documentation, implement the modern OpenRouter client:

```typescript
// packages/react-llm/src/llm/openrouter-client.ts
export class OpenRouterClient {
  private apiKey: string;
  private baseUrl = 'https://openrouter.ai/api/v1';
  
  async getAvailableModels(): Promise<Model[]> {
    // GET https://openrouter.ai/api/v1/models
    // Return dynamic model list with pricing and capabilities
  }
  
  async *streamChat(
    messages: Message[],
    options: ChatOptions
  ): AsyncGenerator<string> {
    // Streaming chat completions with reasoning token support
    // Handle model fallback and cost optimization
  }
}
```

**Key Features to Implement**:
- Dynamic model discovery from `/api/v1/models`
- Model fallback and routing preferences
- Streaming responses with reasoning tokens
- Cost estimation and usage tracking
- Provider-specific optimizations

### 2. Visual Component Selection System

Implement react-scan inspired component detection:

```typescript
// packages/react-llm/src/instrumentation/component-inspector.ts
export class ComponentInspector {
  private fiberMap = new WeakMap<HTMLElement, Fiber>();
  
  getComponentAtPoint(x: number, y: number): ComponentInfo | null {
    // Walk up DOM tree to find React component
    // Extract props, state, hooks, and relationships
  }
  
  highlightComponent(component: ComponentInfo): void {
    // Canvas-based overlay rendering
    // Show component boundaries and metadata
  }
}
```

**Implementation Steps**:
1. **Fiber Tree Traversal**: Direct React fiber access without external deps
2. **Canvas Overlay System**: WebGL/Canvas2D component highlighting  
3. **Component Context Extraction**: Props, state, hooks, and source location
4. **Performance Optimization**: Debounced rendering and efficient hit detection

### 3. File System Integration

Complete the OPFS and File System Access implementations:

```typescript
// packages/react-llm/src/filesystem/file-system-manager.ts
export class FileSystemManager {
  async requestDevAccess(): Promise<boolean> {
    // File System Access API for live code editing
    // Only in development mode
  }
  
  async saveComponentPattern(pattern: ComponentPattern): Promise<void> {
    // OPFS storage for component library
    // Cross-site pattern collection
  }
}
```

### 4. Enhanced Toolbar Integration

Update the existing Toolbar to use new systems:

```typescript
// packages/react-llm/src/components/Toolbar.tsx
export function Toolbar() {
  const [selectedModel, setSelectedModel] = useSignal<string | null>(null);
  const [selectedComponent, setSelectedComponent] = useSignal<ComponentInfo | null>(null);
  
  // Integrate OpenRouter model selection
  // Connect visual component selection
  // Enable live code editing in dev mode
}
```

## Implementation Plan

### Week 1: Foundation
- [ ] **OpenRouter Client**: Implement dynamic model fetching and chat streaming
- [ ] **Model Selector UI**: Update to show real models with pricing
- [ ] **Basic Testing**: Unit tests for core LLM functionality

### Week 2: Component Selection
- [ ] **React Fiber Access**: Implement component tree traversal
- [ ] **Canvas Overlay System**: Visual component highlighting
- [ ] **Component Inspector**: Complete ComponentInfo extraction
- [ ] **Integration Testing**: End-to-end component selection

### Week 3: File System & Polish
- [ ] **OPFS Implementation**: Component library storage
- [ ] **File System Access**: Live code editing for dev mode
- [ ] **Toolbar Integration**: Connect all systems together
- [ ] **Performance Optimization**: Smooth 60fps interactions

### Week 4: Testing & Refinement
- [ ] **Comprehensive Testing**: Coverage for all new features
- [ ] **Browser Compatibility**: Ensure APIs work across browsers
- [ ] **Documentation**: Update JSDoc and type definitions
- [ ] **Build Optimization**: Bundle size and loading performance

## Success Criteria

### Functional Requirements
1. **Multi-Model Support**: Seamless switching between 100+ OpenRouter models
2. **Visual Selection**: Click any component to inspect and chat about it
3. **Live Editing**: Code changes appear instantly in dev mode via HMR
4. **Component Library**: Save and organize patterns across sites
5. **Zero Config**: Works with a single script tag in any React app

### Performance Requirements
- Component selection latency: <100ms
- AI response start time: <500ms
- Visual overlay rendering: 60fps smooth
- Memory usage: <50MB when active
- Bundle size: <2MB gzipped

### Quality Requirements
- TypeScript strict mode compliance
- 80%+ test coverage for core functionality
- Cross-browser compatibility (Chrome 120+, Firefox 125+, Safari 18+)
- Production-safe (no dev-only APIs in production builds)

## Dependencies & Integration

### Core Dependencies (Install/Update)
```bash
# OpenRouter client capabilities
pnpm add openai  # For OpenAI SDK compatibility

# State management (already installed)
@preact/signals

# Build and development
tsup typescript
```

### API Integrations
- **OpenRouter API**: Dynamic model discovery and chat completions
- **File System Access API**: Live code editing (Chrome/Edge only)
- **OPFS**: Cross-browser component library storage
- **React DevTools Protocol**: Component tree access (fallback)

### Package Coordination
- Ensure `packages/react-llm` builds properly for all consumers
- Update `packages/next` and `packages/vite` plugins to use new APIs
- Coordinate with marketing team for live demo integration

## Risk Mitigation

### Browser Compatibility
- **OPFS Fallback**: IndexedDB for older browsers
- **File System Access**: Graceful degradation to read-only mode
- **WebGL Fallback**: Canvas2D for component highlighting

### Performance Concerns
- **Bundle Size**: Dynamic imports for heavy features
- **Memory Usage**: Efficient component tree caching
- **Rendering Performance**: Virtualized component lists

### Development Experience
- **Hot Module Replacement**: Seamless dev mode integration
- **Source Maps**: Proper debugging support
- **Error Boundaries**: Graceful failure handling