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
        // Call original method first to maintain normal console behavior
        original.apply(console, args);
        
        // Capture entry with minimal overhead
        try {
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
        } catch (error) {
          // Silently fail to avoid infinite recursion
        }
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