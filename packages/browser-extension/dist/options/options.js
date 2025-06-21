// Options page script for React LLM browser extension

class OptionsController {
  constructor() {
    this.config = {};
    this.elements = {
      // API Keys
      openrouterKey: document.getElementById('openrouterKey'),
      openaiKey: document.getElementById('openaiKey'),
      anthropicKey: document.getElementById('anthropicKey'),
      googleKey: document.getElementById('googleKey'),
      
      // Toggles
      autoInjectToggle: document.getElementById('autoInjectToggle'),
      welcomeToggle: document.getElementById('welcomeToggle'),
      rememberPositionToggle: document.getElementById('rememberPositionToggle'),
      cacheToggle: document.getElementById('cacheToggle'),
      
      // Buttons
      saveBtn: document.getElementById('saveBtn'),
      resetBtn: document.getElementById('resetBtn'),
      clearDataBtn: document.getElementById('clearDataBtn'),
      exportDataBtn: document.getElementById('exportDataBtn'),
      
      // Status
      statusMessage: document.getElementById('statusMessage')
    };
    
    this.init();
  }
  
  async init() {
    await this.loadConfig();
    this.updateUI();
    this.setupEventListeners();
  }
  
  async loadConfig() {
    try {
      const result = await chrome.storage.sync.get(['reactLLMConfig']);
      this.config = result.reactLLMConfig || this.getDefaultConfig();
    } catch (error) {
      console.error('Failed to load config:', error);
      this.config = this.getDefaultConfig();
    }
  }
  
  getDefaultConfig() {
    return {
      providers: {},
      autoInject: true,
      showWelcome: true,
      rememberPosition: true,
      cacheResponses: true
    };
  }
  
  updateUI() {
    // Update API keys
    this.elements.openrouterKey.value = this.config.providers?.openrouter || '';
    this.elements.openaiKey.value = this.config.providers?.openai || '';
    this.elements.anthropicKey.value = this.config.providers?.anthropic || '';
    this.elements.googleKey.value = this.config.providers?.google || '';
    
    // Update toggles
    this.updateToggle(this.elements.autoInjectToggle, this.config.autoInject);
    this.updateToggle(this.elements.welcomeToggle, this.config.showWelcome);
    this.updateToggle(this.elements.rememberPositionToggle, this.config.rememberPosition);
    this.updateToggle(this.elements.cacheToggle, this.config.cacheResponses);
  }
  
  updateToggle(element, value) {
    element.classList.toggle('active', value);
  }
  
  setupEventListeners() {
    // Toggle listeners
    this.elements.autoInjectToggle.addEventListener('click', () => {
      this.config.autoInject = !this.config.autoInject;
      this.updateToggle(this.elements.autoInjectToggle, this.config.autoInject);
    });
    
    this.elements.welcomeToggle.addEventListener('click', () => {
      this.config.showWelcome = !this.config.showWelcome;
      this.updateToggle(this.elements.welcomeToggle, this.config.showWelcome);
    });
    
    this.elements.rememberPositionToggle.addEventListener('click', () => {
      this.config.rememberPosition = !this.config.rememberPosition;
      this.updateToggle(this.elements.rememberPositionToggle, this.config.rememberPosition);
    });
    
    this.elements.cacheToggle.addEventListener('click', () => {
      this.config.cacheResponses = !this.config.cacheResponses;
      this.updateToggle(this.elements.cacheToggle, this.config.cacheResponses);
    });
    
    // Button listeners
    this.elements.saveBtn.addEventListener('click', () => this.saveConfig());
    this.elements.resetBtn.addEventListener('click', () => this.resetConfig());
    this.elements.clearDataBtn.addEventListener('click', () => this.clearAllData());
    this.elements.exportDataBtn.addEventListener('click', () => this.exportConfig());
    
    // Auto-save API keys on input
    [
      this.elements.openrouterKey,
      this.elements.openaiKey,
      this.elements.anthropicKey,
      this.elements.googleKey
    ].forEach(input => {
      input.addEventListener('input', () => {
        this.updateApiKeys();
      });
    });
  }
  
  updateApiKeys() {
    if (!this.config.providers) {
      this.config.providers = {};
    }
    
    // Only store non-empty keys
    const openrouter = this.elements.openrouterKey.value.trim();
    const openai = this.elements.openaiKey.value.trim();
    const anthropic = this.elements.anthropicKey.value.trim();
    const google = this.elements.googleKey.value.trim();
    
    if (openrouter) this.config.providers.openrouter = openrouter;
    else delete this.config.providers.openrouter;
    
    if (openai) this.config.providers.openai = openai;
    else delete this.config.providers.openai;
    
    if (anthropic) this.config.providers.anthropic = anthropic;
    else delete this.config.providers.anthropic;
    
    if (google) this.config.providers.google = google;
    else delete this.config.providers.google;
  }
  
  async saveConfig() {
    try {
      this.updateApiKeys();
      await chrome.storage.sync.set({ reactLLMConfig: this.config });
      this.showStatus('Settings saved successfully!', 'success');
    } catch (error) {
      console.error('Failed to save config:', error);
      this.showStatus('Failed to save settings. Please try again.', 'error');
    }
  }
  
  async resetConfig() {
    if (confirm('Are you sure you want to reset all settings to defaults? This will clear your API keys.')) {
      this.config = this.getDefaultConfig();
      this.updateUI();
      await this.saveConfig();
      this.showStatus('Settings reset to defaults.', 'success');
    }
  }
  
  async clearAllData() {
    if (confirm('Are you sure you want to clear all React LLM data? This includes settings, cache, and saved conversations.')) {
      try {
        await chrome.storage.sync.clear();
        await chrome.storage.local.clear();
        this.config = this.getDefaultConfig();
        this.updateUI();
        this.showStatus('All data cleared successfully.', 'success');
      } catch (error) {
        console.error('Failed to clear data:', error);
        this.showStatus('Failed to clear data. Please try again.', 'error');
      }
    }
  }
  
  exportConfig() {
    const exportData = {
      ...this.config,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };
    
    // Remove sensitive data from export
    if (exportData.providers) {
      Object.keys(exportData.providers).forEach(key => {
        if (exportData.providers[key]) {
          exportData.providers[key] = '***REDACTED***';
        }
      });
    }
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'react-llm-config.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    this.showStatus('Configuration exported (API keys redacted for security).', 'success');
  }
  
  showStatus(message, type) {
    const statusEl = this.elements.statusMessage;
    statusEl.textContent = message;
    statusEl.className = `status-message status-${type}`;
    statusEl.classList.remove('hidden');
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      statusEl.classList.add('hidden');
    }, 5000);
  }
}

// Initialize options page when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new OptionsController();
});