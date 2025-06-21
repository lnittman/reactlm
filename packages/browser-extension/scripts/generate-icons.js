#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const iconsDir = path.join(__dirname, '..', 'src', 'icons');

// Ensure icons directory exists
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Simple SVG icon template
const createSvgIcon = (size) => `
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#1e40af" rx="${size * 0.1}"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.4}px" font-weight="bold" 
        fill="white" text-anchor="middle" dominant-baseline="middle">RL</text>
</svg>
`;

// Convert SVG to data URL and then to PNG using canvas
const svgToPng = async (svgString, size) => {
  try {
    // Try to use node-canvas if available
    const { createCanvas, loadImage } = require('canvas');
    
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');
    
    const svgDataUrl = `data:image/svg+xml;base64,${Buffer.from(svgString).toString('base64')}`;
    const img = await loadImage(svgDataUrl);
    
    ctx.drawImage(img, 0, 0, size, size);
    return canvas.toBuffer('image/png');
  } catch (error) {
    // If canvas is not available, create a placeholder PNG using pure Node.js
    // This creates a simple colored square as a fallback
    console.warn('node-canvas not available, creating simple placeholder icons');
    
    // PNG signature and basic IHDR chunk for a simple colored square
    // This is a very basic PNG implementation
    const PNG_SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
    
    // For simplicity, save the SVG file instead
    return Buffer.from(svgString);
  }
};

// Icon sizes required by Chrome/Firefox
const sizes = [16, 48, 128];

console.log('🎨 Generating extension icons...');

sizes.forEach(size => {
  const svg = createSvgIcon(size);
  const svgPath = path.join(iconsDir, `icon-${size}.svg`);
  
  // Save SVG version
  fs.writeFileSync(svgPath, svg);
  console.log(`✅ Created icon-${size}.svg`);
  
  // For now, we'll need to manually convert these to PNG
  // or use an online converter
});

console.log('\n📝 Note: SVG icons have been created.');
console.log('   For the extension to work properly, you\'ll need to convert these to PNG format.');
console.log('   You can use an online converter like https://cloudconvert.com/svg-to-png');
console.log('   Or install node-canvas: npm install canvas');

// Create a simple PNG generator without dependencies
const createSimplePng = (size, filename) => {
  // This creates a very basic 1x1 PNG that can be used as a placeholder
  // Real PNG generation requires proper libraries
  const png = Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]), // PNG signature
    Buffer.from([0x00, 0x00, 0x00, 0x0D]), // IHDR length
    Buffer.from('IHDR'),
    Buffer.from([0x00, 0x00, 0x00, 0x01]), // width: 1
    Buffer.from([0x00, 0x00, 0x00, 0x01]), // height: 1
    Buffer.from([0x08, 0x02, 0x00, 0x00, 0x00]), // bit depth, color type, etc
    Buffer.from([0x90, 0x77, 0x53, 0xDE]), // CRC
    Buffer.from([0x00, 0x00, 0x00, 0x0C]), // IDAT length
    Buffer.from('IDAT'),
    Buffer.from([0x08, 0xD7, 0x63, 0xF8, 0xCF, 0xC0, 0x00, 0x00, 0x03, 0x01, 0x01, 0x00]), // compressed data
    Buffer.from([0x18, 0xDD, 0x8D, 0xB4]), // CRC
    Buffer.from([0x00, 0x00, 0x00, 0x00]), // IEND length
    Buffer.from('IEND'),
    Buffer.from([0xAE, 0x42, 0x60, 0x82]) // CRC
  ]);
  
  fs.writeFileSync(path.join(iconsDir, filename), png);
};

// Create placeholder PNGs
sizes.forEach(size => {
  createSimplePng(size, `icon-${size}.png`);
  console.log(`✅ Created placeholder icon-${size}.png`);
});

console.log('\n✨ Icon generation complete!');
console.log('   Replace the placeholder PNGs with proper icons before publishing.');