import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PerformanceMonitor } from './performance-monitor';

describe('PerformanceMonitor', () => {
  let monitor: PerformanceMonitor;
  let performanceObserverMock: any;
  let originalPerformanceObserver: any;
  
  beforeEach(() => {
    monitor = new PerformanceMonitor();
    
    // Mock PerformanceObserver
    originalPerformanceObserver = globalThis.PerformanceObserver;
    performanceObserverMock = vi.fn();
    performanceObserverMock.prototype.observe = vi.fn();
    performanceObserverMock.prototype.disconnect = vi.fn();
    performanceObserverMock.supportedEntryTypes = ['navigation', 'resource', 'paint', 'largest-contentful-paint', 'first-input', 'layout-shift'];
    
    globalThis.PerformanceObserver = performanceObserverMock;
  });
  
  afterEach(() => {
    monitor.stop();
    globalThis.PerformanceObserver = originalPerformanceObserver;
  });
  
  it('should initialize with empty metrics', () => {
    const metrics = monitor.getMetrics();
    expect(metrics).toEqual([]);
  });
  
  it('should start monitoring performance', () => {
    monitor.start();
    
    expect(performanceObserverMock).toHaveBeenCalled();
    expect(performanceObserverMock.prototype.observe).toHaveBeenCalled();
  });
  
  it('should capture navigation timing metrics', () => {
    monitor.start();
    
    // Simulate navigation entry
    const callback = performanceObserverMock.mock.calls[0][0];
    const navigationEntry = {
      entryType: 'navigation',
      name: 'https://example.com',
      startTime: 0,
      loadEventEnd: 1500,
      domContentLoadedEventEnd: 800,
      fetchStart: 10,
      responseStart: 200,
    };
    
    callback({
      getEntries: () => [navigationEntry],
    });
    
    const metrics = monitor.getMetrics();
    expect(metrics).toContainEqual(
      expect.objectContaining({
        type: 'navigation',
        name: 'pageLoad',
        value: 1500,
      })
    );
  });
  
  it('should capture paint timing metrics', () => {
    monitor.start();
    
    const callback = performanceObserverMock.mock.calls[0][0];
    const paintEntries = [
      {
        entryType: 'paint',
        name: 'first-paint',
        startTime: 500,
      },
      {
        entryType: 'paint',
        name: 'first-contentful-paint',
        startTime: 800,
      },
    ];
    
    callback({
      getEntries: () => paintEntries,
    });
    
    const metrics = monitor.getMetrics();
    expect(metrics).toContainEqual(
      expect.objectContaining({
        type: 'paint',
        name: 'first-paint',
        value: 500,
      })
    );
    expect(metrics).toContainEqual(
      expect.objectContaining({
        type: 'paint',
        name: 'first-contentful-paint',
        value: 800,
      })
    );
  });
  
  it('should capture LCP metrics', () => {
    monitor.start();
    
    const callback = performanceObserverMock.mock.calls[0][0];
    const lcpEntry = {
      entryType: 'largest-contentful-paint',
      startTime: 1200,
      size: 50000,
      element: '<img>',
    };
    
    callback({
      getEntries: () => [lcpEntry],
    });
    
    const metrics = monitor.getMetrics();
    expect(metrics).toContainEqual(
      expect.objectContaining({
        type: 'largest-contentful-paint',
        name: 'LCP',
        value: 1200,
        details: expect.objectContaining({
          size: 50000,
          element: '<img>',
        }),
      })
    );
  });
  
  it('should capture FID metrics', () => {
    monitor.start();
    
    const callback = performanceObserverMock.mock.calls[0][0];
    const fidEntry = {
      entryType: 'first-input',
      processingStart: 1000,
      startTime: 950,
      name: 'click',
    };
    
    callback({
      getEntries: () => [fidEntry],
    });
    
    const metrics = monitor.getMetrics();
    expect(metrics).toContainEqual(
      expect.objectContaining({
        type: 'first-input',
        name: 'FID',
        value: 50, // processingStart - startTime
        details: expect.objectContaining({
          eventType: 'click',
        }),
      })
    );
  });
  
  it('should capture CLS metrics', () => {
    monitor.start();
    
    const callback = performanceObserverMock.mock.calls[0][0];
    const clsEntry = {
      entryType: 'layout-shift',
      value: 0.05,
      hadRecentInput: false,
    };
    
    callback({
      getEntries: () => [clsEntry],
    });
    
    const metrics = monitor.getMetrics();
    expect(metrics).toContainEqual(
      expect.objectContaining({
        type: 'layout-shift',
        name: 'CLS',
        value: 0.05,
      })
    );
  });
  
  it('should accumulate CLS values', () => {
    monitor.start();
    
    const callback = performanceObserverMock.mock.calls[0][0];
    
    // First shift
    callback({
      getEntries: () => [{
        entryType: 'layout-shift',
        value: 0.1,
        hadRecentInput: false,
      }],
    });
    
    // Second shift
    callback({
      getEntries: () => [{
        entryType: 'layout-shift',
        value: 0.05,
        hadRecentInput: false,
      }],
    });
    
    const summary = monitor.getSummary();
    expect(summary.cumulativeLayoutShift).toBe(0.15);
  });
  
  it('should provide performance summary', () => {
    monitor.start();
    
    const callback = performanceObserverMock.mock.calls[0][0];
    
    // Add various metrics
    callback({
      getEntries: () => [
        {
          entryType: 'navigation',
          loadEventEnd: 2000,
          fetchStart: 10,
          responseStart: 200,
        },
        {
          entryType: 'paint',
          name: 'first-contentful-paint',
          startTime: 800,
        },
        {
          entryType: 'largest-contentful-paint',
          startTime: 1500,
        },
      ],
    });
    
    const summary = monitor.getSummary();
    expect(summary).toMatchObject({
      pageLoad: 2000,
      ttfb: 190, // responseStart - fetchStart
      firstContentfulPaint: 800,
      largestContentfulPaint: 1500,
    });
  });
  
  it('should mark custom metrics', () => {
    monitor.start();
    
    monitor.mark('customMetric', 123.45);
    
    const metrics = monitor.getMetrics();
    expect(metrics).toContainEqual(
      expect.objectContaining({
        type: 'custom',
        name: 'customMetric',
        value: 123.45,
      })
    );
  });
  
  it('should clear all metrics', () => {
    monitor.start();
    
    monitor.mark('test', 100);
    expect(monitor.getMetrics()).toHaveLength(1);
    
    monitor.clear();
    expect(monitor.getMetrics()).toHaveLength(0);
  });
  
  it('should stop monitoring when stopped', () => {
    monitor.start();
    monitor.stop();
    
    expect(performanceObserverMock.prototype.disconnect).toHaveBeenCalled();
  });
});