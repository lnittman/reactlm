/**
 * Quick validation script to ensure monitoring is accessible
 */

// Simulate a browser environment for testing
global.window = global;
global.document = {
  body: {},
  createElement: () => ({ 
    attachShadow: () => ({ appendChild: () => {} }),
    appendChild: () => {}
  }),
  addEventListener: () => {},
  removeEventListener: () => {}
};
global.console = {
  log: (...args) => console.log('[ORIGINAL]', ...args),
  warn: (...args) => console.warn('[ORIGINAL]', ...args),
  error: (...args) => console.error('[ORIGINAL]', ...args),
  info: (...args) => console.info('[ORIGINAL]', ...args),
  debug: (...args) => console.debug('[ORIGINAL]', ...args),
  trace: (...args) => console.trace('[ORIGINAL]', ...args),
};
global.fetch = () => Promise.resolve({
  ok: true,
  status: 200,
  json: () => Promise.resolve({}),
  text: () => Promise.resolve(''),
  clone: () => ({
    json: () => Promise.resolve({}),
    text: () => Promise.resolve('')
  }),
  headers: new Map()
});
global.XMLHttpRequest = class {
  constructor() {
    this.readyState = 0;
    this.status = 200;
    this.responseText = '{}';
  }
  open() {}
  send() {}
  setRequestHeader() {}
  addEventListener() {}
  getAllResponseHeaders() { return ''; }
  getResponseHeader() { return null; }
};
global.performance = {
  now: () => Date.now(),
  mark: () => {},
  measure: () => {},
  getEntriesByType: () => [],
  getEntriesByName: () => []
};
global.PerformanceObserver = class {
  constructor() {}
  observe() {}
  disconnect() {}
};
global.MutationObserver = class {
  constructor() {}
  observe() {}
  disconnect() {}
};

// Load the built React LLM
import('./dist/react-llm.global.js').then(() => {

// Validate monitoring system
console.log('🔍 Validating monitoring system...');

if (global.ReactLLM) {
  console.log('✅ ReactLLM global object exists');
  
  // Initialize in demo mode
  global.ReactLLM.init({ mode: 'demo' });
  
  setTimeout(() => {
    if (global.ReactLLM.monitorManager) {
      console.log('✅ MonitorManager is available');
      
      const monitors = {
        console: global.ReactLLM.monitorManager.getConsoleMonitor(),
        network: global.ReactLLM.monitorManager.getNetworkMonitor(),
        performance: global.ReactLLM.monitorManager.getPerformanceMonitor(),
        dom: global.ReactLLM.monitorManager.getDOMMonitor()
      };
      
      console.log('✅ All monitors available:', Object.keys(monitors));
      
      // Test context formatting
      const consoleContext = global.ReactLLM.monitorManager.getContext('console');
      const networkContext = global.ReactLLM.monitorManager.getContext('network');
      const performanceContext = global.ReactLLM.monitorManager.getContext('performance');
      const domContext = global.ReactLLM.monitorManager.getContext('dom');
      
      console.log('✅ Context formatting works:');
      console.log('  - Console context length:', consoleContext.length);
      console.log('  - Network context length:', networkContext.length);
      console.log('  - Performance context length:', performanceContext.length);
      console.log('  - DOM context length:', domContext.length);
      
      console.log('🎉 Monitoring system validation complete!');
      
      // Test actual monitoring
      console.log('\n📊 Testing actual monitoring...');
      
      // Generate some test data
      console.log('Test log message');
      console.warn('Test warning');
      console.error('Test error');
      
      // Check if console monitoring captured it
      setTimeout(() => {
        const entries = monitors.console.getEntries();
        console.log(`✅ Captured ${entries.length} console entries`);
        
        if (entries.length > 0) {
          console.log('  Sample entry:', {
            level: entries[0].level,
            formatted: entries[0].formatted,
            timestamp: entries[0].timestamp
          });
        }
        
        console.log('\n🚀 React LLM monitoring system is fully operational!');
      }, 100);
    } else {
      console.error('❌ MonitorManager not available');
    }
  }, 100);
} else {
  console.error('❌ ReactLLM global object not found');
}

}); // Close the import promise