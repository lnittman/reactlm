'use client'

import React from 'react'
import { motion } from 'framer-motion'

interface DemoComponentProps {
  name: string
  type: 'button' | 'card' | 'form' | 'header' | 'nav'
  isSelected: boolean
  isHighlighted: boolean
  onClick: () => void
  code?: string
}

export function DemoButton({ isSelected, isHighlighted, onClick }: Omit<DemoComponentProps, 'name' | 'type' | 'code'>) {
  return (
    <motion.div
      className={`relative cursor-pointer transition-all duration-200 ${
        isSelected || isHighlighted ? 'z-10' : ''
      }`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      animate={{
        scale: isSelected ? 1.05 : 1,
        boxShadow: isSelected 
          ? '0 0 20px rgba(99, 102, 241, 0.4)' 
          : isHighlighted 
          ? '0 0 15px rgba(99, 102, 241, 0.2)' 
          : '0 0 0px rgba(0, 0, 0, 0)'
      }}
    >
      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
        Get Started
      </button>
      {(isSelected || isHighlighted) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none"
        />
      )}
    </motion.div>
  )
}

export function DemoCard({ isSelected, isHighlighted, onClick }: Omit<DemoComponentProps, 'name' | 'type' | 'code'>) {
  return (
    <motion.div
      className={`relative cursor-pointer transition-all duration-200 ${
        isSelected || isHighlighted ? 'z-10' : ''
      }`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      animate={{
        scale: isSelected ? 1.05 : 1,
        boxShadow: isSelected 
          ? '0 0 20px rgba(99, 102, 241, 0.4)' 
          : isHighlighted 
          ? '0 0 15px rgba(99, 102, 241, 0.2)' 
          : '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Feature Card</h3>
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <p className="text-gray-600 text-sm">
          This is an example card component that demonstrates the visual selection capabilities.
        </p>
      </div>
      {(isSelected || isHighlighted) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none"
        />
      )}
    </motion.div>
  )
}

export function DemoForm({ isSelected, isHighlighted, onClick }: Omit<DemoComponentProps, 'name' | 'type' | 'code'>) {
  return (
    <motion.div
      className={`relative cursor-pointer transition-all duration-200 ${
        isSelected || isHighlighted ? 'z-10' : ''
      }`}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      animate={{
        scale: isSelected ? 1.05 : 1,
        boxShadow: isSelected 
          ? '0 0 20px rgba(99, 102, 241, 0.4)' 
          : isHighlighted 
          ? '0 0 15px rgba(99, 102, 241, 0.2)' 
          : '0 0 0px rgba(0, 0, 0, 0)'
      }}
    >
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h4 className="text-sm font-medium text-gray-900 mb-3">Contact Form</h4>
        <div className="space-y-3">
          <input 
            type="text" 
            placeholder="Your name" 
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            readOnly
          />
          <input 
            type="email" 
            placeholder="your@email.com" 
            className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
            readOnly
          />
          <button className="w-full bg-gray-900 text-white py-2 rounded text-sm font-medium">
            Submit
          </button>
        </div>
      </div>
      {(isSelected || isHighlighted) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none"
        />
      )}
    </motion.div>
  )
}

export function DemoHeader({ isSelected, isHighlighted, onClick }: Omit<DemoComponentProps, 'name' | 'type' | 'code'>) {
  return (
    <motion.div
      className={`relative cursor-pointer transition-all duration-200 ${
        isSelected || isHighlighted ? 'z-10' : ''
      }`}
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      animate={{
        scale: isSelected ? 1.02 : 1,
        boxShadow: isSelected 
          ? '0 0 20px rgba(99, 102, 241, 0.4)' 
          : isHighlighted 
          ? '0 0 15px rgba(99, 102, 241, 0.2)' 
          : '0 0 0px rgba(0, 0, 0, 0)'
      }}
    >
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-blue-600 rounded font-bold text-white flex items-center justify-center text-sm">
              R
            </div>
            <h1 className="text-xl font-bold text-gray-900">React LLM Demo</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Features</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Docs</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">GitHub</a>
          </nav>
        </div>
      </header>
      {(isSelected || isHighlighted) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 border-2 border-blue-500 rounded pointer-events-none"
        />
      )}
    </motion.div>
  )
}

export function DemoNavigation({ isSelected, isHighlighted, onClick }: Omit<DemoComponentProps, 'name' | 'type' | 'code'>) {
  return (
    <motion.div
      className={`relative cursor-pointer transition-all duration-200 ${
        isSelected || isHighlighted ? 'z-10' : ''
      }`}
      onClick={onClick}
      whileHover={{ scale: 1.01 }}
      animate={{
        scale: isSelected ? 1.02 : 1,
        boxShadow: isSelected 
          ? '0 0 20px rgba(99, 102, 241, 0.4)' 
          : isHighlighted 
          ? '0 0 15px rgba(99, 102, 241, 0.2)' 
          : '0 0 0px rgba(0, 0, 0, 0)'
      }}
    >
      <nav className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <ul className="space-y-2">
          <li><a href="#" className="text-blue-600 font-medium text-sm">Dashboard</a></li>
          <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Components</a></li>
          <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Settings</a></li>
          <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Help</a></li>
        </ul>
      </nav>
      {(isSelected || isHighlighted) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 border-2 border-blue-500 rounded-lg pointer-events-none"
        />
      )}
    </motion.div>
  )
}

export const DEMO_COMPONENTS = [
  {
    id: 'header',
    name: 'Header',
    type: 'header' as const,
    component: DemoHeader,
    code: `function Header() {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-blue-600 rounded font-bold text-white flex items-center justify-center text-sm">
            R
          </div>
          <h1 className="text-xl font-bold text-gray-900">React LLM Demo</h1>
        </div>
        <nav className="hidden md:flex space-x-6">
          <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Features</a>
          <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Docs</a>
          <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">GitHub</a>
        </nav>
      </div>
    </header>
  )
}`
  },
  {
    id: 'button',
    name: 'Button',
    type: 'button' as const,
    component: DemoButton,
    code: `function Button() {
  return (
    <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
      Get Started
    </button>
  )
}`
  },
  {
    id: 'card',
    name: 'Card',
    type: 'card' as const,
    component: DemoCard,
    code: `function Card() {
  return (
    <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Feature Card</h3>
        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      <p className="text-gray-600 text-sm">
        This is an example card component that demonstrates the visual selection capabilities.
      </p>
    </div>
  )
}`
  },
  {
    id: 'form',
    name: 'Form',
    type: 'form' as const,
    component: DemoForm,
    code: `function ContactForm() {
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      <h4 className="text-sm font-medium text-gray-900 mb-3">Contact Form</h4>
      <div className="space-y-3">
        <input 
          type="text" 
          placeholder="Your name" 
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
        />
        <input 
          type="email" 
          placeholder="your@email.com" 
          className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
        />
        <button className="w-full bg-gray-900 text-white py-2 rounded text-sm font-medium">
          Submit
        </button>
      </div>
    </div>
  )
}`
  },
  {
    id: 'navigation',
    name: 'Navigation',
    type: 'nav' as const,
    component: DemoNavigation,
    code: `function Navigation() {
  return (
    <nav className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <ul className="space-y-2">
        <li><a href="#" className="text-blue-600 font-medium text-sm">Dashboard</a></li>
        <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Components</a></li>
        <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Settings</a></li>
        <li><a href="#" className="text-gray-600 hover:text-gray-900 text-sm">Help</a></li>
      </ul>
    </nav>
  )
}`
  }
] as const

export type DemoComponentType = typeof DEMO_COMPONENTS[number]