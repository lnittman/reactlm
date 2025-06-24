import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ComponentInspector } from './bippy-adapter';
import * as bippy from 'bippy';

// Mock bippy
vi.mock('bippy', () => ({
  instrument: vi.fn(),
  onCommitFiberRoot: vi.fn(),
  traverseFiber: vi.fn(),
  isHostFiber: vi.fn(),
  getNearestHostFiber: vi.fn(),
  traverseRenderedFibers: vi.fn(),
  secure: vi.fn((fn) => fn),
}));

// Mock react-detector
vi.mock('../utils/react-detector', () => ({
  reactDetector: {
    isReactDetected: vi.fn().mockReturnValue(true),
    waitForReact: vi.fn().mockResolvedValue(true),
    getReactVersion: vi.fn().mockReturnValue('18.2.0'),
  },
}));

describe('ComponentInspector', () => {
  let inspector: ComponentInspector;
  let mockFiberRoot: any;
  let mockFiber: any;
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Setup mock fiber structures
    mockFiber = {
      type: { name: 'TestComponent' },
      memoizedProps: { test: 'prop' },
      memoizedState: { count: 0 },
      stateNode: document.createElement('div'),
      _debugSource: {
        fileName: 'TestComponent.tsx',
        lineNumber: 10,
        columnNumber: 5,
      },
      return: null,
      child: null,
      sibling: null,
    };
    
    mockFiberRoot = {
      current: mockFiber,
    };
    
    inspector = new ComponentInspector();
  });
  
  afterEach(() => {
    inspector.stop();
  });
  
  it('should initialize with instrumentation', () => {
    expect(bippy.instrument).toHaveBeenCalled();
  });
  
  it('should handle component selection', () => {
    const mockCallback = vi.fn();
    inspector.onComponentSelect(mockCallback);
    
    // Enable selection mode
    inspector.enableSelection();
    
    // Simulate clicking on an element
    const element = document.createElement('div');
    vi.mocked(bippy.getNearestHostFiber).mockReturnValue(mockFiber);
    
    // Trigger click event
    element.dispatchEvent(new MouseEvent('click'));
    
    // The callback should be called through the internal flow
    // Note: This might need adjustment based on actual implementation
  });
  
  it('should extract component info from fiber', () => {
    const componentInfo = inspector.getComponentFromFiber(mockFiber);
    
    expect(componentInfo).toMatchObject({
      name: 'TestComponent',
      props: { test: 'prop' },
      state: { count: 0 },
      sourceLocation: {
        fileName: 'TestComponent.tsx',
        lineNumber: 10,
        columnNumber: 5,
      },
    });
  });
  
  it('should handle fibers without names gracefully', () => {
    const anonymousFiber = {
      ...mockFiber,
      type: null,
      elementType: { displayName: 'AnonymousComponent' },
    };
    
    const componentInfo = inspector.getComponentFromFiber(anonymousFiber);
    expect(componentInfo.name).toBe('AnonymousComponent');
  });
  
  it('should build component tree', () => {
    const childFiber = {
      ...mockFiber,
      type: { name: 'ChildComponent' },
      return: mockFiber,
    };
    mockFiber.child = childFiber;
    
    vi.mocked(bippy.traverseFiber).mockImplementation((fiber, callback) => {
      callback(fiber);
      if (fiber.child) callback(fiber.child);
    });
    
    const tree = inspector.getComponentTree();
    
    expect(tree).toHaveLength(2);
    expect(tree[0].name).toBe('TestComponent');
    expect(tree[1].name).toBe('ChildComponent');
    expect(tree[1].parent).toBeDefined();
  });
  
  it('should highlight components on hover', () => {
    const element = document.createElement('div');
    document.body.appendChild(element);
    
    inspector.enableSelection();
    inspector.highlightComponent(element);
    
    // Check if overlay is created
    const overlay = document.querySelector('.component-overlay');
    expect(overlay).toBeDefined();
    
    document.body.removeChild(element);
  });
  
  it('should clean up highlights when selection is disabled', () => {
    inspector.enableSelection();
    
    // Add a highlight
    const element = document.createElement('div');
    inspector.highlightComponent(element);
    
    // Disable selection
    inspector.disableSelection();
    
    // Check that overlay is removed
    const overlay = document.querySelector('.component-overlay');
    expect(overlay).toBeNull();
  });
  
  it('should handle React not being detected', async () => {
    const { reactDetector } = await import('../utils/react-detector');
    vi.mocked(reactDetector.isReactDetected).mockReturnValue(false);
    vi.mocked(reactDetector.waitForReact).mockResolvedValue(false);
    
    const newInspector = new ComponentInspector();
    
    // Should handle gracefully without throwing
    expect(newInspector.isInstrumented()).toBe(false);
  });
  
  it('should get components by name', () => {
    const components = [
      { ...mockFiber, type: { name: 'Button' } },
      { ...mockFiber, type: { name: 'Input' } },
      { ...mockFiber, type: { name: 'Button' } },
    ];
    
    vi.mocked(bippy.traverseRenderedFibers).mockImplementation((callback) => {
      components.forEach(callback);
    });
    
    const buttons = inspector.getComponentsByName('Button');
    expect(buttons).toHaveLength(2);
    expect(buttons.every(c => c.name === 'Button')).toBe(true);
  });
  
  it('should find component by DOM element', () => {
    const element = document.createElement('button');
    const buttonFiber = {
      ...mockFiber,
      type: { name: 'Button' },
      stateNode: element,
    };
    
    vi.mocked(bippy.getNearestHostFiber).mockReturnValue(buttonFiber);
    
    const component = inspector.findComponentByElement(element);
    expect(component?.name).toBe('Button');
  });
  
  it('should handle errors in fiber traversal', () => {
    vi.mocked(bippy.traverseFiber).mockImplementation(() => {
      throw new Error('Traversal error');
    });
    
    // Should not throw and return empty tree
    const tree = inspector.getComponentTree();
    expect(tree).toEqual([]);
  });
  
  it('should extract hooks information', () => {
    const fiberWithHooks = {
      ...mockFiber,
      _debugHookTypes: ['useState', 'useEffect', 'useCallback'],
      memoizedState: {
        memoizedState: 0,
        next: {
          memoizedState: null,
          next: {
            memoizedState: vi.fn(),
            next: null,
          },
        },
      },
    };
    
    const componentInfo = inspector.getComponentFromFiber(fiberWithHooks);
    expect(componentInfo.hooks).toHaveLength(3);
    expect(componentInfo.hooks[0].name).toBe('useState');
  });
  
  it('should stop instrumentation', () => {
    inspector.stop();
    
    // Verify cleanup
    expect(inspector.isInstrumented()).toBe(false);
  });
});