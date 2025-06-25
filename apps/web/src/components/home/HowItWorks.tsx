'use client'

import React from 'react'
import { MousePointer2, MessageSquare, Zap, ArrowRight } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'

const steps = [
  {
    icon: MousePointer2,
    title: "Select Any Component",
    description: "Click on any React component in your browser to select it. Works on development servers and live websites.",
    details: "Visual highlighting shows component boundaries and hierarchy"
  },
  {
    icon: MessageSquare,
    title: "Chat with AI",
    description: "Choose your preferred AI model (GPT-4, Claude, Gemini) and describe what you want to change or build.",
    details: "AI understands your component&apos;s props, state, and context"
  },
  {
    icon: Zap,
    title: "See Changes Instantly",
    description: "Watch your modifications appear in real-time with hot module replacement. No build step required.",
    details: "Changes sync across multiple browser tabs automatically"
  }
]

function StepCard({ step, index }: { step: typeof steps[0], index: number }) {
  const Icon = step.icon
  
  return (
    <div className="relative">
      <Card className="group hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/20 text-primary group-hover:bg-primary/30 transition-colors">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground font-medium mb-1">
                Step {index + 1}
              </div>
              <CardTitle className="text-xl">{step.title}</CardTitle>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <CardDescription className="text-base leading-relaxed">
            {step.description}
          </CardDescription>
          <div className="text-sm text-muted-foreground/80 italic">
            {step.details}
          </div>
        </CardContent>
      </Card>
      
      {/* Arrow connector */}
      {index < steps.length - 1 && (
        <div className="hidden lg:flex absolute top-1/2 -right-6 transform -translate-y-1/2 text-muted-foreground z-10">
          <ArrowRight className="w-5 h-5" />
        </div>
      )}
    </div>
  )
}

export function HowItWorks() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            How It{" "}
            <span className="gradient-text">Works</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Get started with React LLM in three simple steps. No configuration, 
            no setup complexity - just install and start building.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 mb-16">
          {steps.map((step, index) => (
            <StepCard key={index} step={step} index={index} />
          ))}
        </div>

        {/* Quick Start */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-r from-primary/5 to-blue-500/5 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-2">Ready to get started?</CardTitle>
              <CardDescription className="text-base">
                Add React LLM to your project in seconds
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 text-foreground">NPM Package</h4>
                  <div className="bg-muted rounded-lg p-4 font-mono text-sm">
                    <div className="text-muted-foreground mb-1"># Install the package</div>
                    <div>npm install --save-dev react-llm</div>
                    <div className="text-muted-foreground mt-2 mb-1"># Initialize in your app</div>
                    <div>ReactLLM.init(&#123; apiKey: &apos;your-key&apos; &#125;)</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 text-foreground">Script Tag</h4>
                  <div className="bg-muted rounded-lg p-4 font-mono text-sm">
                    <div className="text-muted-foreground mb-1"># Add to any website</div>
                    <div className="break-all">
                      &lt;script src=&quot;https://unpkg.com/react-llm&quot;&gt;&lt;/script&gt;
                    </div>
                    <div className="text-muted-foreground mt-2 mb-1"># Initialize</div>
                    <div>ReactLLM.init(&#123; apiKey: &apos;your-key&apos; &#125;)</div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Supports OpenAI, Anthropic, Google, and OpenRouter APIs
                </p>
                <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
                  <span className="px-2 py-1 bg-muted rounded">GPT-4</span>
                  <span className="px-2 py-1 bg-muted rounded">Claude 3</span>
                  <span className="px-2 py-1 bg-muted rounded">Gemini Pro</span>
                  <span className="px-2 py-1 bg-muted rounded">OpenRouter</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}