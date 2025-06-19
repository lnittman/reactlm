# react llm documentation style guide

## core principles

1. **engineering truth over marketing language**
   - say what it does, not how amazing it is
   - focus on technical facts
   - avoid superlatives

2. **constraints breed creativity**
   - define what we don't do
   - explain why we chose specific limitations
   - celebrate focus over features

3. **democratic design**
   - remove friction and jargon
   - make it approachable to all developers
   - prioritize clarity over cleverness

4. **lowercase throughout**
   - all text in lowercase
   - including headings and navigation
   - creates visual consistency

## language guidelines

### use
- simple, direct sentences
- technical accuracy
- concrete examples
- engineering terminology when precise

### avoid
- marketing speak ("transform", "revolutionary", "seamless")
- emojis and decorative elements
- centered text or badges
- growth metrics (stars, downloads)
- feature lists without depth

## structure patterns

### document structure
```
# title

## what it is
one sentence of engineering truth

## how it works
technical explanation with examples

## constraints
what we chose not to do and why

## setup
minimal steps to get started

## details
deeper technical information
```

### code examples
- show real, working code
- include context when needed
- prefer simplicity over cleverness
- use consistent style

## visual identity

### typography
- single font: tx-02 mono
- left-aligned text
- consistent spacing
- no decorative fonts

### indicators
- use text characters: •, ⊹, →, ↓
- no emoji icons
- no image assets
- functional over decorative

### color
- maximum 6 colors total
- monochrome base
- single accent color
- high contrast for readability

## writing checklist

before publishing any documentation:

- [ ] all text is lowercase
- [ ] no emojis or badges
- [ ] no marketing language
- [ ] constraints are clearly defined
- [ ] examples are minimal and clear
- [ ] technical accuracy verified
- [ ] no unnecessary adjectives
- [ ] focused on one clear purpose

## examples

### good
```
react llm lets you chat with react components in the browser.
```

### bad
```
React LLM transforms your development workflow with seamless AI integration! 🚀
```

### good
```
## constraints
- react only (not vue or angular)
- browser only (not a server)
- visual selection (not commands)
```

### bad
```
## Features
✨ Support for React, Vue, Angular, and more!
🌐 Works everywhere - browser, server, mobile!
⚡ Lightning-fast performance!
```

## philosophy

every piece of documentation should make react llm more approachable and honest. we're not selling anything. we're sharing a tool that does one thing well: it makes react components conversational.

the best documentation helps developers understand quickly and get back to building.