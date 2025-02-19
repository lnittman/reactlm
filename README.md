# React LLM

A floating chat interface for React apps powered by Google's Gemini AI. Get instant AI assistance for your codebase during development.

## Features

- 🎯 Simple script tag integration
- 💬 Floating chat interface
- 🤖 Powered by Gemini AI
- 🔒 Secure - runs only in development
- 🎨 Modern, minimal UI
- 📱 Draggable interface
- 🔍 Codebase-aware responses

## Quick Start

1. Add the script to your React app's HTML:

```html
<script src="https://unpkg.com/react-llm@latest/dist/index.js"></script>
```

2. Initialize with your Gemini API key:

```html
<script>
  window.ReactLLM.init({
    apiKey: 'your-gemini-api-key'
  });
</script>
```

That's it! You'll see a floating chat interface appear in your app during development.

## Development

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## License

MIT
