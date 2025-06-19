import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock global fetch
global.fetch = vi.fn()

// Mock window.ReactLLM
Object.defineProperty(window, 'ReactLLM', {
  value: {
    init: vi.fn(),
    destroy: vi.fn(),
    chat: vi.fn()
  },
  writable: true
})

// Mock browser APIs
Object.defineProperty(window, 'crypto', {
  value: {
    randomUUID: () => 'test-uuid-' + Math.random().toString(36).substring(7)
  }
})

// Mock File System Access API
Object.defineProperty(window, 'showOpenFilePicker', {
  value: vi.fn().mockResolvedValue([])
})

Object.defineProperty(window, 'showSaveFilePicker', {
  value: vi.fn().mockResolvedValue({
    createWritable: vi.fn().mockResolvedValue({
      write: vi.fn(),
      close: vi.fn()
    })
  })
})

// Mock OPFS
Object.defineProperty(navigator, 'storage', {
  value: {
    getDirectory: vi.fn().mockResolvedValue({
      getFileHandle: vi.fn(),
      getDirectoryHandle: vi.fn()
    })
  }
})

// Mock SQLite WASM
vi.mock('sql.js', () => ({
  default: vi.fn().mockResolvedValue({
    Database: vi.fn().mockImplementation(() => ({
      run: vi.fn(),
      exec: vi.fn(),
      prepare: vi.fn(() => ({
        get: vi.fn(),
        all: vi.fn(),
        run: vi.fn(),
        finalize: vi.fn()
      })),
      close: vi.fn()
    }))
  })
}))

// Mock OpenRouter API
vi.mock('packages/react-llm/src/llm/openrouter', () => ({
  OpenRouterClient: vi.fn().mockImplementation(() => ({
    getAvailableModels: vi.fn().mockResolvedValue([
      { id: 'openai/gpt-4o', name: 'GPT-4o' },
      { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus' }
    ]),
    chat: vi.fn().mockImplementation(async function* () {
      yield 'Mock AI response'
    }),
    complete: vi.fn().mockResolvedValue('Mock completion')
  }))
}))

// Mock Gemini API
vi.mock('packages/react-llm/src/gemini/gemini', () => ({
  GeminiClient: vi.fn().mockImplementation(() => ({
    generateContent: vi.fn().mockResolvedValue({
      response: {
        text: () => 'Mock Gemini response'
      }
    }))
  }))
}))

// Clean up after each test
afterEach(() => {
  vi.clearAllMocks()
})