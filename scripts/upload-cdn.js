#!/usr/bin/env node

/**
 * CDN Upload Script for React LLM
 * 
 * Uploads built packages to CDN for script tag usage.
 * Supports AWS S3, Cloudflare R2, and other S3-compatible services.
 */

const { S3Client, PutObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');
const { readFile, readdir, stat } = require('fs/promises');
const { resolve, extname, basename } = require('path');
const { createHash } = require('crypto');

class CDNUploader {
  constructor() {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'auto',
      endpoint: process.env.CDN_ENDPOINT,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    this.bucketName = process.env.CDN_BUCKET || 'react-llm-cdn';
    this.version = process.env.npm_package_version || '0.1.0';
    this.dryRun = process.argv.includes('--dry-run');
    this.force = process.argv.includes('--force');
    
    console.log(`🚀 React LLM CDN Upload v${this.version}`);
    console.log(`📦 Bucket: ${this.bucketName}`);
    
    if (this.dryRun) {
      console.log('🔍 Dry run mode - no files will be uploaded');
    }
  }

  async uploadFiles() {
    try {
      const files = await this.getFilesToUpload();
      
      if (files.length === 0) {
        console.log('❌ No files found to upload');
        return;
      }

      console.log(`📁 Found ${files.length} files to upload`);
      
      for (const file of files) {
        await this.uploadFile(file);
      }
      
      console.log('✅ Upload completed successfully!');
      
      // Generate usage examples
      this.generateUsageExamples();
      
    } catch (error) {
      console.error('❌ Upload failed:', error.message);
      process.exit(1);
    }
  }

  async getFilesToUpload() {
    const files = [];
    const packagesDir = resolve(__dirname, '../packages');
    
    try {
      const packages = await readdir(packagesDir);
      
      for (const pkg of packages) {
        const distPath = resolve(packagesDir, pkg, 'dist');
        
        try {
          const distStat = await stat(distPath);
          if (distStat.isDirectory()) {
            const distFiles = await this.getDistFiles(distPath, pkg);
            files.push(...distFiles);
          }
        } catch (error) {
          // Skip packages without dist directories
          continue;
        }
      }
    } catch (error) {
      console.error('Error reading packages directory:', error.message);
    }
    
    return files;
  }

  async getDistFiles(distPath, packageName) {
    const files = [];
    const entries = await readdir(distPath);
    
    for (const entry of entries) {
      const fullPath = resolve(distPath, entry);
      const entryStat = await stat(fullPath);
      
      if (entryStat.isFile()) {
        const ext = extname(entry).toLowerCase();
        
        // Only upload web-compatible files
        if (['.js', '.mjs', '.css', '.map', '.wasm'].includes(ext)) {
          files.push({
            localPath: fullPath,
            packageName,
            fileName: entry,
            size: entryStat.size,
          });
        }
      }
    }
    
    return files;
  }

  async uploadFile(file) {
    const content = await readFile(file.localPath);
    const contentHash = createHash('sha256').update(content).digest('hex').slice(0, 8);
    
    // Upload versioned file
    const versionedKey = `v${this.version}/${file.packageName}/${file.fileName}`;
    await this.uploadToS3(versionedKey, content, file, true);
    
    // Upload latest file (shorter cache)
    const latestKey = `latest/${file.packageName}/${file.fileName}`;
    await this.uploadToS3(latestKey, content, file, false);
    
    // Upload immutable file with hash (longest cache)
    const hashedKey = `immutable/${file.packageName}/${file.fileName.replace(/\.(js|css)$/, `.${contentHash}.$1`)}`;
    await this.uploadToS3(hashedKey, content, file, true, true);
  }

  async uploadToS3(key, content, file, longCache = false, immutable = false) {
    try {
      // Check if file already exists (unless force upload)
      if (!this.force && !this.dryRun) {
        try {
          await this.s3Client.send(new HeadObjectCommand({
            Bucket: this.bucketName,
            Key: key,
          }));
          
          console.log(`⏭️  Skipping ${key} (already exists)`);
          return;
        } catch (error) {
          // File doesn't exist, continue with upload
        }
      }

      const contentType = this.getContentType(file.fileName);
      const cacheControl = this.getCacheControl(longCache, immutable);
      
      if (this.dryRun) {
        console.log(`📋 Would upload: ${key} (${this.formatBytes(content.length)})`);
        return;
      }

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: content,
        ContentType: contentType,
        CacheControl: cacheControl,
        ContentEncoding: file.fileName.endsWith('.gz') ? 'gzip' : undefined,
        Metadata: {
          'react-llm-version': this.version,
          'upload-date': new Date().toISOString(),
          'package-name': file.packageName,
        },
      });

      await this.s3Client.send(command);
      console.log(`✅ Uploaded: ${key} (${this.formatBytes(content.length)})`);
      
    } catch (error) {
      console.error(`❌ Failed to upload ${key}:`, error.message);
      throw error;
    }
  }

  getContentType(fileName) {
    const ext = extname(fileName).toLowerCase();
    const types = {
      '.js': 'application/javascript',
      '.mjs': 'application/javascript',
      '.css': 'text/css',
      '.map': 'application/json',
      '.wasm': 'application/wasm',
    };
    
    return types[ext] || 'application/octet-stream';
  }

  getCacheControl(longCache, immutable) {
    if (immutable) {
      return 'public, max-age=31536000, immutable'; // 1 year
    } else if (longCache) {
      return 'public, max-age=2592000'; // 30 days
    } else {
      return 'public, max-age=300'; // 5 minutes
    }
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  generateUsageExamples() {
    const baseUrl = process.env.CDN_BASE_URL || `https://${this.bucketName}`;
    
    console.log('\n📚 Usage Examples:');
    console.log('\n🔗 Script Tag (Latest):');
    console.log(`<script src="${baseUrl}/latest/react-llm/react-llm.js"></script>`);
    
    console.log('\n📌 Script Tag (Pinned Version):');
    console.log(`<script src="${baseUrl}/v${this.version}/react-llm/react-llm.js"></script>`);
    
    console.log('\n⚡ Script Tag (Immutable/Fast):');
    console.log(`<!-- Use the immutable URL for best performance -->`);
    console.log(`<script src="${baseUrl}/immutable/react-llm/react-llm.[hash].js"></script>`);
    
    console.log('\n🌐 CDN URLs:');
    console.log(`Latest:    ${baseUrl}/latest/react-llm/`);
    console.log(`Versioned: ${baseUrl}/v${this.version}/react-llm/`);
    console.log(`Immutable: ${baseUrl}/immutable/react-llm/`);
    
    console.log('\n📦 Available Packages:');
    console.log('- react-llm (core package)');
    console.log('- @react-llm/next (Next.js plugin)');
    console.log('- @react-llm/vite (Vite plugin)');
    console.log('- @react-llm/browser-extension (browser extension files)');
  }
}

