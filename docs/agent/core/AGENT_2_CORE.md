# Agent 2: Core Library Development

## Mission
Transform React LLM into a browser-native AI coding assistant that enables developers to chat with components, make live code changes, and explore any website's architecture. Focus on multi-model LLM support via OpenRouter, visual component selection with bippy, and seamless file system integration.

## Core Architecture

### Key Technologies
- **LLM Integration**: OpenRouter for unified multi-model API
- **React Instrumentation**: `bippy` for component tree access
- **Visual Rendering**: Canvas overlays with Web Workers
- **File System**: OPFS + File System Access API
- **State Management**: Preact Signals
- **Build Tool**: tsup with worker inlining

## Implementation Roadmap

### Phase 1: OpenRouter Integration

#### 1.1 OpenRouter Client
```typescript
// src/llm/openrouter.ts
import { EventEmitter } from 'events';

export interface OpenRouterConfig {
  apiKey: string;
  siteUrl?: string;
  siteName?: string;
}

export interface Model {
  id: string;
  name: string;
  provider: string;
  contextLength: number;
  pricing: {
    prompt: number;
    completion: number;
  };
}

export class OpenRouterClient extends EventEmitter {
  private apiKey: string;
  private baseUrl = 'https://openrouter.ai/api/v1';
  private models: Model[] = [];
  
  constructor(config: OpenRouterConfig) {
    super();
    this.apiKey = config.apiKey;
    this.fetchModels();
  }
  
  async fetchModels(): Promise<Model[]> {
    const response = await fetch(`${this.baseUrl}/models`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
      }
    });
    
    const data = await response.json();
    this.models = data.data.map(this.parseModel);
    
    // Cache models with timestamp
    localStorage.setItem('openrouter_models', JSON.stringify({
      models: this.models,
      timestamp: Date.now()
    }));
    
    return this.models;
  }
  
  async getLatestModels(): Promise<Model[]> {
    // Check cache first (refresh every hour)
    const cached = localStorage.getItem('openrouter_models');
    if (cached) {
      const { models, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < 3600000) { // 1 hour
        return models;
      }
    }
    
    // Fetch fresh model list
    return this.fetchModels();
  }
  
  async *chat(
    messages: Message[], 
    options: ChatOptions = {}
  ): AsyncGenerator<string> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': options.siteUrl || window.location.href,
        'X-Title': options.siteName || document.title,
      },
      body: JSON.stringify({
        model: options.model, // Model must be explicitly provided
        messages,
        stream: true,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 4096,
      }),
    });
    
    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter(line => line.trim());
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') continue;
          
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices[0]?.delta?.content;
            if (content) yield content;
          } catch (e) {
            console.error('Parse error:', e);
          }
        }
      }
    }
  }
  
  estimateCost(messages: Message[], model: string): CostEstimate {
    const modelInfo = this.models.find(m => m.id === model);
    if (!modelInfo) throw new Error(`Model ${model} not found`);
    
    const tokens = this.countTokens(messages);
    return {
      promptTokens: tokens.prompt,
      completionTokens: tokens.completion,
      totalCost: (
        tokens.prompt * modelInfo.pricing.prompt +
        tokens.completion * modelInfo.pricing.completion
      ) / 1_000_000 // Convert to dollars
    };
  }
}
```

