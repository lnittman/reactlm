# Agent 1: Styling Synchronization System
*"Unify the visual language between marketing site and core library with a modern, scalable design system"*

## Scope

This agent will create a unified styling system that bridges the gap between the Tailwind-based marketing site (apps/web) and the CSS-in-JS React LLM library (packages/react-llm), while maintaining Shadow DOM isolation and supporting Preact's constraints.

### Key Objectives
1. Extract and standardize design tokens from apps/web
2. Create a hybrid styling solution compatible with Shadow DOM
3. Implement the modern LLM chat interface design
4. Ensure visual consistency across all components
5. Support both light and dark themes

## Packages to Modify

- `packages/react-llm/src/components/Toolbar.styles.ts` - Complete rewrite with new design system
- `packages/react-llm/src/components/*.tsx` - Update all components to use new styling approach
- `packages/react-llm/src/styles/` - New directory for design system
  - `tokens.ts` - Design tokens (colors, spacing, typography)
  - `utilities.ts` - Shared styling utilities
  - `theme.ts` - Theme configuration
- `apps/web/src/styles/` - Extract reusable tokens for sharing
- `packages/react-llm/package.json` - Add styling dependencies if needed

## Implementation Details

### 1. Design Token Extraction and Standardization

Create a unified token system that can be used in both Tailwind and CSS-in-JS:

```typescript
// packages/react-llm/src/styles/tokens.ts
export const tokens = {
  colors: {
    // Extract from apps/web globals.css
    black: {
      100: 'rgba(0, 0, 0, 1)',
      90: 'rgba(0, 0, 0, 0.9)',
      80: 'rgba(0, 0, 0, 0.8)',
      // ... complete scale
    },
    white: 'rgba(255, 255, 255, 1)',
    gray: {
      10: 'rgba(245, 245, 245, 1)',
      20: 'rgba(235, 235, 235, 1)',
      // ... from --color-gray-* variables
    },
    blue: {
      50: '#E6F0FF',
      60: '#0066FF',
      70: '#0052CC',
    },
    // Status colors
    success: { /* ... */ },
    warning: { /* ... */ },
    error: { /* ... */ },
  },
  
  spacing: {
    xs: '4px',   // --spacing-xs
    sm: '8px',   // --spacing-sm
    md: '12px',  // --spacing-md
    lg: '16px',  // --spacing-lg
    xl: '24px',  // --spacing-xl
    '2xl': '32px', // --spacing-2xl
    '3xl': '48px', // --spacing-3xl
  },
  
  typography: {
    fonts: {
      mono: '"TX02Mono-Regular", "IosevkaTerm", monospace',
      sans: 'system-ui, -apple-system, sans-serif',
    },
    sizes: {
      xs: '11px',
      sm: '12px',
      base: '14px',
      lg: '16px',
      xl: '18px',
      '2xl': '24px',
    },
    weights: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  
  radii: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.15)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.2)',
  },
  
  transitions: {
    fast: '150ms ease-in-out',
    normal: '250ms ease-in-out',
    slow: '350ms ease-in-out',
  },
};

// Type-safe token access
export type ColorToken = keyof typeof tokens.colors;
export type SpacingToken = keyof typeof tokens.spacing;
```

### 2. Styling Utilities and Helpers

Create utilities that work within Shadow DOM constraints:

