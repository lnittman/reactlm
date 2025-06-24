import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, fireEvent, screen, waitFor } from '@testing-library/preact';
import { Toolbar } from '../components/Toolbar';
import { ComponentInspector } from '../components/ComponentInspector';
import { LLMHub } from '../llm/providers';
import { MonitorManager } from '../monitoring/monitor-manager';
import { ComponentInspector as BippyInspector } from '../instrumentation/bippy-adapter';

// Mock dependencies
vi.mock('../llm/providers');
vi.mock('../monitoring/monitor-manager');
vi.mock('../instrumentation/bippy-adapter');
vi.mock('../db/database', () => ({
  initDB: vi.fn().mockResolvedValue(true),
  createChatSession: vi.fn().mockResolvedValue('session-1'),
  createMessage: vi.fn().mockResolvedValue('message-1'),
  getChatSessions: vi.fn().mockResolvedValue([]),
  getMessagesForChatSession: vi.fn().mockResolvedValue([]),
  deleteChatSession: vi.fn().mockResolvedValue(true),
}));

describe('Component Selection to Chat Context Integration', () => {
  let hub: any;
  let monitorManager: any;
  let bippyInspector: any;
  
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
    
    // Mock MonitorManager
    monitorManager = new MonitorManager();
    monitorManager.getContext = vi.fn().mockReturnValue('Component context data');
    monitorManager.setSelectedComponents = vi.fn();
    
    // Mock BippyInspector
    bippyInspector = {
      isInstrumented: vi.fn().mockReturnValue(true),
      enableSelection: vi.fn(),
      disableSelection: vi.fn(),
      onComponentSelect: vi.fn(),
      getComponentTree: vi.fn().mockReturnValue([]),
      highlightComponent: vi.fn(),
      clearHighlights: vi.fn(),
    };
    vi.mocked(BippyInspector).mockImplementation(() => bippyInspector);
  });
  
  afterEach(() => {
    vi.clearAllMocks();
  });
  
  it('should enable component selection mode', async () => {
    render(<Toolbar hub={hub} monitorManager={monitorManager} />);
    
    // Wait for initialization
    await waitFor(() => {
      expect(screen.queryByTitle('Selected Components')).toBeInTheDocument();
    });
    
    // Click on component selection button
    const componentButton = screen.getByTitle('Selected Components');
    fireEvent.click(componentButton);
    
    // Should show component view
    await waitFor(() => {
      expect(screen.getByText('Selected Components')).toBeInTheDocument();
      expect(screen.getByText('No components selected yet')).toBeInTheDocument();
    });
    
    // Click "Select a Component" button
    const selectButton = screen.getByText('Select a Component');
    fireEvent.click(selectButton);
    
    // Should activate selection mode
    await waitFor(() => {
      expect(screen.getByTestId('component-inspector')).toBeInTheDocument();
    });
  });
  
  it('should handle component selection from inspector', async () => {
    const mockComponent = {
      id: 'comp-123',
      name: 'ProductCard',
      fiberType: 'FunctionComponent',
      props: { 
        title: 'Test Product',
        price: 99.99,
        onAddToCart: '[Function]'
      },
      state: null,
      hooks: [{ name: 'useState' }, { name: 'useCallback' }],
      domElement: { tagName: 'DIV', className: 'product-card' },
      sourceLocation: { fileName: 'ProductCard.tsx', lineNumber: 15 },
      depth: 3,
      parent: null,
      children: [],
      isComponent: true,
    };
    
    render(<Toolbar hub={hub} monitorManager={monitorManager} />);
    
    await waitFor(() => {
      expect(screen.queryByTitle('Selected Components')).toBeInTheDocument();
    });
    
    // Enable component selection
    const componentButton = screen.getByTitle('Selected Components');
    fireEvent.click(componentButton);
    
    // Click select component
    await waitFor(() => screen.getByText('Select a Component'));
    fireEvent.click(screen.getByText('Select a Component'));
    
    // Simulate component selection through bippy
    const onSelectCallback = bippyInspector.onComponentSelect.mock.calls[0][0];
    onSelectCallback(mockComponent);
    
    // Should show selected component
    await waitFor(() => {
      expect(screen.getByText('ProductCard')).toBeInTheDocument();
      expect(screen.getByText('ProductCard.tsx:15')).toBeInTheDocument();
    });
    
    // Should sync with monitor manager
    expect(monitorManager.setSelectedComponents).toHaveBeenCalledWith([
      expect.objectContaining({
        id: 'comp-123',
        name: 'ProductCard',
      })
    ]);
  });
  
  it('should add component context to chat via @ mention', async () => {
    const mockComponent = {
      id: 'comp-456',
      name: 'UserProfile',
      props: { userId: '123', showAvatar: true },
      state: { isEditing: false },
      hooks: [{ name: 'useState' }],
    };
    
    render(<Toolbar hub={hub} monitorManager={monitorManager} />);
    
    await waitFor(() => {
      expect(screen.queryByPlaceholderText(/type a message/i)).toBeInTheDocument();
    });
    
    // First, add a component to selection
    monitorManager.setSelectedComponents([mockComponent]);
    
    // Type @ mention for components
    const input = screen.getByPlaceholderText(/type a message/i);
    await userEvent.type(input, 'Can you help me improve @comp');
    
    // Wait for context selector
    await waitFor(() => {
      expect(screen.getByText('@components')).toBeInTheDocument();
    });
    
    // Click components option
    fireEvent.click(screen.getByText('@components'));
    
    // Verify context was requested
    expect(monitorManager.getContext).toHaveBeenCalledWith('components', undefined);
    
    // Input should contain the context
    await waitFor(() => {
      expect(input.value).toContain('@components');
      expect(input.value).toContain('<!-- Context:');
    });
  });
  
  it('should show component details in the components view', async () => {
    const mockComponents = [
      {
        id: 'comp-1',
        name: 'Header',
        fiberType: 'FunctionComponent',
        props: { title: 'My App', showMenu: true },
        state: null,
        hooks: [],
        domElement: { tagName: 'HEADER' },
        timestamp: new Date().toISOString(),
      },
      {
        id: 'comp-2',
        name: 'NavigationMenu',
        fiberType: 'FunctionComponent', 
        props: { items: ['Home', 'About', 'Contact'] },
        state: { activeItem: 0 },
        hooks: [{ name: 'useState' }],
        domElement: { tagName: 'NAV' },
        timestamp: new Date().toISOString(),
      },
    ];
    
    render(<Toolbar hub={hub} monitorManager={monitorManager} />);
    
    // Manually set selected components
    const toolbar = screen.getByClassName('toolbar');
    
    // Trigger component selection
    const componentButton = screen.getByTitle('Selected Components');
    fireEvent.click(componentButton);
    
    // Add components through the handler
    mockComponents.forEach(comp => {
      const onSelectCallback = bippyInspector.onComponentSelect.mock.calls[0]?.[0];
      if (onSelectCallback) {
        onSelectCallback(comp);
      }
    });
    
    // Should display both components
    await waitFor(() => {
      expect(screen.getByText('Header')).toBeInTheDocument();
      expect(screen.getByText('NavigationMenu')).toBeInTheDocument();
    });
    
    // Should show component details
    expect(screen.getByText(/"title": "My App"/)).toBeInTheDocument();
    expect(screen.getByText(/"showMenu": true/)).toBeInTheDocument();
    expect(screen.getByText(/"activeItem": 0/)).toBeInTheDocument();
  });
  
  it('should remove component from selection', async () => {
    const mockComponent = {
      id: 'comp-789',
      name: 'RemovableComponent',
      props: {},
      timestamp: new Date().toISOString(),
    };
    
    render(<Toolbar hub={hub} monitorManager={monitorManager} />);
    
    // Add component
    const componentButton = screen.getByTitle('Selected Components');
    fireEvent.click(componentButton);
    
    // Simulate adding component
    const onSelectCallback = bippyInspector.onComponentSelect.mock.calls[0]?.[0];
    if (onSelectCallback) {
      onSelectCallback(mockComponent);
    }
    
    await waitFor(() => {
      expect(screen.getByText('RemovableComponent')).toBeInTheDocument();
    });
    
    // Click remove button
    const removeButton = screen.getByText('×');
    fireEvent.click(removeButton);
    
    // Component should be removed
    await waitFor(() => {
      expect(screen.queryByText('RemovableComponent')).not.toBeInTheDocument();
      expect(screen.getByText('No components selected yet')).toBeInTheDocument();
    });
    
    // Should update monitor manager
    expect(monitorManager.setSelectedComponents).toHaveBeenLastCalledWith([]);
  });
  
  it('should highlight component on hover during selection', () => {
    render(<ComponentInspector isActive={true} onSelect={vi.fn()} theme="dark" />);
    
    const testElement = document.createElement('div');
    testElement.setAttribute('data-react-component', 'true');
    document.body.appendChild(testElement);
    
    // Simulate mouse enter
    fireEvent.mouseEnter(testElement);
    
    // Should call highlight
    expect(bippyInspector.highlightComponent).toHaveBeenCalledWith(testElement);
    
    // Simulate mouse leave
    fireEvent.mouseLeave(testElement);
    
    // Should clear highlights
    expect(bippyInspector.clearHighlights).toHaveBeenCalled();
    
    // Cleanup
    document.body.removeChild(testElement);
  });
  
  it('should handle selection of components without source location', async () => {
    const mockComponent = {
      id: 'comp-no-source',
      name: 'RuntimeComponent',
      props: { generated: true },
      state: null,
      hooks: [],
      domElement: { tagName: 'DIV' },
      sourceLocation: null,
      timestamp: new Date().toISOString(),
    };
    
    render(<Toolbar hub={hub} monitorManager={monitorManager} />);
    
    // Navigate to components view
    fireEvent.click(screen.getByTitle('Selected Components'));
    
    // Add component
    const onSelectCallback = bippyInspector.onComponentSelect.mock.calls[0]?.[0];
    if (onSelectCallback) {
      onSelectCallback(mockComponent);
    }
    
    await waitFor(() => {
      expect(screen.getByText('RuntimeComponent')).toBeInTheDocument();
      // Should not show source location
      expect(screen.queryByText(/\.tsx:/)).not.toBeInTheDocument();
    });
  });
});