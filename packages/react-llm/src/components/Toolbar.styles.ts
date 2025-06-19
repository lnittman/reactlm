export const styles = `
@font-face {
  font-family: 'IosevkaTerm';
  src: url('https://intdev-global.s3.us-west-2.amazonaws.com/public/internet-dev/6397be61-3ea4-459d-8a3e-fd95168cb214.woff2') format('woff2');
  font-display: swap;
}

* {
  font-family: 'IosevkaTerm', monospace;
}

.toolbar {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 400px;
  height: 500px;
  background: rgba(0, 0, 0, 0.8);
  border-radius: 12px;
  font-family: 'IosevkaTerm', monospace;
  color: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding-bottom: 0;
  transition: opacity 0.3s ease-in-out;
}

.toolbar.minimized {
  height: 60px;
  overflow: hidden;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 14px;
  text-transform: lowercase;
  height: 44px;
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  flex: 1;
}

.chat-title {
  opacity: 0.8;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 4px;
  transition: background 0.2s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  min-width: 0;
  flex: 1;
}

.controls {
  display: flex;
  gap: 8px;
}

.control-button {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.9);
  cursor: pointer;
  padding: 8px;
  font-size: 14px;
  border-radius: 8px;
  min-width: 36px;
  height: 36px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.control-button:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.control-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.chats-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.9);
  border-radius: 8px;
  margin: 4px;
  max-height: 300px;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.chat-item {
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: background 0.2s ease;
}

.chat-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.chat-item-title {
  flex: 1;
  margin-right: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-item-actions {
  opacity: 0;
  transition: opacity 0.2s ease;
  display: flex;
  gap: 8px;
}

.chat-item:hover .chat-item-actions {
  opacity: 1;
}

.chat-item-button {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  padding: 2px 6px;
  font-size: 12px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.chat-item-button:hover {
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.1);
}

.docs-section {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.docs-link {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
  text-decoration: none;
  color: inherit;
}

.docs-link:hover {
  background: rgba(255, 255, 255, 0.1);
}

.docs-link-title {
  font-weight: bold;
  color: rgba(255, 255, 255, 0.9);
}

.docs-link-description {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
}

.suggested-queries {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.suggested-queries-title {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  margin-bottom: 8px;
}

.suggested-queries-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.suggested-query {
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.suggested-query:hover {
  background: rgba(255, 255, 255, 0.1);
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  opacity: 0;
  animation: fadeIn 0.3s ease forwards;
}

.user-message {
  color: rgba(255, 255, 255, 0.9);
}

.assistant-message {
  color: rgba(255, 255, 255, 0.7);
}

.assistant-message pre {
  background: rgba(255, 255, 255, 0.1);
  padding: 8px;
  border-radius: 4px;
  overflow-x: auto;
}

.assistant-message code {
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 4px;
  border-radius: 3px;
}

.assistant-message ul, .assistant-message ol {
  margin: 8px 0;
  padding-left: 20px;
}

.assistant-message p {
  margin: 8px 0;
}

.relevant-files {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.relevant-file {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background 0.2s ease;
  max-width: 100%;
  overflow: hidden;
}

.relevant-file:hover {
  background: rgba(255, 255, 255, 0.1);
}

.file-path {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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

.input {
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 8px;
  padding: 12px 16px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  line-height: 20px;
  height: 44px;
  transition: all 0.2s ease;
}

.input:focus {
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.15);
}

.input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.send-button {
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 0 20px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  height: 44px;
  min-width: 80px;
}

.send-button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.send-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
  animation: loadingDot 1.4s infinite;
  opacity: 0.6;
}

.loading-dot:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes loadingDot {
  0%, 100% { opacity: 0.2; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1); }
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.minimized .messages,
.minimized .input-area {
  display: none;
}

.minimized .latest-message {
  display: block;
  padding: 0 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 40px;
  color: rgba(255, 255, 255, 0.7);
}
`; 