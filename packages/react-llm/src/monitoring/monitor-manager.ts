import { ConsoleMonitor } from './console-monitor';
import { NetworkMonitor } from './network-monitor';
import { PerformanceMonitor } from './performance-monitor';
import { DOMMonitor } from './dom-monitor';
import { DevToolsProtocol } from './devtools-protocol';

export class MonitorManager {
  private console: ConsoleMonitor;
  private network: NetworkMonitor;
  private performance: PerformanceMonitor;
  private dom: DOMMonitor;
  private devtools: DevToolsProtocol | null = null;
  private selectedComponents: any[] = [];
  
  constructor() {
    this.console = new ConsoleMonitor();
    this.network = new NetworkMonitor();
    this.performance = new PerformanceMonitor();
    this.dom = new DOMMonitor();
    
    // Try to initialize CDP if available
    this.initializeDevTools();
  }
  
  private async initializeDevTools(): Promise<void> {
    try {
      this.devtools = new DevToolsProtocol();
      await this.devtools.connect();
    } catch (error) {
      console.info('[ReactLLM] DevTools Protocol not available, using fallback monitoring');
    }
  }
  
  public start(): void {
    this.console.start();
    this.network.start();
    this.performance.start();
    this.dom.start();
  }
  
  public stop(): void {
    this.console.stop();
    this.network.stop();
    this.performance.stop();
    this.dom.stop();
    this.devtools?.disconnect();
  }
  
  public setSelectedComponents(components: any[]): void {
    this.selectedComponents = components;
  }
  
  public getContext(type: string, filter?: Record<string, any>): string {
    switch (type) {
      case 'console':
        return this.formatConsoleContext(filter);
      case 'network':
        return this.formatNetworkContext(filter);
      case 'performance':
        return this.formatPerformanceContext(filter);
      case 'dom':
        return this.formatDOMContext(filter);
      case 'components':
        return this.formatComponentsContext(filter);
      default:
        return '';
    }
  }
  
  private formatConsoleContext(filter?: Record<string, any>): string {
    const entries = this.console.getEntries(filter);
    const recent = entries.slice(-50); // Last 50 entries
    
    return `## Console Logs\n\n${recent.map(entry => {
      const time = new Date(entry.timestamp).toLocaleTimeString();
      return `[${time}] [${entry.level.toUpperCase()}] ${entry.formatted}`;
    }).join('\n')}`;
  }
  
  private formatNetworkContext(filter?: Record<string, any>): string {
    const requests = this.network.getRequests(filter);
    const recent = requests.slice(-20); // Last 20 requests
    
    return `## Network Requests\n\n${recent.map(req => {
      const status = req.response?.status || 'pending';
      const duration = req.duration ? `${req.duration}ms` : 'in progress';
      return `${req.method} ${req.url} - ${status} (${duration})`;
    }).join('\n')}`;
  }
  
  private formatPerformanceContext(filter?: Record<string, any>): string {
    const summary = this.performance.getSummary();
    
    return `## Performance Metrics\n
- Page Load: ${summary.pageLoad}ms
- TTFB: ${summary.ttfb}ms  
- First Paint: ${summary.firstPaint}ms
- First Contentful Paint: ${summary.firstContentfulPaint}ms
- Largest Contentful Paint: ${summary.largestContentfulPaint}ms
- First Input Delay: ${summary.firstInputDelay}ms
- Cumulative Layout Shift: ${summary.cumulativeLayoutShift}
- Resources Loaded: ${summary.resourceCount}`;
  }
  
  private formatDOMContext(filter?: Record<string, any>): string {
    const changes = this.dom.getChanges(filter);
    const recent = changes.slice(-30); // Last 30 changes
    
    return `## DOM Changes\n\n${recent.map(change => {
      const time = new Date(change.timestamp).toLocaleTimeString();
      return `[${time}] ${change.type}: ${change.target.path}`;
    }).join('\n')}`;
  }
  
  // Get specific monitor instances for direct access
  public getConsoleMonitor(): ConsoleMonitor {
    return this.console;
  }
  
  public getNetworkMonitor(): NetworkMonitor {
    return this.network;
  }
  
  public getPerformanceMonitor(): PerformanceMonitor {
    return this.performance;
  }
  
  public getDOMMonitor(): DOMMonitor {
    return this.dom;
  }
  
  public getDevToolsProtocol(): DevToolsProtocol | null {
    return this.devtools;
  }
  
  private formatComponentsContext(filter?: Record<string, any>): string {
    if (this.selectedComponents.length === 0) {
      return '## Selected Components\n\nNo components currently selected.';
    }
    
    return `## Selected Components\n\n${this.selectedComponents.map((comp, index) => {
      const componentInfo = [
        `### Component ${index + 1}: ${comp.name}`,
        `- ID: ${comp.id}`,
        `- Type: ${comp.fiberType}`,
        comp.domElement ? `- DOM Element: <${comp.domElement.tagName.toLowerCase()}>` : '',
        comp.sourceLocation ? `- Source: ${comp.sourceLocation.fileName}:${comp.sourceLocation.lineNumber}` : '',
        `- Depth: ${comp.depth}`,
        '',
        '#### Props:',
        '```json',
        JSON.stringify(comp.props, null, 2),
        '```',
        '',
        comp.state ? [
          '#### State:',
          '```json',
          JSON.stringify(comp.state, null, 2),
          '```',
          ''
        ].join('\n') : '',
        comp.hooks && comp.hooks.length > 0 ? [
          '#### Hooks:',
          comp.hooks.map((hook: any, i: number) => `${i + 1}. ${hook.name || 'Unknown Hook'}`).join('\n'),
          ''
        ].join('\n') : ''
      ].filter(Boolean).join('\n');
      
      return componentInfo;
    }).join('\n\n')}`;
  }
}