```typescript
// packages/react-llm/src/styles/utilities.ts
import { tokens } from './tokens';

// CSS-in-JS helper for responsive styles
export const responsive = (styles: {
  base?: string;
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
}) => {
  return `
    ${styles.base || ''}
    @media (min-width: 640px) { ${styles.sm || ''} }
    @media (min-width: 768px) { ${styles.md || ''} }
    @media (min-width: 1024px) { ${styles.lg || ''} }
    @media (min-width: 1280px) { ${styles.xl || ''} }
  `;
};

// Utility classes generator (Tailwind-inspired)
export const utils = {
  // Flexbox utilities
  flex: (direction = 'row', align = 'stretch', justify = 'flex-start') => `
    display: flex;
    flex-direction: ${direction};
    align-items: ${align};
    justify-content: ${justify};
  `,
  
  // Spacing utilities
  p: (size: SpacingToken) => `padding: ${tokens.spacing[size]};`,
  px: (size: SpacingToken) => `padding-left: ${tokens.spacing[size]}; padding-right: ${tokens.spacing[size]};`,
  py: (size: SpacingToken) => `padding-top: ${tokens.spacing[size]}; padding-bottom: ${tokens.spacing[size]};`,
  
  // Typography utilities
  text: (size: keyof typeof tokens.typography.sizes) => `
    font-size: ${tokens.typography.sizes[size]};
    line-height: ${tokens.typography.lineHeights.normal};
  `,
  
  // Visual utilities
  rounded: (size: keyof typeof tokens.radii) => `border-radius: ${tokens.radii[size]};`,
  shadow: (size: keyof typeof tokens.shadows) => `box-shadow: ${tokens.shadows[size]};`,
  
  // Animation utilities
  transition: (property = 'all', speed: keyof typeof tokens.transitions = 'normal') => `
    transition: ${property} ${tokens.transitions[speed]};
  `,
};

// Component-specific mixins
export const mixins = {
  button: (variant: 'primary' | 'secondary' | 'ghost' = 'primary') => {
    const base = `
      ${utils.flex('row', 'center', 'center')}
      ${utils.px('md')}
      ${utils.py('sm')}
      ${utils.text('sm')}
      ${utils.rounded('md')}
      ${utils.transition()}
      font-family: ${tokens.typography.fonts.mono};
      font-weight: ${tokens.typography.weights.medium};
      cursor: pointer;
      border: none;
      outline: none;
      position: relative;
      white-space: nowrap;
      
      &:focus-visible {
        outline: 2px solid ${tokens.colors.blue[60]};
        outline-offset: 2px;
      }
      
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    `;
    
    const variants = {
      primary: `
        background: ${tokens.colors.blue[60]};
        color: ${tokens.colors.white};
        
        &:hover:not(:disabled) {
          background: ${tokens.colors.blue[70]};
        }
      `,
      secondary: `
        background: ${tokens.colors.gray[20]};
        color: ${tokens.colors.black[90]};
        border: 1px solid ${tokens.colors.gray[30]};
        
        &:hover:not(:disabled) {
          background: ${tokens.colors.gray[30]};
        }
      `,
      ghost: `
        background: transparent;
        color: ${tokens.colors.gray[70]};
        
        &:hover:not(:disabled) {
          background: ${tokens.colors.gray[10]};
          color: ${tokens.colors.black[90]};
        }
      `,
    };
    
    return base + variants[variant];
  },
  
  input: () => `
    ${utils.p('md')}
    ${utils.text('base')}
    ${utils.rounded('md')}
    ${utils.transition()}
    font-family: ${tokens.typography.fonts.mono};
    background: ${tokens.colors.white};
    border: 1px solid ${tokens.colors.gray[30]};
    color: ${tokens.colors.black[90]};
    width: 100%;
    
    &:focus {
      outline: none;
      border-color: ${tokens.colors.blue[60]};
      box-shadow: 0 0 0 3px ${tokens.colors.blue[50]};
    }
    
    &::placeholder {
      color: ${tokens.colors.gray[50]};
    }
  `,
  
  card: () => `
    ${utils.p('lg')}
    ${utils.rounded('lg')}
    ${utils.shadow('md')}
    background: ${tokens.colors.white};
    border: 1px solid ${tokens.colors.gray[20]};
  `,
};
```

### 3. Theme System Implementation

Support for light/dark themes with CSS variables:

