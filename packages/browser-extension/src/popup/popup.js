// Popup script for React LLM browser extension

class PopupController {
  constructor() {
    this.statusDot = document.getElementById('statusDot');
    this.statusText = document.getElementById('statusText');
    this.toggleBtn = document.getElementById('toggleBtn');
    this.optionsBtn = document.getElementById('optionsBtn');
    this.autoInjectToggle = document.getElementById('autoInjectToggle');
    
    this.pageInfo = null;
    this.config = {};
    
    this.init();
  }
  
  async init() {
    await this.loadConfig();
    await this.checkPageStatus();
    this.setupEventListeners();
    this.updateAutoInjectToggle();
  }
  
  async loadConfig() {
    try {
      const result = await chrome.storage.sync.get(['reactLLMConfig']);
      this.config = result.reactLLMConfig || {};
    } catch (error) {
      console.error('Failed to load config:', error);
    }
  }
  
  async saveConfig() {
    try {
      await chrome.storage.sync.set({ reactLLMConfig: this.config });
    } catch (error) {
      console.error('Failed to save config:', error);
    }
  }
  
  async checkPageStatus() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab?.id) {
        this.updateStatus('no-react', 'No active tab');
        return;
      }
      
      // Check if we can access the tab (not chrome:// or extension pages)
      if (tab.url?.startsWith('chrome://') || tab.url?.startsWith('chrome-extension://')) {
        this.updateStatus('no-react', 'Cannot access this page');
        return;
      }
      
      // Send message to content script to get page info
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'getPageInfo' });
      this.pageInfo = response;
      
      if (response.hasReactLLM) {
        this.updateStatus('active', 'React LLM is active');
        this.toggleBtn.textContent = 'Hide React LLM';
      } else if (response.hasReact) {
        this.updateStatus('inactive', 'React detected');
        this.toggleBtn.textContent = 'Show React LLM';
      } else {
        this.updateStatus('no-react', 'No React detected');
        this.toggleBtn.textContent = 'Inject React LLM';
      }
      
      this.toggleBtn.disabled = false;
      
    } catch (error) {
      console.error('Failed to check page status:', error);
      this.updateStatus('no-react', 'Unable to connect');
      this.toggleBtn.textContent = 'Retry';
      this.toggleBtn.disabled = false;
    }
  }
  
  updateStatus(type, text) {
    this.statusDot.className = `status-dot ${type}`;
    this.statusText.textContent = text;
  }
  
  setupEventListeners() {
    this.toggleBtn.addEventListener('click', () => this.toggleReactLLM());
    this.optionsBtn.addEventListener('click', () => this.openOptions());
    this.autoInjectToggle.addEventListener('click', () => this.toggleAutoInject());
  }
  
  async toggleReactLLM() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab?.id) return;
      
      this.toggleBtn.disabled = true;
      this.toggleBtn.textContent = 'Loading...';
      
      await chrome.tabs.sendMessage(tab.id, { action: 'toggle' });
      
      // Refresh status after a short delay
      setTimeout(() => this.checkPageStatus(), 500);
      
    } catch (error) {
      console.error('Failed to toggle React LLM:', error);
      this.toggleBtn.disabled = false;
      this.toggleBtn.textContent = 'Error - Retry';
    }
  }
  
  openOptions() {
    chrome.runtime.openOptionsPage();
  }
  
  updateAutoInjectToggle() {
    const isEnabled = this.config.autoInject !== false; // Default to true
    this.autoInjectToggle.classList.toggle('active', isEnabled);
  }
  
  async toggleAutoInject() {
    this.config.autoInject = !this.autoInjectToggle.classList.contains('active');
    this.updateAutoInjectToggle();
    await this.saveConfig();
  }
}

// Initialize popup when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new PopupController();
});