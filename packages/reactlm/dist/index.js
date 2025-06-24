/* ReactLM - Browser-native AI coding assistant - MIT License */

// src/index.ts
import { h as h3, render as render2 } from "preact";

// src/components/Toolbar.tsx
import { h as h2, Fragment } from "preact";
import { useSignal } from "@preact/signals";
import { useEffect as useEffect3 } from "preact/hooks";
import { marked } from "marked";

// src/db/simple-storage.ts
var storage = {
  sessions: /* @__PURE__ */ new Map(),
  messages: /* @__PURE__ */ new Map()
};
var isInitialized = false;
async function initDB() {
  if (isInitialized) return true;
  console.log("[ReactLLM] Using in-memory storage");
  isInitialized = true;
  return true;
}
async function createChatSession(id, title, projectInfo) {
  const session = {
    id,
    title,
    createdAt: Date.now(),
    projectName: projectInfo?.name,
    projectType: projectInfo?.type,
    projectDescription: projectInfo?.description,
    isActive: true,
    technologies: projectInfo?.mainTechnologies || []
  };
  storage.sessions.set(id, session);
  storage.messages.set(id, []);
}
async function createMessage(id, chatSessionId, role, content, structuredResponse) {
  const message = {
    id,
    chatSessionId,
    role,
    content,
    timestamp: Date.now(),
    structuredResponse,
    relevantFiles: [],
    documentationLinks: [],
    suggestedQueries: []
  };
  const messages = storage.messages.get(chatSessionId) || [];
  messages.push(message);
  storage.messages.set(chatSessionId, messages);
  if (structuredResponse && role === "assistant") {
    try {
      const parsed = JSON.parse(structuredResponse);
      message.relevantFiles = parsed.relevantFiles || [];
      message.documentationLinks = parsed.documentationLinks || [];
      message.suggestedQueries = (parsed.suggestedQueries || []).map((q) => ({ query: q }));
    } catch (e) {
      console.error("Failed to parse structured response:", e);
    }
  }
}
async function getChatSessions() {
  return Array.from(storage.sessions.values()).filter((s) => s.isActive).sort((a, b) => b.createdAt - a.createdAt);
}
async function getMessagesForChatSession(chatSessionId) {
  return storage.messages.get(chatSessionId) || [];
}
async function deleteChatSession(id) {
  const session = storage.sessions.get(id);
  if (session) {
    session.isActive = false;
  }
}

// src/styles/tokens.ts
var colors = {
  // Base colors
  black: "rgba(0, 0, 0, 1)",
  white: "rgba(255, 255, 255, 1)",
  // Gray scale
  gray: {
    10: "rgba(244, 244, 244, 1)",
    20: "rgba(224, 224, 224, 1)",
    30: "rgba(198, 198, 198, 1)",
    40: "rgba(168, 168, 168, 1)",
    50: "rgba(141, 141, 141, 1)",
    60: "rgba(111, 111, 111, 1)",
    70: "rgba(82, 82, 82, 1)",
    80: "rgba(57, 57, 57, 1)",
    90: "rgba(38, 38, 38, 1)",
    100: "rgba(22, 22, 22, 1)"
  },
  // Accent colors
  blue: {
    50: "rgba(69, 137, 255, 1)",
    60: "rgba(15, 98, 254, 1)",
    70: "rgba(0, 67, 206, 1)"
  },
  // LLM chat interface colors
  chat: {
    // User message
    userBg: "rgba(100, 100, 255, 0.1)",
    userText: "rgba(255, 255, 255, 0.9)",
    // Assistant message
    assistantBg: "rgba(255, 255, 255, 0.05)",
    assistantText: "rgba(255, 255, 255, 0.8)",
    // System message
    systemBg: "rgba(255, 200, 0, 0.1)",
    systemText: "rgba(255, 200, 0, 0.9)"
  },
  // Status colors
  success: "rgba(100, 255, 100, 0.8)",
  warning: "rgba(255, 200, 0, 0.9)",
  error: "rgba(255, 100, 100, 0.8)",
  info: "rgba(100, 200, 255, 0.8)"
};
var typography = {
  fontFamily: {
    mono: "'TX02Mono-Regular', 'SF Mono', Monaco, Inconsolata, 'Roboto Mono', 'Source Code Pro', monospace",
    title: "'TX02Mono-Regular', 'SF Mono', Monaco, Inconsolata, 'Roboto Mono', 'Source Code Pro', monospace",
    ui: "'TX02Mono-Regular', 'SF Mono', Monaco, Inconsolata, 'Roboto Mono', 'Source Code Pro', monospace"
  },
  fontSize: {
    xs: "0.75rem",
    // 12px
    sm: "0.875rem",
    // 14px
    base: "1rem",
    // 16px
    lg: "1.125rem",
    // 18px
    xl: "1.25rem",
    // 20px
    "2xl": "1.5rem",
    // 24px
    "3xl": "2rem",
    // 32px
    "4xl": "2.5rem"
    // 40px
  },
  fontWeight: {
    normal: "400",
    medium: "500",
    semibold: "600",
    bold: "700"
  },
  lineHeight: {
    tight: "1.1",
    base: "1.5",
    relaxed: "1.6",
    loose: "1.75"
  },
  letterSpacing: {
    tight: "-0.03em",
    normal: "0",
    wide: "0.05em"
  }
};
var spacing = {
  xs: "0.25rem",
  // 4px
  sm: "0.5rem",
  // 8px
  md: "1rem",
  // 16px
  lg: "1.5rem",
  // 24px
  xl: "2rem",
  // 32px
  "2xl": "3rem",
  // 48px
  "3xl": "4rem",
  // 64px
  "4xl": "5rem",
  // 80px
  "5xl": "6rem"
  // 96px
};
var borderRadius = {
  none: "0",
  sm: "0.125rem",
  // 2px
  base: "0.25rem",
  // 4px
  md: "0.375rem",
  // 6px
  lg: "0.5rem",
  // 8px
  xl: "0.75rem",
  // 12px
  "2xl": "1rem",
  // 16px
  full: "9999px"
};
var shadows = {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  base: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
  inner: "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)",
  none: "none"
};
var zIndex = {
  base: 1,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modal: 40,
  popover: 50,
  tooltip: 60,
  notification: 70
};
var transitions = {
  duration: {
    fast: "0.15s",
    base: "0.2s",
    slow: "0.3s",
    slower: "0.5s"
  },
  timing: {
    linear: "linear",
    ease: "ease",
    easeIn: "ease-in",
    easeOut: "ease-out",
    easeInOut: "ease-in-out"
  },
  // Common transition combinations
  all: "all 0.2s ease",
  colors: "color 0.15s ease, background-color 0.15s ease, border-color 0.15s ease",
  transform: "transform 0.2s ease",
  opacity: "opacity 0.2s ease"
};
var easings = {
  spring: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
  snappy: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
  bounce: "cubic-bezier(0.68, -0.55, 0.265, 1.55)"
};
var devtools = {
  backgrounds: {
    glass: "rgba(0, 0, 0, 0.8)",
    panel: "rgba(0, 0, 0, 0.95)",
    hover: "rgba(255, 255, 255, 0.05)",
    active: "rgba(255, 255, 255, 0.1)"
  },
  borders: {
    subtle: "rgba(255, 255, 255, 0.06)",
    normal: "rgba(255, 255, 255, 0.1)",
    strong: "rgba(255, 255, 255, 0.15)"
  },
  text: {
    primary: "rgba(255, 255, 255, 0.95)",
    secondary: "rgba(255, 255, 255, 0.7)",
    muted: "rgba(255, 255, 255, 0.5)",
    placeholder: "rgba(255, 255, 255, 0.3)"
  },
  accent: {
    blue: "#4589FF",
    green: "#42C442",
    orange: "#FF8C00",
    red: "#FF5555",
    purple: "#BD93F9"
  }
};

// src/styles/theme.ts
var darkTheme = {
  // Core colors - inspired by modern IDEs and dev tools
  background: devtools.backgrounds.glass,
  foreground: devtools.text.primary,
  border: devtools.borders.normal,
  borderSubdued: devtools.borders.subtle,
  // Interactive states - smooth, professional feel
  hover: devtools.backgrounds.hover,
  active: devtools.backgrounds.active,
  focus: devtools.accent.blue,
  disabled: "rgba(255, 255, 255, 0.3)",
  // Semantic colors
  primary: devtools.accent.blue,
  primaryHover: "rgba(69, 137, 255, 0.8)",
  secondary: devtools.backgrounds.hover,
  secondaryHover: devtools.backgrounds.active,
  muted: devtools.text.secondary,
  accent: devtools.accent.blue,
  // Chat interface
  chat: {
    background: "rgba(0, 0, 0, 0.5)",
    userBg: colors.chat.userBg,
    userText: colors.chat.userText,
    assistantBg: colors.chat.assistantBg,
    assistantText: colors.chat.assistantText,
    systemBg: colors.chat.systemBg,
    systemText: colors.chat.systemText,
    inputBg: "rgba(255, 255, 255, 0.05)",
    inputBorder: "rgba(255, 255, 255, 0.1)",
    inputFocus: "rgba(255, 255, 255, 0.2)"
  },
  // Component specific - professional developer tools
  toolbar: {
    background: devtools.backgrounds.glass,
    backdropFilter: "blur(20px) saturate(180%)",
    shadow: "0 20px 40px rgba(0, 0, 0, 0.4), 0 8px 16px rgba(0, 0, 0, 0.2)"
  },
  dropdown: {
    background: devtools.backgrounds.panel,
    border: devtools.borders.normal,
    shadow: "0 8px 32px rgba(0, 0, 0, 0.5), 0 4px 16px rgba(0, 0, 0, 0.3)"
  },
  button: {
    primary: {
      background: devtools.accent.blue,
      text: colors.white,
      hover: "rgba(69, 137, 255, 0.8)",
      active: "rgba(69, 137, 255, 0.9)",
      border: devtools.accent.blue
    },
    secondary: {
      background: devtools.backgrounds.hover,
      text: devtools.text.primary,
      hover: "rgba(255, 255, 255, 0.12)",
      active: "rgba(255, 255, 255, 0.16)",
      border: devtools.borders.normal
    },
    ghost: {
      background: "transparent",
      text: devtools.text.secondary,
      hover: devtools.backgrounds.hover,
      active: devtools.backgrounds.active,
      border: "transparent"
    }
  },
  status: {
    success: devtools.accent.green,
    warning: devtools.accent.orange,
    error: devtools.accent.red,
    info: devtools.accent.blue
  }
};
var lightTheme = {
  // Core colors
  background: colors.white,
  foreground: colors.black,
  border: colors.gray[20],
  borderSubdued: "rgba(168, 168, 168, 0.2)",
  // Interactive states
  hover: "rgba(0, 0, 0, 0.02)",
  active: "rgba(0, 0, 0, 0.04)",
  focus: colors.blue[50],
  disabled: "rgba(0, 0, 0, 0.3)",
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
    userBg: "rgba(100, 100, 255, 0.1)",
    userText: colors.black,
    assistantBg: colors.white,
    assistantText: colors.black,
    systemBg: "rgba(255, 200, 0, 0.1)",
    systemText: "rgba(180, 140, 0, 1)",
    inputBg: colors.white,
    inputBorder: colors.gray[20],
    inputFocus: colors.blue[50]
  },
  // Component specific
  toolbar: {
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    shadow: shadows.lg
  },
  dropdown: {
    background: colors.white,
    border: colors.gray[20],
    shadow: shadows.xl
  },
  button: {
    primary: {
      background: colors.black,
      text: colors.white,
      hover: colors.blue[50],
      active: colors.blue[60],
      border: colors.black
    },
    secondary: {
      background: colors.white,
      text: colors.black,
      hover: colors.blue[50],
      active: colors.blue[60],
      border: colors.gray[20]
    },
    ghost: {
      background: "transparent",
      text: colors.gray[60],
      hover: colors.gray[10],
      active: colors.gray[20],
      border: "transparent"
    }
  },
  status: {
    success: "rgba(0, 150, 0, 1)",
    warning: "rgba(200, 140, 0, 1)",
    error: "rgba(200, 0, 0, 1)",
    info: "rgba(0, 100, 200, 1)"
  }
};
var createThemeCSS = (selectedTheme = darkTheme) => {
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
      --spacing-2xl: ${spacing["2xl"]};
      --spacing-3xl: ${spacing["3xl"]};
      
      /* Border radius */
      --radius-sm: ${borderRadius.sm};
      --radius-base: ${borderRadius.base};
      --radius-md: ${borderRadius.md};
      --radius-lg: ${borderRadius.lg};
      --radius-xl: ${borderRadius.xl};
      --radius-2xl: ${borderRadius["2xl"]};
      
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

// src/styles/utilities.ts
var text = {
  xs: `font-size: ${typography.fontSize.xs}; line-height: ${typography.lineHeight.base};`,
  sm: `font-size: ${typography.fontSize.sm}; line-height: ${typography.lineHeight.base};`,
  base: `font-size: ${typography.fontSize.base}; line-height: ${typography.lineHeight.base};`,
  lg: `font-size: ${typography.fontSize.lg}; line-height: ${typography.lineHeight.base};`,
  xl: `font-size: ${typography.fontSize.xl}; line-height: ${typography.lineHeight.tight};`,
  "2xl": `font-size: ${typography.fontSize["2xl"]}; line-height: ${typography.lineHeight.tight};`,
  "3xl": `font-size: ${typography.fontSize["3xl"]}; line-height: ${typography.lineHeight.tight};`,
  "4xl": `font-size: ${typography.fontSize["4xl"]}; line-height: ${typography.lineHeight.tight};`
};
var fontWeight = {
  normal: `font-weight: ${typography.fontWeight.normal};`,
  medium: `font-weight: ${typography.fontWeight.medium};`,
  semibold: `font-weight: ${typography.fontWeight.semibold};`,
  bold: `font-weight: ${typography.fontWeight.bold};`
};
var fontFamily = {
  mono: `font-family: ${typography.fontFamily.mono};`,
  title: `font-family: ${typography.fontFamily.title};`
};
var flex = {
  center: `display: flex; align-items: center; justify-content: center;`,
  centerY: `display: flex; align-items: center;`,
  centerX: `display: flex; justify-content: center;`,
  between: `display: flex; justify-content: space-between;`,
  around: `display: flex; justify-content: space-around;`,
  col: `display: flex; flex-direction: column;`,
  colCenter: `display: flex; flex-direction: column; align-items: center;`,
  colBetween: `display: flex; flex-direction: column; justify-content: space-between;`,
  wrap: `display: flex; flex-wrap: wrap;`,
  nowrap: `display: flex; flex-wrap: nowrap;`
};
var overflow = {
  hidden: `overflow: hidden;`,
  auto: `overflow: auto;`,
  scroll: `overflow: scroll;`,
  visible: `overflow: visible;`,
  hiddenX: `overflow-x: hidden;`,
  hiddenY: `overflow-y: hidden;`,
  autoX: `overflow-x: auto;`,
  autoY: `overflow-y: auto;`
};
var padding = {
  xs: `padding: ${spacing.xs};`,
  sm: `padding: ${spacing.sm};`,
  md: `padding: ${spacing.md};`,
  lg: `padding: ${spacing.lg};`,
  xl: `padding: ${spacing.xl};`,
  "2xl": `padding: ${spacing["2xl"]};`,
  "3xl": `padding: ${spacing["3xl"]};`,
  // Directional padding
  x: {
    xs: `padding-left: ${spacing.xs}; padding-right: ${spacing.xs};`,
    sm: `padding-left: ${spacing.sm}; padding-right: ${spacing.sm};`,
    md: `padding-left: ${spacing.md}; padding-right: ${spacing.md};`,
    lg: `padding-left: ${spacing.lg}; padding-right: ${spacing.lg};`,
    xl: `padding-left: ${spacing.xl}; padding-right: ${spacing.xl};`
  },
  y: {
    xs: `padding-top: ${spacing.xs}; padding-bottom: ${spacing.xs};`,
    sm: `padding-top: ${spacing.sm}; padding-bottom: ${spacing.sm};`,
    md: `padding-top: ${spacing.md}; padding-bottom: ${spacing.md};`,
    lg: `padding-top: ${spacing.lg}; padding-bottom: ${spacing.lg};`,
    xl: `padding-top: ${spacing.xl}; padding-bottom: ${spacing.xl};`
  }
};
var margin = {
  xs: `margin: ${spacing.xs};`,
  sm: `margin: ${spacing.sm};`,
  md: `margin: ${spacing.md};`,
  lg: `margin: ${spacing.lg};`,
  xl: `margin: ${spacing.xl};`,
  "2xl": `margin: ${spacing["2xl"]};`,
  "3xl": `margin: ${spacing["3xl"]};`,
  // Directional margin
  x: {
    xs: `margin-left: ${spacing.xs}; margin-right: ${spacing.xs};`,
    sm: `margin-left: ${spacing.sm}; margin-right: ${spacing.sm};`,
    md: `margin-left: ${spacing.md}; margin-right: ${spacing.md};`,
    lg: `margin-left: ${spacing.lg}; margin-right: ${spacing.lg};`,
    xl: `margin-left: ${spacing.xl}; margin-right: ${spacing.xl};`
  },
  y: {
    xs: `margin-top: ${spacing.xs}; margin-bottom: ${spacing.xs};`,
    sm: `margin-top: ${spacing.sm}; margin-bottom: ${spacing.sm};`,
    md: `margin-top: ${spacing.md}; margin-bottom: ${spacing.md};`,
    lg: `margin-top: ${spacing.lg}; margin-bottom: ${spacing.lg};`,
    xl: `margin-top: ${spacing.xl}; margin-bottom: ${spacing.xl};`
  }
};
var rounded = {
  none: `border-radius: ${borderRadius.none};`,
  sm: `border-radius: ${borderRadius.sm};`,
  base: `border-radius: ${borderRadius.base};`,
  md: `border-radius: ${borderRadius.md};`,
  lg: `border-radius: ${borderRadius.lg};`,
  xl: `border-radius: ${borderRadius.xl};`,
  "2xl": `border-radius: ${borderRadius["2xl"]};`,
  full: `border-radius: ${borderRadius.full};`
};
var shadow = {
  none: `box-shadow: ${shadows.none};`,
  sm: `box-shadow: ${shadows.sm};`,
  base: `box-shadow: ${shadows.base};`,
  md: `box-shadow: ${shadows.md};`,
  lg: `box-shadow: ${shadows.lg};`,
  xl: `box-shadow: ${shadows.xl};`,
  "2xl": `box-shadow: ${shadows["2xl"]};`,
  inner: `box-shadow: ${shadows.inner};`
};
var bg = {
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
    input: `background: var(--theme-chat-input-bg);`
  }
};
var textColor = {
  primary: `color: var(--theme-foreground);`,
  secondary: `color: var(--theme-muted);`,
  muted: `color: var(--theme-muted);`,
  accent: `color: var(--theme-accent);`,
  disabled: `color: var(--theme-disabled);`,
  chat: {
    user: `color: var(--theme-chat-user-text);`,
    assistant: `color: var(--theme-chat-assistant-text);`,
    system: `color: var(--theme-chat-system-text);`
  },
  status: {
    success: `color: var(--theme-status-success);`,
    warning: `color: var(--theme-status-warning);`,
    error: `color: var(--theme-status-error);`,
    info: `color: var(--theme-status-info);`
  }
};
var transition = {
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
  `
};
var chat = {
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
  `
};
var button = {
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
  `
};
var animations = `
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
var responsive = {
  mobile: (styles2) => `
    @media (max-width: 768px) {
      ${styles2}
    }
  `,
  tablet: (styles2) => `
    @media (min-width: 769px) and (max-width: 1024px) {
      ${styles2}
    }
  `,
  desktop: (styles2) => `
    @media (min-width: 1025px) {
      ${styles2}
    }
  `,
  smallScreen: (styles2) => `
    @media (max-width: 480px) {
      ${styles2}
    }
  `
};
var focus = {
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
  `
};
var loading = {
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
      content: '\u258B';
      display: inline-block;
      vertical-align: text-bottom;
      animation: streamingPulse 1s infinite;
      opacity: 0.7;
      margin-left: 2px;
    }
  `
};
var scrollbar = {
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
  `
};
var devtools2 = {
  // Glass morphism panels
  panel: `
    background: ${devtools.backgrounds.glass};
    backdrop-filter: blur(20px) saturate(180%);
    border: 1px solid ${devtools.borders.normal};
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
    background: ${devtools.backgrounds.panel};
    color: ${devtools.text.primary};
    ${text.xs}
    ${padding.sm}
    ${rounded.md}
    border: 1px solid ${devtools.borders.subtle};
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
      border-top-color: ${devtools.borders.normal};
    }
  `,
  // Code editor styling
  codeEditor: `
    ${fontFamily.mono}
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid ${devtools.borders.subtle};
    ${rounded.md}
    ${padding.md}
    color: ${devtools.text.primary};
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
    background: ${devtools.backgrounds.active};
    color: ${devtools.text.secondary};
    border: 1px solid ${devtools.borders.subtle};
    gap: 4px;
    
    &.success {
      background: rgba(66, 196, 66, 0.15);
      color: ${devtools.accent.green};
      border-color: rgba(66, 196, 66, 0.3);
    }
    
    &.warning {
      background: rgba(255, 140, 0, 0.15);
      color: ${devtools.accent.orange};
      border-color: rgba(255, 140, 0, 0.3);
    }
    
    &.error {
      background: rgba(255, 85, 85, 0.15);
      color: ${devtools.accent.red};
      border-color: rgba(255, 85, 85, 0.3);
    }
  `,
  // Professional loading states
  loading: {
    shimmer: `
      background: linear-gradient(
        90deg,
        ${devtools.backgrounds.hover} 25%,
        ${devtools.backgrounds.active} 50%,
        ${devtools.backgrounds.hover} 75%
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
    `
  },
  // Modern dropdown styling
  dropdown: `
    background: ${devtools.backgrounds.panel};
    border: 1px solid ${devtools.borders.normal};
    ${rounded.lg}
    ${shadow.xl}
    backdrop-filter: blur(20px);
    overflow: hidden;
    
    .dropdown-item {
      ${padding.sm}
      ${text.sm}
      color: ${devtools.text.primary};
      cursor: pointer;
      ${transition.colors}
      
      &:hover {
        background: ${devtools.backgrounds.hover};
      }
      
      &:active, &.selected {
        background: ${devtools.backgrounds.active};
        color: ${devtools.accent.blue};
      }
    }
    
    .dropdown-separator {
      height: 1px;
      background: ${devtools.borders.subtle};
      margin: 4px 0;
    }
  `
};

// src/components/Toolbar.styles.ts
var styles = `
/* Font loading */
@font-face {
  font-family: 'TX02Mono-Regular';
  src: url('https://intdev-global.s3.us-west-2.amazonaws.com/public/internet-dev/e049dfb6-9c5d-4ac4-97c2-eb6e95c61d09.woff2') format('woff2');
  font-display: swap;
}

/* Theme variables */
${createThemeCSS(darkTheme)}

/* Animation keyframes */
${animations}

/* Base styles */
* {
  box-sizing: border-box;
  ${fontFamily.mono}
}

/* Main toolbar container - world-class developer tools */
.toolbar {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 420px;
  height: 600px;
  ${devtools2.panel}
  ${textColor.primary}
  ${flex.col}
  ${overflow.hidden}
  z-index: 1000;
  pointer-events: auto;
  will-change: transform, opacity, filter;
  
  /* Enhanced glass morphism effect */
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.4),
    0 8px 16px rgba(0, 0, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  
  /* Entrance animation */
  animation: toolbarEntrance 0.5s ${easings.spring} forwards;
  
  /* Smooth transitions for state changes */
  transition: 
    width 0.4s ${easings.spring},
    height 0.4s ${easings.spring},
    transform 0.3s ${easings.smooth},
    box-shadow 0.3s ${easings.smooth};
  
  /* Hover effect */
  &:hover {
    box-shadow: 
      0 24px 48px rgba(0, 0, 0, 0.45),
      0 12px 20px rgba(0, 0, 0, 0.25),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
  }
  
  ${responsive.mobile(`
    width: calc(100vw - 24px);
    height: calc(100vh - 100px);
    bottom: 12px;
    right: 12px;
    left: 12px;
    max-width: 400px;
    margin: 0 auto;
  `)}
}

/* Initial hidden state */
.toolbar.opacity-0 {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.toolbar.minimized {
  height: 60px;
  ${overflow.hidden}
  
  /* Smooth minimization transition */
  & .header {
    border-bottom-color: transparent;
  }
  
  & .latest-message {
    animation: fadeIn 0.3s ${easings.smooth} forwards;
  }
}

/* Header section */
.header {
  ${flex.between}
  ${padding.sm}
  border-bottom: 1px solid var(--theme-border);
  ${text.sm}
  height: 44px;
  flex-shrink: 0;
  background: var(--theme-background);
}

.header-left {
  ${flex.centerY}
  gap: var(--spacing-sm);
  min-width: 0;
  flex: 1;
}

.chat-title {
  opacity: 0.8;
  cursor: pointer;
  ${padding.sm}
  ${rounded.base}
  ${transition.colors}
  white-space: nowrap;
  ${overflow.hidden}
  text-overflow: ellipsis;
  min-width: 0;
  flex: 1;
  
  &:hover {
    ${bg.hover}
    opacity: 1;
  }
}

/* Control buttons - professional developer tools style */
.controls {
  ${flex.centerY}
  gap: var(--spacing-sm);
  width: 100%;
  justify-content: flex-start;
}

.control-button {
  ${button.base}
  ${button.ghost}
  ${button.icon}
  ${text.sm}
  ${devtools2.interactive}
  border-radius: 8px;
  position: relative;
  overflow: hidden;
  ${transition.button}
  
  /* Hover shimmer effect */
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 100%;
    transform: translate(-50%, -50%) scale(0);
    background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
    opacity: 0;
    transition: transform 0.4s ${easings.spring}, opacity 0.3s ${easings.smooth};
  }
  
  &:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.15);
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
    
    &::after {
      transform: translate(-50%, -50%) scale(2);
      opacity: 1;
    }
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
    transition-duration: 0.1s;
  }
  
  &.active {
    background: var(--theme-accent);
    color: white;
    border-color: var(--theme-accent);
    box-shadow: 
      0 0 0 1px var(--theme-accent),
      0 4px 12px rgba(69, 137, 255, 0.3);
    animation: selectionPulse 2s infinite;
  }
  
  &.active::before {
    content: '';
    position: absolute;
    inset: -1px;
    background: linear-gradient(135deg, transparent, rgba(255, 255, 255, 0.1));
    border-radius: inherit;
    pointer-events: none;
    opacity: 0;
    animation: shimmer 3s infinite;
  }
  
  svg {
    width: 16px;
    height: 16px;
    display: block;
    transition: transform 0.2s ${easings.spring};
  }
  
  &:hover svg {
    transform: rotate(5deg) scale(1.1);
  }
  
  &:active svg {
    transform: scale(0.9);
  }
}

