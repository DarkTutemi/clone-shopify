import fs from 'fs';

const code = fs.readFileSync('Clone-willafarm/theme/sections/heating-lamp-funnel.liquid', 'utf8');
const lines = code.split('\n');
const imgs = [
  'Screenshot_2026-10-24_232357',
  'Screenshot_2026-10-24_232402',
  'Screenshot_2026-10-24_232410',
  'Screenshot_2026-10-24_232406',
  'Screenshot_2026-10-24_233046',
  'Screenshot_2026-10-24_233039',
  'Screenshot_2026-10-24_233033',
  'Screenshot_2026-10-24_233013'
];

imgs.forEach(img => {
  lines.forEach((l, i) => {
    if (l.includes(img)) {
      console.log(`Line ${i+1}: ${l.trim().substring(0, 140)}`);
    }
  });
});
