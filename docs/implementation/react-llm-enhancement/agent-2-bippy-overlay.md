# Agent 2: Bippy Overlay Integration Fix
*"Implement robust React component detection and visual selection with canvas-based rendering"*

## Scope

This agent will fix the broken bippy integration to enable visual component selection through canvas-based overlays. The solution must work across different React versions (16-19), handle timing issues with React initialization, and provide smooth 60fps overlay rendering.

### Key Objectives
1. Fix React instrumentation timing to capture all components
2. Implement proper canvas rendering outside Shadow DOM
3. Create robust component detection at click points
4. Add visual feedback for hover and selection states
5. Extract comprehensive component metadata

## Packages to Modify

- `packages/react-llm/src/index.ts` - Early bippy initialization
- `packages/react-llm/src/instrumentation/bippy-adapter.ts` - Core fixes and enhancements
- `packages/react-llm/src/components/ComponentInspector.tsx` - Canvas rendering logic
- `packages/react-llm/src/utils/react-detector.ts` - New React detection utility
- `packages/react-llm/src/workers/canvas-renderer.ts` - New Web Worker for rendering
- `packages/react-llm/package.json` - Ensure bippy is properly included

## Implementation Details

### 1. Early Initialization Strategy

Move bippy initialization to the earliest possible point:

```typescript
// packages/react-llm/src/index.ts
import { ComponentInspector } from './instrumentation/bippy-adapter';
import { detectReact } from './utils/react-detector';
import { signal } from '@preact/signals';

// Global inspector instance
let globalInspector: ComponentInspector | null = null;
export const inspectorReady = signal(false);

// Initialize immediately on script load
(async function initializeBippy() {
  try {
    // Wait for React to be available
    const reactInfo = await detectReact();
    
    if (reactInfo) {
      console.log('[ReactLLM] React detected:', reactInfo.version);
      
      // Initialize bippy before React renders
      globalInspector = new ComponentInspector();
      await globalInspector.initialize();
      
      inspectorReady.value = true;
      console.log('[ReactLLM] Bippy instrumentation ready');
    } else {
      console.warn('[ReactLLM] React not detected on page');
    }
  } catch (error) {
    console.error('[ReactLLM] Failed to initialize bippy:', error);
  }
})();

// Export for components to use
export function getInspector(): ComponentInspector | null {
  return globalInspector;
}

// Modified init function
export function init(config: ReactLLMConfig = {}) {
  // ... existing Shadow DOM setup ...
  
  // Pass inspector to Toolbar
  render(h(Toolbar, { 
    hub,
    config: normalizedConfig,
    inspector: globalInspector 
  }), root);
}
```

### 2. React Detection Utility

Create a robust React detection system:

```typescript
// packages/react-llm/src/utils/react-detector.ts
export interface ReactInfo {
  version: string;
  renderer: any;
  reconciler: any;
  devToolsHook: any;
}

export async function detectReact(maxAttempts = 50): Promise<ReactInfo | null> {
  // Check for React in multiple ways
  for (let i = 0; i < maxAttempts; i++) {
    // Method 1: Direct window.React
    if (window.React && window.React.version) {
      return extractReactInfo();
    }
    
    // Method 2: React DevTools hook
    if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
      const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (hook.renderers && hook.renderers.size > 0) {
        return extractReactInfo();
      }
    }
    
    // Method 3: Check for React fiber in DOM
    const reactRoot = findReactRoot();
    if (reactRoot) {
      return extractReactInfo();
    }
    
    // Wait and retry
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return null;
}

function findReactRoot(): Element | null {
  // Look for React 18 root
  const roots = document.querySelectorAll('[data-reactroot], [data-react-root]');
  if (roots.length > 0) return roots[0];
  
  // Look for React fiber properties
  const allElements = document.getElementsByTagName('*');
  for (const element of allElements) {
    const keys = Object.keys(element);
    const hasFiber = keys.some(key => 
      key.startsWith('__reactInternalInstance') || 
      key.startsWith('__reactFiber') ||
      key.startsWith('_reactRootContainer')
    );
    if (hasFiber) return element;
  }
  
  return null;
}

function extractReactInfo(): ReactInfo {
  const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
  const renderer = hook?.renderers?.values()?.next()?.value;
  
  return {
    version: window.React?.version || renderer?.version || 'unknown',
    renderer,
    reconciler: renderer?.reconciler,
    devToolsHook: hook,
  };
}
```