```typescript
// packages/react-llm/src/styles/theme.ts
export interface Theme {
  name: 'light' | 'dark';
  colors: {
    background: string;
    surface: string;
    surfaceHover: string;
    text: string;
    textSecondary: string;
    border: string;
    // ... etc
  };
}

export const themes = {
  light: {
    name: 'light',
    colors: {
      background: tokens.colors.white,
      surface: tokens.colors.gray[10],
      surfaceHover: tokens.colors.gray[20],
      text: tokens.colors.black[90],
      textSecondary: tokens.colors.gray[60],
      border: tokens.colors.gray[30],
      primary: tokens.colors.blue[60],
      primaryHover: tokens.colors.blue[70],
    },
  },
  dark: {
    name: 'dark',
    colors: {
      background: tokens.colors.black[90],
      surface: 'rgba(255, 255, 255, 0.05)',
      surfaceHover: 'rgba(255, 255, 255, 0.1)',
      text: 'rgba(255, 255, 255, 0.9)',
      textSecondary: 'rgba(255, 255, 255, 0.6)',
      border: 'rgba(255, 255, 255, 0.1)',
      primary: tokens.colors.blue[60],
      primaryHover: tokens.colors.blue[50],
    },
  },
} as const;

// Generate CSS variables from theme
export const generateThemeVars = (theme: Theme) => {
  return Object.entries(theme.colors)
    .map(([key, value]) => `--theme-${key}: ${value};`)
    .join('\n');
};
```

### 4. Updated Toolbar Styles

Complete rewrite using the new design system:

