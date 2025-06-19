import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Toolbar } from './Toolbar'
import { mockShadowDOM, mockDatabase, createMockChatSession, createMockMessage } from '../../tests/test-utils'

// Mock the database
vi.mock('../db/database', () => ({
  Database: vi.fn().mockImplementation(() => mockDatabase())
}))

// Mock LLM providers
vi.mock('../llm/openrouter', () => ({
  OpenRouterClient: vi.fn().mockImplementation(() => ({
    getAvailableModels: vi.fn().mockResolvedValue([
      { id: 'openai/gpt-4o', name: 'GPT-4o' },
      { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus' }
    ]),
    chat: vi.fn().mockImplementation(async function* () {
      yield 'Mock AI response'
    })
  }))
}))

describe('Toolbar', () => {
  let user: ReturnType<typeof userEvent.setup>
  let mockShadowRoot: any

  beforeEach(() => {
    user = userEvent.setup()
    mockShadowRoot = mockShadowDOM()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  const defaultProps = {
    apiKey: 'test-api-key',
    onError: vi.fn(),
    onSessionChange: vi.fn()
  }

  describe('rendering', () => {
    it('should render toolbar with initial state', () => {
      render(<Toolbar {...defaultProps} />)

      expect(screen.getByRole('button', { name: /new chat/i })).toBeInTheDocument()
      expect(screen.getByRole('textbox', { name: /chat input/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument()
    })

    it('should render model selector when multiple models available', async () => {
      render(<Toolbar {...defaultProps} />)

      await waitFor(() => {
        expect(screen.getByRole('combobox', { name: /select model/i })).toBeInTheDocument()
      })
    })

    it('should show loading state during initialization', () => {
      render(<Toolbar {...defaultProps} />)

      expect(screen.getByText(/initializing/i)).toBeInTheDocument()
    })

    it('should render minimized when minimized prop is true', () => {
      render(<Toolbar {...defaultProps} minimized={true} />)

      expect(screen.getByRole('button', { name: /expand/i })).toBeInTheDocument()
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument()
    })
  })

  describe('chat functionality', () => {
    it('should send message when form is submitted', async () => {
      const mockChat = vi.fn().mockImplementation(async function* () {
        yield 'AI response to your message'
      })

      vi.mocked(require('../llm/openrouter').OpenRouterClient).mockImplementation(() => ({
        getAvailableModels: vi.fn().mockResolvedValue([]),
        chat: mockChat
      }))

      render(<Toolbar {...defaultProps} />)

      const input = screen.getByRole('textbox', { name: /chat input/i })
      const sendButton = screen.getByRole('button', { name: /send/i })

      await user.type(input, 'Hello, AI!')
      await user.click(sendButton)

      await waitFor(() => {
        expect(mockChat).toHaveBeenCalledWith(
          expect.arrayContaining([
            expect.objectContaining({
              role: 'user',
              content: 'Hello, AI!'
            })
          ]),
          expect.any(Object)
        )
      })

      expect(input).toHaveValue('')
    })

    it('should handle Enter key to send message', async () => {
      render(<Toolbar {...defaultProps} />)

      const input = screen.getByRole('textbox', { name: /chat input/i })

      await user.type(input, 'Test message{enter}')

      await waitFor(() => {
        expect(input).toHaveValue('')
      })
    })

    it('should handle Shift+Enter for new line', async () => {
      render(<Toolbar {...defaultProps} />)

      const input = screen.getByRole('textbox', { name: /chat input/i })

      await user.type(input, 'Line 1{shift}{enter}Line 2')

      expect(input).toHaveValue('Line 1\nLine 2')
    })

    it('should disable send button when input is empty', () => {
      render(<Toolbar {...defaultProps} />)

      const sendButton = screen.getByRole('button', { name: /send/i })
      expect(sendButton).toBeDisabled()
    })

    it('should enable send button when input has content', async () => {
      render(<Toolbar {...defaultProps} />)

      const input = screen.getByRole('textbox', { name: /chat input/i })
      const sendButton = screen.getByRole('button', { name: /send/i })

      await user.type(input, 'Hello')

      expect(sendButton).toBeEnabled()
    })
  })

  describe('session management', () => {
    it('should create new chat session', async () => {
      render(<Toolbar {...defaultProps} />)

      const newChatButton = screen.getByRole('button', { name: /new chat/i })
      await user.click(newChatButton)

      expect(defaultProps.onSessionChange).toHaveBeenCalled()
    })

    it('should switch between chat sessions', async () => {
      render(<Toolbar {...defaultProps} />)

      // Mock session selector
      const sessionSelector = screen.getByRole('button', { name: /session/i })
      await user.click(sessionSelector)

      const sessionOption = screen.getByText(/session 1/i)
      await user.click(sessionOption)

      expect(defaultProps.onSessionChange).toHaveBeenCalledWith(expect.any(String))
    })

    it('should delete chat session', async () => {
      render(<Toolbar {...defaultProps} />)

      const deleteButton = screen.getByRole('button', { name: /delete session/i })
      await user.click(deleteButton)

      // Confirm deletion
      const confirmButton = screen.getByRole('button', { name: /confirm/i })
      await user.click(confirmButton)

      expect(defaultProps.onSessionChange).toHaveBeenCalled()
    })
  })

  describe('message history', () => {
    it('should display message history', async () => {
      const mockMessages = [
        createMockMessage({ role: 'user', content: 'Hello' }),
        createMockMessage({ role: 'assistant', content: 'Hi there!' })
      ]

      // Mock database to return messages
      const mockDB = mockDatabase()
      mockDB.getMessages.mockResolvedValue(mockMessages)

      render(<Toolbar {...defaultProps} />)

      await waitFor(() => {
        expect(screen.getByText('Hello')).toBeInTheDocument()
        expect(screen.getByText('Hi there!')).toBeInTheDocument()
      })
    })

    it('should auto-scroll to latest message', async () => {
      const scrollIntoView = vi.fn()
      Element.prototype.scrollIntoView = scrollIntoView

      render(<Toolbar {...defaultProps} />)

      // Send a message to trigger scroll
      const input = screen.getByRole('textbox', { name: /chat input/i })
      await user.type(input, 'Test message{enter}')

      await waitFor(() => {
        expect(scrollIntoView).toHaveBeenCalled()
      })
    })

    it('should format markdown in messages', async () => {
      const messageWithMarkdown = createMockMessage({
        role: 'assistant',
        content: '```javascript\nconst hello = "world";\n```'
      })

      const mockDB = mockDatabase()
      mockDB.getMessages.mockResolvedValue([messageWithMarkdown])

      render(<Toolbar {...defaultProps} />)

      await waitFor(() => {
        expect(screen.getByRole('code')).toBeInTheDocument()
      })
    })
  })

  describe('error handling', () => {
    it('should handle API errors gracefully', async () => {
      const mockChat = vi.fn().mockRejectedValue(new Error('API Error'))

      vi.mocked(require('../llm/openrouter').OpenRouterClient).mockImplementation(() => ({
        getAvailableModels: vi.fn().mockResolvedValue([]),
        chat: mockChat
      }))

      render(<Toolbar {...defaultProps} />)

      const input = screen.getByRole('textbox', { name: /chat input/i })
      await user.type(input, 'Test message{enter}')

      await waitFor(() => {
        expect(defaultProps.onError).toHaveBeenCalledWith(expect.any(Error))
      })
    })

    it('should handle database errors', async () => {
      const mockDB = mockDatabase()
      mockDB.addMessage.mockRejectedValue(new Error('Database Error'))

      render(<Toolbar {...defaultProps} />)

      const input = screen.getByRole('textbox', { name: /chat input/i })
      await user.type(input, 'Test message{enter}')

      await waitFor(() => {
        expect(defaultProps.onError).toHaveBeenCalledWith(expect.any(Error))
      })
    })

    it('should show error message in UI', async () => {
      render(<Toolbar {...defaultProps} />)

      // Simulate error
      fireEvent(window, new CustomEvent('react-llm-error', {
        detail: { message: 'Something went wrong' }
      }))

      await waitFor(() => {
        expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
      })
    })
  })

  describe('accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<Toolbar {...defaultProps} />)

      expect(screen.getByRole('textbox', { name: /chat input/i })).toHaveAttribute('aria-label')
      expect(screen.getByRole('button', { name: /send/i })).toHaveAttribute('aria-label')
    })

    it('should support keyboard navigation', async () => {
      render(<Toolbar {...defaultProps} />)

      const input = screen.getByRole('textbox', { name: /chat input/i })
      
      // Tab to input
      await user.tab()
      expect(input).toHaveFocus()

      // Tab to send button
      await user.tab()
      expect(screen.getByRole('button', { name: /send/i })).toHaveFocus()
    })

    it('should announce messages to screen readers', async () => {
      render(<Toolbar {...defaultProps} />)

      const input = screen.getByRole('textbox', { name: /chat input/i })
      await user.type(input, 'Test message{enter}')

      await waitFor(() => {
        expect(screen.getByRole('status')).toBeInTheDocument()
      })
    })
  })

  describe('model selection', () => {
    it('should change model when different model is selected', async () => {
      render(<Toolbar {...defaultProps} />)

      await waitFor(() => {
        const modelSelector = screen.getByRole('combobox', { name: /select model/i })
        expect(modelSelector).toBeInTheDocument()
      })

      const modelSelector = screen.getByRole('combobox', { name: /select model/i })
      await user.selectOptions(modelSelector, 'anthropic/claude-3-opus')

      expect(modelSelector).toHaveValue('anthropic/claude-3-opus')
    })

    it('should show model capabilities info', async () => {
      render(<Toolbar {...defaultProps} />)

      await waitFor(() => {
        const infoButton = screen.getByRole('button', { name: /model info/i })
        expect(infoButton).toBeInTheDocument()
      })

      const infoButton = screen.getByRole('button', { name: /model info/i })
      await user.click(infoButton)

      expect(screen.getByText(/context length/i)).toBeInTheDocument()
    })
  })
})