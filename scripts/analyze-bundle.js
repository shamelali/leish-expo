#!/usr/bin/env node

/**
 * Bundle Analysis Script
 * Analyzes and reports on the bundle size and performance metrics
 */

const fs = require('fs');
const path = require('path');

console.log('\n📦 Bundle Analysis Report\n');

// Analyze project structure
const projectRoot = process.cwd();
const getDirectorySize = (dir) => {
  let size = 0;
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    if (file.isDirectory()) {
      if (!file.name.startsWith('.') && file.name !== 'node_modules') {
        size += getDirectorySize(path.join(dir, file.name));
      }
    } else {
      const filePath = path.join(dir, file.name);
      const stats = fs.statSync(filePath);
      size += stats.size;
    }
  }
  
  return size;
};

const formatBytes = (bytes) => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

// Analyze source directories
const dirs = {
  'Source Code': path.join(projectRoot, 'app'),
  'Components': path.join(projectRoot, 'components'),
  'Hooks': path.join(projectRoot, 'hooks'),
  'Services': path.join(projectRoot, 'services'),
  'Store': path.join(projectRoot, 'store'),
  'Utils': path.join(projectRoot, 'utils'),
  'Tests': path.join(projectRoot, '__tests__'),
};

console.log('📊 Directory Sizes:');
console.log('─'.repeat(50));

for (const [name, dir] of Object.entries(dirs)) {
  if (fs.existsSync(dir)) {
    const size = getDirectorySize(dir);
    console.log(`  ${name.padEnd(20)} ${formatBytes(size).padStart(12)}`);
  }
}

console.log('\n📈 File Count by Type:');
console.log('─'.repeat(50));

const countFilesByType = (dir, extensions = {}) => {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  for (const file of files) {
    if (file.isDirectory()) {
      if (!file.name.startsWith('.') && file.name !== 'node_modules') {
        countFilesByType(path.join(dir, file.name), extensions);
      }
    } else {
      const ext = path.extname(file.name) || 'no-ext';
      extensions[ext] = (extensions[ext] || 0) + 1;
    }
  }
  
  return extensions;
};

const extensions = countFilesByType(projectRoot);
const sortedExt = Object.entries(extensions)
  .sort(([, a], [, b]) => b - a)
  .filter(([ext]) => !['.json', '.log', '.lock', '.DS_Store'].includes(ext))
  .slice(0, 10);

for (const [ext, count] of sortedExt) {
  console.log(`  ${ext.padEnd(15)} ${count.toString().padStart(5)} files`);
}

// Recommendations
console.log('\n✨ Performance Recommendations:');
console.log('─'.repeat(50));

const recommendations = [
  '1. Monitor bundle size growth in CI pipeline',
  '2. Use dynamic imports for heavy components',
  '3. Enable code splitting for large screens',
  '4. Consider tree-shaking unused dependencies',
  '5. Profile with DevTools to identify slow components',
  '6. Use React.memo for expensive renders',
];

recommendations.forEach(rec => console.log(`  ${rec}`));

console.log('\n✅ Bundle analysis complete!\n');
