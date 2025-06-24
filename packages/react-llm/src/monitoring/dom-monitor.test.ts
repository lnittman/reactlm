import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DOMMonitor } from './dom-monitor';

describe('DOMMonitor', () => {
  let monitor: DOMMonitor;
  let mutationObserverMock: any;
  let originalMutationObserver: any;
  let observeCallback: any;
  
  beforeEach(() => {
    monitor = new DOMMonitor();
    
    // Mock MutationObserver
    originalMutationObserver = globalThis.MutationObserver;
    mutationObserverMock = vi.fn((callback) => {
      observeCallback = callback;
      return {
        observe: vi.fn(),
        disconnect: vi.fn(),
        takeRecords: vi.fn(() => []),
      };
    });
    globalThis.MutationObserver = mutationObserverMock;
  });
  
  afterEach(() => {
    monitor.stop();
    globalThis.MutationObserver = originalMutationObserver;
  });
  
  it('should initialize with empty changes', () => {
    expect(monitor.getChanges()).toEqual([]);
  });
  
  it('should start monitoring DOM changes', () => {
    monitor.start();
    
    expect(mutationObserverMock).toHaveBeenCalled();
    const observer = mutationObserverMock.mock.results[0].value;
    expect(observer.observe).toHaveBeenCalledWith(
      document.body,
      expect.objectContaining({
        childList: true,
        attributes: true,
        characterData: true,
        subtree: true,
        attributeOldValue: true,
        characterDataOldValue: true,
      })
    );
  });
  
  it('should capture childList mutations', () => {
    monitor.start();
    
    const mockElement = {
      tagName: 'DIV',
      id: 'test-div',
      className: 'test-class',
    };
    
    const mutations = [{
      type: 'childList',
      target: mockElement,
      addedNodes: [{ nodeName: 'SPAN', textContent: 'New span' }],
      removedNodes: [],
    }];
    
    observeCallback(mutations);
    
    const changes = monitor.getChanges();
    expect(changes).toHaveLength(1);
    expect(changes[0]).toMatchObject({
      type: 'childList',
      target: expect.objectContaining({
        tagName: 'DIV',
        id: 'test-div',
        className: 'test-class',
      }),
      addedNodes: 1,
      removedNodes: 0,
    });
  });
  
  it('should capture attribute mutations', () => {
    monitor.start();
    
    const mockElement = {
      tagName: 'BUTTON',
      getAttribute: vi.fn((name) => name === 'disabled' ? 'true' : null),
    };
    
    const mutations = [{
      type: 'attributes',
      target: mockElement,
      attributeName: 'disabled',
      oldValue: null,
    }];
    
    observeCallback(mutations);
    
    const changes = monitor.getChanges();
    expect(changes).toHaveLength(1);
    expect(changes[0]).toMatchObject({
      type: 'attributes',
      attributeName: 'disabled',
      oldValue: null,
      newValue: 'true',
    });
  });
  
  it('should capture characterData mutations', () => {
    monitor.start();
    
    const mockTextNode = {
      nodeType: 3, // TEXT_NODE
      textContent: 'New text content',
      parentElement: {
        tagName: 'P',
      },
    };
    
    const mutations = [{
      type: 'characterData',
      target: mockTextNode,
      oldValue: 'Old text content',
    }];
    
    observeCallback(mutations);
    
    const changes = monitor.getChanges();
    expect(changes).toHaveLength(1);
    expect(changes[0]).toMatchObject({
      type: 'characterData',
      oldValue: 'Old text content',
      newValue: 'New text content',
    });
  });
  
  it('should build correct DOM path', () => {
    monitor.start();
    
    const mockElement = {
      tagName: 'BUTTON',
      id: 'submit-btn',
      className: 'btn primary',
      parentElement: {
        tagName: 'FORM',
        id: 'login-form',
        parentElement: {
          tagName: 'BODY',
          parentElement: null,
        },
      },
    };
    
    const mutations = [{
      type: 'attributes',
      target: mockElement,
      attributeName: 'disabled',
    }];
    
    observeCallback(mutations);
    
    const changes = monitor.getChanges();
    expect(changes[0].target.path).toBe('BODY > FORM#login-form > BUTTON#submit-btn.btn.primary');
  });
  
  it('should respect maxChanges limit', () => {
    const maxChanges = 3;
    monitor = new DOMMonitor(maxChanges);
    monitor.start();
    
    // Trigger observer callback setup
    observeCallback = mutationObserverMock.mock.calls[0][0];
    
    // Add more changes than the limit
    for (let i = 0; i < 5; i++) {
      observeCallback([{
        type: 'childList',
        target: { tagName: 'DIV', id: `div-${i}` },
        addedNodes: [],
        removedNodes: [],
      }]);
    }
    
    const changes = monitor.getChanges();
    expect(changes).toHaveLength(maxChanges);
    // Should keep the most recent changes
    expect(changes[0].target.id).toBe('div-2');
    expect(changes[2].target.id).toBe('div-4');
  });
  
  it('should filter changes by type', () => {
    monitor.start();
    
    // Add different types of mutations
    observeCallback([
      {
        type: 'childList',
        target: { tagName: 'DIV' },
        addedNodes: [{}],
        removedNodes: [],
      },
      {
        type: 'attributes',
        target: { tagName: 'SPAN' },
        attributeName: 'class',
      },
      {
        type: 'characterData',
        target: { nodeType: 3, textContent: 'text' },
      },
    ]);
    
    const attributeChanges = monitor.getChanges({ type: 'attributes' });
    expect(attributeChanges).toHaveLength(1);
    expect(attributeChanges[0].type).toBe('attributes');
  });
  
  it('should clear all changes', () => {
    monitor.start();
    
    observeCallback([{
      type: 'childList',
      target: { tagName: 'DIV' },
      addedNodes: [],
      removedNodes: [],
    }]);
    
    expect(monitor.getChanges()).toHaveLength(1);
    
    monitor.clear();
    expect(monitor.getChanges()).toHaveLength(0);
  });
  
  it('should stop monitoring when stopped', () => {
    monitor.start();
    const observer = mutationObserverMock.mock.results[0].value;
    
    monitor.stop();
    
    expect(observer.disconnect).toHaveBeenCalled();
  });
  
  it('should handle mutations with multiple changes', () => {
    monitor.start();
    
    const mutations = [{
      type: 'childList',
      target: { tagName: 'UL' },
      addedNodes: [
        { nodeName: 'LI', textContent: 'Item 1' },
        { nodeName: 'LI', textContent: 'Item 2' },
        { nodeName: 'LI', textContent: 'Item 3' },
      ],
      removedNodes: [
        { nodeName: 'LI', textContent: 'Old item' },
      ],
    }];
    
    observeCallback(mutations);
    
    const changes = monitor.getChanges();
    expect(changes[0].addedNodes).toBe(3);
    expect(changes[0].removedNodes).toBe(1);
  });
});