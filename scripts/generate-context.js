#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const command = process.argv[2];

if (command !== 'generate') {
  console.log('Usage: react-llm generate');
  process.exit(1);
}

try {
  console.log('🔍 Running RepoMix to generate codebase context...');
  execSync('repomix && cat repomix-output.txt', { stdio: 'pipe' });
  
  // Read the output file
  const context = fs.readFileSync('repomix-output.txt', 'utf8');
  
  // Create the context file in public directory
  const publicDir = path.join(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir);
  }
  
  // Write the context to a JSON file
  fs.writeFileSync(
    path.join(publicDir, 'codebase-context.json'),
    JSON.stringify({ context })
  );
  
  // Clean up RepoMix output
  fs.unlinkSync('repomix-output.txt');
  
  console.log('✅ Codebase context generated successfully!');
  console.log('📝 Saved to public/codebase-context.json');
} catch (error) {
  console.error('❌ Failed to generate codebase context:', error.message);
  process.exit(1);
}
