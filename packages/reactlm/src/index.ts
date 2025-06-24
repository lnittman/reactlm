/** @jsx h */
import { h, render } from 'preact';
import { Toolbar } from './components/Toolbar';
import { LLMHub } from './llm/providers';
import { reactDetector, waitForReact } from './utils/react-detector';
import { ComponentInspector } from './instrumentation/bippy-adapter';
import { MonitorManager } from './monitoring/monitor-manager';

interface ReactLMConfig {
  providers?: {
    openrouter?: string;
    openai?: string;
    anthropic?: string;
    google?: string;
  };
  // API endpoint mode (for server-side proxy)
  apiEndpoint?: string;
  modelsEndpoint?: string;
  mode?: 'development' | 'production' | 'demo';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  theme?: 'dark' | 'light';
  siteUrl?: string;
  siteName?: string;
  debug?: boolean;
  // Legacy support
  apiKey?: string;
}

interface ReactLMGlobal {
  init: (config: ReactLMConfig | string) => void;
  hub?: LLMHub;
  inspector?: ComponentInspector;
  monitorManager?: MonitorManager;
  debug?: boolean;
}

declare global {
  interface Window {
    ReactLM: ReactLMGlobal;
  }
}

let isInitialized = false;

const init = async (config: ReactLMConfig | string) => {
  // Prevent multiple initializations
  if (isInitialized) {
    console.warn('[ReactLM] Already initialized, ignoring duplicate init call');
    return;
  }
  
  try {
    isInitialized = true;
    
    // Handle legacy string API key format
    const normalizedConfig: ReactLMConfig = typeof config === 'string' 
      ? { providers: { openrouter: config } }
      : config;

    // Enable debug mode if requested
    if (normalizedConfig.debug) {
      window.ReactLM.debug = true;
    }

    console.log('[ReactLM] Initializing ReactLM...');

    // Step 1: Initialize React detection and bippy instrumentation early
    await initializeReactInstrumentation();

    // Step 2: Create a single container with shadow DOM (following react-scan pattern)
    const container = document.createElement('div');
    container.id = 'reactlm-root';
    // Critical: Set pointer-events: none on container, only the toolbar inside will have pointer-events: auto
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 0;
      height: 0;
      pointer-events: none;
      z-index: 2147483645;
    `;
    
    document.body.appendChild(container);

    // Create shadow root for style isolation
    const shadow = container.attachShadow({ mode: 'open' });
    
    // Create root div inside shadow DOM
    const root = document.createElement('div');
    root.id = 'reactlm-shadow-root';
    root.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
    `;
    shadow.appendChild(root);

    // Step 3: Initialize LLM Hub
    const hub = new LLMHub();
    
    // Initialize providers based on config
    if (normalizedConfig.mode === 'demo') {
      // Demo mode - no API keys needed!
      await hub.initializeDemoMode();
    } else if (normalizedConfig.apiEndpoint) {
      // Use API endpoint mode (for server-side proxy)
      await hub.initializeApiMode(normalizedConfig.apiEndpoint, normalizedConfig.modelsEndpoint);
    } else if (normalizedConfig.providers?.openrouter || normalizedConfig.apiKey) {
      // Direct API key mode (for development)
      await hub.initializeProvider('openrouter', 
        normalizedConfig.providers?.openrouter || normalizedConfig.apiKey!, 
        {
          siteUrl: normalizedConfig.siteUrl,
          siteName: normalizedConfig.siteName
        }
      );
    } else {
      // Default to demo mode if nothing configured
      await hub.initializeDemoMode();
    }
    
    // Step 4: Initialize monitoring system (disabled by default to avoid interference)
    const monitorManager = new MonitorManager();
    // Only start monitoring if explicitly in development mode
    if (normalizedConfig.mode === 'development') {
      console.log('[ReactLM] Starting monitoring in development mode');
      monitorManager.start();
    }
    
    // Store globals for debugging (ensure global object exists)
    if (!window.ReactLM) {
      window.ReactLM = { init };
    }
    window.ReactLM.hub = hub;
    window.ReactLM.monitorManager = monitorManager;

    // Step 5: Pass everything to Toolbar
    render(h(Toolbar, { 
      hub,
      monitorManager,
      shadowRoot: root // Pass shadow root so toolbar can render overlays inside it
    }), root);
    
    console.log('[ReactLM] Initialized successfully in', normalizedConfig.apiEndpoint ? 'API mode' : 'direct mode');
    
    // Debug: Check if any elements are blocking the page
    if (normalizedConfig.debug) {
      debugCheckBlockingElements();
    }
  } catch (error) {
    isInitialized = false; // Reset flag on error so retry is possible
    console.error('[ReactLM] Failed to initialize:', error);
    throw error;
  }
};

/**
 * Initialize React detection and bippy instrumentation early
 */
async function initializeReactInstrumentation(): Promise<void> {
  try {
    console.log('[ReactLM] Starting React detection...');
    
    // Wait for React to be detected (up to 5 seconds)
    const reactResult = await waitForReact(5000);
    
    if (!reactResult.isReact) {
      console.warn('[ReactLM] React not detected, component inspection will be limited');
      return;
    }
    
    console.log('[ReactLM] React detected:', reactResult.version);
    
    // Initialize bippy instrumentation
    const inspector = new ComponentInspector();
    
    // Store inspector globally for debugging (ensure global object exists)
    if (!window.ReactLM) {
      window.ReactLM = { init };
    }
    window.ReactLM.inspector = inspector;
    
    // Wait a bit for React to render initial components
    await new Promise(resolve => setTimeout(resolve, 100));
    
    console.log('[ReactLM] Component instrumentation ready');
  } catch (error) {
    console.warn('[ReactLM] React detection failed:', error instanceof Error ? error.message : String(error));
    console.warn('[ReactLM] Component inspection will be limited');
  }
}

/**
 * Debug utility to check for elements that might be blocking page interaction
 */
function debugCheckBlockingElements() {
  console.log('[ReactLM Debug] Checking for blocking elements...');
  
  // Check all elements at viewport corners and center
  const points = [
    { x: 10, y: 10, name: 'top-left' },
    { x: window.innerWidth - 10, y: 10, name: 'top-right' },
    { x: 10, y: window.innerHeight - 10, name: 'bottom-left' },
    { x: window.innerWidth - 10, y: window.innerHeight - 10, name: 'bottom-right' },
    { x: window.innerWidth / 2, y: window.innerHeight / 2, name: 'center' }
  ];
  
  points.forEach(point => {
    const element = document.elementFromPoint(point.x, point.y);
    if (element) {
      const styles = window.getComputedStyle(element);
      console.log(`[ReactLM Debug] Element at ${point.name}:`, {
        element,
        id: element.id,
        className: element.className,
        pointerEvents: styles.pointerEvents,
        position: styles.position,
        zIndex: styles.zIndex
      });
      
      // Check if it's one of ours blocking things
      if (element.id && element.id.includes('reactlm')) {
        console.warn(`[ReactLM Debug] Found ReactLM element potentially blocking at ${point.name}!`);
      }
    }
  });
}

// Export for both CommonJS/ESM and IIFE builds
// The IIFE build will automatically create window.ReactLM from this export
export default {
  init
};

export { init };