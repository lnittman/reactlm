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

export async function initDB() {
  if (db) return db;

  try {
    // Initialize wa-sqlite with correct WASM path
    const sqlite3 = await import('@sqlite.org/sqlite-wasm');
    const sqlite = await sqlite3.default({
      locateFile: (file: string) => __PUBLIC_PATH__ + file
    });
    
    if (!sqlite?.oo1) {
      throw new Error('SQLite initialization failed: oo1 not available');
    }

    try {
      // Try OPFS first
      if (sqlite.oo1.OpfsDb) {
        console.log('[ReactLLM] Using OPFS for persistence');
        const dbPath = '/react-llm.sqlite3';
        db = new sqlite.oo1.OpfsDb(dbPath);
      } else {
        // Fall back to in-memory database
        console.log('[ReactLLM] OPFS not available, using in-memory database');
        db = new sqlite.oo1.DB('/react-llm.sqlite3', 'ct');
      }
    } catch (e) {
      console.warn('[ReactLLM] Failed to initialize OPFS, falling back to in-memory database:', e);
      db = new sqlite.oo1.DB('/react-llm.sqlite3', 'ct');
    }

    // Create tables
    if (!db) throw new Error('Database initialization failed');
    await db.exec({ sql: schema });
    console.log('[ReactLLM] Database initialized successfully');
    return db;
  } catch (error) {
    console.error('Failed to initialize database:', error);
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