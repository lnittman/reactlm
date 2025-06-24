/**
 * CSS Utilities - Reusable style functions and mixins
 * For Shadow DOM compatible CSS-in-JS styling
 */

import { spacing, borderRadius, typography, shadows, transitions, easings, devtools as devtoolsTokens, zIndex } from './tokens';

// Typography utilities
export const text = {
  xs: `font-size: ${typography.fontSize.xs}; line-height: ${typography.lineHeight.base};`,
  sm: `font-size: ${typography.fontSize.sm}; line-height: ${typography.lineHeight.base};`,
  base: `font-size: ${typography.fontSize.base}; line-height: ${typography.lineHeight.base};`,
  lg: `font-size: ${typography.fontSize.lg}; line-height: ${typography.lineHeight.base};`,
  xl: `font-size: ${typography.fontSize.xl}; line-height: ${typography.lineHeight.tight};`,
  '2xl': `font-size: ${typography.fontSize['2xl']}; line-height: ${typography.lineHeight.tight};`,
  '3xl': `font-size: ${typography.fontSize['3xl']}; line-height: ${typography.lineHeight.tight};`,
  '4xl': `font-size: ${typography.fontSize['4xl']}; line-height: ${typography.lineHeight.tight};`,
};

export const fontWeight = {
  normal: `font-weight: ${typography.fontWeight.normal};`,
  medium: `font-weight: ${typography.fontWeight.medium};`,
  semibold: `font-weight: ${typography.fontWeight.semibold};`,
  bold: `font-weight: ${typography.fontWeight.bold};`,
};

export const fontFamily = {
  mono: `font-family: ${typography.fontFamily.mono};`,
  title: `font-family: ${typography.fontFamily.title};`,
};

// Layout utilities
export const flex = {
  center: `display: flex; align-items: center; justify-content: center;`,
  centerY: `display: flex; align-items: center;`,
  centerX: `display: flex; justify-content: center;`,
  between: `display: flex; justify-content: space-between;`,
  around: `display: flex; justify-content: space-around;`,
  col: `display: flex; flex-direction: column;`,
  colCenter: `display: flex; flex-direction: column; align-items: center;`,
  colBetween: `display: flex; flex-direction: column; justify-content: space-between;`,
  wrap: `display: flex; flex-wrap: wrap;`,
  nowrap: `display: flex; flex-wrap: nowrap;`,
};

export const position = {
  relative: `position: relative;`,
  absolute: `position: absolute;`,
  fixed: `position: fixed;`,
  sticky: `position: sticky;`,
  static: `position: static;`,
};

export const overflow = {
  hidden: `overflow: hidden;`,
  auto: `overflow: auto;`,
  scroll: `overflow: scroll;`,
  visible: `overflow: visible;`,
  hiddenX: `overflow-x: hidden;`,
  hiddenY: `overflow-y: hidden;`,
  autoX: `overflow-x: auto;`,
  autoY: `overflow-y: auto;`,
};

// Spacing utilities
export const padding = {
  xs: `padding: ${spacing.xs};`,
  sm: `padding: ${spacing.sm};`,
  md: `padding: ${spacing.md};`,
  lg: `padding: ${spacing.lg};`,
  xl: `padding: ${spacing.xl};`,
  '2xl': `padding: ${spacing['2xl']};`,
  '3xl': `padding: ${spacing['3xl']};`,
  
  // Directional padding
  x: {
    xs: `padding-left: ${spacing.xs}; padding-right: ${spacing.xs};`,
    sm: `padding-left: ${spacing.sm}; padding-right: ${spacing.sm};`,
    md: `padding-left: ${spacing.md}; padding-right: ${spacing.md};`,
    lg: `padding-left: ${spacing.lg}; padding-right: ${spacing.lg};`,
    xl: `padding-left: ${spacing.xl}; padding-right: ${spacing.xl};`,
  },
  y: {
    xs: `padding-top: ${spacing.xs}; padding-bottom: ${spacing.xs};`,
    sm: `padding-top: ${spacing.sm}; padding-bottom: ${spacing.sm};`,
    md: `padding-top: ${spacing.md}; padding-bottom: ${spacing.md};`,
    lg: `padding-top: ${spacing.lg}; padding-bottom: ${spacing.lg};`,
    xl: `padding-top: ${spacing.xl}; padding-bottom: ${spacing.xl};`,
  },
};

