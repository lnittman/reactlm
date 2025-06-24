import { schema } from './schema';
import type { Database, SqlValue } from '@sqlite.org/sqlite-wasm';
import type { StructuredResponse } from '../gemini/gemini';

let db: Database | null = null;

// @ts-ignore - __PUBLIC_PATH__ is defined in the bundle
declare const __PUBLIC_PATH__: string;

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
  relevantFiles: RelevantFile[];
  documentationLinks: DocumentationLink[];
  suggestedQueries: SuggestedQuery[];
}

interface RelevantFile {
  id: number;
  messageId: string;
  path: string;
  reason?: string;
  fileType: 'core' | 'config' | 'component' | 'util' | 'test' | 'other' | 'page' | 'api-route' | 'class' | 'store' | 'external-script' | 'layout' | 'module';
  snippet?: string;
}

interface DocumentationLink {
  id: number;
  messageId: string;
  url: string;
  title: string;
  description?: string;
}

interface SuggestedQuery {
  id: number;
  messageId: string;
  query: string;
}

// Modern browser storage fallback strategy
interface InMemoryDB {
  exec(options: { sql: string; bind?: any[]; callback?: (row: any[]) => void }): Promise<void>;
}

class BrowserStorageDB implements InMemoryDB {
  private data: Map<string, any[]> = new Map();
  private schema = {
    chat_sessions: ['id', 'title', 'created_at', 'project_name', 'project_type', 'project_description', 'is_active'],
    messages: ['id', 'chat_session_id', 'role', 'content', 'timestamp'],
    relevant_files: ['id', 'message_id', 'path', 'reason', 'file_type', 'snippet'],
    documentation_links: ['id', 'message_id', 'url', 'title', 'description'],
    suggested_queries: ['id', 'message_id', 'query'],
    project_technologies: ['chat_session_id', 'technology']
  };

