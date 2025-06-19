'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface AIModel {
  id: string
  name: string
  provider: string
  description: string
  pricing: string
  featured?: boolean
}

export const AI_MODELS: AIModel[] = [
  {
    id: 'gpt-4o',
    name: 'GPT-4o',
    provider: 'OpenAI',
    description: 'Latest multimodal model with enhanced coding capabilities',
    pricing: '$5/1M tokens',
    featured: true
  },
  {
    id: 'claude-3-5-sonnet',
    name: 'Claude 3.5 Sonnet',
    provider: 'Anthropic',
    description: 'Excellent for code analysis and refactoring',
    pricing: '$3/1M tokens',
    featured: true
  },
  {
    id: 'gemini-2-flash',
    name: 'Gemini 2.0 Flash',
    provider: 'Google',
    description: 'Fast and efficient for component generation',
    pricing: '$0.075/1M tokens',
    featured: true
  },
  {
    id: 'gpt-4-turbo',
    name: 'GPT-4 Turbo',
    provider: 'OpenAI',
    description: 'Powerful model for complex coding tasks',
    pricing: '$10/1M tokens'
  },
  {
    id: 'claude-3-opus',
    name: 'Claude 3 Opus',
    provider: 'Anthropic',
    description: 'Most capable model for advanced reasoning',
    pricing: '$15/1M tokens'
  },
  {
    id: 'llama-3-70b',
    name: 'Llama 3 70B',
    provider: 'Meta',
    description: 'Open source alternative with strong performance',
    pricing: '$0.81/1M tokens'
  }
]

interface DemoControlsProps {
  selectedModel: string
  onModelChange: (modelId: string) => void
  onQuickAction: (action: string) => void
  isLoading?: boolean
}

export function DemoControls({ 
  selectedModel, 
  onModelChange, 
  onQuickAction, 
  isLoading 
}: DemoControlsProps) {
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false)
  
  const currentModel = AI_MODELS.find(m => m.id === selectedModel) || AI_MODELS[0]
  
  const quickActions = [
    { id: 'make-responsive', label: 'Make Responsive', icon: '📱' },
    { id: 'add-animation', label: 'Add Animation', icon: '✨' },
    { id: 'change-colors', label: 'Change Colors', icon: '🎨' },
    { id: 'improve-accessibility', label: 'Improve A11y', icon: '♿' },
    { id: 'add-dark-mode', label: 'Add Dark Mode', icon: '🌙' },
    { id: 'optimize-performance', label: 'Optimize', icon: '⚡' }
  ]

  return (
    <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-lg p-4 shadow-lg">
      {/* Model Selector */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          AI Model
        </label>
        <div className="relative">
          <button
            onClick={() => setIsModelSelectorOpen(!isModelSelectorOpen)}
            className="w-full flex items-center justify-between px-3 py-2 bg-white border border-gray-300 rounded-md text-sm hover:border-gray-400 transition-colors"
            disabled={isLoading}
          >
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="font-medium">{currentModel.name}</span>
              <span className="text-gray-500">({currentModel.provider})</span>
            </div>
            <motion.svg
              animate={{ rotate: isModelSelectorOpen ? 180 : 0 }}
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </motion.svg>
          </button>

          <AnimatePresence>
            {isModelSelectorOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto"
              >
                {AI_MODELS.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => {
                      onModelChange(model.id)
                      setIsModelSelectorOpen(false)
                    }}
                    className={`w-full text-left px-3 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 ${
                      model.id === selectedModel ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-gray-900">{model.name}</span>
                          {model.featured && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                              Popular
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {model.provider} • {model.pricing}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          {model.description}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Quick Actions
        </label>
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action) => (
            <button
              key={action.id}
              onClick={() => onQuickAction(action.id)}
              disabled={isLoading}
              className="flex items-center space-x-2 px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span>{action.icon}</span>
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Demo Status */}
      <div className="text-xs text-gray-500 text-center">
        <div className="flex items-center justify-center space-x-1">
          <div className={`w-2 h-2 rounded-full ${isLoading ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></div>
          <span>{isLoading ? 'Processing...' : 'Ready for interactions'}</span>
        </div>
      </div>
    </div>
  )
}