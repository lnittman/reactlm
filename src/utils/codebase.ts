interface FileEntry {
  path: string;
  content: string;
}

export async function scanCodebase(): Promise<FileEntry[]> {
  // This will only work in development mode when running on localhost
  if (!window.location.hostname.includes('localhost') && !window.location.hostname.includes('127.0.0.1')) {
    console.warn('Codebase scanning is only available in development mode');
    return [];
  }

  try {
    // Request a file system handle for the project directory
    // @ts-ignore - FileSystemDirectoryHandle is not in TypeScript's lib.dom yet
    const dirHandle = await window.showDirectoryPicker({
      mode: 'read',
    });

    const files: FileEntry[] = [];
    await scanDirectory(dirHandle, '', files);
    return files;
  } catch (error) {
    console.error('Error scanning codebase:', error);
    return [];
  }
}

async function scanDirectory(
  dirHandle: FileSystemDirectoryHandle,
  path: string,
  files: FileEntry[]
): Promise<void> {
  const ignoreDirs = new Set([
    'node_modules',
    '.git',
    'dist',
    'build',
    'coverage',
  ]);

  const ignoreFiles = new Set([
    '.DS_Store',
    'package-lock.json',
    'yarn.lock',
  ]);

  const allowedExtensions = new Set([
    '.js',
    '.jsx',
    '.ts',
    '.tsx',
    '.css',
    '.scss',
    '.html',
    '.json',
    '.md',
  ]);

  for await (const entry of dirHandle.values()) {
    const entryPath = path ? `${path}/${entry.name}` : entry.name;

    if (entry.kind === 'directory') {
      if (!ignoreDirs.has(entry.name)) {
        await scanDirectory(entry, entryPath, files);
      }
    } else if (entry.kind === 'file') {
      const ext = entry.name.slice(entry.name.lastIndexOf('.'));
      if (!ignoreFiles.has(entry.name) && allowedExtensions.has(ext)) {
        try {
          const file = await entry.getFile();
          const content = await file.text();
          files.push({ path: entryPath, content });
        } catch (error) {
          console.warn(`Error reading file ${entryPath}:`, error);
        }
      }
    }
  }
}
