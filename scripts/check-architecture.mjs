import fs from 'node:fs';
import path from 'node:path';

const SRC_DIR = path.resolve('src/app');

const FORBIDDEN_IMPORTS = [
  { pattern: /shared\/atoms\/avatar/g, replacement: 'shared/ui/identity/avatar/avatar' },
  { pattern: /shared\/nav-list\/nav-list/g, replacement: 'shared/ui/navigation/nav-list/nav-list' },
  { pattern: /shared\/nav-item\/nav-item/g, replacement: 'shared/ui/navigation/nav-item/nav-item' },
  { pattern: /shared\/grid\/grid/g, replacement: 'shared/ui/layouts/grid/grid' },
  { pattern: /shared\/drawer\/drawer/g, replacement: 'shared/ui/overlays/drawer/drawer' },
  { pattern: /shared\/ui\/molecules\/identity/g, replacement: 'shared/ui/identity' }
];

let errorCount = 0;

function reportError(file, message) {
  console.error(`❌ [Architecture Error] ${file}:\n    ${message}\n`);
  errorCount++;
}

function scanDirectory(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDirectory(fullPath);
    } else if (entry.isFile() && (fullPath.endsWith('.ts') || fullPath.endsWith('.html'))) {
      checkFile(fullPath);
    }
  }
}

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const relativePath = path.relative(path.resolve('.'), filePath);

  // Check 1: Raw <select> tag without app-select (excluding select.ts wrapper itself and comments)
  if (!relativePath.endsWith('select.ts')) {
    const selectMatches = [...content.matchAll(/<select[\s\S]*?>/g)];
    for (const match of selectMatches) {
      const tagContent = match[0];
      if (!tagContent.includes('app-select') && !tagContent.includes('ui-combobox')) {
        reportError(relativePath, `Raw <select> element found without 'app-select' directive:\n      ${tagContent.trim().replace(/\s+/g, ' ')}`);
      }
    }
  }

  // Check 2: Deprecated imports
  if (filePath.endsWith('.ts')) {
    for (const rule of FORBIDDEN_IMPORTS) {
      if (rule.pattern.test(content)) {
        reportError(relativePath, `Deprecated import path matching "${rule.pattern.source}" found. Replace with "${rule.replacement}".`);
      }
    }
  }
}

console.log('🔍 Running architectural checks...');
if (fs.existsSync(SRC_DIR)) {
  scanDirectory(SRC_DIR);
} else {
  console.error(`Directory not found: ${SRC_DIR}`);
  process.exit(1);
}

if (errorCount > 0) {
  console.error(`🚨 Architecture check failed with ${errorCount} error(s). Please fix the above violations.`);
  process.exit(1);
} else {
  console.log('✅ All architectural guardrails passed successfully! Zero raw selects & no deprecated imports.');
  process.exit(0);
}
