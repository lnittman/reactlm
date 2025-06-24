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