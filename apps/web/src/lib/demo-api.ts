// Real API integration for ReactLM demo
// This will replace the simulation when actual ReactLM is integrated

import { DemoMockProvider } from './demo-mock-provider'

export interface ApiConfig {
  openRouterKey?: string
  anthropicKey?: string
  openaiKey?: string
  googleKey?: string
  simulationMode?: boolean
}

export interface ComponentAnalysis {
  id: string
  name: string
  props: Record<string, unknown>
  state: Record<string, unknown>
  code: string
  dependencies: string[]
  accessibility: {
    score: number
    issues: string[]
    suggestions: string[]
  }
  performance: {
    renderCount: number
    memoryUsage: number
    suggestions: string[]
  }
}

export interface CodeModification {
  before: string
  after: string
  language: string
  explanation: string
  reasoning: string
  warnings?: string[]
}

export interface ApiResponse {
  message: string
  codeChanges?: CodeModification[]
  suggestions?: string[]
  analysis?: ComponentAnalysis
  metadata: {
    model: string
    tokensUsed: number
    responseTime: number
    cost: number
  }
}

class ReactLMApi {
  private config: ApiConfig
  private isInitialized = false
  private mockProvider: DemoMockProvider

  constructor(config: ApiConfig = {}) {
    this.config = { simulationMode: true, ...config }
    this.mockProvider = new DemoMockProvider()
  }

  async initialize(): Promise<boolean> {
    if (this.config.simulationMode) {
      this.isInitialized = true
      return true
    }

    try {
      // Check if ReactLM script is available
      const reactLM = (window as unknown as { ReactLM?: { init: (config: unknown) => Promise<void> } }).ReactLLM
      if (reactLM) {
        await reactLM.init({
          providers: {
            openrouter: this.config.openRouterKey,
            anthropic: this.config.anthropicKey,
            openai: this.config.openaiKey,
            google: this.config.googleKey
          },
          mode: 'production' // Read-only mode for demo
        })
        this.isInitialized = true
        return true
      }
      
      // Fallback to simulation if ReactLM not available
      this.config.simulationMode = true
      this.isInitialized = true
      return true
    } catch (error) {
      console.warn('ReactLM initialization failed, using simulation mode:', error)
      this.config.simulationMode = true
      this.isInitialized = true
      return true
    }
  }

  async analyzeComponent(componentId: string): Promise<ComponentAnalysis> {
    if (!this.isInitialized) {
      throw new Error('API not initialized')
    }

    if (this.config.simulationMode) {
      // Use mock provider for analysis
      const analysis = await this.mockProvider.analyzeComponent({ id: componentId, name: componentId })
      return {
        id: componentId,
        name: componentId,
        props: { className: 'example-class', children: 'Example content' },
        state: {},
        code: `function ${componentId}() {\n  return <div>Example component</div>\n}`,
        dependencies: ['react'],
        accessibility: {
          score: 85,
          issues: ['Missing aria-label', 'Low color contrast'],
          suggestions: ['Add semantic HTML', 'Improve keyboard navigation']
        },
        performance: {
          renderCount: 3,
          memoryUsage: 1.2,
          suggestions: ['Use React.memo for optimization', 'Reduce re-renders']
        },
        analysis: { message: analysis }
      } as ComponentAnalysis
    }

    try {
      // Real ReactLM component analysis
      const reactLM = (window as unknown as { ReactLM?: { analyzeComponent: (id: string) => Promise<ComponentAnalysis> } }).ReactLLM
      if (!reactLM) throw new Error('ReactLM not available')
      const analysis = await reactLM.analyzeComponent(componentId)
      return analysis
    } catch (error) {
      throw new Error(`Component analysis failed: ${error}`)
    }
  }

