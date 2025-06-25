/**
 * World-Class LLM Developer Tools Interface
 * Professional-grade styling inspired by VS Code, Chrome DevTools, and modern IDEs
 */

import { createThemeCSS, darkTheme } from '../styles/theme';
import { 
  animations, 
  chat, 
  button, 
  flex, 
  text, 
  fontFamily, 
  padding, 
  margin, 
  rounded, 
  shadow, 
  transition, 
  bg, 
  textColor, 
  border,
  overflow,
  scrollbar,
  loading,
  focus,
  responsive,
  devtools
} from '../styles/utilities';
import { easings, spacing } from '../styles/tokens';

export const styles = `
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
  ${devtools.panel}
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
  filter: blur(8px);
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
  ${devtools.interactive}
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
    filter: brightness(1.1);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
    
    &::after {
      transform: translate(-50%, -50%) scale(2);
      opacity: 1;
    }
  }
  
  &:active:not(:disabled) {
    filter: brightness(0.95);
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
    transition: opacity 0.2s ${easings.smooth};
  }
  
  &:hover svg {
    opacity: 0.8;
  }
  
  &:active svg {
    opacity: 0.6;
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
  animation: dropdownEntrance 0.3s ${easings.smooth} forwards;
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
  transition: filter 0.2s ${easings.smooth}, box-shadow 0.2s ${easings.smooth};
  
  &:hover {
    filter: brightness(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
}

.user-message {
  ${chat.userMessage}
  ${bg.chat.user}
  ${textColor.chat.user}
  align-self: flex-end;
  max-width: 85%;
  ${responsive.mobile('max-width: 95%;')}
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

/* Modern LLM Chat Input Area - ChatGPT/Claude inspired */
.input-area {
  border-top: 1px solid var(--theme-border);
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  flex-shrink: 0;
  padding: ${spacing.md} ${spacing.md} ${spacing.sm};
  position: relative;
  
  /* Subtle gradient border */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 10%,
      var(--theme-border) 50%,
      transparent 90%
    );
  }
}

.input-form {
  position: relative;
  width: 100%;
}

.input-area .input {
  width: 100%;
  background: var(--theme-chat-input-bg);
  border: 1px solid var(--theme-chat-input-border);
  ${rounded.xl}
  padding: ${spacing.sm} ${spacing.xl} ${spacing.sm} ${spacing.md};
  padding-right: 120px; /* Space for buttons */
  ${textColor.primary}
  ${text.sm}
  ${fontFamily.mono}
  min-height: 44px;
  max-height: 140px;
  resize: none;
  transition: all 0.2s ${easings.smooth};
  backdrop-filter: blur(10px);
  line-height: 1.5;
  
  &:hover:not(:disabled) {
    background: var(--theme-hover);
    border-color: var(--theme-border);
    filter: brightness(1.05);
  }
  
  &:focus {
    outline: none;
    background: var(--theme-hover);
    border-color: var(--theme-chat-input-focus);
    box-shadow: 0 0 0 3px rgba(69, 137, 255, 0.1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &::placeholder {
    color: var(--theme-muted);
    transition: opacity 0.3s ${easings.smooth};
  }
  
  &:focus::placeholder {
    opacity: 0.3;
  }
  
  ${responsive.mobile(`
    font-size: 16px; /* Prevents zoom on iOS */
    padding-right: 100px;
  `)}
}

.input-controls {
  position: absolute;
  right: ${spacing.sm};
  bottom: ${spacing.sm};
  ${flex.centerY}
  gap: ${spacing.xs};
}

.control-icon-button {
  ${button.base}
  ${button.ghost}
  padding: ${spacing.xs};
  ${rounded.md}
  width: 32px;
  height: 32px;
  opacity: 0.7;
  ${transition.all}
  
  &:hover {
    opacity: 1;
    background: var(--theme-hover);
  }
  
  &.active {
    background: var(--theme-accent);
    color: var(--theme-background);
    opacity: 1;
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
}

.send-button {
  ${button.base}
  ${padding.xs}
  ${rounded.md}
  min-width: 32px;
  height: 32px;
  position: relative;
  overflow: hidden;
  ${transition.all}
  background: var(--theme-accent);
  color: var(--theme-background);
  border: none;
  
  svg {
    width: 16px;
    height: 16px;
  }
  
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
    filter: brightness(1.2);
    box-shadow: 0 2px 8px rgba(69, 137, 255, 0.3);
  }
  
  &:active:not(:disabled) {
    filter: brightness(0.9);
  }
  
  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    filter: none;
  }
  
  /* Sending state animation */
  &.streaming {
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

/* Attachment button */
.attachment-button {
  ${button.base}
  ${button.ghost}
  padding: ${spacing.xs};
  ${rounded.md}
  width: 32px;
  height: 32px;
  opacity: 0.7;
  ${transition.all}
  
  &:hover {
    opacity: 1;
    background: var(--theme-hover);
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
}

/* Character counter */
.char-counter {
  position: absolute;
  bottom: ${spacing.xs};
  right: 140px;
  ${text.xs}
  ${textColor.muted}
  opacity: 0;
  ${transition.opacity}
  
  .input:focus ~ .input-controls & {
    opacity: 1;
  }
  
  &.over-limit {
    ${textColor.status.error}
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
  ${transition.opacity}
  
  &.expanded {
    /* Use a different icon or CSS trick instead of rotation */
    opacity: 0.8;
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
  filter: brightness(1.05);
  
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

/* Full Page Views - Solid panels, not overlays */
.view-container {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.95); /* Solid background instead of semi-transparent */
  backdrop-filter: blur(20px);
  z-index: var(--z-index-modal);
  ${flex.col}
  ${overflow.hidden}
  opacity: 0;
  animation: viewSlideIn 0.3s ${easings.smooth} forwards;
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
  filter: brightness(1.1);
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
    filter: brightness(1.1);
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
    filter: brightness(1.1);
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