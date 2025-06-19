'use client'

import React, { useState, useEffect } from 'react'

function DemoSkeleton() {
  return (
    <div className="h-full w-full bg-muted/20 animate-pulse rounded-lg flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-muted rounded-full mx-auto animate-spin border-2 border-transparent border-t-primary" />
        <p className="text-muted-foreground text-sm">Loading interactive demo...</p>
      </div>
    </div>
  )
}

function MockComponent({ name, isSelected, onClick }: { 
  name: string
  isSelected: boolean
  onClick: () => void 
}) {
  return (
    <div 
      className={`
        p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
        ${isSelected 
          ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20' 
          : 'border-border bg-card hover:border-border/60 hover:bg-accent'
        }
      `}
      onClick={onClick}
    >
      <div className="text-sm font-mono text-foreground/80 mb-2">{name}</div>
      <div className="space-y-2">
        <div className="h-2 bg-muted rounded w-3/4" />
        <div className="h-2 bg-muted rounded w-1/2" />
      </div>
    </div>
  )
}

function ChatMessage({ message, isUser }: { message: string, isUser: boolean }) {
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`
        max-w-xs px-3 py-2 rounded-lg text-sm
        ${isUser 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-muted text-foreground border border-border'
        }
      `}>
        {message}
      </div>
    </div>
  )
}

export function LiveDemo() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null)
  const [messages, setMessages] = useState<Array<{ message: string, isUser: boolean }>>([])
  const [currentModel, setCurrentModel] = useState('gpt-4')

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoaded(true)
      setMessages([
        { message: "👋 Hi! Click any component to select it, then chat with me to modify it.", isUser: false }
      ])
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handleComponentSelect = (componentName: string) => {
    setSelectedComponent(componentName)
    setMessages(prev => [...prev, 
      { message: `Selected ${componentName}`, isUser: false },
      { message: "What would you like me to help you with?", isUser: false }
    ])
  }

  const models = [
    { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI' },
    { id: 'claude-3', name: 'Claude 3', provider: 'Anthropic' },
    { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google' },
  ]

  return (
    <div className="relative rounded-xl overflow-hidden bg-card/50 backdrop-blur border border-border shadow-2xl">
      {/* Demo viewport */}
      <div className="aspect-video relative">
        {/* Fake browser chrome */}
        <div className="absolute top-0 inset-x-0 h-10 bg-background/80 flex items-center px-4 gap-2 border-b border-border">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="flex-1 text-center text-xs text-muted-foreground font-mono">
            localhost:3000
          </div>
          {/* Model Selector */}
          <select 
            value={currentModel}
            onChange={(e) => setCurrentModel(e.target.value)}
            className="text-xs bg-muted text-foreground border border-input rounded px-2 py-1"
          >
            {models.map((model) => (
              <option key={model.id} value={model.id} className="bg-background">
                {model.name}
              </option>
            ))}
          </select>
        </div>
        
        {/* Demo container */}
        <div className="pt-10 h-full p-4">
          {!isLoaded ? (
            <DemoSkeleton />
          ) : (
            <div className="grid grid-cols-2 gap-4 h-full">
              {/* Left: Mock App */}
              <div className="space-y-3 overflow-y-auto">
                <h3 className="text-sm font-semibold text-foreground/80 mb-3">Components</h3>
                <MockComponent 
                  name="<Header />" 
                  isSelected={selectedComponent === 'Header'}
                  onClick={() => handleComponentSelect('Header')}
                />
                <MockComponent 
                  name="<Button />" 
                  isSelected={selectedComponent === 'Button'}
                  onClick={() => handleComponentSelect('Button')}
                />
                <MockComponent 
                  name="<Card />" 
                  isSelected={selectedComponent === 'Card'}
                  onClick={() => handleComponentSelect('Card')}
                />
              </div>
              
              {/* Right: Chat */}
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                  {messages.map((msg, i) => (
                    <ChatMessage key={i} message={msg.message} isUser={msg.isUser} />
                  ))}
                </div>
                <div className="border-t border-border pt-2">
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      placeholder="Ask me to modify the component..."
                      className="flex-1 bg-background border border-input rounded px-2 py-1 text-xs text-foreground placeholder:text-muted-foreground"
                      disabled
                    />
                    <button className="px-3 py-1 bg-primary text-primary-foreground rounded text-xs font-medium">
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Overlay instructions */}
        <div className="absolute bottom-4 left-4 right-4 bg-background/80 backdrop-blur rounded-lg p-3 border border-border">
          <p className="text-sm text-foreground/80 text-center">
            🎯 Click any component to select • 🤖 Choose AI model • 💬 Chat to modify code
          </p>
        </div>
      </div>
    </div>
  )
}