export const margin = {
  xs: `margin: ${spacing.xs};`,
  sm: `margin: ${spacing.sm};`,
  md: `margin: ${spacing.md};`,
  lg: `margin: ${spacing.lg};`,
  xl: `margin: ${spacing.xl};`,
  '2xl': `margin: ${spacing['2xl']};`,
  '3xl': `margin: ${spacing['3xl']};`,
  
  // Directional margin
  x: {
    xs: `margin-left: ${spacing.xs}; margin-right: ${spacing.xs};`,
    sm: `margin-left: ${spacing.sm}; margin-right: ${spacing.sm};`,
    md: `margin-left: ${spacing.md}; margin-right: ${spacing.md};`,
    lg: `margin-left: ${spacing.lg}; margin-right: ${spacing.lg};`,
    xl: `margin-left: ${spacing.xl}; margin-right: ${spacing.xl};`,
  },
  y: {
    xs: `margin-top: ${spacing.xs}; margin-bottom: ${spacing.xs};`,
    sm: `margin-top: ${spacing.sm}; margin-bottom: ${spacing.sm};`,
    md: `margin-top: ${spacing.md}; margin-bottom: ${spacing.md};`,
    lg: `margin-top: ${spacing.lg}; margin-bottom: ${spacing.lg};`,
    xl: `margin-top: ${spacing.xl}; margin-bottom: ${spacing.xl};`,
  },
};

// Border utilities
export const rounded = {
  none: `border-radius: ${borderRadius.none};`,
  sm: `border-radius: ${borderRadius.sm};`,
  base: `border-radius: ${borderRadius.base};`,
  md: `border-radius: ${borderRadius.md};`,
  lg: `border-radius: ${borderRadius.lg};`,
  xl: `border-radius: ${borderRadius.xl};`,
  '2xl': `border-radius: ${borderRadius['2xl']};`,
  full: `border-radius: ${borderRadius.full};`,
};

export const border = {
  none: `border: none;`,
  base: `border: 1px solid var(--theme-border);`,
  subdued: `border: 1px solid var(--theme-border-subdued);`,
  focus: `border: 1px solid var(--theme-focus);`,
  primary: `border: 1px solid var(--theme-primary);`,
  
  // Directional borders
  t: `border-top: 1px solid var(--theme-border);`,
  r: `border-right: 1px solid var(--theme-border);`,
  b: `border-bottom: 1px solid var(--theme-border);`,
  l: `border-left: 1px solid var(--theme-border);`,
};

// Shadow utilities
export const shadow = {
  none: `box-shadow: ${shadows.none};`,
  sm: `box-shadow: ${shadows.sm};`,
  base: `box-shadow: ${shadows.base};`,
  md: `box-shadow: ${shadows.md};`,
  lg: `box-shadow: ${shadows.lg};`,
  xl: `box-shadow: ${shadows.xl};`,
  '2xl': `box-shadow: ${shadows['2xl']};`,
  inner: `box-shadow: ${shadows.inner};`,
};

// Background utilities
export const bg = {
  transparent: `background: transparent;`,
  primary: `background: var(--theme-primary);`,
  secondary: `background: var(--theme-secondary);`,
  hover: `background: var(--theme-hover);`,
  active: `background: var(--theme-active);`,
  muted: `background: var(--theme-border-subdued);`,
  chat: {
    user: `background: var(--theme-chat-user-bg);`,
    assistant: `background: var(--theme-chat-assistant-bg);`,
    system: `background: var(--theme-chat-system-bg);`,
    input: `background: var(--theme-chat-input-bg);`,
  },
};

