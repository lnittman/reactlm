import { vi } from 'vitest'
import type { Mock } from 'vitest'

// OpenRouter mock
export const mockOpenRouterClient = {
  getAvailableModels: vi.fn().mockResolvedValue([
    {
      id: 'openai/gpt-4o',
      name: 'GPT-4o',
      context_length: 128000,
      pricing: { prompt: '0.000005', completion: '0.000015' },
      per_request_limits: null
    },
    {
      id: 'anthropic/claude-3-opus',
      name: 'Claude 3 Opus',
      context_length: 200000,
      pricing: { prompt: '0.000015', completion: '0.000075' },
      per_request_limits: null
    },
    {
      id: 'google/gemini-2.0-flash-exp',
      name: 'Gemini 2.0 Flash Experimental',
      context_length: 1000000,
      pricing: { prompt: '0.000000375', completion: '0.0000015' },
      per_request_limits: null
    }
  ]),

  chat: vi.fn().mockImplementation(async function* (messages: any[]) {
    const responses = [
      'I understand you want to modify this component.',
      'Here are the suggested changes:',
      '```typescript\nexport const Button = ({ onClick }) => {\n  return (\n    <button onClick={onClick} className="btn-primary">\n      Click me\n    </button>\n  )\n}\n```',
      'This adds proper styling and click handling to your button component.'
    ]
    
    for (const response of responses) {
      yield response
      await new Promise(resolve => setTimeout(resolve, 10))
    }
  }),

  complete: vi.fn().mockResolvedValue('Mock completion response'),
  
  embed: vi.fn().mockResolvedValue([0.1, 0.2, 0.3, 0.4, 0.5])
}

// Gemini mock
export const mockGeminiClient = {
  generateContent: vi.fn().mockResolvedValue({
    response: {
      text: () => 'Mock Gemini response with structured content:\n\n**Files:**\nsrc/components/Button.tsx - Updated button component\n\n**Documentation:**\nhttps://react.dev/reference/react/useState - React useState hook\n\n**Suggestions:**\n- Add prop validation\n- Consider accessibility features\n\n**Technologies:**\nreact, typescript'
    }
  }),

  generateContentStream: vi.fn().mockImplementation(async function* () {
    const chunks = [
      { text: () => 'Mock ' },
      { text: () => 'streaming ' },
      { text: () => 'response ' },
      { text: () => 'from Gemini' }
    ]
    
    for (const chunk of chunks) {
      yield { response: chunk }
      await new Promise(resolve => setTimeout(resolve, 10))
    }
  })
}

// Provider factory
export const createMockProvider = (type: 'openrouter' | 'gemini' | 'openai' | 'anthropic') => {
  switch (type) {
    case 'openrouter':
      return mockOpenRouterClient
    case 'gemini':
      return mockGeminiClient
    case 'openai':
      return {
        chat: {
          completions: {
            create: vi.fn().mockResolvedValue({
              choices: [{
                message: { content: 'Mock OpenAI response' }
              }]
            })
          }
        }
      }
    case 'anthropic':
      return {
        messages: {
          create: vi.fn().mockResolvedValue({
            content: [{ text: 'Mock Anthropic response' }]
          })
        }
      }
    default:
      throw new Error(`Unknown provider type: ${type}`)
  }
}

// Mock API responses
export const mockApiResponses = {
  models: {
    data: [
      {
        id: 'openai/gpt-4o',
        name: 'GPT-4o',
        created: Date.now(),
        context_length: 128000
      },
      {
        id: 'anthropic/claude-3-opus',
        name: 'Claude 3 Opus', 
        created: Date.now(),
        context_length: 200000
      }
    ]
  },
  
  chat: {
    id: 'chatcmpl-test',
    object: 'chat.completion',
    created: Date.now(),
    model: 'openai/gpt-4o',
    choices: [{
      index: 0,
      message: {
        role: 'assistant',
        content: 'Mock chat completion response'
      },
      finish_reason: 'stop'
    }],
    usage: {
      prompt_tokens: 50,
      completion_tokens: 25,
      total_tokens: 75
    }
  }
}

// Network mocks
export const mockFetch = (responses: Record<string, any> = {}) => {
  return vi.fn().mockImplementation((url: string, options?: RequestInit) => {
    // OpenRouter API
    if (url.includes('openrouter.ai/api/v1/models')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockApiResponses.models)
      })
    }
    
    if (url.includes('openrouter.ai/api/v1/chat/completions')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockApiResponses.chat)
      })
    }
    
    // Custom responses
    for (const [pattern, response] of Object.entries(responses)) {
      if (url.includes(pattern)) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(response)
        })
      }
    }
    
    // Default response
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ success: true, data: null })
    })
  })
}

// Reset all mocks
export const resetLLMMocks = () => {
  vi.clearAllMocks()
  mockOpenRouterClient.getAvailableModels.mockResolvedValue([])
  mockOpenRouterClient.chat.mockImplementation(async function* () {
    yield 'Reset mock response'
  })
  mockGeminiClient.generateContent.mockResolvedValue({
    response: { text: () => 'Reset mock response' }
  })
}