```typescript
// packages/react-llm/src/components/Toolbar.styles.ts
import { tokens, utils, mixins, generateThemeVars, themes } from '../styles';

export const createStyles = (theme: 'light' | 'dark' = 'dark') => {
  const currentTheme = themes[theme];
  
  return `
    /* Import TX02Mono font to match marketing site */
    @font-face {
      font-family: 'TX02Mono-Regular';
      src: url('https://your-cdn.com/fonts/TX02Mono-Regular.woff2') format('woff2');
      font-weight: 400;
      font-style: normal;
      font-display: swap;
    }
    
    /* Theme variables */
    :host {
      ${generateThemeVars(currentTheme)}
    }
    
    /* Reset and base styles */
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    /* Modern chat container matching top LLM interfaces */
    .toolbar {
      position: fixed;
      bottom: ${tokens.spacing.lg};
      right: ${tokens.spacing.lg};
      width: 420px;
      height: 600px;
      ${utils.rounded('xl')}
      ${utils.shadow('xl')}
      ${utils.flex('column')}
      background: var(--theme-background);
      border: 1px solid var(--theme-border);
      font-family: ${tokens.typography.fonts.mono};
      color: var(--theme-text);
      overflow: hidden;
      ${utils.transition('all', 'slow')}
      
      /* Responsive sizing */
      ${responsive({
        base: `
          width: calc(100vw - 32px);
          height: calc(100vh - 32px);
          bottom: 16px;
          right: 16px;
        `,
        sm: `
          width: 420px;
          height: 600px;
          bottom: ${tokens.spacing.lg};
          right: ${tokens.spacing.lg};
        `,
      })}
      
      &.minimized {
        width: 60px;
        height: 60px;
        cursor: pointer;
      }
    }
    
    /* Header - simplified without model name */
    .header {
      ${utils.flex('row', 'center', 'space-between')}
      ${utils.px('lg')}
      height: 48px;
      border-bottom: 1px solid var(--theme-border);
      background: var(--theme-surface);
      flex-shrink: 0;
    }
    
    .header-title {
      ${utils.text('base')}
      font-weight: ${tokens.typography.weights.semibold};
      color: var(--theme-text);
    }
    
    .header-actions {
      ${utils.flex('row', 'center', 'flex-end')}
      gap: ${tokens.spacing.sm};
    }
    
    /* Icon buttons with proper transitions */
    .icon-button {
      ${mixins.button('ghost')}
      width: 32px;
      height: 32px;
      padding: 0;
      ${utils.rounded('md')}
      
      svg {
        width: 18px;
        height: 18px;
        stroke: var(--theme-textSecondary);
        ${utils.transition('stroke')}
      }
      
      &:hover svg {
        stroke: var(--theme-text);
      }
    }
    
    /* Main content area */
    .content {
      flex: 1;
      overflow: hidden;
      position: relative;
    }
    
    /* Messages view */
    .messages {
      height: 100%;
      overflow-y: auto;
      ${utils.p('lg')}
      
      /* Custom scrollbar */
      &::-webkit-scrollbar {
        width: 6px;
      }
      
      &::-webkit-scrollbar-track {
        background: transparent;
      }
      
      &::-webkit-scrollbar-thumb {
        background: var(--theme-border);
        ${utils.rounded('full')}
        
        &:hover {
          background: var(--theme-textSecondary);
        }
      }
    }
    
    /* Message bubbles */
    .message {
      ${utils.flex('column')}
      gap: ${tokens.spacing.sm};
      margin-bottom: ${tokens.spacing.lg};
      
      &.user {
        align-items: flex-end;
      }
      
      &.assistant {
        align-items: flex-start;
      }
    }
    
    .message-content {
      ${utils.p('md')}
      ${utils.rounded('lg')}
      max-width: 85%;
      word-wrap: break-word;
      
      .user & {
        background: var(--theme-primary);
        color: ${tokens.colors.white};
      }
      
      .assistant & {
        background: var(--theme-surface);
        color: var(--theme-text);
        border: 1px solid var(--theme-border);
      }
    }
    
    /* Modern input area - like Claude/ChatGPT */
    .input-area {
      border-top: 1px solid var(--theme-border);
      background: var(--theme-surface);
      ${utils.flex('column')}
    }
    
    .input-form {
      ${utils.p('md')}
      padding-bottom: 0;
    }
    
    .input {
      ${mixins.input()}
      background: var(--theme-background);
      border-color: var(--theme-border);
      color: var(--theme-text);
      min-height: 44px;
      max-height: 120px;
      resize: vertical;
      
      /* Auto-expanding textarea styles */
      &.auto-expand {
        overflow: hidden;
        resize: none;
      }
    }
    
    .input-controls {
      ${utils.flex('row', 'center', 'space-between')}
      ${utils.px('md')}
      ${utils.py('sm')}
      gap: ${tokens.spacing.sm};
    }
    
    .control-left {
      ${utils.flex('row', 'center')}
      gap: ${tokens.spacing.xs};
    }
    
    .control-icon-button {
      ${mixins.button('ghost')}
      padding: ${tokens.spacing.xs} ${tokens.spacing.sm};
      font-size: ${tokens.typography.sizes.xs};
      height: 28px;
      
      svg {
        width: 16px;
        height: 16px;
      }
    }
    
    .send-button {
      ${mixins.button('primary')}
      padding: ${tokens.spacing.xs} ${tokens.spacing.md};
      height: 28px;
      
      &:disabled {
        background: var(--theme-border);
      }
    }
    
    /* View transitions */
    .view-container {
      position: absolute;
      inset: 0;
      background: var(--theme-background);
      ${utils.transition('transform')}
      transform: translateX(100%);
      
      &.active {
        transform: translateX(0);
      }
    }
    
    /* Component library view */
    .components-view {
      ${utils.flex('column')}
      height: 100%;
    }
    
    .components-header {
      ${utils.flex('row', 'center', 'space-between')}
      ${utils.p('lg')}
      border-bottom: 1px solid var(--theme-border);
    }
    
    .components-list {
      flex: 1;
      overflow-y: auto;
      ${utils.p('lg')}
    }
    
    .component-item {
      ${mixins.card()}
      ${utils.flex('column')}
      gap: ${tokens.spacing.sm};
      margin-bottom: ${tokens.spacing.md};
      cursor: pointer;
      ${utils.transition()}
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: ${tokens.shadows.lg};
      }
    }
    
    /* Loading states */
    .loading {
      ${utils.flex('row', 'center', 'center')}
      gap: ${tokens.spacing.xs};
      color: var(--theme-textSecondary);
      ${utils.text('sm')}
    }
    
    .loading-spinner {
      width: 16px;
      height: 16px;
      border: 2px solid var(--theme-border);
      border-top-color: var(--theme-primary);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    
    /* Tooltips */
    .tooltip {
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%) translateY(-8px);
      ${utils.px('sm')}
      ${utils.py('xs')}
      ${utils.rounded('md')}
      ${utils.text('xs')}
      background: var(--theme-text);
      color: var(--theme-background);
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      ${utils.transition('opacity', 'fast')}
      
      &.visible {
        opacity: 1;
      }
    }
  `;
};
```

