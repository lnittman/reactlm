/**
 * OPFS (Origin Private File System) Manager
 * Provides browser-native file storage for component library and chat history
 */

export interface ComponentLibraryEntry {
  id: string;
  name: string;
  props: any;
  sourceCode: string;
  tags: string[];
  savedAt: string;
  url: string;
  framework?: 'react' | 'vue' | 'svelte';
  usage?: string;
  description?: string;
}

export interface ChatExport {
  id: string;
  title: string;
  createdAt: string;
  messages: any[];
  projectInfo?: any;
}

export class OPFSManager {
  private root: FileSystemDirectoryHandle | null = null;
  private isSupported = false;
  
  constructor() {
    this.checkSupport();
  }
  
  private checkSupport(): boolean {
    this.isSupported = 'storage' in navigator && 'getDirectory' in navigator.storage;
    return this.isSupported;
  }
  
  async initialize(): Promise<boolean> {
    if (!this.isSupported) {
      console.warn('[ReactLLM] OPFS not supported in this browser');
      return false;
    }
    
    try {
      this.root = await navigator.storage.getDirectory();
      console.log('[ReactLLM] OPFS initialized successfully');
      return true;
    } catch (error) {
      console.error('[ReactLLM] Failed to initialize OPFS:', error);
      return false;
    }
  }
  
  isOPFSSupported(): boolean {
    return this.isSupported;
  }
  
  isInitialized(): boolean {
    return this.root !== null;
  }
  
  // Component Library Management
  
  async saveComponentLibrary(
    componentId: string, 
    data: ComponentLibraryEntry
  ): Promise<void> {
    if (!this.root) throw new Error('OPFS not initialized');
    
    try {
      const dir = await this.root.getDirectoryHandle('component-library', { create: true });
      const file = await dir.getFileHandle(`${componentId}.json`, { create: true });
      const writable = await file.createWritable();
      
      await writable.write(JSON.stringify(data, null, 2));
      await writable.close();
      
      console.log(`[ReactLLM] Saved component: ${data.name}`);
    } catch (error) {
      console.error('[ReactLLM] Failed to save component:', error);
      throw error;
    }
  }
  
  async loadComponentLibrary(): Promise<ComponentLibraryEntry[]> {
    if (!this.root) throw new Error('OPFS not initialized');
    
    try {
      const dir = await this.root.getDirectoryHandle('component-library');
      const entries: ComponentLibraryEntry[] = [];
      
      for await (const entry of dir.values()) {
        if (entry.kind === 'file' && entry.name.endsWith('.json')) {
          try {
            const file = await entry.getFile();
            const text = await file.text();
            const component = JSON.parse(text) as ComponentLibraryEntry;
            entries.push(component);
          } catch (error) {
            console.warn(`[ReactLLM] Failed to load component ${entry.name}:`, error);
          }
        }
      }
      
      // Sort by savedAt date (newest first)
      return entries.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
    } catch (error) {
      if (error.name === 'NotFoundError') {
        return []; // Directory doesn't exist yet
      }
      console.error('[ReactLLM] Failed to load component library:', error);
      throw error;
    }
  }
  
  async deleteComponent(componentId: string): Promise<void> {
    if (!this.root) throw new Error('OPFS not initialized');
    
    try {
      const dir = await this.root.getDirectoryHandle('component-library');
      await dir.removeEntry(`${componentId}.json`);
      console.log(`[ReactLLM] Deleted component: ${componentId}`);
    } catch (error) {
      console.error('[ReactLLM] Failed to delete component:', error);
      throw error;
    }
  }
  
  async searchComponents(query: string, tags?: string[]): Promise<ComponentLibraryEntry[]> {
    const components = await this.loadComponentLibrary();
    const lowerQuery = query.toLowerCase();
    
    return components.filter(component => {
      const matchesQuery = !query || 
        component.name.toLowerCase().includes(lowerQuery) ||
        component.description?.toLowerCase().includes(lowerQuery) ||
        component.sourceCode.toLowerCase().includes(lowerQuery);
      
      const matchesTags = !tags || tags.length === 0 ||
        tags.some(tag => component.tags.includes(tag));
      
      return matchesQuery && matchesTags;
    });
  }
  
  // Chat Export/Import
  
  async exportChat(chat: ChatExport): Promise<void> {
    if (!this.root) throw new Error('OPFS not initialized');
    
    try {
      const dir = await this.root.getDirectoryHandle('chat-exports', { create: true });
      const fileName = `chat-${chat.id}-${Date.now()}.json`;
      const file = await dir.getFileHandle(fileName, { create: true });
      const writable = await file.createWritable();
      
      await writable.write(JSON.stringify(chat, null, 2));
      await writable.close();
      
      console.log(`[ReactLLM] Exported chat: ${chat.title}`);
    } catch (error) {
      console.error('[ReactLLM] Failed to export chat:', error);
      throw error;
    }
  }
  
