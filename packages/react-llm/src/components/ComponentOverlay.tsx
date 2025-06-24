/** @jsx h */
import { h, Fragment } from 'preact';
import { useSignal, useEffect } from '@preact/signals';
import { ComponentInfo } from '../instrumentation/bippy-adapter';

interface Props {
  component: ComponentInfo | null;
  isSelecting?: boolean;
}

/**
 * Visual overlay component for highlighting React components during selection
 * Uses canvas-based rendering for smooth performance
 */
export function ComponentOverlay({ component, isSelecting = false }: Props) {
  const overlayRef = useSignal<HTMLDivElement | null>(null);
  const canvasRef = useSignal<HTMLCanvasElement | null>(null);
  
  useEffect(() => {
    if (!component || !component.domElement || !isSelecting) {
      // Clear overlay when no component is selected
      if (overlayRef.value) {
        overlayRef.value.style.display = 'none';
      }
      return;
    }
    
    const element = component.domElement;
    const rect = element.getBoundingClientRect();
    
    if (overlayRef.value && canvasRef.value) {
      const overlay = overlayRef.value;
      const canvas = canvasRef.value;
      const ctx = canvas.getContext('2d');
      
      if (!ctx) return;
      
      // Position overlay - CRITICAL: must not block interactions
      overlay.style.display = 'block';
      overlay.style.position = 'fixed';
      overlay.style.top = '0';
      overlay.style.left = '0';
      overlay.style.width = '100%';
      overlay.style.height = '100%';
      overlay.style.pointerEvents = 'none';
      overlay.style.zIndex = '2147483645'; // Below inspector but above page
      
      // Size canvas
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw component highlight
      drawComponentHighlight(ctx, rect, component);
      
      // Draw component info tooltip
      drawComponentTooltip(ctx, rect, component);
    }
  });
  
  const drawComponentHighlight = (
    ctx: CanvasRenderingContext2D, 
    rect: DOMRect, 
    component: ComponentInfo
  ) => {
    // Main highlight border
    ctx.strokeStyle = '#007acc';
    ctx.lineWidth = 2;
    ctx.setLineDash([]);
    ctx.strokeRect(rect.left, rect.top, rect.width, rect.height);
    
    // Subtle fill
    ctx.fillStyle = 'rgba(0, 122, 204, 0.1)';
    ctx.fillRect(rect.left, rect.top, rect.width, rect.height);
    
    // Corner markers for better visibility
    const cornerSize = 8;
    ctx.fillStyle = '#007acc';
    
    // Top-left corner
    ctx.fillRect(rect.left - 1, rect.top - 1, cornerSize, 2);
    ctx.fillRect(rect.left - 1, rect.top - 1, 2, cornerSize);
    
    // Top-right corner
    ctx.fillRect(rect.right - cornerSize + 1, rect.top - 1, cornerSize, 2);
    ctx.fillRect(rect.right - 1, rect.top - 1, 2, cornerSize);
    
    // Bottom-left corner
    ctx.fillRect(rect.left - 1, rect.bottom - 1, cornerSize, 2);
    ctx.fillRect(rect.left - 1, rect.bottom - cornerSize + 1, 2, cornerSize);
    
    // Bottom-right corner
    ctx.fillRect(rect.right - cornerSize + 1, rect.bottom - 1, cornerSize, 2);
    ctx.fillRect(rect.right - 1, rect.bottom - cornerSize + 1, 2, cornerSize);
  };
  
  const drawComponentTooltip = (
    ctx: CanvasRenderingContext2D, 
    rect: DOMRect, 
    component: ComponentInfo
  ) => {
    const tooltip = formatTooltipText(component);
    const padding = 8;
    const lineHeight = 16;
    const fontSize = 12;
    
    ctx.font = `${fontSize}px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`;
    
    // Calculate tooltip dimensions
    const lines = tooltip.split('\n');
    const maxWidth = Math.max(...lines.map(line => ctx.measureText(line).width));
    const tooltipWidth = maxWidth + padding * 2;
    const tooltipHeight = lines.length * lineHeight + padding * 2;
    
    // Position tooltip (above component if possible, otherwise below)
    let tooltipX = rect.left;
    let tooltipY = rect.top - tooltipHeight - 8;
    
    // Adjust if tooltip goes off-screen
    if (tooltipY < 0) {
      tooltipY = rect.bottom + 8;
    }
    if (tooltipX + tooltipWidth > window.innerWidth) {
      tooltipX = window.innerWidth - tooltipWidth - 8;
    }
    if (tooltipX < 0) {
      tooltipX = 8;
    }
    
    // Draw tooltip background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    ctx.fillRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);
    
    // Draw tooltip border
    ctx.strokeStyle = '#007acc';
    ctx.lineWidth = 1;
    ctx.strokeRect(tooltipX, tooltipY, tooltipWidth, tooltipHeight);
    
    // Draw tooltip text
    ctx.fillStyle = '#ffffff';
    ctx.textBaseline = 'top';
    
    lines.forEach((line, index) => {
      ctx.fillText(
        line, 
        tooltipX + padding, 
        tooltipY + padding + index * lineHeight
      );
    });
  };
  
  const formatTooltipText = (component: ComponentInfo): string => {
    const lines = [
      `⚛️ ${component.name}`,
      `Type: ${component.fiberType}`,
    ];
    
    if (component.props && Object.keys(component.props).length > 0) {
      const propCount = Object.keys(component.props).filter(
        key => !key.startsWith('__') && key !== 'children'
      ).length;
      if (propCount > 0) {
        lines.push(`Props: ${propCount}`);
      }
    }
    
    if (component.hooks && component.hooks.length > 0) {
      lines.push(`Hooks: ${component.hooks.length}`);
    }
    
    if (component.children && component.children.length > 0) {
      lines.push(`Children: ${component.children.length}`);
    }
    
    lines.push('Click to select');
    
    return lines.join('\n');
  };
  
  return (
    <div 
      ref={(el) => overlayRef.value = el}
      style={{ 
        display: 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        pointerEvents: 'none'
      }}
      data-react-llm-overlay="true"
    >
      <canvas 
        ref={(el) => canvasRef.value = el}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}