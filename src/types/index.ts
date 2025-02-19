export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ToolbarPosition {
  x: number;
  y: number;
}

export interface GeminiConfig {
  apiKey: string;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error?: string;
}