#### 1.2 LLM Provider Management
```typescript
// src/llm/providers.ts
export interface LLMProvider {
  id: string;
  name: string;
  models: string[];
  supportsStreaming: boolean;
  requiresApiKey: boolean;
}

export class LLMHub {
  private providers = new Map<string, LLMProvider>();
  private clients = new Map<string, any>();
  private activeProvider = 'openrouter';
  private activeModel: string | null = null;
  
  constructor() {
    this.registerProviders();
  }
  
  private async registerProviders() {
    // OpenRouter provides access to all models
    const openrouterClient = this.clients.get('openrouter');
    let models = [];
    
    if (openrouterClient) {
      // Fetch latest models from OpenRouter
      models = await openrouterClient.getLatestModels();
    }
    
    this.providers.set('openrouter', {
      id: 'openrouter',
      name: 'OpenRouter (All Providers)',
      models: models.map(m => m.id),
      supportsStreaming: true,
      requiresApiKey: true,
    });
    
    // Group models by provider for easy filtering
    this.modelsByProvider = models.reduce((acc, model) => {
      const provider = model.id.split('/')[0];
      if (!acc[provider]) acc[provider] = [];
      acc[provider].push(model);
      return acc;
    }, {});
  }
  
  getModelsByProvider(provider: string): Model[] {
    return this.modelsByProvider[provider] || [];
  }
  
  getRecommendedModels(): Model[] {
    // Get top models from each provider based on actual API data
    const recommendations: Model[] = [];
    
    // Get best model from each major provider
    const providers = ['anthropic', 'openai', 'google', 'meta-llama'];
    
    providers.forEach(provider => {
      const providerModels = this.modelsByProvider[provider] || [];
      if (providerModels.length > 0) {
        // Sort by context length and capabilities
        const sorted = providerModels.sort((a, b) => {
          // Prioritize by context window size and recency
          return b.contextLength - a.contextLength;
        });
        recommendations.push(sorted[0]);
      }
    });
    
    return recommendations;
  }
  
  setApiKey(provider: string, apiKey: string) {
    if (provider === 'openrouter') {
      this.clients.set(provider, new OpenRouterClient({ apiKey }));
    }
    // Add other provider clients as needed
  }
  
  async *chat(
    messages: Message[], 
    context?: ComponentContext
  ): AsyncGenerator<string> {
    const client = this.clients.get(this.activeProvider);
    if (!client) throw new Error('No API key set for provider');
    
    // Enhance messages with component context
    const enhancedMessages = this.enhanceWithContext(messages, context);
    
    // Use active model or let the user choose
    if (!this.activeModel) {
      throw new Error('No model selected. Please choose a model first.');
    }
    
    yield* client.chat(enhancedMessages, {
      model: this.activeModel,
    });
  }
  
  private enhanceWithContext(
    messages: Message[], 
    context?: ComponentContext
  ): Message[] {
    if (!context) return messages;
    
    const systemMessage: Message = {
      role: 'system',
      content: `You are helping with a React component. Here's the context:
        
Component: ${context.name}
Props: ${JSON.stringify(context.props, null, 2)}
State: ${JSON.stringify(context.state, null, 2)}
Parent: ${context.parent?.name || 'None'}
Children: ${context.children.map(c => c.name).join(', ')}

Source code:
\`\`\`${context.language}
${context.sourceCode}
\`\`\`
      `
    };
    
    return [systemMessage, ...messages];
  }
}
```

### Phase 2: Component Selection System

#### 2.1 bippy Integration
```typescript
// src/instrumentation/bippy-adapter.ts
import { 
  instrument,
  getDisplayName,
  getNearestHostFibers,
  traverseProps,
  type Fiber 
} from 'bippy';

export interface ComponentInfo {
  id: string;
  name: string;
  props: any;
  state: any;
  hooks: any[];
  parent?: ComponentInfo;
  children: ComponentInfo[];
  domElement?: HTMLElement;
  sourceLocation?: SourceLocation;
}

export class ComponentInspector {
  private fiberMap = new WeakMap<HTMLElement, Fiber>();
  private componentMap = new Map<string, ComponentInfo>();
  private selectionCallback?: (component: ComponentInfo) => void;
  
  constructor() {
    this.setupInstrumentation();
  }
  
  private setupInstrumentation() {
    instrument({}, {
      onCommitStart: (fiber: Fiber) => {
        this.processFiber(fiber);
      },
    });
  }
  
