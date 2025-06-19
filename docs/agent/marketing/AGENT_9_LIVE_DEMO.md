# Agent 9: Live Demo Integration

## Mission
Complete the marketing website by integrating a functional React LLM live demo. The hero section at `apps/web` has a `LiveDemo.tsx` component that needs to showcase actual React LLM functionality with real component selection and AI interactions.

## Current State Analysis

### ✅ What Exists
- **Marketing Website**: Complete Next.js 15 site with hero, features, and components
- **Demo Component Scaffold**: `LiveDemo.tsx` exists but shows placeholder content
- **Demo Assets**: Marketing site has proper styling and layout
- **Build System**: Website builds and runs successfully

### ❌ What's Missing
- **Functional Demo**: LiveDemo component doesn't actually use React LLM
- **Demo Content**: No realistic React components to interact with
- **API Integration**: No working connection to LLM providers
- **Interactive Features**: No actual component selection or AI chat

## Technical Implementation

### 1. Demo Architecture

Create a self-contained demo that showcases React LLM capabilities:

```typescript
// apps/web/src/components/demo/LiveDemo.tsx
'use client';

import { useEffect, useState } from 'react';
import { DemoComponent } from './DemoComponent';
import { DemoControls } from './DemoControls';

export function LiveDemo() {
  const [isReactLLMLoaded, setIsReactLLMLoaded] = useState(false);
  const [selectedModel, setSelectedModel] = useState('openai/gpt-4o-mini');
  const [demoState, setDemoState] = useState<'idle' | 'selecting' | 'chatting'>('idle');
  
  useEffect(() => {
    // Load React LLM script dynamically
    const script = document.createElement('script');
    script.src = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3001/react-llm.js'  // Local dev build
      : 'https://unpkg.com/react-llm@latest/dist/react-llm.js';  // Published version
    
    script.onload = () => {
      // Initialize React LLM in demo mode
      window.ReactLLM?.init({
        providers: {
          openrouter: process.env.NEXT_PUBLIC_OPENROUTER_DEMO_KEY
        },
        mode: 'demo',
        theme: 'dark',
        position: 'bottom-right',
        demoMode: {
          container: '#demo-container',
          showOnlyInContainer: true,
          restrictToDemo: true
        }
      });
      setIsReactLLMLoaded(true);
    };
    
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, []);
  
  return (
    <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 border border-white/10">
      {/* Browser Chrome */}
      <div className="flex items-center px-4 py-3 bg-gray-800/50 border-b border-white/10">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <div className="flex-1 text-center">
          <span className="text-xs text-gray-400">localhost:3000</span>
        </div>
      </div>
      
      {/* Demo Content */}
      <div id="demo-container" className="relative h-96 p-6">
        <DemoContent 
          isReactLLMLoaded={isReactLLMLoaded}
          selectedModel={selectedModel}
          demoState={demoState}
          onStateChange={setDemoState}
        />
      </div>
      
      {/* Demo Controls */}
      <DemoControls
        selectedModel={selectedModel}
        onModelChange={setSelectedModel}
        demoState={demoState}
        onStateChange={setDemoState}
        isLoaded={isReactLLMLoaded}
      />
    </div>
  );
}
```

### 2. Interactive Demo Components

Create realistic React components that users can interact with:

```typescript
// apps/web/src/components/demo/DemoContent.tsx
export function DemoContent({ 
  isReactLLMLoaded, 
  demoState, 
  onStateChange 
}: DemoContentProps) {
  const [buttonColor, setButtonColor] = useState('blue');
  const [cardCount, setCardCount] = useState(3);
  
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-white">
        Sample React Application
      </h2>
      
      {/* Interactive Button Component */}
      <div className="space-y-2">
        <label className="text-sm text-gray-300">Button Component:</label>
        <DemoButton 
          color={buttonColor}
          onClick={() => {
            // Demo interaction
            if (isReactLLMLoaded && demoState === 'idle') {
              onStateChange('selecting');
            }
          }}
        >
          Click me to select this component
        </DemoButton>
      </div>
      
      {/* Interactive Card Grid */}
      <div className="space-y-2">
        <label className="text-sm text-gray-300">Card Grid Component:</label>
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: cardCount }, (_, i) => (
            <DemoCard 
              key={i}
              title={`Card ${i + 1}`}
              description="This is a demo card component"
              onClick={() => {
                if (isReactLLMLoaded && demoState === 'idle') {
                  onStateChange('selecting');
                }
              }}
            />
          ))}
        </div>
      </div>
      
      {/* Demo State Indicator */}
      {demoState !== 'idle' && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
          <div className="bg-white/10 backdrop-blur rounded-lg p-4">
            <p className="text-white text-center">
              {demoState === 'selecting' && '🎯 Click a component to select it'}
              {demoState === 'chatting' && '💬 AI is thinking...'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
```