  async modifyComponent(
    componentId: string, 
    instruction: string, 
    model: string = 'gpt-4o'
  ): Promise<ApiResponse> {
    if (!this.isInitialized) {
      throw new Error('API not initialized')
    }

    const startTime = Date.now()

    if (this.config.simulationMode) {
      // Use mock provider for code modifications
      const modification = await this.mockProvider.generateCodeModification(
        { id: componentId, name: componentId }, 
        instruction
      )
      
      return {
        message: `I've modified the ${componentId} component based on your request: "${instruction}". ${modification.explanation}`,
        codeChanges: [{
          before: modification.before,
          after: modification.after,
          language: modification.language,
          explanation: modification.explanation,
          reasoning: modification.explanation
        }],
        suggestions: modification.changes,
        metadata: {
          ...this.mockProvider.getMetadata(),
          responseTime: Date.now() - startTime
        }
      }
    }

    try {
      // Real ReactLM API call
      const reactLM = (window as unknown as { ReactLM?: { chat: (config: unknown) => Promise<unknown> } }).ReactLLM
      if (!reactLM) throw new Error('ReactLM not available')
      const response = await reactLM.chat({
        message: instruction,
        context: {
          componentId,
          selectedComponent: componentId
        },
        model
      })
      
      const apiResponse = response as { content: string; codeChanges?: CodeModification[]; suggestions?: string[]; tokensUsed?: number; cost?: number }
      return {
        message: apiResponse.content,
        codeChanges: apiResponse.codeChanges,
        suggestions: apiResponse.suggestions,
        metadata: {
          model,
          tokensUsed: apiResponse.tokensUsed || 0,
          responseTime: Date.now() - startTime,
          cost: apiResponse.cost || 0
        }
      }
    } catch (error) {
      throw new Error(`Component modification failed: ${error}`)
    }
  }

  async chat(messages: Array<{role: string, content: string}>, model: string = 'gpt-4o'): Promise<ApiResponse> {
    if (!this.isInitialized) {
      throw new Error('API not initialized')
    }

    const startTime = Date.now()

    if (this.config.simulationMode) {
      // Use mock provider for chat
      const response = await this.mockProvider.chat(messages)
      
      return {
        message: response,
        metadata: {
          ...this.mockProvider.getMetadata(),
          responseTime: Date.now() - startTime
        }
      }
    }

    try {
      // Real ReactLM chat
      const reactLM = (window as unknown as { ReactLM?: { chat: (messages: any[], options: any) => Promise<string> } }).ReactLLM
      if (!reactLM) throw new Error('ReactLM not available')
      
      const response = await reactLM.chat(messages, { model })
      
      return {
        message: response,
        metadata: {
          model,
          tokensUsed: 0,
          responseTime: Date.now() - startTime,
          cost: 0
        }
      }
    } catch (error) {
      throw new Error(`Chat failed: ${error}`)
    }
  }

  async getAvailableModels(): Promise<string[]> {
    if (this.config.simulationMode) {
      return [
        'gpt-4o',
        'gpt-4-turbo',
        'claude-3-5-sonnet',
        'claude-3-opus',
        'gemini-2-flash',
        'gemini-1.5-pro',
        'llama-3-70b'
      ]
    }

    try {
      const reactLM = (window as unknown as { ReactLM?: { getAvailableModels: () => Promise<string[]> } }).ReactLLM
      if (!reactLM) throw new Error('ReactLM not available')
      return await reactLM.getAvailableModels()
    } catch (error) {
      console.warn('Failed to get available models:', error)
      return ['gpt-4o'] // Fallback
    }
  }

  isSimulationMode(): boolean {
    return this.config.simulationMode
  }

  updateConfig(newConfig: Partial<ApiConfig>): void {
    this.config = { ...this.config, ...newConfig }
  }
}

// Export singleton instance
export const reactLMApi = new ReactLMApi()

// Environment variable detection for API keys
export function detectApiKeys(): Partial<ApiConfig> {
  const config: Partial<ApiConfig> = {}
  
  // Check for environment variables (development)
  if (typeof process !== 'undefined' && process.env) {
    config.openRouterKey = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY
    config.anthropicKey = process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY
    config.openaiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY
    config.googleKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
  }
  
  // Check localStorage for demo keys
  if (typeof window !== 'undefined') {
    const storedKeys = localStorage.getItem('reactlm-demo-keys')
    if (storedKeys) {
      try {
        const parsed = JSON.parse(storedKeys)
        Object.assign(config, parsed)
      } catch (error) {
        console.warn('Failed to parse stored API keys:', error)
      }
    }
  }
  
  // Determine if we should use simulation mode
  const hasAnyKey = Object.values(config).some(key => key && key.length > 0)
  config.simulationMode = !hasAnyKey
  
  return config
}

// Initialize API with detected configuration
export function initializeDemoApi(): Promise<boolean> {
  const config = detectApiKeys()
  reactLMApi.updateConfig(config)
  return reactLMApi.initialize()
}