'use client'

import React from 'react'
import { 
  Zap, 
  Brain, 
  Code, 
  Palette, 
  Shield, 
  Globe,
  MousePointer,
  Sparkles
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/Button'

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <Card className="group relative hover:border-primary/20 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
      <CardHeader className="pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-primary/20 text-primary group-hover:bg-primary/30 transition-colors">
            {icon}
          </div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="leading-relaxed">{description}</CardDescription>
      </CardContent>
    </Card>
  )
}

export function Features() {
  const features = [
    {
      icon: <MousePointer className="w-5 h-5" />,
      title: "Visual Component Selection",
      description: "Click any component on your page to select it. Works with React, Next.js, and any React-based framework."
    },
    {
      icon: <Brain className="w-5 h-5" />,
      title: "Multi-Model AI Support",
      description: "Choose from GPT-4, Claude 3, Gemini Pro, and more. Switch models on the fly for different tasks."
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Live Code Editing",
      description: "See your changes instantly with hot module replacement. No build step, no refresh required."
    },
    {
      icon: <Code className="w-5 h-5" />,
      title: "Zero Configuration",
      description: "Drop in a single script tag or npm package. No build tools, no configuration files needed."
    },
    {
      icon: <Palette className="w-5 h-5" />,
      title: "Component Library",
      description: "Save and organize components you like. Build a personal library of patterns and solutions."
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Production Safe",
      description: "Explore components on any website safely. Shadow DOM isolation prevents style conflicts."
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: "Browser Native",
      description: "Works entirely in the browser with WASM and modern web APIs. No server required."
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: "Context Aware",
      description: "AI understands your component structure, props, state, and surrounding code for better suggestions."
    }
  ]

  return (
    <section id="features" className="py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Powerful Features for{" "}
            <span className="gradient-text">Modern Development</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            React LLM brings AI-powered development directly to your browser, 
            with features designed for both development and production environments.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-6">Ready to transform your development workflow?</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" href="#install">
              Get Started Now
            </Button>
            <Button variant="outline" size="lg" href="/docs">
              View Documentation
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}