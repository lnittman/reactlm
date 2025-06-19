export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  metadata?: {
    model?: string
    componentId?: string
    actionType?: string
    codeChanges?: {
      before: string
      after: string
      language: string
    }
  }
}

export interface DemoState {
  selectedComponent: string | null
  highlightedComponent: string | null
  messages: ChatMessage[]
  currentModel: string
  isLoading: boolean
  isSimulationMode: boolean
}

// Simulated AI responses for different scenarios
const RESPONSE_TEMPLATES = {
  'component-selected': [
    "Great choice! I can see you've selected the {componentName}. What would you like me to help you with?",
    "Perfect! The {componentName} is now selected. I can help you modify its styling, add functionality, or improve its accessibility.",
    "Nice! I'm analyzing the {componentName} component. What changes would you like to make?"
  ],
  'make-responsive': [
    "I'll make this component responsive! Let me add mobile-first breakpoints and flexible layouts.",
    "Great idea! I'll add responsive design patterns using CSS Grid and Flexbox for better mobile experience.",
    "Making it responsive now... I'll use Tailwind's responsive utilities to ensure it looks great on all devices."
  ],
  'add-animation': [
    "Adding smooth animations! I'll use Framer Motion to create engaging micro-interactions.",
    "Perfect! Let me add some delightful animations that enhance the user experience without being distracting.",
    "I'll implement subtle animations using CSS transitions and Framer Motion for a polished feel."
  ],
  'change-colors': [
    "Let me update the color scheme! I'll use a modern palette that improves contrast and visual hierarchy.",
    "Great choice! I'll apply a cohesive color system that aligns with modern design principles.",
    "Updating colors now... I'll ensure accessibility standards are met with proper contrast ratios."
  ],
  'improve-accessibility': [
    "Excellent! I'll enhance accessibility by adding ARIA labels, improving keyboard navigation, and ensuring WCAG compliance.",
    "Making it accessible for everyone! I'll add semantic HTML, proper focus management, and screen reader support.",
    "Great thinking! I'll implement accessibility best practices including proper heading structure and focus indicators."
  ],
  'add-dark-mode': [
    "Adding dark mode support! I'll implement a theme system with proper color tokens and user preference detection.",
    "Perfect! I'll create a dark theme that's easy on the eyes and maintains excellent contrast.",
    "Implementing dark mode... I'll use CSS custom properties and theme context for seamless switching."
  ],
  'optimize-performance': [
    "Optimizing for performance! I'll implement lazy loading, memoization, and reduce unnecessary re-renders.",
    "Great idea! I'll optimize bundle size, improve loading times, and enhance runtime performance.",
    "Performance optimization coming up! I'll use React.memo, useMemo, and code splitting for better efficiency."  
  ],
  'general-help': [
    "I'm here to help! You can ask me to modify styling, add functionality, improve accessibility, or optimize performance.",
    "What would you like to do? I can help with responsive design, animations, color schemes, accessibility, and more!",
    "Let's build something amazing! I can assist with modern web development best practices and React patterns."
  ]
} as const

// Code change examples for different actions
const CODE_EXAMPLES = {
  'make-responsive': {
    before: `className="w-full px-6 py-4"`,
    after: `className="w-full px-4 py-3 sm:px-6 sm:py-4 lg:px-8"`,
    language: 'tsx'
  },
  'add-animation': {
    before: `<div className="card">`,
    after: `<motion.div 
  className="card"
  whileHover={{ scale: 1.02 }}
  transition={{ duration: 0.2 }}
>`,
    language: 'tsx'
  },
  'change-colors': {
    before: `className="bg-blue-500 text-white"`,
    after: `className="bg-indigo-600 text-white hover:bg-indigo-700"`,
    language: 'tsx'
  },
  'improve-accessibility': {
    before: `<div onClick={handleClick}>`,
    after: `<button 
  onClick={handleClick}
  aria-label="Open menu"
  role="button"
  tabIndex={0}
>`,
    language: 'tsx'
  },
  'add-dark-mode': {
    before: `className="bg-white text-gray-900"`,
    after: `className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"`,
    language: 'tsx'
  },
  'optimize-performance': {
    before: `export function Component({ data }) {`,
    after: `export const Component = React.memo(function Component({ data }) {`,
    language: 'tsx'
  }
} as const

export class DemoSimulation {
  private state: DemoState
  private messageIdCounter = 0

  constructor(initialModel = 'gpt-4o') {
    this.state = {
      selectedComponent: null,
      highlightedComponent: null,
      messages: [
        {
          id: '0',
          role: 'assistant',
          content: "👋 Welcome to React LLM! Click any component to select it, then I'll help you modify, improve, or enhance it. Try the quick actions or type your own requests!",
          timestamp: new Date()
        }
      ],
      currentModel: initialModel,
      isLoading: false,
      isSimulationMode: true
    }
  }