/* Chat sessions and dropdowns */
.chats-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--theme-dropdown-background);
  ${rounded.lg}
  ${margin.xs}
  max-height: 300px;
  ${overflow.autoY}
  box-shadow: var(--theme-dropdown-shadow);
  z-index: var(--z-index-dropdown);
  border: 1px solid var(--theme-border);
  ${scrollbar.thin}
  
  /* Dropdown entrance animation */
  animation: dropdownEntrance 0.3s ${easings.spring} forwards;
  transform-origin: top center;
}

.chat-item {
  ${padding.sm}
  cursor: pointer;
  ${flex.between}
  ${transition.colors}
  
  &:hover {
    ${bg.hover}
  }
}

.chat-item-title {
  flex: 1;
  margin-right: var(--spacing-sm);
  white-space: nowrap;
  ${overflow.hidden}
  text-overflow: ellipsis;
}

.chat-item-actions {
  opacity: 0;
  ${transition.opacity}
  ${flex.centerY}
  gap: var(--spacing-sm);
  
  .chat-item:hover & {
    opacity: 1;
  }
}

.chat-item-button {
  ${button.base}
  ${button.ghost}
  ${button.sm}
  ${text.xs}
  
  &:hover {
    ${textColor.primary}
    ${bg.hover}
  }
}

/* Documentation and suggestions */
.docs-section {
  margin-top: var(--spacing-sm);
  padding-top: var(--spacing-sm);
  border-top: 1px solid var(--theme-border);
}

.docs-link {
  ${flex.col}
  gap: var(--spacing-xs);
  ${padding.sm}
  ${bg.muted}
  ${rounded.base}
  margin-bottom: var(--spacing-sm);
  cursor: pointer;
  ${transition.colors}
  text-decoration: none;
  color: inherit;
  
  &:hover {
    ${bg.hover}
  }
}

.docs-link-title {
  font-weight: 500;
  ${textColor.primary}
  ${text.sm}
}

.docs-link-description {
  ${text.xs}
  ${textColor.muted}
}

.suggested-queries {
  margin-top: var(--spacing-sm);
  padding-top: var(--spacing-sm);
  border-top: 1px solid var(--theme-border);
}

.suggested-queries-title {
  ${text.xs}
  ${textColor.muted}
  margin-bottom: var(--spacing-sm);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.suggested-queries-list {
  ${flex.wrap}
  gap: var(--spacing-sm);
}

.suggested-query {
  ${padding.xs}
  ${bg.muted}
  ${rounded.base}
  ${text.xs}
  cursor: pointer;
  ${transition.colors}
  
  &:hover {
    ${bg.hover}
    ${textColor.primary}
  }
}

/* Messages container - modern LLM chat layout */
.messages {
  flex: 1;
  ${overflow.autoY}
  ${padding.md}
  ${flex.col}
  gap: var(--spacing-md);
  ${scrollbar.thin}
  scroll-behavior: smooth;
}

.message {
  ${chat.message}
  opacity: 0;
  animation: slideIn 0.4s ${easings.spring} forwards;
  animation-delay: 0.05s;
  
  /* Hover effect for messages */
  transition: transform 0.2s ${easings.smooth}, box-shadow 0.2s ${easings.smooth};
  
  &:hover {
    transform: translateX(2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.user-message {
  ${chat.userMessage}
  ${bg.chat.user}
  ${textColor.chat.user}
  align-self: flex-end;
  max-width: 85%;
  ${responsive.mobile("max-width: 95%;")}
}

.assistant-message {
  ${chat.assistantMessage}
  ${bg.chat.assistant}
  ${textColor.chat.assistant}
  align-self: flex-start;
  max-width: 100%;
  
  pre {
    background: var(--theme-hover);
    ${padding.sm}
    ${rounded.base}
    ${overflow.autoX}
    ${text.xs}
    ${fontFamily.mono}
    margin: var(--spacing-sm) 0;
    ${scrollbar.thin}
  }
  
  code {
    background: var(--theme-hover);
    ${padding.xs}
    ${rounded.sm}
    ${text.xs}
    ${fontFamily.mono}
  }
  
  ul, ol {
    margin: var(--spacing-sm) 0;
    padding-left: var(--spacing-lg);
  }
  
  p {
    margin: var(--spacing-sm) 0;
    
    &:first-child {
      margin-top: 0;
    }
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  h1, h2, h3, h4, h5, h6 {
    margin: var(--spacing-md) 0 var(--spacing-sm) 0;
    font-weight: 500;
    
    &:first-child {
      margin-top: 0;
    }
  }
  
  blockquote {
    border-left: 3px solid var(--theme-accent);
    ${padding.sm}
    margin: var(--spacing-sm) 0;
    background: var(--theme-hover);
    ${textColor.muted}
  }
}

/* Relevant files section */
.relevant-files {
  ${flex.wrap}
  gap: var(--spacing-sm);
  margin-top: var(--spacing-sm);
  padding-top: var(--spacing-sm);
  border-top: 1px solid var(--theme-border);
}

.relevant-file {
  ${flex.centerY}
  gap: var(--spacing-xs);
  ${padding.xs}
  ${bg.muted}
  ${rounded.base}
  ${text.xs}
  cursor: pointer;
  ${transition.colors}
  max-width: 100%;
  ${overflow.hidden}
  
  &:hover {
    ${bg.hover}
    ${textColor.primary}
  }
}

.file-path {
  ${overflow.hidden}
  text-overflow: ellipsis;
  white-space: nowrap;
  ${fontFamily.mono}
}

.chat-sessions {
  display: flex;
  gap: 8px;
  padding: 8px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  overflow-x: auto;
}

.chat-tab {
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  white-space: nowrap;
  transition: background 0.2s ease;
}

.chat-tab:hover {
  background: rgba(255, 255, 255, 0.15);
}

.chat-tab.active {
  background: rgba(255, 255, 255, 0.2);
}

.new-chat-button {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.9);
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.new-chat-button:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

/* Legacy input area styles - kept for compatibility */
.input-area {
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.8);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 16px;
  display: flex;
  gap: 12px;
  backdrop-filter: blur(10px);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  padding: 32px;
  color: rgba(255, 255, 255, 0.8);
}

.empty-state-title {
  font-size: 20px;
  margin-bottom: 12px;
  font-weight: 500;
}

.empty-state-description {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 24px;
  max-width: 280px;
  line-height: 1.5;
}

.content-tabs {
  display: flex;
  gap: 2px;
  padding: 8px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  height: 44px;
  flex-shrink: 0;
}

.content-tab {
  padding: 4px 8px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.content-tab:hover {
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.1);
}

.content-tab.active {
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.1);
}

.content-section {
  position: absolute;
  inset: 88px 0 60px 0;
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
  overflow-y: auto;
  padding: 12px;
}

.content-section.active {
  opacity: 1;
  pointer-events: all;
}

.files-grid, .docs-grid {
  display: grid;
  gap: 8px;
  padding: 12px;
}

.file-card, .doc-card {
  background: rgba(255, 255, 255, 0.05);
  padding: 8px;
  border-radius: 4px;
  transition: background 0.2s ease;
  cursor: pointer;
}

.file-card:hover, .doc-card:hover {
  background: rgba(255, 255, 255, 0.1);
}

.file-card-path {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 4px;
}

.file-card-reason {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
}

.doc-card-title {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 4px;
}

.doc-card-description {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
}

.loading-title {
  display: flex;
  align-items: center;
  gap: 8px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
}

.loading-dots {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-left: 4px;
}

.loading-dot {
  width: 3px;
  height: 3px;
  background: currentColor;
  border-radius: 50%;
  animation: typingDot 1.4s infinite ${easings.smooth};
  opacity: 0.5;
  will-change: transform, opacity;
}

.loading-dot:nth-child(2) {
  animation-delay: 0.16s;
}

.loading-dot:nth-child(3) {
  animation-delay: 0.32s;
}

/* Streaming response animation */
.assistant-message.streaming {
  ${loading.streamingCursor}
}

/* Messages Container */
.messages-container {
  flex: 1;
  ${overflow.autoY}
  ${padding.md}
  ${flex.col}
  gap: var(--spacing-md);
  scroll-behavior: smooth;
  ${scrollbar.thin}
}

.message-wrapper {
  animation: fadeIn 0.3s ease;
}

/* Modern LLM Chat Input Area - Next.js DevTools inspired */
.input-area {
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  flex-shrink: 0;
  ${padding.sm}
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.1),
      transparent
    );
  }
}

.input-form {
  margin-bottom: var(--spacing-sm);
}

.input-area .input {
  ${chat.input}
  ${focus.ring}
  
  /* Smooth focus transition */
  &:focus {
    animation: selectionPulse 2s infinite;
  }
  
  /* Placeholder animation */
  &::placeholder {
    transition: opacity 0.3s ${easings.smooth};
  }
  
  &:focus::placeholder {
    opacity: 0.5;
  }
  
  ${responsive.mobile(`
    font-size: 16px; /* Prevents zoom on iOS */
  `)}
}

.input-controls {
  ${flex.between}
  gap: var(--spacing-sm);
}

.control-icon-button {
  ${button.base}
  ${button.ghost}
  ${padding.sm}
  ${rounded.md}
  width: 36px;
  height: 36px;
  
  &.active {
    background: var(--theme-accent);
    color: var(--theme-background);
  }
  
  svg {
    width: 18px;
    height: 18px;
  }
}

.send-button {
  ${button.base}
  ${button.primary}
  ${padding.sm}
  ${rounded.lg}
  ${text.base}
  min-width: 44px;
  height: 36px;
  margin-left: auto;
  position: relative;
  overflow: hidden;
  ${transition.button}
  
  /* Ripple effect container */
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    transform: translate(-50%, -50%);
    transition: width 0.6s, height 0.6s;
  }
  
  /* Shimmer effect */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      105deg,
      transparent 40%,
      rgba(255, 255, 255, 0.2) 50%,
      transparent 60%
    );
    animation: shimmer 2s infinite;
    animation-play-state: paused;
  }
  
  &:hover:not(:disabled) {
    background: rgba(69, 137, 255, 0.9);
    transform: translateY(-2px) scale(1.05);
    box-shadow: 
      0 8px 20px rgba(69, 137, 255, 0.35),
      0 4px 8px rgba(0, 0, 0, 0.2);
      
    &::after {
      animation-play-state: running;
    }
  }
  
  &:active:not(:disabled) {
    transform: translateY(0) scale(1);
    transition-duration: 0.1s;
    
    &::before {
      width: 120px;
      height: 120px;
    }
  }
  
  &:disabled {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.3);
    transform: none;
    box-shadow: none;
    cursor: not-allowed;
    
    &::after {
      display: none;
    }
  }
  
  /* Sending state animation */
  &:disabled:not(.error) {
    &::after {
      content: '';
      display: block;
      position: absolute;
      inset: 0;
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255, 255, 255, 0.1) 50%,
        transparent 100%
      );
      animation: shimmer 1s infinite;
    }
  }
}

/* Minimized state */
.minimized .messages,
.minimized .input-area {
  display: none;
}

.minimized .latest-message {
  display: block;
  ${padding.sm}
  white-space: nowrap;
  ${overflow.hidden}
  text-overflow: ellipsis;
  line-height: 40px;
  ${textColor.muted}
}

/* Model Selector Styles */
.model-selector {
  position: relative;
  z-index: var(--z-index-dropdown);
}

.model-selector-header {
  position: relative;
}

.model-selector-toggle {
  ${button.base}
  ${button.ghost}
  ${padding.sm}
  ${text.sm}
  ${flex.centerY}
  gap: var(--spacing-xs);
  
  &:hover {
    opacity: 0.8;
  }
}

.selected-model-info {
  ${flex.col}
  align-items: flex-start;
  text-align: left;
}

.model-name {
  ${text.xs}
  font-weight: 500;
}

.model-provider {
  font-size: 10px;
  ${textColor.muted}
}

.no-model {
  ${text.xs}
  ${textColor.muted}
}

.expand-icon {
  font-size: 10px;
  ${transition.transform}
  
  &.expanded {
    transform: rotate(180deg);
  }
}

/* Model selector dropdown */
.model-selector-dropdown {
  position: absolute;
  top: calc(100% + var(--spacing-sm));
  right: 0;
  width: 380px;
  max-height: 500px;
  background: var(--theme-dropdown-background);
  border: 1px solid var(--theme-border);
  ${rounded.lg}
  box-shadow: var(--theme-dropdown-shadow);
  ${overflow.hidden}
  ${flex.col}
  z-index: var(--z-index-popover);
  
  ${responsive.mobile(`
    width: calc(100vw - 32px);
    right: -12px;
    max-width: 380px;
  `)}
}

/* Search and filter section */
.search-section {
  ${padding.sm}
  border-bottom: 1px solid var(--theme-border);
}

.model-search-input {
  width: 100%;
  background: var(--theme-secondary);
  border: 1px solid var(--theme-border);
  ${rounded.md}
  ${padding.sm}
  ${textColor.primary}
  ${text.sm}
  ${transition.colors}
  ${fontFamily.mono}
  
  &:focus {
    outline: none;
    border-color: var(--theme-focus);
    background: var(--theme-hover);
  }
  
  &::placeholder {
    ${textColor.muted}
  }
}

/* Filter options */
.filter-options {
  margin-top: var(--spacing-sm);
}

