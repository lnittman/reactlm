#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const command = process.argv[2];

if (!command || !['install', 'generate'].includes(command)) {
  console.log('Usage: react-llm <command>');
  console.log('\nCommands:');
  console.log('  install   Add react-llm to your project');
  console.log('  generate  Generate codebase context');
  process.exit(1);
}

// Helper to ensure directory exists
function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Helper to detect the project's framework
function detectFramework() {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
  
  if (deps['next']) return 'next';
  if (deps['react']) return 'react';
  return null;
}

// Helper to add script to package.json
function addScriptToPackageJson() {
  const packageJsonPath = path.join(process.cwd(), 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  if (!packageJson.scripts) packageJson.scripts = {};
  packageJson.scripts['react-llm'] = 'react-llm generate';
  
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
}

// Helper to add script tag to layout
function addScriptToLayout(framework: string | null) {
  const scriptTag = `<script src="/react-llm.js"></script>`;
  
  if (framework === 'next') {
    // Try app directory first
    const appLayoutPath = path.join(process.cwd(), 'src', 'app', 'layout.tsx');
    const altAppLayoutPath = path.join(process.cwd(), 'app', 'layout.tsx');
    const pagesLayoutPath = path.join(process.cwd(), 'src', 'pages', '_app.tsx');
    const altPagesLayoutPath = path.join(process.cwd(), 'pages', '_app.tsx');
    
    let layoutFile = null;
    let layoutContent = null;
    
    // Try to find the layout file
    if (fs.existsSync(appLayoutPath)) {
      layoutFile = appLayoutPath;
      layoutContent = fs.readFileSync(appLayoutPath, 'utf8');
    } else if (fs.existsSync(altAppLayoutPath)) {
      layoutFile = altAppLayoutPath;
      layoutContent = fs.readFileSync(altAppLayoutPath, 'utf8');
    } else if (fs.existsSync(pagesLayoutPath)) {
      layoutFile = pagesLayoutPath;
      layoutContent = fs.readFileSync(pagesLayoutPath, 'utf8');
    } else if (fs.existsSync(altPagesLayoutPath)) {
      layoutFile = altPagesLayoutPath;
      layoutContent = fs.readFileSync(altPagesLayoutPath, 'utf8');
    }
    
    if (layoutFile && layoutContent) {
      if (!layoutContent.includes('react-llm.js')) {
        // For app directory
        if (layoutFile.includes('app/layout')) {
          layoutContent = layoutContent.replace(
            /export default function/,
            `import Script from 'next/script';\n\nexport default function`
          );
          layoutContent = layoutContent.replace(
            /<body[^>]*>/,
            `$&\n        <Script src="/react-llm.js" />`
          );
        }
        // For pages directory
        else {
          layoutContent = layoutContent.replace(
            /export default function/,
            `import Script from 'next/script';\n\nexport default function`
          );
          layoutContent = layoutContent.replace(
            /<Component[^>]*>/,
            `<Script src="/react-llm.js" />\n          $&`
          );
        }
        fs.writeFileSync(layoutFile, layoutContent);
        console.log(`✅ Added script tag to ${path.relative(process.cwd(), layoutFile)}`);
      }
    } else {
      console.log('⚠️  Could not find layout file. Please add the following to your layout:');
      console.log('   import Script from "next/script"');
      console.log(`   <Script src="/react-llm.js" />`);
    }
  } else {
    // For regular React apps, try to find index.html
    const indexPath = path.join(process.cwd(), 'public', 'index.html');
    if (fs.existsSync(indexPath)) {
      let content = fs.readFileSync(indexPath, 'utf8');
      if (!content.includes('react-llm.js')) {
        content = content.replace(
          /<body[^>]*>/,
          `$&\n    ${scriptTag}`
        );
        fs.writeFileSync(indexPath, content);
        console.log('✅ Added script tag to public/index.html');
      }
    } else {
      console.log('⚠️  Could not find index.html. Please add the following script tag manually:');
      console.log(`   ${scriptTag}`);
    }
  }
}

// Helper to set up environment variables
function setupEnvironmentVariables(framework: string | null, apiKey: string) {
  if (framework === 'next') {
    // Check for existing .env.local
    const envPath = path.join(process.cwd(), '.env.local');
    let envContent = '';
    
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
      if (!envContent.includes('NEXT_PUBLIC_GEMINI_API_KEY')) {
        envContent += `\nNEXT_PUBLIC_GEMINI_API_KEY=${apiKey}\n`;
      }
    } else {
      envContent = `NEXT_PUBLIC_GEMINI_API_KEY=${apiKey}\n`;
    }
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Added API key to .env.local');
    
    // Add .env.local to .gitignore if not already there
    const gitignorePath = path.join(process.cwd(), '.gitignore');
    if (fs.existsSync(gitignorePath)) {
      const gitignore = fs.readFileSync(gitignorePath, 'utf8');
      if (!gitignore.includes('.env.local')) {
        fs.appendFileSync(gitignorePath, '\n.env.local\n');
        console.log('✅ Added .env.local to .gitignore');
      }
    }
  } else {
    console.log('\nTo use react-llm, add this to your app:');
    console.log('window.GEMINI_API_KEY = "YOUR_API_KEY";');
    console.log('\nMake sure to set this before the react-llm.js script loads.');
  }
}

