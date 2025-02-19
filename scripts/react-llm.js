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
function ensureDir(dir) {
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
function addScriptToLayout(framework) {
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
function setupEnvironmentVariables(framework, apiKey) {
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
    
    // Detect framework
    const framework = detectFramework();
    if (!framework) {
      console.error('❌ Could not detect React in your project. Please ensure you have React installed.');
      process.exit(1);
    }
    
    // Create necessary directories
    const publicDir = path.join(process.cwd(), 'public');
    ensureDir(publicDir);
    
    // Add script to package.json
    addScriptToPackageJson();
    console.log('✅ Added react-llm command to package.json scripts');
    
    // Add script tag to layout
    addScriptToLayout(framework);
    
    // Set up environment variables
    setupEnvironmentVariables(framework, apiKey);
    
    // Run initial generation
    console.log('🔍 Generating initial codebase context...');
    execSync('react-llm generate', { stdio: 'inherit' });
    
    console.log('\n🎉 react-llm has been successfully installed!');
    console.log('\nNext steps:');
    console.log('1. Commit the changes to your repository');
    console.log('2. Run `pnpm react-llm` whenever you want to update the codebase context');
  } catch (error) {
    console.error('❌ Failed to install react-llm:', error.message);
    process.exit(1);
  }
}

// Generate command
if (command === 'generate') {
  try {
    console.log('🔍 Running RepoMix to generate codebase context...');
    
    // Run RepoMix with increased buffer size
    const output = execSync('repomix', { 
      stdio: ['pipe', 'pipe', 'pipe'],
      maxBuffer: 10 * 1024 * 1024 // 10MB buffer
    });
    
    // Create the context file in public directory
    const publicDir = path.join(process.cwd(), 'public');
    ensureDir(publicDir);
    
    // Write the context to a JSON file
    fs.writeFileSync(
      path.join(publicDir, 'codebase-context.json'),
      JSON.stringify({ context: output.toString() })
    );
    
    console.log('✅ Codebase context generated successfully!');
    console.log('📝 Saved to public/codebase-context.json');
  } catch (error) {
    console.error('❌ Failed to generate codebase context:', error.message);
    process.exit(1);
  }
} 