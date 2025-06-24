# Components Directory

This directory contains all UI components for React LLM.

## Component Overview

### Toolbar Component (`Toolbar.tsx`)
**Status**: Active - Main UI component  
**Lines**: 481  
**Purpose**: Primary chat interface that users interact with

#### Key Features:
1. **Chat Session Management**
   - Create new chat sessions
   - Switch between sessions
   - Delete sessions
   - Edit session titles

2. **Message Handling**
   - Display user and assistant messages
   - Render markdown content
   - Show relevant files, documentation links, and suggestions
   - Loading and error states

3. **Database Integration**
   - Initializes SQLite database on mount
   - Persists all chat data
   - Loads historical sessions

4. **UI Features**
   - Minimizable interface
   - Custom styling with IosevkaTerm font
   - Shadow DOM encapsulation
   - Responsive design

#### State Management:
Uses Preact Signals for reactive state:
```typescript
const isInitializing = useSignal(true);
const isVisible = useSignal(false);
const isMinimized = useSignal(false);
const chatSessions = useSignal<ChatSession[]>([]);
const activeChatId = useSignal<string | null>(null);
const inputValue = useSignal('');
const editingTitle = useSignal('');
const activeTab = useSignal<ContentTab>('chat');
const projectInfo = useSignal<ProjectInfo | null>(null);
```

#### Lifecycle:
1. On mount: Initialize database and load existing sessions
2. On chat change: Load messages for the selected session
3. On submit: Send message to Gemini and save response

### Toolbar Styles (`Toolbar.styles.ts`)
**Lines**: 572  
**Purpose**: Comprehensive styling for the Toolbar component

#### Style Categories:
1. **Layout Styles**
   - Fixed positioning at bottom-right
   - Flexbox layouts for content organization
   - Responsive sizing

2. **Theme**
   - Dark theme with transparency
   - Custom monospace font (IosevkaTerm)
   - Blur effects for modern look

3. **Component Styles**
   - Messages (user vs assistant)
   - Input areas and buttons
   - Loading animations
   - File/documentation cards
   - Dropdown menus

4. **Animations**
   - Fade-in effects for messages
   - Loading dot animations
   - Hover transitions

### ChatInterface Component (`ChatInterface.tsx`)
**Status**: Unused - Alternative implementation  
**Lines**: 152  
**Purpose**: Simpler chat UI without database persistence

#### Features:
- Basic message display
- Input handling
- Loading states
- Direct Gemini integration

#### Why Unused:
- Lacks persistence features
- No session management
- Simpler UI without tabs/sections
- Was likely an early prototype

### ChatInterface Styles (`ChatInterface.styles.ts`)
**Status**: Unused  
**Lines**: 64  
**Purpose**: Styles for the unused ChatInterface component

## Component Architecture

### Rendering Strategy
1. Components use Preact (lightweight React alternative)
2. JSX pragma: `/** @jsx h */`
3. Shadow DOM for style isolation
4. Functional components with hooks

### Data Flow
1. User input → Signal update
2. Signal change → Component re-render
3. API call → Database save → UI update

### Error Handling
- Try-catch blocks around async operations
- Error messages displayed in UI
- Fallback states for failed operations

## Styling Philosophy

1. **Isolation**: All styles scoped to Shadow DOM
2. **Consistency**: Single source of truth in `.styles.ts` files
3. **Performance**: CSS-in-JS compiled at build time
4. **Maintainability**: Organized by component sections

## Future Improvements

1. **Component Splitting**
   - Extract message list into separate component
   - Create reusable input component
   - Separate session management UI

2. **Accessibility**
   - Add ARIA labels
   - Keyboard navigation
   - Screen reader support

3. **Testing**
   - Unit tests for component logic
   - Integration tests for user flows
   - Visual regression tests

## Usage Example

The Toolbar component is initialized from the main entry point:

```typescript
// In src/index.ts
render(h(Toolbar, {}), root);
```

No props are passed - all state is managed internally with signals.