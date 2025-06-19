export interface RelevantFile {
  id: string;
  messageId: string;
  path: string;
  reason: string;
  type: 'core' | 'config' | 'component' | 'util' | 'test' | 'other';
  snippet?: string;
}

export interface DocumentationLink {
  id: string;
  messageId: string;
  title: string;
  url: string;
  description: string;
}

export interface SuggestedQuery {
  id: number;
  messageId: string;
  query: string;
}

export interface StructuredResponse {
  markdown: string;
  chatTitle?: string;
  relevantFiles: Array<{
    path: string;
    reason: string;
    type: 'core' | 'config' | 'component' | 'util' | 'test' | 'other';
    snippet?: string;
  }>;
  documentationLinks: Array<{
    title: string;
    url: string;
    description: string;
  }>;
  suggestedQueries?: string[];
  projectInfo?: {
    name: string;
    type: string;
    mainTechnologies: string[];
    description: string;
  };
}

export interface ProjectInfo {
  name: string;
  description?: string;
  language?: string;
  framework?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  relevantFiles: RelevantFile[];
  documentationLinks: DocumentationLink[];
  suggestedQueries?: string[];
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  projectInfo?: ProjectInfo;
}

export interface ChatState {
  messages: Message[];
  error?: string;
} 