  private processFiber(fiber: Fiber) {
    const hostFibers = getNearestHostFibers(fiber);
    const info = this.extractComponentInfo(fiber);
    
    // Map DOM elements to fibers
    hostFibers.forEach(hostFiber => {
      const element = hostFiber.stateNode as HTMLElement;
      if (element) {
        this.fiberMap.set(element, fiber);
        element.dataset.reactLlmId = info.id;
      }
    });
    
    this.componentMap.set(info.id, info);
  }
  
  private extractComponentInfo(fiber: Fiber): ComponentInfo {
    const id = this.getFiberId(fiber);
    
    return {
      id,
      name: getDisplayName(fiber) || 'Unknown',
      props: fiber.memoizedProps,
      state: fiber.memoizedState,
      hooks: this.extractHooks(fiber),
      parent: fiber.return ? this.extractComponentInfo(fiber.return) : undefined,
      children: this.getChildComponents(fiber),
      domElement: this.getDOMElement(fiber),
      sourceLocation: this.getSourceLocation(fiber),
    };
  }
  
  getComponentAtPoint(x: number, y: number): ComponentInfo | null {
    const element = document.elementFromPoint(x, y) as HTMLElement;
    if (!element) return null;
    
    // Walk up DOM tree to find React component
    let current: HTMLElement | null = element;
    while (current) {
      const fiber = this.fiberMap.get(current);
      if (fiber) {
        const id = this.getFiberId(fiber);
        return this.componentMap.get(id) || null;
      }
      current = current.parentElement;
    }
    
    return null;
  }
  
  selectComponent(component: ComponentInfo) {
    if (this.selectionCallback) {
      this.selectionCallback(component);
    }
  }
  
  onSelection(callback: (component: ComponentInfo) => void) {
    this.selectionCallback = callback;
  }
}
```

#### 2.2 Visual Selection UI
```typescript
// src/components/ComponentSelector.tsx
import { h } from 'preact';
import { useSignal, effect } from '@preact/signals';
import { ComponentInspector } from '../instrumentation/bippy-adapter';

interface Props {
  inspector: ComponentInspector;
  onSelect: (component: ComponentInfo) => void;
}

export function ComponentSelector({ inspector, onSelect }: Props) {
  const isSelecting = useSignal(false);
  const hoveredComponent = useSignal<ComponentInfo | null>(null);
  const selectedComponent = useSignal<ComponentInfo | null>(null);
  
  effect(() => {
    if (!isSelecting.value) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const component = inspector.getComponentAtPoint(e.clientX, e.clientY);
      hoveredComponent.value = component;
    };
    
    const handleClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      const component = inspector.getComponentAtPoint(e.clientX, e.clientY);
      if (component) {
        selectedComponent.value = component;
        onSelect(component);
        isSelecting.value = false;
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick, true);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick, true);
    };
  });
  
  return (
    <>
      <button
        onClick={() => isSelecting.value = !isSelecting.value}
        className={`selector-toggle ${isSelecting.value ? 'active' : ''}`}
      >
        {isSelecting.value ? '🎯 Selecting...' : '🎯 Select Component'}
      </button>
      
      {selectedComponent.value && (
        <div className="selected-component">
          <h4>{selectedComponent.value.name}</h4>
          <details>
            <summary>Props</summary>
            <pre>{JSON.stringify(selectedComponent.value.props, null, 2)}</pre>
          </details>
        </div>
      )}
      
      {isSelecting.value && (
        <ComponentOverlay component={hoveredComponent.value} />
      )}
    </>
  );
}
```

### Phase 3: File System Integration

#### 3.1 OPFS Manager
```typescript
// src/filesystem/opfs-manager.ts
export class OPFSManager {
  private root: FileSystemDirectoryHandle | null = null;
  
  async initialize(): Promise<boolean> {
    try {
      this.root = await navigator.storage.getDirectory();
      return true;
    } catch (error) {
      console.error('OPFS not available:', error);
      return false;
    }
  }
  
