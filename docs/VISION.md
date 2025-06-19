# react llm vision

## engineering truth

react llm brings ai chat directly into the browser for react developers. no extensions. no external tools. just a conversation with your components where they live.

## core principle

the browser is already where development happens. we're just making it conversational.

## two modes of operation

### development mode
**what it does**: lets you modify code through chat

- click any component to select it
- describe the change you want
- see updates via hot module replacement
- direct file system access for instant saves
- no context switching between browser and editor

**technical requirements**:
- file system access api
- websocket connection to dev server
- source maps for code location
- ast parsing for modifications

### production mode
**what it does**: lets you explore any website's components

- understand how components are built
- save patterns you find interesting
- learn implementation approaches
- works with minified code
- export discoveries for your own use

**technical requirements**:
- react fiber traversal
- heuristic component detection
- runtime data reconstruction
- pattern recognition

## technical architecture

### data flow
```
user click
    ↓
bippy fiber traversal
    ↓
component extraction
    ↓
context assembly
    ↓
LLM processing
    ↓
code generation
    ↓
file system write (dev) or display (prod)
```

### key technologies

**bippy** - react fiber instrumentation
- ~5kb minified
- production-safe
- reads component trees
- extracts props and state

**openrouter** - unified LLM access
- single api for all models
- automatic failover
- streaming responses
- cost optimization

**opfs** - browser file system
- high-performance storage
- worker-accessible
- persistent across sessions
- no server required

### system design

```
browser window
├── website (react app)
├── shadow dom (ui isolation)
│   └── chat interface
├── web workers
│   ├── render worker
│   └── analysis worker
└── browser apis
    ├── opfs
    ├── file system access
    └── indexeddb
```

## constraints by design

### what we do
- react components only
- browser-native only
- visual selection only
- local data only

### what we don't do
- other frameworks
- server-side processing
- command-line interfaces
- cloud storage

these constraints make react llm focused and excellent at its core purpose.

## quality metrics

### performance
- component selection: <100ms response
- ai response start: <500ms
- zero impact when inactive
- <50mb memory usage

### developer experience
- one-line setup
- no configuration required
- works on first click
- natural language interaction

### code quality
- generated code matches project style
- respects existing patterns
- maintains type safety
- includes necessary imports

## open questions

1. should component selection work in react native?
2. how do we handle server components?
3. what's the best way to detect component boundaries in production?
4. should we support typescript-first workflows?

## engineering philosophy

good tools do one thing well. react llm does one thing: it makes react components conversational. every decision flows from this singular focus.

we measure success not in users or stars, but in moments where a developer thinks "that was exactly what i wanted" after describing a change and seeing it happen.