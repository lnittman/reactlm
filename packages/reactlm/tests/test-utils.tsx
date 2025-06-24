import { render } from '@testing-library/react'
import type { RenderOptions } from '@testing-library/react'
import { vi } from 'vitest'

// Test utilities for React LLM components
export * from '@testing-library/react'
export { userEvent } from '@testing-library/user-event'

// Custom render function that includes providers
export const renderWithProviders = (ui: React.ReactElement, options?: RenderOptions) => {
  return render(ui, {
    wrapper: ({ children }) => <div data-testid="test-wrapper">{children}</div>,
    ...options
  })
}

// Mock data factories
export const createMockChatSession = (overrides = {}) => ({
  id: 'test-session-1',
  title: 'Test Chat Session',
  created_at: new Date().toISOString(),
  project_name: 'Test Project',
  project_type: 'react',
  project_description: 'A test React project',
  is_active: true,
  ...overrides
})

export const createMockMessage = (overrides = {}) => ({
  id: 'test-message-1',
  chat_session_id: 'test-session-1',
  role: 'user' as const,
  content: 'Test message content',
  timestamp: new Date().toISOString(),
  ...overrides
})

export const createMockLLMResponse = (overrides = {}) => ({
  files: [
    {
      path: 'src/components/Button.tsx',
      reason: 'Component being discussed',
      file_type: 'component',
      snippet: 'export const Button = () => <button>Click me</button>'
    }
  ],
  docs: [
    {
      url: 'https://react.dev/reference/react/useState',
      title: 'useState – React',
      description: 'useState is a React Hook that adds state to functional components'
    }
  ],
  suggestions: [
    'How can I style this button?',
    'Can you add click handlers?'
  ],
  technologies: ['react', 'typescript'],
  ...overrides
})

// Component mocks
export const mockComponent = (name: string) => {
  const Component = vi.fn(() => <div data-testid={`mock-${name.toLowerCase()}`}>{name}</div>)
  Component.displayName = name
  return Component
}

// DOM mocks
export const mockShadowDOM = () => {
  const shadowRoot = {
    appendChild: vi.fn(),
    removeChild: vi.fn(),
    getElementById: vi.fn(),
    querySelector: vi.fn(),
    querySelectorAll: vi.fn(() => []),
    innerHTML: '',
    host: document.createElement('div')
  }
  
  Element.prototype.attachShadow = vi.fn(() => shadowRoot)
  return shadowRoot
}

// File System mocks
export const mockFileSystemAccess = () => {
  const mockFile = {
    name: 'test-file.tsx',
    type: 'text/typescript',
    size: 1024,
    text: vi.fn().mockResolvedValue('export const Test = () => <div>Test</div>')
  }

  const mockFileHandle = {
    getFile: vi.fn().mockResolvedValue(mockFile),
    createWritable: vi.fn().mockResolvedValue({
      write: vi.fn(),
      close: vi.fn()
    })
  }

  global.showOpenFilePicker = vi.fn().mockResolvedValue([mockFileHandle])
  global.showSaveFilePicker = vi.fn().mockResolvedValue(mockFileHandle)

  return { mockFile, mockFileHandle }
}

// Canvas mocks for component overlay
export const mockCanvas = () => {
  const mockContext = {
    fillRect: vi.fn(),
    strokeRect: vi.fn(),
    clearRect: vi.fn(),
    beginPath: vi.fn(),
    closePath: vi.fn(),
    stroke: vi.fn(),
    fill: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    arc: vi.fn(),
    fillText: vi.fn(),
    measureText: vi.fn(() => ({ width: 100 })),
    setTransform: vi.fn(),
    translate: vi.fn(),
    scale: vi.fn(),
    rotate: vi.fn(),
    save: vi.fn(),
    restore: vi.fn()
  }

  HTMLCanvasElement.prototype.getContext = vi.fn(() => mockContext)
  return mockContext
}

// Worker mocks
export const mockWorker = () => {
  global.Worker = class MockWorker {
    url: string
    onmessage: ((event: MessageEvent) => void) | null = null
    onerror: ((event: ErrorEvent) => void) | null = null

    constructor(url: string) {
      this.url = url
    }

    postMessage(data: any) {
      // Simulate async worker response
      setTimeout(() => {
        if (this.onmessage) {
          this.onmessage(new MessageEvent('message', { data: { result: 'mock-result' } }))
        }
      }, 0)
    }

    terminate() {
      // Mock cleanup
    }
  }
}

// Database mocks
export const mockDatabase = () => {
  const mockDB = {
    run: vi.fn(),
    exec: vi.fn(),
    prepare: vi.fn(() => ({
      get: vi.fn(),
      all: vi.fn().mockReturnValue([]),
      run: vi.fn(),
      finalize: vi.fn()
    })),
    close: vi.fn()
  }

  return mockDB
}

export const waitForNextTick = () => new Promise(resolve => setTimeout(resolve, 0))