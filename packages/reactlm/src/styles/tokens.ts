/**
 * Design Tokens - Unified design system for React LLM
 * Extracted from marketing site and adapted for Shadow DOM usage
 */

// Color system inspired by internet.dev
export const colors = {
  // Base colors
  black: 'rgba(0, 0, 0, 1)',
  white: 'rgba(255, 255, 255, 1)',
  
  // Gray scale
  gray: {
    10: 'rgba(244, 244, 244, 1)',
    20: 'rgba(224, 224, 224, 1)',
    30: 'rgba(198, 198, 198, 1)',
    40: 'rgba(168, 168, 168, 1)',
    50: 'rgba(141, 141, 141, 1)',
    60: 'rgba(111, 111, 111, 1)',
    70: 'rgba(82, 82, 82, 1)',
    80: 'rgba(57, 57, 57, 1)',
    90: 'rgba(38, 38, 38, 1)',
    100: 'rgba(22, 22, 22, 1)',
  },
  
  // Accent colors
  blue: {
    50: 'rgba(69, 137, 255, 1)',
    60: 'rgba(15, 98, 254, 1)',
    70: 'rgba(0, 67, 206, 1)',
  },
  
  // LLM chat interface colors
  chat: {
    // User message
    userBg: 'rgba(100, 100, 255, 0.1)',
    userText: 'rgba(255, 255, 255, 0.9)',
    
    // Assistant message
    assistantBg: 'rgba(255, 255, 255, 0.05)',
    assistantText: 'rgba(255, 255, 255, 0.8)',
    
    // System message
    systemBg: 'rgba(255, 200, 0, 0.1)',
    systemText: 'rgba(255, 200, 0, 0.9)',
  },
  
  // Status colors
  success: 'rgba(100, 255, 100, 0.8)',
  warning: 'rgba(255, 200, 0, 0.9)',
  error: 'rgba(255, 100, 100, 0.8)',
  info: 'rgba(100, 200, 255, 0.8)',
} as const;

// Typography system - based on TX02Mono and modern LLM interfaces
export const typography = {
  fontFamily: {
    mono: "'TX02Mono-Regular', 'SF Mono', Monaco, Inconsolata, 'Roboto Mono', 'Source Code Pro', monospace",
    title: "'TX02Mono-Regular', 'SF Mono', Monaco, Inconsolata, 'Roboto Mono', 'Source Code Pro', monospace",
    ui: "'TX02Mono-Regular', 'SF Mono', Monaco, Inconsolata, 'Roboto Mono', 'Source Code Pro', monospace",
  },
  
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '2rem',    // 32px
    '4xl': '2.5rem',  // 40px
  },
  
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  
  lineHeight: {
    tight: '1.1',
    base: '1.5',
    relaxed: '1.6',
    loose: '1.75',
  },
  
  letterSpacing: {
    tight: '-0.03em',
    normal: '0',
    wide: '0.05em',
  },
} as const;

// Spacing system - based on 1rem = 16px
export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
  '4xl': '5rem',    // 80px
  '5xl': '6rem',    // 96px
} as const;

// Border radius system
export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  base: '0.25rem',  // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  full: '9999px',
} as const;

// Shadow system
export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  none: 'none',
} as const;

// Z-index scale
export const zIndex = {
  base: 1,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modal: 40,
  popover: 50,
  tooltip: 60,
  notification: 70,
} as const;

// Transition system
export const transitions = {
  duration: {
    fast: '0.15s',
    base: '0.2s',
    slow: '0.3s',
    slower: '0.5s',
  },
  
  timing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
  },
  
  // Common transition combinations
  all: 'all 0.2s ease',
  colors: 'color 0.15s ease, background-color 0.15s ease, border-color 0.15s ease',
  transform: 'transform 0.2s ease',
  opacity: 'opacity 0.2s ease',
} as const;

// Breakpoints for responsive design
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// Layout constraints - world-class developer tools sizing
export const layout = {
  toolbar: {
    width: '420px',
    height: '600px',
    minWidth: '360px',
    maxWidth: '640px',
    minHeight: '400px',
    maxHeight: '85vh',
  },
  
  dropdown: {
    maxWidth: '400px',
    maxHeight: '500px',
  },
  
  input: {
    minHeight: '44px',
    maxHeight: '140px',
  },
  
  // Developer tools specific
  devtools: {
    borderRadius: '12px',
    backdropBlur: '20px',
    shadowLevel: 'xl',
  },
} as const;

// Animation curves - for smooth, professional feel
export const easings = {
  spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  snappy: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
} as const;

// Professional developer tool color palette
export const devtools = {
  backgrounds: {
    glass: 'rgba(0, 0, 0, 0.8)',
    panel: 'rgba(0, 0, 0, 0.95)',
    hover: 'rgba(255, 255, 255, 0.05)',
    active: 'rgba(255, 255, 255, 0.1)',
  },
  
  borders: {
    subtle: 'rgba(255, 255, 255, 0.06)',
    normal: 'rgba(255, 255, 255, 0.1)',
    strong: 'rgba(255, 255, 255, 0.15)',
  },
  
  text: {
    primary: 'rgba(255, 255, 255, 0.95)',
    secondary: 'rgba(255, 255, 255, 0.7)',
    muted: 'rgba(255, 255, 255, 0.5)',
    placeholder: 'rgba(255, 255, 255, 0.3)',
  },
  
  accent: {
    blue: '#4589FF',
    green: '#42C442',
    orange: '#FF8C00',
    red: '#FF5555',
    purple: '#BD93F9',
  },
} as const;