  constructor() {
    // Initialize tables
    Object.keys(this.schema).forEach(table => {
      this.data.set(table, []);
    });
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage() {
    try {
      const stored = localStorage.getItem('react-llm-data');
      if (stored) {
        const parsed = JSON.parse(stored);
        Object.entries(parsed).forEach(([table, rows]) => {
          this.data.set(table, rows as any[]);
        });
        console.log('[ReactLLM] Loaded data from localStorage');
      }
    } catch (e) {
      console.warn('[ReactLLM] Failed to load from localStorage:', e);
    }
  }

  private saveToLocalStorage() {
    try {
      const dataObj: any = {};
      this.data.forEach((rows, table) => {
        dataObj[table] = rows;
      });
      localStorage.setItem('react-llm-data', JSON.stringify(dataObj));
    } catch (e) {
      console.warn('[ReactLLM] Failed to save to localStorage:', e);
    }
  }

  async exec(options: { sql: string; bind?: any[]; callback?: (row: any[]) => void }): Promise<void> {
    const { sql, bind = [], callback } = options;
    const sqlUpper = sql.trim().toUpperCase();

    if (sqlUpper.includes('CREATE TABLE') || sqlUpper.includes('CREATE INDEX')) {
      // Ignore schema creation - we handle it in constructor
      return;
    }

    if (sqlUpper.startsWith('INSERT INTO')) {
      this.handleInsert(sql, bind);
      this.saveToLocalStorage();
    } else if (sqlUpper.startsWith('SELECT')) {
      this.handleSelect(sql, bind, callback);
    } else if (sqlUpper.startsWith('UPDATE')) {
      this.handleUpdate(sql, bind);
      this.saveToLocalStorage();
    }
  }

  private handleInsert(sql: string, bind: any[]) {
    const tableMatch = sql.match(/INSERT INTO (\w+)/i);
    if (!tableMatch) return;
    
    const table = tableMatch[1];
    const rows = this.data.get(table) || [];
    
    if (table === 'chat_sessions') {
      rows.push({
        id: bind[0],
        title: bind[1],
        created_at: bind[2],
        project_name: bind[3],
        project_type: bind[4],
        project_description: bind[5],
        is_active: 1
      });
    } else if (table === 'messages') {
      rows.push({
        id: bind[0],
        chat_session_id: bind[1],
        role: bind[2],
        content: bind[3],
        timestamp: bind[4]
      });
    } else if (table === 'project_technologies') {
      // Handle bulk insert
      for (let i = 0; i < bind.length; i += 2) {
        rows.push({
          chat_session_id: bind[i],
          technology: bind[i + 1]
        });
      }
    }
    
    this.data.set(table, rows);
  }

  private handleSelect(sql: string, bind: any[], callback?: (row: any[]) => void) {
    if (!callback) return;
    
    if (sql.includes('chat_sessions')) {
      const sessions = this.data.get('chat_sessions') || [];
      const technologies = this.data.get('project_technologies') || [];
      
      sessions
        .filter((s: any) => s.is_active)
        .sort((a: any, b: any) => b.created_at - a.created_at)
        .forEach((session: any) => {
          const sessionTechs = technologies
            .filter((t: any) => t.chat_session_id === session.id)
            .map((t: any) => t.technology)
            .join(',');
          
          callback([
            session.id,
            session.title,
            session.created_at,
            session.project_name,
            session.project_type,
            session.project_description,
            session.is_active,
            sessionTechs
          ]);
        });
    } else if (sql.includes('messages') && bind.length > 0) {
      const messages = this.data.get('messages') || [];
      messages
        .filter((m: any) => m.chat_session_id === bind[0])
        .sort((a: any, b: any) => a.timestamp - b.timestamp)
        .forEach((message: any) => {
          callback([
            message.id,
            message.chat_session_id,
            message.role,
            message.content,
            message.timestamp
          ]);
        });
    }
  }

  private handleUpdate(sql: string, bind: any[]) {
    if (sql.includes('chat_sessions') && sql.includes('is_active = 0')) {
      const sessions = this.data.get('chat_sessions') || [];
      const session = sessions.find((s: any) => s.id === bind[0]);
      if (session) {
        session.is_active = 0;
      }
    }
  }
}

export async function initDB() {
  if (db) return db;

  try {
    // Try SQLite WASM first
    try {
      // Load SQLite WASM from CDN
      const sqliteWasmUrl = 'https://cdn.jsdelivr.net/npm/@sqlite.org/sqlite-wasm@3.46.1-build1/sqlite-wasm/jswasm/sqlite3.js';
      
      // Create a script tag to load the module properly
      const script = document.createElement('script');
      script.src = sqliteWasmUrl;
      
      await new Promise((resolve, reject) => {
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
      
      // Check if sqlite3InitModule is available globally
      const sqlite3InitModule = (window as any).sqlite3InitModule;
      if (!sqlite3InitModule) {
        throw new Error('sqlite3InitModule not found on window');
      }
      
      const sqlite = await sqlite3InitModule({
        locateFile: (file: string) => {
          return 'https://cdn.jsdelivr.net/npm/@sqlite.org/sqlite-wasm@3.46.1-build1/sqlite-wasm/jswasm/' + file;
        }
      });
      
      if (sqlite?.oo1) {
        if (sqlite.oo1.OpfsDb) {
          console.log('[ReactLLM] Using OPFS for persistence');
          db = new sqlite.oo1.OpfsDb('/react-llm.sqlite3');
        } else {
          console.log('[ReactLLM] Using SQLite WASM in-memory');
          db = new sqlite.oo1.DB('/react-llm.sqlite3', 'ct');
        }
        
        await db.exec({ sql: schema });
        console.log('[ReactLLM] SQLite WASM initialized successfully');
        return db;
      }
    } catch (e) {
      console.warn('[ReactLLM] SQLite WASM failed, using localStorage fallback:', e);
    }
    
    // Fallback to localStorage-based implementation
    console.log('[ReactLLM] Using localStorage for persistence');
    db = new BrowserStorageDB() as any;
    return db;
    
  } catch (error) {
    console.error('Failed to initialize any database:', error);
    throw error;
  }
}

export async function createChatSession(
  id: string,
  title: string,
  projectInfo?: StructuredResponse['projectInfo']
) {
  const dbInstance = await initDB();
  if (!dbInstance) throw new Error('Database not initialized');
  
  await dbInstance.exec({
    sql: `INSERT INTO chat_sessions 
          (id, title, created_at, project_name, project_type, project_description) 
          VALUES (?, ?, ?, ?, ?, ?)`,
    bind: [
      id,
      title,
      Date.now(),
      projectInfo?.name || null,
      projectInfo?.type || null,
      projectInfo?.description || null
    ],
  });

  // Insert technologies if they exist
  if (projectInfo?.mainTechnologies?.length) {
    const techValues = projectInfo.mainTechnologies
      .map(() => '(?, ?)')
      .join(',');
    
    const techBindings = projectInfo.mainTechnologies.flatMap(tech => [id, tech]);
    
    await dbInstance.exec({
      sql: `INSERT INTO project_technologies (chat_session_id, technology) VALUES ${techValues}`,
      bind: techBindings,
    });
  }
}

export async function createMessage(
  id: string,
  chatSessionId: string,
  role: 'user' | 'assistant',
  content: string,
  structuredResponse?: string
) {
  const dbInstance = await initDB();
  if (!dbInstance) throw new Error('Database not initialized');

  // Insert the message
  await dbInstance.exec({
    sql: 'INSERT INTO messages (id, chat_session_id, role, content, timestamp) VALUES (?, ?, ?, ?, ?)',
    bind: [id, chatSessionId, role, content, Date.now()],
  });

  // If we have a structured response, parse and store its components
  if (structuredResponse) {
    try {
      const parsed = JSON.parse(structuredResponse) as StructuredResponse;

      // Insert relevant files
      if (parsed.relevantFiles?.length) {
        const fileValues = parsed.relevantFiles
          .map(() => '(?, ?, ?, ?, ?)')
          .join(',');
        
        const fileBindings = parsed.relevantFiles.flatMap(file => [
          id,
          file.path,
          file.reason || null,
          file.type,
          file.snippet || null
        ]);

        await dbInstance.exec({
          sql: `INSERT INTO relevant_files (message_id, path, reason, file_type, snippet) 
                VALUES ${fileValues}`,
          bind: fileBindings,
        });
      }

      // Insert documentation links
      if (parsed.documentationLinks?.length) {
        const linkValues = parsed.documentationLinks
          .map(() => '(?, ?, ?, ?)')
          .join(',');
        
        const linkBindings = parsed.documentationLinks.flatMap(link => [
          id,
          link.url,
          link.title,
          link.description || null
        ]);

        await dbInstance.exec({
          sql: `INSERT INTO documentation_links (message_id, url, title, description) 
                VALUES ${linkValues}`,
          bind: linkBindings,
        });
      }

      // Insert suggested queries
      if (parsed.suggestedQueries?.length) {
        const queryValues = parsed.suggestedQueries
          .map(() => '(?, ?)')
          .join(',');
        
        const queryBindings = parsed.suggestedQueries.flatMap(query => [id, query]);

        await dbInstance.exec({
          sql: `INSERT INTO suggested_queries (message_id, query) VALUES ${queryValues}`,
          bind: queryBindings,
        });
      }
    } catch (error) {
      console.warn('Failed to parse structured response:', error);
    }
  }
}

export async function getChatSessions(): Promise<ChatSession[]> {
  const dbInstance = await initDB();
  if (!dbInstance) throw new Error('Database not initialized');

  const sessions: Record<string, ChatSession> = {};

  // Get chat sessions
  await dbInstance.exec({
    sql: `SELECT cs.*, GROUP_CONCAT(pt.technology) as technologies
          FROM chat_sessions cs
          LEFT JOIN project_technologies pt ON cs.id = pt.chat_session_id
          WHERE cs.is_active = 1
          GROUP BY cs.id
          ORDER BY cs.created_at DESC`,
    callback: (row: SqlValue[]) => {
      if (row[0]) {
        const id = String(row[0]);
        sessions[id] = {
          id,
          title: String(row[1]),
          createdAt: Number(row[2]),
          projectName: row[3] ? String(row[3]) : undefined,
          projectType: row[4] ? String(row[4]) : undefined,
          projectDescription: row[5] ? String(row[5]) : undefined,
          isActive: Boolean(row[6]),
          technologies: row[7] ? String(row[7]).split(',') : []
        };
      }
    },
  });

  return Object.values(sessions);
}

export async function getMessagesForChatSession(chatSessionId: string): Promise<ChatMessage[]> {
  const dbInstance = await initDB();
  if (!dbInstance) throw new Error('Database not initialized');

  const messages: Record<string, ChatMessage> = {};

  // Get messages
  await dbInstance.exec({
    sql: 'SELECT * FROM messages WHERE chat_session_id = ? ORDER BY timestamp ASC',
    bind: [chatSessionId],
    callback: (row: SqlValue[]) => {
      if (row[0]) {
        const id = String(row[0]);
        messages[id] = {
          id,
          chatSessionId: String(row[1]),
          role: String(row[2]) as 'user' | 'assistant',
          content: String(row[3]),
          timestamp: Number(row[4]),
          structuredResponse: row[5] ? String(row[5]) : undefined,
          relevantFiles: [],
          documentationLinks: [],
          suggestedQueries: []
        };
      }
    },
  });

  // Get relevant files
  await dbInstance.exec({
    sql: `SELECT * FROM relevant_files 
          WHERE message_id IN (${Object.keys(messages).map(() => '?').join(',')})`,
    bind: Object.keys(messages),
    callback: (row: SqlValue[]) => {
      if (row[1] && messages[String(row[1])]) {
        messages[String(row[1])].relevantFiles.push({
          id: Number(row[0]),
          messageId: String(row[1]),
          path: String(row[2]),
          reason: row[3] ? String(row[3]) : undefined,
          fileType: String(row[4]) as RelevantFile['fileType'],
          snippet: row[5] ? String(row[5]) : undefined
        });
      }
    },
  });

  // Get documentation links
  await dbInstance.exec({
    sql: `SELECT * FROM documentation_links 
          WHERE message_id IN (${Object.keys(messages).map(() => '?').join(',')})`,
    bind: Object.keys(messages),
    callback: (row: SqlValue[]) => {
      if (row[1] && messages[String(row[1])]) {
        messages[String(row[1])].documentationLinks.push({
          id: Number(row[0]),
          messageId: String(row[1]),
          url: String(row[2]),
          title: String(row[3]),
          description: row[4] ? String(row[4]) : undefined
        });
      }
    },
  });

  // Get suggested queries
  await dbInstance.exec({
    sql: `SELECT * FROM suggested_queries 
          WHERE message_id IN (${Object.keys(messages).map(() => '?').join(',')})`,
    bind: Object.keys(messages),
    callback: (row: SqlValue[]) => {
      if (row[1] && messages[String(row[1])]) {
        messages[String(row[1])].suggestedQueries.push({
          id: Number(row[0]),
          messageId: String(row[1]),
          query: String(row[2])
        });
      }
    },
  });

  return Object.values(messages);
}

export async function deleteChatSession(chatSessionId: string) {
  const dbInstance = await initDB();
  if (!dbInstance) throw new Error('Database not initialized');

  // Due to ON DELETE CASCADE, we only need to delete the chat session
  await dbInstance.exec({
    sql: 'UPDATE chat_sessions SET is_active = 0 WHERE id = ?',
    bind: [chatSessionId],
  });
} 