/** @jsx h */
import { h, Fragment, render } from 'preact';
import { useSignal, effect, batch } from '@preact/signals';
import { useEffect } from 'preact/hooks';
import { marked } from 'marked';
// Using simple storage to avoid SQLite WASM loading issues
import { initDB, createChatSession, createMessage, getChatSessions, getMessagesForChatSession, deleteChatSession } from '../db/simple-storage';
import { styles } from './Toolbar.styles';
import { LLMHub } from '../llm/providers';
import type { Message, Model } from '../llm/openrouter';
import { ComponentInspector } from './ComponentInspector';
import { ContextSelector } from './ContextSelector';
import type { ComponentInfo } from '../instrumentation/bippy-adapter';
import { MonitorManager } from '../monitoring/monitor-manager';
import type { ContextOption } from '../types/monitoring';

// Legacy support for Gemini response format
interface StructuredResponse {
  markdown: string;
  chatTitle?: string;
  relevantFiles: RelevantFile[];
  documentationLinks: DocumentationLink[];
  suggestedQueries?: string[];
  projectInfo?: {
    name: string;
    type: string;
    mainTechnologies: string[];
    description: string;
  };
}

interface RelevantFile {
  path: string;
  reason: string;
  type: 'core' | 'config' | 'component' | 'util' | 'test' | 'other';
  snippet?: string;
}

interface DocumentationLink {
  url: string;
  title: string;
  description: string;
}

interface ChatMessage {
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
  messages: ChatMessage[];
  projectInfo?: ProjectInfo;
}

type ContentTab = 'chat' | 'files' | 'docs' | 'suggestions';
type ViewMode = 'chat' | 'models' | 'settings' | 'components';
type SelectionMode = 'none' | 'selecting' | 'selected';

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

interface Props {
  hub: LLMHub;
  monitorManager?: MonitorManager;
  shadowRoot?: ShadowRoot;
}