// Environment validation
function validateEnvironment() {
  const required = ['AWS_ACCESS_KEY_ID', 'AWS_SECRET_ACCESS_KEY'];
  const missing = required.filter(env => !process.env[env]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(env => console.error(`   - ${env}`));
    console.error('\nSet these in your CI/CD environment or .env file');
    process.exit(1);
  }
}

// Main execution
async function main() {
  console.log('🔧 Validating environment...');
  validateEnvironment();
  
  const uploader = new CDNUploader();
  await uploader.uploadFiles();
}

// Handle errors
process.on('uncaughtException', (error) => {
  console.error('💥 Uncaught exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error('💥 Unhandled rejection:', reason);
  process.exit(1);
});

// Show help
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log(`
📦 React LLM CDN Upload Script

Usage: 
  node scripts/upload-cdn.js [options]

Options:
  --dry-run    Show what would be uploaded without actually uploading
  --force      Force upload even if files already exist
  --help, -h   Show this help message

Environment Variables:
  AWS_ACCESS_KEY_ID      AWS access key ID (required)
  AWS_SECRET_ACCESS_KEY  AWS secret access key (required)
  AWS_REGION            AWS region (default: auto)
  CDN_ENDPOINT          S3-compatible endpoint URL (optional)
  CDN_BUCKET            Bucket name (default: react-llm-cdn)
  CDN_BASE_URL          Base URL for generated examples

Examples:
  # Dry run to see what would be uploaded
  node scripts/upload-cdn.js --dry-run
  
  # Force upload all files
  node scripts/upload-cdn.js --force
  
  # Normal upload (skip existing files)
  node scripts/upload-cdn.js
`);
  process.exit(0);
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { CDNUploader };