.filter-checkbox {
  ${flex.centerY}
  gap: var(--spacing-xs);
  ${text.xs}
  ${textColor.muted}
  cursor: pointer;
  
  input[type="checkbox"] {
    width: 14px;
    height: 14px;
    cursor: pointer;
    accent-color: var(--theme-accent);
  }
}

/* Loading states */
.loading-models {
  ${flex.center}
  gap: var(--spacing-sm);
  ${padding.xl}
  ${textColor.muted}
  ${text.sm}
}

.loading-spinner {
  ${loading.spinner}
}

/* Loading dots for streaming */
.loading-dots {
  ${loading.dots}
}

.loading-dot {
  width: 3px;
  height: 3px;
  background: currentColor;
  border-radius: 50%;
  animation: pulse 1.4s infinite;
  opacity: 0.6;
  
  &:nth-child(2) {
    animation-delay: 0.2s;
  }
  
  &:nth-child(3) {
    animation-delay: 0.4s;
  }
}

.model-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.model-group {
  margin-bottom: 16px;
}

.group-title {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  font-size: 11px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 600;
  letter-spacing: 0.05em;
}

.model-count {
  font-weight: normal;
  opacity: 0.6;
}

.model-items {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.model-option {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid transparent;
  border-radius: 6px;
  padding: 10px 12px;
  cursor: pointer;
  width: 100%;
  text-align: left;
  position: relative;
  overflow: hidden;
  ${transition.all}
  
  /* Hover glow effect */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(
      circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
      rgba(255, 255, 255, 0.1) 0%,
      transparent 50%
    );
    opacity: 0;
    transition: opacity 0.3s ${easings.smooth};
    pointer-events: none;
  }
}

.model-option:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.1);
  transform: translateX(2px);
  
  &::before {
    opacity: 1;
  }
}

.model-option.selected {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  animation: selectionPulse 2s infinite;
}

.model-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.model-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.model-option .model-name {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

.model-badge {
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  background: rgba(255, 200, 0, 0.2);
  color: rgba(255, 200, 0, 0.9);
}

.model-details {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.6);
}

.model-context {
  display: flex;
  align-items: center;
  gap: 4px;
}

.model-price {
  color: rgba(100, 255, 100, 0.8);
}

.no-models {
  padding: 32px;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  font-size: 13px;
}

.model-selector-footer {
  padding: 8px 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.5);
}

.model-info-text {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  text-align: center;
}

/* Full Page Views */
.view-container {
  position: absolute;
  inset: 0;
  background: var(--theme-background);
  z-index: var(--z-index-modal);
  ${flex.col}
  ${overflow.hidden}
  opacity: 0;
  animation: viewSlideIn 0.3s ${easings.spring} forwards;
}

.view-header {
  ${flex.between}
  ${padding.md}
  border-bottom: 1px solid var(--theme-border);
  flex-shrink: 0;
}

.view-title {
  ${text.xl}
  font-weight: 500;
  ${textColor.primary}
}

.view-close {
  ${button.base}
  ${button.ghost}
  ${padding.sm}
  ${rounded.base}
  ${text.xl}
  line-height: 1;
  width: 36px;
  height: 36px;
  
  &:hover {
    ${bg.hover}
    ${textColor.primary}
  }
}

.view-content {
  flex: 1;
  ${overflow.autoY}
  ${padding.lg}
  ${scrollbar.thin}
}

/* Settings View */
.settings-section {
  margin-bottom: var(--spacing-2xl);
}

.settings-label {
  display: block;
  ${text.sm}
  ${textColor.primary}
  margin-bottom: var(--spacing-sm);
  font-weight: 500;
}

.settings-input {
  width: 100%;
  background: var(--theme-secondary);
  border: 1px solid var(--theme-border);
  ${rounded.lg}
  ${padding.md}
  ${textColor.primary}
  ${text.sm}
  ${transition.colors}
  ${fontFamily.mono}
  
  &:focus {
    outline: none;
    border-color: var(--theme-focus);
    background: var(--theme-hover);
  }
  
  &::placeholder {
    ${textColor.muted}
  }
}

.settings-hint {
  ${text.xs}
  ${textColor.muted}
  margin-top: var(--spacing-xs);
  
  a {
    color: var(--theme-accent);
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
}

.settings-button {
  ${button.base}
  ${button.primary}
  ${button.md}
  margin-top: var(--spacing-md);
}

/* Models View */
.models-grid {
  display: grid;
  gap: 16px;
}

.model-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  ${transition.all}
  will-change: transform, box-shadow;
  
  /* Gradient border animation */
  &::before {
    content: '';
    position: absolute;
    inset: -2px;
    background: linear-gradient(
      45deg,
      transparent,
      var(--theme-accent),
      transparent
    );
    border-radius: inherit;
    opacity: 0;
    z-index: -1;
    transition: opacity 0.3s ${easings.smooth};
  }
}

.model-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-4px) scale(1.02);
  box-shadow: 
    0 12px 24px rgba(0, 0, 0, 0.2),
    0 8px 16px rgba(69, 137, 255, 0.1);
  
  &::before {
    opacity: 0.5;
    animation: shimmer 2s linear infinite;
  }
}

.model-card.selected {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  box-shadow: 
    0 0 0 2px var(--theme-accent),
    0 8px 16px rgba(69, 137, 255, 0.2);
  
  &::before {
    opacity: 1;
  }
}

.model-card-header {
  display: flex;
  align-items: start;
  justify-content: space-between;
  margin-bottom: 12px;
}

.model-card-name {
  font-size: 16px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
}

.model-card-provider {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 4px;
}

.model-card-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

.model-card-badge.recommended {
  background: rgba(255, 200, 0, 0.2);
  color: rgba(255, 200, 0, 0.9);
}

.model-card-specs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 12px;
}

.model-spec {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.model-spec-label {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.model-spec-value {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  font-weight: 500;
}

.model-card-description {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.6);
  line-height: 1.5;
}

.api-key-prompt {
  background: rgba(255, 200, 0, 0.1);
  border: 1px solid rgba(255, 200, 0, 0.2);
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
  text-align: center;
}

.api-key-prompt-text {
  color: rgba(255, 200, 0, 0.9);
  font-size: 14px;
  margin-bottom: 12px;
}

.api-key-prompt-button {
  background: rgba(255, 200, 0, 0.2);
  border: 1px solid rgba(255, 200, 0, 0.3);
  color: rgba(255, 200, 0, 0.9);
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 13px;
}

.api-key-prompt-button:hover {
  background: rgba(255, 200, 0, 0.3);
  border-color: rgba(255, 200, 0, 0.4);
}

/* Empty States */
.empty-state {
  ${flex.colCenter}
  ${flex.center}
  height: 100%;
  text-align: center;
  ${padding.xl}
  ${textColor.primary}
}

.empty-state-title {
  ${text.xl}
  margin-bottom: var(--spacing-sm);
  font-weight: 500;
}

.empty-state-description {
  ${text.sm}
  ${textColor.muted}
  margin-bottom: var(--spacing-lg);
  max-width: 280px;
  line-height: 1.6;
}

.empty-components {
  ${flex.colCenter}
  ${flex.center}
  min-height: 200px;
  text-align: center;
  
  p {
    ${textColor.muted}
    margin-bottom: var(--spacing-md);
  }
}

.select-component-button {
  ${button.base}
  ${flex.centerY}
  gap: var(--spacing-sm);
  ${padding.sm}
  background: var(--theme-accent);
  color: var(--theme-background);
  border: 1px solid var(--theme-accent);
  ${rounded.lg}
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
}

.new-chat-button {
  ${button.base}
  ${button.primary}
  ${button.lg}
  ${flex.centerY}
  gap: var(--spacing-sm);
  
  &:hover:not(:disabled) {
    transform: translateY(-1px);
  }
}

.components-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.component-item {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 16px;
}

.component-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.component-name {
  font-size: 16px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
}

.remove-button {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  font-size: 20px;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.remove-button:hover {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
}

.component-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-value {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.8);
  font-family: 'IosevkaTerm', monospace;
}

.props-value {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  padding: 8px;
  overflow-x: auto;
  font-size: 12px;
}

.component-actions {
  margin-top: 8px;
}

.action-button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 6px;
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  padding: 6px 12px;
  font-size: 13px;
  transition: all 0.2s ease;
}

.action-button:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.2);
}

/* Component list items */
.components-list {
  ${flex.col}
  gap: var(--spacing-md);
}

.component-item {
  background: var(--theme-secondary);
  border: 1px solid var(--theme-border);
  ${rounded.lg}
  ${padding.md}
}

.component-header {
  ${flex.between}
  margin-bottom: var(--spacing-sm);
}

.component-name {
  ${text.lg}
  font-weight: 500;
  ${textColor.primary}
}

.remove-button {
  ${button.base}
  ${button.ghost}
  ${text.xl}
  line-height: 1;
  width: 24px;
  height: 24px;
  ${rounded.base}
  
  &:hover {
    ${bg.hover}
    ${textColor.primary}
  }
}

.component-details {
  ${flex.col}
  gap: var(--spacing-sm);
}

.detail-row {
  ${flex.col}
  gap: var(--spacing-xs);
}

