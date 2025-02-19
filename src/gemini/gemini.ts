import { GoogleGenerativeAI } from '@google/generative-ai';

let geminiClient: GoogleGenerativeAI | null = null;
let codebaseContext: string | null = null;
let initialResponse: StructuredResponse | null = null;

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

export interface StructuredResponse {
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

const CACHE_KEY = 'react-llm-initial-analysis';
const DEBUG = true;

function debugLog(type: string, data: any) {
  if (!DEBUG) return;
  console.log(`[react-llm ${type}]`, JSON.stringify(data, null, 2));
}

// Load codebase context from public directory
async function loadCodebaseContext() {
  try {
    // Only try to load context if we're in a browser environment
    if (typeof window === 'undefined') return null;

    const response = await fetch('/codebase-context.json');
    if (!response.ok) {
      console.warn('Codebase context not found');
      return null;
    }
    const data = await response.json();
    return data.context;
  } catch (error) {
    console.warn('Failed to load codebase context:', error);
    return null;
  }
}

export interface GeminiConfig {
  apiKey: string;
}

export const initGemini = async (config: GeminiConfig) => {
  const apiKey = config.apiKey;
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('Gemini API key is required');
  }

  try {
    // Initialize the client
    geminiClient = new GoogleGenerativeAI(apiKey);
    
    // Try to load from cache first
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        initialResponse = JSON.parse(cached);
        debugLog('cache-hit', { initialResponse });
        return geminiClient;
      } catch (e) {
        console.warn('Failed to parse cached response:', e);
        localStorage.removeItem(CACHE_KEY);
      }
    }
    
    // If no cache, load context and get initial analysis
    try {
      codebaseContext = await loadCodebaseContext();
      if (codebaseContext) {
        debugLog('context-loaded', { contextLength: codebaseContext.length });
        
        // Get initial analysis
        initialResponse = await getInitialAnalysis();
        if (initialResponse) {
          debugLog('initial-analysis', { initialResponse });
          // Cache the response
          localStorage.setItem(CACHE_KEY, JSON.stringify(initialResponse));
        }
      }
    } catch (contextError) {
      console.warn('Failed to load codebase context:', contextError);
    }
    
    return geminiClient;
  } catch (error) {
    console.error('Failed to initialize Gemini client:', error);
    throw error;
  }
};

export const getInitialResponse = () => {
  if (!initialResponse) {
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      try {
        initialResponse = JSON.parse(cached);
        debugLog('cache-hit-lazy', { initialResponse });
      } catch (e) {
        console.warn('Failed to parse cached response:', e);
        localStorage.removeItem(CACHE_KEY);
      }
    }
  }
  return initialResponse;
};

