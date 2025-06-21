# React LLM Usage Guide

React LLM is a **standalone** browser tool that works on ANY website - no backend required!

## Quick Start (Any Website)

```html
<!-- Add to any HTML page -->
<script src="https://unpkg.com/react-llm/dist/react-llm.js"></script>
<script>
  // Option 1: Demo Mode (no API key needed)
  ReactLLM.init({
    mode: 'demo'
  });
  
  // Option 2: With Your API Key
  ReactLLM.init({
    providers: {
      openrouter: 'sk-or-your-key-here'
    }
  });
  
  // Option 3: With Server Proxy (if you have one)
  ReactLLM.init({
    apiEndpoint: 'https://your-server.com/api/chat'
  });
</script>
```

## Features

- 🎯 **Zero Backend** - Works entirely in the browser
- 🤖 **Multi-Model** - GPT-4, Claude, Gemini, and 100+ models
- 🎨 **Component Aware** - Understands your React components
- 💬 **Floating Chat** - Non-intrusive UI
- 🔒 **Secure** - API keys never leave your browser

## Configuration Options

```javascript
ReactLLM.init({
  // Mode
  mode: 'demo' | 'production' | 'development',
  
  // Position
  position: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left',
  
  // Theme
  theme: 'dark' | 'light',
  
  // Direct API Keys (optional)
  providers: {
    openrouter: 'sk-or-...',
    openai: 'sk-...',
    anthropic: 'sk-ant-...'
  },
  
  // Or use a proxy endpoint (optional)
  apiEndpoint: '/api/chat'
});
```

## Demo Mode

When initialized without API keys, React LLM runs in demo mode:
- Shows example responses
- Demonstrates UI and features
- Provides setup instructions

## Production Use

For production, you have two options:

### Option 1: Direct API Keys (Client-Side)
```javascript
ReactLLM.init({
  providers: {
    openrouter: 'sk-or-your-key'
  }
});
```
⚠️ Note: API keys are visible in browser. Use restricted keys or proxy for production.

### Option 2: Server Proxy (Recommended)
```javascript
ReactLLM.init({
  apiEndpoint: 'https://your-api.com/chat'
});
```
Your server handles API keys securely.

## Examples

### On a React App
```html
<script src="/react-llm.js"></script>
<script>
  ReactLLM.init({ mode: 'demo' });
</script>
```

### On a Static Site
```html
<script src="https://unpkg.com/react-llm"></script>
<script>
  ReactLLM.init({ 
    providers: { openrouter: 'your-key' },
    theme: 'light'
  });
</script>
```

### With Next.js (Client Component)
```tsx
'use client';
import Script from 'next/script';

export function ReactLLMLoader() {
  return (
    <Script
      src="/react-llm.js"
      onLoad={() => {
        window.ReactLLM.init({ mode: 'demo' });
      }}
    />
  );
}
```

## No Backend Required! 🎉

React LLM is designed to work without any server-side code. Just include the script and initialize - that's it!