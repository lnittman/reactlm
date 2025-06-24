import { test, expect } from '@playwright/test'

test.describe('React LLM Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Block external API calls to prevent rate limiting during tests
    await page.route('**/openrouter.ai/**', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [
            { id: 'openai/gpt-4o', name: 'GPT-4o', context_length: 128000 },
            { id: 'anthropic/claude-3-opus', name: 'Claude 3 Opus', context_length: 200000 }
          ]
        })
      })
    })
    
    await page.route('**/openrouter.ai/api/v1/chat/completions', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          choices: [{
            message: { content: 'This is a test response from the AI assistant.' }
          }]
        })
      })
    })
  })

  test('should load React LLM on marketing site', async ({ page }) => {
    await page.goto('/')
    
    // Wait for page to load
    await expect(page.locator('h1')).toContainText('React LLM')
    
    // Check if demo section exists
    await expect(page.locator('[data-testid="live-demo"]')).toBeVisible()
  })

  test('should initialize React LLM programmatically', async ({ page }) => {
    await page.goto('/')
    
    // Add React LLM script
    await page.addScriptTag({
      url: 'http://localhost:3001/react-llm.js'
    })
    
    // Initialize React LLM
    await page.evaluate(() => {
      window.ReactLLM.init({
        providers: { openrouter: 'test-key' },
        mode: 'demo'
      })
    })
    
    // Wait for toolbar to appear
    await expect(page.locator('[data-testid="react-llm-toolbar"]')).toBeVisible({ timeout: 5000 })
  })

  test('should open chat interface and send message', async ({ page }) => {
    await page.goto('/')
    
    // Add and initialize React LLM
    await page.addScriptTag({
      url: 'http://localhost:3001/react-llm.js'
    })
    
    await page.evaluate(() => {
      window.ReactLLM.init({
        providers: { openrouter: 'test-key' },
        mode: 'demo'
      })
    })
    
    // Wait for toolbar and click to expand
    const toolbar = page.locator('[data-testid="react-llm-toolbar"]')
    await expect(toolbar).toBeVisible()
    
    // Click expand button if minimized
    const expandButton = page.locator('[data-testid="expand-button"]')
    if (await expandButton.isVisible()) {
      await expandButton.click()
    }
    
    // Type message in chat input
    const chatInput = page.locator('[data-testid="chat-input"]')
    await expect(chatInput).toBeVisible()
    await chatInput.fill('Hello, can you help me with React components?')
    
    // Send message
    const sendButton = page.locator('[data-testid="send-button"]')
    await sendButton.click()
    
    // Wait for AI response
    await expect(page.locator('[data-testid="message"][data-role="assistant"]')).toBeVisible({ timeout: 10000 })
    
    // Verify response content
    const response = page.locator('[data-testid="message"][data-role="assistant"]').last()
    await expect(response).toContainText('test response')
  })

  test('should select model from dropdown', async ({ page }) => {
    await page.goto('/')
    
    // Initialize React LLM
    await page.addScriptTag({
      url: 'http://localhost:3001/react-llm.js'
    })
    
    await page.evaluate(() => {
      window.ReactLLM.init({
        providers: { openrouter: 'test-key' },
        mode: 'demo'
      })
    })
    
    // Wait for model selector
    const modelSelector = page.locator('[data-testid="model-selector"]')
    await expect(modelSelector).toBeVisible()
    
    // Click to open dropdown
    await modelSelector.click()
    
    // Select Claude model
    await page.locator('[data-value="anthropic/claude-3-opus"]').click()
    
    // Verify selection
    await expect(modelSelector).toContainText('Claude 3 Opus')
  })

  test('should handle component selection mode', async ({ page }) => {
    await page.goto('/')
    
    // Add some test components to the page
    await page.evaluate(() => {
      const testDiv = document.createElement('div')
      testDiv.setAttribute('data-testid', 'test-component')
      testDiv.className = 'test-component'
      testDiv.textContent = 'Test Component'
      testDiv.style.cssText = 'padding: 20px; background: #f0f0f0; margin: 10px;'
      document.body.appendChild(testDiv)
    })
    
    // Initialize React LLM
    await page.addScriptTag({
      url: 'http://localhost:3001/react-llm.js'
    })
    
    await page.evaluate(() => {
      window.ReactLLM.init({
        providers: { openrouter: 'test-key' },
        mode: 'demo'
      })
    })
    
    // Activate component selection mode
    const selectButton = page.locator('[data-testid="component-select-button"]')
    await expect(selectButton).toBeVisible()
    await selectButton.click()
    
    // Click on test component
    await page.locator('[data-testid="test-component"]').click()
    
    // Verify component is selected
    await expect(page.locator('[data-testid="selected-component-info"]')).toBeVisible()
    await expect(page.locator('[data-testid="selected-component-info"]')).toContainText('Test Component')
  })

  test('should handle new chat session creation', async ({ page }) => {
    await page.goto('/')
    
    // Initialize React LLM
    await page.addScriptTag({
      url: 'http://localhost:3001/react-llm.js'
    })
    
    await page.evaluate(() => {
      window.ReactLLM.init({
        providers: { openrouter: 'test-key' },
        mode: 'demo'
      })
    })
    
    // Click new chat button
    const newChatButton = page.locator('[data-testid="new-chat-button"]')
    await expect(newChatButton).toBeVisible()
    await newChatButton.click()
    
    // Verify new session is created
    await expect(page.locator('[data-testid="chat-sessions"]')).toContainText('New Chat')
  })

  test('should persist chat history', async ({ page }) => {
    await page.goto('/')
    
    // Initialize React LLM
    await page.addScriptTag({
      url: 'http://localhost:3001/react-llm.js'
    })
    
    await page.evaluate(() => {
      window.ReactLLM.init({
        providers: { openrouter: 'test-key' },
        mode: 'demo'
      })
    })
    
    // Send a message
    const chatInput = page.locator('[data-testid="chat-input"]')
    await chatInput.fill('Test persistence message')
    await page.locator('[data-testid="send-button"]').click()
    
    // Wait for response
    await expect(page.locator('[data-testid="message"][data-role="assistant"]')).toBeVisible()
    
    // Reload page
    await page.reload()
    
    // Re-initialize React LLM
    await page.addScriptTag({
      url: 'http://localhost:3001/react-llm.js'
    })
    
    await page.evaluate(() => {
      window.ReactLLM.init({
        providers: { openrouter: 'test-key' },
        mode: 'demo'
      })
    })
    
    // Verify message history is restored
    await expect(page.locator('[data-testid="message"]')).toContainText('Test persistence message')
  })

  test('should handle errors gracefully', async ({ page }) => {
    await page.goto('/')
    
    // Mock API error
    await page.route('**/openrouter.ai/api/v1/chat/completions', route => {
      route.fulfill({
        status: 429,
        contentType: 'application/json',
        body: JSON.stringify({
          error: { message: 'Rate limit exceeded' }
        })
      })
    })
    
    // Initialize React LLM
    await page.addScriptTag({
      url: 'http://localhost:3001/react-llm.js'
    })
    
    await page.evaluate(() => {
      window.ReactLLM.init({
        providers: { openrouter: 'test-key' },
        mode: 'demo'
      })
    })
    
    // Send message that will trigger error
    await page.locator('[data-testid="chat-input"]').fill('This should trigger an error')
    await page.locator('[data-testid="send-button"]').click()
    
    // Verify error message is displayed
    await expect(page.locator('[data-testid="error-message"]')).toBeVisible()
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Rate limit exceeded')
  })

  test('should work on mobile devices', async ({ page, isMobile }) => {
    if (!isMobile) test.skip('This test is only for mobile devices')
    
    await page.goto('/')
    
    // Initialize React LLM
    await page.addScriptTag({
      url: 'http://localhost:3001/react-llm.js'
    })
    
    await page.evaluate(() => {
      window.ReactLLM.init({
        providers: { openrouter: 'test-key' },
        mode: 'demo'
      })
    })
    
    // Verify toolbar is responsive
    const toolbar = page.locator('[data-testid="react-llm-toolbar"]')
    await expect(toolbar).toBeVisible()
    
    // Check if mobile-specific layout is applied
    await expect(toolbar).toHaveClass(/mobile/)
    
    // Test touch interactions
    await page.tap('[data-testid="expand-button"]')
    await expect(page.locator('[data-testid="chat-input"]')).toBeVisible()
  })
})