import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, screen, waitFor } from '@testing-library/preact';
import { Toolbar } from '../components/Toolbar';
import { LLMHub } from '../llm/providers';
import { darkTheme, lightTheme } from '../styles/theme';

// Mock dependencies
vi.mock('../llm/providers');
vi.mock('../db/database', () => ({
  initDB: vi.fn().mockResolvedValue(true),
  createChatSession: vi.fn().mockResolvedValue('session-1'),
  createMessage: vi.fn().mockResolvedValue('message-1'),
  getChatSessions: vi.fn().mockResolvedValue([]),
  getMessagesForChatSession: vi.fn().mockResolvedValue([]),
  deleteChatSession: vi.fn().mockResolvedValue(true),
}));

describe('Theme Switching Integration', () => {
  let hub: any;
  
  beforeEach(() => {
    // Mock LLMHub
    hub = {
      isInitialized: vi.fn().mockReturnValue(true),
      getActiveModel: vi.fn().mockReturnValue({ id: 'gpt-4', name: 'GPT-4' }),
      completeChat: vi.fn().mockResolvedValue('AI response'),
      getAvailableModels: vi.fn().mockReturnValue([
        { id: 'gpt-4', name: 'GPT-4' },
      ]),
    };
    vi.mocked(LLMHub).mockImplementation(() => hub);
  });
  
  it('should apply dark theme by default', async () => {
    const { container } = render(<Toolbar hub={hub} />);
    
    await waitFor(() => {
      expect(screen.queryByPlaceholderText(/type a message/i)).toBeInTheDocument();
    });
    
    // Check for dark theme CSS variables in style tag
    const styleElement = container.querySelector('style');
    expect(styleElement?.textContent).toContain('--theme-background:');
    expect(styleElement?.textContent).toContain(darkTheme.background);
    expect(styleElement?.textContent).toContain(darkTheme.foreground);
  });
  
  it('should have correct dark theme colors for chat interface', async () => {
    const { container } = render(<Toolbar hub={hub} />);
    
    await waitFor(() => {
      expect(screen.queryByPlaceholderText(/type a message/i)).toBeInTheDocument();
    });
    
    const styleElement = container.querySelector('style');
    const styles = styleElement?.textContent || '';
    
    // Check chat-specific dark theme colors
    expect(styles).toContain(`--theme-chat-user-bg: ${darkTheme.chat.userBg}`);
    expect(styles).toContain(`--theme-chat-assistant-bg: ${darkTheme.chat.assistantBg}`);
    expect(styles).toContain(`--theme-toolbar-background: ${darkTheme.toolbar.background}`);
  });
  
  it('should apply theme to dropdown components', async () => {
    const { container } = render(<Toolbar hub={hub} />);
    
    await waitFor(() => {
      expect(screen.queryByPlaceholderText(/type a message/i)).toBeInTheDocument();
    });
    
    // Type @ to trigger context selector dropdown
    const input = screen.getByPlaceholderText(/type a message/i);
    fireEvent.input(input, { target: { value: '@' } });
    
    await waitFor(() => {
      expect(screen.getByText('@console')).toBeInTheDocument();
    });
    
    // Check dropdown styling
    const contextSelector = container.querySelector('.context-selector');
    const selectorStyles = contextSelector?.querySelector('style')?.textContent || '';
    
    expect(selectorStyles).toContain('var(--theme-dropdown-background)');
    expect(selectorStyles).toContain('var(--theme-dropdown-border)');
    expect(selectorStyles).toContain('var(--theme-dropdown-shadow)');
  });
  
  it('should style buttons according to theme', async () => {
    const { container } = render(<Toolbar hub={hub} />);
    
    await waitFor(() => {
      expect(screen.queryByTitle('Selected Components')).toBeInTheDocument();
    });
    
    const styles = container.querySelector('style')?.textContent || '';
    
    // Check button theme variables
    expect(styles).toContain(`--theme-button-primary-bg: ${darkTheme.button.primary.background}`);
    expect(styles).toContain(`--theme-button-primary-text: ${darkTheme.button.primary.text}`);
    expect(styles).toContain(`--theme-button-primary-hover: ${darkTheme.button.primary.hover}`);
  });
  
  it('should apply theme to component inspector overlay', async () => {
    const { container } = render(<Toolbar hub={hub} />);
    
    await waitFor(() => {
      expect(screen.queryByTitle('Selected Components')).toBeInTheDocument();
    });
    
    // Open components view
    fireEvent.click(screen.getByTitle('Selected Components'));
    
    await waitFor(() => {
      expect(screen.getByText('Selected Components')).toBeInTheDocument();
    });
    
    // Click select component to enable inspector
    fireEvent.click(screen.getByText('Select a Component'));
    
    // Check that component inspector uses theme colors
    const inspector = container.querySelector('[data-testid="component-inspector"]');
    expect(inspector).toHaveAttribute('theme', 'dark');
  });
  
  it('should style loading states with theme', async () => {
    const { container } = render(<Toolbar hub={hub} />);
    
    // Set hub to initializing state
    hub.isInitialized.mockReturnValue(false);
    
    await waitFor(() => {
      const toolbar = container.querySelector('.toolbar');
      expect(toolbar).toBeInTheDocument();
    });
    
    const styles = container.querySelector('style')?.textContent || '';
    
    // Check loading animation uses theme colors
    expect(styles).toContain('@keyframes pulse');
    expect(styles).toContain('opacity: 0.5');
  });
  
  it('should apply theme to scrollbars', async () => {
    const { container } = render(<Toolbar hub={hub} />);
    
    await waitFor(() => {
      expect(screen.queryByPlaceholderText(/type a message/i)).toBeInTheDocument();
    });
    
    const styles = container.querySelector('style')?.textContent || '';
    
    // Check scrollbar styling
    expect(styles).toContain('::-webkit-scrollbar');
    expect(styles).toContain('::-webkit-scrollbar-track');
    expect(styles).toContain('::-webkit-scrollbar-thumb');
    expect(styles).toContain('var(--theme-border)');
  });
  
  it('should maintain theme consistency across views', async () => {
    const { container } = render(<Toolbar hub={hub} />);
    
    await waitFor(() => {
      expect(screen.queryByTitle('Select Model')).toBeInTheDocument();
    });
    
    // Switch to models view
    fireEvent.click(screen.getByTitle('Select Model'));
    
    await waitFor(() => {
      expect(screen.getByText('Model Selection')).toBeInTheDocument();
    });
    
    // Check that model view uses same theme
    const modelView = container.querySelector('.view-container');
    expect(modelView).toBeInTheDocument();
    
    // Switch to settings view
    fireEvent.click(screen.getByTitle('Settings'));
    
    await waitFor(() => {
      expect(screen.getByText('Settings')).toBeInTheDocument();
    });
    
    // All views should maintain consistent theming
    const viewContainer = container.querySelector('.view-container');
    expect(viewContainer).toBeInTheDocument();
  });
  
  it('should theme status messages correctly', async () => {
    const { container } = render(<Toolbar hub={hub} />);
    
    await waitFor(() => {
      expect(screen.queryByPlaceholderText(/type a message/i)).toBeInTheDocument();
    });
    
    const styles = container.querySelector('style')?.textContent || '';
    
    // Check status color theming
    expect(styles).toContain(`--theme-status-success: ${darkTheme.status.success}`);
    expect(styles).toContain(`--theme-status-warning: ${darkTheme.status.warning}`);
    expect(styles).toContain(`--theme-status-error: ${darkTheme.status.error}`);
    expect(styles).toContain(`--theme-status-info: ${darkTheme.status.info}`);
  });
  
  it('should apply focus styles from theme', async () => {
    const { container } = render(<Toolbar hub={hub} />);
    
    await waitFor(() => {
      expect(screen.queryByPlaceholderText(/type a message/i)).toBeInTheDocument();
    });
    
    const input = screen.getByPlaceholderText(/type a message/i);
    
    // Focus the input
    fireEvent.focus(input);
    
    const styles = container.querySelector('style')?.textContent || '';
    
    // Check focus styling uses theme
    expect(styles).toContain(':focus');
    expect(styles).toContain('var(--theme-focus)');
    expect(styles).toContain(`--theme-focus: ${darkTheme.focus}`);
  });
});