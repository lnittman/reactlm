import { describe, it, expect, vi } from 'vitest'

describe('Testing Framework Setup', () => {
  it('should run basic test', () => {
    expect(1 + 1).toBe(2)
  })

  it('should handle async operations', async () => {
    const result = await Promise.resolve('test')
    expect(result).toBe('test')
  })

  it('should work with mocking', () => {
    const mockFn = vi.fn()
    mockFn('test')
    expect(mockFn).toHaveBeenCalledWith('test')
  })
})