### 3. Enhanced Bippy Adapter

Fix the core issues in component detection:

```typescript
// packages/react-llm/src/instrumentation/bippy-adapter.ts
import { secure, type BippyDOM, type BippyFiber } from 'bippy';

export interface ComponentInfo {
  name: string;
  displayName: string;
  props: Record<string, any>;
  state: any;
  hooks: any[];
  fiber: BippyFiber;
  domElement: Element | null;
  bounds: DOMRect | null;
  depth: number;
  key: string | null;
  children: ComponentInfo[];
}

export class ComponentInspector {
  private instrumentation: any;
  private fiberRoots: Set<any> = new Set();
  private componentMap: WeakMap<Element, ComponentInfo> = new WeakMap();
  private pendingUpdates: Set<BippyFiber> = new Set();
  private rafId: number | null = null;
  
  async initialize(): Promise<void> {
    // Use bippy's secure wrapper for safety
    const bippyInstrumentation = secure((BippyDOM: any, BippyFiber: any) => {
      // Hook into React's reconciler
      const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (!hook) {
        throw new Error('React DevTools hook not found');
      }
      
      // Instrument all existing renderers
      hook.renderers.forEach((renderer: any, id: number) => {
        this.instrumentRenderer(renderer, id);
      });
      
      // Hook for future renderers
      const originalRegister = hook.onCommitFiberRoot;
      hook.onCommitFiberRoot = (id: number, root: any) => {
        if (originalRegister) {
          originalRegister.call(hook, id, root);
        }
        this.handleCommit(id, root);
      };
      
      // Start monitoring
      this.startMonitoring();
    });
    
    // Execute instrumentation
    await bippyInstrumentation();
  }
  
  private instrumentRenderer(renderer: any, id: number): void {
    console.log(`[ReactLLM] Instrumenting renderer ${id}`);
    
    // Access internal reconciler
    const reconciler = renderer.reconciler || renderer;
    if (!reconciler) return;
    
    // Hook into fiber processing
    const originalBeginWork = reconciler.beginWork;
    if (originalBeginWork) {
      reconciler.beginWork = (current: any, workInProgress: any, renderLanes: any) => {
        this.processFiber(workInProgress);
        return originalBeginWork.call(reconciler, current, workInProgress, renderLanes);
      };
    }
  }
  
  private handleCommit(id: number, root: any): void {
    this.fiberRoots.add(root);
    
    // Schedule update processing
    if (!this.rafId) {
      this.rafId = requestAnimationFrame(() => {
        this.processUpdates();
        this.rafId = null;
      });
    }
  }
  
  private processFiber(fiber: BippyFiber): void {
    if (!fiber) return;
    
    // Skip non-component fibers
    if (!this.isComponent(fiber)) return;
    
    // Queue for batch processing
    this.pendingUpdates.add(fiber);
  }
  
  private processUpdates(): void {
    const updates = Array.from(this.pendingUpdates);
    this.pendingUpdates.clear();
    
    updates.forEach(fiber => {
      const info = this.extractComponentInfo(fiber);
      if (info && info.domElement) {
        this.componentMap.set(info.domElement, info);
      }
    });
  }
  
  private isComponent(fiber: BippyFiber): boolean {
    // Check if fiber represents a React component
    const tag = fiber.tag;
    
    // Function and Class components
    if (tag === 0 || tag === 1) return true;
    
    // Forward ref, memo, lazy components
    if (tag === 11 || tag === 14 || tag === 16) return true;
    
    // Context providers/consumers
    if (tag === 10 || tag === 9) return true;
    
    return false;
  }
  
  private extractComponentInfo(fiber: BippyFiber, depth = 0): ComponentInfo | null {
    try {
      const element = fiber.stateNode;
      const domElement = this.findDOMNode(fiber);
      
      const info: ComponentInfo = {
        name: this.getComponentName(fiber),
        displayName: fiber.elementType?.displayName || fiber.elementType?.name || 'Unknown',
        props: fiber.memoizedProps || {},
        state: fiber.memoizedState,
        hooks: this.extractHooks(fiber),
        fiber,
        domElement,
        bounds: domElement?.getBoundingClientRect() || null,
        depth,
        key: fiber.key,
        children: [],
      };
      
      // Extract child components
      let child = fiber.child;
      while (child) {
        if (this.isComponent(child)) {
          const childInfo = this.extractComponentInfo(child, depth + 1);
          if (childInfo) {
            info.children.push(childInfo);
          }
        }
        child = child.sibling;
      }
      
      return info;
    } catch (error) {
      console.error('[ReactLLM] Error extracting component info:', error);
      return null;
    }
  }
  
  private findDOMNode(fiber: BippyFiber): Element | null {
    let current = fiber;
    
    while (current) {
      if (current.stateNode && current.stateNode.nodeType === 1) {
        return current.stateNode as Element;
      }
      
      // For composite components, traverse down
      if (current.child) {
        current = current.child;
      } else {
        return null;
      }
    }
    
    return null;
  }
  
  private getComponentName(fiber: BippyFiber): string {
    const type = fiber.elementType;
    
    if (typeof type === 'function') {
      return type.displayName || type.name || 'Anonymous';
    }
    
    if (typeof type === 'string') {
      return type;
    }
    
    if (type?.$$typeof) {
      // Handle special React types
      const symbolStr = type.$$typeof.toString();
      if (symbolStr.includes('react.forward_ref')) return 'ForwardRef';
      if (symbolStr.includes('react.memo')) return `Memo(${this.getComponentName({...fiber, elementType: type.type})})`;
      if (symbolStr.includes('react.lazy')) return 'Lazy';
    }
    
    return 'Unknown';
  }
  
  private extractHooks(fiber: BippyFiber): any[] {
    const hooks = [];
    let hook = fiber.memoizedState;
    
    while (hook) {
      hooks.push({
        memoizedState: hook.memoizedState,
        next: hook.next ? true : false,
      });
      hook = hook.next;
    }
    
    return hooks;
  }
  
  public getComponentAtPoint(x: number, y: number): ComponentInfo | null {
    // Get all elements at point
    const elements = document.elementsFromPoint(x, y);
    
    // Walk up the tree looking for React components
    for (const element of elements) {
      // Check our component map
      const component = this.componentMap.get(element);
      if (component) return component;
      
      // Check parent elements
      let parent = element.parentElement;
      while (parent) {
        const parentComponent = this.componentMap.get(parent);
        if (parentComponent) return parentComponent;
        parent = parent.parentElement;
      }
    }
    
    // Fallback: Search by React internal properties
    for (const element of elements) {
      const fiber = this.getFiberFromElement(element);
      if (fiber) {
        const info = this.extractComponentInfo(fiber);
        if (info) {
          this.componentMap.set(element, info);
          return info;
        }
      }
    }
    
    return null;
  }
  
  private getFiberFromElement(element: Element): BippyFiber | null {
    const keys = Object.keys(element);
    const fiberKey = keys.find(key => 
      key.startsWith('__reactInternalInstance') || 
      key.startsWith('__reactFiber')
    );
    
    return fiberKey ? (element as any)[fiberKey] : null;
  }
  
  private startMonitoring(): void {
    // Periodic refresh of component tree
    setInterval(() => {
      this.refreshComponentTree();
    }, 1000);
  }
  
  private refreshComponentTree(): void {
    this.fiberRoots.forEach(root => {
      this.traverseFiberTree(root.current);
    });
  }
  
  private traverseFiberTree(fiber: BippyFiber | null): void {
    if (!fiber) return;
    
    if (this.isComponent(fiber)) {
      this.processFiber(fiber);
    }
    
    // Traverse children
    let child = fiber.child;
    while (child) {
      this.traverseFiberTree(child);
      child = child.sibling;
    }
  }
  
  public getAllComponents(): ComponentInfo[] {
    const components: ComponentInfo[] = [];
    
    this.fiberRoots.forEach(root => {
      const rootInfo = this.extractComponentInfo(root.current);
      if (rootInfo) {
        components.push(rootInfo);
      }
    });
    
    return components;
  }
}
```

