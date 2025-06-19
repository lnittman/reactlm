'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChatMessage } from '@/lib/demo-simulation'

interface DemoChatProps {
  messages: ChatMessage[]
  isLoading: boolean
  onSendMessage: (message: string) => void
  currentModel: string
}

function CodeBlock({ code, language = 'tsx' }: { code: string, language?: string }) {
  return (
    <div className="bg-gray-900 text-gray-100 rounded-lg p-3 my-2 text-sm font-mono overflow-x-auto">
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-400 text-xs uppercase">{language}</span>
        <button 
          onClick={() => navigator.clipboard?.writeText(code)}
          className="text-gray-400 hover:text-gray-200 text-xs"
        >
          Copy
        </button>
      </div>
      <pre className="whitespace-pre-wrap">{code}</pre>
    </div>
  )
}

function CodeChanges({ before, after, language }: { before: string, after: string, language: string }) {
  return (
    <div className="my-3 border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
        <span className="text-sm font-medium text-gray-700">Code Changes</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
        <div className="p-3">
          <div className="text-xs text-red-600 font-medium mb-2">- Before</div>
          <CodeBlock code={before} language={language} />
        </div>
        <div className="p-3">
          <div className="text-xs text-green-600 font-medium mb-2">+ After</div>
          <CodeBlock code={after} language={language} />
        </div>
      </div>
    </div>
  )
}

function MessageContent({ message }: { message: ChatMessage }) {
  return (
    <div className="space-y-2">
      <div className="whitespace-pre-wrap">{message.content}</div>
      
      {message.metadata?.codeChanges && (
        <CodeChanges 
          before={message.metadata.codeChanges.before}
          after={message.metadata.codeChanges.after}
          language={message.metadata.codeChanges.language}
        />
      )}
      
      {message.metadata?.actionType && (
        <div className="flex items-center space-x-2 text-xs text-gray-500 mt-2">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
            {message.metadata.actionType.replace('-', ' ')}
          </span>
          {message.metadata.componentId && (
            <span>on {message.metadata.componentId}</span>
          )}
        </div>
      )}
    </div>
  )
}

export function DemoChat({ messages, isLoading, onSendMessage, currentModel }: DemoChatProps) {
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim())
      setInputValue('')
    }
  }

  const suggestedQuestions = [
    "Make this component more accessible",
    "Add hover animations",
    "Change to a modern color scheme",
    "Make it responsive for mobile",
    "Add dark mode support"
  ]

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm font-medium text-gray-700">React LLM Chat</span>
        </div>
        <div className="text-xs text-gray-500">
          {currentModel}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`
                max-w-[80%] px-3 py-2 rounded-lg text-sm
                ${message.role === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-900 border border-gray-200'
                }
              `}>
                <MessageContent message={message} />
                <div className={`text-xs mt-1 opacity-70 ${
                  message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString([], { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Loading indicator */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-gray-100 border border-gray-200 rounded-lg px-3 py-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-gray-600">Thinking...</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Questions */}
      {messages.length <= 2 && !isLoading && (
        <div className="px-3 py-2 border-t border-gray-200">
          <div className="text-xs text-gray-500 mb-2">Try asking:</div>
          <div className="flex flex-wrap gap-1">
            {suggestedQuestions.slice(0, 3).map((question, index) => (
              <button
                key={index}
                onClick={() => {
                  setInputValue(question)
                  inputRef.current?.focus()
                }}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded-full transition-colors"
              >
                {question}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me to modify the component..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  )
}