import fs from 'fs';

const content = fs.readFileSync('backup_phase_a_templates/sections__zavelyn-pdp-main.liquid', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.includes('benefit') || l.includes('zv-pdp-benefits') || l.includes('kc-benefits') || l.includes('eyebrow')) {
    console.log(`Line ${i}: ${l.trim()}`);
  }
});