  async loadChatExports(): Promise<ChatExport[]> {
    if (!this.root) throw new Error('OPFS not initialized');
    
    try {
      const dir = await this.root.getDirectoryHandle('chat-exports');
      const exports: ChatExport[] = [];
      
      for await (const entry of dir.values()) {
        if (entry.kind === 'file' && entry.name.endsWith('.json')) {
          try {
            const file = await entry.getFile();
            const text = await file.text();
            const chatExport = JSON.parse(text) as ChatExport;
            exports.push(chatExport);
          } catch (error) {
            console.warn(`[ReactLLM] Failed to load chat export ${entry.name}:`, error);
          }
        }
      }
      
      return exports.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (error) {
      if (error.name === 'NotFoundError') {
        return [];
      }
      console.error('[ReactLLM] Failed to load chat exports:', error);
      throw error;
    }
  }
  
  // Settings Management
  
  async saveSettings(settings: Record<string, any>): Promise<void> {
    if (!this.root) throw new Error('OPFS not initialized');
    
    try {
      const file = await this.root.getFileHandle('settings.json', { create: true });
      const writable = await file.createWritable();
      
      await writable.write(JSON.stringify(settings, null, 2));
      await writable.close();
      
      console.log('[ReactLLM] Settings saved');
    } catch (error) {
      console.error('[ReactLLM] Failed to save settings:', error);
      throw error;
    }
  }
  
  async loadSettings(): Promise<Record<string, any> | null> {
    if (!this.root) throw new Error('OPFS not initialized');
    
    try {
      const file = await this.root.getFileHandle('settings.json');
      const fileData = await file.getFile();
      const text = await fileData.text();
      return JSON.parse(text);
    } catch (error) {
      if (error.name === 'NotFoundError') {
        return null; // Settings file doesn't exist yet
      }
      console.error('[ReactLLM] Failed to load settings:', error);
      throw error;
    }
  }
  
  // Cache Management
  
  async saveCache(key: string, data: any, ttl?: number): Promise<void> {
    if (!this.root) throw new Error('OPFS not initialized');
    
    try {
      const dir = await this.root.getDirectoryHandle('cache', { create: true });
      const file = await dir.getFileHandle(`${key}.json`, { create: true });
      const writable = await file.createWritable();
      
      const cacheData = {
        data,
        timestamp: Date.now(),
        ttl: ttl || 3600000 // Default 1 hour
      };
      
      await writable.write(JSON.stringify(cacheData));
      await writable.close();
    } catch (error) {
      console.error('[ReactLLM] Failed to save cache:', error);
    }
  }
  
  async loadCache(key: string): Promise<any | null> {
    if (!this.root) throw new Error('OPFS not initialized');
    
    try {
      const dir = await this.root.getDirectoryHandle('cache');
      const file = await dir.getFileHandle(`${key}.json`);
      const fileData = await file.getFile();
      const text = await fileData.text();
      const cacheData = JSON.parse(text);
      
      // Check if cache is expired
      if (Date.now() - cacheData.timestamp > cacheData.ttl) {
        // Clean up expired cache
        await dir.removeEntry(`${key}.json`);
        return null;
      }
      
      return cacheData.data;
    } catch (error) {
      return null; // Cache miss
    }
  }
  
  async clearCache(): Promise<void> {
    if (!this.root) throw new Error('OPFS not initialized');
    
    try {
      const dir = await this.root.getDirectoryHandle('cache');
      for await (const entry of dir.values()) {
        if (entry.kind === 'file') {
          await dir.removeEntry(entry.name);
        }
      }
      console.log('[ReactLLM] Cache cleared');
    } catch (error) {
      if (error.name !== 'NotFoundError') {
        console.error('[ReactLLM] Failed to clear cache:', error);
      }
    }
  }
  
  // Storage Statistics
  
  async getStorageUsage(): Promise<{ used: number; quota: number; available: number }> {
    if (!this.isSupported) {
      return { used: 0, quota: 0, available: 0 };
    }
    
    try {
      const estimate = await navigator.storage.estimate();
      return {
        used: estimate.usage || 0,
        quota: estimate.quota || 0,
        available: (estimate.quota || 0) - (estimate.usage || 0)
      };
    } catch (error) {
      console.error('[ReactLLM] Failed to get storage usage:', error);
      return { used: 0, quota: 0, available: 0 };
    }
  }
  
  formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}