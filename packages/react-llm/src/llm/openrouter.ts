import { EventEmitter } from 'events';

export interface OpenRouterConfig {
  apiKey: string;
  siteUrl?: string;
  siteName?: string;
}

export interface Model {
  id: string;
  name: string;
  provider: string;
  contextLength: number;
  pricing: {
    prompt: number;
    completion: number;
  };
  architectures?: {
    instruct: string;
    modality: string;
  };
  top_provider?: {
    max_completion_tokens: number;
    is_moderated: boolean;
  };
}

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  siteUrl?: string;
  siteName?: string;
}

export interface CostEstimate {
  promptTokens: number;
  completionTokens: number;
  totalCost: number;
}

/**
 * Enhanced OpenRouter client with dynamic model fetching and improved token counting
 */
export class OpenRouterClient extends EventEmitter {
  private apiKey: string;
  private baseUrl = 'https://openrouter.ai/api/v1';
  private models: Model[] = [];
  private siteUrl?: string;
  private siteName?: string;
  
  constructor(config: OpenRouterConfig) {
    super();
    this.apiKey = config.apiKey;
    this.siteUrl = config.siteUrl;
    this.siteName = config.siteName;
    this.fetchModels();
  }
  
  async fetchModels(): Promise<Model[]> {
    try {
      const response = await fetch(`${this.baseUrl}/models`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      this.models = data.data.map(this.parseModel);
      
      // Cache models with timestamp
      localStorage.setItem('openrouter_models', JSON.stringify({
        models: this.models,
        timestamp: Date.now()
      }));
      
      this.emit('modelsUpdated', this.models);
      return this.models;
    } catch (error) {
      console.error('Failed to fetch models from OpenRouter:', error);
      // Try to load from cache if fetch fails
      const cached = localStorage.getItem('openrouter_models');
      if (cached) {
        const { models } = JSON.parse(cached);
        this.models = models;
        return models;
      }
      throw error;
    }
  }
  
  private parseModel(model: any): Model {
    return {
      id: model.id,
      name: model.name || model.id,
      provider: model.id.split('/')[0] || 'unknown',
      contextLength: model.context_length || 4096,
      pricing: {
        prompt: parseFloat(model.pricing?.prompt || '0'),
        completion: parseFloat(model.pricing?.completion || '0')
      },
      architectures: model.architecture,
      top_provider: model.top_provider
    };
  }
  
  async getLatestModels(): Promise<Model[]> {
    // Check cache first (refresh every hour)
    const cached = localStorage.getItem('openrouter_models');
    if (cached) {
      const { models, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < 3600000) { // 1 hour
        this.models = models;
        return models;
      }
    }
    
    // Fetch fresh model list
    return this.fetchModels();
  }
  
  async *chat(
    messages: Message[], 
    options: ChatOptions = {}
  ): AsyncGenerator<string> {
    if (!options.model) {
      throw new Error('Model must be specified');
    }

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };

    // Add optional headers for OpenRouter leaderboard
    if (options.siteUrl || this.siteUrl) {
      headers['HTTP-Referer'] = options.siteUrl || this.siteUrl!;
    }
    if (options.siteName || this.siteName) {
      headers['X-Title'] = options.siteName || this.siteName!;
    }

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: options.model,
        messages,
        stream: true,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 4096,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
    }

    const reader = response.body!.getReader();
    const decoder = new TextDecoder();
    
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim());
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                yield content;
              }
            } catch (e) {
              console.error('Parse error:', e);
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }
  
  async completeChat(
    messages: Message[], 
    options: ChatOptions = {}
  ): Promise<string> {
    if (!options.model) {
      throw new Error('Model must be specified');
    }

    const headers: Record<string, string> = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };

    // Add optional headers for OpenRouter leaderboard
    if (options.siteUrl || this.siteUrl) {
      headers['HTTP-Referer'] = options.siteUrl || this.siteUrl!;
    }
    if (options.siteName || this.siteName) {
      headers['X-Title'] = options.siteName || this.siteName!;
    }

    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        model: options.model,
        messages,
        stream: false,
        temperature: options.temperature || 0.7,
        max_tokens: options.maxTokens || 4096,
        usage: {
          include: true
        }
      }),
    });
    
    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  }
  
  estimateCost(messages: Message[], model: string): CostEstimate {
    const modelInfo = this.models.find(m => m.id === model);
    if (!modelInfo) {
      throw new Error(`Model ${model} not found`);
    }
    
    const tokens = this.countTokens(messages);
    return {
      promptTokens: tokens.prompt,
      completionTokens: tokens.completion,
      totalCost: (
        tokens.prompt * modelInfo.pricing.prompt +
        tokens.completion * modelInfo.pricing.completion
      ) / 1_000_000 // Convert to dollars
    };
  }
  
  /**
   * Enhanced token counting with more accurate estimation
   */
  private countTokens(messages: Message[]): { prompt: number; completion: number } {
    // More sophisticated token estimation
    const text = messages.map(m => m.content).join(' ');
    
    // Better approximation: ~3.5 characters per token for English
    // Account for JSON structure overhead
    const baseTokens = Math.ceil(text.length / 3.5);
    const structureOverhead = messages.length * 4; // ~4 tokens per message for role/structure
    
    const promptTokens = baseTokens + structureOverhead;
    
    // Estimate completion tokens based on typical response length (30% of prompt)
    const completionTokens = Math.ceil(promptTokens * 0.3);
    
    return {
      prompt: promptTokens,
      completion: completionTokens
    };
  }
  
  getModels(): Model[] {
    return this.models;
  }
  
  getModel(id: string): Model | undefined {
    return this.models.find(m => m.id === id);
  }
  
  /**
   * Get models filtered by provider
   */
  getModelsByProvider(provider: string): Model[] {
    return this.models.filter(m => m.provider === provider);
  }
  
  /**
   * Get recommended models based on performance and cost
   */
  getRecommendedModels(): Model[] {
    // Filter and sort models by quality metrics
    return this.models
      .filter(m => m.contextLength >= 8000) // Minimum context window
      .sort((a, b) => {
        // Custom scoring algorithm
        const scoreA = this.calculateModelScore(a);
        const scoreB = this.calculateModelScore(b);
        return scoreB - scoreA;
      })
      .slice(0, 5); // Top 5 models
  }
  
  private calculateModelScore(model: Model): number {
    let score = model.contextLength / 1000; // Base score from context length
    
    // Bonus for known high-quality models
    if (model.id.includes('claude-3-5-sonnet')) score += 100;
    else if (model.id.includes('gpt-4o')) score += 90;
    else if (model.id.includes('gemini-2.0-flash')) score += 85;
    else if (model.id.includes('claude-3-opus')) score += 80;
    else if (model.id.includes('gpt-4-turbo')) score += 75;
    
    // Penalty for very expensive models (unless they're premium)
    if (model.pricing.prompt > 0.00005 && !model.id.includes('opus')) {
      score -= 20;
    }
    
    return score;
  }
}