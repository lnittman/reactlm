'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { DemoControls } from './DemoControls'
import { DemoChat } from './DemoChat'
import { DemoMobile } from './DemoMobile'
import { DemoMetrics } from './DemoMetrics'
import { ApiKeyConfig } from './ApiKeyConfig'
import { DemoTour, useDemoTour } from './DemoTour'
import { SandboxedApp } from './SandboxedApp'
import { demoSimulation } from '@/lib/demo-simulation'
import { reactLMApi, initializeDemoApi } from '@/lib/demo-api'

function DemoSkeleton() {
  return (
    <div className="h-full w-full bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto animate-spin border-2 border-transparent border-t-blue-600" />
        <p className="text-gray-600 text-sm">Loading interactive demo...</p>
      </div>
    </div>
  )
}

export function LiveDemo() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [demoState, setDemoState] = useState(demoSimulation.getState())
  const [isMobile, setIsMobile] = useState(false)
  const [showMetrics, setShowMetrics] = useState(false)
  const [showApiConfig, setShowApiConfig] = useState(false)
  const [apiMode, setApiMode] = useState<'simulation' | 'real'>('simulation')
  const [interactedComponents, setInteractedComponents] = useState(new Set<string>())
  const { showTour, completeTour, skipTour, restartTour } = useDemoTour()

  // Update state when simulation changes
  useEffect(() => {
    const interval = setInterval(() => {
      setDemoState(demoSimulation.getState())
    }, 100)

    return () => clearInterval(interval)
  }, [])

  // Check for mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Track component interactions
  useEffect(() => {
    if (demoState.selectedComponent) {
      setInteractedComponents(prev => new Set([...prev, demoState.selectedComponent!]))
    }
  }, [demoState.selectedComponent])

  useEffect(() => {
    // Initialize demo API
    const initDemo = async () => {
      // Load React LLM script
      const script = document.createElement('script')
      script.src = '/react-llm.js'
      script.async = true
      
      script.onload = async () => {
        await initializeDemoApi()
        setApiMode(reactLMApi.isSimulationMode() ? 'simulation' : 'real')
        setIsLoaded(true)
      }
      
      script.onerror = async () => {
        console.warn('Failed to load React LLM, using simulation mode')
        await initializeDemoApi()
        setApiMode('simulation')
        setIsLoaded(true)
      }
      
      document.body.appendChild(script)
    }
    
    initDemo()
  }, [])

  const handleComponentSelect = (componentId: string) => {
    demoSimulation.selectComponent(componentId)
  }

  const handleComponentHover = (componentId: string | null) => {
    demoSimulation.highlightComponent(componentId)
  }

  const handleModelChange = (modelId: string) => {
    demoSimulation.changeModel(modelId)
  }

  const handleQuickAction = (actionId: string) => {
    demoSimulation.processQuickAction(actionId)
  }

  const handleChatMessage = (message: string) => {
    demoSimulation.processChatMessage(message)
  }

  const handleReset = () => {
    demoSimulation.reset()
    setInteractedComponents(new Set())
  }

  const handleApiConfigUpdate = async () => {
    await initializeDemoApi()
    setApiMode(reactLMApi.isSimulationMode() ? 'simulation' : 'real')
  }

  // Mobile layout
  if (isMobile) {
    return (
      <div className="relative rounded-xl overflow-hidden bg-white border border-gray-200 shadow-2xl h-[80vh] max-h-[600px]">
        {!isLoaded ? (
          <DemoSkeleton />
        ) : (
          <DemoMobile
            demoState={demoState}
            onComponentSelect={handleComponentSelect}
            onComponentHover={handleComponentHover}
            onModelChange={handleModelChange}
            onQuickAction={handleQuickAction}
            onChatMessage={handleChatMessage}
            onReset={handleReset}
          />
        )}
      </div>
    )
  }

  return (
    <div className="relative rounded-xl overflow-hidden bg-white/50 backdrop-blur border border-gray-200 shadow-2xl">
      {/* Demo viewport */}
      <div className="aspect-video relative">
        {/* Fake browser chrome */}
        <div className="absolute top-0 inset-x-0 h-12 bg-gray-50/90 flex items-center px-6 gap-4 border-b border-gray-200">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="flex-1 text-center text-sm text-gray-600 font-mono">
            localhost:3000 - React LLM Demo
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-xs">
              <div className={`w-2 h-2 rounded-full ${apiMode === 'simulation' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
              <span className="text-gray-600">{apiMode === 'simulation' ? 'Demo Mode' : 'Live API'}</span>
            </div>
            <button
              onClick={() => setShowApiConfig(true)}
              className="text-xs bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-1 rounded-md transition-colors"
            >
              Configure API
            </button>
            <button
              onClick={restartTour}
              className="text-xs bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded-md transition-colors"
            >
              Help
            </button>
            <button
              onClick={() => setShowMetrics(!showMetrics)}
              className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-1 rounded-md transition-colors"
            >
              {showMetrics ? 'Hide' : 'Show'} Metrics
            </button>
            <button
              onClick={handleReset}
              className="text-xs bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md transition-colors"
            >
              Reset Demo
            </button>
          </div>
        </div>
        
        {/* Demo container */}
        <div className="pt-12 h-full">
          {!isLoaded ? (
            <DemoSkeleton />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full p-4">
              {/* Left: Sandboxed React App */}
              <div className="lg:col-span-2 bg-gray-50 rounded-lg overflow-hidden">
                <div className="h-full relative">
                  <SandboxedApp />
                  {/* React LLM will overlay component selection UI here */}
                </div>
              </div>
              
              {/* Right: Controls and Chat */}
              <div className="flex flex-col h-full space-y-4">
                {/* Metrics */}
                {showMetrics && (
                  <div className="flex-shrink-0">
                    <DemoMetrics
                      selectedModel={demoState.currentModel}
                      messagesCount={demoState.messages.length}
                      componentsInteracted={interactedComponents.size}
                      isVisible={showMetrics}
                    />
                  </div>
                )}
                
                {/* Controls */}
                <div className="flex-shrink-0">
                  <DemoControls
                    selectedModel={demoState.currentModel}
                    onModelChange={handleModelChange}
                    onQuickAction={handleQuickAction}
                    isLoading={demoState.isLoading}
                  />
                </div>
                
                {/* Chat */}
                <div className="flex-1 min-h-0">
                  <div className="h-full border border-gray-200 rounded-lg overflow-hidden">
                    <DemoChat
                      messages={demoState.messages}
                      isLoading={demoState.isLoading}
                      onSendMessage={handleChatMessage}
                      currentModel={demoState.currentModel}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Overlay instructions */}
        <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur rounded-lg p-4 border border-gray-200 shadow-lg">
          <div className="text-center">
            <p className="text-sm text-gray-700 font-medium mb-2">
              🎯 Interactive React LLM Demo
            </p>
            <p className="text-xs text-gray-600">
              Click components → Choose AI model → Use quick actions or chat to modify code
            </p>
            {demoState.selectedComponent && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-xs text-blue-600 font-medium"
              >
                Selected: {demoState.selectedComponent} • Ready for modifications!
              </motion.div>
            )}
          </div>
        </div>

        {/* API Configuration Modal */}
        <ApiKeyConfig
          isOpen={showApiConfig}
          onClose={() => setShowApiConfig(false)}
          onConfigUpdate={handleApiConfigUpdate}
        />

        {/* Demo Tour */}
        <DemoTour
          isVisible={showTour}
          onComplete={completeTour}
          onSkip={skipTour}
        />
      </div>
    </div>
  )
}