import { signal } from '@preact/signals';

export interface DOMChange {
  id: string;
  timestamp: number;
  type: 'added' | 'removed' | 'attributes' | 'characterData';
  target: {
    tagName?: string;
    id?: string;
    className?: string;
    path: string;
  };
  details?: Record<string, any>;
}

export class DOMMonitor {
  private changes = signal<DOMChange[]>([]);
  private observer: MutationObserver | null = null;
  private maxChanges = 1000;
  private isMonitoring = false;
  
  public start(root: Element = document.body): void {
    if (this.isMonitoring) return;
    
    this.observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        this.processMutation(mutation);
      });
    });
    
    this.observer.observe(root, {
      childList: true,
      attributes: true,
      characterData: true,
      subtree: true,
      attributeOldValue: true,
      characterDataOldValue: true,
    });
    
    this.isMonitoring = true;
  }
  
  private processMutation(mutation: MutationRecord): void {
    switch (mutation.type) {
      case 'childList':
        this.processChildListMutation(mutation);
        break;
      case 'attributes':
        this.processAttributeMutation(mutation);
        break;
      case 'characterData':
        this.processCharacterDataMutation(mutation);
        break;
    }
  }
  
  private processChildListMutation(mutation: MutationRecord): void {
    // Added nodes
    mutation.addedNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        this.addChange({
          type: 'added',
          target: this.extractElementInfo(element),
          details: {
            parentPath: this.getElementPath(mutation.target as Element),
            html: element.outerHTML.substring(0, 200),
          },
        });
      }
    });
    
    // Removed nodes
    mutation.removedNodes.forEach(node => {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        this.addChange({
          type: 'removed',
          target: this.extractElementInfo(element),
          details: {
            parentPath: this.getElementPath(mutation.target as Element),
          },
        });
      }
    });
  }
  
  private processAttributeMutation(mutation: MutationRecord): void {
    const element = mutation.target as Element;
    
    this.addChange({
      type: 'attributes',
      target: this.extractElementInfo(element),
      details: {
        attribute: mutation.attributeName,
        oldValue: mutation.oldValue,
        newValue: element.getAttribute(mutation.attributeName!),
      },
    });
  }
  
  private processCharacterDataMutation(mutation: MutationRecord): void {
    const node = mutation.target;
    const parent = node.parentElement;
    
    if (parent) {
      this.addChange({
        type: 'characterData',
        target: this.extractElementInfo(parent),
        details: {
          oldValue: mutation.oldValue,
          newValue: node.textContent,
        },
      });
    }
  }
  
  private extractElementInfo(element: Element): DOMChange['target'] {
    return {
      tagName: element.tagName.toLowerCase(),
      id: element.id,
      className: element.className,
      path: this.getElementPath(element),
    };
  }
  
  private getElementPath(element: Element): string {
    const path: string[] = [];
    let current: Element | null = element;
    
    while (current && current !== document.body) {
      let selector = current.tagName.toLowerCase();
      
      if (current.id) {
        selector += `#${current.id}`;
      } else if (current.className) {
        selector += `.${current.className.split(' ')[0]}`;
      } else {
        // Add index among siblings
        const parent = current.parentElement;
        if (parent) {
          const index = Array.from(parent.children).indexOf(current);
          selector += `:nth-child(${index + 1})`;
        }
      }
      
      path.unshift(selector);
      current = current.parentElement;
    }
    
    return path.join(' > ');
  }
  
  private addChange(change: Omit<DOMChange, 'id' | 'timestamp'>): void {
    const fullChange: DOMChange = {
      ...change,
      id: `dom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };
    
    const current = this.changes.value;
    const updated = [...current, fullChange];
    
    if (updated.length > this.maxChanges) {
      updated.splice(0, updated.length - this.maxChanges);
    }
    
    this.changes.value = updated;
  }
  
  public getChanges(filter?: {
    type?: DOMChange['type'];
    selector?: string;
    since?: number;
  }): DOMChange[] {
    let results = this.changes.value;
    
    if (filter?.type) {
      results = results.filter(c => c.type === filter.type);
    }
    
    if (filter?.selector) {
      results = results.filter(c => 
        c.target.path.includes(filter.selector) ||
        c.target.id === filter.selector ||
        c.target.className?.includes(filter.selector)
      );
    }
    
    if (filter?.since) {
      results = results.filter(c => c.timestamp > filter.since);
    }
    
    return results;
  }
  
  public stop(): void {
    this.observer?.disconnect();
    this.observer = null;
    this.isMonitoring = false;
  }
}