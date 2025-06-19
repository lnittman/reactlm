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
  mode?: 'development' | 'production';
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
    if (normalizedConfig.providers?.openrouter || normalizedConfig.apiKey) {
      await hub.initializeProvider('openrouter', 
        normalizedConfig.providers?.openrouter || normalizedConfig.apiKey!, 
        {
          siteUrl: normalizedConfig.siteUrl,
          siteName: normalizedConfig.siteName
        }
      );
    }
    
    // Store hub globally for debugging
    window.ReactLLM.hub = hub;

    // Render Toolbar in shadow DOM with hub
    render(h(Toolbar, { hub }), root);
    
    console.log('React-LLM initialized successfully with providers:', Object.keys(normalizedConfig.providers || {}));
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
