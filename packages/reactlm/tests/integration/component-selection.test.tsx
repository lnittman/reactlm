import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentSelector } from '../../src/components/ComponentSelector'
import { mockCanvas, mockShadowDOM, createMockChatSession } from '../test-utils'

// Mock bippy adapter
vi.mock('../../src/instrumentation/bippy-adapter', () => ({
  BippyAdapter: vi.fn().mockImplementation(() => ({
    startSelection: vi.fn(),
    stopSelection: vi.fn(),
    getComponentAtPoint: vi.fn().mockReturnValue({
      name: 'Button',
      props: { onClick: 'function', children: 'Click me' },
      source: 'export const Button = ({ onClick, children }) => <button onClick={onClick}>{children}</button>',
      fiber: {
        type: 'button',
        elementType: 'button',
        stateNode: document.createElement('button')
      }
    }),
    highlightComponent: vi.fn(),
    clearHighlight: vi.fn()
  }))
}))

describe('Component Selection Integration', () => {
  let user: ReturnType<typeof userEvent.setup>
  let mockCanvas: any
  let mockShadowRoot: any

  beforeEach(() => {
    user = userEvent.setup()
    mockCanvas = mockCanvas()
    mockShadowRoot = mockShadowDOM()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should enable component selection mode', async () => {
    const onSelect = vi.fn()
    render(<ComponentSelector onSelect={onSelect} />)

    const selectButton = screen.getByRole('button', { name: /select component/i })
    await user.click(selectButton)

    expect(screen.getByText(/click on any component/i)).toBeInTheDocument()
    expect(selectButton).toHaveTextContent(/stop selecting/i)
  })

  it('should highlight component on hover', async () => {
    const onSelect = vi.fn()
    render(<ComponentSelector onSelect={onSelect} />)

    // Enable selection mode
    const selectButton = screen.getByRole('button', { name: /select component/i })
    await user.click(selectButton)

    // Simulate mouse move over a component
    const targetElement = document.createElement('button')
    targetElement.textContent = 'Test Button'
    document.body.appendChild(targetElement)

    fireEvent.mouseMove(targetElement, {
      clientX: 100,
      clientY: 100
    })

    // Wait for highlight to appear
    await waitFor(() => {
      expect(screen.getByTestId('component-highlight')).toBeInTheDocument()
    })

    document.body.removeChild(targetElement)
  })

  it('should select component on click', async () => {
    const onSelect = vi.fn()
    render(<ComponentSelector onSelect={onSelect} />)

    // Enable selection mode
    const selectButton = screen.getByRole('button', { name: /select component/i })
    await user.click(selectButton)

    // Create and click on a target element
    const targetElement = document.createElement('button')
    targetElement.textContent = 'Test Button'
    targetElement.setAttribute('data-testid', 'target-button')
    document.body.appendChild(targetElement)

    fireEvent.click(targetElement)

    await waitFor(() => {
      expect(onSelect).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Button',
          props: expect.any(Object),
          source: expect.stringContaining('export const Button')
        })
      )
    })

    document.body.removeChild(targetElement)
  })

  it('should show component info overlay after selection', async () => {
    const onSelect = vi.fn()
    render(<ComponentSelector onSelect={onSelect} />)

    // Enable selection and select a component
    const selectButton = screen.getByRole('button', { name: /select component/i })
    await user.click(selectButton)

    const targetElement = document.createElement('div')
    targetElement.setAttribute('data-testid', 'test-component')
    document.body.appendChild(targetElement)

    fireEvent.click(targetElement)

    await waitFor(() => {
      expect(screen.getByTestId('selected-component-info')).toBeInTheDocument()
      expect(screen.getByText('Button')).toBeInTheDocument()
      expect(screen.getByText(/props:/i)).toBeInTheDocument()
    })

    document.body.removeChild(targetElement)
  })

  it('should handle nested component selection', async () => {
    const onSelect = vi.fn()
    render(<ComponentSelector onSelect={onSelect} />)

    // Create nested structure
    const parentDiv = document.createElement('div')
    const childButton = document.createElement('button')
    const grandChildSpan = document.createElement('span')

    grandChildSpan.textContent = 'Click me'
    childButton.appendChild(grandChildSpan)
    parentDiv.appendChild(childButton)
    document.body.appendChild(parentDiv)

    // Enable selection
    const selectButton = screen.getByRole('button', { name: /select component/i })
    await user.click(selectButton)

    // Click on the deepest nested element
    fireEvent.click(grandChildSpan)

    await waitFor(() => {
      expect(onSelect).toHaveBeenCalled()
      // Should select the most specific React component
      const selectedComponent = onSelect.mock.calls[0][0]
      expect(selectedComponent.name).toBe('Button')
    })

    document.body.removeChild(parentDiv)
  })

  it('should disable selection mode after selecting component', async () => {
    const onSelect = vi.fn()
    render(<ComponentSelector onSelect={onSelect} />)

    // Enable selection
    const selectButton = screen.getByRole('button', { name: /select component/i })
    await user.click(selectButton)

    // Select a component
    const targetElement = document.createElement('button')
    document.body.appendChild(targetElement)
    fireEvent.click(targetElement)

    await waitFor(() => {
      expect(selectButton).toHaveTextContent(/select component/i)
      expect(screen.queryByText(/click on any component/i)).not.toBeInTheDocument()
    })

    document.body.removeChild(targetElement)
  })

  it('should handle selection cancellation', async () => {
    const onSelect = vi.fn()
    render(<ComponentSelector onSelect={onSelect} />)

    // Enable selection
    const selectButton = screen.getByRole('button', { name: /select component/i })
    await user.click(selectButton)

    // Cancel selection
    await user.click(selectButton)

    expect(screen.queryByText(/click on any component/i)).not.toBeInTheDocument()
    expect(selectButton).toHaveTextContent(/select component/i)
  })

  it('should handle keyboard navigation during selection', async () => {
    const onSelect = vi.fn()
    render(<ComponentSelector onSelect={onSelect} />)

    // Enable selection
    const selectButton = screen.getByRole('button', { name: /select component/i })
    await user.click(selectButton)

    // Press Escape to cancel
    fireEvent.keyDown(document, { key: 'Escape' })

    await waitFor(() => {
      expect(screen.queryByText(/click on any component/i)).not.toBeInTheDocument()
    })
  })

  it('should extract component props accurately', async () => {
    const onSelect = vi.fn()
    render(<ComponentSelector onSelect={onSelect} />)

    // Mock a component with complex props
    const BippyAdapter = require('../../src/instrumentation/bippy-adapter').BippyAdapter
    const mockAdapter = new BippyAdapter()
    mockAdapter.getComponentAtPoint.mockReturnValue({
      name: 'ComplexComponent',
      props: {
        title: 'Test Title',
        count: 42,
        isVisible: true,
        onClick: 'function',
        style: { color: 'red', fontSize: 16 },
        children: ['Hello', ' ', 'World']
      },
      source: 'export const ComplexComponent = (props) => <div>{props.children}</div>'
    })

    // Enable selection and click
    const selectButton = screen.getByRole('button', { name: /select component/i })
    await user.click(selectButton)

    const targetElement = document.createElement('div')
    document.body.appendChild(targetElement)
    fireEvent.click(targetElement)

    await waitFor(() => {
      expect(onSelect).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'ComplexComponent',
          props: expect.objectContaining({
            title: 'Test Title',
            count: 42,
            isVisible: true,
            onClick: 'function'
          })
        })
      )
    })

    document.body.removeChild(targetElement)
  })

  it('should handle component selection with React DevTools integration', async () => {
    const onSelect = vi.fn()
    render(<ComponentSelector onSelect={onSelect} />)

    // Mock React DevTools presence
    Object.defineProperty(window, '__REACT_DEVTOOLS_GLOBAL_HOOK__', {
      value: {
        getFiberByHostInstance: vi.fn().mockReturnValue({
          type: function TestComponent() {},
          memoizedProps: { test: 'prop' },
          elementType: { name: 'TestComponent' }
        })
      },
      configurable: true
    })

    const selectButton = screen.getByRole('button', { name: /select component/i })
    await user.click(selectButton)

    const targetElement = document.createElement('div')
    document.body.appendChild(targetElement)
    fireEvent.click(targetElement)

    await waitFor(() => {
      expect(onSelect).toHaveBeenCalled()
    })

    document.body.removeChild(targetElement)
  })

  it('should handle errors during component inspection', async () => {
    const onSelect = vi.fn()
    const onError = vi.fn()
    render(<ComponentSelector onSelect={onSelect} onError={onError} />)

    // Mock adapter to throw error
    const BippyAdapter = require('../../src/instrumentation/bippy-adapter').BippyAdapter
    const mockAdapter = new BippyAdapter()
    mockAdapter.getComponentAtPoint.mockImplementation(() => {
      throw new Error('Component inspection failed')
    })

    const selectButton = screen.getByRole('button', { name: /select component/i })
    await user.click(selectButton)

    const targetElement = document.createElement('div')
    document.body.appendChild(targetElement)
    fireEvent.click(targetElement)

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Component inspection failed'
        })
      )
    })

    document.body.removeChild(targetElement)
  })
})