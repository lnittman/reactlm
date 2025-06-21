# Agent 3: Browser DevTools & Context Monitoring
*"Transform React LLM into a comprehensive browser development assistant with full access to console, network, performance, and DOM context"*

## Scope

This agent will extend React LLM beyond component inspection to provide AI chat access to the complete browser environment. Users will be able to @ mention different contexts (console logs, network requests, performance metrics, DOM mutations) directly in their chat, giving the AI comprehensive visibility into the application state.

### Key Objectives
1. Implement console log interception and storage
2. Create network request monitoring with HAR-like format
3. Add performance metrics collection
4. Build DOM mutation tracking
5. Design @ mention UI/UX for context inclusion
6. Integrate with Chrome DevTools Protocol when available

## Packages to Modify

- `packages/react-llm/src/monitoring/` - New monitoring subsystem
  - `console-monitor.ts` - Console API interception
  - `network-monitor.ts` - Fetch/XHR tracking
  - `performance-monitor.ts` - Performance Observer API
  - `dom-monitor.ts` - MutationObserver implementation
  - `devtools-protocol.ts` - CDP integration
  - `monitor-manager.ts` - Unified monitoring API
- `packages/react-llm/src/components/ContextSelector.tsx` - @ mention UI
- `packages/react-llm/src/components/Toolbar.tsx` - Integration points
- `packages/react-llm/src/db/schema.ts` - New tables for monitoring data
- `packages/react-llm/src/types/monitoring.ts` - Type definitions

## Implementation Details

### 1. Console Monitoring System

Intercept and store all console activity:

