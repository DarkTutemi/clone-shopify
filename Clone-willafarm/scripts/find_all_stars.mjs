import fs from 'fs';
import path from 'path';

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      scanDir(full);
    } else if (full.endsWith('.liquid') || full.endsWith('.json')) {
      const content = fs.readFileSync(full, 'utf8');
      const matches = [];
      const lines = content.split('\n');
      lines.forEach((l, i) => {
        if (l.includes('wf-stars') || l.includes('★') || l.includes('⭐') || l.includes('review-stars') || l.includes('wf-rev-stars')) {
          matches.push({ line: i + 1, text: l.trim() });
        }
      });
      if (matches.length > 0) {
        console.log(`\nFile: ${full}`);
        matches.forEach(m => console.log(`  L${m.line}: ${m.text}`));
      }
    }
  }
}

scanDir('Clone-willafarm/theme');
