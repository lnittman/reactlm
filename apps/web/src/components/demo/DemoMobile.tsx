'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DEMO_COMPONENTS } from './DemoContent'
import { DemoControls } from './DemoControls'
import { DemoChat } from './DemoChat'
interface DemoMobileProps {
  demoState: {
    selectedComponent: string | null
    highlightedComponent: string | null
    messages: Array<{ id: string; role: string; content: string; timestamp: Date }>
    currentModel: string
    isLoading: boolean
  }
  onComponentSelect: (id: string) => void
  onComponentHover: (id: string | null) => void
  onModelChange: (id: string) => void
  onQuickAction: (action: string) => void
  onChatMessage: (message: string) => void
  onReset: () => void
}

export function DemoMobile({
  demoState,
  onComponentSelect,
  onModelChange,
  onQuickAction,
  onChatMessage,
  onReset
}: DemoMobileProps) {
  const [activeTab, setActiveTab] = useState<'components' | 'controls' | 'chat'>('components')

  const tabs = [
    { id: 'components', label: 'Components', icon: '🧩' },
    { id: 'controls', label: 'Controls', icon: '⚙️' },
    { id: 'chat', label: 'Chat', icon: '💬' }
  ] as const

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Mobile header */}
      <div className="bg-gray-50 border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">React LLM Demo</h2>
          <button
            onClick={onReset}
            className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1 rounded-md transition-colors"
          >
            Reset
          </button>
        </div>
        {demoState.selectedComponent && (
          <div className="mt-2 text-sm text-blue-600 font-medium">
            Selected: {demoState.selectedComponent}
          </div>
        )}
      </div>

      {/* Tab navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.id === 'chat' && demoState.messages.length > 1 && (
                <span className="bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {demoState.messages.length - 1}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {activeTab === 'components' && (
            <motion.div
              key="components"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="h-full overflow-y-auto p-4 space-y-4"
            >
              <div className="text-sm text-gray-600 mb-4">
                Tap any component to select it for AI modifications
              </div>
              {DEMO_COMPONENTS.map((component) => {
                const Component = component.component
                return (
                  <div key={component.id} className="space-y-2">
                    <div className="text-sm font-mono text-gray-500">
                      &lt;{component.name} /&gt;
                    </div>
                    <Component
                      name={component.name}
                      type={component.type}
                      isSelected={demoState.selectedComponent === component.id}
                      isHighlighted={demoState.highlightedComponent === component.id}
                      onClick={() => onComponentSelect(component.id)}
                      code={component.code}
                    />
                  </div>
                )
              })}
            </motion.div>
          )}

          {activeTab === 'controls' && (
            <motion.div
              key="controls"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="h-full overflow-y-auto p-4"
            >
              <DemoControls
                selectedModel={demoState.currentModel}
                onModelChange={onModelChange}
                onQuickAction={onQuickAction}
                isLoading={demoState.isLoading}
              />
            </motion.div>
          )}

          {activeTab === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="h-full"
            >
              <DemoChat
                messages={demoState.messages}
                isLoading={demoState.isLoading}
                onSendMessage={onChatMessage}
                currentModel={demoState.currentModel}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}