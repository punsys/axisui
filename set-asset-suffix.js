// Usage: node set-asset-suffix.js [dev|prod|restore]
// Replaces {{ASSET_SUFFIX}} in HTML files with '' (dev), '.min' (prod), or '{{ASSET_SUFFIX}}' (restore)

const fs = require('fs');
const path = require('path');

const mode = process.argv[2] || 'dev';
let suffix;
let targetString;

if (mode === 'restore') {
  suffix = '';
  targetString = '{{ASSET_SUFFIX}}';
} else {
  suffix = mode === 'prod' ? '.min' : '';
  targetString = suffix;
}

const htmlDir = path.join(__dirname, 'src', 'html');

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent;
  
  if (mode === 'restore') {
    // Restore placeholders from both .min and non-minified versions
    newContent = content.replace(/axis-ui\.min\.(css|js)/g, 'axis-ui{{ASSET_SUFFIX}}.$1');
    newContent = newContent.replace(/axis-ui\.(css|js)(?!\.map)/g, 'axis-ui{{ASSET_SUFFIX}}.$1');
  } else {
    // Replace placeholder with actual suffix
    newContent = content.replace(/\{\{ASSET_SUFFIX\}\}/g, suffix);
  }
  
  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log('Updated:', filePath);
  }
}

function walk(dir) {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (file.endsWith('.html')) {
      replaceInFile(fullPath);
    }
  });
}

walk(htmlDir);
console.log('Asset suffix set to', suffix || '{{ASSET_SUFFIX}}', 'for', mode, 'mode.');
