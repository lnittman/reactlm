/**
 * Canvas Renderer Web Worker
 * 
 * Handles canvas rendering operations in a separate thread for better performance.
 * Communicates with main thread via postMessage.
 */

export interface ComponentBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ComponentRenderInfo {
  id: string;
  name: string;
  bounds: ComponentBounds;
  isComponent: boolean;
  fiberType: string;
  depth: number;
}

export interface RenderCommand {
  type: 'render' | 'clear' | 'resize';
  data?: any;
}

export interface RenderOptions {
  width: number;
  height: number;
  component: ComponentRenderInfo;
  theme: 'light' | 'dark';
}

export interface ClearOptions {
  width: number;
  height: number;
}

export interface ResizeOptions {
  width: number;
  height: number;
}

// Web Worker code (will be inlined by tsup)
const workerCode = `
class CanvasRenderer {
  private canvas: OffscreenCanvas | null = null;
  private ctx: OffscreenCanvasRenderingContext2D | null = null;
  
  constructor() {
    this.setupMessageHandler();
  }
  
  private setupMessageHandler() {
    self.addEventListener('message', (event) => {
      const { type, data } = event.data;
      
      try {
        switch (type) {
          case 'init':
            this.init(data);
            break;
          case 'render':
            this.render(data);
            break;
          case 'clear':
            this.clear(data);
            break;
          case 'resize':
            this.resize(data);
            break;
          default:
            console.warn('[CanvasRenderer] Unknown command type:', type);
        }
      } catch (error) {
        self.postMessage({
          type: 'error',
          error: error.message
        });
      }
    });
  }
  
  private init(data: { canvas: OffscreenCanvas }) {
    this.canvas = data.canvas;
    this.ctx = this.canvas.getContext('2d');
    
    if (!this.ctx) {
      throw new Error('Failed to get 2D rendering context');
    }
    
    self.postMessage({ type: 'ready' });
  }
  
  private render(options: RenderOptions) {
    if (!this.ctx || !this.canvas) {
      throw new Error('Canvas not initialized');
    }
    
    const { width, height, component, theme } = options;
    
    // Clear canvas
    this.ctx.clearRect(0, 0, width, height);
    
    // Set up theme colors
    const colors = this.getThemeColors(theme);
    
    // Draw component outline
    this.drawComponentOutline(component, colors);
    
    // Draw component label
    this.drawComponentLabel(component, colors);
    
    // Notify main thread that rendering is complete
    self.postMessage({ type: 'rendered', componentId: component.id });
  }
  
  private clear(options: ClearOptions) {
    if (!this.ctx) return;
    
    const { width, height } = options;
    this.ctx.clearRect(0, 0, width, height);
    
    self.postMessage({ type: 'cleared' });
  }
  
  private resize(options: ResizeOptions) {
    if (!this.canvas) return;
    
    const { width, height } = options;
    this.canvas.width = width;
    this.canvas.height = height;
    
    self.postMessage({ type: 'resized', width, height });
  }
  
  private getThemeColors(theme: 'light' | 'dark') {
    if (theme === 'light') {
      return {
        outline: 'rgba(0, 122, 255, 0.8)',
        fill: 'rgba(0, 122, 255, 0.1)',
        labelBg: 'rgba(0, 122, 255, 0.9)',
        labelText: 'white',
        labelSecondary: 'rgba(255, 255, 255, 0.7)'
      };
    } else {
      return {
        outline: 'rgba(100, 200, 255, 0.8)',
        fill: 'rgba(100, 200, 255, 0.1)',
        labelBg: 'rgba(100, 200, 255, 0.9)',
        labelText: 'white',
        labelSecondary: 'rgba(255, 255, 255, 0.7)'
      };
    }
  }
  
  private drawComponentOutline(component: ComponentRenderInfo, colors: any) {
    if (!this.ctx) return;
    
    const { bounds } = component;
    
    // Draw filled background
    this.ctx.fillStyle = colors.fill;
    this.ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
    
    // Draw outline
    this.ctx.strokeStyle = colors.outline;
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
    
    // Add subtle shadow for depth
    if (component.isComponent) {
      this.ctx.shadowColor = colors.outline;
      this.ctx.shadowBlur = 4;
      this.ctx.shadowOffsetX = 2;
      this.ctx.shadowOffsetY = 2;
      this.ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
      
      // Reset shadow
      this.ctx.shadowColor = 'transparent';
      this.ctx.shadowBlur = 0;
      this.ctx.shadowOffsetX = 0;
      this.ctx.shadowOffsetY = 0;
    }
  }
  
  private drawComponentLabel(component: ComponentRenderInfo, colors: any) {
    if (!this.ctx || !component.name || component.name === 'Unknown') return;
    
    const { bounds } = component;
    const labelHeight = 20;
    const labelPadding = 8;
    const fontSize = 12;
    const fontFamily = 'IosevkaTerm, monospace';
    
    // Calculate label dimensions
    this.ctx.font = fontSize + 'px ' + fontFamily;
    const textWidth = this.ctx.measureText(component.name).width;
    const labelWidth = textWidth + labelPadding * 2;
    
    // Position label above or below the component
    const labelY = bounds.y > labelHeight ? bounds.y - labelHeight : bounds.y + bounds.height;
    const labelX = Math.min(bounds.x, window.innerWidth - labelWidth);
    
    // Draw label background
    this.ctx.fillStyle = colors.labelBg;
    this.ctx.fillRect(labelX, labelY, labelWidth, labelHeight);
    
    // Draw label text
    this.ctx.fillStyle = colors.labelText;
    this.ctx.font = fontSize + 'px ' + fontFamily;
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(component.name, labelX + labelPadding, labelY + labelHeight / 2);
    
    // Draw component type if it's not a regular component
    if (!component.isComponent && component.fiberType) {
      const typeText = '(' + component.fiberType + ')';
      const typeX = labelX + labelWidth + 4;
      
      this.ctx.font = '10px ' + fontFamily;
      this.ctx.fillStyle = colors.labelSecondary;
      this.ctx.fillText(typeText, typeX, labelY + labelHeight / 2);
    }
    
    // Draw depth indicator for nested components
    if (component.depth > 0) {
      const depthColor = 'rgba(255, 255, 255, ' + Math.max(0.3, 1 - component.depth * 0.1) + ')';
      this.ctx.fillStyle = depthColor;
      this.ctx.fillRect(labelX - 2, labelY, 2, labelHeight);
    }
  }
}

// Initialize the renderer
new CanvasRenderer();
`;

