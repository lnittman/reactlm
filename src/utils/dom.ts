export function createShadowContainer(): HTMLElement {
  // Create the container element
  const container = document.createElement('div');
  container.id = 'react-llm-toolbar';
  
  // Create shadow DOM
  const shadow = container.attachShadow({ mode: 'open' });
  
  // Create styles
  const style = document.createElement('style');
  style.textContent = `
    :host {
      all: initial;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 14px;
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
    }

    * {
      box-sizing: border-box;
    }

    button {
      font-family: inherit;
    }

    textarea {
      font-family: inherit;
      outline: none;
    }

    textarea:focus {
      box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.1);
    }

    ::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    ::-webkit-scrollbar-track {
      background: #2a2a2a;
    }

    ::-webkit-scrollbar-thumb {
      background: #4a4a4a;
      border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: #5a5a5a;
    }
  `;

  // Create a div for Preact to render into
  const root = document.createElement('div');
  
  // Add style and root element to shadow DOM
  shadow.appendChild(style);
  shadow.appendChild(root);
  
  // Add container to document
  document.body.appendChild(container);
  
  return root;
}