  async saveComponentLibrary(
    componentId: string, 
    data: ComponentLibraryEntry
  ): Promise<void> {
    if (!this.root) throw new Error('OPFS not initialized');
    
    const dir = await this.root.getDirectoryHandle('component-library', { create: true });
    const file = await dir.getFileHandle(`${componentId}.json`, { create: true });
    const writable = await file.createWritable();
    
    await writable.write(JSON.stringify(data, null, 2));
    await writable.close();
  }
  
  async loadComponentLibrary(): Promise<ComponentLibraryEntry[]> {
    if (!this.root) throw new Error('OPFS not initialized');
    
    try {
      const dir = await this.root.getDirectoryHandle('component-library');
      const entries: ComponentLibraryEntry[] = [];
      
      for await (const entry of dir.values()) {
        if (entry.kind === 'file' && entry.name.endsWith('.json')) {
          const file = await entry.getFile();
          const text = await file.text();
          entries.push(JSON.parse(text));
        }
      }
      
      return entries;
    } catch {
      return [];
    }
  }
}
```

#### 3.2 File System Access for Code Editing
```typescript
// src/filesystem/file-access.ts
export class FileSystemAccess {
  private handles = new Map<string, FileSystemFileHandle>();
  
  async requestAccess(): Promise<boolean> {
    try {
      // Request directory access
      const dirHandle = await window.showDirectoryPicker({
        mode: 'readwrite'
      });
      
      // Store root handle
      await this.indexDirectory(dirHandle);
      return true;
    } catch (error) {
      console.error('File access denied:', error);
      return false;
    }
  }
  
  private async indexDirectory(
    dirHandle: FileSystemDirectoryHandle,
    path = ''
  ): Promise<void> {
    for await (const entry of dirHandle.values()) {
      const entryPath = path ? `${path}/${entry.name}` : entry.name;
      
      if (entry.kind === 'file') {
        this.handles.set(entryPath, entry);
      } else if (entry.kind === 'directory') {
        await this.indexDirectory(entry, entryPath);
      }
    }
  }
  
  async readFile(path: string): Promise<string> {
    const handle = this.handles.get(path);
    if (!handle) throw new Error(`File not found: ${path}`);
    
    const file = await handle.getFile();
    return await file.text();
  }
  
  async writeFile(path: string, content: string): Promise<void> {
    const handle = this.handles.get(path);
    if (!handle) throw new Error(`File not found: ${path}`);
    
    const writable = await handle.createWritable();
    await writable.write(content);
    await writable.close();
    
    // Trigger HMR if available
    if (window.__vite_plugin_react_preamble_installed__) {
      window.__vite__.hot.send('file-update', { path });
    }
  }
  
  async createFile(path: string, content: string): Promise<void> {
    // Parse directory and filename
    const parts = path.split('/');
    const filename = parts.pop()!;
    
    // Navigate to directory
    let dirHandle = await window.showDirectoryPicker();
    for (const part of parts) {
      dirHandle = await dirHandle.getDirectoryHandle(part, { create: true });
    }
    
    // Create file
    const fileHandle = await dirHandle.getFileHandle(filename, { create: true });
    const writable = await fileHandle.createWritable();
    await writable.write(content);
    await writable.close();
    
    // Update index
    this.handles.set(path, fileHandle);
  }
}
```

### Phase 4: Enhanced UI Components

#### 4.1 Model Selector
```typescript
// src/components/ModelSelector.tsx
import { h } from 'preact';
import { useSignal, computed } from '@preact/signals';

interface Props {
  hub: LLMHub;
  onModelChange: (provider: string, model: string) => void;
}