// Text color utilities
export const textColor = {
  primary: `color: var(--theme-foreground);`,
  secondary: `color: var(--theme-muted);`,
  muted: `color: var(--theme-muted);`,
  accent: `color: var(--theme-accent);`,
  disabled: `color: var(--theme-disabled);`,
  chat: {
    user: `color: var(--theme-chat-user-text);`,
    assistant: `color: var(--theme-chat-assistant-text);`,
    system: `color: var(--theme-chat-system-text);`,
  },
  status: {
    success: `color: var(--theme-status-success);`,
    warning: `color: var(--theme-status-warning);`,
    error: `color: var(--theme-status-error);`,
    info: `color: var(--theme-status-info);`,
  },
};

// Transition utilities with easing functions
export const transition = {
  all: `transition: all 0.2s ${easings.smooth};`,
  colors: `transition: color 0.15s ${easings.smooth}, background-color 0.15s ${easings.smooth}, border-color 0.15s ${easings.smooth};`,
  transform: `transition: transform 0.2s ${easings.spring};`,
  opacity: `transition: opacity 0.2s ${easings.smooth};`,
  bounce: `transition: all 0.3s ${easings.bounce};`,
  smooth: `transition: all 0.3s ${easings.smooth};`,
  snappy: `transition: all 0.15s ${easings.snappy};`,
  none: `transition: none;`,
  
  // Enhanced transitions for specific elements
  button: `
    transition: 
      transform 0.15s ${easings.spring},
      background-color 0.2s ${easings.smooth},
      border-color 0.2s ${easings.smooth},
      box-shadow 0.2s ${easings.smooth},
      color 0.15s ${easings.smooth};
  `,
  
  message: `
    transition: 
      opacity 0.3s ${easings.smooth},
      transform 0.3s ${easings.spring};
  `,
  
  dropdown: `
    transition: 
      opacity 0.2s ${easings.smooth},
      transform 0.25s ${easings.spring},
      visibility 0.2s;
  `,
};

// Modern LLM chat interface specific utilities - professional grade
export const chat = {
  message: `
    ${padding.md}
    ${rounded.lg}
    ${text.sm}
    line-height: ${typography.lineHeight.relaxed};
    margin-bottom: ${spacing.md};
    max-width: 100%;
    word-wrap: break-word;
    animation: slideIn 0.4s ${easings.smooth};
    will-change: transform, opacity;
  `,
  
  userMessage: `
    ${bg.chat.user}
    ${textColor.chat.user}
    align-self: flex-end;
    max-width: 85%;
  `,
  
  assistantMessage: `
    ${bg.chat.assistant}
    ${textColor.chat.assistant}
    align-self: flex-start;
    max-width: 100%;
  `,
  
  systemMessage: `
    ${bg.chat.system}
    ${textColor.chat.system}
    align-self: center;
    max-width: 90%;
    text-align: center;
    ${text.xs}
  `,
  
  input: `
    width: 100%;
    ${bg.chat.input}
    border: 1px solid var(--theme-chat-input-border);
    ${rounded.xl}
    ${padding.md}
    ${textColor.primary}
    ${text.sm}
    ${fontFamily.mono}
    min-height: 44px;
    max-height: 140px;
    resize: none;
    transition: all 0.2s ${easings.smooth};
    backdrop-filter: blur(10px);
    
    &:hover:not(:disabled) {
      background: var(--theme-hover);
      border-color: var(--theme-border);
      transform: translateY(-1px);
    }
    
    &:focus {
      outline: none;
      background: var(--theme-hover);
      border-color: var(--theme-chat-input-focus);
      box-shadow: 0 0 0 3px rgba(69, 137, 255, 0.1);
      transform: translateY(-1px);
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    &::placeholder {
      color: var(--theme-muted);
    }
  `,
};

