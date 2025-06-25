'use client'

import React from 'react'
import { Check, X, Star } from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

interface ComparisonFeature {
  feature: string
  reactLLM: boolean | string
  reactDevTools: boolean | string
  description?: string
}

const features: ComparisonFeature[] = [
  {
    feature: "Visual Component Selection",
    reactLLM: true,
    reactDevTools: "Manual navigation",
    description: "Click any component to select it vs browsing component tree"
  },
  {
    feature: "AI-Powered Code Generation",
    reactLLM: "GPT-4, Claude, Gemini",
    reactDevTools: false,
    description: "Generate and modify code with natural language"
  },
  {
    feature: "Live Code Editing",
    reactLLM: true,
    reactDevTools: false,
    description: "See changes instantly with HMR integration"
  },
  {
    feature: "Multi-Model AI Support",
    reactLLM: true,
    reactDevTools: false,
    description: "Choose the best AI model for your task"
  },
  {
    feature: "Component Library Management",
    reactLLM: true,
    reactDevTools: false,
    description: "Save and organize components across projects"
  },
  {
    feature: "Zero Configuration Setup",
    reactLLM: true,
    reactDevTools: "Browser extension",
    description: "Single script tag vs extension installation"
  },
  {
    feature: "Works on Any Website",
    reactLLM: true,
    reactDevTools: "Development only",
    description: "Explore components on live websites safely"
  },
  {
    feature: "Component State Inspection",
    reactLLM: true,
    reactDevTools: true,
    description: "Both provide state and props inspection"
  },
  {
    feature: "Performance Profiling",
    reactLLM: false,
    reactDevTools: true,
    description: "React DevTools excels at performance analysis"
  },
  {
    feature: "Component Tree Navigation",
    reactLLM: "AI-guided",
    reactDevTools: true,
    description: "Manual vs AI-assisted navigation"
  }
]

function FeatureRow({ feature }: { feature: ComparisonFeature }) {
  const renderValue = (value: boolean | string) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-5 h-5 text-green-500" />
      ) : (
        <X className="w-5 h-5 text-muted-foreground/50" />
      )
    }
    return <span className="text-sm text-foreground">{value}</span>
  }

  return (
    <div className="grid grid-cols-3 gap-4 py-4 border-b border-border last:border-b-0">
      <div>
        <div className="font-medium text-foreground">{feature.feature}</div>
        {feature.description && (
          <div className="text-sm text-muted-foreground mt-1">{feature.description}</div>
        )}
      </div>
      <div className="flex items-center justify-center">
        {renderValue(feature.reactLLM)}
      </div>
      <div className="flex items-center justify-center">
        {renderValue(feature.reactDevTools)}
      </div>
    </div>
  )
}

export function Comparison() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            React LLM vs{" "}
            <span className="gradient-text">React DevTools</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Both tools are powerful, but they serve different purposes. 
            Here&apos;s how React LLM complements your existing development workflow.
          </p>
        </div>

        <Card className="max-w-6xl mx-auto">
          <CardHeader>
            <div className="grid grid-cols-3 gap-4 text-center">
              <CardTitle className="text-lg text-muted-foreground">Feature</CardTitle>
              <CardTitle className="text-lg flex items-center justify-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                React LLM
              </CardTitle>
              <CardTitle className="text-lg text-foreground">React DevTools</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {features.map((feature, index) => (
                <FeatureRow key={index} feature={feature} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary/10 to-blue-500/10 border-primary/20">
            <CardContent className="pt-6">
              <h3 className="text-2xl font-bold mb-4">Perfect Together</h3>
              <p className="text-muted-foreground mb-6">
                React LLM and React DevTools complement each other perfectly. 
                Use DevTools for debugging and performance, React LLM for rapid development and AI assistance.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <div className="px-4 py-2 bg-primary/20 text-primary rounded-lg text-sm font-medium">
                  Use React LLM for: AI coding assistance
                </div>
                <div className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-medium">
                  Use DevTools for: Debugging & profiling
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}