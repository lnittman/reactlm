#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

const distDir = path.join(__dirname, '..', 'dist');
const outDir = path.join(__dirname, '..', 'packages');

// Get browser type from command line
const browser = process.argv[2];

if (!browser || !['chrome', 'firefox'].includes(browser)) {
  console.error('Usage: node package.js <chrome|firefox>');
  process.exit(1);
}

// Ensure dist directory exists
if (!fs.existsSync(distDir)) {
  console.error('❌ No dist directory found. Run "npm run build" first.');
  process.exit(1);
}

// Ensure output directory exists
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// Create manifest for specific browser
const manifest = JSON.parse(fs.readFileSync(path.join(distDir, 'manifest.json'), 'utf8'));

if (browser === 'firefox') {
  // Firefox-specific manifest adjustments
  manifest.browser_specific_settings = {
    gecko: {
      id: "react-llm@example.com",
      strict_min_version: "109.0"
    }
  };
  
  // Firefox uses browser_action instead of action
  if (manifest.action) {
    manifest.browser_action = manifest.action;
    delete manifest.action;
  }
  
  // Update background script format for Firefox
  if (manifest.background && manifest.background.service_worker) {
    manifest.background = {
      scripts: [manifest.background.service_worker],
      persistent: false
    };
  }
}

// Write browser-specific manifest
const tempManifestPath = path.join(distDir, `manifest.${browser}.json`);
fs.writeFileSync(tempManifestPath, JSON.stringify(manifest, null, 2));

// Create zip file
const outputFile = path.join(outDir, `react-llm-${browser}-v${manifest.version}.zip`);
const output = fs.createWriteStream(outputFile);
const archive = archiver('zip', {
  zlib: { level: 9 }
});

output.on('close', () => {
  // Clean up temporary manifest
  fs.unlinkSync(tempManifestPath);
  
  console.log(`✅ Created ${browser} extension package:`);
  console.log(`   ${outputFile}`);
  console.log(`   Size: ${(archive.pointer() / 1024 / 1024).toFixed(2)} MB`);
  
  if (browser === 'chrome') {
    console.log('\n📦 To publish to Chrome Web Store:');
    console.log('   1. Go to https://chrome.google.com/webstore/devconsole');
    console.log('   2. Click "New Item" and upload the zip file');
  } else {
    console.log('\n📦 To publish to Firefox Add-ons:');
    console.log('   1. Go to https://addons.mozilla.org/developers/');
    console.log('   2. Click "Submit a New Add-on" and upload the zip file');
  }
});

archive.on('warning', (err) => {
  if (err.code === 'ENOENT') {
    console.warn('Warning:', err);
  } else {
    throw err;
  }
});

archive.on('error', (err) => {
  throw err;
});

// Pipe archive data to the file
archive.pipe(output);

// Add files to archive
console.log(`📦 Creating ${browser} extension package...`);

// Add all files from dist except the original manifest
fs.readdirSync(distDir).forEach(file => {
  const filePath = path.join(distDir, file);
  const stat = fs.statSync(filePath);
  
  if (file === 'manifest.json') {
    // Use browser-specific manifest
    archive.file(tempManifestPath, { name: 'manifest.json' });
  } else if (stat.isDirectory()) {
    archive.directory(filePath, file);
  } else {
    archive.file(filePath, { name: file });
  }
});

// Finalize the archive
archive.finalize();