// Button variants
export const button = {
  base: `
    display: inline-flex;
    align-items: center;
    justify-content: center;
    ${fontFamily.mono}
    ${text.sm}
    ${fontWeight.medium}
    cursor: pointer;
    ${transition.colors}
    border: none;
    outline: none;
    text-decoration: none;
    user-select: none;
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `,
  
  primary: `
    background: var(--theme-primary);
    color: var(--theme-background);
    border: 1px solid var(--theme-primary);
    
    &:hover:not(:disabled) {
      background: var(--theme-primary-hover);
      border-color: var(--theme-primary-hover);
    }
  `,
  
  secondary: `
    background: var(--theme-secondary);
    color: var(--theme-foreground);
    border: 1px solid var(--theme-border);
    
    &:hover:not(:disabled) {
      background: var(--theme-secondary-hover);
      border-color: var(--theme-border);
    }
  `,
  
  ghost: `
    background: transparent;
    color: var(--theme-muted);
    border: 1px solid transparent;
    
    &:hover:not(:disabled) {
      background: var(--theme-hover);
      color: var(--theme-foreground);
    }
  `,
  
  icon: `
    ${padding.sm}
    ${rounded.md}
    width: 36px;
    height: 36px;
    
    svg {
      width: 16px;
      height: 16px;
    }
  `,
  
  sm: `
    ${padding.sm}
    ${text.xs}
    ${rounded.md}
    min-height: 32px;
  `,
  
  md: `
    ${padding.md}
    ${text.sm}
    ${rounded.lg}
    min-height: 40px;
  `,
  
  lg: `
    ${padding.lg}
    ${text.base}
    ${rounded.lg}
    min-height: 48px;
  `,
};

// Animation keyframes - Professional micro-interactions
export const animations = `
  /* Toolbar entrance animation */
  @keyframes toolbarEntrance {
    from { 
      opacity: 0;
      transform: translateY(20px) scale(0.95);
      filter: blur(4px);
    }
    to { 
      opacity: 1;
      transform: translateY(0) scale(1);
      filter: blur(0);
    }
  }
  
  /* Smooth fade in with spring */
  @keyframes fadeIn {
    from { 
      opacity: 0; 
      transform: translateY(8px) scale(0.98);
    }
    to { 
      opacity: 1; 
      transform: translateY(0) scale(1);
    }
  }
  
  /* Message slide in */
  @keyframes slideIn {
    from { 
      opacity: 0; 
      transform: translateX(-12px);
    }
    to { 
      opacity: 1; 
      transform: translateX(0);
    }
  }
  
  /* View switching animation */
  @keyframes viewSlideIn {
    from {
      opacity: 0;
      transform: translateX(20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  /* Selection ring pulse */
  @keyframes selectionPulse {
    0% {
      box-shadow: 0 0 0 0 rgba(69, 137, 255, 0.4);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(69, 137, 255, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(69, 137, 255, 0);
    }
  }
  
  /* Smooth rotation */
  @keyframes spin {
    from { 
      transform: rotate(0deg); 
    }
    to { 
      transform: rotate(360deg); 
    }
  }
  
  /* Loading pulse with scale */
  @keyframes pulse {
    0%, 100% { 
      opacity: 0.3; 
      transform: scale(0.85); 
    }
    50% { 
      opacity: 1; 
      transform: scale(1); 
    }
  }
  
  /* Typing indicator dots */
  @keyframes typingDot {
    0%, 60%, 100% {
      transform: translateY(0);
      opacity: 0.5;
    }
    30% {
      transform: translateY(-10px);
      opacity: 1;
    }
  }
  
  /* Button hover shimmer */
  @keyframes shimmer {
    0% {
      background-position: -200% center;
    }
    100% {
      background-position: 200% center;
    }
  }
  
  /* Elastic bounce */
  @keyframes bounce {
    0%, 20%, 53%, 80%, 100% {
      transform: translate3d(0, 0, 0);
    }
    40%, 43% {
      transform: translate3d(0, -8px, 0);
    }
    70% {
      transform: translate3d(0, -4px, 0);
    }
    90% {
      transform: translate3d(0, -2px, 0);
    }
  }
  
  /* Component highlight animation */
  @keyframes componentHighlight {
    0% {
      opacity: 0;
      transform: scale(1.05);
    }
    50% {
      opacity: 0.3;
    }
    100% {
      opacity: 0;
      transform: scale(1.15);
    }
  }
  
  /* Success checkmark */
  @keyframes checkmark {
    0% {
      stroke-dashoffset: 50;
    }
    100% {
      stroke-dashoffset: 0;
    }
  }
  
  /* Error shake */
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
    20%, 40%, 60%, 80% { transform: translateX(2px); }
  }
  
  /* @ mention dropdown entrance */
  @keyframes dropdownEntrance {
    from {
      opacity: 0;
      transform: translateY(-8px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  
  /* Ripple effect for buttons */
  @keyframes ripple {
    from {
      transform: scale(0);
      opacity: 1;
    }
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
  
  /* Model card hover */
  @keyframes cardLift {
    from {
      transform: translateY(0);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    to {
      transform: translateY(-4px);
      box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
    }
  }
  
  /* Streaming response indicator */
  @keyframes streamingPulse {
    0%, 100% {
      opacity: 0.4;
    }
    50% {
      opacity: 1;
    }
  }
`;

