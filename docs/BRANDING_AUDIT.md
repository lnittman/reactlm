# react llm branding audit

## current state vs teenage engineering philosophy

### language analysis

#### current issues:
- **marketing speak**: "transform", "paradigm shift", "comprehensive", "seamless"
- **emoji overload**: ✨🚀🎯💬🔧 throughout documentation
- **superlatives**: "amazing", "beautiful", "powerful"
- **growth metrics**: github stars, npm downloads, user counts
- **feature overload**: long lists without depth

#### teenage engineering approach:
- speak truth about engineering
- remove decorative language
- focus on what it does, not how amazing it is
- quality metrics over quantity metrics
- depth over breadth

### visual identity

#### current issues:
- centered text and badges
- multiple fonts referenced
- decorative elements (logos, icons)
- conventional open source aesthetic
- uppercase text throughout

#### teenage engineering approach:
- left-aligned, utilitarian layout
- single font (tx-02 mono)
- text-based indicators (•, ⊹, →)
- engineering-first aesthetic
- lowercase throughout

### content structure

#### current issues:
- feature-first approach
- quick adoption focus
- broad capability claims
- conventional sections (features, installation, etc.)

#### teenage engineering approach:
- problem-first approach
- thoughtful integration focus
- constrained, focused capabilities
- engineering-driven sections

## specific document changes needed

### README.md
- remove all badges and centered content
- eliminate emojis
- rewrite in lowercase
- focus on engineering problem being solved
- remove growth metrics
- simplify to essential information

### VISION.md
- replace "transform" language with engineering facts
- remove competitive comparisons
- focus on technical architecture
- eliminate success metrics based on adoption
- reframe around quality of experience

### IMPLEMENTATION_PLAN.md
- remove agent structure (too complex)
- focus on core engineering challenges
- eliminate timeline pressure
- reframe success as technical excellence
- simplify to essential features

### CLAUDE.md
- already well-structured but needs lowercase
- remove decorative elements
- focus more on constraints
- eliminate "comprehensive" claims

## new content structure

### engineering-first sections:
1. **what it is**: one sentence of truth
2. **how it works**: technical explanation
3. **constraints**: what we chose not to do
4. **setup**: minimal steps
5. **development**: contribution guide

### removal list:
- all emojis
- all badges
- all centered text
- all marketing language
- all growth metrics
- all decorative elements
- all uppercase text

## implementation checklist

- [ ] rewrite README.md with engineering focus
- [ ] update VISION.md to remove marketing language
- [ ] simplify IMPLEMENTATION_PLAN.md to core features
- [ ] lowercase all documentation
- [ ] remove all emojis
- [ ] create consistent left-aligned layout
- [ ] focus on constraints and trade-offs
- [ ] eliminate superlatives and adjectives
- [ ] reframe metrics around quality
- [ ] add engineering diagrams where helpful

## guiding principle

> "we believe in the democracy of design. good design should be available to many. design should not be used to reinforce the status, but to break it down."

every documentation change should make react llm more approachable, more honest, and more focused on its engineering truth: it's a tool that lets you chat with your code in the browser. nothing more, nothing less.