### 4. Canvas Renderer with Web Worker

Offload rendering to a Web Worker for performance:

```typescript
// packages/react-llm/src/workers/canvas-renderer.ts
interface RenderCommand {
  type: 'highlight' | 'clear';
  components?: Array<{
    bounds: DOMRect;
    name: string;
    depth: number;
  }>;
  hoveredIndex?: number;
  selectedIndices?: number[];
}

// Worker code (will be inlined by tsup)
const workerCode = `
  let canvas;
  let ctx;
  
  self.onmessage = function(e) {
    const { type, canvas: offscreenCanvas, command } = e.data;
    
    if (type === 'init') {
      canvas = offscreenCanvas;
      ctx = canvas.getContext('2d');
      return;
    }
    
    if (type === 'render') {
      render(command);
    }
  };
  
  function render(command) {
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (command.type === 'clear') return;
    
    // Set up styles
    ctx.strokeStyle = '#0066FF';
    ctx.fillStyle = 'rgba(0, 102, 255, 0.1)';
    ctx.lineWidth = 2;
    ctx.font = '12px monospace';
    
    // Draw components
    command.components.forEach((component, index) => {
      const { bounds, name, depth } = component;
      const isHovered = index === command.hoveredIndex;
      const isSelected = command.selectedIndices?.includes(index);
      
      // Adjust styles based on state
      if (isHovered) {
        ctx.strokeStyle = '#0052CC';
        ctx.fillStyle = 'rgba(0, 82, 204, 0.2)';
        ctx.lineWidth = 3;
      } else if (isSelected) {
        ctx.strokeStyle = '#00AA44';
        ctx.fillStyle = 'rgba(0, 170, 68, 0.15)';
        ctx.lineWidth = 2.5;
      } else {
        ctx.strokeStyle = \`rgba(0, 102, 255, \${0.6 - depth * 0.1})\`;
        ctx.fillStyle = \`rgba(0, 102, 255, \${0.1 - depth * 0.02})\`;
        ctx.lineWidth = 2;
      }
      
      // Draw rectangle
      ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
      ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
      
      // Draw component name label
      if (isHovered || isSelected) {
        const labelHeight = 20;
        const labelPadding = 8;
        const labelWidth = ctx.measureText(name).width + labelPadding * 2;
        
        // Position label above component
        let labelX = bounds.x;
        let labelY = bounds.y - labelHeight - 4;
        
        // Adjust if label goes off screen
        if (labelY < 0) {
          labelY = bounds.y + 4;
        }
        if (labelX + labelWidth > canvas.width) {
          labelX = canvas.width - labelWidth;
        }
        
        // Draw label background
        ctx.fillStyle = isSelected ? '#00AA44' : '#0052CC';
        ctx.fillRect(labelX, labelY, labelWidth, labelHeight);
        
        // Draw label text
        ctx.fillStyle = '#FFFFFF';
        ctx.textBaseline = 'middle';
        ctx.fillText(name, labelX + labelPadding, labelY + labelHeight / 2);
      }
    });
  }
`;

export class CanvasRenderer {
  private worker: Worker;
  private canvas: HTMLCanvasElement;
  private offscreenCanvas: OffscreenCanvas | null = null;
  
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    
    // Create worker from blob
    const blob = new Blob([workerCode], { type: 'application/javascript' });
    this.worker = new Worker(URL.createObjectURL(blob));
    
    this.initializeOffscreenCanvas();
  }
  
  private initializeOffscreenCanvas(): void {
    if ('transferControlToOffscreen' in this.canvas) {
      this.offscreenCanvas = this.canvas.transferControlToOffscreen();
      this.worker.postMessage({
        type: 'init',
        canvas: this.offscreenCanvas,
      }, [this.offscreenCanvas]);
    } else {
      // Fallback for browsers without OffscreenCanvas
      console.warn('[ReactLLM] OffscreenCanvas not supported, using main thread rendering');
    }
  }
  
  public render(command: RenderCommand): void {
    if (this.offscreenCanvas) {
      this.worker.postMessage({ type: 'render', command });
    } else {
      // Fallback rendering on main thread
      this.renderOnMainThread(command);
    }
  }
  
  private renderOnMainThread(command: RenderCommand): void {
    const ctx = this.canvas.getContext('2d');
    if (!ctx) return;
    
    // Same rendering logic as worker
    // ... (implement same rendering code)
  }
  
  public destroy(): void {
    this.worker.terminate();
  }
}
```

### 5. Updated Component Inspector UI

Fix the component rendering and interaction:

```typescript
// packages/react-llm/src/components/ComponentInspector.tsx
import { h } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import { signal, computed } from '@preact/signals';
import { CanvasRenderer } from '../workers/canvas-renderer';
import type { ComponentInspector as Inspector, ComponentInfo } from '../instrumentation/bippy-adapter';

interface Props {
  inspector: Inspector;
  onSelect: (component: ComponentInfo) => void;
  onCancel: () => void;
}

export const ComponentInspector = ({ inspector, onSelect, onCancel }: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<CanvasRenderer | null>(null);
  const [hoveredComponent, setHoveredComponent] = useState<ComponentInfo | null>(null);
  const selectedComponents = signal<ComponentInfo[]>([]);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Create canvas outside Shadow DOM
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 2147483646;
    `;
    document.body.appendChild(canvas);
    
    // Size canvas to window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Initialize renderer
    rendererRef.current = new CanvasRenderer(canvas);
    
    // Event handlers
    const handleMouseMove = (e: MouseEvent) => {
      const component = inspector.getComponentAtPoint(e.clientX, e.clientY);
      setHoveredComponent(component);
      updateCanvas();
    };
    
    const handleClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      const component = inspector.getComponentAtPoint(e.clientX, e.clientY);
      if (component) {
        // Toggle selection
        const isSelected = selectedComponents.value.some(c => c === component);
        if (isSelected) {
          selectedComponents.value = selectedComponents.value.filter(c => c !== component);
        } else {
          selectedComponents.value = [...selectedComponents.value, component];
        }
        updateCanvas();
      }
    };
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCancel();
      } else if (e.key === 'Enter' && selectedComponents.value.length > 0) {
        onSelect(selectedComponents.value[0]); // For now, just select first
      }
    };
    
    // Overlay for capturing events
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 2147483645;
      cursor: crosshair;
    `;
    document.body.appendChild(overlay);
    
    overlay.addEventListener('mousemove', handleMouseMove);
    overlay.addEventListener('click', handleClick);
    document.addEventListener('keydown', handleKeyDown);
    
    // Initial render
    updateCanvas();
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      overlay.removeEventListener('mousemove', handleMouseMove);
      overlay.removeEventListener('click', handleClick);
      document.removeEventListener('keydown', handleKeyDown);
      
      document.body.removeChild(canvas);
      document.body.removeChild(overlay);
      
      rendererRef.current?.destroy();
    };
  }, [inspector, onSelect, onCancel]);
  
  const updateCanvas = () => {
    if (!rendererRef.current) return;
    
    const allComponents = inspector.getAllComponents();
    const flatComponents = flattenComponentTree(allComponents);
    
    rendererRef.current.render({
      type: 'highlight',
      components: flatComponents.map(c => ({
        bounds: c.bounds!,
        name: c.name,
        depth: c.depth,
      })),
      hoveredIndex: hoveredComponent ? flatComponents.indexOf(hoveredComponent) : undefined,
      selectedIndices: selectedComponents.value.map(c => flatComponents.indexOf(c)),
    });
  };
  
  const flattenComponentTree = (components: ComponentInfo[]): ComponentInfo[] => {
    const result: ComponentInfo[] = [];
    
    const traverse = (comps: ComponentInfo[]) => {
      comps.forEach(comp => {
        if (comp.bounds) {
          result.push(comp);
        }
        traverse(comp.children);
      });
    };
    
    traverse(components);
    return result;
  };
  
  // Render selection UI in Shadow DOM
  return (
    <div className="component-inspector-ui">
      <div className="selection-info">
        {hoveredComponent && (
          <div className="hover-info">
            Hovering: <strong>{hoveredComponent.name}</strong>
          </div>
        )}
        {selectedComponents.value.length > 0 && (
          <div className="selected-info">
            Selected: {selectedComponents.value.length} component(s)
            <button onClick={() => onSelect(selectedComponents.value[0])}>
              Add to Context
            </button>
          </div>
        )}
        <div className="help-text">
          Click to select • Enter to confirm • Esc to cancel
        </div>
      </div>
    </div>
  );
};
```

## Dependencies

### Required
- `bippy`: Latest version with React 19 support
- No additional dependencies needed (using built-in browser APIs)

### Development
- TypeScript types for React internals
- Testing utilities for mocking React

## Testing Strategy

### Integration Testing
```typescript
// Test bippy initialization
test('Bippy initializes before React renders', async () => {
  // Mock React detection
  window.React = { version: '18.2.0' };
  
  // Import and check initialization
  const { getInspector } = await import('../src/index');
  
  // Wait for initialization
  await new Promise(resolve => setTimeout(resolve, 200));
  
  const inspector = getInspector();
  expect(inspector).toBeTruthy();
  expect(inspector.getAllComponents().length).toBeGreaterThan(0);
});

