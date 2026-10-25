import fs from 'fs';

const html = fs.readFileSync('Clone-navage/data/sinusitis_page.html', 'utf8');

// Find all headings
const headings = [...html.matchAll(/<(h[1-6])[^>]*class=["']([^"']*)["'][^>]*>([\s\S]*?)<\/\1>/gi)].map(m => ({
  tag: m[1],
  class: m[2],
  text: m[3].replace(/<[^>]+>/g, '').trim()
}));

console.log('Headings found count:', headings.length);
headings.slice(0, 10).forEach(h => {
  console.log(`[${h.tag}.${h.class}] ${h.text}`);
});

// Find how text-container and content-box are used
const boxes = [...html.matchAll(/class=["']([^"']*content-box[^"']*)["']/g)].map(m => m[1]);
console.log('\nContent box classes:', [...new Set(boxes)]);

// Check if there are any specific styles for rich text in sections
const richTextStyles = [...html.matchAll(/#shopify-section-template--[^{]+{\s*([^}]+)}/g)].map(m => m[1].trim());
console.log('\nRich text section variables sample:', richTextStyles.slice(0, 3));
