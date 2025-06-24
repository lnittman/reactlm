import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { OpenRouterClient } from './openrouter-client'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
})

describe('OpenRouterClient', () => {
  let client: OpenRouterClient
  
  beforeEach(() => {
    // Mock successful initialization
    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        data: [
          {
            id: 'openai/gpt-4o',
            name: 'GPT-4o',
            provider: 'OpenAI',
            context_length: 128000,
            pricing: { prompt: '0.000005', completion: '0.000015' }
          }
        ]
      })
    })
    
    client = new OpenRouterClient({
      apiKey: 'test-api-key',
      siteUrl: 'https://test.com',
      siteName: 'test-app'
    })
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('getAvailableModels', () => {
    it('should fetch and return available models', async () => {
      const mockModels = {
        data: [
          {
            id: 'openai/gpt-4o',
            name: 'GPT-4o',
            context_length: 128000,
            pricing: { prompt: '0.000005', completion: '0.000015' }
          },
          {
            id: 'anthropic/claude-3-opus',
            name: 'Claude 3 Opus',
            context_length: 200000,
            pricing: { prompt: '0.000015', completion: '0.000075' }
          }
        ]
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockModels)
      })

      const models = await client.getAvailableModels()

      expect(mockFetch).toHaveBeenCalledWith(
        'https://openrouter.ai/api/v1/models',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-api-key',
            'HTTP-Referer': 'https://react-llm.dev',
            'X-Title': 'test-app'
          })
        })
      )

      expect(models).toHaveLength(2)
      expect(models[0]).toEqual(expect.objectContaining({
        id: 'openai/gpt-4o',
        name: 'GPT-4o'
      }))
    })

    it('should handle API errors gracefully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: 'Unauthorized'
      })

      await expect(client.getAvailableModels()).rejects.toThrow('Failed to fetch models: 401 Unauthorized')
    })

    it('should filter models by capabilities', async () => {
      const mockModels = {
        data: [
          { id: 'openai/gpt-4o', name: 'GPT-4o', context_length: 128000 },
          { id: 'openai/gpt-3.5-turbo', name: 'GPT-3.5 Turbo', context_length: 4096 },
          { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus', context_length: 200000 }
        ]
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockModels)
      })

      const models = await client.getAvailableModels({ minContextLength: 100000 })

      expect(models).toHaveLength(2)
      expect(models.every(model => model.context_length >= 100000)).toBe(true)
    })
  })

  describe('chat', () => {
    it('should send chat messages and return streaming response', async () => {
      const mockResponse = {
        id: 'chatcmpl-test',
        choices: [{
          delta: { content: 'Hello world' },
          finish_reason: null
        }]
      }

      // Mock streaming response
      const mockStream = new ReadableStream({
        start(controller) {
          controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(mockResponse)}\n\n`))
          controller.enqueue(new TextEncoder().encode('data: [DONE]\n\n'))
          controller.close()
        }
      })

      mockFetch.mockResolvedValueOnce({
        ok: true,
        body: mockStream
      })

      const messages = [{ role: 'user' as const, content: 'Hello' }]
      const stream = client.chat(messages, { model: 'openai/gpt-4o' })

      const chunks = []
      for await (const chunk of stream) {
        chunks.push(chunk)
      }

      expect(mockFetch).toHaveBeenCalledWith(
        'https://openrouter.ai/api/v1/chat/completions',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-api-key',
            'Content-Type': 'application/json'
          }),
          body: expect.stringContaining('"model":"openai/gpt-4o"')
        })
      )

      expect(chunks).toContain('Hello world')
    })

    it('should handle non-streaming chat completions', async () => {
      const mockResponse = {
        id: 'chatcmpl-test',
        choices: [{
          message: { content: 'Hello world' },
          finish_reason: 'stop'
        }]
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const messages = [{ role: 'user' as const, content: 'Hello' }]
      const response = await client.complete(messages, { model: 'openai/gpt-4o' })

      expect(response).toBe('Hello world')
    })

    it('should include context in chat messages', async () => {
      const mockResponse = {
        choices: [{ message: { content: 'Response with context' } }]
      }

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      })

      const messages = [{ role: 'user' as const, content: 'Hello' }]
      const context = {
        component: {
          name: 'Button',
          props: { onClick: 'function' },
          source: 'export const Button = () => <button>Click</button>'
        },
        project: {
          name: 'test-project',
          type: 'react',
          technologies: ['react', 'typescript']
        }
      }

      await client.complete(messages, { model: 'openai/gpt-4o', context })

      const callBody = JSON.parse(mockFetch.mock.calls[0][1].body)
      expect(callBody.messages).toHaveLength(2) // user message + context
      expect(callBody.messages[0].content).toContain('Component: Button')
    })
  })

  describe('error handling', () => {
    it('should handle network errors', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      await expect(client.getAvailableModels()).rejects.toThrow('Network error')
    })

    it('should handle malformed API responses', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ invalid: 'response' })
      })

      await expect(client.getAvailableModels()).rejects.toThrow()
    })

    it('should handle rate limiting', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        statusText: 'Too Many Requests',
        headers: new Headers({ 'Retry-After': '60' })
      })

      await expect(client.getAvailableModels()).rejects.toThrow('Failed to fetch models: 429 Too Many Requests')
    })
  })

  describe('configuration', () => {
    it('should use custom base URL', async () => {
      const customClient = new OpenRouterClient({
        apiKey: 'test-key',
        baseURL: 'https://custom-api.example.com'
      })

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: [] })
      })

      await customClient.getAvailableModels()

      expect(mockFetch).toHaveBeenCalledWith(
        'https://custom-api.example.com/models',
        expect.any(Object)
      )
    })

    it('should include custom headers', async () => {
      const clientWithHeaders = new OpenRouterClient({
        apiKey: 'test-key',
        defaultHeaders: {
          'X-Custom-Header': 'custom-value'
        }
      })

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ data: [] })
      })

      await clientWithHeaders.getAvailableModels()

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Custom-Header': 'custom-value'
          })
        })
      )
    })
  })
})