import fs from 'fs';

const html = fs.readFileSync('Clone-navage/data/sinusitis_page.html', 'utf8');

// Extract all img srcs
const imgs = [...html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)].map(m => m[1]);
console.log('Total images found in page:', imgs.length);

// Distinct image domains
const domains = [...new Set(imgs.map(u => {
  try {
    return new URL(u.startsWith('//') ? 'https:' + u : u).hostname;
  } catch {
    return 'relative';
  }
}))];
console.log('Image domains:', domains);

// Extract all links
const links = [...html.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)].map(m => ({
  href: m[1],
  text: m[2].replace(/<[^>]+>/g, '').trim()
}));

const orderLinks = links.filter(l => 
  l.href.includes('navage') || 
  l.href.includes('product') || 
  l.href.includes('cart') || 
  l.href.includes('order') ||
  l.text.toLowerCase().includes('order') ||
  l.text.toLowerCase().includes('buy') ||
  l.text.toLowerCase().includes('shop') ||
  l.text.toLowerCase().includes('get')
);

console.log('\nAll CTA / Purchase Links in Sinusitis Landing Page:');
orderLinks.forEach((l, idx) => {
  console.log(`  ${idx + 1}. [${l.text}] -> ${l.href}`);
});