export function ModelSelector({ hub, onModelChange }: Props) {
  const providers = useSignal(hub.getProviders());
  const selectedProvider = useSignal('openrouter');
  const selectedModel = useSignal<string | null>(null);
  const modelList = useSignal<Model[]>([]);
  const searchQuery = useSignal('');
  
  // Fetch latest models on mount
  effect(async () => {
    if (selectedProvider.value === 'openrouter') {
      const client = hub.getClient('openrouter');
      if (client) {
        modelList.value = await client.getLatestModels();
      }
    }
  });
  
  const filteredModels = computed(() => {
    const query = searchQuery.value.toLowerCase();
    return modelList.value.filter(model => 
      model.id.toLowerCase().includes(query) ||
      model.name.toLowerCase().includes(query)
    );
  });
  
  const recommendedModels = computed(() => {
    // Get recommended models from actual API data
    return hub.getRecommendedModels();
  });
  
  return (
    <div className="model-selector">
      <select
        value={selectedProvider.value}
        onChange={(e) => {
          selectedProvider.value = e.target.value;
          selectedModel.value = models.value[0] || '';
          onModelChange(selectedProvider.value, selectedModel.value);
        }}
      >
        {providers.value.map(provider => (
          <option key={provider.id} value={provider.id}>
            {provider.name}
          </option>
        ))}
      </select>
      
      <div className="model-search">
        <input
          type="text"
          placeholder="Search models..."
          value={searchQuery.value}
          onChange={(e) => searchQuery.value = e.target.value}
          className="model-search-input"
        />
      </div>
      
      <div className="model-list">
        {searchQuery.value === '' && (
          <div className="model-group">
            <h4>Recommended</h4>
            {recommendedModels.value.map(model => (
              
                <button
                  key={model.id}
                  className={`model-option ${selectedModel.value === model.id ? 'selected' : ''}`}
                  onClick={() => {
                    selectedModel.value = model.id;
                    onModelChange(selectedProvider.value, model.id);
                  }}
                >
                  <span className="model-name">{model.name}</span>
                  <span className="model-context">{model.contextLength.toLocaleString()} tokens</span>
                  <span className="model-price">
                    ${(model.pricing.prompt * 1000).toFixed(2)}/1K tokens
                  </span>
                </button>
              );
            })}
          </div>
        )}
        
        <div className="model-group">
          <h4>{searchQuery.value ? 'Search Results' : 'All Models'}</h4>
          {filteredModels.value.map(model => (
            <button
              key={model.id}
              className={`model-option ${selectedModel.value === model.id ? 'selected' : ''}`}
              onClick={() => {
                selectedModel.value = model.id;
                onModelChange(selectedProvider.value, model.id);
              }}
            >
              <span className="model-name">{model.name}</span>
              <span className="model-provider">{model.id.split('/')[0]}</span>
              <span className="model-context">{model.contextLength.toLocaleString()} tokens</span>
              <span className="model-price">
                ${(model.pricing.prompt * 1000).toFixed(2)}/1K tokens
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

#### 4.2 Updated Toolbar
```typescript
// src/components/Toolbar.tsx
import { h } from 'preact';
import { useSignal, effect } from '@preact/signals';
import { ComponentSelector } from './ComponentSelector';
import { ModelSelector } from './ModelSelector';
import { CodeEditor } from './CodeEditor';

export function Toolbar() {
  const llmHub = useSignal(new LLMHub());
  const inspector = useSignal(new ComponentInspector());
  const fileAccess = useSignal(new FileSystemAccess());
  const opfs = useSignal(new OPFSManager());
  
  const selectedComponent = useSignal<ComponentInfo | null>(null);
  const messages = useSignal<Message[]>([]);
  const isDevMode = useSignal(false);
  const componentLibrary = useSignal<ComponentLibraryEntry[]>([]);
  
  // Initialize
  effect(() => {
    opfs.value.initialize();
    
    // Check if we're in dev mode
    isDevMode.value = window.location.hostname === 'localhost' || 
                     window.location.hostname === '127.0.0.1';
  });
  
  const handleSendMessage = async (content: string) => {
    messages.value = [...messages.value, {
      role: 'user',
      content
    }];
    
    const response = llmHub.value.chat(
      messages.value,
      selectedComponent.value
    );
    
    let assistantMessage = '';
    for await (const chunk of response) {
      assistantMessage += chunk;
      // Update UI with streaming response
      messages.value = [
        ...messages.value.slice(0, -1),
        { role: 'assistant', content: assistantMessage }
      ];
    }
  };
  
  const handleSaveComponent = async () => {
    if (!selectedComponent.value) return;
    
    const entry: ComponentLibraryEntry = {
      id: selectedComponent.value.id,
      name: selectedComponent.value.name,
      props: selectedComponent.value.props,
      sourceCode: await extractSourceCode(selectedComponent.value),
      tags: [],
      savedAt: new Date().toISOString(),
      url: window.location.href,
    };
    
    await opfs.value.saveComponentLibrary(entry.id, entry);
    componentLibrary.value = await opfs.value.loadComponentLibrary();
  };
  
  return (
    <div className="react-llm-toolbar">
      <div className="header">
        <h3>React LLM</h3>
        <ModelSelector 
          hub={llmHub.value}
          onModelChange={(provider, model) => {
            llmHub.value.setActiveModel(provider, model);
          }}
        />
      </div>
      
      <div className="tabs">
        <button className="tab active">Chat</button>
        <button className="tab">Components</button>
        {isDevMode.value && <button className="tab">Code</button>}
      </div>
      
      <div className="content">
        <ComponentSelector
          inspector={inspector.value}
          onSelect={(component) => {
            selectedComponent.value = component;
          }}
        />
        
        {selectedComponent.value && (
          <div className="component-actions">
            <button onClick={handleSaveComponent}>
              💾 Save to Library
            </button>
            {isDevMode.value && (
              <button onClick={() => fileAccess.value.requestAccess()}>
                📁 Enable File Access
              </button>
            )}
          </div>
        )}
        
        <div className="chat-container">
          {messages.value.map((msg, i) => (
            <div key={i} className={`message ${msg.role}`}>
              {msg.content}
            </div>
          ))}
        </div>
        
        <form onSubmit={(e) => {
          e.preventDefault();
          const input = e.target.querySelector('input');
          if (input.value) {
            handleSendMessage(input.value);
            input.value = '';
          }
        }}>
          <input
            type="text"
            placeholder="Ask about this component..."
          />
        </form>
      </div>
    </div>
  );
}
```

### Phase 5: Build Configuration

```typescript
// tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    'react-llm': './src/index.ts',
    'react-llm.auto': './src/auto.ts',
  },
  format: ['esm', 'cjs', 'iife'],
  dts: true,
  sourcemap: true,
  clean: true,
  minify: true,
  target: 'es2020',
  globalName: 'ReactLLM',
  external: [],
  noExternal: [/(.*)/], // Bundle everything
  esbuildOptions(options) {
    options.bundle = true;
    options.loader = {
      '.wasm': 'file',
    };
  },
});
```

## Success Criteria

1. **Multi-Model Support**: Seamless switching between LLM providers
2. **Visual Selection**: Click any component to inspect and chat about it
3. **Live Editing**: Changes appear instantly in dev mode via HMR
4. **Component Library**: Save and organize patterns across sites
5. **Performance**: <50ms selection latency, smooth 60fps overlays
6. **Zero Config**: Works with a single script tag

## Development Timeline

### Week 1: Foundation
- Migrate from Gemini to OpenRouter
- Integrate bippy for component inspection
- Basic visual selection UI

### Week 2: Core Features  
- File System Access API integration
- Component context extraction
- Live code editing in dev mode

### Week 3: Production Features
- Component library management
- Pattern recognition
- Export functionality

### Week 4: Polish & Launch
- Performance optimization
- UI/UX refinement
- Documentation
- Release preparation