# Development Workflow

## Quick Start

```bash
# Install dependencies
pnpm install

# Build react-llm package first (required)
pnpm build:react-llm

# Run development servers
pnpm dev:apps     # Run both web and docs sites
pnpm dev:web      # Run only marketing site (port 3000)
pnpm dev:docs     # Run only documentation site (port 3001)
```

## Available Commands

### Root Level Commands

- `pnpm dev` - Run all packages except browser extension
- `pnpm dev:all` - Run all packages including browser extension
- `pnpm dev:web` - Run marketing website only
- `pnpm dev:docs` - Run documentation site only
- `pnpm dev:apps` - Run both web and docs together
- `pnpm dev:react-llm` - Run react-llm in watch mode
- `pnpm dev:extension` - Run browser extension (requires react-llm built)
- `pnpm build` - Build all packages
- `pnpm build:react-llm` - Build react-llm package only

### React LLM Integration

The marketing website (`apps/web`) automatically includes React LLM:

1. On build, it copies `react-llm.global.js` to the public directory
2. The script loads on every page via `ReactLLMLoader` component
3. Configure with environment variable:
   ```bash
   # Create .env.local in apps/web/
   NEXT_PUBLIC_OPENROUTER_API_KEY=sk-or-v1-your-key-here
   ```

### Browser Extension Development

```bash
# Build react-llm first
pnpm build:react-llm

# Build extension
cd packages/browser-extension
pnpm build

# Or run in watch mode
pnpm dev:extension
```

### Common Issues

1. **react-llm.js not found**: Run `pnpm build:react-llm` first
2. **Browser extension build fails**: Ensure react-llm is built first
3. **Port conflicts**: Web runs on 3000, docs on 3001

## Architecture

- `packages/react-llm` - Core library (must be built first)
- `packages/next` - Next.js plugin
- `packages/vite` - Vite plugin  
- `packages/browser-extension` - Chrome/Firefox extension
- `apps/web` - Marketing website with live demo
- `apps/docs` - Documentation site (Fumadocs)