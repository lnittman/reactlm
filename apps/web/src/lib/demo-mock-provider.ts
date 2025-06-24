// Mock LLM provider for demo without API keys
export class DemoMockProvider {
  private responses = {
    componentAnalysis: [
      "I can see you've selected a {componentType} component. It has {propCount} props and appears to be well-structured. Here are some suggestions for improvement:\n\n1. **Accessibility**: Consider adding ARIA labels for better screen reader support\n2. **Performance**: The component re-renders on every state change. Consider using React.memo() for optimization\n3. **Code Style**: The component follows good React patterns",
      "Looking at this {componentType} component:\n\n**Current Implementation:**\n- Uses functional component pattern ✓\n- Has {propCount} props defined\n- Manages local state effectively\n\n**Suggestions:**\n- Add prop type validation with TypeScript\n- Consider extracting complex logic into custom hooks\n- Add error boundaries for better error handling",
      "This {componentType} component is interesting! Analysis:\n\n**Strengths:**\n- Clean component structure\n- Good separation of concerns\n- Responsive design implementation\n\n**Improvements:**\n- Could benefit from memoization\n- Consider adding loading states\n- Extract inline styles to styled components"
    ],
    codeModifications: [
      {
        explanation: "Added accessibility improvements with ARIA labels and keyboard navigation support",
        changes: [
          "Added aria-label attribute for better screen reader support",
          "Implemented keyboard navigation with onKeyDown handler",
          "Added focus styles for better visibility"
        ]
      },
      {
        explanation: "Optimized performance with React.memo and useCallback",
        changes: [
          "Wrapped component in React.memo to prevent unnecessary re-renders",
          "Used useCallback for event handlers to maintain referential equality",
          "Moved complex calculations to useMemo"
        ]
      },
      {
        explanation: "Enhanced styling with CSS-in-JS approach",
        changes: [
          "Converted inline styles to styled components",
          "Added theme support for consistent styling",
          "Implemented responsive design breakpoints"
        ]
      }
    ],
    quickActions: {
      accessibility: "I've added ARIA labels and improved keyboard navigation. The component now has:\n- Proper role attributes\n- Keyboard event handlers\n- Focus management\n- Screen reader announcements",
      performance: "Performance optimizations applied:\n- Added React.memo wrapper\n- Implemented useCallback for handlers\n- Used useMemo for expensive computations\n- Reduced re-render frequency by 60%",
      style: "Styling improvements completed:\n- Migrated to CSS-in-JS\n- Added responsive breakpoints\n- Implemented dark mode support\n- Improved animation smoothness",
      tests: "Test suite generated:\n- Unit tests for all props\n- Integration tests for user interactions\n- Snapshot tests for UI consistency\n- Coverage increased to 95%"
    }
  }
  
  async analyzeComponent(componentInfo: any): Promise<string> {
    // Simulate processing delay
    await this.delay(800 + Math.random() * 400)
    
    const templates = this.responses.componentAnalysis
    const template = templates[Math.floor(Math.random() * templates.length)]
    
    return template
      .replace('{componentType}', componentInfo.name || 'React')
      .replace('{propCount}', String(Object.keys(componentInfo.props || {}).length))
  }
  
  async generateCodeModification(component: any, instruction: string): Promise<any> {
    await this.delay(1000 + Math.random() * 500)
    
    const modifications = this.responses.codeModifications
    const mod = modifications[Math.floor(Math.random() * modifications.length)]
    
    // Generate pseudo code based on component
    const beforeCode = this.generateComponentCode(component, false)
    const afterCode = this.generateComponentCode(component, true)
    
    return {
      before: beforeCode,
      after: afterCode,
      explanation: mod.explanation,
      changes: mod.changes,
      language: 'typescript'
    }
  }
  
  async processQuickAction(action: string, component: any): Promise<string> {
    await this.delay(600 + Math.random() * 300)
    
    const actionKey = action.toLowerCase().replace(/\s+/g, '')
    const response = this.responses.quickActions[actionKey as keyof typeof this.responses.quickActions]
    
    return response || `Applied ${action} improvements to the component successfully!`
  }
  
  async chat(messages: Array<{role: string, content: string}>): Promise<string> {
    await this.delay(500 + Math.random() * 500)
    
    const lastMessage = messages[messages.length - 1].content.toLowerCase()
    
    // Simple keyword-based responses
    if (lastMessage.includes('help')) {
      return "I can help you with:\n- Selecting and analyzing React components\n- Suggesting improvements for accessibility, performance, and code quality\n- Generating tests and documentation\n- Refactoring code patterns\n\nTry selecting a component to get started!"
    }
    
    if (lastMessage.includes('component')) {
      return "To work with components:\n1. Click on any component in the demo app\n2. I'll analyze its structure and suggest improvements\n3. Use quick actions or ask me specific questions\n4. I can help with styling, performance, accessibility, and more!"
    }
    
    if (lastMessage.includes('performance')) {
      return "For performance optimization:\n- Use React.memo for expensive components\n- Implement useCallback and useMemo hooks\n- Lazy load components with React.lazy\n- Optimize re-renders with proper state management\n- Use React DevTools Profiler to identify bottlenecks"
    }
    
    if (lastMessage.includes('test')) {
      return "I can help generate tests:\n- Unit tests with Jest and React Testing Library\n- Integration tests for user workflows\n- Snapshot tests for UI consistency\n- E2E tests with Playwright or Cypress\n- Test coverage reports and analysis"
    }
    
    // Default response
    return "I understand you're asking about: " + lastMessage + "\n\nIn a real implementation, I would provide detailed assistance based on your selected component and specific needs. Try selecting a component and using the quick actions to see how I can help!"
  }
  
  private generateComponentCode(component: any, modified: boolean): string {
    const componentName = component?.name || 'Component'
    const props = component?.props || {}
    const propString = Object.keys(props).map(key => `${key}: ${JSON.stringify(props[key])}`).join(', ')
    
    if (modified) {
      return `import React, { memo, useCallback } from 'react'

const ${componentName} = memo(({ ${Object.keys(props).join(', ')} }) => {
  // Performance optimized with React.memo
  
  const handleClick = useCallback(() => {
    console.log('Clicked!')
  }, [])
  
  return (
    <div 
      className="component-wrapper"
      role="button"
      aria-label="${componentName}"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
    >
      {/* Component content */}
    </div>
  )
})

${componentName}.displayName = '${componentName}'

export default ${componentName}`
    }
    
    return `import React from 'react'

const ${componentName} = ({ ${Object.keys(props).join(', ')} }) => {
  return (
    <div className="component-wrapper">
      {/* Component content */}
    </div>
  )
}

export default ${componentName}`
  }
  
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
  
  getMetadata() {
    return {
      model: 'demo-gpt-4',
      tokensUsed: Math.floor(Math.random() * 1000) + 200,
      responseTime: Math.floor(Math.random() * 500) + 300,
      cost: 0 // Free for demo
    }
  }
}