.detail-label {
  ${text.xs}
  ${textColor.muted}
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-value {
  ${text.sm}
  ${textColor.primary}
  ${fontFamily.mono}
}

.props-value {
  background: var(--theme-hover);
  border: 1px solid var(--theme-border);
  ${rounded.base}
  ${padding.sm}
  ${overflow.autoX}
  ${text.xs}
  ${scrollbar.thin}
}

.component-actions {
  margin-top: var(--spacing-sm);
}

.action-button {
  ${button.base}
  ${button.secondary}
  ${button.sm}
}

.hook-item {
  ${text.xs}
  ${textColor.muted}
  margin-bottom: var(--spacing-xs);
  ${fontFamily.mono}
}

/* Responsive improvements */
${responsive.mobile(`
  .toolbar {
    width: calc(100vw - 24px);
    height: calc(100vh - 100px);
    bottom: 12px;
    right: 12px;
    left: 12px;
    max-width: 400px;
    margin: 0 auto;
  }
  
  .view-content {
    padding: var(--spacing-md);
  }
  
  .user-message {
    max-width: 95%;
  }
`)}

/* Dark mode optimizations */
@media (prefers-color-scheme: dark) {
  .toolbar {
    backdrop-filter: blur(20px);
  }
}

/* Component selection overlay animation */
.component-overlay {
  pointer-events: none;
  
  &.highlight {
    animation: componentHighlight 1.5s ${easings.smooth} infinite;
  }
}

/* Success/Error feedback animations */
.feedback-success {
  animation: checkmark 0.6s ${easings.spring} forwards;
}

.feedback-error {
  animation: shake 0.5s ${easings.snappy};
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .toolbar {
    border: 2px solid var(--theme-border);
  }
  
  .control-button {
    border-width: 2px;
  }
  
  /* Stronger shadows for better visibility */
  .toolbar, .model-card:hover, .send-button:hover {
    box-shadow: 
      0 0 0 2px var(--theme-foreground),
      0 8px 16px rgba(0, 0, 0, 0.8);
  }
}

/* Reduced motion support - critical for accessibility */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  
  /* Preserve essential state changes */
  .toolbar {
    animation: none;
    opacity: 1;
    transform: none;
  }
  
  .message {
    animation: none;
    opacity: 1;
  }
  
  .loading-dot {
    animation: none;
    opacity: 0.8;
  }
}
`;

// src/components/ComponentInspector.tsx
import { useEffect, useRef } from "preact/hooks";

// src/instrumentation/bippy-adapter.ts
import {
  instrument,
  getNearestHostFiber,
  traverseRenderedFibers,
  secure
} from "bippy";

// src/utils/react-detector.ts
var ReactDetector = class {
  constructor() {
    this.callbacks = [];
    this.detectionResult = null;
    this.isDetecting = false;
    this.maxRetries = 50;
    // 5 seconds with 100ms intervals
    this.retryCount = 0;
  }
  /**
   * Add a callback to be called when React is detected
   */
  onReactReady(callback) {
    if (this.detectionResult) {
      callback(this.detectionResult);
      return;
    }
    this.callbacks.push(callback);
    if (!this.isDetecting) {
      this.startDetection();
    }
  }
  /**
   * Start React detection process
   */
  startDetection() {
    this.isDetecting = true;
    this.retryCount = 0;
    const result = this.detectReact();
    if (result.isReact) {
      this.onReactDetected(result);
      return;
    }
    this.pollForReact();
  }
  /**
   * Poll for React availability
   */
  pollForReact() {
    const poll = () => {
      this.retryCount++;
      const result = this.detectReact();
      if (result.isReact) {
        this.onReactDetected(result);
        return;
      }
      if (this.retryCount < this.maxRetries) {
        setTimeout(poll, 100);
      } else {
        console.warn("[ReactLLM] React not detected after 5 seconds, giving up");
        this.onReactDetected({ isReact: false });
      }
    };
    setTimeout(poll, 100);
  }
  /**
   * Called when React is detected (or detection failed)
   */
  onReactDetected(result) {
    this.detectionResult = result;
    this.isDetecting = false;
    this.callbacks.forEach((callback) => {
      try {
        callback(result);
      } catch (error) {
        console.error("[ReactLLM] Error in React detection callback:", error);
      }
    });
    this.callbacks.length = 0;
  }
  /**
   * Detect React in various ways
   */
  detectReact() {
    const devtools3 = this.checkReactDevTools();
    if (devtools3.isReact) {
      return devtools3;
    }
    const windowReact = this.checkWindowReact();
    if (windowReact.isReact) {
      return windowReact;
    }
    const domContainers = this.checkReactDOMContainers();
    if (domContainers.isReact) {
      return domContainers;
    }
    const fiberNodes = this.checkFiberNodes();
    if (fiberNodes.isReact) {
      return fiberNodes;
    }
    return { isReact: false };
  }
  /**
   * Check for React DevTools
   */
  checkReactDevTools() {
    try {
      const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (!hook) {
        return { isReact: false };
      }
      if (hook.renderers && hook.renderers.size > 0) {
        const renderer = Array.from(hook.renderers.values())[0];
        return {
          isReact: true,
          version: renderer?.version,
          devtools: true,
          rendererID: Array.from(hook.renderers.keys())[0]
        };
      }
      return { isReact: false };
    } catch (error) {
      return { isReact: false };
    }
  }
  /**
   * Check for React on window object
   */
  checkWindowReact() {
    try {
      const win = window;
      const reactSources = [
        win.React,
        win.ReactDOM,
        win.__webpack_require__?.cache
        // Webpack bundles
      ];
      for (const source of reactSources) {
        if (source && this.isReactLike(source)) {
          return {
            isReact: true,
            version: source.version || "unknown"
          };
        }
      }
      return { isReact: false };
    } catch (error) {
      return { isReact: false };
    }
  }
  /**
   * Check for React DOM containers with fiber roots
   */
  checkReactDOMContainers() {
    try {
      const containers = document.querySelectorAll('[data-reactroot], #root, #app, [id*="react"], [class*="react"]');
      for (const container of containers) {
        const fiberRoot = this.getFiberRoot(container);
        if (fiberRoot) {
          return {
            isReact: true,
            fiberRoot,
            version: this.extractReactVersion(fiberRoot)
          };
        }
      }
      return { isReact: false };
    } catch (error) {
      return { isReact: false };
    }
  }
  /**
   * Check for React fiber nodes anywhere in the DOM
   */
  checkFiberNodes() {
    try {
      const walker = document.createTreeWalker(
        document.documentElement,
        NodeFilter.SHOW_ELEMENT,
        {
          acceptNode: (node2) => {
            const element = node2;
            if (this.hasFiberProperties(element)) {
              return NodeFilter.FILTER_ACCEPT;
            }
            return NodeFilter.FILTER_SKIP;
          }
        }
      );
      let node;
      while (node = walker.nextNode()) {
        const fiberRoot = this.getFiberRoot(node);
        if (fiberRoot) {
          return {
            isReact: true,
            fiberRoot,
            version: this.extractReactVersion(fiberRoot)
          };
        }
      }
      return { isReact: false };
    } catch (error) {
      return { isReact: false };
    }
  }
  /**
   * Check if an object looks like React
   */
  isReactLike(obj) {
    return obj && (obj.createElement && obj.Component || obj.render && obj.unmountComponentAtNode || obj.version || obj.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED);
  }
  /**
   * Get fiber root from a DOM element
   */
  getFiberRoot(element) {
    if (element._reactInternalInstance) {
      return element._reactInternalInstance;
    }
    const fiberKey = Object.keys(element).find(
      (key) => key.startsWith("__reactInternalInstance") || key.startsWith("__reactFiber")
    );
    if (fiberKey) {
      return element[fiberKey];
    }
    if (element._reactRootContainer) {
      return element._reactRootContainer;
    }
    if (element._reactInternals) {
      return element._reactInternals;
    }
    return null;
  }
  /**
   * Check if element has fiber properties
   */
  hasFiberProperties(element) {
    const keys = Object.keys(element);
    return keys.some(
      (key) => key.startsWith("__reactInternalInstance") || key.startsWith("__reactFiber") || key === "_reactInternalInstance" || key === "_reactInternals"
    );
  }
  /**
   * Extract React version from fiber root
   */
  extractReactVersion(fiberRoot) {
    try {
      if (fiberRoot.version) return fiberRoot.version;
      if (fiberRoot.current?.version) return fiberRoot.current.version;
      if (fiberRoot._internalRoot?.version) return fiberRoot._internalRoot.version;
      if (fiberRoot.current?.mode !== void 0) {
        return "16+";
      }
      return "unknown";
    } catch (error) {
      return "unknown";
    }
  }
  /**
   * Get the current detection result
   */
  getDetectionResult() {
    return this.detectionResult;
  }
  /**
   * Force a new detection
   */
  forceDetection() {
    this.detectionResult = null;
    this.startDetection();
  }
};
var reactDetector = new ReactDetector();
function waitForReact(timeout = 5e3) {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error("React detection timed out"));
    }, timeout);
    reactDetector.onReactReady((result) => {
      clearTimeout(timeoutId);
      resolve(result);
    });
  });
}

// src/instrumentation/bippy-adapter.ts
var ComponentInspector = class {
  constructor() {
    this.fiberMap = /* @__PURE__ */ new WeakMap();
    this.componentMap = /* @__PURE__ */ new Map();
    this.isInstrumented = false;
    this.componentCounter = 0;
    this.instrumentationRetries = 0;
    this.maxRetries = 10;
    this.setupInstrumentationWithRetry();
  }
  setupInstrumentationWithRetry() {
    const reactResult = reactDetector.getDetectionResult();
    if (reactResult?.isReact) {
      this.setupInstrumentation();
    } else {
      reactDetector.onReactReady((result) => {
        if (result.isReact) {
          setTimeout(() => this.setupInstrumentation(), 50);
        }
      });
    }
  }
  setupInstrumentation() {
    if (this.isInstrumented) return;
    try {
      console.log("[ReactLLM] Setting up bippy instrumentation...");
      const handlers = secure({
        onCommitFiberRoot: (rendererID, root) => {
          try {
            this.processFiberRoot(root);
          } catch (error) {
            console.error("[ReactLLM] Error in fiber root processing:", error);
          }
        }
      });
      instrument(handlers);
      this.isInstrumented = true;
      console.log("[ReactLLM] Bippy instrumentation initialized successfully");
      this.processExistingRoots();
    } catch (error) {
      console.error("[ReactLLM] Failed to setup instrumentation:", error);
      if (this.instrumentationRetries < this.maxRetries) {
        this.instrumentationRetries++;
        console.log(`[ReactLLM] Retrying instrumentation setup (${this.instrumentationRetries}/${this.maxRetries})`);
        setTimeout(() => this.setupInstrumentation(), 100);
      } else {
        console.error("[ReactLLM] Max instrumentation retries exceeded, component inspection will be limited");
      }
    }
  }
  processExistingRoots() {
    try {
      const hook = window.__REACT_DEVTOOLS_GLOBAL_HOOK__;
      if (hook && hook.getFiberRoots) {
        const roots = hook.getFiberRoots(1);
        roots.forEach((root) => {
          this.processFiberRoot(root);
        });
      }
    } catch (error) {
      console.warn("[ReactLLM] Could not process existing roots:", error);
    }
  }
  processFiberRoot(root) {
    try {
      traverseRenderedFibers(root, (fiber) => {
        this.processFiber(fiber);
      });
    } catch (error) {
      console.error("[ReactLLM] Error processing fiber root:", error);
    }
  }
  processFiber(fiber) {
    try {
      if (!this.isRelevantFiber(fiber)) return;
      const info = this.extractComponentInfo(fiber);
      if (info.domElement) {
        this.fiberMap.set(info.domElement, fiber);
        info.domElement.dataset.reactLlmId = info.id;
      }
      this.componentMap.set(info.id, info);
    } catch (error) {
      console.error("[ReactLLM] Error processing fiber:", error);
    }
  }
  isRelevantFiber(fiber) {
    return fiber.type !== null || fiber.elementType !== null || typeof fiber.type === "string" || // Host components (div, span, etc.)
    typeof fiber.type === "function";
  }
  extractComponentInfo(fiber) {
    const id = this.getFiberId(fiber);
    const name = this.getDisplayName(fiber);
    const isComponent = this.isComponentFiber(fiber);
    return {
      id,
      name,
      props: fiber.memoizedProps || {},
      state: fiber.memoizedState || null,
      hooks: this.extractHooks(fiber),
      parent: this.getParentComponent(fiber),
      children: this.getChildComponents(fiber),
      domElement: this.getDOMElement(fiber),
      sourceLocation: this.getSourceLocation(fiber),
      fiberType: this.getFiberType(fiber),
      isComponent,
      depth: this.getFiberDepth(fiber)
    };
  }
  getFiberId(fiber) {
    const key = fiber.key || "";
    const index = fiber.index || 0;
    const type = this.getDisplayName(fiber);
    return `${type}-${key}-${index}-${++this.componentCounter}`;
  }
  getDisplayName(fiber) {
    if (typeof fiber.type === "string") {
      return fiber.type;
    }
    if (typeof fiber.type === "function") {
      return fiber.type.displayName || fiber.type.name || "Anonymous";
    }
    if (fiber.elementType && typeof fiber.elementType === "function") {
      return fiber.elementType.displayName || fiber.elementType.name || "Anonymous";
    }
    switch (fiber.tag) {
      case 0:
        return "FunctionComponent";
      case 1:
        return "ClassComponent";
      case 3:
        return "HostRoot";
      case 5:
        return "HostComponent";
      case 6:
        return "HostText";
      case 7:
        return "Fragment";
      case 8:
        return "Mode";
      case 9:
        return "ContextConsumer";
      case 10:
        return "ContextProvider";
      case 11:
        return "ForwardRef";
      case 12:
        return "Profiler";
      case 13:
        return "SuspenseComponent";
      case 14:
        return "MemoComponent";
      case 15:
        return "SimpleMemoComponent";
      case 16:
        return "LazyComponent";
      default:
        return `Unknown(${fiber.tag})`;
    }
  }
  isComponentFiber(fiber) {
    return fiber.tag === 0 || fiber.tag === 1 || fiber.tag === 14 || fiber.tag === 15;
  }
  getFiberType(fiber) {
    const tagMap = {
      0: "FunctionComponent",
      1: "ClassComponent",
      3: "HostRoot",
      5: "HostComponent",
      6: "HostText",
      7: "Fragment",
      8: "Mode",
      9: "ContextConsumer",
      10: "ContextProvider",
      11: "ForwardRef",
      12: "Profiler",
      13: "SuspenseComponent",
      14: "MemoComponent",
      15: "SimpleMemoComponent",
      16: "LazyComponent"
    };
    return tagMap[fiber.tag] || `Unknown(${fiber.tag})`;
  }
  extractHooks(fiber) {
    const hooks = [];
    try {
      let hook = fiber.memoizedState;
      while (hook) {
        hooks.push({
          memoizedState: hook.memoizedState,
          baseState: hook.baseState,
          next: !!hook.next
        });
        hook = hook.next;
      }
    } catch (error) {
    }
    return hooks;
  }
  getParentComponent(fiber) {
    let parent = fiber.return;
    while (parent) {
      if (this.isComponentFiber(parent)) {
        const parentId = this.getFiberId(parent);
        return this.componentMap.get(parentId);
      }
      parent = parent.return;
    }
    return void 0;
  }
  getChildComponents(fiber) {
    const children = [];
    let child = fiber.child;
    while (child) {
      if (this.isComponentFiber(child)) {
        const childId = this.getFiberId(child);
        const childInfo = this.componentMap.get(childId);
        if (childInfo) {
          children.push(childInfo);
        }
      }
      child = child.sibling;
    }
    return children;
  }
  getDOMElement(fiber) {
    if (fiber.tag === 5 && fiber.stateNode instanceof HTMLElement) {
      return fiber.stateNode;
    }
    try {
      const hostFiber = getNearestHostFiber(fiber);
      if (hostFiber && hostFiber.stateNode instanceof HTMLElement) {
        return hostFiber.stateNode;
      }
    } catch (error) {
      let current = fiber.child;
      while (current) {
        if (current.tag === 5 && current.stateNode instanceof HTMLElement) {
          return current.stateNode;
        }
        current = current.child;
      }
    }
    return void 0;
  }
  getSourceLocation(fiber) {
    if (fiber._debugSource) {
      return {
        fileName: fiber._debugSource.fileName,
        lineNumber: fiber._debugSource.lineNumber,
        columnNumber: fiber._debugSource.columnNumber
      };
    }
    return void 0;
  }
  getFiberDepth(fiber) {
    let depth = 0;
    let parent = fiber.return;
    while (parent) {
      depth++;
      parent = parent.return;
    }
    return depth;
  }
  getComponentAtPoint(x, y) {
    const element = document.elementFromPoint(x, y);
    if (!element) return null;
    let current = element;
    let bestMatch = null;
    while (current) {
      const fiber = this.fiberMap.get(current);
      if (fiber) {
        const id = this.getFiberId(fiber);
        const component = this.componentMap.get(id);
        if (component) {
          if (component.isComponent) {
            return component;
          } else if (!bestMatch) {
            bestMatch = component;
          }
        }
      }
      const reactLlmId = current.dataset.reactLlmId;
      if (reactLlmId) {
        const component = this.componentMap.get(reactLlmId);
        if (component && component.isComponent) {
          return component;
        }
      }
      const reactFiberKey = Object.keys(current).find(
        (key) => key.startsWith("__reactInternalInstance") || key.startsWith("__reactFiber")
      );
      if (reactFiberKey) {
        const fiber2 = current[reactFiberKey];
        if (fiber2) {
          const component = this.findComponentFromFiber(fiber2);
          if (component) {
            return component;
          }
        }
      }
      current = current.parentElement;
    }
    return bestMatch;
  }
  findComponentFromFiber(fiber) {
    let current = fiber;
    while (current) {
      if (this.isComponentFiber(current)) {
        const id = this.getFiberId(current);
        const component = this.componentMap.get(id);
        if (component) {
          return component;
        }
      }
      current = current.return;
    }
    return null;
  }
  getComponentById(id) {
    return this.componentMap.get(id) || null;
  }
  getAllComponents() {
    return Array.from(this.componentMap.values()).filter((comp) => comp.isComponent).sort((a, b) => a.depth - b.depth);
  }
  getComponentTree() {
    const components = this.getAllComponents();
    return components.filter((comp) => !comp.parent);
  }
  selectComponent(component) {
    if (this.selectionCallback) {
      this.selectionCallback(component);
    }
  }
  onSelection(callback) {
    this.selectionCallback = callback;
  }
  highlightComponent(component) {
    if (component.domElement) {
      component.domElement.style.outline = "2px solid #007acc";
      component.domElement.style.outlineOffset = "2px";
    }
  }
  unhighlightComponent(component) {
    if (component.domElement) {
      component.domElement.style.outline = "";
      component.domElement.style.outlineOffset = "";
    }
  }
  isInstrumentationReady() {
    return this.isInstrumented;
  }
};

// src/components/ComponentInspector.tsx
function ComponentInspector2({ isActive, onSelect, theme = "dark" }) {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const inspectorRef = useRef(null);
  const cleanupRef = useRef(null);
  useEffect(() => {
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }
    if (!isActive) {
      if (containerRef.current) {
        containerRef.current.remove();
        containerRef.current = null;
      }
      return;
    }
    console.log("[ComponentInspector] Activating component selection mode");
    if (!inspectorRef.current) {
      inspectorRef.current = window.ReactLLM?.inspector || new ComponentInspector();
    }
    const container = document.createElement("div");
    container.setAttribute("data-react-llm-inspector", "true");
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 2147483646;
    `;
    const canvas = document.createElement("canvas");
    canvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      display: block;
    `;
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    container.appendChild(canvas);
    document.body.appendChild(container);
    containerRef.current = container;
    canvasRef.current = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      console.error("[ComponentInspector] Failed to get canvas context");
      return;
    }
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    let hoveredComponent = null;
    let animationFrameId = null;
    const drawHighlight = (component) => {
      if (!component.domElement || !ctx) return;
      const rect = component.domElement.getBoundingClientRect();
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.fillStyle = theme === "dark" ? "rgba(59, 130, 246, 0.15)" : "rgba(37, 99, 235, 0.15)";
      ctx.fillRect(rect.left, rect.top, rect.width, rect.height);
      ctx.strokeStyle = theme === "dark" ? "rgba(59, 130, 246, 0.8)" : "rgba(37, 99, 235, 0.8)";
      ctx.lineWidth = 2;
      ctx.strokeRect(rect.left, rect.top, rect.width, rect.height);
      const label = component.name || "Component";
      ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = theme === "dark" ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.9)";
      const labelPadding = 4;
      const labelHeight = 20;
      const textMetrics = ctx.measureText(label);
      const labelWidth = textMetrics.width + labelPadding * 2;
      const labelY = rect.top > labelHeight ? rect.top - labelHeight : rect.bottom;
      ctx.fillRect(rect.left, labelY, labelWidth, labelHeight);
      ctx.fillStyle = theme === "dark" ? "#ffffff" : "#000000";
      ctx.fillText(label, rect.left + labelPadding, labelY + 14);
    };
    const handleMouseMove = (e) => {
      const target = e.target;
      if (target.closest("[data-react-llm-inspector]") || target.closest("[data-react-llm]") || target.closest("#react-llm-root")) {
        if (hoveredComponent) {
          ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
          hoveredComponent = null;
        }
        return;
      }
      const component = inspectorRef.current?.getComponentAtPoint(e.clientX, e.clientY);
      if (component && component !== hoveredComponent) {
        hoveredComponent = component;
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        animationFrameId = requestAnimationFrame(() => {
          drawHighlight(component);
        });
      } else if (!component && hoveredComponent) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        hoveredComponent = null;
      }
    };
    const handleClick = (e) => {
      const target = e.target;
      if (target.closest("[data-react-llm-inspector]") || target.closest("[data-react-llm]") || target.closest("#react-llm-root")) {
        return;
      }
      const component = inspectorRef.current?.getComponentAtPoint(e.clientX, e.clientY);
      if (component) {
        e.preventDefault();
        e.stopPropagation();
        onSelect(component);
        console.log("[ComponentInspector] Component selected:", component.name);
        if (cleanupRef.current) {
          cleanupRef.current();
        }
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        console.log("[ComponentInspector] Escape pressed, canceling selection");
        onSelect(null);
      }
    };
    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      if (hoveredComponent) {
        drawHighlight(hoveredComponent);
      }
    };
    document.addEventListener("mousemove", handleMouseMove, false);
    document.addEventListener("click", handleClick, true);
    document.addEventListener("keydown", handleKeyDown, false);
    window.addEventListener("resize", handleResize, false);
    cleanupRef.current = () => {
      console.log("[ComponentInspector] Cleaning up event listeners");
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      if (containerRef.current) {
        containerRef.current.remove();
        containerRef.current = null;
      }
      canvasRef.current = null;
    };
    return cleanupRef.current;
  }, [isActive, onSelect, theme]);
  return null;
}

// src/components/ContextSelector.tsx
import { h } from "preact";
import { useState, useEffect as useEffect2 } from "preact/hooks";
import { signal } from "@preact/signals";
var contextOptions = [
  {
    id: "console-all",
    type: "console",
    label: "@console",
    icon: "\u{1F4CB}",
    description: "All console logs"
  },
  {
    id: "console-errors",
    type: "console",
    label: "@errors",
    icon: "\u{1F6A8}",
    description: "Console errors only",
    filter: { level: "error" }
  },
  {
    id: "network-all",
    type: "network",
    label: "@network",
    icon: "\u{1F310}",
    description: "All network requests"
  },
  {
    id: "network-failed",
    type: "network",
    label: "@failed-requests",
    icon: "\u274C",
    description: "Failed network requests",
    filter: { status: "failed" }
  },
  {
    id: "performance",
    type: "performance",
    label: "@performance",
    icon: "\u26A1",
    description: "Performance metrics"
  },
  {
    id: "dom-changes",
    type: "dom",
    label: "@dom-changes",
    icon: "\u{1F504}",
    description: "Recent DOM mutations"
  },
  {
    id: "components",
    type: "components",
    label: "@components",
    icon: "\u{1F9E9}",
    description: "Selected React components"
  }
];
var ContextSelector = ({ onSelect, position, searchTerm }) => {
  const [filteredOptions, setFilteredOptions] = useState(contextOptions);
  const selectedIndex = signal(0);
  useEffect2(() => {
    const filtered = contextOptions.filter(
      (option) => option.label.toLowerCase().includes(searchTerm.toLowerCase()) || option.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOptions(filtered);
    selectedIndex.value = 0;
  }, [searchTerm]);
  useEffect2(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          selectedIndex.value = Math.min(
            selectedIndex.value + 1,
            filteredOptions.length - 1
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          selectedIndex.value = Math.max(selectedIndex.value - 1, 0);
          break;
        case "Enter":
          e.preventDefault();
          if (filteredOptions[selectedIndex.value]) {
            onSelect(filteredOptions[selectedIndex.value]);
          }
          break;
        case "Escape":
          e.preventDefault();
          onSelect(null);
          break;
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [filteredOptions, onSelect]);
  return /* @__PURE__ */ h(
    "div",
    {
      className: "context-selector",
      style: {
        position: "absolute",
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translateY(-100%)"
      }
    },
    /* @__PURE__ */ h("div", { className: "context-options" }, filteredOptions.map((option, index) => /* @__PURE__ */ h(
      "div",
      {
        key: option.id,
        className: `context-option ${index === selectedIndex.value ? "selected" : ""}`,
        onClick: () => onSelect(option),
        onMouseEnter: () => selectedIndex.value = index
      },
      /* @__PURE__ */ h("span", { className: "context-icon" }, option.icon),
      /* @__PURE__ */ h("div", { className: "context-info" }, /* @__PURE__ */ h("div", { className: "context-label" }, option.label), /* @__PURE__ */ h("div", { className: "context-description" }, option.description))
    ))),
    /* @__PURE__ */ h("style", null, `
        #react-llm-context-portal .context-selector {
          background: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.4),
            0 8px 16px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          max-width: 320px;
          overflow: hidden;
          z-index: 10000;
          animation: dropdownEntrance 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          transform-origin: bottom left;
        }
        
        #react-llm-context-portal .context-options {
          max-height: 240px;
          overflow-y: auto;
          padding: 4px;
        }
        
        #react-llm-context-portal .context-options::-webkit-scrollbar {
          width: 6px;
        }
        
        #react-llm-context-portal .context-options::-webkit-scrollbar-track {
          background: transparent;
        }
        
        #react-llm-context-portal .context-options::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        
        #react-llm-context-portal .context-option {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 8px;
          position: relative;
          overflow: hidden;
          margin: 2px 0;
        }
        
        #react-llm-context-portal .context-option::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(69, 137, 255, 0.1),
            transparent
          );
          transform: translateX(-100%);
          transition: transform 0.6s;
        }
        
        #react-llm-context-portal .context-option:hover::before,
        #react-llm-context-portal .context-option.selected::before {
          transform: translateX(100%);
        }
        
        #react-llm-context-portal .context-option:hover,
        #react-llm-context-portal .context-option.selected {
          background: rgba(255, 255, 255, 0.08);
          transform: translateX(4px);
        }
        
        #react-llm-context-portal .context-option.selected {
          box-shadow: 
            0 0 0 1px rgba(69, 137, 255, 0.3),
            0 2px 8px rgba(69, 137, 255, 0.1);
        }
        
        #react-llm-context-portal .context-icon {
          font-size: 20px;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 6px;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        #react-llm-context-portal .context-option:hover .context-icon {
          transform: scale(1.1) rotate(5deg);
          background: rgba(255, 255, 255, 0.1);
        }
        
        #react-llm-context-portal .context-info {
          flex: 1;
          min-width: 0;
        }
        
        #react-llm-context-portal .context-label {
          font-weight: 500;
          color: rgba(255, 255, 255, 0.95);
          font-family: 'TX02Mono-Regular', monospace;
          font-size: 14px;
          transition: color 0.2s;
        }
        
        #react-llm-context-portal .context-option:hover .context-label {
          color: rgba(100, 200, 255, 0.9);
        }
        
        #react-llm-context-portal .context-description {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-top: 2px;
        }
        
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
      `)
  );
};

// src/components/Toolbar.tsx
function getInitialResponse() {
  return {
    projectInfo: {
      name: "Example Project",
      type: "Library",
      mainTechnologies: ["React", "TypeScript", "SQLite"],
      description: "A floating chat interface powered by Gemini"
    },
    markdown: "Welcome to the example project!",
    chatTitle: "New Chat",
    relevantFiles: [],
    documentationLinks: [],
    suggestedQueries: []
  };
}
function Toolbar({ hub, monitorManager, shadowRoot }) {
  console.log("[Toolbar] Initializing with hub:", hub, "isInitialized:", hub?.isInitialized());
  const isInitializing = useSignal(true);
  const isVisible = useSignal(false);
  const isMinimized = useSignal(false);
  const chatSessions = useSignal([]);
  const activeChatId = useSignal(null);
  const inputValue = useSignal("");
  const editingTitle = useSignal("");
  const activeTab = useSignal("chat");
  const projectInfo = useSignal(null);
  const hasInitialChat = useSignal(false);
  const initializationStarted = useSignal(false);
  const isLoadingMessages = useSignal(false);
  const isStreamingResponse = useSignal(false);
  const streamingContent = useSignal("");
  const showModelSelector = useSignal(false);
  const currentView = useSignal("chat");
  const apiKey = useSignal("");
  const selectionMode = useSignal("none");
  const selectedComponent = useSignal(null);
  const inspectorCleanup = useSignal(null);
  const showContextSelector = useSignal(false);
  const contextSelectorPosition = useSignal({ x: 0, y: 0 });
  const contextSearchTerm = useSignal("");
  const inputRef = useSignal(null);
  useEffect3(() => {
    const isDev = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    if (isDev) {
      const storedKey = localStorage.getItem("react-llm-openrouter-key");
      const envKey = window.__REACT_LLM_CONFIG__?.openrouterKey;
      if (storedKey || envKey) {
        apiKey.value = storedKey || envKey;
        hub.initializeProvider("openrouter", apiKey.value).then(() => {
          console.log("[ReactLLM] OpenRouter initialized with", hub.getAvailableModels().length, "models");
        });
      }
    }
  }, [hub]);
  useEffect3(() => {
    if (initializationStarted.value) return;
    initializationStarted.value = true;
    const initialize = async () => {
      try {
        await initDB();
        const sessions = await getChatSessions();
        if (sessions.length > 0) {
          const messages = await getMessagesForChatSession(sessions[0].id);
          const firstSession = {
            id: sessions[0].id,
            title: sessions[0].title,
            messages: messages.map((m) => ({
              role: m.role === "user" || m.role === "assistant" ? m.role : "assistant",
              content: m.content,
              structuredResponse: m.structuredResponse ? JSON.parse(m.structuredResponse) : void 0
            }))
          };
          chatSessions.value = [firstSession];
          activeChatId.value = firstSession.id;
          hasInitialChat.value = true;
          const firstMessage = messages.find((m) => m.role === "assistant" && m.structuredResponse);
          if (firstMessage?.structuredResponse) {
            try {
              const structuredResponse = JSON.parse(firstMessage.structuredResponse);
              if (structuredResponse.projectInfo) {
                projectInfo.value = structuredResponse.projectInfo;
              }
            } catch (e) {
              console.warn("Failed to parse structured response:", e);
            }
          }
        } else {
          if (!hub.isInitialized()) {
            console.log("[Toolbar] Hub not initialized yet, skipping initial chat creation");
            return;
          }
          const initialResponse = getInitialResponse();
          if (initialResponse.projectInfo) {
            projectInfo.value = initialResponse.projectInfo;
          }
          const newId = String(Date.now());
          await createChatSession(newId, "Welcome");
          const welcomeMessage = `Welcome to ReactLM! I'm ready to help you with your React codebase.

