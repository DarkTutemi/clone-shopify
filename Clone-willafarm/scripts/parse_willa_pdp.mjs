import fs from 'fs';

const html = fs.readFileSync('Clone-willafarm/data/willafarm_pdp_mobile.html', 'utf8');
const sections = [...html.matchAll(/id=['"]shopify-section-([^'"]+)['"]/g)].map(m => m[1]);
console.log('Sections in willafarm PDP:', sections);

const headings = [...html.matchAll(/<h[23][^>]*>([\s\S]*?)<\/h[23]>/gi)]
  .map(m => m[1].replace(/<[^>]+>/g, '').trim())
  .filter(Boolean);
console.log('Headings in willafarm PDP:', headings.slice(0, 20));