// Copy SQLite WASM file
async function copySqliteWasm(publicDir: string) {
  const possibleSources = [
    // Try package's own dist directory first
    path.join(__dirname, '..', 'dist', 'sqlite3.wasm'),
    // Try node_modules as fallback
    path.join(process.cwd(), 'node_modules', '@sqlite.org', 'sqlite-wasm', 'sqlite-wasm', 'jswasm', 'sqlite3.wasm'),
  ];

  const sqliteWasmDest = path.join(publicDir, 'sqlite3.wasm');
  
  for (const src of possibleSources) {
    if (fs.existsSync(src)) {
      fs.copyFileSync(src, sqliteWasmDest);
      console.log('✅ Copied sqlite3.wasm to public directory');
      return true;
    }
  }
  
  console.error('❌ Could not find sqlite3.wasm in any expected location.');
  console.error('This is likely a bug in react-llm. Please report it at:');
  console.error('https://github.com/yourusername/react-llm/issues');
  return false;
}

async function install(apiKey: string) {
  try {
    const framework = detectFramework();
    
    // Create necessary directories
    const publicDir = path.join(process.cwd(), 'public');
    ensureDir(publicDir);
    
    // Copy required files
    const success = await copySqliteWasm(publicDir);
    if (!success) {
      process.exit(1);
    }
    
    // Add script to package.json
    addScriptToPackageJson();
    
    // Add script to layout
    await addScriptToLayout(framework);
    
    // Setup environment variables
    await setupEnvironmentVariables(framework, apiKey);
    
    console.log('✨ react-llm installation complete!');
    console.log('');
    console.log('Next steps:');
    console.log('1. Start your development server');
    console.log('2. Visit your app and look for the react-llm chat widget');
    console.log('');
    console.log('For more information, visit: https://github.com/yourusername/react-llm');
  } catch (error: any) {
    console.error('❌ Installation failed:', error.message);
    process.exit(1);
  }
}

// Install command
if (command === 'install') {
  try {
    console.log('🔧 Setting up react-llm...');
    
    // Get API key
    const apiKey = process.argv[3];
    if (!apiKey) {
      console.error('❌ Please provide your Gemini API key:');
      console.error('   pnpm react-llm install YOUR_API_KEY');
      process.exit(1);
    }
    
    install(apiKey);
  } catch (error: any) {
    console.error('❌ Failed to install react-llm:', error.message);
    process.exit(1);
  }
}

// Generate command
if (command === 'generate') {
  try {
    console.log('🔍 Running RepoMix to generate codebase context...');
    
    // Create public directory if it doesn't exist
    const publicDir = path.join(process.cwd(), 'public');
    ensureDir(publicDir);
    
    // Run RepoMix with increased buffer size
    const output = execSync('repomix', { 
      stdio: ['pipe', 'pipe', 'pipe'],
      maxBuffer: 10 * 1024 * 1024 // 10MB buffer
    });
    
    // Write the context to a JSON file
    const contextFile = path.join(publicDir, 'codebase-context.json');
    fs.writeFileSync(
      contextFile,
      JSON.stringify({ context: output.toString() })
    );
    
    // Verify both required files exist
    const sqliteWasmPath = path.join(publicDir, 'sqlite3.wasm');
    if (!fs.existsSync(sqliteWasmPath)) {
      console.warn('⚠️  sqlite3.wasm not found in public directory. Please run `pnpm react-llm install` again');
    }
    
    console.log('✅ Codebase context generated successfully!');
    console.log('📝 Saved to public/codebase-context.json');
  } catch (error: any) {
    console.error('❌ Failed to generate codebase context:', error.message);
    process.exit(1);
  }
}