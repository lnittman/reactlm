import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ConsoleMonitor } from './console-monitor';

describe('ConsoleMonitor', () => {
  let monitor: ConsoleMonitor;
  let originalConsole: any;
  
  beforeEach(() => {
    monitor = new ConsoleMonitor();
    // Store original console methods
    originalConsole = {
      log: console.log,
      warn: console.warn,
      error: console.error,
      info: console.info,
      debug: console.debug,
    };
  });
  
  afterEach(() => {
    monitor.stop();
    // Restore original console methods
    Object.assign(console, originalConsole);
  });
  
  it('should initialize with empty entries', () => {
    expect(monitor.getEntries()).toEqual([]);
  });
  
  it('should capture console.log calls', () => {
    monitor.start();
    
    console.log('Test message');
    
    const entries = monitor.getEntries();
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({
      level: 'log',
      args: ['Test message'],
      formatted: 'Test message',
    });
    expect(entries[0].timestamp).toBeDefined();
  });
  
  it('should capture console.error calls', () => {
    monitor.start();
    
    const error = new Error('Test error');
    console.error('Error occurred:', error);
    
    const entries = monitor.getEntries();
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({
      level: 'error',
      args: ['Error occurred:', error],
    });
  });
  
  it('should capture console.warn calls', () => {
    monitor.start();
    
    console.warn('Warning message');
    
    const entries = monitor.getEntries();
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({
      level: 'warn',
      args: ['Warning message'],
      formatted: 'Warning message',
    });
  });
  
  it('should capture console.info calls', () => {
    monitor.start();
    
    console.info('Info message');
    
    const entries = monitor.getEntries();
    expect(entries).toHaveLength(1);
    expect(entries[0]).toMatchObject({
      level: 'info',
      args: ['Info message'],
      formatted: 'Info message',
    });
  });
  
  it('should format multiple arguments correctly', () => {
    monitor.start();
    
    console.log('Message', { key: 'value' }, 123);
    
    const entries = monitor.getEntries();
    expect(entries).toHaveLength(1);
    expect(entries[0].formatted).toBe('Message {"key":"value"} 123');
  });
  
  it('should respect maxEntries limit', () => {
    const maxEntries = 5;
    monitor = new ConsoleMonitor(maxEntries);
    monitor.start();
    
    // Log more than maxEntries
    for (let i = 0; i < 10; i++) {
      console.log(`Message ${i}`);
    }
    
    const entries = monitor.getEntries();
    expect(entries).toHaveLength(maxEntries);
    // Should keep the most recent entries
    expect(entries[0].formatted).toBe('Message 5');
    expect(entries[4].formatted).toBe('Message 9');
  });
  
  it('should filter entries by level', () => {
    monitor.start();
    
    console.log('Log message');
    console.error('Error message');
    console.warn('Warning message');
    
    const errorEntries = monitor.getEntries({ level: 'error' });
    expect(errorEntries).toHaveLength(1);
    expect(errorEntries[0].level).toBe('error');
    
    const warnEntries = monitor.getEntries({ level: 'warn' });
    expect(warnEntries).toHaveLength(1);
    expect(warnEntries[0].level).toBe('warn');
  });
  
  it('should clear all entries', () => {
    monitor.start();
    
    console.log('Message 1');
    console.log('Message 2');
    
    expect(monitor.getEntries()).toHaveLength(2);
    
    monitor.clear();
    
    expect(monitor.getEntries()).toHaveLength(0);
  });
  
  it('should stop monitoring when stopped', () => {
    monitor.start();
    console.log('Message 1');
    
    monitor.stop();
    console.log('Message 2'); // This should not be captured
    
    const entries = monitor.getEntries();
    expect(entries).toHaveLength(1);
    expect(entries[0].formatted).toBe('Message 1');
  });
  
  it('should handle circular references in objects', () => {
    monitor.start();
    
    const obj: any = { a: 1 };
    obj.circular = obj;
    
    console.log('Circular:', obj);
    
    const entries = monitor.getEntries();
    expect(entries).toHaveLength(1);
    // Should not throw and should have some formatted output
    expect(entries[0].formatted).toContain('Circular:');
  });
  
  it('should capture stack traces for errors', () => {
    monitor.start();
    
    const error = new Error('Test error');
    console.error(error);
    
    const entries = monitor.getEntries();
    expect(entries).toHaveLength(1);
    expect(entries[0].stack).toBeDefined();
    expect(entries[0].stack).toContain('Test error');
  });
});