// Responsive utilities
export const responsive = {
  mobile: (styles: string) => `
    @media (max-width: 768px) {
      ${styles}
    }
  `,
  
  tablet: (styles: string) => `
    @media (min-width: 769px) and (max-width: 1024px) {
      ${styles}
    }
  `,
  
  desktop: (styles: string) => `
    @media (min-width: 1025px) {
      ${styles}
    }
  `,
  
  smallScreen: (styles: string) => `
    @media (max-width: 480px) {
      ${styles}
    }
  `,
};

// Focus utilities for accessibility
export const focus = {
  ring: `
    &:focus-visible {
      outline: 2px solid var(--theme-focus);
      outline-offset: 2px;
    }
  `,
  
  within: `
    &:focus-within {
      border-color: var(--theme-focus);
    }
  `,
};

// Loading states with enhanced animations
export const loading = {
  spinner: `
    width: 16px;
    height: 16px;
    border: 2px solid var(--theme-border-subdued);
    border-top-color: var(--theme-foreground);
    border-radius: 50%;
    animation: spin 0.7s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
    will-change: transform;
  `,
  
  dots: `
    display: inline-flex;
    align-items: center;
    gap: 4px;
    
    .dot {
      width: 3px;
      height: 3px;
      background: currentColor;
      border-radius: 50%;
      animation: typingDot 1.4s infinite cubic-bezier(0.4, 0, 0.6, 1);
      opacity: 0.5;
      will-change: transform, opacity;
    }
    
    .dot:nth-child(2) {
      animation-delay: 0.16s;
    }
    
    .dot:nth-child(3) {
      animation-delay: 0.32s;
    }
  `,
  
  skeleton: `
    background: linear-gradient(
      90deg,
      var(--theme-border-subdued) 25%,
      var(--theme-hover) 50%,
      var(--theme-border-subdued) 75%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    will-change: background-position;
  `,
  
  streamingCursor: `
    &::after {
      content: '▋';
      display: inline-block;
      vertical-align: text-bottom;
      animation: streamingPulse 1s infinite;
      opacity: 0.7;
      margin-left: 2px;
    }
  `,
};

// Scrollbar utilities
export const scrollbar = {
  thin: `
    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    
    &::-webkit-scrollbar-thumb {
      background: var(--theme-border);
      border-radius: 3px;
    }
    
    &::-webkit-scrollbar-thumb:hover {
      background: var(--theme-muted);
    }
  `,
  
  hidden: `
    scrollbar-width: none;
    -ms-overflow-style: none;
    
    &::-webkit-scrollbar {
      display: none;
    }
  `,
};

