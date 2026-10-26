import fs from 'fs';

const html = fs.readFileSync('kittycollective_full.html', 'utf-8');

// Find all sections or shopify-section blocks in HTML
const sectionRegex = /id=["'](shopify-section-[^"']+)["'][^>]*>([\s\S]*?)(?=<div[^>]*id=["']shopify-section-|<\/body|$)/gi;
let match;
let i = 1;
const lines = ['=== DETAILED SECTIONS ON KITTY COLLECTIVE ===\n'];
while ((match = sectionRegex.exec(html)) !== null) {
  const secId = match[1];
  const secContent = match[2];

  // Extract titles/headings
  const headings = [...secContent.matchAll(/<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/gi)]
    .map(m => m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim())
    .filter(Boolean);

  // Extract buttons/links
  const buttons = [...secContent.matchAll(/<(?:button|a)[^>]*class=["'][^"']*(?:button|btn|submit|cta)[^"']*["'][^>]*>([\s\S]*?)<\/(?:button|a)>/gi)]
    .map(m => m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim())
    .filter(Boolean);

  // Extract text snippets
  const paragraphs = [...secContent.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
    .map(m => m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim())
    .filter(t => t.length > 20)
    .slice(0, 3);

  lines.push(`--- [Section ${i++}] ${secId} ---`);
  if (headings.length) lines.push(`  Headings: ${headings.join(' | ')}`);
  if (buttons.length) lines.push(`  Buttons: ${buttons.slice(0, 3).join(' | ')}`);
  if (paragraphs.length) lines.push(`  Preview: ${paragraphs.join(' // ')}`);
  lines.push('');
}

fs.writeFileSync('scripts/kitty_sections_utf8.txt', lines.join('\n'), 'utf-8');
console.log('Saved to scripts/kitty_sections_utf8.txt');