### 3. Demo Controls Interface

Provide controls for users to experiment with different models:

```typescript
// apps/web/src/components/demo/DemoControls.tsx
export function DemoControls({
  selectedModel,
  onModelChange,
  demoState,
  onStateChange,
  isLoaded
}: DemoControlsProps) {
  const popularModels = [
    { id: 'openai/gpt-4o-mini', name: 'GPT-4o Mini', provider: 'OpenAI' },
    { id: 'anthropic/claude-3-haiku', name: 'Claude 3 Haiku', provider: 'Anthropic' },
    { id: 'google/gemini-flash-1.5', name: 'Gemini Flash 1.5', provider: 'Google' },
  ];
  
  const [chatHistory, setChatHistory] = useState<DemoMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  
  return (
    <div className="border-t border-white/10 bg-gray-900/50">
      <div className="p-4 space-y-4">
        {/* Model Selection */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-300">AI Model:</span>
          <select 
            value={selectedModel}
            onChange={(e) => onModelChange(e.target.value)}
            className="bg-gray-800 border border-white/20 rounded px-3 py-1 text-sm text-white"
            disabled={!isLoaded}
          >
            {popularModels.map(model => (
              <option key={model.id} value={model.id}>
                {model.name} ({model.provider})
              </option>
            ))}
          </select>
          
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isLoaded ? 'bg-green-500' : 'bg-yellow-500'}`} />
            <span className="text-xs text-gray-400">
              {isLoaded ? 'React LLM Loaded' : 'Loading...'}
            </span>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="flex gap-2">
          <button 
            onClick={() => simulateComponentSelection()}
            disabled={!isLoaded || demoState !== 'idle'}
            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 rounded text-sm text-white"
          >
            🎯 Select Component
          </button>
          <button 
            onClick={() => simulateAIChat('Change this button to green')}
            disabled={!isLoaded || demoState !== 'idle'}
            className="px-3 py-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 rounded text-sm text-white"
          >
            💬 Try AI Chat
          </button>
          <button 
            onClick={() => resetDemo()}
            disabled={!isLoaded}
            className="px-3 py-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-600 rounded text-sm text-white"
          >
            🔄 Reset
          </button>
        </div>
        
        {/* Chat Interface */}
        {chatHistory.length > 0 && (
          <div className="bg-gray-800/50 rounded p-3 space-y-2 max-h-32 overflow-y-auto">
            {chatHistory.map((message, i) => (
              <div key={i} className="text-sm">
                <span className={`font-medium ${message.role === 'user' ? 'text-blue-400' : 'text-green-400'}`}>
                  {message.role === 'user' ? 'You' : 'AI'}:
                </span>
                <span className="text-gray-300 ml-2">{message.content}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

### 4. Demo Simulation Logic

Create realistic demo interactions without requiring real API calls:

```typescript
// apps/web/src/lib/demo-simulation.ts
export class DemoSimulation {
  private static instance: DemoSimulation;
  
  static getInstance() {
    if (!this.instance) {
      this.instance = new DemoSimulation();
    }
    return this.instance;
  }
  
  async simulateComponentSelection(componentName: string): Promise<ComponentInfo> {
    // Simulate fiber tree extraction
    await this.delay(500);
    
    return {
      name: componentName,
      props: { color: 'blue', children: 'Click me' },
      state: {},
      location: { file: 'Button.tsx', line: 12 }
    };
  }
  
  async simulateAIResponse(
    prompt: string, 
    model: string, 
    component?: ComponentInfo
  ): Promise<string> {
    // Simulate streaming response
    await this.delay(1000);
    
    const responses = {
      'change button color': `I'll help you change the button color. Here's the updated code:\n\n\`\`\`tsx\n<button className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded">\n  Click me\n</button>\n\`\`\`\n\nThis changes the button from blue to green using Tailwind classes.`,
      'add animation': `I'll add a smooth hover animation to this component:\n\n\`\`\`tsx\n<button className="transform transition-transform hover:scale-105 duration-200">\n  Click me\n</button>\n\`\`\`\n\nThis adds a subtle scale effect on hover.`,
      default: `I can help you modify this ${component?.name || 'component'}. What specific changes would you like to make?`
    };
    
    const key = prompt.toLowerCase().includes('color') ? 'change button color' :
                 prompt.toLowerCase().includes('animation') ? 'add animation' : 'default';
    
    return responses[key];
  }
  
  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
```

### 5. Environment Configuration

Set up proper environment variables for demo API keys:

```typescript
// apps/web/.env.local
NEXT_PUBLIC_OPENROUTER_DEMO_KEY=sk-or-v1-demo-key-with-limited-credits
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_REACT_LLM_CDN=http://localhost:3001
```

```typescript
// apps/web/next.config.ts
const nextConfig = {
  env: {
    REACT_LLM_DEMO_MODE: process.env.NEXT_PUBLIC_DEMO_MODE,
  },
  async rewrites() {
    return [
      {
        source: '/api/demo/:path*',
        destination: '/api/demo/:path*',
      },
    ];
  },
};
```

## Implementation Plan

### Week 1: Demo Foundation
- [ ] **Demo Components**: Create realistic React components for interaction
- [ ] **Demo Simulation**: Build simulation layer for offline functionality
- [ ] **UI Integration**: Connect demo to marketing site design
- [ ] **Model Selection**: Implement model switching interface

### Week 2: React LLM Integration
- [ ] **Script Loading**: Dynamic React LLM script integration
- [ ] **API Integration**: Connect to OpenRouter with demo API key
- [ ] **Component Selection**: Implement actual component picking
- [ ] **Chat Interface**: Build functional AI chat for demo

### Week 3: Interactive Features
- [ ] **Real-time Updates**: Show live code changes in demo
- [ ] **Multiple Scenarios**: Different demo use cases (button, cards, forms)
- [ ] **Error Handling**: Graceful fallbacks for API failures
- [ ] **Performance**: Optimize demo loading and responsiveness

### Week 4: Polish & Launch
- [ ] **Visual Effects**: Smooth animations and transitions
- [ ] **Mobile Support**: Ensure demo works on mobile devices
- [ ] **Analytics**: Track demo usage and user interactions
- [ ] **Documentation**: Add demo usage to marketing copy

## Success Criteria

### Functional Requirements
- [ ] **Live Component Selection**: Users can click components and see them highlighted
- [ ] **AI Chat**: Real AI responses that make sense for selected components
- [ ] **Model Switching**: Users can try different AI models in the demo
- [ ] **Code Generation**: AI provides realistic code suggestions
- [ ] **Responsive Design**: Demo works on desktop, tablet, and mobile

### User Experience
- [ ] **Fast Loading**: Demo loads in <3 seconds
- [ ] **Intuitive Interface**: Users understand how to interact without instructions
- [ ] **Realistic Interactions**: Demo feels like real React LLM usage
- [ ] **Error Resilience**: Demo continues working even if API fails

### Business Impact
- [ ] **Conversion**: Demo increases trial/signup rates
- [ ] **Understanding**: Users understand React LLM value after demo
- [ ] **Engagement**: Average demo session >2 minutes
- [ ] **Sharing**: Demo generates social sharing and word-of-mouth

## Monitoring & Analytics

### Demo Usage Tracking
```typescript
// apps/web/src/lib/demo-analytics.ts
export function trackDemoEvent(event: string, properties?: any) {
  if (typeof window !== 'undefined') {
    // Track with PostHog or similar
    window.posthog?.capture(`demo_${event}`, properties);
  }
}

// Usage examples
trackDemoEvent('started');
trackDemoEvent('component_selected', { component: 'Button' });
trackDemoEvent('ai_chat_sent', { model: selectedModel, prompt: inputValue });
trackDemoEvent('model_changed', { from: oldModel, to: newModel });
trackDemoEvent('completed', { duration: sessionDuration });
```

### Performance Monitoring
- **Loading Time**: Track demo initialization speed
- **Interaction Latency**: Monitor component selection responsiveness  
- **API Response Time**: Measure AI chat response speed
- **Error Rate**: Track demo failures and fallbacks

### User Behavior Analysis
- **Popular Models**: Which AI models users try most
- **Common Prompts**: What users ask the AI to do
- **Drop-off Points**: Where users leave the demo
- **Conversion Funnel**: Demo usage → trial signup rate