```typescript
// packages/react-llm/src/monitoring/console-monitor.ts
import { signal, computed } from '@preact/signals';

export interface ConsoleEntry {
  id: string;
  timestamp: number;
  level: 'log' | 'warn' | 'error' | 'info' | 'debug' | 'trace';
  args: any[];
  stack?: string;
  source?: string;
  formatted: string;
}

export class ConsoleMonitor {
  private entries = signal<ConsoleEntry[]>([]);
  private maxEntries = 1000;
  private originalMethods: Record<string, Function> = {};
  private isMonitoring = false;
  
  // Computed signals for filtering
  public logs = computed(() => 
    this.entries.value.filter(e => e.level === 'log')
  );
  
  public errors = computed(() => 
    this.entries.value.filter(e => e.level === 'error')
  );
  
  public warnings = computed(() => 
    this.entries.value.filter(e => e.level === 'warn')
  );
  
  constructor() {
    this.saveOriginalMethods();
  }
  
  private saveOriginalMethods(): void {
    ['log', 'warn', 'error', 'info', 'debug', 'trace'].forEach(method => {
      this.originalMethods[method] = console[method as keyof Console];
    });
  }
  
  public start(): void {
    if (this.isMonitoring) return;
    
    ['log', 'warn', 'error', 'info', 'debug', 'trace'].forEach(method => {
      const original = this.originalMethods[method];
      
      (console as any)[method] = (...args: any[]) => {
        // Call original method
        original.apply(console, args);
        
        // Capture entry
        const entry: ConsoleEntry = {
          id: `console-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: Date.now(),
          level: method as ConsoleEntry['level'],
          args: this.cloneArgs(args),
          stack: this.extractStack(),
          source: this.extractSource(),
          formatted: this.formatArgs(args),
        };
        
        this.addEntry(entry);
      };
    });
    
    this.isMonitoring = true;
    console.info('[ReactLLM] Console monitoring started');
  }
  
  public stop(): void {
    if (!this.isMonitoring) return;
    
    // Restore original methods
    Object.entries(this.originalMethods).forEach(([method, original]) => {
      (console as any)[method] = original;
    });
    
    this.isMonitoring = false;
    console.info('[ReactLLM] Console monitoring stopped');
  }
  
  private cloneArgs(args: any[]): any[] {
    // Deep clone arguments to prevent mutations
    try {
      return args.map(arg => {
        if (arg === null || arg === undefined) return arg;
        if (typeof arg === 'function') return '[Function]';
        if (arg instanceof Error) {
          return {
            name: arg.name,
            message: arg.message,
            stack: arg.stack,
          };
        }
        if (arg instanceof HTMLElement) {
          return {
            tagName: arg.tagName,
            id: arg.id,
            className: arg.className,
            innerHTML: arg.innerHTML.substring(0, 100) + '...',
          };
        }
        
        // Use structured clone for complex objects
        return structuredClone(arg);
      });
    } catch (error) {
      // Fallback for non-cloneable objects
      return args.map(arg => {
        try {
          return JSON.parse(JSON.stringify(arg));
        } catch {
          return String(arg);
        }
      });
    }
  }
  
  private extractStack(): string {
    const stack = new Error().stack || '';
    // Remove first 3 lines (Error, this function, console override)
    return stack.split('\n').slice(3).join('\n');
  }
  
  private extractSource(): string {
    const stack = this.extractStack();
    const match = stack.match(/at\s+(.+?)\s+\((.+?):(\d+):(\d+)\)/);
    
    if (match) {
      const [, functionName, file, line, column] = match;
      return `${functionName} (${file}:${line}:${column})`;
    }
    
    return 'Unknown source';
  }
  
  private formatArgs(args: any[]): string {
    return args.map(arg => {
      if (typeof arg === 'string') return arg;
      if (typeof arg === 'object') {
        try {
          return JSON.stringify(arg, null, 2);
        } catch {
          return String(arg);
        }
      }
      return String(arg);
    }).join(' ');
  }
  
  private addEntry(entry: ConsoleEntry): void {
    const current = this.entries.value;
    const updated = [...current, entry];
    
    // Maintain max entries limit
    if (updated.length > this.maxEntries) {
      updated.splice(0, updated.length - this.maxEntries);
    }
    
    this.entries.value = updated;
  }
  
  public clear(): void {
    this.entries.value = [];
  }
  
  public getEntries(filter?: {
    level?: ConsoleEntry['level'];
    since?: number;
    search?: string;
  }): ConsoleEntry[] {
    let results = this.entries.value;
    
    if (filter?.level) {
      results = results.filter(e => e.level === filter.level);
    }
    
    if (filter?.since) {
      results = results.filter(e => e.timestamp > filter.since);
    }
    
    if (filter?.search) {
      const searchLower = filter.search.toLowerCase();
      results = results.filter(e => 
        e.formatted.toLowerCase().includes(searchLower)
      );
    }
    
    return results;
  }
  
  public exportToString(): string {
    return this.entries.value
      .map(entry => {
        const time = new Date(entry.timestamp).toLocaleTimeString();
        return `[${time}] [${entry.level.toUpperCase()}] ${entry.formatted}`;
      })
      .join('\n');
  }
}
```

### 2. Network Request Monitoring

Track all network activity with detailed information:

```typescript
// packages/react-llm/src/monitoring/network-monitor.ts
import { signal } from '@preact/signals';

export interface NetworkRequest {
  id: string;
  timestamp: number;
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: any;
  response?: NetworkResponse;
  duration?: number;
  status: 'pending' | 'completed' | 'failed';
  error?: Error;
  type: 'fetch' | 'xhr';
}

export interface NetworkResponse {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body?: any;
  size?: number;
}

export class NetworkMonitor {
  private requests = signal<NetworkRequest[]>([]);
  private maxRequests = 500;
  private isMonitoring = false;
  
  // Original methods
  private originalFetch = window.fetch;
  private originalXHROpen = XMLHttpRequest.prototype.open;
  private originalXHRSend = XMLHttpRequest.prototype.send;
  private originalXHRSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;
  
  public start(): void {
    if (this.isMonitoring) return;
    
    this.interceptFetch();
    this.interceptXHR();
    
    this.isMonitoring = true;
  }
  
