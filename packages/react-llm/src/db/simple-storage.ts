// Simple in-memory storage for demo purposes
// This replaces SQLite temporarily to avoid WASM loading issues

import type { StructuredResponse } from '../gemini/gemini';

interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  projectName?: string;
  projectType?: string;
  projectDescription?: string;
  isActive: boolean;
  technologies: string[];
}

interface ChatMessage {
  id: string;
  chatSessionId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  structuredResponse?: string;
  relevantFiles: any[];
  documentationLinks: any[];
  suggestedQueries: any[];
}

// In-memory storage
const storage = {
  sessions: new Map<string, ChatSession>(),
  messages: new Map<string, ChatMessage[]>(),
};

let isInitialized = false;

export async function initDB() {
  if (isInitialized) return true;
  
  console.log('[ReactLLM] Using in-memory storage');
  isInitialized = true;
  return true;
}

export async function createChatSession(
  id: string,
  title: string,
  projectInfo?: StructuredResponse['projectInfo']
) {
  const session: ChatSession = {
    id,
    title,
    createdAt: Date.now(),
    projectName: projectInfo?.name,
    projectType: projectInfo?.type,
    projectDescription: projectInfo?.description,
    isActive: true,
    technologies: projectInfo?.mainTechnologies || [],
  };
  
  storage.sessions.set(id, session);
  storage.messages.set(id, []);
}

export async function createMessage(
  id: string,
  chatSessionId: string,
  role: 'user' | 'assistant',
  content: string,
  structuredResponse?: string
) {
  const message: ChatMessage = {
    id,
    chatSessionId,
    role,
    content,
    timestamp: Date.now(),
    structuredResponse,
    relevantFiles: [],
    documentationLinks: [],
    suggestedQueries: [],
  };
  
  const messages = storage.messages.get(chatSessionId) || [];
  messages.push(message);
  storage.messages.set(chatSessionId, messages);
  
  // Parse structured response if present
  if (structuredResponse && role === 'assistant') {
    try {
      const parsed = JSON.parse(structuredResponse) as StructuredResponse;
      
      message.relevantFiles = parsed.relevantFiles || [];
      message.documentationLinks = parsed.documentationLinks || [];
      message.suggestedQueries = (parsed.suggestedQueries || []).map(q => ({ query: q }));
    } catch (e) {
      console.error('Failed to parse structured response:', e);
    }
  }
}

export async function getChatSessions(): Promise<ChatSession[]> {
  return Array.from(storage.sessions.values())
    .filter(s => s.isActive)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function getMessagesForChatSession(chatSessionId: string): Promise<ChatMessage[]> {
  return storage.messages.get(chatSessionId) || [];
}

export async function deleteChatSession(id: string) {
  const session = storage.sessions.get(id);
  if (session) {
    session.isActive = false;
  }
}