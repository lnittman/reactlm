import { 
  instrument,
  onCommitFiberRoot,
  traverseFiber,
  isHostFiber,
  getNearestHostFiber,
  traverseRenderedFibers,
  secure,
  type Fiber 
} from 'bippy';
import { reactDetector } from '../utils/react-detector';

export interface SourceLocation {
  fileName?: string;
  lineNumber?: number;
  columnNumber?: number;
}

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
  fiberType: string;
  isComponent: boolean;
  depth: number;
}

export type ComponentSelectionCallback = (component: ComponentInfo) => void;

export class ComponentInspector {
  private fiberMap = new WeakMap<HTMLElement, Fiber>();
  private componentMap = new Map<string, ComponentInfo>();
  private selectionCallback?: ComponentSelectionCallback;
  private isInstrumented = false;
  private componentCounter = 0;
  private instrumentationRetries = 0;
  private maxRetries = 10;
  
  constructor() {
    this.setupInstrumentationWithRetry();
  }
  
  private setupInstrumentationWithRetry() {
    // First check if React is already detected
    const reactResult = reactDetector.getDetectionResult();
    if (reactResult?.isReact) {
      this.setupInstrumentation();
    } else {
      // Wait for React to be detected
      reactDetector.onReactReady((result) => {
        if (result.isReact) {
          // Add a small delay to ensure React is fully initialized
          setTimeout(() => this.setupInstrumentation(), 50);
        }
      });
    }
  }
  
  private setupInstrumentation() {
    if (this.isInstrumented) return;
    
    try {
      console.log('[ReactLLM] Setting up bippy instrumentation...');
      
      // Use bippy's secure wrapper to prevent crashes
      const handlers = secure({
        onCommitFiberRoot: (rendererID: any, root: any) => {
          try {
            this.processFiberRoot(root);
          } catch (error) {
            console.error('[ReactLLM] Error in fiber root processing:', error);
          }
        },
      });
      
      // Instrument with the secure handlers
      instrument(handlers);
      
      this.isInstrumented = true;
      console.log('[ReactLLM] Bippy instrumentation initialized successfully');
      
      // Process any existing React roots
      this.processExistingRoots();
      
    } catch (error) {
      console.error('[ReactLLM] Failed to setup instrumentation:', error);
      
      // Retry setup if we haven't exceeded max retries
      if (this.instrumentationRetries < this.maxRetries) {
        this.instrumentationRetries++;
        console.log(`[ReactLLM] Retrying instrumentation setup (${this.instrumentationRetries}/${this.maxRetries})`);
        setTimeout(() => this.setupInstrumentation(), 100);
      } else {
        console.error('[ReactLLM] Max instrumentation retries exceeded, component inspection will be limited');
      }
    }
  }
  
  private processExistingRoots() {
    try {
      // Look for existing React DevTools hook to find roots
      const hook = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (hook && hook.getFiberRoots) {
        const roots = hook.getFiberRoots(1); // Get roots for renderer ID 1
        roots.forEach((root: any) => {
          this.processFiberRoot(root);
        });
      }
    } catch (error) {
      console.warn('[ReactLLM] Could not process existing roots:', error);
    }
  }
  
  private processFiberRoot(root: any) {
    try {
      // Use bippy's traverseRenderedFibers to only process fibers that have actually rendered
      traverseRenderedFibers(root, (fiber: Fiber) => {
        this.processFiber(fiber);
      });
    } catch (error) {
      console.error('[ReactLLM] Error processing fiber root:', error);
    }
  }
  
  private processFiber(fiber: Fiber) {
    try {
      // Skip if this fiber doesn't represent a component or DOM element
      if (!this.isRelevantFiber(fiber)) return;
      
      const info = this.extractComponentInfo(fiber);
      
      // Map DOM elements to fibers for click detection
      if (info.domElement) {
        this.fiberMap.set(info.domElement, fiber);
        info.domElement.dataset.reactLlmId = info.id;
      }
      
      this.componentMap.set(info.id, info);
    } catch (error) {
      console.error('[ReactLLM] Error processing fiber:', error);
    }
  }
  
  private isRelevantFiber(fiber: Fiber): boolean {
    // Include function components, class components, and host components (DOM elements)
    return fiber.type !== null || 
           fiber.elementType !== null || 
           typeof fiber.type === 'string' || // Host components (div, span, etc.)
           typeof fiber.type === 'function'; // Function/class components
  }
  
