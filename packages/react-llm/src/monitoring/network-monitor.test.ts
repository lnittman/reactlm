import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NetworkMonitor } from './network-monitor';

describe('NetworkMonitor', () => {
  let monitor: NetworkMonitor;
  let originalFetch: typeof globalThis.fetch;
  let fetchMock: any;
  
  beforeEach(() => {
    monitor = new NetworkMonitor();
    originalFetch = globalThis.fetch;
    
    // Create a mock fetch
    fetchMock = vi.fn();
    globalThis.fetch = fetchMock;
  });
  
  afterEach(() => {
    monitor.stop();
    globalThis.fetch = originalFetch;
  });
  
  it('should initialize with empty requests', () => {
    expect(monitor.getRequests()).toEqual([]);
  });
  
  it('should capture successful fetch requests', async () => {
    monitor.start();
    
    const mockResponse = new Response('{"data": "test"}', {
      status: 200,
      statusText: 'OK',
      headers: new Headers({ 'content-type': 'application/json' }),
    });
    
    fetchMock.mockResolvedValueOnce(mockResponse);
    
    await fetch('https://api.example.com/data');
    
    const requests = monitor.getRequests();
    expect(requests).toHaveLength(1);
    expect(requests[0]).toMatchObject({
      method: 'GET',
      url: 'https://api.example.com/data',
      startTime: expect.any(Number),
      response: {
        status: 200,
        statusText: 'OK',
        headers: expect.any(Object),
      },
    });
    expect(requests[0].duration).toBeGreaterThanOrEqual(0);
  });
  
  it('should capture POST requests with body', async () => {
    monitor.start();
    
    const mockResponse = new Response('{"success": true}', { status: 201 });
    fetchMock.mockResolvedValueOnce(mockResponse);
    
    const body = JSON.stringify({ name: 'test' });
    await fetch('https://api.example.com/users', {
      method: 'POST',
      body,
      headers: { 'Content-Type': 'application/json' },
    });
    
    const requests = monitor.getRequests();
    expect(requests).toHaveLength(1);
    expect(requests[0]).toMatchObject({
      method: 'POST',
      url: 'https://api.example.com/users',
      requestBody: body,
      requestHeaders: expect.objectContaining({
        'Content-Type': 'application/json',
      }),
    });
  });
  
  it('should capture failed requests', async () => {
    monitor.start();
    
    const mockResponse = new Response('Not Found', { status: 404 });
    fetchMock.mockResolvedValueOnce(mockResponse);
    
    await fetch('https://api.example.com/missing');
    
    const requests = monitor.getRequests();
    expect(requests).toHaveLength(1);
    expect(requests[0].response?.status).toBe(404);
  });
  
  it('should capture network errors', async () => {
    monitor.start();
    
    const networkError = new Error('Network error');
    fetchMock.mockRejectedValueOnce(networkError);
    
    try {
      await fetch('https://api.example.com/error');
    } catch (e) {
      // Expected to throw
    }
    
    const requests = monitor.getRequests();
    expect(requests).toHaveLength(1);
    expect(requests[0].error).toBe('Network error');
    expect(requests[0].response).toBeUndefined();
  });
  
  it('should filter requests by status', async () => {
    monitor.start();
    
    // Create different responses
    fetchMock
      .mockResolvedValueOnce(new Response('OK', { status: 200 }))
      .mockResolvedValueOnce(new Response('Not Found', { status: 404 }))
      .mockResolvedValueOnce(new Response('Error', { status: 500 }));
    
    await Promise.all([
      fetch('https://api.example.com/success'),
      fetch('https://api.example.com/notfound'),
      fetch('https://api.example.com/error'),
    ]);
    
    const failedRequests = monitor.getRequests({ status: 'failed' });
    expect(failedRequests).toHaveLength(2);
    expect(failedRequests.every(r => r.response!.status >= 400)).toBe(true);
  });
  
  it('should filter requests by URL pattern', async () => {
    monitor.start();
    
    fetchMock.mockResolvedValue(new Response('OK', { status: 200 }));
    
    await Promise.all([
      fetch('https://api.example.com/users'),
      fetch('https://api.example.com/posts'),
      fetch('https://other.com/data'),
    ]);
    
    const apiRequests = monitor.getRequests({ 
      urlPattern: 'api.example.com' 
    });
    expect(apiRequests).toHaveLength(2);
    expect(apiRequests.every(r => r.url.includes('api.example.com'))).toBe(true);
  });
  
  it('should respect maxRequests limit', async () => {
    const maxRequests = 3;
    monitor = new NetworkMonitor(maxRequests);
    monitor.start();
    
    fetchMock.mockResolvedValue(new Response('OK', { status: 200 }));
    
    // Make more requests than the limit
    for (let i = 0; i < 5; i++) {
      await fetch(`https://api.example.com/item/${i}`);
    }
    
    const requests = monitor.getRequests();
    expect(requests).toHaveLength(maxRequests);
    // Should keep the most recent requests
    expect(requests[0].url).toContain('/item/2');
    expect(requests[2].url).toContain('/item/4');
  });
  
  it('should clear all requests', async () => {
    monitor.start();
    
    fetchMock.mockResolvedValue(new Response('OK', { status: 200 }));
    
    await fetch('https://api.example.com/data');
    expect(monitor.getRequests()).toHaveLength(1);
    
    monitor.clear();
    expect(monitor.getRequests()).toHaveLength(0);
  });
  
  it('should stop monitoring when stopped', async () => {
    monitor.start();
    
    fetchMock.mockResolvedValue(new Response('OK', { status: 200 }));
    
    await fetch('https://api.example.com/first');
    monitor.stop();
    await fetch('https://api.example.com/second');
    
    const requests = monitor.getRequests();
    expect(requests).toHaveLength(1);
    expect(requests[0].url).toContain('/first');
  });
  
  it('should capture request and response sizes', async () => {
    monitor.start();
    
    const responseBody = '{"data": "a".repeat(1000)}';
    const mockResponse = new Response(responseBody, {
      status: 200,
      headers: new Headers({ 
        'content-length': responseBody.length.toString() 
      }),
    });
    
    fetchMock.mockResolvedValueOnce(mockResponse);
    
    await fetch('https://api.example.com/data');
    
    const requests = monitor.getRequests();
    expect(requests[0].responseSize).toBe(responseBody.length);
  });
});