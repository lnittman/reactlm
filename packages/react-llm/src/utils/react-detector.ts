/**
 * React Detection and Early Instrumentation Utility
 * 
 * This module detects React presence and initializes bippy instrumentation
 * before any React components render.
 */

export interface ReactDetectionResult {
  isReact: boolean;
  version?: string;
  devtools?: boolean;
  fiberRoot?: any;
  rendererID?: number;
}

export type ReactReadyCallback = (result: ReactDetectionResult) => void;

class ReactDetector {
  private callbacks: ReactReadyCallback[] = [];
  private detectionResult: ReactDetectionResult | null = null;
  private isDetecting = false;
  private maxRetries = 50; // 5 seconds with 100ms intervals
  private retryCount = 0;

  /**
   * Add a callback to be called when React is detected
   */
  onReactReady(callback: ReactReadyCallback): void {
    if (this.detectionResult) {
      // React already detected, call immediately
      callback(this.detectionResult);
      return;
    }
    
    this.callbacks.push(callback);
    
    // Start detection if not already running
    if (!this.isDetecting) {
      this.startDetection();
    }
  }

  /**
   * Start React detection process
   */
  private startDetection(): void {
    this.isDetecting = true;
    this.retryCount = 0;
    
    // Try immediate detection first
    const result = this.detectReact();
    if (result.isReact) {
      this.onReactDetected(result);
      return;
    }
    
    // If not found, start polling
    this.pollForReact();
  }

  /**
   * Poll for React availability
   */
  private pollForReact(): void {
    const poll = () => {
      this.retryCount++;
      
      const result = this.detectReact();
      if (result.isReact) {
        this.onReactDetected(result);
        return;
      }
      
      // Continue polling if not exceeded max retries
      if (this.retryCount < this.maxRetries) {
        setTimeout(poll, 100);
      } else {
        console.warn('[ReactLLM] React not detected after 5 seconds, giving up');
        this.onReactDetected({ isReact: false });
      }
    };
    
    setTimeout(poll, 100);
  }

  /**
   * Called when React is detected (or detection failed)
   */
  private onReactDetected(result: ReactDetectionResult): void {
    this.detectionResult = result;
    this.isDetecting = false;
    
    // Notify all callbacks
    this.callbacks.forEach(callback => {
      try {
        callback(result);
      } catch (error) {
        console.error('[ReactLLM] Error in React detection callback:', error);
      }
    });
    
    // Clear callbacks to prevent memory leaks
    this.callbacks.length = 0;
  }

  /**
   * Detect React in various ways
   */
  private detectReact(): ReactDetectionResult {
    // Method 1: Check for React DevTools
    const devtools = this.checkReactDevTools();
    if (devtools.isReact) {
      return devtools;
    }
    
    // Method 2: Check for React on window
    const windowReact = this.checkWindowReact();
    if (windowReact.isReact) {
      return windowReact;
    }
    
    // Method 3: Check for React DOM containers
    const domContainers = this.checkReactDOMContainers();
    if (domContainers.isReact) {
      return domContainers;
    }
    
    // Method 4: Check for React fiber nodes in DOM
    const fiberNodes = this.checkFiberNodes();
    if (fiberNodes.isReact) {
      return fiberNodes;
    }
    
    return { isReact: false };
  }

