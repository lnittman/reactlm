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
  private apiEndpoint?: string;
  private modelsEndpoint?: string;
  private isApiMode = false;
  
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
  
  /**
   * Initialize in demo mode - works without any API keys!
   */
  async initializeDemoMode() {
    this.isApiMode = false;
    this.activeProvider = 'demo';
    this.activeModel = 'demo/gemini-2.0-flash';
    
    // Set up demo models
    this.modelsByProvider = {
      demo: [
        {
          id: 'demo/gemini-2.0-flash',
          name: 'Gemini 2.0 Flash (Demo)',
          provider: 'demo',
          contextLength: 32768,
          pricing: { prompt: 0, completion: 0 }
        }
      ]
    };
    
    console.log('[LLMHub] Initialized in demo mode - no API keys required!');
    return true;
  }
  
  /**
   * Initialize in API mode - uses server endpoints instead of direct API keys
   */
  async initializeApiMode(apiEndpoint: string, modelsEndpoint?: string) {
    this.isApiMode = true;
    this.apiEndpoint = apiEndpoint;
    this.modelsEndpoint = modelsEndpoint || '/api/models';
    
    // Set active provider to api mode
    this.activeProvider = 'api';
    
    // Fetch available models from the endpoint
    if (modelsEndpoint) {
      try {
        const response = await fetch(modelsEndpoint);
        if (response.ok) {
          const data = await response.json();
          const models = data.data || [];
          
          // Group models by provider
          this.modelsByProvider = models.reduce((acc: Record<string, Model[]>, model: any) => {
            const provider = model.id.split('/')[0];
            if (!acc[provider]) acc[provider] = [];
            acc[provider].push(model);
            return acc;
          }, {});
          
          // Set default model - prefer Gemini 2.0 Flash
          if (!this.activeModel && models.length > 0) {
            const preferredModel = models.find((m: any) => 
              m.id.includes('gemini-2.0-flash') ||
              m.id.includes('gemini-2-flash')
            ) || models.find((m: any) => 
              m.id.includes('claude-3-5-sonnet') || 
              m.id.includes('gpt-4o')
            ) || models[0];
            
            this.activeModel = preferredModel.id;
          }
        }
      } catch (error) {
        console.error('Failed to fetch models:', error);
      }
    }
    
    return true;
  }
  
  getProviders(): LLMProvider[] {
    return Array.from(this.providers.values());
  }
  
  getActiveProvider(): string {
    return this.activeProvider;
  }
  
  getModelsByProvider(provider: string): Model[] {
    return this.modelsByProvider[provider] || [];
  }
  
  getAvailableModels(): Model[] {
    // In demo mode, return mock models
    if (this.activeProvider === 'demo') {
      return [{
        id: 'demo/gemini-2.0-flash',
        name: 'Gemini 2.0 Flash (Demo)',
        provider: 'demo',
        contextLength: 32768,
        pricing: { prompt: 0, completion: 0 },
        description: 'Demo mode - no API key required'
      }];
    }
    
    // Return all models from all providers
    const allModels: Model[] = [];
    Object.values(this.modelsByProvider).forEach(models => {
      allModels.push(...models);
    });
    
    return allModels;
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
    // Demo mode - return helpful demo responses
    if (this.activeProvider === 'demo') {
      const demoResponses = [
        "👋 Welcome to React LLM! I'm running in demo mode.\n\nTo enable full AI capabilities:\n\n1. **Option A**: Use your own API key\n   ```javascript\n   ReactLLM.init({\n     providers: {\n       openrouter: 'your-api-key'\n     }\n   });\n   ```\n\n2. **Option B**: Use a server-side proxy\n   ```javascript\n   ReactLLM.init({\n     apiEndpoint: '/api/chat'\n   });\n   ```\n\nI can see your React components and would love to help once configured!",
        "I notice you have some React components on this page. Once you configure an API key, I can help you:\n\n- 🔍 Analyze component structure\n- ✏️ Suggest improvements\n- 🐛 Debug issues\n- 📝 Generate documentation\n- 🎨 Refactor code\n\nReact LLM works on any website - just add the script tag!",
        "Demo mode is limited, but here's what React LLM can do:\n\n- **Component Selection**: Click any component to select it\n- **Context Aware**: I understand your component tree\n- **Multi-Model**: Supports GPT-4, Claude, Gemini, and more\n- **Browser Native**: No server required (with API keys)\n\nConfigure me to unlock these features!"
      ];
      
      const response = demoResponses[Math.floor(Math.random() * demoResponses.length)];
      
      // Simulate typing
      for (const char of response) {
        yield char;
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      return;
    }
    
    // API mode - use endpoint
    if (this.isApiMode && this.apiEndpoint) {
      const enhancedMessages = this.enhanceWithContext(messages, context);
      
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: enhancedMessages,
          model: this.activeModel,
          stream: true,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }
      
      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) throw new Error('No response body');
      
      const decoder = new TextDecoder();
      let buffer = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) yield content;
            } catch (e) {
              // Ignore parse errors
            }
          }
        }
      }
      return;
    }
    
    // Direct client mode
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
    // Demo mode
    if (this.activeProvider === 'demo') {
      return "Welcome to React LLM! I'm running in demo mode. Configure an API key to unlock full AI capabilities.";
    }
    
    // API mode - use endpoint
    if (this.isApiMode && this.apiEndpoint) {
      const enhancedMessages = this.enhanceWithContext(messages, context);
      
      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: enhancedMessages,
          model: this.activeModel,
          stream: false,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.choices?.[0]?.message?.content || '';
    }
    
    // Direct client mode
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
    
    const result = await client.completeChat(enhancedMessages, {
      model: this.activeModel,
      siteUrl: window.location.href,
      siteName: document.title
    });
    
    return result.content;
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
    return this.activeProvider === 'demo' || this.isApiMode || this.clients.size > 0;
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