I'm currently using **${hub.getActiveModel()}** - you can change models anytime using the \u{1F916} button.

What would you like to explore?`;
          await createMessage(
            String(Date.now()),
            newId,
            "assistant",
            welcomeMessage,
            JSON.stringify({
              ...initialResponse,
              markdown: welcomeMessage
            })
          );
          const chat2 = {
            id: newId,
            title: "Welcome",
            messages: [{
              role: "assistant",
              content: welcomeMessage,
              structuredResponse: {
                ...initialResponse,
                markdown: welcomeMessage
              }
            }],
            projectInfo: initialResponse.projectInfo
          };
          chatSessions.value = [chat2];
          activeChatId.value = chat2.id;
          hasInitialChat.value = true;
        }
      } finally {
        isInitializing.value = false;
        setTimeout(() => isVisible.value = true, 50);
      }
    };
    initialize();
  }, []);
  useEffect3(() => {
    if (!activeChatId.value || isLoadingMessages.value) return;
    const currentChat = chatSessions.value.find((c) => c.id === activeChatId.value);
    if (currentChat?.messages && currentChat.messages.length > 0) return;
    const loadMessages = async () => {
      isLoadingMessages.value = true;
      try {
        const messages = await getMessagesForChatSession(activeChatId.value);
        chatSessions.value = chatSessions.value.map(
          (session) => session.id === activeChatId.value ? {
            ...session,
            messages: messages.map((m) => ({
              role: m.role,
              content: m.content,
              structuredResponse: m.structuredResponse ? JSON.parse(m.structuredResponse) : void 0,
              relevantFiles: m.relevantFiles || [],
              documentationLinks: m.documentationLinks || [],
              suggestedQueries: m.suggestedQueries || []
            }))
          } : session
        );
      } catch (error) {
        console.error("Failed to load messages:", error);
      } finally {
        isLoadingMessages.value = false;
      }
    };
    loadMessages();
  }, [activeChatId.value]);
  const createNewChat = async () => {
    console.log("[createNewChat] Starting...", {
      isInitializing: isInitializing.value,
      hubInitialized: hub?.isInitialized(),
      activeModel: hub?.getActiveModel()
    });
    if (isInitializing.value) return;
    const newId = String(Date.now());
    try {
      await createChatSession(newId, "New Chat");
      let response;
      try {
        const llmContent = await hub.completeChat([
          { role: "user", content: "Please provide a helpful introduction and overview of how I can assist with this React codebase." }
        ]);
        response = {
          markdown: llmContent,
          chatTitle: extractTitleFromResponse(llmContent),
          relevantFiles: [],
          documentationLinks: [],
          suggestedQueries: extractSuggestionsFromResponse(llmContent)
        };
      } catch (error) {
        console.error("Failed to get LLM response:", error);
        response = {
          markdown: "Hello! I'm ready to help you with your React codebase.",
          chatTitle: "New Chat",
          relevantFiles: [],
          documentationLinks: [],
          suggestedQueries: ["How does this work?", "Can you explain this pattern?"]
        };
      }
      await createMessage(
        String(Date.now()),
        newId,
        "assistant",
        response.markdown,
        JSON.stringify(response)
      );
      const newChat = {
        id: newId,
        title: response.chatTitle || "New Chat",
        messages: [{
          role: "assistant",
          content: response.markdown,
          structuredResponse: response
        }],
        projectInfo: response.projectInfo
      };
      chatSessions.value = [...chatSessions.value, newChat];
      activeChatId.value = newId;
    } catch (error) {
      console.error("Failed to create new chat:", error);
    }
  };
  const formatChatTitle = (title) => {
    if (!title) return projectInfo.value?.name || "untitled project";
    if (!projectInfo.value?.name || !projectInfo.value?.description) return title;
    const cleanTitle = title.toLowerCase().startsWith(projectInfo.value.name.toLowerCase()) ? title.slice(projectInfo.value.name.length).replace(/^[-:\s]+/, "") : title;
    return `${projectInfo.value.name} - ${projectInfo.value.description}`.toLowerCase();
  };
  const activeChat = () => activeChatId.value ? chatSessions.value.find((c) => c.id === activeChatId.value) : null;
  const deleteChat = async (chatId) => {
    try {
      await deleteChatSession(chatId);
      chatSessions.value = chatSessions.value.filter((c) => c.id !== chatId);
      if (activeChatId.value === chatId) {
        activeChatId.value = chatSessions.value[0]?.id || null;
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };
  const startEditingTitle = (chatId) => {
    const chat2 = chatSessions.value.find((c) => c.id === chatId);
    if (chat2) {
      editingTitle.value = chat2.title;
    }
  };
  const saveEditingTitle = () => {
    if (editingTitle.value.trim()) {
      chatSessions.value = chatSessions.value.map(
        (chat2) => chat2.id === activeChatId.value ? { ...chat2, title: editingTitle.value.trim() } : chat2
      );
    }
    editingTitle.value = "";
  };
  const handleInputChange = (e) => {
    const input = e.target;
    const value = input.value;
    inputValue.value = value;
    const cursorPosition = input.selectionStart || 0;
    const textBeforeCursor = value.substring(0, cursorPosition);
    const atMatch = textBeforeCursor.match(/@(\w*)$/);
    if (atMatch) {
      const searchTerm = atMatch[1];
      contextSearchTerm.value = searchTerm;
      const rect = input.getBoundingClientRect();
      contextSelectorPosition.value = {
        x: rect.left,
        y: rect.top
      };
      showContextSelector.value = true;
    } else {
      showContextSelector.value = false;
    }
  };
  const handleContextSelect = (context) => {
    if (!context) {
      showContextSelector.value = false;
      return;
    }
    const input = inputRef.value;
    if (!input) return;
    const cursorPosition = input.selectionStart || 0;
    const value = inputValue.value;
    const textBeforeCursor = value.substring(0, cursorPosition);
    const textAfterCursor = value.substring(cursorPosition);
    const atMatch = textBeforeCursor.match(/@\w*$/);
    if (atMatch) {
      const beforeAtSign = textBeforeCursor.substring(0, atMatch.index);
      let contextData = "";
      if (monitorManager) {
        contextData = monitorManager.getContext(context.type, context.filter);
      }
      const newValue = `${beforeAtSign}${context.label}${textAfterCursor}