  private interceptFetch(): void {
    window.fetch = async (...args: Parameters<typeof fetch>) => {
      const [input, init] = args;
      const url = typeof input === 'string' ? input : input.url;
      const method = init?.method || 'GET';
      
      const request: NetworkRequest = {
        id: `fetch-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: Date.now(),
        method,
        url,
        headers: this.extractHeaders(init?.headers),
        body: await this.extractBody(init?.body),
        status: 'pending',
        type: 'fetch',
      };
      
      this.addRequest(request);
      
      try {
        const response = await this.originalFetch.apply(window, args);
        const clonedResponse = response.clone();
        
        // Extract response data
        const responseData: NetworkResponse = {
          status: response.status,
          statusText: response.statusText,
          headers: this.extractResponseHeaders(response.headers),
          body: await this.extractResponseBody(clonedResponse),
          size: Number(response.headers.get('content-length')) || 0,
        };
        
        // Update request
        this.updateRequest(request.id, {
          response: responseData,
          duration: Date.now() - request.timestamp,
          status: 'completed',
        });
        
        return response;
      } catch (error) {
        this.updateRequest(request.id, {
          error: error as Error,
          duration: Date.now() - request.timestamp,
          status: 'failed',
        });
        throw error;
      }
    };
  }
  
  private interceptXHR(): void {
    const self = this;
    
    // Override open
    XMLHttpRequest.prototype.open = function(
      method: string,
      url: string | URL,
      async?: boolean,
      username?: string | null,
      password?: string | null
    ) {
      const xhr = this as any;
      
      xhr._requestInfo = {
        method,
        url: url.toString(),
        headers: {},
      };
      
      return self.originalXHROpen.apply(this, arguments as any);
    };
    
    // Override setRequestHeader
    XMLHttpRequest.prototype.setRequestHeader = function(name: string, value: string) {
      const xhr = this as any;
      if (xhr._requestInfo) {
        xhr._requestInfo.headers[name] = value;
      }
      
      return self.originalXHRSetRequestHeader.apply(this, arguments as any);
    };
    
    // Override send
    XMLHttpRequest.prototype.send = function(body?: Document | XMLHttpRequestBodyInit | null) {
      const xhr = this as any;
      
      if (xhr._requestInfo) {
        const request: NetworkRequest = {
          id: `xhr-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: Date.now(),
          method: xhr._requestInfo.method,
          url: xhr._requestInfo.url,
          headers: xhr._requestInfo.headers,
          body: self.extractXHRBody(body),
          status: 'pending',
          type: 'xhr',
        };
        
        self.addRequest(request);
        
        // Add event listeners
        xhr.addEventListener('load', () => {
          const responseData: NetworkResponse = {
            status: xhr.status,
            statusText: xhr.statusText,
            headers: self.extractXHRResponseHeaders(xhr),
            body: self.extractXHRResponseBody(xhr),
          };
          
          self.updateRequest(request.id, {
            response: responseData,
            duration: Date.now() - request.timestamp,
            status: 'completed',
          });
        });
        
        xhr.addEventListener('error', () => {
          self.updateRequest(request.id, {
            error: new Error('Network request failed'),
            duration: Date.now() - request.timestamp,
            status: 'failed',
          });
        });
      }
      
      return self.originalXHRSend.apply(this, arguments as any);
    };
  }
  
  private extractHeaders(headers?: HeadersInit): Record<string, string> {
    const result: Record<string, string> = {};
    
    if (!headers) return result;
    
    if (headers instanceof Headers) {
      headers.forEach((value, key) => {
        result[key] = value;
      });
    } else if (Array.isArray(headers)) {
      headers.forEach(([key, value]) => {
        result[key] = value;
      });
    } else {
      Object.assign(result, headers);
    }
    
    return result;
  }
  
  private async extractBody(body?: BodyInit | null): Promise<any> {
    if (!body) return undefined;
    
    if (typeof body === 'string') return body;
    if (body instanceof FormData) {
      const data: Record<string, any> = {};
      body.forEach((value, key) => {
        data[key] = value;
      });
      return data;
    }
    if (body instanceof Blob) {
      return await body.text();
    }
    if (body instanceof ArrayBuffer) {
      return new TextDecoder().decode(body);
    }
    
    return String(body);
  }
  
  private extractResponseHeaders(headers: Headers): Record<string, string> {
    const result: Record<string, string> = {};
    headers.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }
  
  private async extractResponseBody(response: Response): Promise<any> {
    const contentType = response.headers.get('content-type') || '';
    
    try {
      if (contentType.includes('application/json')) {
        return await response.json();
      } else if (contentType.includes('text/')) {
        return await response.text();
      } else {
        // For binary data, just return size info
        const blob = await response.blob();
        return `[Binary data: ${blob.size} bytes]`;
      }
    } catch (error) {
      return '[Failed to parse response body]';
    }
  }
  
  private extractXHRBody(body?: Document | XMLHttpRequestBodyInit | null): any {
    if (!body) return undefined;
    if (typeof body === 'string') return body;
    if (body instanceof FormData) {
      const data: Record<string, any> = {};
      body.forEach((value, key) => {
        data[key] = value;
      });
      return data;
    }
    return String(body);
  }
  
  private extractXHRResponseHeaders(xhr: XMLHttpRequest): Record<string, string> {
    const headers: Record<string, string> = {};
    const headerString = xhr.getAllResponseHeaders();
    
    headerString.split('\n').forEach(line => {
      const match = line.match(/^(.+?):\s*(.+)$/);
      if (match) {
        headers[match[1].trim()] = match[2].trim();
      }
    });
    
    return headers;
  }
  
  private extractXHRResponseBody(xhr: XMLHttpRequest): any {
    const contentType = xhr.getResponseHeader('content-type') || '';
    
    if (contentType.includes('application/json')) {
      try {
        return JSON.parse(xhr.responseText);
      } catch {
        return xhr.responseText;
      }
    }
    
    return xhr.responseText;
  }
  
  private addRequest(request: NetworkRequest): void {
    const current = this.requests.value;
    const updated = [...current, request];
    
    if (updated.length > this.maxRequests) {
      updated.splice(0, updated.length - this.maxRequests);
    }
    
    this.requests.value = updated;
  }
  
  private updateRequest(id: string, updates: Partial<NetworkRequest>): void {
    this.requests.value = this.requests.value.map(req =>
      req.id === id ? { ...req, ...updates } : req
    );
  }
  
  public getRequests(filter?: {
    status?: NetworkRequest['status'];
    method?: string;
    urlPattern?: string;
    since?: number;
  }): NetworkRequest[] {
    let results = this.requests.value;
    
    if (filter?.status) {
      results = results.filter(r => r.status === filter.status);
    }
    
    if (filter?.method) {
      results = results.filter(r => r.method === filter.method);
    }
    
    if (filter?.urlPattern) {
      const pattern = new RegExp(filter.urlPattern);
      results = results.filter(r => pattern.test(r.url));
    }
    
    if (filter?.since) {
      results = results.filter(r => r.timestamp > filter.since);
    }
    
    return results;
  }
  
  public exportAsHAR(): any {
    return {
      log: {
        version: '1.2',
        creator: {
          name: 'React LLM',
          version: '1.0',
        },
        entries: this.requests.value.map(req => ({
          startedDateTime: new Date(req.timestamp).toISOString(),
          time: req.duration || 0,
          request: {
            method: req.method,
            url: req.url,
            headers: Object.entries(req.headers).map(([name, value]) => ({ name, value })),
            postData: req.body ? {
              mimeType: 'application/json',
              text: JSON.stringify(req.body),
            } : undefined,
          },
          response: req.response ? {
            status: req.response.status,
            statusText: req.response.statusText,
            headers: Object.entries(req.response.headers).map(([name, value]) => ({ name, value })),
            content: {
              size: req.response.size || 0,
              mimeType: req.response.headers['content-type'] || 'text/plain',
              text: JSON.stringify(req.response.body),
            },
          } : undefined,
        })),
      },
    };
  }
  
  public stop(): void {
    if (!this.isMonitoring) return;
    
    window.fetch = this.originalFetch;
    XMLHttpRequest.prototype.open = this.originalXHROpen;
    XMLHttpRequest.prototype.send = this.originalXHRSend;
    XMLHttpRequest.prototype.setRequestHeader = this.originalXHRSetRequestHeader;
    
    this.isMonitoring = false;
  }
}
```

### 3. Performance Monitoring

Collect performance metrics using Observer APIs:

```typescript
// packages/react-llm/src/monitoring/performance-monitor.ts
import { signal } from '@preact/signals';

