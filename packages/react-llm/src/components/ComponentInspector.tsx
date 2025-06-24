/** @jsx h */
import { h } from 'preact';
import { useEffect, useRef } from 'preact/hooks';
import { ComponentInspector as BippyInspector, type ComponentInfo } from '../instrumentation/bippy-adapter';

interface Props {
  isActive: boolean;
  onSelect: (component: ComponentInfo) => void;
  theme?: 'light' | 'dark';
}

export function ComponentInspector({ isActive, onSelect, theme = 'dark' }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const inspectorRef = useRef<BippyInspector | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  
  useEffect(() => {
    // Clean up any existing listeners first
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }
    
    // If not active, ensure everything is cleaned up and return
    if (!isActive) {
      if (containerRef.current) {
        containerRef.current.remove();
        containerRef.current = null;
      }
      return;
    }
    
    // Only proceed if active
    console.log('[ComponentInspector] Activating component selection mode');
    
    // Initialize bippy inspector
    if (!inspectorRef.current) {
      inspectorRef.current = (window as any).ReactLLM?.inspector || new BippyInspector();
    }
    
    // Create container for canvas overlay (following react-scan pattern)
    const container = document.createElement('div');
    container.setAttribute('data-react-llm-inspector', 'true');
    container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 2147483646;
    `;
    
    // Create canvas directly (no shadow DOM needed for overlay)
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      display: block;
    `;
    
    // Set canvas size
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    
    container.appendChild(canvas);
    document.body.appendChild(container);
    
    containerRef.current = container;
    canvasRef.current = canvas;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.error('[ComponentInspector] Failed to get canvas context');
      return;
    }
    
    // Scale for device pixel ratio
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    
    let hoveredComponent: ComponentInfo | null = null;
    let animationFrameId: number | null = null;
    
    const drawHighlight = (component: ComponentInfo) => {
      if (!component.domElement || !ctx) return;
      
      const rect = component.domElement.getBoundingClientRect();
      
      // Clear canvas
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      
      // Draw highlight
      ctx.fillStyle = theme === 'dark' ? 'rgba(59, 130, 246, 0.15)' : 'rgba(37, 99, 235, 0.15)';
      ctx.fillRect(rect.left, rect.top, rect.width, rect.height);
      
      ctx.strokeStyle = theme === 'dark' ? 'rgba(59, 130, 246, 0.8)' : 'rgba(37, 99, 235, 0.8)';
      ctx.lineWidth = 2;
      ctx.strokeRect(rect.left, rect.top, rect.width, rect.height);
      
      // Draw label
      const label = component.name || 'Component';
      ctx.font = '12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = theme === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)';
      const labelPadding = 4;
      const labelHeight = 20;
      const textMetrics = ctx.measureText(label);
      const labelWidth = textMetrics.width + labelPadding * 2;
      
      const labelY = rect.top > labelHeight ? rect.top - labelHeight : rect.bottom;
      ctx.fillRect(rect.left, labelY, labelWidth, labelHeight);
      
      ctx.fillStyle = theme === 'dark' ? '#ffffff' : '#000000';
      ctx.fillText(label, rect.left + labelPadding, labelY + 14);
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Skip if hovering over React LLM UI
      if (target.closest('[data-react-llm-inspector]') || 
          target.closest('[data-react-llm]') ||
          target.closest('#react-llm-root')) {
        if (hoveredComponent) {
          ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
          hoveredComponent = null;
        }
        return;
      }
      
      const component = inspectorRef.current?.getComponentAtPoint(e.clientX, e.clientY);
      if (component && component !== hoveredComponent) {
        hoveredComponent = component;
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
        animationFrameId = requestAnimationFrame(() => {
          drawHighlight(component);
        });
      } else if (!component && hoveredComponent) {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        hoveredComponent = null;
      }
    };
    
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Skip if clicking React LLM UI
      if (target.closest('[data-react-llm-inspector]') || 
          target.closest('[data-react-llm]') ||
          target.closest('#react-llm-root')) {
        return;
      }
      
      const component = inspectorRef.current?.getComponentAtPoint(e.clientX, e.clientY);
      if (component) {
        // Prevent default to stop the click from going through
        e.preventDefault();
        e.stopPropagation();
        
        // Select the component and immediately clean up
        onSelect(component);
        console.log('[ComponentInspector] Component selected:', component.name);
        
        // Clean up immediately after selection
        if (cleanupRef.current) {
          cleanupRef.current();
        }
      }
    };
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        console.log('[ComponentInspector] Escape pressed, canceling selection');
        // Trigger deactivation by calling onSelect with null
        onSelect(null as any);
      }
    };
    
    const handleResize = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth * window.devicePixelRatio;
      canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      
      // Redraw if there's a hovered component
      if (hoveredComponent) {
        drawHighlight(hoveredComponent);
      }
    };
    
    // Add event listeners (use capture phase only for click to intercept before page)
    document.addEventListener('mousemove', handleMouseMove, false);
    document.addEventListener('click', handleClick, true); // Only click uses capture
    document.addEventListener('keydown', handleKeyDown, false);
    window.addEventListener('resize', handleResize, false);
    
    // Store cleanup function
    cleanupRef.current = () => {
      console.log('[ComponentInspector] Cleaning up event listeners');
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleResize);
      
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      
      if (containerRef.current) {
        containerRef.current.remove();
        containerRef.current = null;
      }
      
      canvasRef.current = null;
    };
    
    // Return cleanup function
    return cleanupRef.current;
  }, [isActive, onSelect, theme]);
  
  // This component doesn't render anything in the React tree
  return null;
}