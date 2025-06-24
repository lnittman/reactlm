# Database Directory

This directory contains the SQLite database layer for React LLM, providing persistent storage for chat sessions and messages.

## Overview

React LLM uses SQLite WASM (WebAssembly) to provide a full SQL database in the browser. This enables:
- Persistent chat history across sessions
- Complex queries with proper relationships
- ACID compliance for data integrity
- Offline capability

## Files

### schema.ts
Defines the complete database schema with 6 tables and proper relationships.

**Tables:**
1. **chat_sessions** - Main chat session records
   - `id` (TEXT PRIMARY KEY)
   - `title` (TEXT NOT NULL)
   - `created_at` (INTEGER NOT NULL)
   - `project_name`, `project_type`, `project_description` (TEXT)
   - `is_active` (BOOLEAN DEFAULT 1) - Soft delete support

2. **project_technologies** - Junction table for technologies
   - `chat_session_id` (TEXT)
   - `technology` (TEXT)
   - Composite primary key

3. **messages** - Individual chat messages
   - `id` (TEXT PRIMARY KEY)
   - `chat_session_id` (TEXT NOT NULL)
   - `role` (TEXT CHECK - 'user' or 'assistant')
   - `content` (TEXT NOT NULL)
   - `timestamp` (INTEGER NOT NULL)

4. **relevant_files** - Files mentioned in responses
   - `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
   - `message_id` (TEXT NOT NULL)
   - `path` (TEXT NOT NULL)
   - `reason` (TEXT)
   - `file_type` (TEXT CHECK - multiple types)
   - `snippet` (TEXT)

5. **documentation_links** - External documentation
   - `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
   - `message_id` (TEXT NOT NULL)
   - `url` (TEXT NOT NULL)
   - `title` (TEXT NOT NULL)
   - `description` (TEXT)

6. **suggested_queries** - AI-suggested follow-ups
   - `id` (INTEGER PRIMARY KEY AUTOINCREMENT)
   - `message_id` (TEXT NOT NULL)
   - `query` (TEXT NOT NULL)

**Indexes** for performance:
- `idx_messages_chat_session_id`
- `idx_messages_timestamp`
- `idx_relevant_files_message_id`
- `idx_documentation_links_message_id`
- `idx_suggested_queries_message_id`
- `idx_project_technologies_chat_session_id`

### database.ts
Implements all database operations with TypeScript interfaces and error handling.

**Key Features:**

1. **Initialization (`initDB`)**
   - Loads SQLite WASM library
   - Attempts OPFS (Origin Private File System) for persistence
   - Falls back to in-memory database if OPFS unavailable
   - Creates all tables from schema
   - Returns singleton database instance

2. **Chat Session Operations**
   - `createChatSession`: Creates new session with project info
   - `getChatSessions`: Retrieves all active sessions with technologies
   - `deleteChatSession`: Soft deletes by setting `is_active = 0`

3. **Message Operations**
   - `createMessage`: Saves message with structured response parsing
   - `getMessagesForChatSession`: Loads messages with all related data
   - Handles JSON parsing of structured responses

4. **Type Safety**
   - TypeScript interfaces for all entities
   - Proper type conversions from SQL results
   - Null handling for optional fields

## Storage Strategy

### OPFS (Preferred)
- Uses Origin Private File System when available
- Provides true persistence across browser sessions
- File stored at `/react-llm.sqlite3`
- Automatic in modern browsers

### In-Memory Fallback
- Used when OPFS is not available
- Data persists only during page session
- Still provides full SQL functionality
- Logs warning to console

## Data Relationships

```
chat_sessions (1) ─┬─ (*) messages ─┬─ (*) relevant_files
                   │                 ├─ (*) documentation_links
                   │                 └─ (*) suggested_queries
                   └─ (*) project_technologies
```

All foreign keys use `ON DELETE CASCADE` for automatic cleanup.

## Performance Optimizations

1. **Batch Inserts**
   - Multiple values inserted in single SQL statement
   - Reduces round-trip overhead

2. **Indexed Columns**
   - Foreign keys indexed for JOIN performance
   - Timestamp indexed for sorting

3. **Prepared Statements**
   - Parameters bound to prevent SQL injection
   - Reusable query plans

## Error Handling

- All async operations wrapped in try-catch
- Specific error messages for debugging
- Graceful fallbacks (e.g., OPFS → memory)
- Console warnings for non-critical issues

## Usage Example

```typescript
// Initialize database
const db = await initDB();

// Create a chat session
await createChatSession('123', 'My Chat', {
  name: 'My Project',
  type: 'Web App',
  mainTechnologies: ['React', 'TypeScript'],
  description: 'A cool project'
});

// Save a message
await createMessage(
  '456',
  '123',
  'user',
  'Hello AI!',
  JSON.stringify(structuredResponse)
);

// Load messages
const messages = await getMessagesForChatSession('123');
```

## Debugging

1. **Browser DevTools**
   - Application tab → Storage → OPFS to see files
   - Console for initialization logs

2. **SQL Debugging**
   - Add console.log to exec callbacks
   - Use SELECT queries to inspect data

3. **Common Issues**
   - OPFS not available in some browsers
   - WASM file not found (check public directory)
   - Type mismatches in SQL results

## Future Improvements

1. **Migrations**
   - Version tracking for schema changes
   - Automated migration scripts

2. **Backup/Export**
   - Export chat history to JSON
   - Import from backup files

3. **Performance**
   - Query optimization
   - Pagination for large datasets
   - Vacuum operations

4. **Features**
   - Full-text search
   - Chat statistics
   - Data compression