/**
 * Canvas Renderer Manager
 * 
 * Manages the Web Worker for canvas rendering operations.
 */
export class CanvasRendererManager {
  private worker: Worker | null = null;
  private canvas: HTMLCanvasElement | null = null;
  private offscreenCanvas: OffscreenCanvas | null = null;
  private isReady = false;
  private messageQueue: any[] = [];

  constructor() {
    this.initWorker();
  }

  private initWorker(): void {
    try {
      // Create worker from inline code
      const blob = new Blob([workerCode], { type: 'application/javascript' });
      const workerUrl = URL.createObjectURL(blob);
      this.worker = new Worker(workerUrl);
      
      this.worker.addEventListener('message', this.handleWorkerMessage.bind(this));
      this.worker.addEventListener('error', this.handleWorkerError.bind(this));
      
      // Clean up URL
      URL.revokeObjectURL(workerUrl);
    } catch (error) {
      console.error('[CanvasRenderer] Failed to create worker:', error);
      // Fallback to main thread rendering
      this.worker = null;
    }
  }

  private handleWorkerMessage(event: MessageEvent): void {
    const { type, data } = event.data;
    
    switch (type) {
      case 'ready':
        this.isReady = true;
        this.flushMessageQueue();
        break;
      case 'rendered':
        // Component rendered successfully
        break;
      case 'cleared':
        // Canvas cleared successfully
        break;
      case 'resized':
        // Canvas resized successfully
        break;
      case 'error':
        console.error('[CanvasRenderer] Worker error:', data);
        break;
    }
  }

  private handleWorkerError(error: ErrorEvent): void {
    console.error('[CanvasRenderer] Worker error:', error);
  }

  private sendMessage(message: any): void {
    if (!this.worker) return;
    
    if (this.isReady) {
      this.worker.postMessage(message);
    } else {
      this.messageQueue.push(message);
    }
  }

