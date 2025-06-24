import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Database } from './database'

// Mock SQLite
const mockStatement = {
  get: vi.fn(),
  all: vi.fn(),
  run: vi.fn(),
  finalize: vi.fn()
}

const mockDB = {
  run: vi.fn(),
  exec: vi.fn(),
  prepare: vi.fn(() => mockStatement),
  close: vi.fn()
}

// Mock SQL.js
vi.mock('sql.js', () => ({
  default: vi.fn().mockResolvedValue({
    Database: vi.fn(() => mockDB)
  })
}))

// Mock OPFS
const mockOPFS = {
  getFileHandle: vi.fn(),
  getDirectoryHandle: vi.fn(),
  createWritable: vi.fn(),
  write: vi.fn(),
  close: vi.fn()
}

Object.defineProperty(navigator, 'storage', {
  value: {
    getDirectory: vi.fn().mockResolvedValue(mockOPFS)
  },
  configurable: true
})

describe('Database', () => {
  let database: Database

  beforeEach(async () => {
    vi.clearAllMocks()
    database = new Database()
    await database.initialize()
  })

  afterEach(async () => {
    await database.close()
    vi.restoreAllMocks()
  })

  describe('initialization', () => {
    it('should initialize database with schema', async () => {
      expect(mockDB.exec).toHaveBeenCalledWith(expect.stringContaining('CREATE TABLE'))
      expect(mockDB.exec).toHaveBeenCalledWith(expect.stringContaining('chat_sessions'))
      expect(mockDB.exec).toHaveBeenCalledWith(expect.stringContaining('messages'))
    })

    it('should handle initialization errors gracefully', async () => {
      mockDB.exec.mockImplementationOnce(() => {
        throw new Error('Schema creation failed')
      })

      const failingDB = new Database()
      await expect(failingDB.initialize()).rejects.toThrow('Schema creation failed')
    })
  })

  describe('chat session management', () => {
    it('should create a new chat session', async () => {
      const sessionData = {
        title: 'Test Session',
        project_name: 'Test Project',
        project_type: 'react',
        project_description: 'A test project'
      }

      mockStatement.run.mockReturnValueOnce({ lastInsertRowid: 1 })

      const sessionId = await database.createChatSession(sessionData)

      expect(mockDB.prepare).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO chat_sessions'))
      expect(mockStatement.run).toHaveBeenCalledWith(
        sessionData.title,
        expect.any(String), // timestamp
        sessionData.project_name,
        sessionData.project_type,
        sessionData.project_description,
        1 // is_active
      )
      expect(sessionId).toBe(1)
    })

    it('should get all chat sessions', async () => {
      const mockSessions = [
        {
          id: 1,
          title: 'Session 1',
          created_at: '2024-01-01T00:00:00Z',
          project_name: 'Project 1',
          is_active: 1
        },
        {
          id: 2,
          title: 'Session 2',
          created_at: '2024-01-02T00:00:00Z',
          project_name: 'Project 2',
          is_active: 0
        }
      ]

      mockStatement.all.mockReturnValueOnce(mockSessions)

      const sessions = await database.getChatSessions()

      expect(mockDB.prepare).toHaveBeenCalledWith(expect.stringContaining('SELECT * FROM chat_sessions'))
      expect(sessions).toEqual(mockSessions)
    })

    it('should get active chat session', async () => {
      const mockSession = {
        id: 1,
        title: 'Active Session',
        is_active: 1
      }

      mockStatement.get.mockReturnValueOnce(mockSession)

      const session = await database.getActiveChatSession()

      expect(mockDB.prepare).toHaveBeenCalledWith(expect.stringContaining('WHERE is_active = 1'))
      expect(session).toEqual(mockSession)
    })

    it('should set active chat session', async () => {
      await database.setActiveChatSession(5)

      expect(mockDB.prepare).toHaveBeenCalledWith(expect.stringContaining('UPDATE chat_sessions SET is_active = 0'))
      expect(mockDB.prepare).toHaveBeenCalledWith(expect.stringContaining('UPDATE chat_sessions SET is_active = 1 WHERE id = ?'))
      expect(mockStatement.run).toHaveBeenCalledWith(5)
    })

    it('should delete chat session and cascade delete related data', async () => {
      await database.deleteChatSession(3)

      expect(mockDB.prepare).toHaveBeenCalledWith(expect.stringContaining('DELETE FROM chat_sessions WHERE id = ?'))
      expect(mockStatement.run).toHaveBeenCalledWith(3)
    })
  })

  describe('message management', () => {
    it('should add a message to chat session', async () => {
      const messageData = {
        chat_session_id: 1,
        role: 'user' as const,
        content: 'Hello, world!'
      }

      mockStatement.run.mockReturnValueOnce({ lastInsertRowid: 10 })

      const messageId = await database.addMessage(messageData)

      expect(mockDB.prepare).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO messages'))
      expect(mockStatement.run).toHaveBeenCalledWith(
        messageData.chat_session_id,
        messageData.role,
        messageData.content,
        expect.any(String) // timestamp
      )
      expect(messageId).toBe(10)
    })

    it('should get messages for a chat session', async () => {
      const mockMessages = [
        {
          id: 1,
          role: 'user',
          content: 'Hello',
          timestamp: '2024-01-01T00:00:00Z'
        },
        {
          id: 2,
          role: 'assistant',
          content: 'Hi there!',
          timestamp: '2024-01-01T00:01:00Z'
        }
      ]

      mockStatement.all.mockReturnValueOnce(mockMessages)

      const messages = await database.getMessages(1)

      expect(mockDB.prepare).toHaveBeenCalledWith(expect.stringContaining('SELECT * FROM messages WHERE chat_session_id = ?'))
      expect(mockStatement.run).toHaveBeenCalledWith(1)
      expect(messages).toEqual(mockMessages)
    })
  })

  describe('structured response data', () => {
    it('should add relevant files for a message', async () => {
      const files = [
        {
          path: 'src/components/Button.tsx',
          reason: 'Component being discussed',
          file_type: 'component',
          snippet: 'export const Button = () => <button>Click</button>'
        }
      ]

      await database.addRelevantFiles(1, files)

      expect(mockDB.prepare).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO relevant_files'))
      expect(mockStatement.run).toHaveBeenCalledWith(
        1,
        files[0].path,
        files[0].reason,
        files[0].file_type,
        files[0].snippet
      )
    })

    it('should add documentation links for a message', async () => {
      const docs = [
        {
          url: 'https://react.dev/reference/react/useState',
          title: 'useState – React',
          description: 'React Hook for state management'
        }
      ]

      await database.addDocumentationLinks(1, docs)

      expect(mockDB.prepare).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO documentation_links'))
      expect(mockStatement.run).toHaveBeenCalledWith(
        1,
        docs[0].url,
        docs[0].title,
        docs[0].description
      )
    })

    it('should add suggested queries for a message', async () => {
      const suggestions = [
        'How can I style this button?',
        'Can you add click handlers?'
      ]

      await database.addSuggestedQueries(1, suggestions)

      expect(mockDB.prepare).toHaveBeenCalledTimes(suggestions.length)
      expect(mockStatement.run).toHaveBeenCalledWith(1, suggestions[0])
      expect(mockStatement.run).toHaveBeenCalledWith(1, suggestions[1])
    })

    it('should get structured response data for a message', async () => {
      const mockFiles = [{ path: 'test.tsx', reason: 'test' }]
      const mockDocs = [{ url: 'test.com', title: 'Test' }]
      const mockSuggestions = [{ query: 'Test query' }]

      mockStatement.all
        .mockReturnValueOnce(mockFiles)
        .mockReturnValueOnce(mockDocs)
        .mockReturnValueOnce(mockSuggestions)

      const data = await database.getStructuredResponseData(1)

      expect(data).toEqual({
        files: mockFiles,
        docs: mockDocs,
        suggestions: mockSuggestions.map(s => s.query)
      })
    })
  })

  describe('OPFS persistence', () => {
    it('should save database to OPFS', async () => {
      const mockWritable = {
        write: vi.fn(),
        close: vi.fn()
      }

      mockOPFS.getFileHandle.mockResolvedValueOnce({
        createWritable: vi.fn().mockResolvedValue(mockWritable)
      })

      mockDB.export = vi.fn().mockReturnValue(new Uint8Array([1, 2, 3, 4]))

      await database.saveToOPFS()

      expect(mockOPFS.getFileHandle).toHaveBeenCalledWith('react-llm.db', { create: true })
      expect(mockWritable.write).toHaveBeenCalledWith(expect.any(Uint8Array))
      expect(mockWritable.close).toHaveBeenCalled()
    })

    it('should load database from OPFS', async () => {
      const mockFileData = new Uint8Array([1, 2, 3, 4])
      const mockFile = {
        arrayBuffer: vi.fn().mockResolvedValue(mockFileData)
      }

      mockOPFS.getFileHandle.mockResolvedValueOnce({
        getFile: vi.fn().mockResolvedValue(mockFile)
      })

      await database.loadFromOPFS()

      expect(mockOPFS.getFileHandle).toHaveBeenCalledWith('react-llm.db')
      expect(mockFile.arrayBuffer).toHaveBeenCalled()
    })

    it('should handle OPFS not available gracefully', async () => {
      // Mock OPFS as unavailable
      Object.defineProperty(navigator, 'storage', {
        value: undefined,
        configurable: true
      })

      const fallbackDB = new Database()
      await expect(fallbackDB.initialize()).resolves.not.toThrow()
    })
  })

  describe('error handling', () => {
    it('should handle SQL errors gracefully', async () => {
      mockStatement.run.mockImplementationOnce(() => {
        throw new Error('SQL constraint violation')
      })

      await expect(database.createChatSession({
        title: 'Test',
        project_name: 'Test',
        project_type: 'react',
        project_description: 'Test'
      })).rejects.toThrow('SQL constraint violation')
    })

    it('should handle database corruption', async () => {
      mockDB.exec.mockImplementationOnce(() => {
        throw new Error('database disk image is malformed')
      })

      const corruptDB = new Database()
      await expect(corruptDB.initialize()).rejects.toThrow('database disk image is malformed')
    })
  })
})