/** @jsx h */
import { h, Fragment } from 'preact';
import { useSignal, effect } from '@preact/signals';
import { sendMessageToGemini, type StructuredResponse } from '../gemini/gemini';
import { marked } from 'marked';
import { initDB, createChatSession, createMessage, getChatSessions, getMessagesForChatSession, deleteChatSession } from '../db/database';
import { styles } from './Toolbar.styles';

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
