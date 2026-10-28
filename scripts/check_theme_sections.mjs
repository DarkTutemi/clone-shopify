import fs from 'fs';

const content = fs.readFileSync('draft_theme_pre_fix_backup/layout__theme.liquid', 'utf8');
const lines = content.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('section') || l.includes('header') || l.includes('announcement') || l.includes('cart')) {
    console.log(`${idx + 1}: ${l.trim()}`);
  }
});