<!-- Context: ${contextData} -->`;
      inputValue.value = newValue;
      setTimeout(() => {
        const newPosition = beforeAtSign.length + context.label.length;
        input.setSelectionRange(newPosition, newPosition);
      }, 0);
    }
    showContextSelector.value = false;
  };
  const handleInputKeyDown = (e) => {
    if (showContextSelector.value) {
      if (["ArrowDown", "ArrowUp", "Enter", "Escape"].includes(e.key)) {
        return;
      }
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputValue.value.trim() || isInitializing.value) return;
    const userMessage = inputValue.value;
    inputValue.value = "";
    if (!activeChatId.value) {
      await createNewChat();
      return;
    }
    const chat2 = activeChat();
    const isNewChat = chat2.messages.length === 0;
    const userMessageId = String(Date.now());
    try {
      await createMessage(
        userMessageId,
        chat2.id,
        "user",
        userMessage
      );
      const updatedMessages = [...chat2.messages, { role: "user", content: userMessage }];
      chatSessions.value = chatSessions.value.map(
        (c) => c.id === activeChatId.value ? { ...c, messages: updatedMessages } : c
      );
      isInitializing.value = true;
      isStreamingResponse.value = true;
      streamingContent.value = "";
      const llmMessages = [
        ...chat2.messages.map((m) => ({ role: m.role, content: m.content })),
        { role: "user", content: userMessage }
      ];
      let fullResponse = "";
      try {
        for await (const chunk of hub.chat(llmMessages)) {
          fullResponse += chunk;
          streamingContent.value = fullResponse;
        }
        const response = {
          markdown: fullResponse,
          chatTitle: isNewChat ? extractTitleFromResponse(fullResponse) : void 0,
          relevantFiles: [],
          documentationLinks: [],
          suggestedQueries: extractSuggestionsFromResponse(fullResponse)
        };
        const assistantMessageId = String(Date.now() + 1);
        await createMessage(
          assistantMessageId,
          chat2.id,
          "assistant",
          fullResponse,
          JSON.stringify(response)
        );
        const newMessages = [...updatedMessages, {
          role: "assistant",
          content: fullResponse,
          structuredResponse: response
        }];
        chatSessions.value = chatSessions.value.map(
          (c) => c.id === activeChatId.value ? {
            ...c,
            title: isNewChat && response.chatTitle ? response.chatTitle : c.title,
            messages: newMessages,
            projectInfo: isNewChat ? response.projectInfo : c.projectInfo
          } : c
        );
      } catch (streamError) {
        console.error("Streaming error:", streamError);
        const errorResponse = "I apologize, but I encountered an issue processing your request. Please try again.";
        const assistantMessageId = String(Date.now() + 1);
        await createMessage(
          assistantMessageId,
          chat2.id,
          "assistant",
          errorResponse
        );
        chatSessions.value = chatSessions.value.map(
          (c) => c.id === activeChatId.value ? {
            ...c,
            messages: [...updatedMessages, {
              role: "assistant",
              content: errorResponse
            }]
          } : c
        );
      }
    } catch (error) {
      console.error("Failed to get response:", error);
      const errorMessageId = String(Date.now() + 1);
      await createMessage(
        errorMessageId,
        chat2.id,
        "assistant",
        "Sorry, I encountered an error. Please try again."
      );
      chatSessions.value = chatSessions.value.map(
        (c) => c.id === activeChatId.value ? {
          ...c,
          messages: [...chat2.messages, {
            role: "assistant",
            content: "Sorry, I encountered an error. Please try again."
          }]
        } : c
      );
    } finally {
      isInitializing.value = false;
      isStreamingResponse.value = false;
      streamingContent.value = "";
    }
  };
  const extractTitleFromResponse = (response) => {
    if (!response) return "New Chat";
    const lines = response.split("\n");
    const firstLine = lines[0]?.replace(/^#+\s*/, "").trim();
    return firstLine && firstLine.length < 100 ? firstLine : "New Chat";
  };
  const extractSuggestionsFromResponse = (response) => {
    if (!response) return [];
    const suggestions = [];
    const lines = response.split("\n");
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith("- ") && trimmed.endsWith("?")) {
        suggestions.push(trimmed.slice(2));
      } else if (trimmed.match(/^\d+\./)) {
        const question = trimmed.replace(/^\d+\.\s*/, "");
        if (question.endsWith("?")) {
          suggestions.push(question);
        }
      }
    }
    return suggestions.slice(0, 3);
  };
  const handleModelChange = (provider, model) => {
    hub.setActiveModel(provider, model);
    showModelSelector.value = false;
  };
  const selectedComponents = useSignal([]);
  const handleComponentSelect = (componentInfo) => {
    if (!componentInfo) {
      selectionMode.value = "none";
      console.log("[Toolbar] Component selection cancelled");
      return;
    }
    selectedComponent.value = componentInfo;
    selectionMode.value = "selected";
    if (componentInfo) {
      const existingIndex = selectedComponents.value.findIndex(
        (c) => c.id === componentInfo.id
      );
      if (existingIndex === -1) {
        selectedComponents.value = [...selectedComponents.value, {
          ...componentInfo,
          timestamp: (/* @__PURE__ */ new Date()).toISOString()
        }];
      }
      if (monitorManager) {
        monitorManager.setSelectedComponents(selectedComponents.value);
      }
      currentView.value = "components";
    }
  };
  const renderComponentsView = () => /* @__PURE__ */ h2("div", { className: "view-container" }, /* @__PURE__ */ h2("div", { className: "view-header" }, /* @__PURE__ */ h2("h2", { className: "view-title" }, "Selected Components"), /* @__PURE__ */ h2("button", { className: "view-close", onClick: () => currentView.value = "chat" }, "\xD7")), /* @__PURE__ */ h2("div", { className: "view-content" }, selectedComponents.value.length === 0 ? /* @__PURE__ */ h2("div", { className: "empty-components" }, /* @__PURE__ */ h2("p", null, "No components selected yet"), /* @__PURE__ */ h2(
    "button",
    {
      className: "select-component-button",
      onClick: () => {
        currentView.value = "chat";
        selectionMode.value = "selecting";
      }
    },
    /* @__PURE__ */ h2("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ h2("path", { d: "M2 2h4v2H4v2H2V2zm10 0h4v4h-2V4h-2V2zM2 10h2v2h2v2H2v-4zm12 2h2v-2h-2v2zm0 0v2h-2v2h4v-4h-2z" }), /* @__PURE__ */ h2("circle", { cx: "8", cy: "8", r: "2", opacity: "0.5" })),
    "Select a Component"
  )) : /* @__PURE__ */ h2("div", { className: "components-list" }, selectedComponents.value.map((comp) => /* @__PURE__ */ h2("div", { key: comp.id, className: "component-item" }, /* @__PURE__ */ h2("div", { className: "component-header" }, /* @__PURE__ */ h2("h3", { className: "component-name" }, comp.name), /* @__PURE__ */ h2(
    "button",
    {
      className: "remove-button",
      onClick: () => {
        selectedComponents.value = selectedComponents.value.filter((c) => c.id !== comp.id);
        if (monitorManager) {
          monitorManager.setSelectedComponents(selectedComponents.value);
        }
      }
    },
    "\xD7"
  )), /* @__PURE__ */ h2("div", { className: "component-details" }, comp.domElement && /* @__PURE__ */ h2("div", { className: "detail-row" }, /* @__PURE__ */ h2("span", { className: "detail-label" }, "Element:"), /* @__PURE__ */ h2("code", { className: "detail-value" }, "<", comp.domElement.tagName.toLowerCase(), comp.domElement.id ? ` id="${comp.domElement.id}"` : "", comp.domElement.className ? ` class="${comp.domElement.className}"` : "", ">")), Object.keys(comp.props || {}).length > 0 && /* @__PURE__ */ h2("div", { className: "detail-row" }, /* @__PURE__ */ h2("span", { className: "detail-label" }, "Props:"), /* @__PURE__ */ h2("pre", { className: "detail-value props-value" }, JSON.stringify(comp.props, null, 2))), comp.state && /* @__PURE__ */ h2("div", { className: "detail-row" }, /* @__PURE__ */ h2("span", { className: "detail-label" }, "State:"), /* @__PURE__ */ h2("pre", { className: "detail-value props-value" }, JSON.stringify(comp.state, null, 2))), comp.hooks && comp.hooks.length > 0 && /* @__PURE__ */ h2("div", { className: "detail-row" }, /* @__PURE__ */ h2("span", { className: "detail-label" }, "Hooks:"), /* @__PURE__ */ h2("div", { className: "detail-value" }, comp.hooks.map((hook, i) => /* @__PURE__ */ h2("div", { key: i, className: "hook-item" }, "Hook ", i, ": ", JSON.stringify(hook.memoizedState))))), /* @__PURE__ */ h2("div", { className: "component-actions" }, /* @__PURE__ */ h2(
    "button",
    {
      className: "action-button",
      onClick: () => {
        currentView.value = "chat";
        inputValue.value = `Tell me about the ${comp.name} component`;
      }
    },
    "Ask about this component"
  ))))))));
  const renderSettingsView = () => /* @__PURE__ */ h2("div", { className: "view-container" }, /* @__PURE__ */ h2("div", { className: "view-header" }, /* @__PURE__ */ h2("h2", { className: "view-title" }, "Settings"), /* @__PURE__ */ h2("button", { className: "view-close", onClick: () => currentView.value = "chat" }, "\xD7")), /* @__PURE__ */ h2("div", { className: "view-content" }, /* @__PURE__ */ h2("div", { className: "settings-section" }, /* @__PURE__ */ h2("label", { className: "settings-label" }, "OpenRouter API Key"), /* @__PURE__ */ h2(
    "input",
    {
      type: "password",
      className: "settings-input",
      value: apiKey.value,
      onInput: (e) => apiKey.value = e.target.value,
      placeholder: "sk-or-..."
    }
  ), /* @__PURE__ */ h2("div", { className: "settings-hint" }, "Get your API key from", " ", /* @__PURE__ */ h2("a", { href: "https://openrouter.ai/keys", target: "_blank", rel: "noopener noreferrer", style: { color: "rgba(100, 200, 255, 0.9)" } }, "openrouter.ai/keys")), /* @__PURE__ */ h2(
    "button",
    {
      className: "settings-button",
      onClick: async () => {
        if (apiKey.value) {
          localStorage.setItem("react-llm-openrouter-key", apiKey.value);
          await hub.initializeProvider("openrouter", apiKey.value);
          currentView.value = "models";
        }
      },
      disabled: !apiKey.value
    },
    "Save and Connect"
  ))));
  const renderModelsView = () => {
    const models = hub.getAvailableModels();
    const hasApiKey = hub.isInitialized() && hub.getActiveProvider() !== "demo";
    return /* @__PURE__ */ h2("div", { className: "view-container" }, /* @__PURE__ */ h2("div", { className: "view-header" }, /* @__PURE__ */ h2("h2", { className: "view-title" }, "Select Model"), /* @__PURE__ */ h2("button", { className: "view-close", onClick: () => currentView.value = "chat" }, "\xD7")), /* @__PURE__ */ h2("div", { className: "view-content" }, !hasApiKey && /* @__PURE__ */ h2("div", { className: "api-key-prompt" }, /* @__PURE__ */ h2("div", { className: "api-key-prompt-text" }, "Add your OpenRouter API key to access all models"), /* @__PURE__ */ h2(
      "button",
      {
        className: "api-key-prompt-button",
        onClick: () => currentView.value = "settings"
      },
      "Add API Key"
    )), /* @__PURE__ */ h2("div", { className: "models-grid" }, models.map((model) => /* @__PURE__ */ h2(
      "div",
      {
        key: model.id,
        className: `model-card ${hub.getActiveModel() === model.id ? "selected" : ""}`,
        onClick: () => {
          hub.setActiveModel("openrouter", model.id);
          handleModelChange("openrouter", model.id);
          currentView.value = "chat";
        }
      },
      /* @__PURE__ */ h2("div", { className: "model-card-header" }, /* @__PURE__ */ h2("div", null, /* @__PURE__ */ h2("div", { className: "model-card-name" }, model.name), /* @__PURE__ */ h2("div", { className: "model-card-provider" }, model.provider)), model.id.includes("claude-3-5-sonnet") || model.id.includes("gpt-4o") ? /* @__PURE__ */ h2("span", { className: "model-card-badge recommended" }, "Recommended") : null),
      /* @__PURE__ */ h2("div", { className: "model-card-specs" }, /* @__PURE__ */ h2("div", { className: "model-spec" }, /* @__PURE__ */ h2("div", { className: "model-spec-label" }, "Context"), /* @__PURE__ */ h2("div", { className: "model-spec-value" }, model.contextLength >= 1e6 ? `${(model.contextLength / 1e6).toFixed(1)}M` : model.contextLength >= 1e3 ? `${(model.contextLength / 1e3).toFixed(0)}K` : model.contextLength)), /* @__PURE__ */ h2("div", { className: "model-spec" }, /* @__PURE__ */ h2("div", { className: "model-spec-label" }, "Input"), /* @__PURE__ */ h2("div", { className: "model-spec-value" }, "$", (model.pricing.prompt * 1e3).toFixed(3), "/1K")), /* @__PURE__ */ h2("div", { className: "model-spec" }, /* @__PURE__ */ h2("div", { className: "model-spec-label" }, "Output"), /* @__PURE__ */ h2("div", { className: "model-spec-value" }, "$", (model.pricing.completion * 1e3).toFixed(3), "/1K"))),
      model.description && /* @__PURE__ */ h2("div", { className: "model-card-description" }, model.description)
    )))));
  };
  const renderMessage = (msg) => {
    if (msg.role === "user") {
      return /* @__PURE__ */ h2("div", { className: "message user-message" }, msg.content);
    }
    const html = marked(msg.content);
    if (typeof html !== "string") return null;
    return /* @__PURE__ */ h2("div", { className: "message assistant-message" }, /* @__PURE__ */ h2("div", { dangerouslySetInnerHTML: { __html: html } }), msg.structuredResponse?.relevantFiles && msg.structuredResponse.relevantFiles.length > 0 && /* @__PURE__ */ h2("div", { className: "relevant-files" }, msg.structuredResponse.relevantFiles.map((file, i) => /* @__PURE__ */ h2("div", { key: i, className: "relevant-file", title: file.reason }, /* @__PURE__ */ h2("span", { className: "file-path" }, file.path)))), msg.structuredResponse?.documentationLinks && msg.structuredResponse.documentationLinks.length > 0 && /* @__PURE__ */ h2("div", { className: "docs-section" }, msg.structuredResponse.documentationLinks.map((link, i) => /* @__PURE__ */ h2(
      "a",
      {
        key: i,
        href: link.url,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "docs-link"
      },
      /* @__PURE__ */ h2("div", { className: "docs-link-title" }, link.title),
      /* @__PURE__ */ h2("div", { className: "docs-link-description" }, link.description)
    ))), msg.structuredResponse?.suggestedQueries && msg.structuredResponse.suggestedQueries.length > 0 && /* @__PURE__ */ h2("div", { className: "suggested-queries" }, /* @__PURE__ */ h2("div", { className: "suggested-queries-title" }, "suggested questions"), /* @__PURE__ */ h2("div", { className: "suggested-queries-list" }, msg.structuredResponse.suggestedQueries.map((query, i) => /* @__PURE__ */ h2(
      "div",
      {
        key: i,
        className: "suggested-query",
        onClick: () => {
          inputValue.value = query;
          if (inputRef.value) {
            inputRef.value.focus();
          }
        }
      },
      query.toLowerCase()
    )))));
  };
  useEffect3(() => {
    console.log("[Toolbar] Mounted, visibility:", isVisible.value);
    const toolbar = document.querySelector(".toolbar");
    if (toolbar) {
      const rect = toolbar.getBoundingClientRect();
      console.log("[Toolbar] Position:", rect);
    }
  }, []);
  return /* @__PURE__ */ h2(Fragment, null, /* @__PURE__ */ h2("style", null, styles), /* @__PURE__ */ h2(
    "div",
    {
      className: `toolbar ${isMinimized.value ? "minimized" : ""} ${isVisible.value ? "" : "opacity-0"}`
    },
    /* @__PURE__ */ h2("div", { className: "header" }, /* @__PURE__ */ h2("div", { className: "controls" }, /* @__PURE__ */ h2(
      "button",
      {
        className: `control-button ${currentView.value === "components" ? "active" : ""}`,
        onClick: () => currentView.value = currentView.value === "components" ? "chat" : "components",
        title: "Selected Components"
      },
      /* @__PURE__ */ h2("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ h2("rect", { x: "2", y: "2", width: "5", height: "5", rx: "1", stroke: "currentColor", strokeWidth: "1.5", fill: "none" }), /* @__PURE__ */ h2("rect", { x: "9", y: "2", width: "5", height: "5", rx: "1", stroke: "currentColor", strokeWidth: "1.5", fill: "none" }), /* @__PURE__ */ h2("rect", { x: "2", y: "9", width: "5", height: "5", rx: "1", stroke: "currentColor", strokeWidth: "1.5", fill: "none" }), /* @__PURE__ */ h2("rect", { x: "9", y: "9", width: "5", height: "5", rx: "1", stroke: "currentColor", strokeWidth: "1.5", fill: "none" }))
    ), /* @__PURE__ */ h2(
      "button",
      {
        className: `control-button model-button ${currentView.value === "models" ? "active" : ""}`,
        onClick: () => currentView.value = currentView.value === "models" ? "chat" : "models",
        title: "Select Model"
      },
      /* @__PURE__ */ h2("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ h2("rect", { x: "2", y: "2", width: "12", height: "12", rx: "2", stroke: "currentColor", strokeWidth: "1.5", fill: "none" }), /* @__PURE__ */ h2("rect", { x: "5", y: "5", width: "6", height: "1.5", rx: "0.75", fill: "currentColor" }), /* @__PURE__ */ h2("rect", { x: "5", y: "8", width: "6", height: "1.5", rx: "0.75", fill: "currentColor" }), /* @__PURE__ */ h2("rect", { x: "5", y: "11", width: "4", height: "1.5", rx: "0.75", fill: "currentColor" }))
    ), /* @__PURE__ */ h2(
      "button",
      {
        className: `control-button ${currentView.value === "settings" ? "active" : ""}`,
        onClick: () => currentView.value = currentView.value === "settings" ? "chat" : "settings",
        title: "Settings"
      },
      /* @__PURE__ */ h2("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ h2("path", { d: "M8 10a2 2 0 100-4 2 2 0 000 4z" }), /* @__PURE__ */ h2("path", { d: "M13.3 9.2a1.2 1.2 0 010-2.4l.7-.1a6 6 0 00-.4-1.6l-.6.4a1.2 1.2 0 01-1.7-.4 1.2 1.2 0 01.4-1.7l.6-.3A6 6 0 0011 2l-.1.7a1.2 1.2 0 01-2.4 0L8.4 2a6 6 0 00-1.6.4l.4.6a1.2 1.2 0 01-.4 1.7 1.2 1.2 0 01-1.7-.4l-.3-.6A6 6 0 002 5l.7.1a1.2 1.2 0 010 2.4L2 7.6a6 6 0 00.4 1.6l.6-.4a1.2 1.2 0 011.7.4 1.2 1.2 0 01-.4 1.7l-.6.3A6 6 0 005 14l.1-.7a1.2 1.2 0 012.4 0l.1.7a6 6 0 001.6-.4l-.4-.6a1.2 1.2 0 01.4-1.7 1.2 1.2 0 011.7.4l.3.6A6 6 0 0014 11l-.7-.1zM8 11a3 3 0 110-6 3 3 0 010 6z" }))
    ), /* @__PURE__ */ h2(
      "button",
      {
        className: "control-button",
        onClick: createNewChat,
        disabled: isInitializing.value
      },
      "+"
    ), /* @__PURE__ */ h2(
      "button",
      {
        className: "control-button",
        onClick: () => isMinimized.value = !isMinimized.value
      },
      isMinimized.value ? "+" : "-"
    ))),
    !isMinimized.value && currentView.value === "models" && renderModelsView(),
    !isMinimized.value && currentView.value === "settings" && renderSettingsView(),
    !isMinimized.value && currentView.value === "components" && renderComponentsView(),
    !isMinimized.value && currentView.value === "chat" && (activeChat() ? /* @__PURE__ */ h2(Fragment, null, /* @__PURE__ */ h2("div", { className: "messages-container" }, activeChat().messages.map((msg, i) => /* @__PURE__ */ h2("div", { key: i, className: "message-wrapper" }, renderMessage(msg))), isStreamingResponse.value && streamingContent.value && /* @__PURE__ */ h2("div", { className: "message-wrapper" }, /* @__PURE__ */ h2("div", { className: "message assistant-message" }, /* @__PURE__ */ h2("div", { dangerouslySetInnerHTML: { __html: marked(streamingContent.value) } })))), /* @__PURE__ */ h2("div", { className: "input-area" }, /* @__PURE__ */ h2("form", { onSubmit: handleSubmit, className: "input-form" }, /* @__PURE__ */ h2(
      "input",
      {
        ref: (el) => inputRef.value = el,
        type: "text",
        className: "input",
        value: inputValue.value,
        onInput: handleInputChange,
        onKeyDown: handleInputKeyDown,
        placeholder: "ask about your react codebase... (type @ for context)",
        disabled: isInitializing.value || isStreamingResponse.value
      }
    )), /* @__PURE__ */ h2("div", { className: "input-controls" }, /* @__PURE__ */ h2(
      "button",
      {
        type: "button",
        className: `control-icon-button ${selectionMode.value === "selecting" ? "active" : ""}`,
        onClick: () => selectionMode.value = selectionMode.value === "selecting" ? "none" : "selecting",
        title: "Select Component"
      },
      /* @__PURE__ */ h2("svg", { width: "16", height: "16", viewBox: "0 0 16 16", fill: "currentColor", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ h2("path", { d: "M2 2h4v2H4v2H2V2zm10 0h4v4h-2V4h-2V2zM2 10h2v2h2v2H2v-4zm12 2h2v-2h-2v2zm0 0v2h-2v2h4v-4h-2z" }), /* @__PURE__ */ h2("circle", { cx: "8", cy: "8", r: "2", opacity: "0.5" }))
    ), /* @__PURE__ */ h2(
      "button",
      {
        type: "button",
        className: `send-button ${isStreamingResponse.value ? "streaming" : ""}`,
        onClick: (e) => {
          e.preventDefault();
          handleSubmit(e);
        },
        disabled: isInitializing.value || isStreamingResponse.value || !inputValue.value.trim()
      },
      isStreamingResponse.value ? /* @__PURE__ */ h2("span", { className: "loading-dots" }, /* @__PURE__ */ h2("span", { className: "loading-dot" }), /* @__PURE__ */ h2("span", { className: "loading-dot" }), /* @__PURE__ */ h2("span", { className: "loading-dot" })) : "\u2192"
    )))) : /* @__PURE__ */ h2("div", { className: "empty-state" }, /* @__PURE__ */ h2("div", { className: "empty-state-title" }, "welcome to reactlm"), /* @__PURE__ */ h2("div", { className: "empty-state-description" }, "start a new chat to get ai-powered help with your react codebase", isInitializing.value && /* @__PURE__ */ h2("div", { className: "loading-dots" }, /* @__PURE__ */ h2("div", { className: "loading-dot" }), /* @__PURE__ */ h2("div", { className: "loading-dot" }), /* @__PURE__ */ h2("div", { className: "loading-dot" }))), /* @__PURE__ */ h2(
      "button",
      {
        className: "new-chat-button",
        onClick: createNewChat,
        disabled: isInitializing.value
      },
      /* @__PURE__ */ h2("span", null, "+"),
      " new chat"
    )))
  ), selectionMode.value === "selecting" && /* @__PURE__ */ h2(
    ComponentInspector2,
    {
      isActive: true,
      onSelect: handleComponentSelect,
      theme: "dark"
    }
  ), showContextSelector.value && /* @__PURE__ */ h2(
    ContextSelector,
    {
      onSelect: handleContextSelect,
      position: contextSelectorPosition.value,
      searchTerm: contextSearchTerm.value
    }
  ));
}

// src/utils/event-emitter.ts
var EventEmitter = class {
  constructor() {
    this.events = /* @__PURE__ */ new Map();
  }
  on(event, listener) {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event).push(listener);
    return this;
  }
  once(event, listener) {
    const onceWrapper = (...args) => {
      this.removeListener(event, onceWrapper);
      listener(...args);
    };
    this.on(event, onceWrapper);
    return this;
  }
  emit(event, ...args) {
    const listeners = this.events.get(event);
    if (!listeners || listeners.length === 0) {
      return false;
    }
    listeners.forEach((listener) => listener(...args));
    return true;
  }
  removeListener(event, listener) {
    const listeners = this.events.get(event);
    if (!listeners) return this;
    const index = listeners.indexOf(listener);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
    return this;
  }
  removeAllListeners(event) {
    if (event) {
      this.events.delete(event);
    } else {
      this.events.clear();
    }
    return this;
  }
};

// src/llm/openrouter-client.ts
var OpenRouterClient = class extends EventEmitter {
  constructor(config) {
    super();
    this.baseUrl = "https://openrouter.ai/api/v1";
    this.models = [];
    this.isInitialized = false;
    this.apiKey = config.apiKey;
    this.siteUrl = config.siteUrl;
    this.siteName = config.siteName;
    this.initialize();
  }
  async initialize() {
    try {
      await this.fetchModels();
      this.isInitialized = true;
      this.emit("ready");
    } catch (error) {
      console.error("Failed to initialize OpenRouter client:", error);
      const cached = localStorage.getItem("openrouter_models");
      if (cached) {
        try {
          const { models } = JSON.parse(cached);
          this.models = models;
          this.isInitialized = true;
          this.emit("ready");
        } catch (parseError) {
          console.error("Failed to load cached models:", parseError);
          this.emit("error", error);
        }
      } else {
        this.emit("error", error);
      }
    }
  }
  async fetchModels() {
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json"
        }
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      this.models = data.data?.map(this.parseModel) || [];
      localStorage.setItem("openrouter_models", JSON.stringify({
        models: this.models,
        timestamp: Date.now()
      }));
      this.emit("modelsUpdated", this.models);
      return this.models;
    } catch (error) {
      console.error("Failed to fetch models from OpenRouter:", error);
      throw error;
    }
  }
  parseModel(model) {
    return {
      id: model.id,
      name: model.name || model.id,
      provider: model.id.split("/")[0] || "unknown",
      contextLength: model.context_length || 4096,
      pricing: {
        prompt: parseFloat(model.pricing?.prompt || "0"),
        completion: parseFloat(model.pricing?.completion || "0")
      },
      architectures: model.architecture,
      top_provider: model.top_provider
    };
  }
  async getLatestModels() {
    const cached = localStorage.getItem("openrouter_models");
    if (cached) {
      try {
        const { models, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < 36e5) {
          this.models = models;
          return models;
        }
      } catch (e) {
        console.warn("Invalid cached models data:", e);
      }
    }
    return this.fetchModels();
  }
  async *chat(messages, options = {}) {
    if (!this.isInitialized) {
      throw new Error("OpenRouter client not initialized. Please wait for initialization.");
    }
    if (!options.model) {
      throw new Error("Model must be specified");
    }
    const headers = {
      "Authorization": `Bearer ${this.apiKey}`,
      "Content-Type": "application/json"
    };
    if (options.siteUrl || this.siteUrl) {
      headers["HTTP-Referer"] = options.siteUrl || this.siteUrl;
    }
    if (options.siteName || this.siteName) {
      headers["X-Title"] = options.siteName || this.siteName;
    }
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: options.model,
        messages,
        stream: true,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 4096,
        stream_options: {
          include_usage: true
        }
      })
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText} - ${errorText}`);
    }
    if (!response.body) {
      throw new Error("No response body received");
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let usage;
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter((line) => line.trim());
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.usage) {
                usage = parsed.usage;
              }
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                yield content;
              }
            } catch (e) {
              console.warn("Failed to parse streaming chunk:", e, "Data:", data);
            }
          }
        }
      }
      return usage;
    } finally {
      reader.releaseLock();
    }
  }
  async completeChat(messages, options = {}) {
    if (!this.isInitialized) {
      throw new Error("OpenRouter client not initialized. Please wait for initialization.");
    }
    if (!options.model) {
      throw new Error("Model must be specified");
    }
    const headers = {
      "Authorization": `Bearer ${this.apiKey}`,
      "Content-Type": "application/json"
    };
    if (options.siteUrl || this.siteUrl) {
      headers["HTTP-Referer"] = options.siteUrl || this.siteUrl;
    }
    if (options.siteName || this.siteName) {
      headers["X-Title"] = options.siteName || this.siteName;
    }
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: options.model,
        messages,
        stream: false,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 4096
      })
    });
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText} - ${errorText}`);
    }
    const data = await response.json();
    return {
      content: data.choices[0].message.content,
      usage: data.usage
    };
  }
  estimateCost(messages, model) {
    const modelInfo = this.models.find((m) => m.id === model);
    if (!modelInfo) {
      throw new Error(`Model ${model} not found`);
    }
    const tokens = this.countTokens(messages);
    return {
      promptTokens: tokens.prompt,
      completionTokens: tokens.completion,
      totalCost: (tokens.prompt * modelInfo.pricing.prompt + tokens.completion * modelInfo.pricing.completion) / 1e6
      // Convert to dollars
    };
  }
  /**
   * Enhanced token counting with more accurate estimation
   */
  countTokens(messages) {
    const text2 = messages.map((m) => m.content).join(" ");
    const baseTokens = Math.ceil(text2.length / 3.5);
    const structureOverhead = messages.length * 4;
    const promptTokens = baseTokens + structureOverhead;
    const completionTokens = Math.ceil(promptTokens * 0.3);
    return {
      prompt: promptTokens,
      completion: completionTokens
    };
  }
  getModels() {
    return this.models;
  }
  getModel(id) {
    return this.models.find((m) => m.id === id);
  }
  /**
   * Get models filtered by provider
   */
  getModelsByProvider(provider) {
    return this.models.filter((m) => m.provider === provider);
  }
  /**
   * Get recommended models based on performance and cost
   */
  getRecommendedModels() {
    return this.models.filter((m) => m.contextLength >= 8e3).sort((a, b) => {
      const scoreA = this.calculateModelScore(a);
      const scoreB = this.calculateModelScore(b);
      return scoreB - scoreA;
    }).slice(0, 8);
  }
  calculateModelScore(model) {
    let score = model.contextLength / 1e3;
    if (model.id.includes("claude-3-5-sonnet")) score += 100;
    else if (model.id.includes("gpt-4o")) score += 90;
    else if (model.id.includes("gemini-2.0-flash")) score += 85;
    else if (model.id.includes("claude-3-opus")) score += 80;
    else if (model.id.includes("gpt-4-turbo")) score += 75;
    else if (model.id.includes("llama-3")) score += 70;
    if (model.pricing.prompt > 5e-5 && !model.id.includes("opus")) {
      score -= 20;
    }
    return score;
  }
  /**
   * Check if the client is ready to make requests
   */
  isReady() {
    return this.isInitialized;
  }
  /**
   * Get available providers from current models
   */
  getAvailableProviders() {
    const providers = new Set(this.models.map((m) => m.provider));
    return Array.from(providers).sort();
  }
};

// src/llm/providers.ts
var LLMHub = class {
  constructor() {
    this.providers = /* @__PURE__ */ new Map();
    this.clients = /* @__PURE__ */ new Map();
    this.activeProvider = "openrouter";
    this.activeModel = null;
    this.modelsByProvider = {};
    this.isApiMode = false;
    this.registerProviders();
  }
  async registerProviders() {
    this.providers.set("openrouter", {
      id: "openrouter",
      name: "OpenRouter (All Providers)",
      models: [],
      supportsStreaming: true,
      requiresApiKey: true
    });
  }
  async initializeProvider(providerId, apiKey, options) {
    if (providerId === "openrouter") {
      const client = new OpenRouterClient({
        apiKey,
        siteUrl: options?.siteUrl || window.location.href,
        siteName: options?.siteName || document.title
      });
      this.clients.set(providerId, client);
      if (!client.isReady()) {
        await new Promise((resolve, reject) => {
          client.once("ready", resolve);
          client.once("error", reject);
          setTimeout(() => {
            reject(new Error("OpenRouter client initialization timeout"));
          }, 1e4);
        });
      }
      try {
        const models = await client.getLatestModels();
        const provider = this.providers.get("openrouter");
        provider.models = models.map((m) => m.id);
        this.modelsByProvider = models.reduce((acc, model) => {
          const provider2 = model.id.split("/")[0];
          if (!acc[provider2]) acc[provider2] = [];
          acc[provider2].push(model);
          return acc;
        }, {});
        if (!this.activeModel && models.length > 0) {
          const preferredModel = models.find(
            (m) => m.id.includes("claude-3-5-sonnet") || m.id.includes("gpt-4o") || m.id.includes("gemini-2.0-flash")
          ) || models[0];
          this.activeModel = preferredModel.id;
        }
        return true;
      } catch (error) {
        console.error("Failed to initialize OpenRouter provider:", error);
        throw error;
      }
    }
    throw new Error(`Unknown provider: ${providerId}`);
  }
  /**
   * Initialize in demo mode - works without any API keys!
   */
  async initializeDemoMode() {
    this.isApiMode = false;
    this.activeProvider = "demo";
    this.activeModel = "demo/gemini-2.0-flash";
    this.modelsByProvider = {
      demo: [
        {
          id: "demo/gemini-2.0-flash",
          name: "Gemini 2.0 Flash (Demo)",
          provider: "demo",
          contextLength: 32768,
          pricing: { prompt: 0, completion: 0 }
        }
      ]
    };
    console.log("[LLMHub] Initialized in demo mode - no API keys required!");
    return true;
  }
  /**
   * Initialize in API mode - uses server endpoints instead of direct API keys
   */
  async initializeApiMode(apiEndpoint, modelsEndpoint) {
    this.isApiMode = true;
    this.apiEndpoint = apiEndpoint;
    this.modelsEndpoint = modelsEndpoint || "/api/models";
    this.activeProvider = "api";
    if (modelsEndpoint) {
      try {
        const response = await fetch(modelsEndpoint);
        if (response.ok) {
          const data = await response.json();
          const models = data.data || [];
          this.modelsByProvider = models.reduce((acc, model) => {
            const provider = model.id.split("/")[0];
            if (!acc[provider]) acc[provider] = [];
            acc[provider].push(model);
            return acc;
          }, {});
          if (!this.activeModel && models.length > 0) {
            const preferredModel = models.find(
              (m) => m.id.includes("gemini-2.0-flash") || m.id.includes("gemini-2-flash")
            ) || models.find(
              (m) => m.id.includes("claude-3-5-sonnet") || m.id.includes("gpt-4o")
            ) || models[0];
            this.activeModel = preferredModel.id;
          }
        }
      } catch (error) {
        console.error("Failed to fetch models:", error);
      }
    }
    return true;
  }
  getProviders() {
    return Array.from(this.providers.values());
  }
  getActiveProvider() {
    return this.activeProvider;
  }
  getModelsByProvider(provider) {
    return this.modelsByProvider[provider] || [];
  }
  getAvailableModels() {
    if (this.activeProvider === "demo") {
      return [{
        id: "demo/gemini-2.0-flash",
        name: "Gemini 2.0 Flash (Demo)",
        provider: "demo",
        contextLength: 32768,
        pricing: { prompt: 0, completion: 0 },
        description: "Demo mode - no API key required"
      }];
    }
    const allModels = [];
    Object.values(this.modelsByProvider).forEach((models) => {
      allModels.push(...models);
    });
    return allModels;
  }
  getAllModels() {
    const client = this.clients.get("openrouter");
    return client ? client.getModels() : [];
  }
  getRecommendedModels() {
    const allModels = this.getAllModels();
    const recommendations = [];
    const providers = ["anthropic", "openai", "google", "meta-llama", "mistralai"];
    providers.forEach((provider) => {
      const providerModels = this.modelsByProvider[provider] || [];
      if (providerModels.length > 0) {
        const sorted = providerModels.filter((m) => m.contextLength >= 8e3).sort((a, b) => {
          const aScore = this.getModelScore(a);
          const bScore = this.getModelScore(b);
          return bScore - aScore;
        });
        if (sorted[0]) {
          recommendations.push(sorted[0]);
        }
      }
    });
    return recommendations;
  }
  getModelScore(model) {
    let score = model.contextLength / 1e3;
    if (model.id.includes("claude-3-5-sonnet")) score += 100;
    else if (model.id.includes("gpt-4o")) score += 90;
    else if (model.id.includes("gemini-2.0-flash")) score += 85;
    else if (model.id.includes("claude-3-opus")) score += 80;
    else if (model.id.includes("gpt-4-turbo")) score += 75;
    if (model.pricing.prompt > 5e-5 && !model.id.includes("opus")) {
      score -= 20;
    }
    return score;
  }
  setApiKey(provider, apiKey, options) {
    return this.initializeProvider(provider, apiKey, options);
  }
  getActiveModel() {
    return this.activeModel;
  }
  setActiveModel(provider, model) {
    this.activeProvider = provider;
    this.activeModel = model;
  }
  getClient(provider) {
    return this.clients.get(provider);
  }
  async *chat(messages, context) {
    if (this.activeProvider === "demo") {
      const demoResponses = [
        "\u{1F44B} Welcome to React LLM! I'm running in demo mode.\n\nTo enable full AI capabilities:\n\n1. **Option A**: Use your own API key\n   ```javascript\n   ReactLLM.init({\n     providers: {\n       openrouter: 'your-api-key'\n     }\n   });\n   ```\n\n2. **Option B**: Use a server-side proxy\n   ```javascript\n   ReactLLM.init({\n     apiEndpoint: '/api/chat'\n   });\n   ```\n\nI can see your React components and would love to help once configured!",
        "I notice you have some React components on this page. Once you configure an API key, I can help you:\n\n- \u{1F50D} Analyze component structure\n- \u270F\uFE0F Suggest improvements\n- \u{1F41B} Debug issues\n- \u{1F4DD} Generate documentation\n- \u{1F3A8} Refactor code\n\nReact LLM works on any website - just add the script tag!",
        "Demo mode is limited, but here's what React LLM can do:\n\n- **Component Selection**: Click any component to select it\n- **Context Aware**: I understand your component tree\n- **Multi-Model**: Supports GPT-4, Claude, Gemini, and more\n- **Browser Native**: No server required (with API keys)\n\nConfigure me to unlock these features!"
      ];
      const response = demoResponses[Math.floor(Math.random() * demoResponses.length)];
      for (const char of response) {
        yield char;
        await new Promise((resolve) => setTimeout(resolve, 10));
      }
      return;
    }
    if (this.isApiMode && this.apiEndpoint) {
      const enhancedMessages2 = this.enhanceWithContext(messages, context);
      const response = await fetch(this.apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: enhancedMessages2,
          model: this.activeModel,
          stream: true
        })
      });
      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }
      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) yield content;
            } catch (e) {
            }
          }
        }
      }
      return;
    }
    const client = this.clients.get(this.activeProvider);
    if (!client) {
      throw new Error("No API key set for provider");
    }
    const enhancedMessages = this.enhanceWithContext(messages, context);
    if (!this.activeModel) {
      throw new Error("No model selected. Please choose a model first.");
    }
    yield* client.chat(enhancedMessages, {
      model: this.activeModel,
      siteUrl: window.location.href,
      siteName: document.title
    });
  }
  async completeChat(messages, context) {
    if (this.activeProvider === "demo") {
      return "Welcome to React LLM! I'm running in demo mode. Configure an API key to unlock full AI capabilities.";
    }
    if (this.isApiMode && this.apiEndpoint) {
      const enhancedMessages2 = this.enhanceWithContext(messages, context);
      const response = await fetch(this.apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          messages: enhancedMessages2,
          model: this.activeModel,
          stream: false
        })
      });
      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }
      const data = await response.json();
      return data.choices?.[0]?.message?.content || "";
    }
    const client = this.clients.get(this.activeProvider);
    if (!client) {
      throw new Error("No API key set for provider");
    }
    const enhancedMessages = this.enhanceWithContext(messages, context);
    if (!this.activeModel) {
      throw new Error("No model selected. Please choose a model first.");
    }
    const result = await client.completeChat(enhancedMessages, {
      model: this.activeModel,
      siteUrl: window.location.href,
      siteName: document.title
    });
    return result.content;
  }
  /**
   * Enhanced context building with more sophisticated component analysis
   */
  enhanceWithContext(messages, context) {
    if (!context) return messages;
    const contextParts = [
      `You are helping with a React component. Here's the context:`,
      ``,
      `Component: ${context.name}`,
      `Type: ${this.getComponentType(context)}`,
      `Props: ${this.formatProps(context.props)}`,
      context.state ? `State: ${JSON.stringify(context.state, null, 2)}` : null,
      context.hooks.length > 0 ? `Hooks: ${context.hooks.length} detected` : null,
      context.parent ? `Parent: ${context.parent.name}` : null,
      context.children.length > 0 ? `Children: ${context.children.map((c) => c.name).join(", ")}` : null,
      ``,
      context.sourceCode ? `Source code:
\`\`\`${context.language || "jsx"}
${context.sourceCode}
\`\`\`` : null,
      ``,
      `Please provide helpful guidance for working with this component. Consider its props, state, and relationships when providing suggestions.`
    ].filter(Boolean).join("\n");
    const systemMessage = {
      role: "system",
      content: contextParts
    };
    return [systemMessage, ...messages];
  }
  getComponentType(context) {
    if (context.hooks.length > 0) return "Function Component (with hooks)";
    if (context.state) return "Class Component";
    if (context.props && Object.keys(context.props).length > 0) return "Function Component";
    return "Component";
  }
  formatProps(props) {
    if (!props || Object.keys(props).length === 0) {
      return "No props";
    }
    const filteredProps = Object.entries(props).filter(([key]) => !key.startsWith("__") && key !== "children").reduce((acc, [key, value]) => {
      acc[key] = typeof value === "function" ? "[Function]" : typeof value === "object" && value !== null ? "[Object]" : value;
      return acc;
    }, {});
    return Object.keys(filteredProps).length > 0 ? JSON.stringify(filteredProps, null, 2) : "No relevant props";
  }
  isInitialized() {
    return this.activeProvider === "demo" || this.isApiMode || this.clients.size > 0;
  }
  getAvailableProviders() {
    return Array.from(this.clients.keys());
  }
  /**
   * Get cost estimate for a conversation
   */
  estimateCost(messages, context) {
    const client = this.clients.get(this.activeProvider);
    if (!client || !this.activeModel) {
      return null;
    }
    const enhancedMessages = this.enhanceWithContext(messages, context);
    return client.estimateCost(enhancedMessages, this.activeModel);
  }
};

