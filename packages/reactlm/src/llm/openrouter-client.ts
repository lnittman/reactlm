import { EventEmitter } from '../utils/event-emitter';

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
  description?: string;
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

export interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
}

/**
 * Production-ready OpenRouter client with comprehensive error handling and model management
 */
export class OpenRouterClient extends EventEmitter {
  private apiKey: string;
  private baseUrl = 'https://openrouter.ai/api/v1';
  private models: Model[] = [];
  private siteUrl?: string;
  private siteName?: string;
  private isInitialized = false;
  
  constructor(config: OpenRouterConfig) {
    super();
    this.apiKey = config.apiKey;
    this.siteUrl = config.siteUrl;
    this.siteName = config.siteName;
    this.initialize();
  }
  
  private async initialize() {
    try {
      await this.fetchModels();
      this.isInitialized = true;
      this.emit('ready');
    } catch (error) {
      console.error('Failed to initialize OpenRouter client:', error);
      // Try to load from cache as fallback
      const cached = localStorage.getItem('openrouter_models');
      if (cached) {
        try {
          const { models } = JSON.parse(cached);
          this.models = models;
          this.isInitialized = true;
          this.emit('ready');
        } catch (parseError) {
          console.error('Failed to load cached models:', parseError);
          this.emit('error', error);
        }
      } else {
        this.emit('error', error);
      }
    }
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
      this.models = data.data?.map(this.parseModel) || [];
      
      // Cache models with timestamp
      localStorage.setItem('openrouter_models', JSON.stringify({
        models: this.models,
        timestamp: Date.now()
      }));
      
      this.emit('modelsUpdated', this.models);
      return this.models;
    } catch (error) {
      console.error('Failed to fetch models from OpenRouter:', error);
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
      try {
        const { models, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < 3600000) { // 1 hour
          this.models = models;
          return models;
        }
      } catch (e) {
        console.warn('Invalid cached models data:', e);
      }
    }
    
    // Fetch fresh model list
    return this.fetchModels();
  }
  
  async *chat(
    messages: Message[], 
    options: ChatOptions = {}
  ): AsyncGenerator<string, Usage | undefined> {
    if (!this.isInitialized) {
      throw new Error('OpenRouter client not initialized. Please wait for initialization.');
    }
    
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
        stream_options: {
          include_usage: true
        }
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    if (!response.body) {
      throw new Error('No response body received');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let usage: Usage | undefined;
    
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(line => line.trim());
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            
            try {
              const parsed = JSON.parse(data);
              
              // Check for usage information
              if (parsed.usage) {
                usage = parsed.usage;
              }
              
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) {
                yield content;
              }
            } catch (e) {
              console.warn('Failed to parse streaming chunk:', e, 'Data:', data);
            }
          }
        }
      }
      
      return usage;
    } finally {
      reader.releaseLock();
    }
  }
  
  async completeChat(
    messages: Message[], 
    options: ChatOptions = {}
  ): Promise<{ content: string; usage?: Usage }> {
    if (!this.isInitialized) {
      throw new Error('OpenRouter client not initialized. Please wait for initialization.');
    }
    
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
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0].message.content,
      usage: data.usage
    };
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
      .slice(0, 8); // Top 8 models
  }
  
  private calculateModelScore(model: Model): number {
    let score = model.contextLength / 1000; // Base score from context length
    
    // Bonus for known high-quality models
    if (model.id.includes('claude-3-5-sonnet')) score += 100;
    else if (model.id.includes('gpt-4o')) score += 90;
    else if (model.id.includes('gemini-2.0-flash')) score += 85;
    else if (model.id.includes('claude-3-opus')) score += 80;
    else if (model.id.includes('gpt-4-turbo')) score += 75;
    else if (model.id.includes('llama-3')) score += 70;
    
    // Penalty for very expensive models (unless they're premium)
    if (model.pricing.prompt > 0.00005 && !model.id.includes('opus')) {
      score -= 20;
    }
    
    return score;
  }
  
  /**
   * Check if the client is ready to make requests
   */
  isReady(): boolean {
    return this.isInitialized;
  }
  
  /**
   * Get available providers from current models
   */
  getAvailableProviders(): string[] {
    const providers = new Set(this.models.map(m => m.provider));
    return Array.from(providers).sort();
  }
}