// Test component detection
test('Can detect components at click point', () => {
  const inspector = new ComponentInspector();
  
  // Create mock component
  const mockElement = document.createElement('div');
  mockElement.getBoundingClientRect = () => ({
    x: 100, y: 100, width: 200, height: 50,
    top: 100, left: 100, right: 300, bottom: 150,
  });
  
  // Mock component info
  const mockComponent = {
    name: 'TestComponent',
    domElement: mockElement,
    bounds: mockElement.getBoundingClientRect(),
  };
  
  // Test detection
  const found = inspector.getComponentAtPoint(150, 125);
  expect(found?.name).toBe('TestComponent');
});
```

### Visual Testing
- Canvas rendering output verification
- Screenshot tests for overlay appearance
- Performance benchmarks for 60fps rendering

## Security Considerations

### React Instrumentation Safety
- Use bippy's `secure()` wrapper to prevent code injection
- No direct manipulation of React internals
- Graceful degradation if React isn't present

### DOM Access
- Canvas element properly sandboxed
- No modification of user's React components
- Event handlers don't interfere with app functionality

## Effort Estimate

**4-5 developer days**

### Breakdown:
- Day 1: React detection and early initialization
- Day 2: Fix bippy adapter and component detection
- Day 3: Canvas rendering with Web Worker
- Day 4: UI integration and event handling
- Day 0.5-1: Testing and edge cases

## Success Metrics

- [ ] React detected and instrumented before first render
- [ ] Components detected on 95%+ of React sites
- [ ] Canvas overlay renders at consistent 60fps
- [ ] Click detection accurate within 5px
- [ ] Works with React 16, 17, 18, and 19
- [ ] No console errors or warnings
- [ ] Memory usage stable (no leaks)
- [ ] Component metadata accurately extracted