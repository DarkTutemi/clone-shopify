import fs from 'fs';

const html = fs.readFileSync('Clone-sakerplus/data/heating_lamp/curl_news.html', 'utf8');

console.log('HTML size:', html.length);

// Extract title
const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
console.log('Title:', titleMatch ? titleMatch[1] : 'None');

// Extract all link stylesheets
const linkRegex = /<link[^>]+rel=["']stylesheet["'][^>]*>/gi;
const cssLinks = html.match(linkRegex) || [];
console.log('CSS links count:', cssLinks.length);
cssLinks.forEach(l => console.log('Link:', l));

// Extract all inline style tags
const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
let match;
let count = 0;
let totalInline = 0;
while ((match = styleRegex.exec(html)) !== null) {
  count++;
  totalInline += match[1].length;
}
console.log(`Inline style tags: ${count}, total chars: ${totalInline}`);

// Check Nuxt layout / main container
const nuxtMatch = html.match(/<div id="__nuxt">([\s\S]*?)<\/div>\s*<script/i);
console.log('Nuxt div found:', !!nuxtMatch);
if (nuxtMatch) {
  console.log('Nuxt inner length:', nuxtMatch[1].length);
}

// Find CTA links or texts like "GET 50% OFF" or "landingpage"
const ctaRegex = /<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
let linkMatch;
const ctas = [];
while ((linkMatch = ctaRegex.exec(html)) !== null) {
  const href = linkMatch[1];
  const text = linkMatch[2].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');
  if (!ctas.some(c => c.href === href)) {
    ctas.push({ href, text });
  }
}
console.log('Found links:', JSON.stringify(ctas, null, 2));

// Check headline / h1
const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
console.log('H1:', h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : 'None');
