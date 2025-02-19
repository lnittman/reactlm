/** @jsx h */
import { h } from 'preact';
import { signal } from '@preact/signals';
import { useRef } from 'preact/hooks';
import type { ChatState, Message } from '../types';
import { sendMessageToGemini } from '../gemini/gemini';

const chatState = signal<ChatState>({
  messages: [],
  isLoading: false,
});

export function ChatInterface() {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!inputRef.current?.value.trim() || chatState.value.isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputRef.current.value,
      timestamp: Date.now(),
    };

    // Update chat state with user message
    chatState.value = {
      ...chatState.value,
      messages: [...chatState.value.messages, userMessage],
      isLoading: true,
      error: undefined,
    };

    // Clear input
    inputRef.current.value = '';

    try {
      const response = await sendMessageToGemini(userMessage.content);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: Date.now(),
      };

      // Update chat state with assistant response
      chatState.value = {
        ...chatState.value,
        messages: [...chatState.value.messages, assistantMessage],
        isLoading: false,
      };
    } catch (error) {
      chatState.value = {
        ...chatState.value,
        isLoading: false,
        error: error instanceof Error ? error.message : 'An error occurred',
      };
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
        {chatState.value.messages.map((message) => (
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
        {chatState.value.isLoading && (
          <div style={{ padding: '8px 12px', color: '#888' }}>Loading...</div>
        )}
        {chatState.value.error && (
          <div style={{ padding: '8px 12px', color: '#ff4444' }}>
            {chatState.value.error}
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
        <textarea
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
          disabled={chatState.value.isLoading}
          style={{
            backgroundColor: '#4a4a4a',
            border: 'none',
            borderRadius: '4px',
            padding: '8px 16px',
            color: '#ffffff',
            cursor: chatState.value.isLoading ? 'not-allowed' : 'pointer',
            opacity: chatState.value.isLoading ? 0.7 : 1,
          }}
        >
          Send
        </button>
      </form>
    </div>
  );
}