  private flushMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (this.worker) {
        this.worker.postMessage(message);
      }
    }
  }

  /**
   * Initialize canvas for rendering
   */
  initCanvas(canvas: HTMLCanvasElement): boolean {
    this.canvas = canvas;
    
    // Check if OffscreenCanvas is supported
    if (typeof OffscreenCanvas !== 'undefined') {
      try {
        this.offscreenCanvas = canvas.transferControlToOffscreen();
        this.sendMessage({
          type: 'init',
          data: { canvas: this.offscreenCanvas }
        });
        return true;
      } catch (error) {
        console.warn('[CanvasRenderer] OffscreenCanvas transfer failed:', error);
        return false;
      }
    }
    
    return false;
  }

  /**
   * Render a component outline
   */
  renderComponent(component: ComponentRenderInfo, theme: 'light' | 'dark' = 'dark'): void {
    if (!this.canvas) return;
    
    const options: RenderOptions = {
      width: this.canvas.width,
      height: this.canvas.height,
      component,
      theme
    };
    
    this.sendMessage({
      type: 'render',
      data: options
    });
  }

  /**
   * Clear the canvas
   */
  clear(): void {
    if (!this.canvas) return;
    
    const options: ClearOptions = {
      width: this.canvas.width,
      height: this.canvas.height
    };
    
    this.sendMessage({
      type: 'clear',
      data: options
    });
  }

  /**
   * Resize the canvas
   */
  resize(width: number, height: number): void {
    if (!this.canvas) return;
    
    const options: ResizeOptions = {
      width,
      height
    };
    
    this.sendMessage({
      type: 'resize',
      data: options
    });
  }

  /**
   * Check if worker is available
   */
  isWorkerAvailable(): boolean {
    return this.worker !== null && this.isReady;
  }

  /**
   * Destroy the worker
   */
  destroy(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.isReady = false;
    this.messageQueue.length = 0;
  }
}

/**
 * Fallback main-thread canvas renderer
 */
export class MainThreadCanvasRenderer {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;

  initCanvas(canvas: HTMLCanvasElement): boolean {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    return this.ctx !== null;
  }

  renderComponent(component: ComponentRenderInfo, theme: 'light' | 'dark' = 'dark'): void {
    if (!this.ctx || !this.canvas) return;
    
    const colors = this.getThemeColors(theme);
    
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw component outline
    this.drawComponentOutline(component, colors);
    
    // Draw component label
    this.drawComponentLabel(component, colors);
  }

  clear(): void {
    if (!this.ctx || !this.canvas) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  resize(width: number, height: number): void {
    if (!this.canvas) return;
    this.canvas.width = width;
    this.canvas.height = height;
  }

  private getThemeColors(theme: 'light' | 'dark') {
    if (theme === 'light') {
      return {
        outline: 'rgba(0, 122, 255, 0.8)',
        fill: 'rgba(0, 122, 255, 0.1)',
        labelBg: 'rgba(0, 122, 255, 0.9)',
        labelText: 'white',
        labelSecondary: 'rgba(255, 255, 255, 0.7)'
      };
    } else {
      return {
        outline: 'rgba(100, 200, 255, 0.8)',
        fill: 'rgba(100, 200, 255, 0.1)',
        labelBg: 'rgba(100, 200, 255, 0.9)',
        labelText: 'white',
        labelSecondary: 'rgba(255, 255, 255, 0.7)'
      };
    }
  }

  private drawComponentOutline(component: ComponentRenderInfo, colors: any): void {
    if (!this.ctx) return;
    
    const { bounds } = component;
    
    // Draw filled background
    this.ctx.fillStyle = colors.fill;
    this.ctx.fillRect(bounds.x, bounds.y, bounds.width, bounds.height);
    
    // Draw outline
    this.ctx.strokeStyle = colors.outline;
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(bounds.x, bounds.y, bounds.width, bounds.height);
  }

  private drawComponentLabel(component: ComponentRenderInfo, colors: any): void {
    if (!this.ctx || !component.name || component.name === 'Unknown') return;
    
    const { bounds } = component;
    const labelHeight = 20;
    const labelPadding = 8;
    const fontSize = 12;
    const fontFamily = 'IosevkaTerm, monospace';
    
    // Calculate label dimensions
    this.ctx.font = `${fontSize}px ${fontFamily}`;
    const textWidth = this.ctx.measureText(component.name).width;
    const labelWidth = textWidth + labelPadding * 2;
    
    // Position label
    const labelY = bounds.y > labelHeight ? bounds.y - labelHeight : bounds.y + bounds.height;
    const labelX = Math.min(bounds.x, window.innerWidth - labelWidth);
    
    // Draw label background
    this.ctx.fillStyle = colors.labelBg;
    this.ctx.fillRect(labelX, labelY, labelWidth, labelHeight);
    
    // Draw label text
    this.ctx.fillStyle = colors.labelText;
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(component.name, labelX + labelPadding, labelY + labelHeight / 2);
  }
}