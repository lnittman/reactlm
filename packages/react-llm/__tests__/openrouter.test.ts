/**
 * Unit tests for OpenRouter integration
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { OpenRouterClient } from '../src/llm/openrouter-client';
import { LLMHub } from '../src/llm/providers';

// Mock fetch globally
global.fetch = vi.fn();

const mockFetch = fetch as ReturnType<typeof vi.fn>;

describe('OpenRouterClient', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    // Mock localStorage for testing
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });
  });

  describe('Model Management', () => {
    it('should parse models correctly', async () => {
      const mockModelsResponse = {
        data: [
          {
            id: 'anthropic/claude-3-5-sonnet',
            name: 'Claude 3.5 Sonnet',
            context_length: 200000,
            pricing: {
              prompt: '0.000003',
              completion: '0.000015'
            }
          },
          {
            id: 'openai/gpt-4o',
            name: 'GPT-4o',
            context_length: 128000,
            pricing: {
              prompt: '0.000005',
              completion: '0.000015'
            }
          }
        ]
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockModelsResponse,
      } as Response);

      const client = new OpenRouterClient({
        apiKey: 'test-key'
      });

      // Wait for initialization
      await new Promise(resolve => {
        client.once('ready', resolve);
      });

      const models = client.getModels();
      
      expect(models).toHaveLength(2);
      expect(models[0]).toMatchObject({
        id: 'anthropic/claude-3-5-sonnet',
        name: 'Claude 3.5 Sonnet',
        provider: 'anthropic',
        contextLength: 200000,
        pricing: {
          prompt: 0.000003,
          completion: 0.000015
        }
      });
    });

    it('should cache models correctly', async () => {
      const mockModelsResponse = {
        data: [
          {
            id: 'anthropic/claude-3-5-sonnet',
            name: 'Claude 3.5 Sonnet',
            context_length: 200000,
            pricing: { prompt: '0.000003', completion: '0.000015' }
          }
        ]
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockModelsResponse,
      } as Response);

      const client = new OpenRouterClient({
        apiKey: 'test-key'
      });

      await new Promise(resolve => {
        client.once('ready', resolve);
      });

      // Check if models are cached
      const cached = localStorage.getItem('openrouter_models');
      expect(cached).toBeTruthy();
      
      const cachedData = JSON.parse(cached!);
      expect(cachedData.models).toHaveLength(1);
      expect(cachedData.timestamp).toBeCloseTo(Date.now(), -3); // Within 1 second
    });

    it('should load from cache when fetch fails', async () => {
      // Pre-populate cache
      const cachedModels = [
        {
          id: 'anthropic/claude-3-5-sonnet',
          name: 'Claude 3.5 Sonnet',
          provider: 'anthropic',
          contextLength: 200000,
          pricing: { prompt: 0.000003, completion: 0.000015 }
        }
      ];
      
      localStorage.setItem('openrouter_models', JSON.stringify({
        models: cachedModels,
        timestamp: Date.now()
      }));

      // Mock fetch to fail
      mockFetch.mockRejectedValueOnce(new Error('Network error'));

      const client = new OpenRouterClient({
        apiKey: 'test-key'
      });

      await new Promise(resolve => {
        client.once('ready', resolve);
      });

      const models = client.getModels();
      expect(models).toHaveLength(1);
      expect(models[0].id).toBe('anthropic/claude-3-5-sonnet');
    });
  });

  describe('Model Recommendations', () => {
    it('should recommend high-quality models', async () => {
      const mockModelsResponse = {
        data: [
          {
            id: 'anthropic/claude-3-5-sonnet',
            name: 'Claude 3.5 Sonnet',
            context_length: 200000,
            pricing: { prompt: '0.000003', completion: '0.000015' }
          },
          {
            id: 'openai/gpt-4o',
            name: 'GPT-4o',
            context_length: 128000,
            pricing: { prompt: '0.000005', completion: '0.000015' }
          },
          {
            id: 'meta-llama/llama-3-8b',
            name: 'Llama 3 8B',
            context_length: 8192,
            pricing: { prompt: '0.0000002', completion: '0.0000002' }
          },
          {
            id: 'random/small-model',
            name: 'Small Model',
            context_length: 2048,
            pricing: { prompt: '0.0000001', completion: '0.0000001' }
          }
        ]
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockModelsResponse,
      } as Response);

      const client = new OpenRouterClient({
        apiKey: 'test-key'
      });

      await new Promise(resolve => {
        client.once('ready', resolve);
      });

      const recommended = client.getRecommendedModels();
      
      // Should filter out models with small context windows
      expect(recommended.every(m => m.contextLength >= 8000)).toBe(true);
      
      // Should prioritize Claude and GPT models
      const hasClaudeOrGPT = recommended.some(m => 
        m.id.includes('claude-3-5-sonnet') || m.id.includes('gpt-4o')
      );
      expect(hasClaudeOrGPT).toBe(true);
    });
  });

  describe('Token Estimation', () => {
    it('should estimate tokens reasonably', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: [] }),
      } as Response);

      const client = new OpenRouterClient({
        apiKey: 'test-key'
      });

      await new Promise(resolve => {
        client.once('ready', resolve);
      });

      // Mock a model for cost estimation
      (client as any).models = [{
        id: 'test/model',
        name: 'Test Model',
        provider: 'test',
        contextLength: 4096,
        pricing: { prompt: 0.000001, completion: 0.000002 }
      }];

      const messages = [
        { role: 'user' as const, content: 'Hello, how are you?' },
        { role: 'assistant' as const, content: 'I am doing well, thank you for asking!' }
      ];

      const estimate = client.estimateCost(messages, 'test/model');
      
      expect(estimate.promptTokens).toBeGreaterThan(0);
      expect(estimate.completionTokens).toBeGreaterThan(0);
      expect(estimate.totalCost).toBeGreaterThan(0);
    });
  });
});

describe('LLMHub', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    // Mock localStorage for testing
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true
    });
  });

  it('should initialize with OpenRouter provider', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ data: [] }),
    } as Response);

    const hub = new LLMHub();
    
    await hub.initializeProvider('openrouter', 'test-key');
    
    expect(hub.isInitialized()).toBe(true);
    expect(hub.getAvailableProviders()).toContain('openrouter');
  });

  it('should set active model automatically', async () => {
    const mockModelsResponse = {
      data: [
        {
          id: 'anthropic/claude-3-5-sonnet',
          name: 'Claude 3.5 Sonnet',
          context_length: 200000,
          pricing: { prompt: '0.000003', completion: '0.000015' }
        }
      ]
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockModelsResponse,
    } as Response);

    const hub = new LLMHub();
    await hub.initializeProvider('openrouter', 'test-key');
    
    expect(hub.getActiveModel()).toBe('anthropic/claude-3-5-sonnet');
  });

  it('should handle provider initialization errors gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('API Error'));

    const hub = new LLMHub();
    
    await expect(hub.initializeProvider('openrouter', 'bad-key'))
      .rejects.toThrow();
    
    expect(hub.isInitialized()).toBe(false);
  });
});