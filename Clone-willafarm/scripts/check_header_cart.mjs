import fs from 'fs';

const text = fs.readFileSync('Clone-willafarm/theme/sections/willa-header.liquid', 'utf8');
const lines = text.split('\n');
lines.forEach((l, i) => {
  if (l.toLowerCase().includes('cart')) {
    console.log((i + 1) + ': ' + l.trim());
  }
});