// Developer tools specific utilities - inspired by VS Code, Chrome DevTools
export const devtools = {
  // Glass morphism panels
  panel: `
    background: ${devtoolsTokens.backgrounds.glass};
    backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid ${devtoolsTokens.borders.normal};
    ${rounded.xl}
    ${shadow.xl}
  `,
  
  // Interactive elements with micro-interactions
  interactive: `
    ${transition.all}
    will-change: transform, background-color, border-color;
    
    &:hover {
      transform: translateY(-1px);
    }
    
    &:active {
      transform: translateY(0);
    }
  `,
  
  // Professional tooltips
  tooltip: `
    background: ${devtoolsTokens.backgrounds.panel};
    color: ${devtoolsTokens.text.primary};
    ${text.xs}
    ${padding.sm}
    ${rounded.md}
    border: 1px solid ${devtoolsTokens.borders.subtle};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    backdrop-filter: blur(10px);
    pointer-events: none;
    z-index: ${zIndex.tooltip};
    animation: fadeIn 0.2s ${easings.smooth};
    
    &::before {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border: 4px solid transparent;
      border-top-color: ${devtoolsTokens.borders.normal};
    }
  `,
  
  // Code editor styling
  codeEditor: `
    ${fontFamily.mono}
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid ${devtoolsTokens.borders.subtle};
    ${rounded.md}
    ${padding.md}
    color: ${devtoolsTokens.text.primary};
    ${text.sm}
    line-height: 1.4;
    
    .keyword { color: #C792EA; }
    .string { color: #C3E88D; }
    .number { color: #F78C6C; }
    .comment { color: #546E7A; font-style: italic; }
    .function { color: #82AAFF; }
    .variable { color: #EEFFFF; }
  `,
  
  // Modern badge system
  badge: `
    display: inline-flex;
    align-items: center;
    ${text.xs}
    ${fontWeight.medium}
    ${padding.xs}
    ${rounded.base}
    background: ${devtoolsTokens.backgrounds.active};
    color: ${devtoolsTokens.text.secondary};
    border: 1px solid ${devtoolsTokens.borders.subtle};
    gap: 4px;
    
    &.success {
      background: rgba(66, 196, 66, 0.15);
      color: ${devtoolsTokens.accent.green};
      border-color: rgba(66, 196, 66, 0.3);
    }
    
    &.warning {
      background: rgba(255, 140, 0, 0.15);
      color: ${devtoolsTokens.accent.orange};
      border-color: rgba(255, 140, 0, 0.3);
    }
    
    &.error {
      background: rgba(255, 85, 85, 0.15);
      color: ${devtoolsTokens.accent.red};
      border-color: rgba(255, 85, 85, 0.3);
    }
  `,
  
  // Professional loading states
  loading: {
    shimmer: `
      background: linear-gradient(
        90deg,
        ${devtoolsTokens.backgrounds.hover} 25%,
        ${devtoolsTokens.backgrounds.active} 50%,
        ${devtoolsTokens.backgrounds.hover} 75%
      );
      background-size: 200% 100%;
      animation: shimmer 1.5s infinite;
      
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
    `,
    
    pulse: `
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
      
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `,
  },
  
  // Modern dropdown styling
  dropdown: `
    background: ${devtoolsTokens.backgrounds.panel};
    border: 1px solid ${devtoolsTokens.borders.normal};
    ${rounded.lg}
    ${shadow.xl}
    backdrop-filter: blur(20px);
    overflow: hidden;
    
    .dropdown-item {
      ${padding.sm}
      ${text.sm}
      color: ${devtoolsTokens.text.primary};
      cursor: pointer;
      ${transition.colors}
      
      &:hover {
        background: ${devtoolsTokens.backgrounds.hover};
      }
      
      &:active, &.selected {
        background: ${devtoolsTokens.backgrounds.active};
        color: ${devtoolsTokens.accent.blue};
      }
    }
    
    .dropdown-separator {
      height: 1px;
      background: ${devtoolsTokens.borders.subtle};
      margin: 4px 0;
    }
  `,
};