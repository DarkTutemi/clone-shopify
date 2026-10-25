import fs from 'fs';

const html = fs.readFileSync('Clone-sakerplus/data/curl_funnel.html', 'utf8');

// Extract all text and image tags inside funnel-content-box or main
const contentMatch = html.match(/class=["'][^"']*funnel-content-box[^"']*["'][\s\S]*?(?=<footer|<div class=["'][^"']*footer)/i);
const content = contentMatch ? contentMatch[0] : html;

// Extract images
const images = [...content.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)].map(m => m[1]);
console.log('Images in advertorial count:', images.length);
console.log('Sample images:', images.slice(0, 10));

// Extract all paragraphs and headings
const textNodes = [...content.matchAll(/<(?:p|h1|h2|h3|h4|li|span|strong)[^>]*>([\s\S]*?)<\/(?:p|h1|h2|h3|h4|li|span|strong)>/gi)]
  .map(m => m[1].replace(/<[^>]+>/g, '').trim())
  .filter(t => t.length > 20 && !t.includes('{') && !t.includes('}'));

console.log('\nText paragraphs in advertorial count:', textNodes.length);
console.log('First 5 paragraphs:');
textNodes.slice(0, 5).forEach((t, i) => console.log(` ${i + 1}. ${t}`));
