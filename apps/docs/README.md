# React LLM Documentation

This is the official documentation site for React LLM, built with [Fumadocs](https://fumadocs.vercel.app/).

## Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## Structure

- `content/docs/` - All documentation content (MDX files)
- `src/app/` - Next.js app router pages
- `src/components/` - Reusable components
- `src/components/ui/` - UI components (shadcn/ui style)

## Content Organization

The documentation is organized into the following sections:

1. **Getting Started** - Quick setup and installation
2. **Installation** - Detailed setup guides for different environments
3. **Configuration** - API keys, models, and advanced settings
4. **Features** - Core functionality explanations
5. **Guides** - Workflows and best practices
6. **API Reference** - Complete API documentation
7. **Examples** - Code examples and use cases

## Adding Content

1. Create new MDX files in `content/docs/`
2. Update `content/docs/meta.json` to add navigation
3. Run `pnpm dev` to see changes

## Interactive Components

The documentation includes several interactive components:

- `InteractiveDemo` - Live code examples with preview
- `ModelComparison` - Compare different AI models
- `APIExplorer` - Interactive API documentation

## Deployment

The documentation site is deployed automatically on push to main branch.

- **Staging**: [docs-staging.react-llm.dev](https://docs-staging.react-llm.dev)
- **Production**: [docs.react-llm.dev](https://docs.react-llm.dev)