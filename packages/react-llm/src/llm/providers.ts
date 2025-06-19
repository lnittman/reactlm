import { OpenRouterClient, Model, Message, ChatOptions } from './openrouter-client';

export interface LLMProvider {
  id: string;
  name: string;
  models: string[];
  supportsStreaming: boolean;
  requiresApiKey: boolean;
}

export interface ComponentContext {
  id: string;
  name: string;
  props: any;
  state: any;
  hooks: any[];
  parent?: ComponentContext;
  children: ComponentContext[];
  sourceCode?: string;
  language?: string;
}

/**
 * Enhanced LLM Hub with multi-provider support and smart model management
 */
export class LLMHub {
  private providers = new Map<string, LLMProvider>();
  private clients = new Map<string, OpenRouterClient>();
  private activeProvider = 'openrouter';
  private activeModel: string | null = null;
  private modelsByProvider: Record<string, Model[]> = {};
  
  constructor() {
    this.registerProviders();
  }
  
  private async registerProviders() {
    // OpenRouter provides access to all models
    this.providers.set('openrouter', {
      id: 'openrouter',
      name: 'OpenRouter (All Providers)',
      models: [],
      supportsStreaming: true,
      requiresApiKey: true,
    });
  }
  
  async initializeProvider(providerId: string, apiKey: string, options?: { siteUrl?: string; siteName?: string }) {
    if (providerId === 'openrouter') {
      const client = new OpenRouterClient({
        apiKey,
        siteUrl: options?.siteUrl || window.location.href,
        siteName: options?.siteName || document.title
      });
      
      this.clients.set(providerId, client);
      
      // Wait for client to be ready
      if (!client.isReady()) {
        await new Promise((resolve, reject) => {
          client.once('ready', resolve);
          client.once('error', reject);
          
          // Add timeout
          setTimeout(() => {
            reject(new Error('OpenRouter client initialization timeout'));
          }, 10000);
        });
      }
      
      try {
        // Fetch latest models
        const models = await client.getLatestModels();
        
        // Update provider with model list
        const provider = this.providers.get('openrouter')!;
        provider.models = models.map(m => m.id);
        
        // Group models by provider for easy filtering
        this.modelsByProvider = models.reduce((acc, model) => {
          const provider = model.id.split('/')[0];
          if (!acc[provider]) acc[provider] = [];
          acc[provider].push(model);
          return acc;
        }, {} as Record<string, Model[]>);
        
        // Set default model if none selected
        if (!this.activeModel && models.length > 0) {
          // Prefer Claude 3.5 Sonnet, GPT-4, or Gemini models
          const preferredModel = models.find(m => 
            m.id.includes('claude-3-5-sonnet') || 
            m.id.includes('gpt-4o') || 
            m.id.includes('gemini-2.0-flash')
          ) || models[0];
          
          this.activeModel = preferredModel.id;
        }
        
        return true;
      } catch (error) {
        console.error('Failed to initialize OpenRouter provider:', error);
        throw error;
      }
    }
    
    throw new Error(`Unknown provider: ${providerId}`);
  }
  
  getProviders(): LLMProvider[] {
    return Array.from(this.providers.values());
  }
  
  getModelsByProvider(provider: string): Model[] {
    return this.modelsByProvider[provider] || [];
  }
  
  getAllModels(): Model[] {
    const client = this.clients.get('openrouter');
    return client ? client.getModels() : [];
  }
  
  getRecommendedModels(): Model[] {
    const allModels = this.getAllModels();
    const recommendations: Model[] = [];
    
    // Get best model from each major provider
    const providers = ['anthropic', 'openai', 'google', 'meta-llama', 'mistralai'];
    
    providers.forEach(provider => {
      const providerModels = this.modelsByProvider[provider] || [];
      if (providerModels.length > 0) {
        // Sort by context length and capabilities, prefer newer models
        const sorted = providerModels
          .filter(m => m.contextLength >= 8000) // Filter out smaller context models
          .sort((a, b) => {
            // Prioritize specific good models
            const aScore = this.getModelScore(a);
            const bScore = this.getModelScore(b);
            return bScore - aScore;
          });
        
        if (sorted[0]) {
          recommendations.push(sorted[0]);
        }
      }
    });
    
    return recommendations;
  }
  
