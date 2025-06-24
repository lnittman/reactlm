/**
 * Theme System - Light and Dark theme definitions
 * Based on design tokens and adapted for modern LLM chat interfaces
 */

import { colors, typography, spacing, borderRadius, shadows, transitions, zIndex, devtools as devtoolsTokens, easings } from './tokens';

export interface Theme {
  // Core colors
  background: string;
  foreground: string;
  border: string;
  borderSubdued: string;
  
  // Interactive states
  hover: string;
  active: string;
  focus: string;
  disabled: string;
  
  // Semantic colors
  primary: string;
  primaryHover: string;
  secondary: string;
  secondaryHover: string;
  muted: string;
  accent: string;
  
  // Chat interface specific
  chat: {
    background: string;
    userBg: string;
    userText: string;
    assistantBg: string;
    assistantText: string;
    systemBg: string;
    systemText: string;
    inputBg: string;
    inputBorder: string;
    inputFocus: string;
  };
  
  // Component specific
  toolbar: {
    background: string;
    backdropFilter: string;
    shadow: string;
  };
  
  dropdown: {
    background: string;
    border: string;
    shadow: string;
  };
  
  button: {
    primary: {
      background: string;
      text: string;
      hover: string;
      active: string;
      border: string;
    };
    secondary: {
      background: string;
      text: string;
      hover: string;
      active: string;
      border: string;
    };
    ghost: {
      background: string;
      text: string;
      hover: string;
      active: string;
      border: string;
    };
  };
  
  status: {
    success: string;
    warning: string;
    error: string;
    info: string;
  };
}

// Dark theme (primary) - world-class developer tools aesthetic
export const darkTheme: Theme = {
  // Core colors - inspired by modern IDEs and dev tools
  background: devtoolsTokens.backgrounds.glass,
  foreground: devtoolsTokens.text.primary,
  border: devtoolsTokens.borders.normal,
  borderSubdued: devtoolsTokens.borders.subtle,
  
  // Interactive states - smooth, professional feel
  hover: devtoolsTokens.backgrounds.hover,
  active: devtoolsTokens.backgrounds.active,
  focus: devtoolsTokens.accent.blue,
  disabled: 'rgba(255, 255, 255, 0.3)',
  
  // Semantic colors
  primary: devtoolsTokens.accent.blue,
  primaryHover: 'rgba(69, 137, 255, 0.8)',
  secondary: devtoolsTokens.backgrounds.hover,
  secondaryHover: devtoolsTokens.backgrounds.active,
  muted: devtoolsTokens.text.secondary,
  accent: devtoolsTokens.accent.blue,
  
  // Chat interface
  chat: {
    background: 'rgba(0, 0, 0, 0.5)',
    userBg: colors.chat.userBg,
    userText: colors.chat.userText,
    assistantBg: colors.chat.assistantBg,
    assistantText: colors.chat.assistantText,
    systemBg: colors.chat.systemBg,
    systemText: colors.chat.systemText,
    inputBg: 'rgba(255, 255, 255, 0.05)',
    inputBorder: 'rgba(255, 255, 255, 0.1)',
    inputFocus: 'rgba(255, 255, 255, 0.2)',
  },
  
  // Component specific - professional developer tools
  toolbar: {
    background: devtoolsTokens.backgrounds.glass,
    backdropFilter: 'blur(20px) saturate(180%)',
    shadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 8px 16px rgba(0, 0, 0, 0.2)',
  },
  
  dropdown: {
    background: devtoolsTokens.backgrounds.panel,
    border: devtoolsTokens.borders.normal,
    shadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 4px 16px rgba(0, 0, 0, 0.3)',
  },
  
  button: {
    primary: {
      background: devtoolsTokens.accent.blue,
      text: colors.white,
      hover: 'rgba(69, 137, 255, 0.8)',
      active: 'rgba(69, 137, 255, 0.9)',
      border: devtoolsTokens.accent.blue,
    },
    secondary: {
      background: devtoolsTokens.backgrounds.hover,
      text: devtoolsTokens.text.primary,
      hover: 'rgba(255, 255, 255, 0.12)',
      active: 'rgba(255, 255, 255, 0.16)',
      border: devtoolsTokens.borders.normal,
    },
    ghost: {
      background: 'transparent',
      text: devtoolsTokens.text.secondary,
      hover: devtoolsTokens.backgrounds.hover,
      active: devtoolsTokens.backgrounds.active,
      border: 'transparent',
    },
  },
  
  status: {
    success: devtoolsTokens.accent.green,
    warning: devtoolsTokens.accent.orange,
    error: devtoolsTokens.accent.red,
    info: devtoolsTokens.accent.blue,
  },
};

