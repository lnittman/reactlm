import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { MonitorManager } from './monitor-manager';

// Mock the individual monitors
vi.mock('./console-monitor', () => ({
  ConsoleMonitor: vi.fn().mockImplementation(() => ({
    start: vi.fn(),
    stop: vi.fn(),
    getEntries: vi.fn().mockReturnValue([
      {
        id: 'test-1',
        timestamp: Date.now(),
        level: 'log',
        formatted: 'Test log message',
        args: ['Test log message']
      }
    ])
  }))
}));

vi.mock('./network-monitor', () => ({
  NetworkMonitor: vi.fn().mockImplementation(() => ({
    start: vi.fn(),
    stop: vi.fn(),
    getRequests: vi.fn().mockReturnValue([
      {
        id: 'req-1',
        timestamp: Date.now(),
        method: 'GET',
        url: 'https://api.example.com/test',
        status: 'completed',
        duration: 150,
        response: { status: 200 }
      }
    ])
  }))
}));

vi.mock('./performance-monitor', () => ({
  PerformanceMonitor: vi.fn().mockImplementation(() => ({
    start: vi.fn(),
    stop: vi.fn(),
    getSummary: vi.fn().mockReturnValue({
      pageLoad: 1200,
      ttfb: 200,
      firstPaint: 800,
      firstContentfulPaint: 950,
      largestContentfulPaint: 1100,
      firstInputDelay: 50,
      cumulativeLayoutShift: 0.1,
      resourceCount: 15
    })
  }))
}));

vi.mock('./dom-monitor', () => ({
  DOMMonitor: vi.fn().mockImplementation(() => ({
    start: vi.fn(),
    stop: vi.fn(),
    getChanges: vi.fn().mockReturnValue([
      {
        id: 'dom-1',
        timestamp: Date.now(),
        type: 'added',
        target: {
          tagName: 'div',
          path: 'body > div.container > div.new-element'
        }
      }
    ])
  }))
}));

vi.mock('./devtools-protocol', () => ({
  DevToolsProtocol: vi.fn().mockImplementation(() => ({
    connect: vi.fn().mockRejectedValue(new Error('DevTools not available')),
    disconnect: vi.fn(),
    isAvailable: vi.fn().mockReturnValue(false)
  }))
}));

describe('MonitorManager', () => {
  let monitorManager: MonitorManager;

  beforeEach(() => {
    monitorManager = new MonitorManager();
  });

  afterEach(() => {
    monitorManager.stop();
  });

  it('should initialize all monitors', () => {
    expect(monitorManager.getConsoleMonitor()).toBeDefined();
    expect(monitorManager.getNetworkMonitor()).toBeDefined();
    expect(monitorManager.getPerformanceMonitor()).toBeDefined();
    expect(monitorManager.getDOMMonitor()).toBeDefined();
  });

  it('should start all monitors when start() is called', () => {
    const consoleMock = monitorManager.getConsoleMonitor();
    const networkMock = monitorManager.getNetworkMonitor();
    const performanceMock = monitorManager.getPerformanceMonitor();
    const domMock = monitorManager.getDOMMonitor();

    monitorManager.start();

    expect(consoleMock.start).toHaveBeenCalled();
    expect(networkMock.start).toHaveBeenCalled();
    expect(performanceMock.start).toHaveBeenCalled();
    expect(domMock.start).toHaveBeenCalled();
  });

  it('should stop all monitors when stop() is called', () => {
    const consoleMock = monitorManager.getConsoleMonitor();
    const networkMock = monitorManager.getNetworkMonitor();
    const performanceMock = monitorManager.getPerformanceMonitor();
    const domMock = monitorManager.getDOMMonitor();

    monitorManager.stop();

    expect(consoleMock.stop).toHaveBeenCalled();
    expect(networkMock.stop).toHaveBeenCalled();
    expect(performanceMock.stop).toHaveBeenCalled();
    expect(domMock.stop).toHaveBeenCalled();
  });

  describe('getContext', () => {
    beforeEach(() => {
      monitorManager.start();
    });

    it('should format console context correctly', () => {
      const context = monitorManager.getContext('console');
      expect(context).toContain('## Console Logs');
      expect(context).toContain('[LOG] Test log message');
    });

    it('should format network context correctly', () => {
      const context = monitorManager.getContext('network');
      expect(context).toContain('## Network Requests');
      expect(context).toContain('GET https://api.example.com/test - 200 (150ms)');
    });

    it('should format performance context correctly', () => {
      const context = monitorManager.getContext('performance');
      expect(context).toContain('## Performance Metrics');
      expect(context).toContain('Page Load: 1200ms');
      expect(context).toContain('TTFB: 200ms');
      expect(context).toContain('Cumulative Layout Shift: 0.1');
    });

    it('should format DOM context correctly', () => {
      const context = monitorManager.getContext('dom');
      expect(context).toContain('## DOM Changes');
      expect(context).toContain('added: body > div.container > div.new-element');
    });

    it('should return empty string for unknown context type', () => {
      const context = monitorManager.getContext('unknown');
      expect(context).toBe('');
    });
    
    it('should format components context when no components selected', () => {
      const context = monitorManager.getContext('components');
      expect(context).toContain('## Selected Components');
      expect(context).toContain('No components currently selected');
    });
    
    it('should format components context with selected components', () => {
      const mockComponents = [
        {
          id: 'comp-1',
          name: 'Button',
          fiberType: 'FunctionComponent',
          domElement: { tagName: 'BUTTON' },
          sourceLocation: { fileName: 'Button.tsx', lineNumber: 10 },
          depth: 3,
          props: { variant: 'primary', onClick: '[Function]' },
          state: null,
          hooks: [{ name: 'useState' }, { name: 'useEffect' }],
        },
        {
          id: 'comp-2',
          name: 'Input',
          fiberType: 'FunctionComponent',
          domElement: { tagName: 'INPUT' },
          depth: 4,
          props: { type: 'text', placeholder: 'Enter text' },
          state: { value: 'test' },
          hooks: [],
        }
      ];
      
      monitorManager.setSelectedComponents(mockComponents);
      const context = monitorManager.getContext('components');
      
      expect(context).toContain('## Selected Components');
      expect(context).toContain('### Component 1: Button');
      expect(context).toContain('- ID: comp-1');
      expect(context).toContain('- DOM Element: <button>');
      expect(context).toContain('- Source: Button.tsx:10');
      expect(context).toContain('"variant": "primary"');
      expect(context).toContain('1. useState');
      expect(context).toContain('2. useEffect');
      
      expect(context).toContain('### Component 2: Input');
      expect(context).toContain('- DOM Element: <input>');
      expect(context).toContain('"type": "text"');
      expect(context).toContain('"value": "test"');
    });
  });
});