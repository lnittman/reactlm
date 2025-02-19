export interface RelevantFile {
  id: number;
  messageId: string;
  path: string;
  reason?: string;
  fileType: string;
  snippet?: string;
}

export interface DocumentationLink {
  id: number;
  messageId: string;
  title: string;
  url: string;
  description?: string;
}

export interface SuggestedQuery {
  id: number;
  messageId: string;
  query: string;
}

export interface StructuredResponse {
  markdown: string;
  chatTitle?: string;
  projectInfo?: ProjectInfo;
  relevantFiles?: Array<{
    path: string;
    reason?: string;
  }>;
  documentationLinks?: Array<{
    title: string;
    url: string;
    description?: string;
  }>;
  suggestedQueries?: string[];
}

export interface ProjectInfo {
  name: string;
  description?: string;
  language?: string;
  framework?: string;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  structuredResponse?: StructuredResponse;
  relevantFiles: RelevantFile[];
  documentationLinks: DocumentationLink[];
  suggestedQueries: SuggestedQuery[];
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  projectInfo?: ProjectInfo;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error?: string;
} 