// Light theme - for future light mode support
export const lightTheme: Theme = {
  // Core colors
  background: colors.white,
  foreground: colors.black,
  border: colors.gray[20],
  borderSubdued: 'rgba(168, 168, 168, 0.2)',
  
  // Interactive states
  hover: 'rgba(0, 0, 0, 0.02)',
  active: 'rgba(0, 0, 0, 0.04)',
  focus: colors.blue[50],
  disabled: 'rgba(0, 0, 0, 0.3)',
  
  // Semantic colors
  primary: colors.blue[50],
  primaryHover: colors.blue[60],
  secondary: colors.gray[10],
  secondaryHover: colors.gray[20],
  muted: colors.gray[50],
  accent: colors.blue[50],
  
  // Chat interface
  chat: {
    background: colors.gray[10],
    userBg: 'rgba(100, 100, 255, 0.1)',
    userText: colors.black,
    assistantBg: colors.white,
    assistantText: colors.black,
    systemBg: 'rgba(255, 200, 0, 0.1)',
    systemText: 'rgba(180, 140, 0, 1)',
    inputBg: colors.white,
    inputBorder: colors.gray[20],
    inputFocus: colors.blue[50],
  },
  
  // Component specific
  toolbar: {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    shadow: shadows.lg,
  },
  
  dropdown: {
    background: colors.white,
    border: colors.gray[20],
    shadow: shadows.xl,
  },
  
  button: {
    primary: {
      background: colors.black,
      text: colors.white,
      hover: colors.blue[50],
      active: colors.blue[60],
      border: colors.black,
    },
    secondary: {
      background: colors.white,
      text: colors.black,
      hover: colors.blue[50],
      active: colors.blue[60],
      border: colors.gray[20],
    },
    ghost: {
      background: 'transparent',
      text: colors.gray[60],
      hover: colors.gray[10],
      active: colors.gray[20],
      border: 'transparent',
    },
  },
  
  status: {
    success: 'rgba(0, 150, 0, 1)',
    warning: 'rgba(200, 140, 0, 1)',
    error: 'rgba(200, 0, 0, 1)',
    info: 'rgba(0, 100, 200, 1)',
  },
};

// Current theme (defaults to dark)
export const theme = darkTheme;

