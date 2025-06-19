/** @jsx h */
import { h, Fragment } from 'preact';
import { useSignal, effect } from '@preact/signals';
import { ComponentInspector, ComponentInfo } from '../instrumentation/bippy-adapter';
import { ComponentOverlay } from './ComponentOverlay';

interface Props {
  inspector: ComponentInspector;
  onSelect: (component: ComponentInfo) => void;
  className?: string;
}

export function ComponentSelector({ inspector, onSelect, className = '' }: Props) {
  const isSelecting = useSignal(false);
  const hoveredComponent = useSignal<ComponentInfo | null>(null);
  const selectedComponent = useSignal<ComponentInfo | null>(null);
  const isInstrumented = useSignal(inspector.isInstrumentationReady());
  
  // Check if instrumentation is working
  effect(() => {
    const checkInstrumentation = () => {
      isInstrumented.value = inspector.isInstrumentationReady();
    };
    
    checkInstrumentation();
    const interval = setInterval(checkInstrumentation, 1000);
    return () => clearInterval(interval);
  });
  
  // Setup mouse tracking when selecting
  effect(() => {
    if (!isSelecting.value) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      const component = inspector.getComponentAtPoint(e.clientX, e.clientY);
      
      // Unhighlight previous component
      if (hoveredComponent.value && hoveredComponent.value !== component) {
        inspector.unhighlightComponent(hoveredComponent.value);
      }
      
      // Highlight new component
      if (component && component !== hoveredComponent.value) {
        inspector.highlightComponent(component);
      }
      
      hoveredComponent.value = component;
    };
    
    const handleClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      
      const component = inspector.getComponentAtPoint(e.clientX, e.clientY);
      if (component) {
        // Unhighlight the component
        inspector.unhighlightComponent(component);
        
        // Select the component
        selectedComponent.value = component;
        onSelect(component);
        isSelecting.value = false;
        hoveredComponent.value = null;
      }
    };
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        // Cleanup highlights
        if (hoveredComponent.value) {
          inspector.unhighlightComponent(hoveredComponent.value);
        }
        
        isSelecting.value = false;
        hoveredComponent.value = null;
      }
    };
    
    // Add event listeners
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick, true);
    document.addEventListener('keydown', handleEscape);
    
    // Change cursor
    document.body.style.cursor = 'crosshair';
    
    return () => {
      // Cleanup
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick, true);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.cursor = '';
      
      // Cleanup any remaining highlights
      if (hoveredComponent.value) {
        inspector.unhighlightComponent(hoveredComponent.value);
      }
    };
  });
  
  const toggleSelection = () => {
    if (!isInstrumented.value) {
      console.warn('[ReactLLM] Component instrumentation not available');
      return;
    }
    
    isSelecting.value = !isSelecting.value;
    
    if (!isSelecting.value && hoveredComponent.value) {
      inspector.unhighlightComponent(hoveredComponent.value);
      hoveredComponent.value = null;
    }
  };
  
  const formatProps = (props: any) => {
    if (!props || Object.keys(props).length === 0) {
      return 'No props';
    }
    
    const filteredProps = Object.entries(props)
      .filter(([key]) => !key.startsWith('__') && key !== 'children')
      .reduce((acc, [key, value]) => {
        acc[key] = typeof value === 'function' ? '[Function]' : value;
        return acc;
      }, {} as Record<string, any>);
    
    return JSON.stringify(filteredProps, null, 2);
  };
  
  return (
    <div className={`component-selector ${className}`}>
      {!isInstrumented.value ? (
        <div className="instrumentation-warning">
          <div className="warning-icon">⚠️</div>
          <div className="warning-text">
            Component inspection not available. Make sure React DevTools are enabled.
          </div>
        </div>
      ) : (
        <Fragment>
          <button
            onClick={toggleSelection}
            className={`selector-toggle ${isSelecting.value ? 'active' : ''}`}
            title={isSelecting.value ? 'Click to cancel selection (or press Esc)' : 'Click to select a component'}
          >
            {isSelecting.value ? (
              <Fragment>
                <span className="selector-icon">🎯</span>
                <span>Click component to select...</span>
              </Fragment>
            ) : (
              <Fragment>
                <span className="selector-icon">🎯</span>
                <span>Select Component</span>
              </Fragment>
            )}
          </button>
          
          {isSelecting.value && (
            <div className="selection-help">
              <div className="help-text">
                Hover over any component to highlight it, then click to select.
                Press <kbd>Esc</kbd> to cancel.
              </div>
            </div>
          )}
          
          {hoveredComponent.value && isSelecting.value && (
            <div className="hovered-component-info">
              <div className="component-name">{hoveredComponent.value.name}</div>
              <div className="component-type">{hoveredComponent.value.fiberType}</div>
            </div>
          )}
          
          {selectedComponent.value && !isSelecting.value && (
            <div className="selected-component">
              <div className="component-header">
                <h4 className="component-title">
                  <span className="component-icon">⚛️</span>
                  {selectedComponent.value.name}
                </h4>
                <div className="component-badges">
                  <span className="badge">{selectedComponent.value.fiberType}</span>
                  {selectedComponent.value.depth > 0 && (
                    <span className="badge depth">Depth: {selectedComponent.value.depth}</span>
                  )}
                </div>
              </div>
              
              <div className="component-details">
                <details className="props-section">
                  <summary>Props ({Object.keys(selectedComponent.value.props || {}).length})</summary>
                  <pre className="props-content">{formatProps(selectedComponent.value.props)}</pre>
                </details>
                
                {selectedComponent.value.state && (
                  <details className="state-section">
                    <summary>State</summary>
                    <pre className="state-content">
                      {JSON.stringify(selectedComponent.value.state, null, 2)}
                    </pre>
                  </details>
                )}
                
                {selectedComponent.value.hooks.length > 0 && (
                  <details className="hooks-section">
                    <summary>Hooks ({selectedComponent.value.hooks.length})</summary>
                    <div className="hooks-content">
                      {selectedComponent.value.hooks.map((hook, index) => (
                        <div key={index} className="hook-item">
                          <span className="hook-index">#{index + 1}</span>
                          <pre className="hook-state">
                            {JSON.stringify(hook.memoizedState, null, 2)}
                          </pre>
                        </div>
                      ))}
                    </div>
                  </details>
                )}
                
                {selectedComponent.value.children.length > 0 && (
                  <details className="children-section">
                    <summary>Children ({selectedComponent.value.children.length})</summary>
                    <div className="children-content">
                      {selectedComponent.value.children.map((child, index) => (
                        <div key={index} className="child-item">
                          <span className="child-name">{child.name}</span>
                          <span className="child-type">{child.fiberType}</span>
                        </div>
                      ))}
                    </div>
                  </details>
                )}
                
                {selectedComponent.value.sourceLocation && (
                  <details className="source-section">
                    <summary>Source Location</summary>
                    <div className="source-content">
                      <div>File: {selectedComponent.value.sourceLocation.fileName}</div>
                      {selectedComponent.value.sourceLocation.lineNumber && (
                        <div>Line: {selectedComponent.value.sourceLocation.lineNumber}</div>
                      )}
                    </div>
                  </details>
                )}
              </div>
              
              <div className="component-actions">
                <button 
                  className="clear-selection"
                  onClick={() => selectedComponent.value = null}
                >
                  Clear Selection
                </button>
              </div>
            </div>
          )}
          
          {/* Enhanced visual overlay */}
          <ComponentOverlay 
            component={hoveredComponent.value} 
            isSelecting={isSelecting.value}
          />
        </Fragment>
      )}
    </div>
  );
}