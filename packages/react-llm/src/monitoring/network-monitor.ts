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
      const url = typeof input === 'string' ? input : (input as Request).url;
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