  private getModelScore(model: Model): number {
    let score = model.contextLength / 1000; // Base score from context length
    
    // Bonus for known good models
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
  
  setApiKey(provider: string, apiKey: string, options?: { siteUrl?: string; siteName?: string }) {
    return this.initializeProvider(provider, apiKey, options);
  }
  
  getActiveProvider(): string {
    return this.activeProvider;
  }
  
  getActiveModel(): string | null {
    return this.activeModel;
  }
  
  setActiveModel(provider: string, model: string) {
    this.activeProvider = provider;
    this.activeModel = model;
  }
  
  getClient(provider: string): OpenRouterClient | undefined {
    return this.clients.get(provider);
  }
  
  async *chat(
    messages: Message[], 
    context?: ComponentContext
  ): AsyncGenerator<string> {
    const client = this.clients.get(this.activeProvider);
    if (!client) {
      throw new Error('No API key set for provider');
    }
    
    // Enhance messages with component context
    const enhancedMessages = this.enhanceWithContext(messages, context);
    
    // Use active model or throw error
    if (!this.activeModel) {
      throw new Error('No model selected. Please choose a model first.');
    }
    
    yield* client.chat(enhancedMessages, {
      model: this.activeModel,
      siteUrl: window.location.href,
      siteName: document.title
    });
  }
  
  async completeChat(
    messages: Message[],
    context?: ComponentContext
  ): Promise<string> {
    const client = this.clients.get(this.activeProvider);
    if (!client) {
      throw new Error('No API key set for provider');
    }
    
    // Enhance messages with component context
    const enhancedMessages = this.enhanceWithContext(messages, context);
    
    // Use active model or throw error
    if (!this.activeModel) {
      throw new Error('No model selected. Please choose a model first.');
    }
    
    return client.completeChat(enhancedMessages, {
      model: this.activeModel,
      siteUrl: window.location.href,
      siteName: document.title
    });
  }
  
  /**
   * Enhanced context building with more sophisticated component analysis
   */
  private enhanceWithContext(
    messages: Message[], 
    context?: ComponentContext
  ): Message[] {
    if (!context) return messages;
    
    const contextParts = [
      `You are helping with a React component. Here's the context:`,
      ``,
      `Component: ${context.name}`,
      `Type: ${this.getComponentType(context)}`,
      `Props: ${this.formatProps(context.props)}`,
      context.state ? `State: ${JSON.stringify(context.state, null, 2)}` : null,
      context.hooks.length > 0 ? `Hooks: ${context.hooks.length} detected` : null,
      context.parent ? `Parent: ${context.parent.name}` : null,
      context.children.length > 0 ? `Children: ${context.children.map(c => c.name).join(', ')}` : null,
      ``,
      context.sourceCode ? `Source code:\n\`\`\`${context.language || 'jsx'}\n${context.sourceCode}\n\`\`\`` : null,
      ``,
      `Please provide helpful guidance for working with this component. Consider its props, state, and relationships when providing suggestions.`
    ].filter(Boolean).join('\n');
    
    const systemMessage: Message = {
      role: 'system',
      content: contextParts
    };
    
    return [systemMessage, ...messages];
  }
  
  private getComponentType(context: ComponentContext): string {
    if (context.hooks.length > 0) return 'Function Component (with hooks)';
    if (context.state) return 'Class Component';
    if (context.props && Object.keys(context.props).length > 0) return 'Function Component';
    return 'Component';
  }
  
  private formatProps(props: any): string {
    if (!props || Object.keys(props).length === 0) {
      return 'No props';
    }
    
    const filteredProps = Object.entries(props)
      .filter(([key]) => !key.startsWith('__') && key !== 'children')
      .reduce((acc, [key, value]) => {
        acc[key] = typeof value === 'function' ? '[Function]' : 
                  typeof value === 'object' && value !== null ? '[Object]' : 
                  value;
        return acc;
      }, {} as Record<string, any>);
    
    return Object.keys(filteredProps).length > 0 ? 
      JSON.stringify(filteredProps, null, 2) : 
      'No relevant props';
  }
  
  isInitialized(): boolean {
    return this.clients.size > 0;
  }
  
  getAvailableProviders(): string[] {
    return Array.from(this.clients.keys());
  }
  
  /**
   * Get cost estimate for a conversation
   */
  estimateCost(messages: Message[], context?: ComponentContext): any {
    const client = this.clients.get(this.activeProvider);
    if (!client || !this.activeModel) {
      return null;
    }
    
    const enhancedMessages = this.enhanceWithContext(messages, context);
    return client.estimateCost(enhancedMessages, this.activeModel);
  }
}