  private extractComponentInfo(fiber: Fiber): ComponentInfo {
    const id = this.getFiberId(fiber);
    const name = this.getDisplayName(fiber);
    const isComponent = this.isComponentFiber(fiber);
    
    return {
      id,
      name,
      props: fiber.memoizedProps || {},
      state: fiber.memoizedState || null,
      hooks: this.extractHooks(fiber),
      parent: this.getParentComponent(fiber),
      children: this.getChildComponents(fiber),
      domElement: this.getDOMElement(fiber),
      sourceLocation: this.getSourceLocation(fiber),
      fiberType: this.getFiberType(fiber),
      isComponent,
      depth: this.getFiberDepth(fiber)
    };
  }
  
  private getFiberId(fiber: Fiber): string {
    // Create a unique ID based on fiber properties
    const key = fiber.key || '';
    const index = fiber.index || 0;
    const type = this.getDisplayName(fiber);
    return `${type}-${key}-${index}-${++this.componentCounter}`;
  }
  
  private getDisplayName(fiber: Fiber): string {
    if (typeof fiber.type === 'string') {
      return fiber.type; // Host component like 'div', 'span'
    }
    
    if (typeof fiber.type === 'function') {
      return fiber.type.displayName || fiber.type.name || 'Anonymous';
    }
    
    if (fiber.elementType && typeof fiber.elementType === 'function') {
      return fiber.elementType.displayName || fiber.elementType.name || 'Anonymous';
    }
    
    // Handle different fiber types based on React fiber tags
    switch (fiber.tag) {
      case 0: return 'FunctionComponent';
      case 1: return 'ClassComponent';
      case 3: return 'HostRoot';
      case 5: return 'HostComponent';
      case 6: return 'HostText';
      case 7: return 'Fragment';
      case 8: return 'Mode';
      case 9: return 'ContextConsumer';
      case 10: return 'ContextProvider';
      case 11: return 'ForwardRef';
      case 12: return 'Profiler';
      case 13: return 'SuspenseComponent';
      case 14: return 'MemoComponent';
      case 15: return 'SimpleMemoComponent';
      case 16: return 'LazyComponent';
      default: return `Unknown(${fiber.tag})`;
    }
  }
  
  private isComponentFiber(fiber: Fiber): boolean {
    // Function components, class components, memo components, etc.
    return fiber.tag === 0 || fiber.tag === 1 || fiber.tag === 14 || fiber.tag === 15;
  }
  
  private getFiberType(fiber: Fiber): string {
    const tagMap: Record<number, string> = {
      0: 'FunctionComponent',
      1: 'ClassComponent',
      3: 'HostRoot',
      5: 'HostComponent',
      6: 'HostText',
      7: 'Fragment',
      8: 'Mode',
      9: 'ContextConsumer',
      10: 'ContextProvider',
      11: 'ForwardRef',
      12: 'Profiler',
      13: 'SuspenseComponent',
      14: 'MemoComponent',
      15: 'SimpleMemoComponent',
      16: 'LazyComponent'
    };
    
    return tagMap[fiber.tag] || `Unknown(${fiber.tag})`;
  }
  
  private extractHooks(fiber: Fiber): any[] {
    const hooks: any[] = [];
    
    try {
      let hook = fiber.memoizedState;
      while (hook) {
        hooks.push({
          memoizedState: hook.memoizedState,
          baseState: hook.baseState,
          next: !!hook.next
        });
        hook = hook.next;
      }
    } catch (error) {
      // Hooks extraction failed, return empty array
    }
    
    return hooks;
  }
  
  private getParentComponent(fiber: Fiber): ComponentInfo | undefined {
    let parent = fiber.return;
    while (parent) {
      if (this.isComponentFiber(parent)) {
        const parentId = this.getFiberId(parent);
        return this.componentMap.get(parentId);
      }
      parent = parent.return;
    }
    return undefined;
  }
  
  private getChildComponents(fiber: Fiber): ComponentInfo[] {
    const children: ComponentInfo[] = [];
    let child = fiber.child;
    
    while (child) {
      if (this.isComponentFiber(child)) {
        const childId = this.getFiberId(child);
        const childInfo = this.componentMap.get(childId);
        if (childInfo) {
          children.push(childInfo);
        }
      }
      child = child.sibling;
    }
    
    return children;
  }
  
