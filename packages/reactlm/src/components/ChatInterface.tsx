/** @jsx h */
import { h } from 'preact';
import { useSignal } from '@preact/signals';
import { useRef } from 'preact/hooks';
import type { ChatState, Message } from '../types';
import { sendMessageToGemini } from '../gemini/gemini';
import { styles } from './ChatInterface.styles';

interface ChatInterfaceProps {
  chatState: ChatState;
  onSendMessage: (message: string) => void;
}

export function ChatInterface({ chatState, onSendMessage }: ChatInterfaceProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesRef = useRef<HTMLDivElement>(null);
  const isLoading = useSignal(false);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!inputRef.current?.value.trim() || isLoading.value) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: inputRef.current.value.trim(),
      relevantFiles: [],
      documentationLinks: [],
      suggestedQueries: []
    };

    // Update chat state with user message
    chatState.messages = [...chatState.messages, userMessage];
    isLoading.value = true;
    chatState.error = undefined;

    // Clear input
    inputRef.current.value = '';

    try {
      const response = await sendMessageToGemini(userMessage.content);
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: response.markdown,
        relevantFiles: response.relevantFiles.map(file => ({
          ...file,
          id: crypto.randomUUID(),
          messageId: userMessage.id
        })),
        documentationLinks: response.documentationLinks.map(link => ({
          ...link,
          id: crypto.randomUUID(),
          messageId: userMessage.id
        })),
        suggestedQueries: response.suggestedQueries
      };

      // Update chat state with assistant response
      chatState.messages = [...chatState.messages, assistantMessage];
      isLoading.value = false;
    } catch (error) {
      isLoading.value = false;
      chatState.error = error instanceof Error ? error.message : 'An error occurred';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '400px' }}>
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {chatState.messages.map((message) => (
          <div
            key={message.id}
            style={{
              backgroundColor: message.role === 'user' ? '#2a2a2a' : '#3a3a3a',
              padding: '8px 12px',
              borderRadius: '6px',
              maxWidth: '85%',
              alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
            }}
          >
            {message.content}
          </div>
        ))}
        {isLoading.value && (
          <div style={{ padding: '8px 12px', color: '#888' }}>Loading...</div>
        )}
        {chatState.error && (
          <div style={{ padding: '8px 12px', color: '#ff4444' }}>
            {chatState.error}
          </div>
        )}
      </div>
      <form
        onSubmit={handleSubmit}
        style={{
          borderTop: '1px solid #2a2a2a',
          padding: '12px',
          display: 'flex',
          gap: '8px',
        }}
      >
        <input
          ref={inputRef}
          placeholder="Ask about your code..."
          style={{
            flex: 1,
            backgroundColor: '#2a2a2a',
            border: 'none',
            borderRadius: '4px',
            padding: '8px',
            color: '#ffffff',
            resize: 'none',
            height: '36px',
            lineHeight: '20px',
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <button
          type="submit"
          disabled={isLoading.value}
          style={{
            backgroundColor: '#4a4a4a',
            border: 'none',
            borderRadius: '4px',
            padding: '8px 16px',
            color: '#ffffff',
            cursor: isLoading.value ? 'not-allowed' : 'pointer',
            opacity: isLoading.value ? 0.7 : 1,
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}