  getState(): DemoState {
    return { ...this.state }
  }

  selectComponent(componentId: string): void {
    this.state.selectedComponent = componentId
    
    // Add a message about component selection
    const templates = RESPONSE_TEMPLATES['component-selected']
    const template = templates[Math.floor(Math.random() * templates.length)]
    const message = template.replace('{componentName}', componentId)
    
    this.addMessage({
      role: 'assistant',
      content: message,
      metadata: { componentId }
    })
  }

  highlightComponent(componentId: string | null): void {
    this.state.highlightedComponent = componentId
  }

  changeModel(modelId: string): void {
    this.state.currentModel = modelId
    this.addMessage({
      role: 'assistant',
      content: `Switched to ${modelId}. I'm ready to help with your component modifications!`,
      metadata: { model: modelId }
    })
  }

  async processQuickAction(actionId: string): Promise<void> {
    if (!this.state.selectedComponent) {
      this.addMessage({
        role: 'assistant',
        content: "Please select a component first by clicking on it, then I can help you with modifications!"
      })
      return
    }

    this.state.isLoading = true
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 1000))
    
    const templates = RESPONSE_TEMPLATES[actionId as keyof typeof RESPONSE_TEMPLATES] || RESPONSE_TEMPLATES['general-help']
    const response = templates[Math.floor(Math.random() * templates.length)]
    
    const codeChanges = CODE_EXAMPLES[actionId as keyof typeof CODE_EXAMPLES]
    
    this.addMessage({
      role: 'assistant',
      content: response,
      metadata: {
        model: this.state.currentModel,
        componentId: this.state.selectedComponent,
        actionType: actionId,
        codeChanges
      }
    })
    
    this.state.isLoading = false
  }

  async processChatMessage(userMessage: string): Promise<void> {
    // Add user message
    this.addMessage({
      role: 'user',
      content: userMessage
    })

    this.state.isLoading = true
    
    // Simulate thinking time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))
    
    // Analyze user message and generate appropriate response
    const response = this.generateContextualResponse(userMessage)
    
    this.addMessage({
      role: 'assistant',
      content: response,
      metadata: {
        model: this.state.currentModel,
        componentId: this.state.selectedComponent
      }
    })
    
    this.state.isLoading = false
  }

  private addMessage(message: Omit<ChatMessage, 'id' | 'timestamp'>): void {
    const fullMessage: ChatMessage = {
      ...message,
      id: (++this.messageIdCounter).toString(),
      timestamp: new Date()
    }
    
    this.state.messages.push(fullMessage)
  }

  private generateContextualResponse(userMessage: string): string {
    const message = userMessage.toLowerCase()
    
    // Check for specific keywords and generate appropriate responses
    if (message.includes('responsive') || message.includes('mobile')) {
      const templates = RESPONSE_TEMPLATES['make-responsive']
      return templates[Math.floor(Math.random() * templates.length)]
    }
    
    if (message.includes('animate') || message.includes('animation') || message.includes('motion')) {
      const templates = RESPONSE_TEMPLATES['add-animation']
      return templates[Math.floor(Math.random() * templates.length)]
    }
    
    if (message.includes('color') || message.includes('theme') || message.includes('style')) {
      const templates = RESPONSE_TEMPLATES['change-colors']
      return templates[Math.floor(Math.random() * templates.length)]
    }
    
    if (message.includes('accessibility') || message.includes('a11y') || message.includes('screen reader')) {
      const templates = RESPONSE_TEMPLATES['improve-accessibility']
      return templates[Math.floor(Math.random() * templates.length)]
    }
    
    if (message.includes('dark mode') || message.includes('dark theme')) {
      const templates = RESPONSE_TEMPLATES['add-dark-mode']
      return templates[Math.floor(Math.random() * templates.length)]
    }
    
    if (message.includes('performance') || message.includes('optimize') || message.includes('faster')) {
      const templates = RESPONSE_TEMPLATES['optimize-performance']
      return templates[Math.floor(Math.random() * templates.length)]
    }
    
    // Generic helpful response
    const templates = RESPONSE_TEMPLATES['general-help']
    return templates[Math.floor(Math.random() * templates.length)]
  }

  reset(): void {
    this.state = {
      selectedComponent: null,
      highlightedComponent: null,
      messages: [
        {
          id: '0',
          role: 'assistant',
          content: "👋 Welcome back! Click any component to select it, then I'll help you modify, improve, or enhance it.",
          timestamp: new Date()
        }
      ],
      currentModel: this.state.currentModel,
      isLoading: false,
      isSimulationMode: true
    }
    this.messageIdCounter = 0
  }
}

// Singleton instance for the demo
export const demoSimulation = new DemoSimulation()