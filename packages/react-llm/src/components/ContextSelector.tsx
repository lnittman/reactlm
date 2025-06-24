/** @jsx h */
import { h } from 'preact';
import { useState, useRef, useEffect } from 'preact/hooks';
import { signal } from '@preact/signals';

interface ContextOption {
  id: string;
  type: 'console' | 'network' | 'performance' | 'dom' | 'components';
  label: string;
  icon: string;
  description: string;
  filter?: Record<string, any>;
}

const contextOptions: ContextOption[] = [
  {
    id: 'console-all',
    type: 'console',
    label: '@console',
    icon: '📋',
    description: 'All console logs',
  },
  {
    id: 'console-errors',
    type: 'console',
    label: '@errors',
    icon: '🚨',
    description: 'Console errors only',
    filter: { level: 'error' },
  },
  {
    id: 'network-all',
    type: 'network',
    label: '@network',
    icon: '🌐',
    description: 'All network requests',
  },
  {
    id: 'network-failed',
    type: 'network',
    label: '@failed-requests',
    icon: '❌',
    description: 'Failed network requests',
    filter: { status: 'failed' },
  },
  {
    id: 'performance',
    type: 'performance',
    label: '@performance',
    icon: '⚡',
    description: 'Performance metrics',
  },
  {
    id: 'dom-changes',
    type: 'dom',
    label: '@dom-changes',
    icon: '🔄',
    description: 'Recent DOM mutations',
  },
  {
    id: 'components',
    type: 'components',
    label: '@components',
    icon: '🧩',
    description: 'Selected React components',
  },
];

interface Props {
  onSelect: (context: ContextOption | null) => void;
  position: { x: number; y: number };
  searchTerm: string;
}

export const ContextSelector = ({ onSelect, position, searchTerm }: Props) => {
  const [filteredOptions, setFilteredOptions] = useState(contextOptions);
  const selectedIndex = signal(0);
  
  useEffect(() => {
    const filtered = contextOptions.filter(option =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      option.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredOptions(filtered);
    selectedIndex.value = 0;
  }, [searchTerm]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          selectedIndex.value = Math.min(
            selectedIndex.value + 1,
            filteredOptions.length - 1
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          selectedIndex.value = Math.max(selectedIndex.value - 1, 0);
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredOptions[selectedIndex.value]) {
            onSelect(filteredOptions[selectedIndex.value]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onSelect(null);
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [filteredOptions, onSelect]);
  
  return (
    <div
      className="context-selector"
      style={{
        position: 'absolute',
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translateY(-100%)',
      }}
    >
      <div className="context-options">
        {filteredOptions.map((option, index) => (
          <div
            key={option.id}
            className={`context-option ${index === selectedIndex.value ? 'selected' : ''}`}
            onClick={() => onSelect(option)}
            onMouseEnter={() => selectedIndex.value = index}
          >
            <span className="context-icon">{option.icon}</span>
            <div className="context-info">
              <div className="context-label">{option.label}</div>
              <div className="context-description">{option.description}</div>
            </div>
          </div>
        ))}
      </div>
      
      <style>{`
        #react-llm-context-portal .context-selector {
          background: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          box-shadow: 
            0 20px 40px rgba(0, 0, 0, 0.4),
            0 8px 16px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
          max-width: 320px;
          overflow: hidden;
          z-index: 10000;
          animation: dropdownEntrance 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          transform-origin: bottom left;
        }
        
        #react-llm-context-portal .context-options {
          max-height: 240px;
          overflow-y: auto;
          padding: 4px;
        }
        
        #react-llm-context-portal .context-options::-webkit-scrollbar {
          width: 6px;
        }
        
        #react-llm-context-portal .context-options::-webkit-scrollbar-track {
          background: transparent;
        }
        
        #react-llm-context-portal .context-options::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        
        #react-llm-context-portal .context-option {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          border-radius: 8px;
          position: relative;
          overflow: hidden;
          margin: 2px 0;
        }
        
        #react-llm-context-portal .context-option::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(69, 137, 255, 0.1),
            transparent
          );
          transform: translateX(-100%);
          transition: transform 0.6s;
        }
        
        #react-llm-context-portal .context-option:hover::before,
        #react-llm-context-portal .context-option.selected::before {
          transform: translateX(100%);
        }
        
        #react-llm-context-portal .context-option:hover,
        #react-llm-context-portal .context-option.selected {
          background: rgba(255, 255, 255, 0.08);
          transform: translateX(4px);
        }
        
        #react-llm-context-portal .context-option.selected {
          box-shadow: 
            0 0 0 1px rgba(69, 137, 255, 0.3),
            0 2px 8px rgba(69, 137, 255, 0.1);
        }
        
        #react-llm-context-portal .context-icon {
          font-size: 20px;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 6px;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        #react-llm-context-portal .context-option:hover .context-icon {
          transform: scale(1.1) rotate(5deg);
          background: rgba(255, 255, 255, 0.1);
        }
        
        #react-llm-context-portal .context-info {
          flex: 1;
          min-width: 0;
        }
        
        #react-llm-context-portal .context-label {
          font-weight: 500;
          color: rgba(255, 255, 255, 0.95);
          font-family: 'TX02Mono-Regular', monospace;
          font-size: 14px;
          transition: color 0.2s;
        }
        
        #react-llm-context-portal .context-option:hover .context-label {
          color: rgba(100, 200, 255, 0.9);
        }
        
        #react-llm-context-portal .context-description {
          font-size: 12px;
          color: rgba(255, 255, 255, 0.6);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-top: 2px;
        }
        
        @keyframes dropdownEntrance {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
};