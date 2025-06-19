'use client'

import React from 'react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { GradientText } from '@/components/ui/GradientText'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { LiveDemo } from '@/components/demo/LiveDemo'
import { ChevronDown } from 'lucide-react'

export function Hero() {
  const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ 
      behavior: 'smooth' 
    })
  }

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-radial" />
      <div className="absolute inset-0 grid-pattern opacity-5" />
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Copy */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="success">
                  Now Available
                </Badge>
                <Badge variant="outline">
                  Supports GPT-4, Claude 3, Gemini & More
                </Badge>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                Chat with your code,{' '}
                <GradientText>right in the browser</GradientText>
              </h1>
              
              <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
                Click any component to select it. Chat with GPT-4, Claude, or Gemini. 
                Make live edits instantly. The future of web development is here.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" href="#install">
                Get Started
              </Button>
              <Button variant="outline" size="lg" href="/demo">
                Try Demo
              </Button>
            </div>

            {/* Install Command */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Quick install:</p>
              <CodeBlock copy>
                npm install --save-dev react-llm
              </CodeBlock>
            </div>
          </div>
          
          {/* Right: Live Demo */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-blue-500/20 blur-3xl transform scale-150" />
            <div className="relative animate-glow">
              <LiveDemo />
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <button 
        onClick={scrollToFeatures}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 p-2 text-muted-foreground hover:text-foreground transition-colors animate-bounce"
        aria-label="Scroll to features"
      >
        <ChevronDown className="w-6 h-6" />
      </button>
    </section>
  )
}