  /**
   * Check for React DevTools
   */
  private checkReactDevTools(): ReactDetectionResult {
    try {
      // React DevTools creates a global hook
      const hook = (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (!hook) {
        return { isReact: false };
      }
      
      // Check if there are any React renderers
      if (hook.renderers && hook.renderers.size > 0) {
        const renderer = Array.from(hook.renderers.values())[0];
        return {
          isReact: true,
          version: renderer?.version,
          devtools: true,
          rendererID: Array.from(hook.renderers.keys())[0]
        };
      }
      
      // DevTools hook exists but no renderers yet
      return { isReact: false };
    } catch (error) {
      return { isReact: false };
    }
  }

  /**
   * Check for React on window object
   */
  private checkWindowReact(): ReactDetectionResult {
    try {
      const win = window as any;
      
      // Check common React globals
      const reactSources = [
        win.React,
        win.ReactDOM,
        win.__webpack_require__?.cache // Webpack bundles
      ];
      
      for (const source of reactSources) {
        if (source && this.isReactLike(source)) {
          return {
            isReact: true,
            version: source.version || 'unknown'
          };
        }
      }
      
      return { isReact: false };
    } catch (error) {
      return { isReact: false };
    }
  }

  /**
   * Check for React DOM containers with fiber roots
   */
  private checkReactDOMContainers(): ReactDetectionResult {
    try {
      const containers = document.querySelectorAll('[data-reactroot], #root, #app, [id*="react"], [class*="react"]');
      
      for (const container of containers) {
        const fiberRoot = this.getFiberRoot(container as HTMLElement);
        if (fiberRoot) {
          return {
            isReact: true,
            fiberRoot,
            version: this.extractReactVersion(fiberRoot)
          };
        }
      }
      
      return { isReact: false };
    } catch (error) {
      return { isReact: false };
    }
  }

  /**
   * Check for React fiber nodes anywhere in the DOM
   */
  private checkFiberNodes(): ReactDetectionResult {
    try {
      // Look for elements with React fiber properties
      const walker = document.createTreeWalker(
        document.documentElement,
        NodeFilter.SHOW_ELEMENT,
        {
          acceptNode: (node) => {
            const element = node as HTMLElement;
            if (this.hasFiberProperties(element)) {
              return NodeFilter.FILTER_ACCEPT;
            }
            return NodeFilter.FILTER_SKIP;
          }
        }
      );
      
      let node;
      while (node = walker.nextNode()) {
        const fiberRoot = this.getFiberRoot(node as HTMLElement);
        if (fiberRoot) {
          return {
            isReact: true,
            fiberRoot,
            version: this.extractReactVersion(fiberRoot)
          };
        }
      }
      
      return { isReact: false };
    } catch (error) {
      return { isReact: false };
    }
  }

  /**
   * Check if an object looks like React
   */
  private isReactLike(obj: any): boolean {
    return obj && (
      (obj.createElement && obj.Component) ||
      (obj.render && obj.unmountComponentAtNode) ||
      obj.version || 
      obj.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
    );
  }

  /**
   * Get fiber root from a DOM element
   */
  private getFiberRoot(element: HTMLElement): any {
    // React 18+
    if ((element as any)._reactInternalInstance) {
      return (element as any)._reactInternalInstance;
    }
    
    // React 16+
    const fiberKey = Object.keys(element).find(key => 
      key.startsWith('__reactInternalInstance') || 
      key.startsWith('__reactFiber')
    );
    
    if (fiberKey) {
      return (element as any)[fiberKey];
    }
    
    // Check container's _reactRootContainer (React 16/17)
    if ((element as any)._reactRootContainer) {
      return (element as any)._reactRootContainer;
    }
    
    // Check for React 18 root
    if ((element as any)._reactInternals) {
      return (element as any)._reactInternals;
    }
    
    return null;
  }

  /**
   * Check if element has fiber properties
   */
  private hasFiberProperties(element: HTMLElement): boolean {
    const keys = Object.keys(element);
    return keys.some(key => 
      key.startsWith('__reactInternalInstance') || 
      key.startsWith('__reactFiber') ||
      key === '_reactInternalInstance' ||
      key === '_reactInternals'
    );
  }

  /**
   * Extract React version from fiber root
   */
  private extractReactVersion(fiberRoot: any): string {
    try {
      // Try various ways to get the version
      if (fiberRoot.version) return fiberRoot.version;
      if (fiberRoot.current?.version) return fiberRoot.current.version;
      if (fiberRoot._internalRoot?.version) return fiberRoot._internalRoot.version;
      
      // Fallback: detect version by fiber structure
      if (fiberRoot.current?.mode !== undefined) {
        return '16+';
      }
      
      return 'unknown';
    } catch (error) {
      return 'unknown';
    }
  }

  /**
   * Get the current detection result
   */
  getDetectionResult(): ReactDetectionResult | null {
    return this.detectionResult;
  }

  /**
   * Force a new detection
   */
  forceDetection(): void {
    this.detectionResult = null;
    this.startDetection();
  }
}

// Create singleton instance
export const reactDetector = new ReactDetector();

/**
 * Utility function to wait for React to be ready
 */
export function waitForReact(timeout: number = 5000): Promise<ReactDetectionResult> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error('React detection timed out'));
    }, timeout);
    
    reactDetector.onReactReady((result) => {
      clearTimeout(timeoutId);
      resolve(result);
    });
  });
}

/**
 * Check if React is currently detected
 */
export function isReactDetected(): boolean {
  const result = reactDetector.getDetectionResult();
  return result?.isReact ?? false;
}