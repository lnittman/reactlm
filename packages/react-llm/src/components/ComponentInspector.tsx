/** @jsx h */
import { h } from 'preact';
import { useSignal, effect } from '@preact/signals';
import { ComponentInspector as BippyInspector, type ComponentInfo } from '../instrumentation/bippy-adapter';

interface Props {
  isActive: boolean;
  onSelect: (component: ComponentInfo) => void;
}

export function ComponentInspector({ isActive, onSelect }: Props) {
  const canvas = useSignal<HTMLCanvasElement | null>(null);
  const hoveredComponent = useSignal<ComponentInfo | null>(null);
  const animationFrame = useSignal<number | null>(null);
  const inspector = useSignal<BippyInspector | null>(null);
  
  effect(() => {
    // Initialize bippy inspector
    if (!inspector.value) {
      inspector.value = new BippyInspector();
      inspector.value.onSelection(onSelect);
    }
    
    if (!isActive) {
      if (canvas.value) {
        canvas.value.style.display = 'none';
      }
      if (animationFrame.value) {
        cancelAnimationFrame(animationFrame.value);
      }
      return;
    }
    
    // Create canvas if it doesn't exist
    if (!canvas.value) {
      const canvasEl = document.createElement('canvas');
      canvasEl.style.cssText = `
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 2147483647;
        display: none;
      `;
      document.body.appendChild(canvasEl);
      canvas.value = canvasEl;
      
      // Set canvas size
      const updateCanvasSize = () => {
        canvasEl.width = window.innerWidth;
        canvasEl.height = window.innerHeight;
      };
      updateCanvasSize();
      window.addEventListener('resize', updateCanvasSize);
    }
    
    const ctx = canvas.value.getContext('2d')!;
    
    const drawOutline = (component: ComponentInfo) => {
      if (!component.domElement) return;
      
      const rect = component.domElement.getBoundingClientRect();
      
      // Clear canvas
      ctx.clearRect(0, 0, canvas.value!.width, canvas.value!.height);
      
      // Draw outline
      ctx.strokeStyle = 'rgba(100, 200, 255, 0.8)';
      ctx.lineWidth = 2;
      ctx.fillStyle = 'rgba(100, 200, 255, 0.1)';
      
      ctx.beginPath();
      ctx.rect(rect.left, rect.top, rect.width, rect.height);
      ctx.fill();
      ctx.stroke();
      
      // Draw component name label
      if (component.name && component.name !== 'Unknown') {
        const labelHeight = 20;
        const labelPadding = 8;
        const labelWidth = component.name.length * 7 + labelPadding * 2;
        const labelY = rect.top > labelHeight ? rect.top - labelHeight : rect.bottom;
        
        // Background
        ctx.fillStyle = 'rgba(100, 200, 255, 0.9)';
        ctx.fillRect(rect.left, labelY, labelWidth, labelHeight);
        
        // Text
        ctx.font = '12px IosevkaTerm, monospace';
        ctx.fillStyle = 'white';
        ctx.fillText(component.name, rect.left + labelPadding, labelY + 14);
        
        // Show component type if it's not a regular component
        if (!component.isComponent && component.fiberType) {
          ctx.font = '10px IosevkaTerm, monospace';
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.fillText(`(${component.fiberType})`, rect.left + labelWidth + 4, labelY + 14);
        }
      }
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Skip if it's part of our UI
      if (target.closest('.toolbar')) {
        ctx.clearRect(0, 0, canvas.value!.width, canvas.value!.height);
        canvas.value!.style.display = 'none';
        hoveredComponent.value = null;
        return;
      }
      
      // Get component at this point using bippy
      const component = inspector.value!.getComponentAtPoint(e.clientX, e.clientY);
      if (component) {
        hoveredComponent.value = component;
        canvas.value!.style.display = 'block';
        
        // Use requestAnimationFrame for smooth rendering
        if (animationFrame.value) {
          cancelAnimationFrame(animationFrame.value);
        }
        animationFrame.value = requestAnimationFrame(() => {
          drawOutline(component);
        });
      } else {
        ctx.clearRect(0, 0, canvas.value!.width, canvas.value!.height);
        canvas.value!.style.display = 'none';
        hoveredComponent.value = null;
      }
    };
    
    const handleClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      const target = e.target as HTMLElement;
      if (target.closest('.toolbar')) return;
      
      // Use bippy to get component info
      const component = inspector.value!.getComponentAtPoint(e.clientX, e.clientY);
      if (component) {
        onSelect(component);
        canvas.value!.style.display = 'none';
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick, true);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick, true);
      if (canvas.value) {
        canvas.value.style.display = 'none';
      }
      if (animationFrame.value) {
        cancelAnimationFrame(animationFrame.value);
      }
    };
  });
  
  return null;
}