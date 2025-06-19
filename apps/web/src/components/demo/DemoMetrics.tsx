'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface DemoMetricsProps {
  selectedModel: string
  messagesCount: number
  componentsInteracted: number
  isVisible: boolean
}

export function DemoMetrics({ 
  selectedModel, 
  messagesCount, 
  componentsInteracted, 
  isVisible 
}: DemoMetricsProps) {
  const [stats, setStats] = useState({
    tokensUsed: 0,
    responseTime: 0,
    costEstimate: 0
  })

  useEffect(() => {
    if (messagesCount > 0) {
      // Simulate realistic metrics
      const baseTokens = messagesCount * 150
      const variation = Math.random() * 50
      const tokensUsed = Math.floor(baseTokens + variation)
      
      const responseTime = 800 + Math.random() * 1200 // 0.8-2.0s
      
      // Rough cost estimation based on model
      const costPerK = selectedModel.includes('gpt-4') ? 0.03 : 
                       selectedModel.includes('claude') ? 0.015 : 0.001
      const costEstimate = (tokensUsed / 1000) * costPerK

      setStats({
        tokensUsed,
        responseTime: Math.floor(responseTime),
        costEstimate: Number(costEstimate.toFixed(4))
      })
    }
  }, [messagesCount, selectedModel])

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg p-3 shadow-sm"
      >
        <div className="text-xs font-medium text-gray-700 mb-2">Demo Metrics</div>
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <div className="text-gray-500">Messages</div>
            <div className="font-semibold text-gray-900">{messagesCount}</div>
          </div>
          <div>
            <div className="text-gray-500">Components</div>
            <div className="font-semibold text-gray-900">{componentsInteracted}</div>
          </div>
          <div>
            <div className="text-gray-500">Tokens</div>
            <div className="font-semibold text-gray-900">{stats.tokensUsed.toLocaleString()}</div>
          </div>
          <div>
            <div className="text-gray-500">Avg Response</div>
            <div className="font-semibold text-gray-900">{stats.responseTime}ms</div>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-gray-200">
          <div className="flex justify-between items-center text-xs">
            <span className="text-gray-500">Est. Cost</span>
            <span className="font-semibold text-green-600">${stats.costEstimate}</span>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}