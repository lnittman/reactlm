'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TourStep {
  id: string
  title: string
  content: string
  target?: string
  position: 'top' | 'bottom' | 'left' | 'right' | 'center'
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'welcome',
    title: 'Welcome to React LLM Demo! 👋',
    content: 'This interactive demo shows how React LLM works. You can select components visually and modify them with AI assistance.',
    position: 'center'
  },
  {
    id: 'components',
    title: 'Interactive Components',
    content: 'Click any component on the left to select it. You\'ll see a visual highlight and the component becomes active for AI modifications.',
    position: 'right'
  },
  {
    id: 'models',
    title: 'AI Model Selection',
    content: 'Choose from popular AI models like GPT-4, Claude 3.5, or Gemini. Each model has different strengths for code modification.',
    position: 'left'
  },
  {
    id: 'quick-actions',
    title: 'Quick Actions',
    content: 'Use pre-built actions like "Make Responsive" or "Add Animation" for common modifications, or chat freely with the AI.',
    position: 'left'
  },
  {
    id: 'chat',
    title: 'AI Chat Interface',
    content: 'Chat naturally with the AI about your selected component. Ask for styling changes, functionality additions, or improvements.',
    position: 'left'
  },
  {
    id: 'real-api',
    title: 'Live API Integration',
    content: 'Want to test with real AI? Click "Configure API" to add your API keys and switch from demo mode to live AI responses.',
    position: 'bottom'
  }
]

interface DemoTourProps {
  isVisible: boolean
  onComplete: () => void
  onSkip: () => void
}

export function DemoTour({ isVisible, onComplete, onSkip }: DemoTourProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setCurrentStep(0)
    }
  }, [isVisible])

  const handleNext = () => {
    if (isAnimating) return
    
    setIsAnimating(true)
    setTimeout(() => {
      if (currentStep < TOUR_STEPS.length - 1) {
        setCurrentStep(currentStep + 1)
      } else {
        onComplete()
      }
      setIsAnimating(false)
    }, 200)
  }

  const handlePrevious = () => {
    if (isAnimating || currentStep === 0) return
    
    setIsAnimating(true)
    setTimeout(() => {
      setCurrentStep(currentStep - 1)
      setIsAnimating(false)
    }, 200)
  }

  const handleSkip = () => {
    onSkip()
  }

  if (!isVisible) return null

  const step = TOUR_STEPS[currentStep]
  const progress = ((currentStep + 1) / TOUR_STEPS.length) * 100

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden"
        >
          {/* Progress bar */}
          <div className="bg-gray-100 h-1">
            <motion.div
              className="bg-blue-600 h-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="text-center mb-6">
              <motion.h3
                key={step.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xl font-semibold text-gray-900 mb-3"
              >
                {step.title}
              </motion.h3>
              <motion.p
                key={`${step.id}-content`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-gray-600 leading-relaxed"
              >
                {step.content}
              </motion.p>
            </div>

            {/* Step indicator dots */}
            <div className="flex justify-center space-x-2 mb-6">
              {TOUR_STEPS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentStep
                      ? 'bg-blue-600'
                      : index < currentStep
                      ? 'bg-blue-300'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <button
                onClick={handleSkip}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Skip Tour
              </button>

              <div className="flex items-center space-x-3">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 0 || isAnimating}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={isAnimating}
                  className="px-6 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {currentStep === TOUR_STEPS.length - 1 ? 'Get Started' : 'Next'}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// Hook to manage tour state
export function useDemoTour() {
  const [showTour, setShowTour] = useState(false)
  
  useEffect(() => {
    // Check if user has seen the tour before
    const hasSeenTour = localStorage.getItem('react-llm-demo-tour-completed')
    if (!hasSeenTour) {
      // Show tour after a short delay
      const timer = setTimeout(() => {
        setShowTour(true)
      }, 3000)
      
      return () => clearTimeout(timer)
    }
  }, [])

  const completeTour = () => {
    setShowTour(false)
    localStorage.setItem('react-llm-demo-tour-completed', 'true')
  }

  const skipTour = () => {
    setShowTour(false)
    localStorage.setItem('react-llm-demo-tour-completed', 'true')
  }

  const restartTour = () => {
    localStorage.removeItem('react-llm-demo-tour-completed')
    setShowTour(true)
  }

  return {
    showTour,
    completeTour,
    skipTour,
    restartTour
  }
}