  private getDOMElement(fiber: Fiber): HTMLElement | undefined {
    // For host components, the stateNode is the DOM element
    if (fiber.tag === 5 && fiber.stateNode instanceof HTMLElement) {
      return fiber.stateNode;
    }
    
    // For components, use bippy's getNearestHostFiber
    try {
      const hostFiber = getNearestHostFiber(fiber);
      if (hostFiber && hostFiber.stateNode instanceof HTMLElement) {
        return hostFiber.stateNode;
      }
    } catch (error) {
      // Fall back to manual search
      let current = fiber.child;
      while (current) {
        if (current.tag === 5 && current.stateNode instanceof HTMLElement) {
          return current.stateNode;
        }
        current = current.child;
      }
    }
    
    return undefined;
  }
  
  private getSourceLocation(fiber: Fiber): SourceLocation | undefined {
    // Try to extract source location from fiber's debug info
    if (fiber._debugSource) {
      return {
        fileName: fiber._debugSource.fileName,
        lineNumber: fiber._debugSource.lineNumber,
        columnNumber: fiber._debugSource.columnNumber
      };
    }
    
    return undefined;
  }
  
  private getFiberDepth(fiber: Fiber): number {
    let depth = 0;
    let parent = fiber.return;
    while (parent) {
      depth++;
      parent = parent.return;
    }
    return depth;
  }
  
  getComponentAtPoint(x: number, y: number): ComponentInfo | null {
    const element = document.elementFromPoint(x, y) as HTMLElement;
    if (!element) return null;
    
    // Walk up DOM tree to find React component
    let current: HTMLElement | null = element;
    let bestMatch: ComponentInfo | null = null;
    
    while (current) {
      // Check if this element has a React fiber
      const fiber = this.fiberMap.get(current);
      if (fiber) {
        const id = this.getFiberId(fiber);
        const component = this.componentMap.get(id);
        if (component) {
          // Prefer actual React components over host components
          if (component.isComponent) {
            return component;
          } else if (!bestMatch) {
            bestMatch = component;
          }
        }
      }
      
      // Also check for React-LLM data attributes
      const reactLlmId = current.dataset.reactLlmId;
      if (reactLlmId) {
        const component = this.componentMap.get(reactLlmId);
        if (component && component.isComponent) {
          return component;
        }
      }
      
      // Check for React fiber keys directly on the element
      const reactFiberKey = Object.keys(current).find(key => 
        key.startsWith('__reactInternalInstance') || 
        key.startsWith('__reactFiber')
      );
      
      if (reactFiberKey) {
        const fiber = (current as any)[reactFiberKey];
        if (fiber) {
          const component = this.findComponentFromFiber(fiber);
          if (component) {
            return component;
          }
        }
      }
      
      current = current.parentElement;
    }
    
    return bestMatch;
  }
  
  private findComponentFromFiber(fiber: Fiber): ComponentInfo | null {
    // Walk up the fiber tree to find a component
    let current = fiber;
    while (current) {
      if (this.isComponentFiber(current)) {
        const id = this.getFiberId(current);
        const component = this.componentMap.get(id);
        if (component) {
          return component;
        }
      }
      current = current.return;
    }
    return null;
  }
  
  getComponentById(id: string): ComponentInfo | null {
    return this.componentMap.get(id) || null;
  }
  
  getAllComponents(): ComponentInfo[] {
    return Array.from(this.componentMap.values())
      .filter(comp => comp.isComponent)
      .sort((a, b) => a.depth - b.depth);
  }
  
  getComponentTree(): ComponentInfo[] {
    const components = this.getAllComponents();
    return components.filter(comp => !comp.parent);
  }
  
  selectComponent(component: ComponentInfo) {
    if (this.selectionCallback) {
      this.selectionCallback(component);
    }
  }
  
  onSelection(callback: ComponentSelectionCallback) {
    this.selectionCallback = callback;
  }
  
  highlightComponent(component: ComponentInfo) {
    if (component.domElement) {
      component.domElement.style.outline = '2px solid #007acc';
      component.domElement.style.outlineOffset = '2px';
    }
  }
  
  unhighlightComponent(component: ComponentInfo) {
    if (component.domElement) {
      component.domElement.style.outline = '';
      component.domElement.style.outlineOffset = '';
    }
  }
  
  isInstrumentationReady(): boolean {
    return this.isInstrumented;
  }
}