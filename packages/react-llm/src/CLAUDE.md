# Source Code Directory

This directory contains all the TypeScript source code for React LLM.

## Directory Structure

```
src/
├── index.ts                 # Entry point - initializes Shadow DOM and Gemini
├── types.ts                 # Main type definitions for the application
├── components/              # UI components
│   ├── Toolbar.tsx         # Main chat interface component
│   ├── Toolbar.styles.ts   # Styles for the toolbar
│   ├── ChatInterface.tsx   # Alternative chat UI (currently unused)
│   └── ChatInterface.styles.ts
├── db/                     # Database layer
│   ├── database.ts         # SQLite operations and persistence logic
│   └── schema.ts           # Database schema definitions
├── gemini/                 # AI integration
│   └── gemini.ts          # Gemini API client and response handling
├── utils/                  # Utility functions
│   ├── codebase.ts        # File system scanning for codebase analysis
│   ├── dom.ts             # Shadow DOM creation utilities
│   └── repomix-runner.ts  # RepoMix integration (unused)
└── types/                  # Additional type definitions
    └── index.ts           # Legacy types (being phased out)
```

## Key Components

### Entry Point (`index.ts`)
- Exports the `init` function that starts the application
- Creates Shadow DOM container to isolate styles
- Initializes Gemini AI client with API key
- Renders the Toolbar component
- Sets up global `window.ReactLLM` object

### Main UI (`components/Toolbar.tsx`)
The heart of the application - a 481-line component that handles:
- Chat session management
- Message history with persistence
- Real-time AI responses
- Structured response rendering
- Loading and error states
- Minimizable interface

Uses Preact Signals for state management:
- `isInitializing`: Loading state
- `chatSessions`: Array of chat sessions
- `activeChatId`: Currently selected chat
- `inputValue`: User input field
- `projectInfo`: Project metadata

### Database Layer (`db/`)
Provides persistent storage using SQLite WASM:
- **Schema**: Defines 6 tables with proper relationships
- **Operations**: CRUD operations with error handling
- **Persistence**: Uses OPFS when available, falls back to memory

### AI Integration (`gemini/`)
Manages communication with Google's Gemini AI:
- Initializes AI client with API key
- Sends structured prompts for better responses
- Parses responses into structured data
- Implements caching for performance
- Debug logging for development

### Utilities (`utils/`)
Helper functions for various tasks:
- **dom.ts**: Creates Shadow DOM with proper styling
- **codebase.ts**: Scans project files (localhost only)
- **repomix-runner.ts**: Runs RepoMix for context generation

## Styling Approach

- All styles are defined in TypeScript files
- Injected into Shadow DOM to avoid conflicts
- Uses CSS-in-JS pattern for component styles
- Custom IosevkaTerm font for monospace text
- Dark theme with transparency effects

## State Management

The application uses Preact Signals for reactive state:
- No props drilling - signals are accessed directly
- Automatic re-renders on state changes
- Effects for side effects (database operations)
- Computed values derived from signals

## Type Safety

- Strict TypeScript configuration
- Comprehensive type definitions
- Proper null/undefined handling
- Type guards for runtime safety

## Performance Considerations

1. **Lazy Loading**: Chat messages loaded on demand
2. **Caching**: Initial analysis cached in localStorage
3. **Batch Operations**: Database writes are batched
4. **Memoization**: Expensive computations are cached

## Development Notes

- The `ChatInterface` component is an alternative UI that's not currently used
- The `types/index.ts` file contains legacy types being migrated to `types.ts`
- Debug logging can be enabled by setting `DEBUG = true` in `gemini.ts`
- The repomix-runner utility was intended for Node.js but isn't used in the browser