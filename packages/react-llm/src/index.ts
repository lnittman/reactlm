/** @jsx h */
import { h, render } from 'preact';
import { Toolbar } from './components/Toolbar';
import { LLMHub } from './llm/providers';

interface ReactLLMConfig {
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
  // Legacy support
  apiKey?: string;
}

interface ReactLLMGlobal {
  init: (config: ReactLLMConfig | string) => void;
  hub?: LLMHub;
}

declare global {
  interface Window {
    ReactLLM: ReactLLMGlobal;
  }
}

const init = async (config: ReactLLMConfig | string) => {
  try {
    // Handle legacy string API key format
    const normalizedConfig: ReactLLMConfig = typeof config === 'string' 
      ? { providers: { openrouter: config } }
      : config;

    // Create container with shadow DOM
    const container = document.createElement('div');
    container.id = 'react-llm-root';
    document.body.appendChild(container);

    // Create shadow root
    const shadow = container.attachShadow({ mode: 'open' });
    const root = document.createElement('div');
    shadow.appendChild(root);

    // Initialize LLM Hub
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
    
    // Store hub globally for debugging
    window.ReactLLM.hub = hub;

    // Pass config to Toolbar
    render(h(Toolbar, { 
      hub,
      config: normalizedConfig 
    }), root);
    
    console.log('React-LLM initialized successfully in', normalizedConfig.apiEndpoint ? 'API mode' : 'direct mode');
  } catch (error) {
    console.error('Failed to initialize React-LLM:', error);
    throw error;
  }
};

// Explicitly set up global object
window.ReactLLM = {
  init
};

export { init };