// Theme utilities
export const createThemeCSS = (selectedTheme: Theme = darkTheme): string => {
  return `
    :host {
      --theme-background: ${selectedTheme.background};
      --theme-foreground: ${selectedTheme.foreground};
      --theme-border: ${selectedTheme.border};
      --theme-border-subdued: ${selectedTheme.borderSubdued};
      --theme-hover: ${selectedTheme.hover};
      --theme-active: ${selectedTheme.active};
      --theme-focus: ${selectedTheme.focus};
      --theme-disabled: ${selectedTheme.disabled};
      --theme-primary: ${selectedTheme.primary};
      --theme-primary-hover: ${selectedTheme.primaryHover};
      --theme-secondary: ${selectedTheme.secondary};
      --theme-secondary-hover: ${selectedTheme.secondaryHover};
      --theme-muted: ${selectedTheme.muted};
      --theme-accent: ${selectedTheme.accent};
      
      /* Chat colors */
      --theme-chat-background: ${selectedTheme.chat.background};
      --theme-chat-user-bg: ${selectedTheme.chat.userBg};
      --theme-chat-user-text: ${selectedTheme.chat.userText};
      --theme-chat-assistant-bg: ${selectedTheme.chat.assistantBg};
      --theme-chat-assistant-text: ${selectedTheme.chat.assistantText};
      --theme-chat-system-bg: ${selectedTheme.chat.systemBg};
      --theme-chat-system-text: ${selectedTheme.chat.systemText};
      --theme-chat-input-bg: ${selectedTheme.chat.inputBg};
      --theme-chat-input-border: ${selectedTheme.chat.inputBorder};
      --theme-chat-input-focus: ${selectedTheme.chat.inputFocus};
      
      /* Typography */
      --font-family-mono: ${typography.fontFamily.mono};
      --font-family-title: ${typography.fontFamily.title};
      
      /* Component-specific colors */
      --theme-toolbar-background: ${selectedTheme.toolbar.background};
      --theme-toolbar-backdrop-filter: ${selectedTheme.toolbar.backdropFilter};
      --theme-toolbar-shadow: ${selectedTheme.toolbar.shadow};
      --theme-dropdown-background: ${selectedTheme.dropdown.background};
      --theme-dropdown-border: ${selectedTheme.dropdown.border};
      --theme-dropdown-shadow: ${selectedTheme.dropdown.shadow};
      
      /* Button variants */
      --theme-button-primary-bg: ${selectedTheme.button.primary.background};
      --theme-button-primary-text: ${selectedTheme.button.primary.text};
      --theme-button-primary-hover: ${selectedTheme.button.primary.hover};
      --theme-button-secondary-bg: ${selectedTheme.button.secondary.background};
      --theme-button-secondary-text: ${selectedTheme.button.secondary.text};
      --theme-button-secondary-hover: ${selectedTheme.button.secondary.hover};
      
      /* Status colors */
      --theme-status-success: ${selectedTheme.status.success};
      --theme-status-warning: ${selectedTheme.status.warning};
      --theme-status-error: ${selectedTheme.status.error};
      --theme-status-info: ${selectedTheme.status.info};
      
      /* Spacing */
      --spacing-xs: ${spacing.xs};
      --spacing-sm: ${spacing.sm};
      --spacing-md: ${spacing.md};
      --spacing-lg: ${spacing.lg};
      --spacing-xl: ${spacing.xl};
      --spacing-2xl: ${spacing['2xl']};
      --spacing-3xl: ${spacing['3xl']};
      
      /* Border radius */
      --radius-sm: ${borderRadius.sm};
      --radius-base: ${borderRadius.base};
      --radius-md: ${borderRadius.md};
      --radius-lg: ${borderRadius.lg};
      --radius-xl: ${borderRadius.xl};
      --radius-2xl: ${borderRadius['2xl']};
      
      /* Z-index */
      --z-index-dropdown: ${zIndex.dropdown};
      --z-index-modal: ${zIndex.modal};
      --z-index-popover: ${zIndex.popover};
      --z-index-tooltip: ${zIndex.tooltip};
      
      /* Transitions */
      --transition-all: ${transitions.all};
      --transition-colors: ${transitions.colors};
      --transition-transform: ${transitions.transform};
      --transition-opacity: ${transitions.opacity};
      
      /* Animation durations */
      --animation-duration-fast: ${transitions.duration.fast};
      --animation-duration-base: ${transitions.duration.base};
      --animation-duration-slow: ${transitions.duration.slow};
      --animation-duration-slower: ${transitions.duration.slower};
      
      /* Animation easings */
      --animation-easing-smooth: ${easings.smooth};
      --animation-easing-spring: ${easings.spring};
      --animation-easing-snappy: ${easings.snappy};
      --animation-easing-bounce: ${easings.bounce};
    }
  `;
};