export interface PerformanceMetric {
  id: string;
  timestamp: number;
  type: 'navigation' | 'resource' | 'paint' | 'measure' | 'mark' | 'lcp' | 'fid' | 'cls';
  name: string;
  value: number;
  metadata?: Record<string, any>;
}

export class PerformanceMonitor {
  private metrics = signal<PerformanceMetric[]>([]);
  private observers: PerformanceObserver[] = [];
  private isMonitoring = false;
  
  public start(): void {
    if (this.isMonitoring) return;
    
    // Navigation timing
    this.observeNavigationTiming();
    
    // Resource timing
    this.observeResourceTiming();
    
    // Paint timing
    this.observePaintTiming();
    
    // Largest Contentful Paint
    this.observeLCP();
    
    // First Input Delay
    this.observeFID();
    
    // Cumulative Layout Shift
    this.observeCLS();
    
    // User marks and measures
    this.observeUserTiming();
    
    this.isMonitoring = true;
  }
  
  private observeNavigationTiming(): void {
    const navEntries = performance.getEntriesByType('navigation');
    navEntries.forEach(entry => {
      const nav = entry as PerformanceNavigationTiming;
      
      this.addMetric({
        type: 'navigation',
        name: 'page-load',
        value: nav.loadEventEnd - nav.fetchStart,
        metadata: {
          dns: nav.domainLookupEnd - nav.domainLookupStart,
          tcp: nav.connectEnd - nav.connectStart,
          ttfb: nav.responseStart - nav.fetchStart,
          domContentLoaded: nav.domContentLoadedEventEnd - nav.fetchStart,
          domInteractive: nav.domInteractive - nav.fetchStart,
        },
      });
    });
  }
  
