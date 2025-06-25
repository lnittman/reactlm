#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Copy the built file to the web app's public directory
const sourceFile = path.join(__dirname, '../dist/reactlm.global.js');
const targetDir = path.join(__dirname, '../../../apps/web/public');
const targetFile = path.join(targetDir, 'reactlm.js');

if (fs.existsSync(sourceFile)) {
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  
  try {
    fs.copyFileSync(sourceFile, targetFile);
    console.log('✅ Copied reactlm.js to web app public directory');
  } catch (error) {
    console.error('❌ Failed to copy reactlm.js:', error.message);
  }
} else {
  console.warn('⚠️  reactlm.global.js not found in dist directory');
}