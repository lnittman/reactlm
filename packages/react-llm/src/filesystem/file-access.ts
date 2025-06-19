/**
 * File System Access API Manager
 * Provides live code editing capabilities in development mode
 */

export interface FileInfo {
  path: string;
  name: string;
  size: number;
  lastModified: number;
  type: string;
}

export interface DirectoryInfo {
  path: string;
  name: string;
  children: (FileInfo | DirectoryInfo)[];
}

export interface CodeChange {
  filePath: string;
  oldContent: string;
  newContent: string;
  timestamp: number;
  description?: string;
}

export class FileSystemAccess {
  private handles = new Map<string, FileSystemFileHandle>();
  private rootHandle: FileSystemDirectoryHandle | null = null;
  private isSupported = false;
  private isAccessGranted = false;
  private changeHistory: CodeChange[] = [];
  
  constructor() {
    this.checkSupport();
  }
  
  private checkSupport(): boolean {
    this.isSupported = 'showDirectoryPicker' in window && 'showOpenFilePicker' in window;
    return this.isSupported;
  }
  
  isFileAccessSupported(): boolean {
    return this.isSupported;
  }
  
  isAccessAvailable(): boolean {
    return this.isAccessGranted;
  }
  
  async requestAccess(): Promise<boolean> {
    if (!this.isSupported) {
      console.warn('[ReactLLM] File System Access API not supported in this browser');
      return false;
    }
    
    try {
      // Request directory access
      this.rootHandle = await window.showDirectoryPicker({
        mode: 'readwrite',
        startIn: 'desktop'
      });
      
      // Index all files in the directory
      await this.indexDirectory(this.rootHandle);
      
      this.isAccessGranted = true;
      console.log('[ReactLLM] File system access granted');
      return true;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('[ReactLLM] File access was cancelled by user');
      } else {
        console.error('[ReactLLM] File access denied:', error);
      }
      return false;
    }
  }
  
  private async indexDirectory(
    dirHandle: FileSystemDirectoryHandle,
    path = '',
    maxDepth = 5,
    currentDepth = 0
  ): Promise<void> {
    if (currentDepth >= maxDepth) return;
    
    try {
      for await (const entry of dirHandle.values()) {
        const entryPath = path ? `${path}/${entry.name}` : entry.name;
        
        // Skip common directories that shouldn't be edited
        if (entry.kind === 'directory' && this.shouldSkipDirectory(entry.name)) {
          continue;
        }
        
        if (entry.kind === 'file') {
          // Only index relevant file types
          if (this.isRelevantFile(entry.name)) {
            this.handles.set(entryPath, entry);
          }
        } else if (entry.kind === 'directory') {
          await this.indexDirectory(entry, entryPath, maxDepth, currentDepth + 1);
        }
      }
    } catch (error) {
      console.warn(`[ReactLLM] Could not index directory ${path}:`, error);
    }
  }
  
  private shouldSkipDirectory(name: string): boolean {
    const skipDirs = [
      'node_modules',
      '.git',
      '.next',
      '.nuxt',
      'dist',
      'build',
      '.cache',
      'coverage',
      '.DS_Store',
      'Thumbs.db'
    ];
    return skipDirs.includes(name) || name.startsWith('.');
  }
  
  private isRelevantFile(name: string): boolean {
    const relevantExtensions = [
      '.js', '.jsx', '.ts', '.tsx',
      '.vue', '.svelte',
      '.css', '.scss', '.less',
      '.json', '.md', '.yaml', '.yml',
      '.html', '.htm'
    ];
    return relevantExtensions.some(ext => name.endsWith(ext));
  }
  
  async getDirectoryStructure(): Promise<DirectoryInfo | null> {
    if (!this.rootHandle) return null;
    
    return this.buildDirectoryInfo(this.rootHandle, '');
  }
  
  private async buildDirectoryInfo(
    dirHandle: FileSystemDirectoryHandle,
    path: string
  ): Promise<DirectoryInfo> {
    const children: (FileInfo | DirectoryInfo)[] = [];
    
    try {
      for await (const entry of dirHandle.values()) {
        const entryPath = path ? `${path}/${entry.name}` : entry.name;
        
        if (entry.kind === 'file' && this.isRelevantFile(entry.name)) {
          const file = await entry.getFile();
          children.push({
            path: entryPath,
            name: entry.name,
            size: file.size,
            lastModified: file.lastModified,
            type: this.getFileType(entry.name)
          });
        } else if (entry.kind === 'directory' && !this.shouldSkipDirectory(entry.name)) {
          const subDir = await this.buildDirectoryInfo(entry, entryPath);
          children.push(subDir);
        }
      }
    } catch (error) {
      console.warn(`[ReactLLM] Could not read directory ${path}:`, error);
    }
    
    return {
      path,
      name: dirHandle.name,
      children: children.sort((a, b) => {
        // Directories first, then files
        if ('children' in a && !('children' in b)) return -1;
        if (!('children' in a) && 'children' in b) return 1;
        return a.name.localeCompare(b.name);
      })
    };
  }
  
  private getFileType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const typeMap: Record<string, string> = {
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'vue': 'vue',
      'svelte': 'svelte',
      'css': 'css',
      'scss': 'scss',
      'less': 'less',
      'json': 'json',
      'md': 'markdown',
      'yaml': 'yaml',
      'yml': 'yaml',
      'html': 'html',
      'htm': 'html'
    };
    return typeMap[extension || ''] || 'text';
  }
  
  async readFile(path: string): Promise<string> {
    const handle = this.handles.get(path);
    if (!handle) {
      throw new Error(`File not found: ${path}`);
    }
    
    try {
      const file = await handle.getFile();
      return await file.text();
    } catch (error) {
      console.error(`[ReactLLM] Failed to read file ${path}:`, error);
      throw error;
    }
  }
  
  async writeFile(path: string, content: string, description?: string): Promise<void> {
    const handle = this.handles.get(path);
    if (!handle) {
      throw new Error(`File not found: ${path}`);
    }
    
    try {
      // Read current content for change tracking
      const oldContent = await this.readFile(path);
      
      // Write new content
      const writable = await handle.createWritable();
      await writable.write(content);
      await writable.close();
      
      // Track the change
      this.changeHistory.push({
        filePath: path,
        oldContent,
        newContent: content,
        timestamp: Date.now(),
        description
      });
      
      // Limit history to last 50 changes
      if (this.changeHistory.length > 50) {
        this.changeHistory = this.changeHistory.slice(-50);
      }
      
      // Trigger HMR if available
      this.triggerHMR(path);
      
      console.log(`[ReactLLM] Updated file: ${path}`);
    } catch (error) {
      console.error(`[ReactLLM] Failed to write file ${path}:`, error);
      throw error;
    }
  }
  
  private triggerHMR(path: string): void {
    try {
      // Vite HMR
      if (window.__vite__ && window.__vite__.hot) {
        window.__vite__.hot.send('file-update', { path });
      }
      
      // Webpack HMR
      if (window.__webpack_hot_accept__) {
        window.__webpack_hot_accept__(path, () => {
          console.log(`[ReactLLM] HMR triggered for ${path}`);
        });
      }
      
      // Next.js HMR
      if (window.__NEXT_DATA__) {
        // Next.js automatically handles file changes
        console.log(`[ReactLLM] Next.js should automatically reload for ${path}`);
      }
    } catch (error) {
      console.warn('[ReactLLM] Could not trigger HMR:', error);
    }
  }
  
  async createFile(path: string, content: string, description?: string): Promise<void> {
    if (!this.rootHandle) {
      throw new Error('No directory access granted');
    }
    
    try {
      // Parse directory and filename
      const parts = path.split('/');
      const filename = parts.pop()!;
      
      // Navigate to directory (create if needed)
      let dirHandle = this.rootHandle;
      for (const part of parts) {
        if (part) {
          dirHandle = await dirHandle.getDirectoryHandle(part, { create: true });
        }
      }
      
      // Create file
      const fileHandle = await dirHandle.getFileHandle(filename, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(content);
      await writable.close();
      
      // Update index
      this.handles.set(path, fileHandle);
      
      // Track the change
      this.changeHistory.push({
        filePath: path,
        oldContent: '',
        newContent: content,
        timestamp: Date.now(),
        description: description || `Created file ${path}`
      });
      
      console.log(`[ReactLLM] Created file: ${path}`);
    } catch (error) {
      console.error(`[ReactLLM] Failed to create file ${path}:`, error);
      throw error;
    }
  }
  
  async deleteFile(path: string): Promise<void> {
    const handle = this.handles.get(path);
    if (!handle) {
      throw new Error(`File not found: ${path}`);
    }
    
    try {
      // Read content for change tracking
      const content = await this.readFile(path);
      
      // Delete file (need to navigate to parent directory)
      const parts = path.split('/');
      const filename = parts.pop()!;
      
      let dirHandle = this.rootHandle!;
      for (const part of parts) {
        if (part) {
          dirHandle = await dirHandle.getDirectoryHandle(part);
        }
      }
      
      await dirHandle.removeEntry(filename);
      
      // Remove from index
      this.handles.delete(path);
      
      // Track the change
      this.changeHistory.push({
        filePath: path,
        oldContent: content,
        newContent: '',
        timestamp: Date.now(),
        description: `Deleted file ${path}`
      });
      
      console.log(`[ReactLLM] Deleted file: ${path}`);
    } catch (error) {
      console.error(`[ReactLLM] Failed to delete file ${path}:`, error);
      throw error;
    }
  }
  
  getChangeHistory(): CodeChange[] {
    return [...this.changeHistory].reverse(); // Most recent first
  }
  
  async undoLastChange(): Promise<boolean> {
    const lastChange = this.changeHistory.pop();
    if (!lastChange) return false;
    
    try {
      if (lastChange.newContent === '') {
        // File was deleted, recreate it
        await this.createFile(lastChange.filePath, lastChange.oldContent, 'Undo delete');
      } else if (lastChange.oldContent === '') {
        // File was created, delete it
        await this.deleteFile(lastChange.filePath);
      } else {
        // File was modified, restore old content
        await this.writeFile(lastChange.filePath, lastChange.oldContent, 'Undo change');
      }
      
      console.log(`[ReactLLM] Undid change to ${lastChange.filePath}`);
      return true;
    } catch (error) {
      console.error('[ReactLLM] Failed to undo change:', error);
      // Restore the change to history since undo failed
      this.changeHistory.push(lastChange);
      return false;
    }
  }
  
  getAllFiles(): string[] {
    return Array.from(this.handles.keys()).sort();
  }
  
  getFilesByType(type: string): string[] {
    return this.getAllFiles().filter(path => this.getFileType(path) === type);
  }
  
  searchFiles(query: string): string[] {
    const lowerQuery = query.toLowerCase();
    return this.getAllFiles().filter(path => 
      path.toLowerCase().includes(lowerQuery)
    );
  }
}