### 5. Component Updates

Update all components to use the new styling system:

```typescript
// Example: Updated ModelSelector component
import { h } from 'preact';
import { utils, mixins } from '../styles';

export const ModelSelector = ({ models, selected, onSelect }) => {
  return (
    <div className="model-selector">
      <style>{`
        .model-selector {
          ${utils.flex('column')}
          gap: ${tokens.spacing.sm};
        }
        
        .model-option {
          ${mixins.button('secondary')}
          justify-content: flex-start;
          
          &.selected {
            background: var(--theme-primary);
            color: white;
            border-color: var(--theme-primary);
          }
        }
      `}</style>
      
      {models.map(model => (
        <button
          key={model.id}
          className={`model-option ${selected === model.id ? 'selected' : ''}`}
          onClick={() => onSelect(model.id)}
        >
          {model.name}
        </button>
      ))}
    </div>
  );
};
```

## Dependencies

### Required Updates
- No new NPM dependencies needed (using pure CSS-in-JS)
- Font files need to be hosted or bundled
- Consider adding `color` package for color manipulation if needed

### Optional Enhancements
- `polished`: For advanced color functions
- `csstype`: For better TypeScript support in styles

## Testing Strategy

### Visual Regression Testing
1. Screenshot comparisons between marketing site and React LLM UI
2. Test in different browsers and viewport sizes
3. Verify Shadow DOM isolation isn't broken

### Component Testing
```typescript
// Test example for theme switching
test('Theme switching updates CSS variables', () => {
  const { container } = render(<Toolbar theme="light" />);
  const hostElement = container.querySelector(':host');
  
  expect(hostElement).toHaveStyleRule('--theme-background', '#ffffff');
  
  rerender(<Toolbar theme="dark" />);
  expect(hostElement).toHaveStyleRule('--theme-background', 'rgba(0, 0, 0, 0.9)');
});
```

### Accessibility Testing
- Color contrast ratios meet WCAG AA standards
- Focus states are clearly visible
- Keyboard navigation works properly

## Security Considerations

### Style Injection Safety
- All styles are scoped within Shadow DOM
- No use of innerHTML or dangerous CSS injection
- CSS values are sanitized through the token system

### Font Loading
- Fonts loaded from trusted CDN with SRI hashes
- Fallback fonts ensure functionality without custom fonts

## Effort Estimate

**3-4 developer days**

### Breakdown:
- Day 1: Design token extraction and system setup
- Day 2: Core styling utilities and theme system
- Day 3: Component updates and testing
- Day 0.5-1: Polish, documentation, and edge cases

## Success Metrics

- [ ] All design tokens extracted and standardized
- [ ] Visual parity with marketing site achieved
- [ ] Theme switching works without flicker
- [ ] All components updated to new system
- [ ] No style leakage outside Shadow DOM
- [ ] Bundle size increase < 10KB
- [ ] Works in all major browsers
- [ ] Accessibility standards met