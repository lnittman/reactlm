import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, screen, waitFor } from '@testing-library/preact';
import userEvent from '@testing-library/user-event';
import { Toolbar } from '../components/Toolbar';
import { LLMHub } from '../llm/providers';
import { MonitorManager } from '../monitoring/monitor-manager';

// Mock dependencies
vi.mock('../llm/providers');
vi.mock('../monitoring/monitor-manager');
vi.mock('../db/database', () => ({
  initDB: vi.fn().mockResolvedValue(true),
  createChatSession: vi.fn().mockResolvedValue('session-1'),
  createMessage: vi.fn().mockResolvedValue('message-1'),
  getChatSessions: vi.fn().mockResolvedValue([]),
  getMessagesForChatSession: vi.fn().mockResolvedValue([]),
  deleteChatSession: vi.fn().mockResolvedValue(true),
}));

describe('@ Mention Flow Integration', () => {
  let hub: any;
  let monitorManager: any;
  let user: any;
  
  beforeEach(() => {
    user = userEvent.setup();
    
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
    
    // Mock MonitorManager
    monitorManager = new MonitorManager();
    monitorManager.getContext = vi.fn().mockReturnValue('Mocked context data');
    monitorManager.setSelectedComponents = vi.fn();
  });
  
  afterEach(() => {
    vi.clearAllMocks();
  });
  
  it('should show context selector when @ is typed', async () => {
    render(<Toolbar hub={hub} monitorManager={monitorManager} />);
    
    // Wait for initialization
    await waitFor(() => {
      expect(screen.queryByPlaceholderText(/type a message/i)).toBeInTheDocument();
    });
    
    const input = screen.getByPlaceholderText(/type a message/i);
    
    // Type @
    await user.type(input, '@');
    
    // Context selector should appear
    await waitFor(() => {
      expect(screen.getByText('@console')).toBeInTheDocument();
      expect(screen.getByText('@errors')).toBeInTheDocument();
      expect(screen.getByText('@network')).toBeInTheDocument();
      expect(screen.getByText('@performance')).toBeInTheDocument();
      expect(screen.getByText('@components')).toBeInTheDocument();
    });
  });
  
  it('should filter context options as user types', async () => {
    render(<Toolbar hub={hub} monitorManager={monitorManager} />);
    
    await waitFor(() => {
      expect(screen.queryByPlaceholderText(/type a message/i)).toBeInTheDocument();
    });
    
    const input = screen.getByPlaceholderText(/type a message/i);
    
    // Type @cons
    await user.type(input, '@cons');
    
    // Should only show console-related options
    await waitFor(() => {
      expect(screen.getByText('@console')).toBeInTheDocument();
      expect(screen.queryByText('@network')).not.toBeInTheDocument();
      expect(screen.queryByText('@performance')).not.toBeInTheDocument();
    });
  });
  
  it('should insert context when option is clicked', async () => {
    render(<Toolbar hub={hub} monitorManager={monitorManager} />);
    
    await waitFor(() => {
      expect(screen.queryByPlaceholderText(/type a message/i)).toBeInTheDocument();
    });
    
    const input = screen.getByPlaceholderText(/type a message/i) as HTMLInputElement;
    
    // Type @
    await user.type(input, 'Check the @');
    
    // Wait for context selector
    await waitFor(() => {
      expect(screen.getByText('@console')).toBeInTheDocument();
    });
    
    // Click on @console option
    fireEvent.click(screen.getByText('@console'));
    
    // Check that context was inserted
    await waitFor(() => {
      expect(input.value).toContain('Check the @console');
      expect(input.value).toContain('<!-- Context:');
      expect(input.value).toContain('Mocked context data');
    });
    
    // Context selector should be hidden
    expect(screen.queryByText('@errors')).not.toBeInTheDocument();
  });
  
  it('should navigate context options with keyboard', async () => {
    render(<Toolbar hub={hub} monitorManager={monitorManager} />);
    
    await waitFor(() => {
      expect(screen.queryByPlaceholderText(/type a message/i)).toBeInTheDocument();
    });
    
    const input = screen.getByPlaceholderText(/type a message/i);
    
    // Type @
    await user.type(input, '@');
    
    // Wait for context selector
    await waitFor(() => {
      expect(screen.getByText('@console')).toBeInTheDocument();
    });
    
    // Press arrow down
    fireEvent.keyDown(document, { key: 'ArrowDown' });
    
    // Second option should be selected
    const options = screen.getAllByRole('button');
    expect(options[1]).toHaveClass('selected');
    
    // Press Enter to select
    fireEvent.keyDown(document, { key: 'Enter' });
    
    // Should have inserted the second option (@errors)
    await waitFor(() => {
      expect(input.value).toContain('@errors');
    });
  });
  
  it('should close context selector on Escape', async () => {
    render(<Toolbar hub={hub} monitorManager={monitorManager} />);
    
    await waitFor(() => {
      expect(screen.queryByPlaceholderText(/type a message/i)).toBeInTheDocument();
    });
    
    const input = screen.getByPlaceholderText(/type a message/i);
    
    // Type @
    await user.type(input, '@');
    
    // Wait for context selector
    await waitFor(() => {
      expect(screen.getByText('@console')).toBeInTheDocument();
    });
    
    // Press Escape
    fireEvent.keyDown(document, { key: 'Escape' });
    
    // Context selector should be hidden
    await waitFor(() => {
      expect(screen.queryByText('@console')).not.toBeInTheDocument();
    });
  });
  
  it('should handle multiple @ mentions in one message', async () => {
    render(<Toolbar hub={hub} monitorManager={monitorManager} />);
    
    await waitFor(() => {
      expect(screen.queryByPlaceholderText(/type a message/i)).toBeInTheDocument();
    });
    
    const input = screen.getByPlaceholderText(/type a message/i) as HTMLInputElement;
    
    // Type first mention
    await user.type(input, 'Check @');
    await waitFor(() => expect(screen.getByText('@console')).toBeInTheDocument());
    fireEvent.click(screen.getByText('@console'));
    
    // Clear the comment part for easier testing
    input.value = input.value.split('\n\n')[0];
    
    // Type second mention
    await user.type(input, ' and also @');
    await waitFor(() => expect(screen.getByText('@network')).toBeInTheDocument());
    fireEvent.click(screen.getByText('@network'));
    
    // Should have both contexts
    expect(input.value).toContain('@console');
    expect(input.value).toContain('@network');
  });
  
  it('should pass context to AI when message is sent', async () => {
    render(<Toolbar hub={hub} monitorManager={monitorManager} />);
    
    await waitFor(() => {
      expect(screen.queryByPlaceholderText(/type a message/i)).toBeInTheDocument();
    });
    
    const input = screen.getByPlaceholderText(/type a message/i) as HTMLInputElement;
    
    // Type message with context
    await user.type(input, 'Analyze @');
    await waitFor(() => expect(screen.getByText('@performance')).toBeInTheDocument());
    fireEvent.click(screen.getByText('@performance'));
    
    // Submit the form
    const form = input.closest('form')!;
    fireEvent.submit(form);
    
    // Check that completeChat was called with the context
    await waitFor(() => {
      expect(hub.completeChat).toHaveBeenCalled();
      const messages = hub.completeChat.mock.calls[0][0];
      expect(messages[0].content).toContain('@performance');
      expect(messages[0].content).toContain('<!-- Context:');
    });
  });
  
  it('should handle component context selection', async () => {
    // Set up some selected components
    const mockComponents = [
      { id: 'comp-1', name: 'Button', props: { variant: 'primary' } },
    ];
    
    render(<Toolbar hub={hub} monitorManager={monitorManager} />);
    
    await waitFor(() => {
      expect(screen.queryByPlaceholderText(/type a message/i)).toBeInTheDocument();
    });
    
    // First select a component (simulate component selection)
    // This would normally happen through ComponentInspector
    monitorManager.setSelectedComponents(mockComponents);
    
    const input = screen.getByPlaceholderText(/type a message/i);
    
    // Type @ to see components option
    await user.type(input, '@comp');
    
    await waitFor(() => {
      expect(screen.getByText('@components')).toBeInTheDocument();
    });
    
    // Select components context
    fireEvent.click(screen.getByText('@components'));
    
    // Verify the context includes component info
    expect(monitorManager.getContext).toHaveBeenCalledWith('components', undefined);
  });
});