// src/monitoring/console-monitor.ts
import { signal as signal2, computed } from "@preact/signals";
var ConsoleMonitor = class {
  constructor() {
    this.entries = signal2([]);
    this.maxEntries = 1e3;
    this.originalMethods = {};
    this.isMonitoring = false;
    // Computed signals for filtering
    this.logs = computed(
      () => this.entries.value.filter((e) => e.level === "log")
    );
    this.errors = computed(
      () => this.entries.value.filter((e) => e.level === "error")
    );
    this.warnings = computed(
      () => this.entries.value.filter((e) => e.level === "warn")
    );
    this.saveOriginalMethods();
  }
  saveOriginalMethods() {
    ["log", "warn", "error", "info", "debug", "trace"].forEach((method) => {
      this.originalMethods[method] = console[method];
    });
  }
  start() {
    if (this.isMonitoring) return;
    ["log", "warn", "error", "info", "debug", "trace"].forEach((method) => {
      const original = this.originalMethods[method];
      console[method] = (...args) => {
        original.apply(console, args);
        try {
          const entry = {
            id: `console-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: Date.now(),
            level: method,
            args: this.cloneArgs(args),
            stack: this.extractStack(),
            source: this.extractSource(),
            formatted: this.formatArgs(args)
          };
          this.addEntry(entry);
        } catch (error) {
        }
      };
    });
    this.isMonitoring = true;
    console.info("[ReactLLM] Console monitoring started");
  }
  stop() {
    if (!this.isMonitoring) return;
    Object.entries(this.originalMethods).forEach(([method, original]) => {
      console[method] = original;
    });
    this.isMonitoring = false;
    console.info("[ReactLLM] Console monitoring stopped");
  }
  cloneArgs(args) {
    try {
      return args.map((arg) => {
        if (arg === null || arg === void 0) return arg;
        if (typeof arg === "function") return "[Function]";
        if (arg instanceof Error) {
          return {
            name: arg.name,
            message: arg.message,
            stack: arg.stack
          };
        }
        if (arg instanceof HTMLElement) {
          return {
            tagName: arg.tagName,
            id: arg.id,
            className: arg.className,
            innerHTML: arg.innerHTML.substring(0, 100) + "..."
          };
        }
        return structuredClone(arg);
      });
    } catch (error) {
      return args.map((arg) => {
        try {
          return JSON.parse(JSON.stringify(arg));
        } catch {
          return String(arg);
        }
      });
    }
  }
  extractStack() {
    const stack = new Error().stack || "";
    return stack.split("\n").slice(3).join("\n");
  }
  extractSource() {
    const stack = this.extractStack();
    const match = stack.match(/at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)/);
    if (match) {
      const [, functionName, file, line, column] = match;
      return `${functionName} (${file}:${line}:${column})`;
    }
    return "Unknown source";
  }
  formatArgs(args) {
    return args.map((arg) => {
      if (typeof arg === "string") return arg;
      if (typeof arg === "object") {
        try {
          return JSON.stringify(arg, null, 2);
        } catch {
          return String(arg);
        }
      }
      return String(arg);
    }).join(" ");
  }
  addEntry(entry) {
    const current = this.entries.value;
    const updated = [...current, entry];
    if (updated.length > this.maxEntries) {
      updated.splice(0, updated.length - this.maxEntries);
    }
    this.entries.value = updated;
  }
  clear() {
    this.entries.value = [];
  }
  getEntries(filter) {
    let results = this.entries.value;
    if (filter?.level) {
      results = results.filter((e) => e.level === filter.level);
    }
    if (filter?.since) {
      results = results.filter((e) => e.timestamp > filter.since);
    }
    if (filter?.search) {
      const searchLower = filter.search.toLowerCase();
      results = results.filter(
        (e) => e.formatted.toLowerCase().includes(searchLower)
      );
    }
    return results;
  }
  exportToString() {
    return this.entries.value.map((entry) => {
      const time = new Date(entry.timestamp).toLocaleTimeString();
      return `[${time}] [${entry.level.toUpperCase()}] ${entry.formatted}`;
    }).join("\n");
  }
};

// src/monitoring/network-monitor.ts
import { signal as signal3 } from "@preact/signals";
var NetworkMonitor = class {
  constructor() {
    this.requests = signal3([]);
    this.maxRequests = 500;
    this.isMonitoring = false;
    // Original methods
    this.originalFetch = window.fetch;
    this.originalXHROpen = XMLHttpRequest.prototype.open;
    this.originalXHRSend = XMLHttpRequest.prototype.send;
    this.originalXHRSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
  }
  start() {
    if (this.isMonitoring) return;
    this.interceptFetch();
    this.interceptXHR();
    this.isMonitoring = true;
  }
  interceptFetch() {
    window.fetch = async (...args) => {
      const [input, init2] = args;
      const url = typeof input === "string" ? input : input.url;
      const method = init2?.method || "GET";
      const request = {
        id: `fetch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        method,
        url,
        headers: this.extractHeaders(init2?.headers),
        body: await this.extractBody(init2?.body),
        status: "pending",
        type: "fetch"
      };
      this.addRequest(request);
      try {
        const response = await this.originalFetch.apply(window, args);
        const clonedResponse = response.clone();
        const responseData = {
          status: response.status,
          statusText: response.statusText,
          headers: this.extractResponseHeaders(response.headers),
          body: await this.extractResponseBody(clonedResponse),
          size: Number(response.headers.get("content-length")) || 0
        };
        this.updateRequest(request.id, {
          response: responseData,
          duration: Date.now() - request.timestamp,
          status: "completed"
        });
        return response;
      } catch (error) {
        this.updateRequest(request.id, {
          error,
          duration: Date.now() - request.timestamp,
          status: "failed"
        });
        throw error;
      }
    };
  }
  interceptXHR() {
    const self = this;
    XMLHttpRequest.prototype.open = function(method, url, async, username, password) {
      const xhr = this;
      xhr._requestInfo = {
        method,
        url: url.toString(),
        headers: {}
      };
      return self.originalXHROpen.apply(this, arguments);
    };
    XMLHttpRequest.prototype.setRequestHeader = function(name, value) {
      const xhr = this;
      if (xhr._requestInfo) {
        xhr._requestInfo.headers[name] = value;
      }
      return self.originalXHRSetRequestHeader.apply(this, arguments);
    };
    XMLHttpRequest.prototype.send = function(body) {
      const xhr = this;
      if (xhr._requestInfo) {
        const request = {
          id: `xhr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: Date.now(),
          method: xhr._requestInfo.method,
          url: xhr._requestInfo.url,
          headers: xhr._requestInfo.headers,
          body: self.extractXHRBody(body),
          status: "pending",
          type: "xhr"
        };
        self.addRequest(request);
        xhr.addEventListener("load", () => {
          const responseData = {
            status: xhr.status,
            statusText: xhr.statusText,
            headers: self.extractXHRResponseHeaders(xhr),
            body: self.extractXHRResponseBody(xhr)
          };
          self.updateRequest(request.id, {
            response: responseData,
            duration: Date.now() - request.timestamp,
            status: "completed"
          });
        });
        xhr.addEventListener("error", () => {
          self.updateRequest(request.id, {
            error: new Error("Network request failed"),
            duration: Date.now() - request.timestamp,
            status: "failed"
          });
        });
      }
      return self.originalXHRSend.apply(this, arguments);
    };
  }
  extractHeaders(headers) {
    const result = {};
    if (!headers) return result;
    if (headers instanceof Headers) {
      headers.forEach((value, key) => {
        result[key] = value;
      });
    } else if (Array.isArray(headers)) {
      headers.forEach(([key, value]) => {
        result[key] = value;
      });
    } else {
      Object.assign(result, headers);
    }
    return result;
  }
  async extractBody(body) {
    if (!body) return void 0;
    if (typeof body === "string") return body;
    if (body instanceof FormData) {
      const data = {};
      body.forEach((value, key) => {
        data[key] = value;
      });
      return data;
    }
    if (body instanceof Blob) {
      return await body.text();
    }
    if (body instanceof ArrayBuffer) {
      return new TextDecoder().decode(body);
    }
    return String(body);
  }
  extractResponseHeaders(headers) {
    const result = {};
    headers.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }
  async extractResponseBody(response) {
    const contentType = response.headers.get("content-type") || "";
    try {
      if (contentType.includes("application/json")) {
        return await response.json();
      } else if (contentType.includes("text/")) {
        return await response.text();
      } else {
        const blob = await response.blob();
        return `[Binary data: ${blob.size} bytes]`;
      }
    } catch (error) {
      return "[Failed to parse response body]";
    }
  }
  extractXHRBody(body) {
    if (!body) return void 0;
    if (typeof body === "string") return body;
    if (body instanceof FormData) {
      const data = {};
      body.forEach((value, key) => {
        data[key] = value;
      });
      return data;
    }
    return String(body);
  }
  extractXHRResponseHeaders(xhr) {
    const headers = {};
    const headerString = xhr.getAllResponseHeaders();
    headerString.split("\n").forEach((line) => {
      const match = line.match(/^(.+?):\s*(.+)$/);
      if (match) {
        headers[match[1].trim()] = match[2].trim();
      }
    });
    return headers;
  }
  extractXHRResponseBody(xhr) {
    const contentType = xhr.getResponseHeader("content-type") || "";
    if (contentType.includes("application/json")) {
      try {
        return JSON.parse(xhr.responseText);
      } catch {
        return xhr.responseText;
      }
    }
    return xhr.responseText;
  }
  addRequest(request) {
    const current = this.requests.value;
    const updated = [...current, request];
    if (updated.length > this.maxRequests) {
      updated.splice(0, updated.length - this.maxRequests);
    }
    this.requests.value = updated;
  }
  updateRequest(id, updates) {
    this.requests.value = this.requests.value.map(
      (req) => req.id === id ? { ...req, ...updates } : req
    );
  }
  getRequests(filter) {
    let results = this.requests.value;
    if (filter?.status) {
      results = results.filter((r) => r.status === filter.status);
    }
    if (filter?.method) {
      results = results.filter((r) => r.method === filter.method);
    }
    if (filter?.urlPattern) {
      const pattern = new RegExp(filter.urlPattern);
      results = results.filter((r) => pattern.test(r.url));
    }
    if (filter?.since) {
      results = results.filter((r) => r.timestamp > filter.since);
    }
    return results;
  }
  exportAsHAR() {
    return {
      log: {
        version: "1.2",
        creator: {
          name: "React LLM",
          version: "1.0"
        },
        entries: this.requests.value.map((req) => ({
          startedDateTime: new Date(req.timestamp).toISOString(),
          time: req.duration || 0,
          request: {
            method: req.method,
            url: req.url,
            headers: Object.entries(req.headers).map(([name, value]) => ({ name, value })),
            postData: req.body ? {
              mimeType: "application/json",
              text: JSON.stringify(req.body)
            } : void 0
          },
          response: req.response ? {
            status: req.response.status,
            statusText: req.response.statusText,
            headers: Object.entries(req.response.headers).map(([name, value]) => ({ name, value })),
            content: {
              size: req.response.size || 0,
              mimeType: req.response.headers["content-type"] || "text/plain",
              text: JSON.stringify(req.response.body)
            }
          } : void 0
        }))
      }
    };
  }
  stop() {
    if (!this.isMonitoring) return;
    window.fetch = this.originalFetch;
    XMLHttpRequest.prototype.open = this.originalXHROpen;
    XMLHttpRequest.prototype.send = this.originalXHRSend;
    XMLHttpRequest.prototype.setRequestHeader = this.originalXHRSetRequestHeader;
    this.isMonitoring = false;
  }
};

// src/monitoring/performance-monitor.ts
import { signal as signal4 } from "@preact/signals";
var PerformanceMonitor = class {
  constructor() {
    this.metrics = signal4([]);
    this.observers = [];
    this.isMonitoring = false;
  }
  start() {
    if (this.isMonitoring) return;
    this.observeNavigationTiming();
    this.observeResourceTiming();
    this.observePaintTiming();
    this.observeLCP();
    this.observeFID();
    this.observeCLS();
    this.observeUserTiming();
    this.isMonitoring = true;
  }
  observeNavigationTiming() {
    const navEntries = performance.getEntriesByType("navigation");
    navEntries.forEach((entry) => {
      const nav = entry;
      this.addMetric({
        type: "navigation",
        name: "page-load",
        value: nav.loadEventEnd - nav.fetchStart,
        metadata: {
          dns: nav.domainLookupEnd - nav.domainLookupStart,
          tcp: nav.connectEnd - nav.connectStart,
          ttfb: nav.responseStart - nav.fetchStart,
          domContentLoaded: nav.domContentLoadedEventEnd - nav.fetchStart,
          domInteractive: nav.domInteractive - nav.fetchStart
        }
      });
    });
  }
  observeResourceTiming() {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        const resource = entry;
        this.addMetric({
          type: "resource",
          name: resource.name,
          value: resource.duration,
          metadata: {
            initiatorType: resource.initiatorType,
            transferSize: resource.transferSize,
            encodedBodySize: resource.encodedBodySize,
            decodedBodySize: resource.decodedBodySize
          }
        });
      });
    });
    observer.observe({ entryTypes: ["resource"] });
    this.observers.push(observer);
  }
  observePaintTiming() {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        this.addMetric({
          type: "paint",
          name: entry.name,
          value: entry.startTime
        });
      });
    });
    observer.observe({ entryTypes: ["paint"] });
    this.observers.push(observer);
  }
  observeLCP() {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      this.addMetric({
        type: "lcp",
        name: "largest-contentful-paint",
        value: lastEntry.startTime,
        metadata: {
          element: lastEntry.element?.tagName,
          url: lastEntry.url,
          size: lastEntry.size
        }
      });
    });
    observer.observe({ entryTypes: ["largest-contentful-paint"] });
    this.observers.push(observer);
  }
  observeFID() {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        const fid = entry;
        this.addMetric({
          type: "fid",
          name: "first-input-delay",
          value: fid.processingStart - fid.startTime,
          metadata: {
            eventType: fid.name,
            target: fid.target?.tagName
          }
        });
      });
    });
    observer.observe({ entryTypes: ["first-input"] });
    this.observers.push(observer);
  }
  observeCLS() {
    let clsValue = 0;
    let clsEntries = [];
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          clsEntries.push(entry);
        }
      }
      this.addMetric({
        type: "cls",
        name: "cumulative-layout-shift",
        value: clsValue,
        metadata: {
          shifts: clsEntries.length
        }
      });
    });
    observer.observe({ entryTypes: ["layout-shift"] });
    this.observers.push(observer);
  }
  observeUserTiming() {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        this.addMetric({
          type: entry.entryType,
          name: entry.name,
          value: entry.entryType === "measure" ? entry.duration : entry.startTime
        });
      });
    });
    observer.observe({ entryTypes: ["mark", "measure"] });
    this.observers.push(observer);
  }
  addMetric(metric) {
    const fullMetric = {
      ...metric,
      id: `perf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    };
    this.metrics.value = [...this.metrics.value, fullMetric];
  }
  getMetrics(filter) {
    let results = this.metrics.value;
    if (filter?.type) {
      results = results.filter((m) => m.type === filter.type);
    }
    if (filter?.name) {
      results = results.filter((m) => m.name.includes(filter.name));
    }
    if (filter?.since) {
      results = results.filter((m) => m.timestamp > filter.since);
    }
    return results;
  }
  getSummary() {
    const navMetric = this.metrics.value.find((m) => m.type === "navigation");
    const lcpMetric = this.metrics.value.find((m) => m.type === "lcp");
    const fidMetric = this.metrics.value.find((m) => m.type === "fid");
    const clsMetric = this.metrics.value.find((m) => m.type === "cls");
    const fpMetric = this.metrics.value.find((m) => m.name === "first-paint");
    const fcpMetric = this.metrics.value.find((m) => m.name === "first-contentful-paint");
    return {
      pageLoad: navMetric?.value,
      ttfb: navMetric?.metadata?.ttfb,
      firstPaint: fpMetric?.value,
      firstContentfulPaint: fcpMetric?.value,
      largestContentfulPaint: lcpMetric?.value,
      firstInputDelay: fidMetric?.value,
      cumulativeLayoutShift: clsMetric?.value,
      resourceCount: this.metrics.value.filter((m) => m.type === "resource").length
    };
  }
  stop() {
    this.observers.forEach((observer) => observer.disconnect());
    this.observers = [];
    this.isMonitoring = false;
  }
};

// src/monitoring/dom-monitor.ts
import { signal as signal5 } from "@preact/signals";
var DOMMonitor = class {
  constructor() {
    this.changes = signal5([]);
    this.observer = null;
    this.maxChanges = 1e3;
    this.isMonitoring = false;
  }
  start(root = document.body) {
    if (this.isMonitoring) return;
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        this.processMutation(mutation);
      });
    });
    this.observer.observe(root, {
      childList: true,
      attributes: true,
      characterData: true,
      subtree: true,
      attributeOldValue: true,
      characterDataOldValue: true
    });
    this.isMonitoring = true;
  }
  processMutation(mutation) {
    switch (mutation.type) {
      case "childList":
        this.processChildListMutation(mutation);
        break;
      case "attributes":
        this.processAttributeMutation(mutation);
        break;
      case "characterData":
        this.processCharacterDataMutation(mutation);
        break;
    }
  }
  processChildListMutation(mutation) {
    mutation.addedNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node;
        this.addChange({
          type: "added",
          target: this.extractElementInfo(element),
          details: {
            parentPath: this.getElementPath(mutation.target),
            html: element.outerHTML.substring(0, 200)
          }
        });
      }
    });
    mutation.removedNodes.forEach((node) => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node;
        this.addChange({
          type: "removed",
          target: this.extractElementInfo(element),
          details: {
            parentPath: this.getElementPath(mutation.target)
          }
        });
      }
    });
  }
  processAttributeMutation(mutation) {
    const element = mutation.target;
    this.addChange({
      type: "attributes",
      target: this.extractElementInfo(element),
      details: {
        attribute: mutation.attributeName,
        oldValue: mutation.oldValue,
        newValue: element.getAttribute(mutation.attributeName)
      }
    });
  }
  processCharacterDataMutation(mutation) {
    const node = mutation.target;
    const parent = node.parentElement;
    if (parent) {
      this.addChange({
        type: "characterData",
        target: this.extractElementInfo(parent),
        details: {
          oldValue: mutation.oldValue,
          newValue: node.textContent
        }
      });
    }
  }
  extractElementInfo(element) {
    return {
      tagName: element.tagName.toLowerCase(),
      id: element.id,
      className: element.className,
      path: this.getElementPath(element)
    };
  }
  getElementPath(element) {
    const path = [];
    let current = element;
    while (current && current !== document.body) {
      let selector = current.tagName.toLowerCase();
      if (current.id) {
        selector += `#${current.id}`;
      } else if (current.className) {
        selector += `.${current.className.split(" ")[0]}`;
      } else {
        const parent = current.parentElement;
        if (parent) {
          const index = Array.from(parent.children).indexOf(current);
          selector += `:nth-child(${index + 1})`;
        }
      }
      path.unshift(selector);
      current = current.parentElement;
    }
    return path.join(" > ");
  }
  addChange(change) {
    const fullChange = {
      ...change,
      id: `dom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now()
    };
    const current = this.changes.value;
    const updated = [...current, fullChange];
    if (updated.length > this.maxChanges) {
      updated.splice(0, updated.length - this.maxChanges);
    }
    this.changes.value = updated;
  }
  getChanges(filter) {
    let results = this.changes.value;
    if (filter?.type) {
      results = results.filter((c) => c.type === filter.type);
    }
    if (filter?.selector) {
      results = results.filter(
        (c) => c.target.path.includes(filter.selector) || c.target.id === filter.selector || c.target.className?.includes(filter.selector)
      );
    }
    if (filter?.since) {
      results = results.filter((c) => c.timestamp > filter.since);
    }
    return results;
  }
  stop() {
    this.observer?.disconnect();
    this.observer = null;
    this.isMonitoring = false;
  }
};

// src/monitoring/devtools-protocol.ts
var DevToolsProtocol = class {
  constructor() {
    this.isConnected = false;
    this.port = null;
  }
  async connect() {
    if (typeof globalThis.chrome !== "undefined" && globalThis.chrome.runtime && globalThis.chrome.runtime.connect) {
      try {
        this.port = globalThis.chrome.runtime.connect({ name: "react-llm-devtools" });
        this.isConnected = true;
        console.log("[ReactLLM] Connected to Chrome DevTools Protocol");
      } catch (error) {
        console.info("[ReactLLM] Chrome DevTools Protocol not available:", error);
        throw error;
      }
    } else {
      throw new Error("Chrome DevTools Protocol not available");
    }
  }
  disconnect() {
    if (this.port) {
      this.port.disconnect();
      this.port = null;
    }
    this.isConnected = false;
  }
  isAvailable() {
    return this.isConnected;
  }
  // Enhanced console monitoring via CDP
  async getConsoleMessages() {
    if (!this.isConnected) return [];
    return [];
  }
  // Enhanced network monitoring via CDP
  async getNetworkRequests() {
    if (!this.isConnected) return [];
    return [];
  }
  // Enhanced performance monitoring via CDP
  async getPerformanceMetrics() {
    if (!this.isConnected) return [];
    return [];
  }
  // Send message to DevTools if available
  sendMessage(message) {
    if (this.port) {
      this.port.postMessage(message);
    }
  }
};

// src/monitoring/monitor-manager.ts
var MonitorManager = class {
  constructor() {
    this.devtools = null;
    this.selectedComponents = [];
    this.console = new ConsoleMonitor();
    this.network = new NetworkMonitor();
    this.performance = new PerformanceMonitor();
    this.dom = new DOMMonitor();
    this.initializeDevTools();
  }
  async initializeDevTools() {
    try {
      this.devtools = new DevToolsProtocol();
      await this.devtools.connect();
    } catch (error) {
      console.info("[ReactLLM] DevTools Protocol not available, using fallback monitoring");
    }
  }
  start() {
    this.console.start();
    this.network.start();
    this.performance.start();
    this.dom.start();
  }
  stop() {
    this.console.stop();
    this.network.stop();
    this.performance.stop();
    this.dom.stop();
    this.devtools?.disconnect();
  }
  setSelectedComponents(components) {
    this.selectedComponents = components;
  }
  getContext(type, filter) {
    switch (type) {
      case "console":
        return this.formatConsoleContext(filter);
      case "network":
        return this.formatNetworkContext(filter);
      case "performance":
        return this.formatPerformanceContext(filter);
      case "dom":
        return this.formatDOMContext(filter);
      case "components":
        return this.formatComponentsContext(filter);
      default:
        return "";
    }
  }
  formatConsoleContext(filter) {
    const entries = this.console.getEntries(filter);
    const recent = entries.slice(-50);
    return `## Console Logs

${recent.map((entry) => {
      const time = new Date(entry.timestamp).toLocaleTimeString();
      return `[${time}] [${entry.level.toUpperCase()}] ${entry.formatted}`;
    }).join("\n")}`;
  }
  formatNetworkContext(filter) {
    const requests = this.network.getRequests(filter);
    const recent = requests.slice(-20);
    return `## Network Requests

${recent.map((req) => {
      const status = req.response?.status || "pending";
      const duration = req.duration ? `${req.duration}ms` : "in progress";
      return `${req.method} ${req.url} - ${status} (${duration})`;
    }).join("\n")}`;
  }
  formatPerformanceContext(filter) {
    const summary = this.performance.getSummary();
    return `## Performance Metrics

- Page Load: ${summary.pageLoad}ms
- TTFB: ${summary.ttfb}ms  
- First Paint: ${summary.firstPaint}ms
- First Contentful Paint: ${summary.firstContentfulPaint}ms
- Largest Contentful Paint: ${summary.largestContentfulPaint}ms
- First Input Delay: ${summary.firstInputDelay}ms
- Cumulative Layout Shift: ${summary.cumulativeLayoutShift}
- Resources Loaded: ${summary.resourceCount}`;
  }
  formatDOMContext(filter) {
    const changes = this.dom.getChanges(filter);
    const recent = changes.slice(-30);
    return `## DOM Changes

${recent.map((change) => {
      const time = new Date(change.timestamp).toLocaleTimeString();
      return `[${time}] ${change.type}: ${change.target.path}`;
    }).join("\n")}`;
  }
  // Get specific monitor instances for direct access
  getConsoleMonitor() {
    return this.console;
  }
  getNetworkMonitor() {
    return this.network;
  }
  getPerformanceMonitor() {
    return this.performance;
  }
  getDOMMonitor() {
    return this.dom;
  }
  getDevToolsProtocol() {
    return this.devtools;
  }
  formatComponentsContext(filter) {
    if (this.selectedComponents.length === 0) {
      return "## Selected Components\n\nNo components currently selected.";
    }
    return `## Selected Components

${this.selectedComponents.map((comp, index) => {
      const componentInfo = [
        `### Component ${index + 1}: ${comp.name}`,
        `- ID: ${comp.id}`,
        `- Type: ${comp.fiberType}`,
        comp.domElement ? `- DOM Element: <${comp.domElement.tagName.toLowerCase()}>` : "",
        comp.sourceLocation ? `- Source: ${comp.sourceLocation.fileName}:${comp.sourceLocation.lineNumber}` : "",
        `- Depth: ${comp.depth}`,
        "",
        "#### Props:",
        "```json",
        JSON.stringify(comp.props, null, 2),
        "```",
        "",
        comp.state ? [
          "#### State:",
          "```json",
          JSON.stringify(comp.state, null, 2),
          "```",
          ""
        ].join("\n") : "",
        comp.hooks && comp.hooks.length > 0 ? [
          "#### Hooks:",
          comp.hooks.map((hook, i) => `${i + 1}. ${hook.name || "Unknown Hook"}`).join("\n"),
          ""
        ].join("\n") : ""
      ].filter(Boolean).join("\n");
      return componentInfo;
    }).join("\n\n")}`;
  }
};

// src/index.ts
var isInitialized2 = false;
var init = async (config) => {
  if (isInitialized2) {
    console.warn("[ReactLM] Already initialized, ignoring duplicate init call");
    return;
  }
  try {
    isInitialized2 = true;
    const normalizedConfig = typeof config === "string" ? { providers: { openrouter: config } } : config;
    if (normalizedConfig.debug) {
      window.ReactLM.debug = true;
    }
    console.log("[ReactLM] Initializing ReactLM...");
    await initializeReactInstrumentation();
    const container = document.createElement("div");
    container.id = "reactlm-root";
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 0;
      height: 0;
      pointer-events: none;
      z-index: 2147483645;
    `;
    document.body.appendChild(container);
    const shadow3 = container.attachShadow({ mode: "open" });
    const root = document.createElement("div");
    root.id = "reactlm-shadow-root";
    root.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      pointer-events: none;
    `;
    shadow3.appendChild(root);
    const hub = new LLMHub();
    if (normalizedConfig.mode === "demo") {
      await hub.initializeDemoMode();
    } else if (normalizedConfig.apiEndpoint) {
      await hub.initializeApiMode(normalizedConfig.apiEndpoint, normalizedConfig.modelsEndpoint);
    } else if (normalizedConfig.providers?.openrouter || normalizedConfig.apiKey) {
      await hub.initializeProvider(
        "openrouter",
        normalizedConfig.providers?.openrouter || normalizedConfig.apiKey,
        {
          siteUrl: normalizedConfig.siteUrl,
          siteName: normalizedConfig.siteName
        }
      );
    } else {
      await hub.initializeDemoMode();
    }
    const monitorManager = new MonitorManager();
    if (normalizedConfig.mode === "development") {
      console.log("[ReactLM] Starting monitoring in development mode");
      monitorManager.start();
    }
    if (!window.ReactLM) {
      window.ReactLM = { init };
    }
    window.ReactLM.hub = hub;
    window.ReactLM.monitorManager = monitorManager;
    render2(h3(Toolbar, {
      hub,
      monitorManager,
      shadowRoot: root
      // Pass shadow root so toolbar can render overlays inside it
    }), root);
    console.log("[ReactLM] Initialized successfully in", normalizedConfig.apiEndpoint ? "API mode" : "direct mode");
    if (normalizedConfig.debug) {
      debugCheckBlockingElements();
    }
  } catch (error) {
    isInitialized2 = false;
    console.error("[ReactLM] Failed to initialize:", error);
    throw error;
  }
};
async function initializeReactInstrumentation() {
  try {
    console.log("[ReactLM] Starting React detection...");
    const reactResult = await waitForReact(5e3);
    if (!reactResult.isReact) {
      console.warn("[ReactLM] React not detected, component inspection will be limited");
      return;
    }
    console.log("[ReactLM] React detected:", reactResult.version);
    const inspector = new ComponentInspector();
    if (!window.ReactLM) {
      window.ReactLM = { init };
    }
    window.ReactLM.inspector = inspector;
    await new Promise((resolve) => setTimeout(resolve, 100));
    console.log("[ReactLM] Component instrumentation ready");
  } catch (error) {
    console.warn("[ReactLM] React detection failed:", error instanceof Error ? error.message : String(error));
    console.warn("[ReactLM] Component inspection will be limited");
  }
}
function debugCheckBlockingElements() {
  console.log("[ReactLM Debug] Checking for blocking elements...");
  const points = [
    { x: 10, y: 10, name: "top-left" },
    { x: window.innerWidth - 10, y: 10, name: "top-right" },
    { x: 10, y: window.innerHeight - 10, name: "bottom-left" },
    { x: window.innerWidth - 10, y: window.innerHeight - 10, name: "bottom-right" },
    { x: window.innerWidth / 2, y: window.innerHeight / 2, name: "center" }
  ];
  points.forEach((point) => {
    const element = document.elementFromPoint(point.x, point.y);
    if (element) {
      const styles2 = window.getComputedStyle(element);
      console.log(`[ReactLM Debug] Element at ${point.name}:`, {
        element,
        id: element.id,
        className: element.className,
        pointerEvents: styles2.pointerEvents,
        position: styles2.position,
        zIndex: styles2.zIndex
      });
      if (element.id && element.id.includes("reactlm")) {
        console.warn(`[ReactLM Debug] Found ReactLM element potentially blocking at ${point.name}!`);
      }
    }
  });
}
var index_default = {
  init
};
export {
  index_default as default,
  init
};
//# sourceMappingURL=index.js.map