# react llm - physical intelligence design update

## key changes to match physical intelligence aesthetic

### 1. navigation restructure
- removed full-width navigation bar
- logo and nav links now on same line within content column
- navigation is part of the main container, not separate
- simple underlined links instead of buttons

### 2. hard left alignment
- container margin-left: 80px (was 120px)
- max-width: 620px (was 768px) for tighter column
- consistent left margin throughout entire page
- no centered content

### 3. uniform spacing
- all sections use `padding: 0 0 var(--spacing-3xl) 0`
- consistent spacing between all content blocks
- removed variable padding and margins
- header and footer follow same spacing rules

### 4. minimal styling
- removed featured section backgrounds
- simplified code blocks with subtle border
- action list items now just bullet points with hover opacity
- removed all decorative elements
- h2 headers smaller (1.25rem) with bullet prefix
- h3 headers lowercase without special styling

### 5. typography
- consistent use of tx-02 mono throughout
- removed uppercase text except nav links
- simplified font sizes and weights
- better line height consistency

### 6. interaction
- subtle opacity changes on hover (0.7)
- removed background color changes
- 200ms transitions for smoothness
- minimal visual feedback

### 7. content structure
- semantic html with section tags
- simplified intro paragraph
- footer matches physical intelligence style
- removed marketing language

## result

the page now has the ultra-minimal, hard left-aligned aesthetic of physical intelligence with:
- clear information hierarchy
- no unnecessary decoration
- consistent spacing throughout
- focus on content over styling
- engineering-first presentation

the development server at http://localhost:3001 shows a clean, minimal page that matches the reference site's aesthetic while maintaining react llm's identity.