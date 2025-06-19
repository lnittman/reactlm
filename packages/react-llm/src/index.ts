/** @jsx h */
import { h, render } from 'preact';
import { Toolbar } from './components/Toolbar';
import { initGemini } from './gemini/gemini';

interface ReactLLMGlobal {
  init: (apiKey: string) => void;
}

declare global {
  interface Window {
    ReactLLM: ReactLLMGlobal;
  }
}

const init = async (apiKey: string) => {
  try {
    // Create container with shadow DOM
    const container = document.createElement('div');
    container.id = 'react-llm-root';
    document.body.appendChild(container);

    // Create shadow root
    const shadow = container.attachShadow({ mode: 'open' });
    const root = document.createElement('div');
    shadow.appendChild(root);

    // Initialize Gemini
    await initGemini({ apiKey });

    // Render Toolbar in shadow DOM
    render(h(Toolbar, {}), root);
    
    console.log('React-LLM initialized successfully');
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
