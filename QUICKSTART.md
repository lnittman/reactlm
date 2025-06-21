# Quick Start

## One Command Setup

```bash
pnpm install && pnpm dev
```

That's it! 🎉

## What Happens

1. `pnpm install` - Installs dependencies AND builds react-llm automatically
2. `pnpm dev` - Starts all dev servers with react-llm already integrated

## See It In Action

1. Open http://localhost:3000
2. Look for the React LLM chat bubble in the bottom-right corner
3. Start chatting! (Demo mode shows setup instructions)

## Enable Full Features

To use with real AI models:

1. Get your OpenRouter API key from https://openrouter.ai/keys
2. Add to `apps/web/.env.local`:
   ```
   OPENROUTER_API_KEY=your-actual-key
   ```
3. Restart dev server

## Available Commands

- `pnpm dev` - Run web app with React LLM
- `pnpm dev:docs` - Run documentation site
- `pnpm dev:web` - Run only the web app
- `pnpm dev:apps` - Run both web and docs

## Troubleshooting

If React LLM doesn't appear:
1. Check browser console for errors
2. Ensure port 3000 is free
3. Try `pnpm build:react-llm` then `pnpm dev`