export function Toolbar({ hub, monitorManager, shadowRoot }: Props) {
  console.log('[Toolbar] Initializing with hub:', hub, 'isInitialized:', hub?.isInitialized());
  
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
  const initializationStarted = useSignal(false);
  const isLoadingMessages = useSignal(false);
  const isStreamingResponse = useSignal(false);
  const streamingContent = useSignal('');
  const showModelSelector = useSignal(false);
  const currentView = useSignal<ViewMode>('chat');
  const apiKey = useSignal('');
  const selectionMode = useSignal<SelectionMode>('none');
  const selectedComponent = useSignal<any>(null);
  const inspectorCleanup = useSignal<(() => void) | null>(null);

  // Context selector state
  const showContextSelector = useSignal(false);
  const contextSelectorPosition = useSignal({ x: 0, y: 0 });
  const contextSearchTerm = useSignal('');
  const inputRef = useSignal<HTMLInputElement | null>(null);

  // Check for dev mode and OpenRouter key
  useEffect(() => {
    const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isDev) {
      // Check for OpenRouter API key in localStorage or env
      const storedKey = localStorage.getItem('react-llm-openrouter-key');
      const envKey = (window as any).__REACT_LLM_CONFIG__?.openrouterKey;
      
      if (storedKey || envKey) {
        apiKey.value = storedKey || envKey;
        // Initialize OpenRouter instead of demo mode
        hub.initializeProvider('openrouter', apiKey.value).then(() => {
          console.log('[ReactLLM] OpenRouter initialized with', hub.getAvailableModels().length, 'models');
        });
      }
    }
  }, [hub]);

  // Initialize database and load chat sessions - run only once
  useEffect(() => {
    if (initializationStarted.value) return;
    
    initializationStarted.value = true;
    
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
          // Check if hub is initialized before proceeding
          if (!hub.isInitialized()) {
            console.log('[Toolbar] Hub not initialized yet, skipping initial chat creation');
            return;
          }
          // No existing chats, create initial welcome message
          const initialResponse = getInitialResponse();
          if (initialResponse.projectInfo) {
            projectInfo.value = initialResponse.projectInfo;
          }
          
          // Create initial chat in database
          const newId = String(Date.now());
          await createChatSession(newId, 'Welcome');
          
          // Create initial message
          const welcomeMessage = `Welcome to ReactLM! I'm ready to help you with your React codebase.

I'm currently using **${hub.getActiveModel()}** - you can change models anytime using the 🤖 button.

What would you like to explore?`;
          
          await createMessage(
            String(Date.now()),
            newId,
            'assistant',
            welcomeMessage,
            JSON.stringify({
              ...initialResponse,
              markdown: welcomeMessage
            })
          );
          
          // Update state
          const chat: ChatSession = {
            id: newId,
            title: 'Welcome',
            messages: [{
              role: 'assistant',
              content: welcomeMessage,
              structuredResponse: {
                ...initialResponse,
                markdown: welcomeMessage
              }
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
  }, []);

  // Load messages when active chat changes
  useEffect(() => {
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
  }, [activeChatId.value]);

  const createNewChat = async () => {
    console.log('[createNewChat] Starting...', {
      isInitializing: isInitializing.value,
      hubInitialized: hub?.isInitialized(),
      activeModel: hub?.getActiveModel()
    });
    
    if (isInitializing.value) return;

    const newId = String(Date.now());
    
    try {
      // Create chat session in database
      await createChatSession(newId, 'New Chat');
      
      // Get initial analysis from LLM
      let response: StructuredResponse;
      try {
        const llmContent = await hub.completeChat([
          { role: 'user', content: 'Please provide a helpful introduction and overview of how I can assist with this React codebase.' }
        ]);
        
        response = {
          markdown: llmContent,
          chatTitle: extractTitleFromResponse(llmContent),
          relevantFiles: [],
          documentationLinks: [],
          suggestedQueries: extractSuggestionsFromResponse(llmContent)
        };
      } catch (error) {
        console.error('Failed to get LLM response:', error);
        response = {
          markdown: 'Hello! I\'m ready to help you with your React codebase.',
          chatTitle: 'New Chat',
          relevantFiles: [],
          documentationLinks: [],
          suggestedQueries: ['How does this work?', 'Can you explain this pattern?']
        };
      }
      
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

  // Handle @ mention detection
  const handleInputChange = (e: Event) => {
    const input = e.target as HTMLInputElement;
    const value = input.value;
    inputValue.value = value;
    
    // Check for @ mentions
    const cursorPosition = input.selectionStart || 0;
    const textBeforeCursor = value.substring(0, cursorPosition);
    const atMatch = textBeforeCursor.match(/@(\w*)$/);
    
    if (atMatch) {
      const searchTerm = atMatch[1];
      contextSearchTerm.value = searchTerm;
      
      // Get input position for context selector
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

  // Handle context selection from @ mentions
  const handleContextSelect = (context: ContextOption | null) => {
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
    
    // Replace the @ mention with the selected context
    const atMatch = textBeforeCursor.match(/@\w*$/);
    if (atMatch) {
      const beforeAtSign = textBeforeCursor.substring(0, atMatch.index);
      
      // Get context data from monitor manager
      let contextData = '';
      if (monitorManager) {
        contextData = monitorManager.getContext(context.type, context.filter);
      }
      
      // Insert context label and add context data as a comment for the AI
      const newValue = `${beforeAtSign}${context.label}${textAfterCursor}\n\n<!-- Context: ${contextData} -->`;
      inputValue.value = newValue;
      
      // Position cursor after the context label
      setTimeout(() => {
        const newPosition = beforeAtSign.length + context.label.length;
        input.setSelectionRange(newPosition, newPosition);
      }, 0);
    }
    
    showContextSelector.value = false;
  };

  // Handle input keydown for context selector navigation
  const handleInputKeyDown = (e: KeyboardEvent) => {
    if (showContextSelector.value) {
      // Let ContextSelector handle arrow keys and enter
      if (['ArrowDown', 'ArrowUp', 'Enter', 'Escape'].includes(e.key)) {
        return; // Let ContextSelector handle these
      }
    }
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

      // Get response from LLM Hub with streaming
      isStreamingResponse.value = true;
      streamingContent.value = '';
      
      const llmMessages: Message[] = [
        ...chat.messages.map(m => ({ role: m.role, content: m.content })),
        { role: 'user', content: userMessage }
      ];
      
      let fullResponse = '';
      
      try {
        for await (const chunk of hub.chat(llmMessages)) {
          fullResponse += chunk;
          streamingContent.value = fullResponse;
          // Don't update messages array during streaming - we show streamingContent separately
        }
        
        // Create structured response from the full response
        const response: StructuredResponse = {
          markdown: fullResponse,
          chatTitle: isNewChat ? extractTitleFromResponse(fullResponse) : undefined,
          relevantFiles: [],
          documentationLinks: [],
          suggestedQueries: extractSuggestionsFromResponse(fullResponse)
        };
      
        // Save assistant message to database
        const assistantMessageId = String(Date.now() + 1);
        await createMessage(
          assistantMessageId,
          chat.id,
          'assistant',
          fullResponse,
          JSON.stringify(response)
        );
        
        // Update UI with final response
        const newMessages = [...updatedMessages, { 
          role: 'assistant' as const, 
          content: fullResponse,
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
      } catch (streamError) {
        console.error('Streaming error:', streamError);
        
        // Fallback to simple response if streaming fails
        const errorResponse = 'I apologize, but I encountered an issue processing your request. Please try again.';
        const assistantMessageId = String(Date.now() + 1);
        await createMessage(
          assistantMessageId,
          chat.id,
          'assistant',
          errorResponse
        );
        
        chatSessions.value = chatSessions.value.map(c => 
          c.id === activeChatId.value ? {
            ...c,
            messages: [...updatedMessages, { 
              role: 'assistant' as const, 
              content: errorResponse
            }]
          } : c
        );
      }
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
      isStreamingResponse.value = false;
      streamingContent.value = '';
    }
  };

  const extractTitleFromResponse = (response: string | undefined): string => {
    // Simple title extraction from response content
    if (!response) return 'New Chat';
    const lines = response.split('\n');
    const firstLine = lines[0]?.replace(/^#+\s*/, '').trim();
    return firstLine && firstLine.length < 100 ? firstLine : 'New Chat';
  };
  
  const extractSuggestionsFromResponse = (response: string | undefined): string[] => {
    // Simple suggestion extraction - look for questions or bullet points
    if (!response) return [];
    const suggestions: string[] = [];
    const lines = response.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('- ') && trimmed.endsWith('?')) {
        suggestions.push(trimmed.slice(2));
      } else if (trimmed.match(/^\d+\./)) {
        const question = trimmed.replace(/^\d+\.\s*/, '');
        if (question.endsWith('?')) {
          suggestions.push(question);
        }
      }
    }
    
    return suggestions.slice(0, 3); // Limit to 3 suggestions
  };
  
  const handleModelChange = (provider: string, model: string) => {
    hub.setActiveModel(provider, model);
    showModelSelector.value = false;
  };
  
  const selectedComponents = useSignal<any[]>([]);
  
  const handleComponentSelect = (componentInfo: ComponentInfo | null) => {
    // Handle escape/cancel
    if (!componentInfo) {
      selectionMode.value = 'none';
      console.log('[Toolbar] Component selection cancelled');
      return;
    }
    
    selectedComponent.value = componentInfo;
    selectionMode.value = 'selected';
    
    // Add to selected components list
    if (componentInfo) {
      const existingIndex = selectedComponents.value.findIndex(
        c => c.id === componentInfo.id
      );
      
      if (existingIndex === -1) {
        selectedComponents.value = [...selectedComponents.value, {
          ...componentInfo,
          timestamp: new Date().toISOString()
        }];
      }
      
      // Sync with monitor manager
      if (monitorManager) {
        monitorManager.setSelectedComponents(selectedComponents.value);
      }
      
      // Switch to components view to show selection
      currentView.value = 'components';
    }
  };

  const renderComponentsView = () => (
    <div className="view-container">
      <div className="view-header">
        <h2 className="view-title">Selected Components</h2>
        <button className="view-close" onClick={() => currentView.value = 'chat'}>×</button>
      </div>
      <div className="view-content">
        {selectedComponents.value.length === 0 ? (
          <div className="empty-components">
            <p>No components selected yet</p>
            <button 
              className="select-component-button"
              onClick={() => {
                currentView.value = 'chat';
                selectionMode.value = 'selecting';
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 2h4v2H4v2H2V2zm10 0h4v4h-2V4h-2V2zM2 10h2v2h2v2H2v-4zm12 2h2v-2h-2v2zm0 0v2h-2v2h4v-4h-2z"/>
                <circle cx="8" cy="8" r="2" opacity="0.5"/>
              </svg>
              Select a Component
            </button>
          </div>
        ) : (
          <div className="components-list">
            {selectedComponents.value.map((comp) => (
              <div key={comp.id} className="component-item">
                <div className="component-header">
                  <h3 className="component-name">{comp.name}</h3>
                  <button 
                    className="remove-button"
                    onClick={() => {
                      selectedComponents.value = selectedComponents.value.filter(c => c.id !== comp.id);
                      // Sync with monitor manager
                      if (monitorManager) {
                        monitorManager.setSelectedComponents(selectedComponents.value);
                      }
                    }}
                  >
                    ×
                  </button>
                </div>
                <div className="component-details">
                  {comp.domElement && (
                    <div className="detail-row">
                      <span className="detail-label">Element:</span>
                      <code className="detail-value">
                        &lt;{comp.domElement.tagName.toLowerCase()}{comp.domElement.id ? ` id="${comp.domElement.id}"` : ''}{comp.domElement.className ? ` class="${comp.domElement.className}"` : ''}&gt;
                      </code>
                    </div>
                  )}
                  {Object.keys(comp.props || {}).length > 0 && (
                    <div className="detail-row">
                      <span className="detail-label">Props:</span>
                      <pre className="detail-value props-value">{JSON.stringify(comp.props, null, 2)}</pre>
                    </div>
                  )}
                  {comp.state && (
                    <div className="detail-row">
                      <span className="detail-label">State:</span>
                      <pre className="detail-value props-value">{JSON.stringify(comp.state, null, 2)}</pre>
                    </div>
                  )}
                  {comp.hooks && comp.hooks.length > 0 && (
                    <div className="detail-row">
                      <span className="detail-label">Hooks:</span>
                      <div className="detail-value">
                        {comp.hooks.map((hook: any, i: number) => (
                          <div key={i} className="hook-item">
                            Hook {i}: {JSON.stringify(hook.memoizedState)}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="component-actions">
                    <button 
                      className="action-button"
                      onClick={() => {
                        currentView.value = 'chat';
                        inputValue.value = `Tell me about the ${comp.name} component`;
                      }}
                    >
                      Ask about this component
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  const renderSettingsView = () => (
    <div className="view-container">
      <div className="view-header">
        <h2 className="view-title">Settings</h2>
        <button className="view-close" onClick={() => currentView.value = 'chat'}>×</button>
      </div>
      <div className="view-content">
        <div className="settings-section">
          <label className="settings-label">OpenRouter API Key</label>
          <input
            type="password"
            className="settings-input"
            value={apiKey.value}
            onInput={(e) => apiKey.value = (e.target as HTMLInputElement).value}
            placeholder="sk-or-..."
          />
          <div className="settings-hint">
            Get your API key from{' '}
            <a href="https://openrouter.ai/keys" target="_blank" rel="noopener noreferrer" style={{ color: 'rgba(100, 200, 255, 0.9)' }}>
              openrouter.ai/keys
            </a>
          </div>
          <button
            className="settings-button"
            onClick={async () => {
              if (apiKey.value) {
                localStorage.setItem('react-llm-openrouter-key', apiKey.value);
                await hub.initializeProvider('openrouter', apiKey.value);
                currentView.value = 'models';
              }
            }}
            disabled={!apiKey.value}
          >
            Save and Connect
          </button>
        </div>
      </div>
    </div>
  );

  const renderModelsView = () => {
    const models = hub.getAvailableModels();
    const hasApiKey = hub.isInitialized() && hub.getActiveProvider() !== 'demo';
    
    return (
      <div className="view-container">
        <div className="view-header">
          <h2 className="view-title">Select Model</h2>
          <button className="view-close" onClick={() => currentView.value = 'chat'}>×</button>
        </div>
        <div className="view-content">
          {!hasApiKey && (
            <div className="api-key-prompt">
              <div className="api-key-prompt-text">
                Add your OpenRouter API key to access all models
              </div>
              <button 
                className="api-key-prompt-button"
                onClick={() => currentView.value = 'settings'}
              >
                Add API Key
              </button>
            </div>
          )}
          
          <div className="models-grid">
            {models.map((model: Model) => (
              <div
                key={model.id}
                className={`model-card ${hub.getActiveModel() === model.id ? 'selected' : ''}`}
                onClick={() => {
                  hub.setActiveModel('openrouter', model.id);
                  handleModelChange('openrouter', model.id);
                  currentView.value = 'chat';
                }}
              >
                <div className="model-card-header">
                  <div>
                    <div className="model-card-name">{model.name}</div>
                    <div className="model-card-provider">{model.provider}</div>
                  </div>
                  {model.id.includes('claude-3-5-sonnet') || model.id.includes('gpt-4o') ? (
                    <span className="model-card-badge recommended">Recommended</span>
                  ) : null}
                </div>
                
                <div className="model-card-specs">
                  <div className="model-spec">
                    <div className="model-spec-label">Context</div>
                    <div className="model-spec-value">
                      {model.contextLength >= 1000000 ? `${(model.contextLength / 1000000).toFixed(1)}M` :
                       model.contextLength >= 1000 ? `${(model.contextLength / 1000).toFixed(0)}K` :
                       model.contextLength}
                    </div>
                  </div>
                  <div className="model-spec">
                    <div className="model-spec-label">Input</div>
                    <div className="model-spec-value">${(model.pricing.prompt * 1000).toFixed(3)}/1K</div>
                  </div>
                  <div className="model-spec">
                    <div className="model-spec-label">Output</div>
                    <div className="model-spec-value">${(model.pricing.completion * 1000).toFixed(3)}/1K</div>
                  </div>
                </div>
                
                {model.description && (
                  <div className="model-card-description">{model.description}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderMessage = (msg: ChatMessage) => {
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
                    // Use ref instead of querySelector for Shadow DOM compatibility
                    if (inputRef.value) {
                      inputRef.value.focus();
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

  // Log when toolbar renders for debugging
  useEffect(() => {
    console.log('[Toolbar] Mounted, visibility:', isVisible.value);
    const toolbar = document.querySelector('.toolbar');
    if (toolbar) {
      const rect = (toolbar as HTMLElement).getBoundingClientRect();
      console.log('[Toolbar] Position:', rect);
    }
  }, []);

  return (
    <Fragment>
      <style>{styles}</style>
      <div 
        className={`toolbar ${isMinimized.value ? 'minimized' : ''} ${isVisible.value ? '' : 'opacity-0'}`}
      >
        <div className="header">
          <div className="controls">
            <button 
              className={`control-button ${currentView.value === 'components' ? 'active' : ''}`} 
              onClick={() => currentView.value = currentView.value === 'components' ? 'chat' : 'components'}
              title="Selected Components"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              </svg>
            </button>
            <button 
              className={`control-button model-button ${currentView.value === 'models' ? 'active' : ''}`} 
              onClick={() => currentView.value = currentView.value === 'models' ? 'chat' : 'models'}
              title="Select Model"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <rect x="2" y="2" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <rect x="5" y="5" width="6" height="1.5" rx="0.75" fill="currentColor"/>
                <rect x="5" y="8" width="6" height="1.5" rx="0.75" fill="currentColor"/>
                <rect x="5" y="11" width="4" height="1.5" rx="0.75" fill="currentColor"/>
              </svg>
            </button>
            <button 
              className={`control-button ${currentView.value === 'settings' ? 'active' : ''}`} 
              onClick={() => currentView.value = currentView.value === 'settings' ? 'chat' : 'settings'}
              title="Settings"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 10a2 2 0 100-4 2 2 0 000 4z"/>
                <path d="M13.3 9.2a1.2 1.2 0 010-2.4l.7-.1a6 6 0 00-.4-1.6l-.6.4a1.2 1.2 0 01-1.7-.4 1.2 1.2 0 01.4-1.7l.6-.3A6 6 0 0011 2l-.1.7a1.2 1.2 0 01-2.4 0L8.4 2a6 6 0 00-1.6.4l.4.6a1.2 1.2 0 01-.4 1.7 1.2 1.2 0 01-1.7-.4l-.3-.6A6 6 0 002 5l.7.1a1.2 1.2 0 010 2.4L2 7.6a6 6 0 00.4 1.6l.6-.4a1.2 1.2 0 011.7.4 1.2 1.2 0 01-.4 1.7l-.6.3A6 6 0 005 14l.1-.7a1.2 1.2 0 012.4 0l.1.7a6 6 0 001.6-.4l-.4-.6a1.2 1.2 0 01.4-1.7 1.2 1.2 0 011.7.4l.3.6A6 6 0 0014 11l-.7-.1zM8 11a3 3 0 110-6 3 3 0 010 6z"/>
              </svg>
            </button>
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

        {!isMinimized.value && currentView.value === 'models' && renderModelsView()}
        {!isMinimized.value && currentView.value === 'settings' && renderSettingsView()}
        {!isMinimized.value && currentView.value === 'components' && renderComponentsView()}
        
        {!isMinimized.value && currentView.value === 'chat' && (
          activeChat() ? (
            <Fragment>
              <div className="messages-container">
                {activeChat()!.messages.map((msg, i) => (
                  <div key={i} className="message-wrapper">
                    {renderMessage(msg)}
                  </div>
                ))}
                {isStreamingResponse.value && streamingContent.value && (
                  <div className="message-wrapper">
                    <div className="message assistant-message">
                      <div dangerouslySetInnerHTML={{ __html: marked(streamingContent.value) }} />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="input-area">
                <form onSubmit={handleSubmit} className="input-form">
                  <textarea
                    ref={(el) => {
                      inputRef.value = el;
                      // Auto-resize textarea
                      if (el) {
                        el.style.height = 'auto';
                        el.style.height = Math.min(el.scrollHeight, 140) + 'px';
                      }
                    }}
                    className="input"
                    value={inputValue.value}
                    onInput={(e) => {
                      handleInputChange(e);
                      // Auto-resize on input
                      const textarea = e.target as HTMLTextAreaElement;
                      textarea.style.height = 'auto';
                      textarea.style.height = Math.min(textarea.scrollHeight, 140) + 'px';
                    }}
                    onKeyDown={(e) => {
                      // Submit on Enter (without Shift)
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSubmit(e as any);
                      } else {
                        handleInputKeyDown(e);
                      }
                    }}
                    placeholder="Message ReactLM..."
                    disabled={isInitializing.value || isStreamingResponse.value}
                    rows={1}
                  />
                  <div className="input-controls">
                    <button 
                      type="button"
                      className="attachment-button"
                      onClick={() => console.log('Attachment feature coming soon')}
                      title="Attach files (coming soon)"
                      disabled
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8.5 1.5a2.5 2.5 0 0 1 2.5 2.5v5.5a4.5 4.5 0 0 1-9 0V4a1 1 0 0 1 2 0v5.5a2.5 2.5 0 0 0 5 0V4a.5.5 0 0 0-1 0v5.5a1.5 1.5 0 0 1-3 0V4a1 1 0 0 1 2 0v5.5a.5.5 0 0 0 1 0V4a2.5 2.5 0 0 1 2.5-2.5z"/>
                      </svg>
                    </button>
                    <button 
                      type="button"
                      className={`control-icon-button ${selectionMode.value === 'selecting' ? 'active' : ''}`}
                      onClick={() => selectionMode.value = selectionMode.value === 'selecting' ? 'none' : 'selecting'}
                      title="Select Component"
                    >
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2 2h4v2H4v2H2V2zm10 0h4v4h-2V4h-2V2zM2 10h2v2h2v2H2v-4zm12 2h2v-2h-2v2zm0 0v2h-2v2h4v-4h-2z"/>
                        <circle cx="8" cy="8" r="2" opacity="0.5"/>
                      </svg>
                    </button>
                    <button 
                      type="button"
                      className={`send-button ${isStreamingResponse.value ? 'streaming' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        handleSubmit(e as any);
                      }}
                      disabled={isInitializing.value || isStreamingResponse.value || !inputValue.value.trim()}
                    >
                      {isStreamingResponse.value ? (
                        <span className="loading-dots">
                          <span className="loading-dot"></span>
                          <span className="loading-dot"></span>
                          <span className="loading-dot"></span>
                        </span>
                      ) : (
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z" transform="rotate(90 8 8)"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </form>
              </div>
              
            </Fragment>
          ) : (
            <div className="empty-state">
              <div className="empty-state-title">welcome to reactlm</div>
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
          )
        )}
      </div>
      
      {/* Component selection overlay - renders when in selection mode */}
      {selectionMode.value === 'selecting' && (
        <ComponentInspector 
          isActive={true} 
          onSelect={handleComponentSelect}
          theme="dark"
        />
      )}
      
      {/* Context selector - renders when @ mention is typed */}
      {showContextSelector.value && (
        <ContextSelector
          onSelect={handleContextSelect}
          position={contextSelectorPosition.value}
          searchTerm={contextSearchTerm.value}
        />
      )}
    </Fragment>
  );
}
