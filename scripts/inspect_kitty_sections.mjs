import fs from 'fs';

const html = fs.readFileSync('kitty_pdp_full.html', 'utf8');
const sections = [...html.matchAll(/id="shopify-section-([^"]+)"/g)].map(m => m[1]);
console.log('Sections found:', sections.length);
sections.forEach((s, idx) => {
  console.log(`[${idx}] ${s}`);
});
