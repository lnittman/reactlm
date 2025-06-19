# react llm implementation

## objective

build a browser-native tool that lets developers chat with react components.

## core features

### 1. component selection
click any element to select its react component. uses bippy for fiber tree access.

### 2. conversational interface
chat interface in shadow dom. describe changes in plain language.

### 3. code modification
development mode: write changes directly to files
production mode: show code examples

### 4. multi-model support
openrouter integration for model choice. fetch available models dynamically.

## technical decisions

**react instrumentation**: bippy
- proven library for fiber access
- small footprint (~5kb)
- production safe

**ui isolation**: shadow dom
- prevents style conflicts
- self-contained interface
- works on any site

**LLM integration**: openrouter
- unified api for all providers
- no vendor lock-in
- streaming support

**storage**: opfs + sqlite wasm
- browser-native persistence
- no server required
- fast and reliable

**file editing**: file system access api
- direct local file access
- no download/upload cycle
- instant saves

## architecture

```
src/
├── index.ts          # entry point
├── selection/        # component selection
│   ├── bippy.ts     # fiber traversal
│   └── overlay.ts   # visual highlighting
├── chat/            # conversation ui
│   ├── interface.tsx # preact components
│   └── styles.ts    # shadow dom styles
├── llm/             # AI integration
│   ├── openrouter.ts # api client
│   └── context.ts   # prompt building
├── storage/         # persistence
│   ├── database.ts  # sqlite operations
│   └── schema.sql   # table definitions
└── editor/          # code modification
    ├── parser.ts    # ast operations
    └── writer.ts    # file system access
```

## implementation phases

### phase 1: foundation
- integrate bippy for component access
- basic click-to-select interface
- shadow dom ui setup
- openrouter connection

### phase 2: conversation
- chat interface with history
- component context extraction
- streaming LLM responses
- sqlite persistence

### phase 3: code editing
- file system access integration
- ast-based code modification
- hot reload coordination
- undo/redo support

### phase 4: polish
- visual selection overlay
- keyboard shortcuts
- error handling
- performance optimization

## constraints and trade-offs

### what we build
- react only (not vue or angular)
- browser only (not a vscode extension)
- visual first (not command based)
- local only (not cloud synced)

### why these constraints
- focus enables excellence
- react has the largest ecosystem
- browser is where development happens
- privacy and performance matter

## success criteria

### technical
- selection response under 100ms
- no performance impact when inactive
- works on any react site
- handles minified production code

### user experience
- one-line installation
- zero configuration
- natural conversation flow
- accurate code generation

## development approach

1. start with the smallest useful feature
2. test on real-world sites early
3. optimize for developer experience
4. maintain backward compatibility
5. document as we build

## risks and mitigations

### risk: react version compatibility
mitigation: test across react 16.8+ with automated suite

### risk: production build obfuscation
mitigation: heuristic component detection with fallbacks

### risk: LLM response quality
mitigation: carefully crafted prompts with examples

### risk: performance impact
mitigation: lazy loading, web workers, inactive state optimization

## next steps

1. set up monorepo structure
2. integrate bippy and test component selection
3. build minimal chat interface
4. connect openrouter for LLM access
5. implement file system access
6. iterate based on real usage