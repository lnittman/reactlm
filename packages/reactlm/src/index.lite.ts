/**
 * React LLM Lite - Optimized entry point
 * Excludes monitoring and database features for smaller bundle size
 */

import { render, h } from 'preact';
import { Toolbar } from './components/Toolbar';
import { LLMHub } from './llm/providers';
// Config type
export interface ReactLLMConfig {
  providers?: {
    openrouter?: string;
    openai?: string;
    anthropic?: string;
    google?: string;
  };
  mode?: 'development' | 'production';
  theme?: 'light' | 'dark';
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  enableMonitoring?: boolean;
}

// Lazy load monitoring if needed
let MonitorManager: any = null;

async function loadMonitoring() {
  if (!MonitorManager) {
    const module = await import('./monitoring/monitor-manager');
    MonitorManager = module.MonitorManager;
  }
  return new MonitorManager();
}

// Main initialization function
export async function init(config: ReactLLMConfig = {}) {
  console.log('[ReactLLM Lite] Initializing with config:', config);
  
  try {
    // Create container
    const container = document.createElement('div');
    container.id = 'react-llm-root';
    
    // Create shadow root for style isolation
    const shadowRoot = container.attachShadow({ mode: 'open' });
    
    // Add container to body
    document.body.appendChild(container);
    
    // Initialize LLM Hub with providers
    const hub = new LLMHub(config.providers || {});
    await hub.initialize();
    
    // Load monitoring only if needed
    let monitorManager = null;
    if (config.enableMonitoring !== false) {
      try {
        monitorManager = await loadMonitoring();
        monitorManager.start();
        console.log('[ReactLLM Lite] Monitoring loaded');
      } catch (error) {
        console.warn('[ReactLLM Lite] Monitoring not available:', error);
      }
    }
    
    // Render toolbar into shadow DOM
    const toolbarContainer = document.createElement('div');
    shadowRoot.appendChild(toolbarContainer);
    
    render(
      h(Toolbar, { 
        hub,
        monitorManager
      }),
      toolbarContainer
    );
    
    console.log('[ReactLLM Lite] Initialized successfully');
    
    // Return API for programmatic control
    return {
      hub,
      monitorManager,
      container,
      shadowRoot,
      destroy: () => {
        if (monitorManager) {
          monitorManager.stop();
        }
        container.remove();
      }
    };
  } catch (error) {
    console.error('[ReactLLM Lite] Initialization failed:', error);
    throw error;
  }
}

// Export for global access
if (typeof window !== 'undefined') {
  (window as any).ReactLLM = {
    init,
    version: '0.1.0-lite'
  };
}