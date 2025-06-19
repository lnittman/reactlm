'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface GradientTextProps {
  children: React.ReactNode
  className?: string
  colors?: {
    from: string
    to: string
  }
}

export function GradientText({ 
  children, 
  className, 
  colors = { from: '#00DC82', to: '#3b82f6' } 
}: GradientTextProps) {
  return (
    <span 
      className={cn('gradient-text', className)}
      style={{
        background: `linear-gradient(to right, ${colors.from}, ${colors.to})`,
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}
    >
      {children}
    </span>
  )
}