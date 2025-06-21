#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const srcDir = path.join(__dirname, '..', 'src');
const distDir = path.join(__dirname, '..', 'dist');
const rootDir = path.join(__dirname, '..');

// Parse command line arguments
const isWatch = process.argv.includes('--watch');

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  fs.mkdirSync(distDir, { recursive: true });
}

// Copy manifest.json
console.log('📋 Copying manifest.json...');
fs.copyFileSync(
  path.join(rootDir, 'manifest.json'),
  path.join(distDir, 'manifest.json')
);

// Copy HTML files
console.log('📄 Copying HTML files...');
const htmlFiles = [
  'popup/popup.html',
  'options/options.html'
];

htmlFiles.forEach(file => {
  const srcPath = path.join(srcDir, file);
  const destPath = path.join(distDir, file);
  const destDir = path.dirname(destPath);
  
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
  }
});

// Copy JS files (popup.js and options.js)
console.log('📦 Copying JavaScript files...');
const jsFiles = [
  'popup/popup.js',
  'options/options.js'
];

jsFiles.forEach(file => {
  const srcPath = path.join(srcDir, file);
  const destPath = path.join(distDir, file);
  
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, destPath);
  }
});

// Copy icons
console.log('🎨 Copying icons...');
const iconsDir = path.join(srcDir, 'icons');
const destIconsDir = path.join(distDir, 'icons');

if (fs.existsSync(iconsDir)) {
  if (!fs.existsSync(destIconsDir)) {
    fs.mkdirSync(destIconsDir, { recursive: true });
  }
  
  fs.readdirSync(iconsDir).forEach(file => {
    if (file.endsWith('.png')) {
      fs.copyFileSync(
        path.join(iconsDir, file),
        path.join(destIconsDir, file)
      );
    }
  });
}

// Compile TypeScript files
console.log('🔨 Compiling TypeScript...');

try {
  // Use the tsconfig.json file for compilation
  execSync('npx tsc', { 
    stdio: 'inherit',
    cwd: rootDir
  });
  
  // Check which files were compiled
  const compiledFiles = fs.readdirSync(distDir)
    .filter(file => file.endsWith('.js') && !file.includes('react-llm'));
  
  compiledFiles.forEach(file => {
    console.log(`✅ Compiled ${file}`);
  });
  
  if (compiledFiles.length === 0) {
    console.warn('⚠️  No TypeScript files were compiled');
  }
} catch (error) {
  console.error('❌ TypeScript compilation failed');
  console.log('\n💡 Tip: Check for TypeScript errors by running: npx tsc --noEmit');
}

// Copy react-llm.js from the main package
console.log('📦 Copying react-llm.js...');
const reactLLMSource = path.join(__dirname, '..', '..', 'react-llm', 'dist', 'index.global.js');
const reactLLMDest = path.join(distDir, 'react-llm.js');

if (fs.existsSync(reactLLMSource)) {
  fs.copyFileSync(reactLLMSource, reactLLMDest);
  console.log('✅ Copied react-llm.js');
} else {
  console.warn('⚠️  react-llm.js not found. Make sure to build the main package first.');
}

console.log('✨ Build complete!');

// Watch mode
if (isWatch) {
  console.log('\n👀 Watching for changes...');
  
  const chokidar = require('chokidar');
  
  // Watch TypeScript files
  chokidar.watch(path.join(srcDir, '**/*.ts'), {
    ignored: /node_modules/,
    persistent: true
  }).on('change', (filePath) => {
    const fileName = path.basename(filePath);
    console.log(`\n📝 ${fileName} changed, recompiling...`);
    
    try {
      // Recompile all TypeScript files using tsconfig
      execSync('npx tsc', { 
        stdio: 'inherit',
        cwd: rootDir
      });
      console.log('✅ TypeScript recompilation complete');
    } catch (error) {
      console.error('❌ TypeScript compilation failed');
    }
  });
  
  // Watch other files
  chokidar.watch([
    path.join(rootDir, 'manifest.json'),
    path.join(srcDir, '**/*.html'),
    path.join(srcDir, '**/*.js'),
    path.join(srcDir, 'icons/*.png')
  ], {
    ignored: /node_modules/,
    persistent: true
  }).on('change', (filePath) => {
    console.log(`\n📝 ${path.basename(filePath)} changed, copying...`);
    
    // Determine destination path
    let destPath;
    if (filePath.includes('manifest.json')) {
      destPath = path.join(distDir, 'manifest.json');
    } else {
      const relativePath = path.relative(srcDir, filePath);
      destPath = path.join(distDir, relativePath);
    }
    
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    
    fs.copyFileSync(filePath, destPath);
    console.log(`✅ Copied ${path.basename(filePath)}`);
  });
  
  // Watch react-llm.js changes
  if (fs.existsSync(reactLLMSource)) {
    chokidar.watch(reactLLMSource, {
      persistent: true
    }).on('change', () => {
      console.log('\n📝 react-llm.js changed, copying...');
      fs.copyFileSync(reactLLMSource, reactLLMDest);
      console.log('✅ Copied react-llm.js');
    });
  }
  
  console.log('Press Ctrl+C to stop watching...\n');
}