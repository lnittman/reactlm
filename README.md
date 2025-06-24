<img src="apps/web/public/logo.png" alt="reactlm logo" width="48" height="48" align="left">

# reactlm

browser-native ai coding assistant. chat with your components directly in the browser.

## what it is

reactlm adds ai chat to any website. click components to add them to context. describe changes in plain language. see updates instantly in development or explore components in production.

## how it works

```
website → bippy (react fiber access) → component context → LLM → code changes
```

1. bippy traverses react fiber tree to find components
2. canvas overlay renders component boundaries
3. selected components provide context to ai
4. LLM generates code modifications or explanations
5. file system api applies changes in development

## setup

```html
<script src="https://unpkg.com/reactlm"></script>
<script>
  ReactLM.init({ 
    providers: { openrouter: 'sk-or-...' }
  });
</script>
```

or with npm:

```bash
npm install reactlm
```

## constraints

what reactlm is:
- browser-native (no extensions)
- react-focused (not vue or angular)
- visual-first (click, don't type)
- local-first (your data stays yours)

what reactlm is not:
- a code generator from scratch
- a full ide replacement
- a testing framework
- a deployment tool

## development

```bash
git clone https://github.com/lnittman/reactlm
cd reactlm
pnpm install
pnpm dev
```

### structure

```
packages/
├── reactlm/       # core library
├── next/          # next.js plugin  
├── vite/          # vite plugin
└── browser-extension/  # browser extension
apps/
├── web/           # marketing site
└── docs/          # documentation
```

### contributing

1. pick a constraint (we believe constraints breed creativity)
2. solve one problem well
3. submit a pull request
4. include tests

## philosophy

we believe great tools come from engineering truth, not marketing promises. reactlm does one thing: it lets you chat with your react components. we chose specific constraints to do this one thing exceptionally well.

## license

mit