export const schema = `
-- Chat sessions table with project info fields
CREATE TABLE IF NOT EXISTS chat_sessions (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  project_name TEXT,
  project_type TEXT,
  project_description TEXT,
  is_active BOOLEAN DEFAULT 1
);

-- Project technologies junction table
CREATE TABLE IF NOT EXISTS project_technologies (
  chat_session_id TEXT NOT NULL,
  technology TEXT NOT NULL,
  PRIMARY KEY (chat_session_id, technology),
  FOREIGN KEY (chat_session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id TEXT PRIMARY KEY,
  chat_session_id TEXT NOT NULL,
  role TEXT CHECK(role IN ('user', 'assistant')) NOT NULL,
  content TEXT NOT NULL,
  timestamp INTEGER NOT NULL,
  FOREIGN KEY (chat_session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE
);

-- Relevant files table
CREATE TABLE IF NOT EXISTS relevant_files (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  message_id TEXT NOT NULL,
  path TEXT NOT NULL,
  reason TEXT,
  file_type TEXT CHECK(file_type IN ('core', 'config', 'component', 'util', 'test', 'other', 'page', 'api-route', 'class', 'store', 'external-script', 'layout', 'module')) NOT NULL,
  snippet TEXT,
  FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE
);

-- Documentation links table
CREATE TABLE IF NOT EXISTS documentation_links (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  message_id TEXT NOT NULL,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE
);

-- Suggested queries table
CREATE TABLE IF NOT EXISTS suggested_queries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  message_id TEXT NOT NULL,
  query TEXT NOT NULL,
  FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_messages_chat_session_id ON messages(chat_session_id);
CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp);
CREATE INDEX IF NOT EXISTS idx_relevant_files_message_id ON relevant_files(message_id);
CREATE INDEX IF NOT EXISTS idx_documentation_links_message_id ON documentation_links(message_id);
CREATE INDEX IF NOT EXISTS idx_suggested_queries_message_id ON suggested_queries(message_id);
CREATE INDEX IF NOT EXISTS idx_project_technologies_chat_session_id ON project_technologies(chat_session_id);
`; 