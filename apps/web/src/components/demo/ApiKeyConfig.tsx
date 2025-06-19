'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { reactLLMApi, detectApiKeys } from '@/lib/demo-api'

interface ApiKeyConfigProps {
  isOpen: boolean
  onClose: () => void
  onConfigUpdate: () => void
}

export function ApiKeyConfig({ isOpen, onClose, onConfigUpdate }: ApiKeyConfigProps) {
  const [keys, setKeys] = useState({
    openRouterKey: '',
    anthropicKey: '',
    openaiKey: '',
    googleKey: ''
  })
  
  const [showKeys, setShowKeys] = useState({
    openRouterKey: false,
    anthropicKey: false,
    openaiKey: false,
    googleKey: false
  })

  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (isOpen) {
      // Load existing keys
      const existingKeys = detectApiKeys()
      setKeys({
        openRouterKey: existingKeys.openRouterKey || '',
        anthropicKey: existingKeys.anthropicKey || '',
        openaiKey: existingKeys.openaiKey || '',
        googleKey: existingKeys.googleKey || ''
      })
    }
  }, [isOpen])

  const handleSave = async () => {
    setIsSaving(true)
    
    try {
      // Save to localStorage
      const keysToSave = Object.fromEntries(
        Object.entries(keys).filter(([, value]) => value.trim().length > 0)
      )
      
      localStorage.setItem('react-llm-demo-keys', JSON.stringify(keysToSave))
      
      // Update API configuration
      reactLLMApi.updateConfig({
        ...keysToSave,
        simulationMode: Object.keys(keysToSave).length === 0
      })
      
      // Reinitialize API
      await reactLLMApi.initialize()
      
      onConfigUpdate()
      onClose()
    } catch (error) {
      console.error('Failed to save API keys:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleClear = () => {
    setKeys({
      openRouterKey: '',
      anthropicKey: '',
      openaiKey: '',
      googleKey: ''
    })
    localStorage.removeItem('react-llm-demo-keys')
  }

  const providers = [
    {
      key: 'openRouterKey' as const,
      name: 'OpenRouter',
      description: 'Access to 100+ models including GPT-4, Claude, Gemini',
      placeholder: 'sk-or-...',
      recommended: true,
      website: 'https://openrouter.ai'
    },
    {
      key: 'anthropicKey' as const,
      name: 'Anthropic',
      description: 'Claude 3.5 Sonnet, Claude 3 Opus',
      placeholder: 'sk-ant-...',
      website: 'https://console.anthropic.com'
    },
    {
      key: 'openaiKey' as const,
      name: 'OpenAI',
      description: 'GPT-4o, GPT-4 Turbo, GPT-3.5',
      placeholder: 'sk-...',
      website: 'https://platform.openai.com'
    },
    {
      key: 'googleKey' as const,
      name: 'Google AI',
      description: 'Gemini 2.0 Flash, Gemini 1.5 Pro',
      placeholder: 'AI...',
      website: 'https://makersuite.google.com'
    }
  ]

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="border-b border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">API Configuration</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Add your API keys to test with real AI models (optional)
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Warning */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div className="text-sm">
                  <p className="font-medium text-yellow-800">Demo Mode Available</p>
                  <p className="text-yellow-700 mt-1">
                    The demo works in simulation mode without API keys. Add keys only if you want to test with real AI models.
                  </p>
                </div>
              </div>
            </div>

            {/* API Key Inputs */}
            <div className="space-y-4">
              {providers.map((provider) => (
                <div key={provider.key} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-gray-900">{provider.name}</h3>
                      {provider.recommended && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          Recommended
                        </span>
                      )}
                    </div>
                    <a
                      href={provider.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Get API Key →
                    </a>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{provider.description}</p>
                  <div className="relative">
                    <input
                      type={showKeys[provider.key] ? 'text' : 'password'}
                      value={keys[provider.key]}
                      onChange={(e) => setKeys(prev => ({ ...prev, [provider.key]: e.target.value }))}
                      placeholder={provider.placeholder}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKeys(prev => ({ ...prev, [provider.key]: !prev[provider.key] }))}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showKeys[provider.key] ? (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Security Note */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div className="text-sm">
                  <p className="font-medium text-blue-800">Security & Privacy</p>
                  <p className="text-blue-700 mt-1">
                    API keys are stored locally in your browser and never sent to our servers. 
                    They&apos;re only used to communicate directly with AI providers.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
            <button
              onClick={handleClear}
              className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Clear All Keys
            </button>
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSaving ? 'Saving...' : 'Save Configuration'}
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}