  private observeResourceTiming(): void {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        const resource = entry as PerformanceResourceTiming;
        
        this.addMetric({
          type: 'resource',
          name: resource.name,
          value: resource.duration,
          metadata: {
            initiatorType: resource.initiatorType,
            transferSize: resource.transferSize,
            encodedBodySize: resource.encodedBodySize,
            decodedBodySize: resource.decodedBodySize,
          },
        });
      });
    });
    
    observer.observe({ entryTypes: ['resource'] });
    this.observers.push(observer);
  }
  
  private observePaintTiming(): void {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        this.addMetric({
          type: 'paint',
          name: entry.name,
          value: entry.startTime,
        });
      });
    });
    
    observer.observe({ entryTypes: ['paint'] });
    this.observers.push(observer);
  }
  
  private observeLCP(): void {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      
      this.addMetric({
        type: 'lcp',
        name: 'largest-contentful-paint',
        value: lastEntry.startTime,
        metadata: {
          element: (lastEntry as any).element?.tagName,
          url: (lastEntry as any).url,
          size: (lastEntry as any).size,
        },
      });
    });
    
    observer.observe({ entryTypes: ['largest-contentful-paint'] });
    this.observers.push(observer);
  }
  
  private observeFID(): void {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        const fid = entry as PerformanceEventTiming;
        
        this.addMetric({
          type: 'fid',
          name: 'first-input-delay',
          value: fid.processingStart - fid.startTime,
          metadata: {
            eventType: fid.name,
            target: (fid as any).target?.tagName,
          },
        });
      });
    });
    
    observer.observe({ entryTypes: ['first-input'] });
    this.observers.push(observer);
  }
  
  private observeCLS(): void {
    let clsValue = 0;
    let clsEntries: any[] = [];
    
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
          clsEntries.push(entry);
        }
      }
      
      this.addMetric({
        type: 'cls',
        name: 'cumulative-layout-shift',
        value: clsValue,
        metadata: {
          shifts: clsEntries.length,
        },
      });
    });
    
    observer.observe({ entryTypes: ['layout-shift'] });
    this.observers.push(observer);
  }
  
  private observeUserTiming(): void {
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        this.addMetric({
          type: entry.entryType as 'mark' | 'measure',
          name: entry.name,
          value: entry.entryType === 'measure' ? entry.duration : entry.startTime,
        });
      });
    });
    
    observer.observe({ entryTypes: ['mark', 'measure'] });
    this.observers.push(observer);
  }
  
  private addMetric(metric: Omit<PerformanceMetric, 'id' | 'timestamp'>): void {
    const fullMetric: PerformanceMetric = {
      ...metric,
      id: `perf-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };
    
    this.metrics.value = [...this.metrics.value, fullMetric];
  }
  
  public getMetrics(filter?: {
    type?: PerformanceMetric['type'];
    name?: string;
    since?: number;
  }): PerformanceMetric[] {
    let results = this.metrics.value;
    
    if (filter?.type) {
      results = results.filter(m => m.type === filter.type);
    }
    
    if (filter?.name) {
      results = results.filter(m => m.name.includes(filter.name));
    }
    
    if (filter?.since) {
      results = results.filter(m => m.timestamp > filter.since);
    }
    
    return results;
  }
  
  public getSummary(): Record<string, any> {
    const navMetric = this.metrics.value.find(m => m.type === 'navigation');
    const lcpMetric = this.metrics.value.find(m => m.type === 'lcp');
    const fidMetric = this.metrics.value.find(m => m.type === 'fid');
    const clsMetric = this.metrics.value.find(m => m.type === 'cls');
    const fpMetric = this.metrics.value.find(m => m.name === 'first-paint');
    const fcpMetric = this.metrics.value.find(m => m.name === 'first-contentful-paint');
    
    return {
      pageLoad: navMetric?.value,
      ttfb: navMetric?.metadata?.ttfb,
      firstPaint: fpMetric?.value,
      firstContentfulPaint: fcpMetric?.value,
      largestContentfulPaint: lcpMetric?.value,
      firstInputDelay: fidMetric?.value,
      cumulativeLayoutShift: clsMetric?.value,
      resourceCount: this.metrics.value.filter(m => m.type === 'resource').length,
    };
  }
  
  public stop(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.isMonitoring = false;
  }
}
```

### 4. DOM Mutation Tracking

Monitor DOM changes for context:

```typescript
// packages/react-llm/src/monitoring/dom-monitor.ts
import { signal } from '@preact/signals';

export interface DOMChange {
  id: string;
  timestamp: number;
  type: 'added' | 'removed' | 'attributes' | 'characterData';
  target: {
    tagName?: string;
    id?: string;
    className?: string;
    path: string;
  };
  details?: Record<string, any>;
}

export class DOMMonitor {
  private changes = signal<DOMChange[]>([]);
  private observer: MutationObserver | null = null;
  private maxChanges = 1000;
  private isMonitoring = false;
  
  public start(root: Element = document.body): void {
    if (this.isMonitoring) return;
    
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        this.processMutation(mutation);
      });
    });
    
    this.observer.observe(root, {
      childList: true,
      attributes: true,
      characterData: true,
      subtree: true,
      attributeOldValue: true,
      characterDataOldValue: true,
    });
    
    this.isMonitoring = true;
  }
  
  private processMutation(mutation: MutationRecord): void {
    switch (mutation.type) {
      case 'childList':
        this.processChildListMutation(mutation);
        break;
      case 'attributes':
        this.processAttributeMutation(mutation);
        break;
      case 'characterData':
        this.processCharacterDataMutation(mutation);
        break;
    }
  }
  
  private processChildListMutation(mutation: MutationRecord): void {
    // Added nodes
    mutation.addedNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        this.addChange({
          type: 'added',
          target: this.extractElementInfo(element),
          details: {
            parentPath: this.getElementPath(mutation.target as Element),
            html: element.outerHTML.substring(0, 200),
          },
        });
      }
    });
    
    // Removed nodes
    mutation.removedNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        this.addChange({
          type: 'removed',
          target: this.extractElementInfo(element),
          details: {
            parentPath: this.getElementPath(mutation.target as Element),
          },
        });
      }
    });
  }
  
  private processAttributeMutation(mutation: MutationRecord): void {
    const element = mutation.target as Element;
    
    this.addChange({
      type: 'attributes',
      target: this.extractElementInfo(element),
      details: {
        attribute: mutation.attributeName,
        oldValue: mutation.oldValue,
        newValue: element.getAttribute(mutation.attributeName!),
      },
    });
  }
  
  private processCharacterDataMutation(mutation: MutationRecord): void {
    const node = mutation.target;
    const parent = node.parentElement;
    
    if (parent) {
      this.addChange({
        type: 'characterData',
        target: this.extractElementInfo(parent),
        details: {
          oldValue: mutation.oldValue,
          newValue: node.textContent,
        },
      });
    }
  }
  
  private extractElementInfo(element: Element): DOMChange['target'] {
    return {
      tagName: element.tagName.toLowerCase(),
      id: element.id,
      className: element.className,
      path: this.getElementPath(element),
    };
  }
  
  private getElementPath(element: Element): string {
    const path: string[] = [];
    let current: Element | null = element;
    
    while (current && current !== document.body) {
      let selector = current.tagName.toLowerCase();
      
      if (current.id) {
        selector += `#${current.id}`;
      } else if (current.className) {
        selector += `.${current.className.split(' ')[0]}`;
      } else {
        // Add index among siblings
        const parent = current.parentElement;
        if (parent) {
          const index = Array.from(parent.children).indexOf(current);
          selector += `:nth-child(${index + 1})`;
        }
      }
      
      path.unshift(selector);
      current = current.parentElement;
    }
    
    return path.join(' > ');
  }
  
  private addChange(change: Omit<DOMChange, 'id' | 'timestamp'>): void {
    const fullChange: DOMChange = {
      ...change,
      id: `dom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };
    
    const current = this.changes.value;
    const updated = [...current, fullChange];
    
    if (updated.length > this.maxChanges) {
      updated.splice(0, updated.length - this.maxChanges);
    }
    
    this.changes.value = updated;
  }
  
  public getChanges(filter?: {
    type?: DOMChange['type'];
    selector?: string;
    since?: number;
  }): DOMChange[] {
    let results = this.changes.value;
    
    if (filter?.type) {
      results = results.filter(c => c.type === filter.type);
    }
    
    if (filter?.selector) {
      results = results.filter(c => 
        c.target.path.includes(filter.selector) ||
        c.target.id === filter.selector ||
        c.target.className?.includes(filter.selector)
      );
    }
    
    if (filter?.since) {
      results = results.filter(c => c.timestamp > filter.since);
    }
    
    return results;
  }
  
  public stop(): void {
    this.observer?.disconnect();
    this.observer = null;
    this.isMonitoring = false;
  }
}
```

### 5. Context Selector UI Component

UI for @ mentioning different contexts:

```typescript
// packages/react-llm/src/components/ContextSelector.tsx
import { h } from 'preact';
import { useState, useRef, useEffect } from 'preact/hooks';
import { signal } from '@preact/signals';

interface ContextOption {
  id: string;
  type: 'console' | 'network' | 'performance' | 'dom' | 'components';
  label: string;
  icon: string;
  description: string;
  filter?: Record<string, any>;
}

const contextOptions: ContextOption[] = [
  {
    id: 'console-all',
    type: 'console',
    label: '@console',
    icon: '📋',
    description: 'All console logs',
  },
  {
    id: 'console-errors',
    type: 'console',
    label: '@errors',
    icon: '🚨',
    description: 'Console errors only',
    filter: { level: 'error' },
  },
  {
    id: 'network-all',
    type: 'network',
    label: '@network',
    icon: '🌐',
    description: 'All network requests',
  },
  {
    id: 'network-failed',
    type: 'network',
    label: '@failed-requests',
    icon: '❌',
    description: 'Failed network requests',
    filter: { status: 'failed' },
  },
  {
    id: 'performance',
    type: 'performance',
    label: '@performance',
    icon: '⚡',
    description: 'Performance metrics',
  },
  {
    id: 'dom-changes',
    type: 'dom',
    label: '@dom-changes',
    icon: '🔄',
    description: 'Recent DOM mutations',
  },
  {
    id: 'components',
    type: 'components',
    label: '@components',
    icon: '🧩',
    description: 'Selected React components',
  },
];

interface Props {
  onSelect: (context: ContextOption) => void;
  position: { x: number; y: number };
  searchTerm: string;
}

export const ContextSelector = ({ onSelect, position, searchTerm }: Props) => {
  const [filteredOptions, setFilteredOptions] = useState(contextOptions);
  const selectedIndex = signal(0);
  
  useEffect(() => {
    const filtered = contextOptions.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOptions(filtered);
    selectedIndex.value = 0;
  }, [searchTerm]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          selectedIndex.value = Math.min(
            selectedIndex.value + 1,
            filteredOptions.length - 1
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          selectedIndex.value = Math.max(selectedIndex.value - 1, 0);
          break;
        case 'Enter':
          e.preventDefault();
          onSelect(filteredOptions[selectedIndex.value]);
          break;
        case 'Escape':
          e.preventDefault();
          onSelect(null as any);
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [filteredOptions, onSelect]);
  
  return (
    <div
      className="context-selector"
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translateY(-100%)',
      }}
    >
      <div className="context-options">
        {filteredOptions.map((option, index) => (
          <div
            key={option.id}
            className={`context-option ${index === selectedIndex.value ? 'selected' : ''}`}
            onClick={() => onSelect(option)}
            onMouseEnter={() => selectedIndex.value = index}
          >
            <span className="context-icon">{option.icon}</span>
            <div className="context-info">
              <div className="context-label">{option.label}</div>
              <div className="context-description">{option.description}</div>
            </div>
          </div>
        ))}
      </div>
      
      <style>{`
        .context-selector {
          background: var(--theme-surface);
          border: 1px solid var(--theme-border);
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          max-width: 300px;
          overflow: hidden;
        }
        
        .context-options {
          max-height: 200px;
          overflow-y: auto;
        }
        
        .context-option {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 12px;
          cursor: pointer;
          transition: background 150ms;
        }
        
        .context-option:hover,
        .context-option.selected {
          background: var(--theme-surfaceHover);
        }
        
        .context-icon {
          font-size: 20px;
          width: 24px;
          text-align: center;
        }
        
        .context-info {
          flex: 1;
          min-width: 0;
        }
        
        .context-label {
          font-weight: 500;
          color: var(--theme-text);
        }
        
        .context-description {
          font-size: 12px;
          color: var(--theme-textSecondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      `}</style>
    </div>
  );
};
```

### 6. Monitor Manager

Unified API for all monitoring:

```typescript
// packages/react-llm/src/monitoring/monitor-manager.ts
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
}
```

## Dependencies

### Required
- No external dependencies needed (using browser-native APIs)
- TypeScript types for Chrome DevTools Protocol (dev dependency)

### Optional
- `chrome-remote-interface`: For enhanced CDP support
- `web-vitals`: For additional performance metrics

## Testing Strategy

### Unit Testing
```typescript
// Test console monitoring
test('Console monitor captures log entries', () => {
  const monitor = new ConsoleMonitor();
  monitor.start();
  
  console.log('Test message');
  console.error('Test error');
  
  const entries = monitor.getEntries();
  expect(entries).toHaveLength(2);
  expect(entries[0].level).toBe('log');
  expect(entries[1].level).toBe('error');
  
  monitor.stop();
});

// Test network monitoring
test('Network monitor captures fetch requests', async () => {
  const monitor = new NetworkMonitor();
  monitor.start();
  
  await fetch('/api/test');
  
  const requests = monitor.getRequests();
  expect(requests).toHaveLength(1);
  expect(requests[0].url).toContain('/api/test');
  
  monitor.stop();
});
```

### Integration Testing
- Test @ mention UI interaction
- Verify context inclusion in chat
- Test monitoring across different browsers
- Performance impact measurement

## Security Considerations

### Data Sanitization
- Remove sensitive data from logs (passwords, tokens)
- Filter network request/response bodies
- Limit stored data volume

### Performance Impact
- Use sampling for high-frequency events
- Implement circular buffers for storage
- Debounce DOM mutation observations

## Effort Estimate

**5-6 developer days**

### Breakdown:
- Day 1: Console and network monitoring
- Day 2: Performance and DOM monitoring
- Day 3: Context selector UI and integration
- Day 4: Monitor manager and chat integration
- Day 5: Chrome DevTools Protocol integration
- Day 0.5-1: Testing and optimization

## Success Metrics

- [ ] Console logs captured with <1ms overhead
- [ ] Network requests tracked accurately
- [ ] Performance metrics match DevTools
- [ ] DOM changes tracked without memory leaks
- [ ] @ mention UI responsive and intuitive
- [ ] Context included in chat messages
- [ ] Works without Chrome DevTools
- [ ] Data volume manageable (<10MB)