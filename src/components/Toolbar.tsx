/** @jsx h */
import { h, Fragment } from 'preact';
import { useSignal, effect } from '@preact/signals';
import { sendMessageToGemini, type StructuredResponse } from '../gemini/gemini';
import { marked } from 'marked';
import { initDB, createChatSession, createMessage, getChatSessions, getMessagesForChatSession, deleteChatSession } from '../db/database';

const styles = `
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

interface Message {
  role: 'user' | 'assistant';
  content: string;
  structuredResponse?: StructuredResponse;
}

interface ProjectInfo {
  name: string;
  type: string;
  mainTechnologies: string[];
  description: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  projectInfo?: ProjectInfo;
}

type ContentTab = 'chat' | 'files' | 'docs' | 'suggestions';

function getInitialResponse(): StructuredResponse {
  return {
    projectInfo: {
      name: 'Example Project',
      type: 'Library',
      mainTechnologies: ['React', 'TypeScript', 'SQLite'],
      description: 'A floating chat interface powered by Gemini'
    },
    markdown: 'Welcome to the example project!',
    chatTitle: 'New Chat',
    relevantFiles: [],
    documentationLinks: [],
    suggestedQueries: []
  };
}

export function Toolbar() {
  const isInitializing = useSignal(true);
  const isVisible = useSignal(false);
  const isMinimized = useSignal(false);
  const chatSessions = useSignal<ChatSession[]>([]);
  const activeChatId = useSignal<string | null>(null);
  const inputValue = useSignal('');
  const editingTitle = useSignal('');
  const activeTab = useSignal<ContentTab>('chat');
  const projectInfo = useSignal<ProjectInfo | null>(null);
  const hasInitialChat = useSignal(false);
  const isLoadingMessages = useSignal(false);

  // Initialize database and load chat sessions
  effect(() => {
    if (hasInitialChat.value) return;
    
    const initialize = async () => {
      try {
        // Initialize SQLite database
        await initDB();
        
        // Load existing chat sessions
        const sessions = await getChatSessions();
        
        if (sessions.length > 0) {
          // Load messages for the most recent session
          const messages = await getMessagesForChatSession(sessions[0].id);
          const firstSession: ChatSession = {
            id: sessions[0].id,
            title: sessions[0].title,
            messages: messages.map(m => ({
              role: m.role === 'user' || m.role === 'assistant' ? m.role : 'assistant',
              content: m.content,
              structuredResponse: m.structuredResponse ? JSON.parse(m.structuredResponse) as StructuredResponse : undefined
            }))
          };
          
          chatSessions.value = [firstSession];
          activeChatId.value = firstSession.id;
          hasInitialChat.value = true;
          
          // Extract project info from the first message if it exists
          const firstMessage = messages.find(m => m.role === 'assistant' && m.structuredResponse);
          if (firstMessage?.structuredResponse) {
            try {
              const structuredResponse = JSON.parse(firstMessage.structuredResponse) as StructuredResponse;
              if (structuredResponse.projectInfo) {
                projectInfo.value = structuredResponse.projectInfo;
              }
            } catch (e) {
              console.warn('Failed to parse structured response:', e);
            }
          }
        } else {
          // No existing chats, get initial response from Gemini
          const initialResponse = getInitialResponse();
          if (initialResponse.projectInfo) {
            projectInfo.value = initialResponse.projectInfo;
          }
          
          // Create initial chat in database
          const newId = String(Date.now());
          await createChatSession(newId, 'New Chat');
          
          // Create initial message
          await createMessage(
            String(Date.now()),
            newId,
            'assistant',
            initialResponse.markdown,
            JSON.stringify(initialResponse)
          );
          
          // Update state
          const chat: ChatSession = {
            id: newId,
            title: 'New Chat',
            messages: [{
              role: 'assistant',
              content: initialResponse.markdown,
              structuredResponse: initialResponse
            }],
            projectInfo: initialResponse.projectInfo
          };
          
          chatSessions.value = [chat];
          activeChatId.value = chat.id;
          hasInitialChat.value = true;
        }
      } finally {
        isInitializing.value = false;
        setTimeout(() => isVisible.value = true, 50);
      }
    };

    initialize();
  });

  // Load messages when active chat changes
  effect(() => {
    if (!activeChatId.value || isLoadingMessages.value) return;
    
    const currentChat = chatSessions.value.find(c => c.id === activeChatId.value);
    // Skip if we already have messages for this chat
    if (currentChat?.messages && currentChat.messages.length > 0) return;
    
    const loadMessages = async () => {
      isLoadingMessages.value = true;
      try {
        const messages = await getMessagesForChatSession(activeChatId.value!);
        chatSessions.value = chatSessions.value.map(session => 
          session.id === activeChatId.value ? {
            ...session,
            messages: messages.map(m => ({
              role: m.role,
              content: m.content,
              structuredResponse: m.structuredResponse ? JSON.parse(m.structuredResponse) : undefined,
              relevantFiles: m.relevantFiles || [],
              documentationLinks: m.documentationLinks || [],
              suggestedQueries: m.suggestedQueries || []
            }))
          } : session
        );
      } catch (error) {
        console.error('Failed to load messages:', error);
      } finally {
        isLoadingMessages.value = false;
      }
    };

    loadMessages();
  });

  const createNewChat = async () => {
    if (!projectInfo.value || isInitializing.value) return;

    const newId = String(Date.now());
    
    try {
      // Create chat session in database
      await createChatSession(newId, 'New Chat');
      
      const response = await sendMessageToGemini('Analyze this codebase and provide a structured response.');
      
      // Create initial message in database
      await createMessage(
        String(Date.now()),
        newId,
        'assistant',
        response.markdown,
        JSON.stringify(response)
      );
      
      const newChat: ChatSession = {
        id: newId,
        title: response.chatTitle || 'New Chat',
        messages: [{
          role: 'assistant',
          content: response.markdown,
          structuredResponse: response
        }],
        projectInfo: response.projectInfo
      };
      
      chatSessions.value = [...chatSessions.value, newChat];
      activeChatId.value = newId;
    } catch (error) {
      console.error('Failed to create new chat:', error);
    }
  };

  const formatChatTitle = (title: string) => {
    if (!title) return projectInfo.value?.name || 'untitled project';
    if (!projectInfo.value?.name || !projectInfo.value?.description) return title;
    
    const cleanTitle = title.toLowerCase().startsWith(projectInfo.value.name.toLowerCase()) 
      ? title.slice(projectInfo.value.name.length).replace(/^[-:\s]+/, '')
      : title;
      
    return `${projectInfo.value.name} - ${projectInfo.value.description}`.toLowerCase();
  };

  const activeChat = () => activeChatId.value ? 
    chatSessions.value.find(c => c.id === activeChatId.value) : null;

  const deleteChat = async (chatId: string) => {
    try {
      await deleteChatSession(chatId);
      chatSessions.value = chatSessions.value.filter(c => c.id !== chatId);
      if (activeChatId.value === chatId) {
        activeChatId.value = chatSessions.value[0]?.id || null;
      }
    } catch (error) {
      console.error('Failed to delete chat:', error);
    }
  };

  const startEditingTitle = (chatId: string) => {
    const chat = chatSessions.value.find(c => c.id === chatId);
    if (chat) {
      editingTitle.value = chat.title;
    }
  };

  const saveEditingTitle = () => {
    if (editingTitle.value.trim()) {
      chatSessions.value = chatSessions.value.map(chat => 
        chat.id === activeChatId.value ? 
          { ...chat, title: editingTitle.value.trim() } : 
          chat
      );
    }
    editingTitle.value = '';
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!inputValue.value.trim() || isInitializing.value) return;

    const userMessage = inputValue.value;
    inputValue.value = '';
    
    if (!activeChatId.value) {
      await createNewChat();
      return;
    }
    
    const chat = activeChat()!;
    const isNewChat = chat.messages.length === 0;
    const userMessageId = String(Date.now());
    
    try {
      // Save user message to database
      await createMessage(
        userMessageId,
        chat.id,
        'user',
        userMessage
      );
      
      // Update UI immediately
      const updatedMessages = [...chat.messages, { role: 'user', content: userMessage }];
      chatSessions.value = chatSessions.value.map(c => 
        c.id === activeChatId.value ? { ...c, messages: updatedMessages } : c
      );
      
      isInitializing.value = true;

      // Get response from Gemini
      const response = await sendMessageToGemini(userMessage, isNewChat);
      
      // Save assistant message to database
      const assistantMessageId = String(Date.now() + 1);
      await createMessage(
        assistantMessageId,
        chat.id,
        'assistant',
        response.markdown,
        JSON.stringify(response)
      );
      
      // Update UI
      const newMessages = [...updatedMessages, { 
        role: 'assistant', 
        content: response.markdown,
        structuredResponse: response
      }];
      
      chatSessions.value = chatSessions.value.map(c => 
        c.id === activeChatId.value ? {
          ...c,
          title: isNewChat && response.chatTitle ? response.chatTitle : c.title,
          messages: newMessages,
          projectInfo: isNewChat ? response.projectInfo : c.projectInfo
        } : c
      );
    } catch (error) {
      console.error('Failed to get response:', error);
      
      // Save error message to database
      const errorMessageId = String(Date.now() + 1);
      await createMessage(
        errorMessageId,
        chat.id,
        'assistant',
        'Sorry, I encountered an error. Please try again.'
      );
      
      chatSessions.value = chatSessions.value.map(c => 
        c.id === activeChatId.value ? {
          ...c,
          messages: [...chat.messages, { 
            role: 'assistant', 
            content: 'Sorry, I encountered an error. Please try again.'
          }]
        } : c
      );
    } finally {
      isInitializing.value = false;
    }
  };

  const renderMessage = (msg: Message) => {
    if (msg.role === 'user') {
      return <div className="message user-message">{msg.content}</div>;
    }

    const html = marked(msg.content);
    if (typeof html !== 'string') return null;

    return (
      <div className="message assistant-message">
        <div dangerouslySetInnerHTML={{ __html: html }} />
        
        {msg.structuredResponse?.relevantFiles && msg.structuredResponse.relevantFiles.length > 0 && (
          <div className="relevant-files">
            {msg.structuredResponse.relevantFiles.map((file, i) => (
              <div key={i} className="relevant-file" title={file.reason}>
                <span className="file-path">{file.path}</span>
              </div>
            ))}
          </div>
        )}

        {msg.structuredResponse?.documentationLinks && msg.structuredResponse.documentationLinks.length > 0 && (
          <div className="docs-section">
            {msg.structuredResponse.documentationLinks.map((link, i) => (
              <a 
                key={i} 
                href={link.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="docs-link"
              >
                <div className="docs-link-title">{link.title}</div>
                <div className="docs-link-description">{link.description}</div>
              </a>
            ))}
          </div>
        )}

        {msg.structuredResponse?.suggestedQueries && msg.structuredResponse.suggestedQueries.length > 0 && (
          <div className="suggested-queries">
            <div className="suggested-queries-title">suggested questions</div>
            <div className="suggested-queries-list">
              {msg.structuredResponse.suggestedQueries.map((query, i) => (
                <div 
                  key={i} 
                  className="suggested-query"
                  onClick={() => {
                    inputValue.value = query;
                    const input = document.querySelector('.input') as HTMLInputElement;
                    if (input) {
                      input.focus();
                    }
                  }}
                >
                  {query.toLowerCase()}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Fragment>
      <style>{styles}</style>
      <div 
        className={`toolbar ${isMinimized.value ? 'minimized' : ''} ${isVisible.value ? '' : 'opacity-0'}`}
      >
        <div className="header">
          <div className="header-left">
            <div className="chat-title">
              {isInitializing.value ? (
                <span className="loading-title">
                  loading
                  <div className="loading-dots">
                    <div className="loading-dot"></div>
                    <div className="loading-dot"></div>
                    <div className="loading-dot"></div>
                  </div>
                </span>
              ) : (
                formatChatTitle(activeChat()?.title || '')
              )}
            </div>
          </div>
          <div className="controls">
            <button 
              className="control-button" 
              onClick={createNewChat}
              disabled={isInitializing.value}
            >
              +
            </button>
            <button 
              className="control-button" 
              onClick={() => isMinimized.value = !isMinimized.value}
            >
              {isMinimized.value ? '+' : '-'}
            </button>
          </div>
        </div>

        {!isMinimized.value && (
          <div className="empty-state">
            <div className="empty-state-title">welcome to react llm</div>
            <div className="empty-state-description">
              start a new chat to get ai-powered help with your react codebase
              {isInitializing.value && (
                <div className="loading-dots">
                  <div className="loading-dot"></div>
                  <div className="loading-dot"></div>
                  <div className="loading-dot"></div>
                </div>
              )}
            </div>
            <button 
              className="new-chat-button" 
              onClick={createNewChat}
              disabled={isInitializing.value}
            >
              <span>+</span> new chat
            </button>
          </div>
        )}
      </div>
    </Fragment>
  );
}
