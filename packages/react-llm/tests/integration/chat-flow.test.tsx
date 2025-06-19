import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Toolbar } from '../../src/components/Toolbar'
import { mockDatabase, mockOpenRouterClient, mockGeminiClient, createMockChatSession, createMockMessage } from '../test-utils'

// Mock dependencies
vi.mock('../../src/db/database', () => ({
  Database: vi.fn().mockImplementation(() => mockDatabase())
}))

vi.mock('../../src/llm/openrouter', () => ({
  OpenRouterClient: vi.fn().mockImplementation(() => mockOpenRouterClient)
}))

vi.mock('../../src/gemini/gemini', () => ({
  GeminiClient: vi.fn().mockImplementation(() => mockGeminiClient)
}))

describe('Chat Flow Integration', () => {
  let user: ReturnType<typeof userEvent.setup>
  let mockDB: any

  beforeEach(() => {
    user = userEvent.setup()
    mockDB = mockDatabase()
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

  it('should initialize chat session and load history', async () => {
    const mockSession = createMockChatSession()
    const mockMessages = [
      createMockMessage({ role: 'user', content: 'Hello' }),
      createMockMessage({ role: 'assistant', content: 'Hi there!' })
    ]

    mockDB.getActiveChatSession.mockResolvedValue(mockSession)
    mockDB.getMessages.mockResolvedValue(mockMessages)

    render(<Toolbar {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByText('Hello')).toBeInTheDocument()
      expect(screen.getByText('Hi there!')).toBeInTheDocument()
    })

    expect(mockDB.getActiveChatSession).toHaveBeenCalled()
    expect(mockDB.getMessages).toHaveBeenCalledWith(mockSession.id)
  })

  it('should send message and get AI response', async () => {
    const mockSession = createMockChatSession()
    mockDB.getActiveChatSession.mockResolvedValue(mockSession)
    mockDB.getMessages.mockResolvedValue([])
    mockDB.addMessage.mockResolvedValue(1)

    // Mock streaming response
    mockOpenRouterClient.chat.mockImplementation(async function* () {
      yield 'Thank you for your question! '
      yield 'I can help you with React components. '
      yield 'What specifically would you like to know?'
    })

    render(<Toolbar {...defaultProps} />)

    const input = screen.getByRole('textbox', { name: /chat input/i })
    const sendButton = screen.getByRole('button', { name: /send/i })

    await user.type(input, 'How do I create a React component?')
    await user.click(sendButton)

    // Verify user message was added
    await waitFor(() => {
      expect(mockDB.addMessage).toHaveBeenCalledWith({
        chat_session_id: mockSession.id,
        role: 'user',
        content: 'How do I create a React component?'
      })
    })

    // Wait for AI response to stream in
    await waitFor(() => {
      expect(screen.getByText(/Thank you for your question/)).toBeInTheDocument()
    }, { timeout: 5000 })

    // Verify AI response was saved
    expect(mockDB.addMessage).toHaveBeenCalledWith({
      chat_session_id: mockSession.id,
      role: 'assistant',
      content: expect.stringContaining('Thank you for your question')
    })
  })

  it('should handle structured AI response with files and docs', async () => {
    const mockSession = createMockChatSession()
    mockDB.getActiveChatSession.mockResolvedValue(mockSession)
    mockDB.getMessages.mockResolvedValue([])
    mockDB.addMessage.mockResolvedValue(1)

    // Mock Gemini response with structured content
    mockGeminiClient.generateContent.mockResolvedValue({
      response: {
        text: () => `Here's how to create a React component:

**Files:**
src/components/Button.tsx - A reusable button component

**Documentation:**
https://react.dev/reference/react/Component - React Component reference

**Suggestions:**
- How can I add props to this component?
- What about TypeScript types?

**Technologies:**
react, typescript`
      }
    })

    render(<Toolbar {...defaultProps} provider="gemini" />)

    const input = screen.getByRole('textbox', { name: /chat input/i })
    await user.type(input, 'Show me how to create a Button component{enter}')

    // Wait for response
    await waitFor(() => {
      expect(screen.getByText(/Here's how to create/)).toBeInTheDocument()
    })

    // Verify structured data was extracted and saved
    expect(mockDB.addRelevantFiles).toHaveBeenCalledWith(1, [
      expect.objectContaining({
        path: 'src/components/Button.tsx',
        reason: 'A reusable button component'
      })
    ])

    expect(mockDB.addDocumentationLinks).toHaveBeenCalledWith(1, [
      expect.objectContaining({
        url: 'https://react.dev/reference/react/Component',
        title: 'React Component reference'
      })
    ])

    expect(mockDB.addSuggestedQueries).toHaveBeenCalledWith(1, [
      'How can I add props to this component?',
      'What about TypeScript types?'
    ])
  })

  it('should create new chat session', async () => {
    mockDB.getActiveChatSession.mockResolvedValue(null)
    mockDB.createChatSession.mockResolvedValue(2)
    mockDB.setActiveChatSession.mockResolvedValue(undefined)

    render(<Toolbar {...defaultProps} />)

    const newChatButton = screen.getByRole('button', { name: /new chat/i })
    await user.click(newChatButton)

    await waitFor(() => {
      expect(mockDB.createChatSession).toHaveBeenCalledWith(
        expect.objectContaining({
          title: expect.stringContaining('Chat'),
          project_name: expect.any(String),
          project_type: 'react',
          project_description: expect.any(String)
        })
      )
    })

    expect(mockDB.setActiveChatSession).toHaveBeenCalledWith(2)
    expect(defaultProps.onSessionChange).toHaveBeenCalledWith(2)
  })

  it('should switch between chat sessions', async () => {
    const session1 = createMockChatSession({ id: 1, title: 'Session 1' })
    const session2 = createMockChatSession({ id: 2, title: 'Session 2' })

    mockDB.getActiveChatSession.mockResolvedValue(session1)
    mockDB.getChatSessions.mockResolvedValue([session1, session2])
    mockDB.getMessages.mockResolvedValue([])

    render(<Toolbar {...defaultProps} />)

    // Open session selector
    const sessionSelector = screen.getByRole('button', { name: /session 1/i })
    await user.click(sessionSelector)

    // Select session 2
    const session2Option = screen.getByText('Session 2')
    await user.click(session2Option)

    expect(mockDB.setActiveChatSession).toHaveBeenCalledWith(2)
    expect(defaultProps.onSessionChange).toHaveBeenCalledWith(2)
  })

  it('should delete chat session with confirmation', async () => {
    const session1 = createMockChatSession({ id: 1, title: 'Session 1' })
    const session2 = createMockChatSession({ id: 2, title: 'Session 2' })

    mockDB.getActiveChatSession.mockResolvedValue(session1)
    mockDB.getChatSessions.mockResolvedValue([session1, session2])
    mockDB.deleteChatSession.mockResolvedValue(undefined)

    render(<Toolbar {...defaultProps} />)

    // Click delete button
    const deleteButton = screen.getByRole('button', { name: /delete session/i })
    await user.click(deleteButton)

    // Confirm deletion
    const confirmButton = screen.getByRole('button', { name: /confirm/i })
    await user.click(confirmButton)

    expect(mockDB.deleteChatSession).toHaveBeenCalledWith(1)
    expect(defaultProps.onSessionChange).toHaveBeenCalled()
  })

  it('should handle model switching', async () => {
    mockDB.getActiveChatSession.mockResolvedValue(createMockChatSession())
    mockDB.getMessages.mockResolvedValue([])

    render(<Toolbar {...defaultProps} />)

    await waitFor(() => {
      const modelSelector = screen.getByRole('combobox', { name: /select model/i })
      expect(modelSelector).toBeInTheDocument()
    })

    const modelSelector = screen.getByRole('combobox', { name: /select model/i })
    await user.selectOptions(modelSelector, 'anthropic/claude-3-opus')

    expect(modelSelector).toHaveValue('anthropic/claude-3-opus')

    // Send message with new model
    const input = screen.getByRole('textbox', { name: /chat input/i })
    await user.type(input, 'Test with Claude{enter}')

    await waitFor(() => {
      expect(mockOpenRouterClient.chat).toHaveBeenCalledWith(
        expect.any(Array),
        expect.objectContaining({
          model: 'anthropic/claude-3-opus'
        })
      )
    })
  })

  it('should handle API errors gracefully', async () => {
    mockDB.getActiveChatSession.mockResolvedValue(createMockChatSession())
    mockDB.getMessages.mockResolvedValue([])

    // Mock API error
    mockOpenRouterClient.chat.mockRejectedValue(new Error('API rate limit exceeded'))

    render(<Toolbar {...defaultProps} />)

    const input = screen.getByRole('textbox', { name: /chat input/i })
    await user.type(input, 'This will fail{enter}')

    await waitFor(() => {
      expect(defaultProps.onError).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'API rate limit exceeded'
        })
      )
    })

    // Error should be displayed in UI
    expect(screen.getByText(/error/i)).toBeInTheDocument()
  })

  it('should handle database errors', async () => {
    mockDB.getActiveChatSession.mockRejectedValue(new Error('Database connection failed'))

    render(<Toolbar {...defaultProps} />)

    await waitFor(() => {
      expect(defaultProps.onError).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Database connection failed'
        })
      )
    })
  })

  it('should save and restore chat state', async () => {
    const mockSession = createMockChatSession()
    mockDB.getActiveChatSession.mockResolvedValue(mockSession)
    mockDB.getMessages.mockResolvedValue([])

    const { unmount } = render(<Toolbar {...defaultProps} />)

    // Send a message
    const input = screen.getByRole('textbox', { name: /chat input/i })
    await user.type(input, 'Save this message')
    await user.click(screen.getByRole('button', { name: /send/i }))

    // Verify message was saved
    await waitFor(() => {
      expect(mockDB.addMessage).toHaveBeenCalled()
    })

    // Unmount and remount component
    unmount()

    mockDB.getMessages.mockResolvedValue([
      createMockMessage({ content: 'Save this message', role: 'user' })
    ])

    render(<Toolbar {...defaultProps} />)

    // Verify message was restored
    await waitFor(() => {
      expect(screen.getByText('Save this message')).toBeInTheDocument()
    })
  })

  it('should handle component context in messages', async () => {
    const mockSession = createMockChatSession()
    mockDB.getActiveChatSession.mockResolvedValue(mockSession)
    mockDB.getMessages.mockResolvedValue([])

    render(<Toolbar {...defaultProps} />)

    // Simulate component selection
    fireEvent(window, new CustomEvent('react-llm-component-selected', {
      detail: {
        name: 'Button',
        props: { onClick: 'function', children: 'Click me' },
        source: 'export const Button = () => <button>Click me</button>'
      }
    }))

    const input = screen.getByRole('textbox', { name: /chat input/i })
    await user.type(input, 'How can I improve this component?{enter}')

    await waitFor(() => {
      expect(mockOpenRouterClient.chat).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            content: expect.stringContaining('Component: Button')
          })
        ]),
        expect.any(Object)
      )
    })
  })

  it('should handle message history pagination', async () => {
    const mockSession = createMockChatSession()
    const manyMessages = Array.from({ length: 100 }, (_, i) =>
      createMockMessage({ content: `Message ${i}`, role: i % 2 === 0 ? 'user' : 'assistant' })
    )

    mockDB.getActiveChatSession.mockResolvedValue(mockSession)
    mockDB.getMessages.mockResolvedValue(manyMessages.slice(0, 50))

    render(<Toolbar {...defaultProps} />)

    // Verify initial messages are loaded
    await waitFor(() => {
      expect(screen.getByText('Message 0')).toBeInTheDocument()
      expect(screen.getByText('Message 49')).toBeInTheDocument()
    })

    // Scroll to top to load more
    const messageContainer = screen.getByTestId('messages-container')
    fireEvent.scroll(messageContainer, { target: { scrollTop: 0 } })

    // Load more messages
    mockDB.getMessages.mockResolvedValue(manyMessages.slice(50, 100))

    await waitFor(() => {
      expect(screen.getByText('Message 99')).toBeInTheDocument()
    })
  })
})