async function getInitialAnalysis(): Promise<StructuredResponse | null> {
  if (!geminiClient || !codebaseContext) return null;

  try {
    const model = geminiClient.getGenerativeModel({ model: 'gemini-2.0-flash-001' });
    
    const prompt = `You are a helpful AI assistant for developers. Please analyze this codebase and provide a comprehensive initial response.

Here is the context of the codebase:

${codebaseContext}

Please provide:
1. A clear project name and description
2. List of core files and their purposes
3. Relevant documentation links
4. Suggested initial queries

Structure your response in JSON format:
{
  "projectInfo": {
    "name": "Project name",
    "type": "Type of project",
    "mainTechnologies": ["tech1", "tech2"],
    "description": "Brief description"
  },
  "relevantFiles": [
    {
      "path": "src/components/Example.tsx",
      "reason": "Main component that handles...",
      "type": "component"
    }
  ],
  "documentationLinks": [
    {
      "url": "https://example.com",
      "title": "Relevant Documentation",
      "description": "Official docs for..."
    }
  ],
  "suggestedQueries": [
    "How do I...",
    "What is the purpose of..."
  ]
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const jsonStr = text.split(/```json|```/g)[1]?.trim();
      if (!jsonStr) throw new Error('No JSON found in response');
      
      const data = JSON.parse(jsonStr);
      return {
        markdown: text.split(/```json|```/g)[0].trim(),
        chatTitle: undefined,
        relevantFiles: data.relevantFiles || [],
        documentationLinks: data.documentationLinks || [],
        suggestedQueries: data.suggestedQueries || [],
        projectInfo: data.projectInfo
      };
    } catch (e) {
      console.warn('Failed to parse initial analysis:', e);
      return null;
    }
  } catch (error) {
    console.error('Failed to get initial analysis:', error);
    return null;
  }
}

export const getGeminiClient = () => {
  if (!geminiClient) {
    throw new Error('Gemini client not initialized. Call initGemini first.');
  }
  return geminiClient;
};

export async function sendMessageToGemini(message: string, isNewChat: boolean = false): Promise<StructuredResponse> {
  debugLog('message-input', { message, isNewChat });
  
  // If this is a new chat and we have an initial response, use that
  if (isNewChat) {
    const initial = getInitialResponse();
    if (initial) {
      debugLog('using-cached-initial', { initial });
      return initial;
    }
  }

  const client = getGeminiClient();
  
  try {
    const model = client.getGenerativeModel({ model: 'gemini-2.0-flash-001' });
    
    const prompt = `You are a helpful AI assistant for developers. Please provide responses in markdown format.
    
${isNewChat ? `This is a new chat session. Please analyze the codebase thoroughly and provide a comprehensive initial response.
If this is a question about the codebase, please suggest a title for this chat session.` : ''}

When analyzing code or responding to queries:
1. Identify core files and their purposes
2. Find relevant documentation links using web search
3. Categorize files by type (core, config, component, util, test, other)
4. For new chat sessions, provide project information
5. Suggest follow-up queries when appropriate

${codebaseContext ? 'Here is the context of the codebase:\n\n' + codebaseContext + '\n\n' : ''}

Please structure your response in JSON format after your markdown explanation:
{
  "chatTitle": "Suggested title for this chat",
  "relevantFiles": [
    {
      "path": "src/components/Example.tsx",
      "reason": "Main component that handles...",
      "type": "component"
    }
  ],
  "documentationLinks": [
    {
      "url": "https://example.com",
      "title": "Relevant Documentation",
      "description": "Official docs for..."
    }
  ],
  "projectInfo": {
    "name": "Project name",
    "type": "Type of project",
    "mainTechnologies": ["tech1", "tech2"],
    "description": "Brief description"
  },
  "suggestedQueries": [
    "How do I...",
    "What is the purpose of..."
  ]
}

User: ${message}`;

    debugLog('prompt', { prompt });

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    debugLog('llm-response', { text });
    
    // Split response into markdown and JSON parts
    const [markdown, jsonStr] = text.split(/```json|```/g).map(s => s.trim());
    
    try {
      const structuredData = jsonStr ? JSON.parse(jsonStr) : {};
      const finalResponse = {
        markdown,
        chatTitle: structuredData.chatTitle,
        relevantFiles: structuredData.relevantFiles || [],
        documentationLinks: structuredData.documentationLinks || [],
        suggestedQueries: structuredData.suggestedQueries,
        projectInfo: structuredData.projectInfo
      };
      
      // Cache initial response if this is a new chat
      if (isNewChat) {
        initialResponse = finalResponse;
        localStorage.setItem(CACHE_KEY, JSON.stringify(finalResponse));
      }
      
      debugLog('structured-response', { finalResponse });
      return finalResponse;
    } catch (e) {
      console.warn('Failed to parse structured data:', e);
      const fallbackResponse = {
        markdown,
        relevantFiles: [],
        documentationLinks: []
      };
      debugLog('fallback-response', { fallbackResponse });
      return fallbackResponse;
    }
  } catch (error) {
    console.error('Failed to send message to Gemini:', error);
    throw error;
  }
}
