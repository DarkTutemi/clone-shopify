import fs from 'fs';

const html = fs.readFileSync('Clone-sakerplus/data/curl_funnel.html', 'utf8');

// Find all buttons and links
const ctaMatches = [...html.matchAll(/<a[^>]+href=["']([^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi)];
console.log('CTA Links found:');
for (const m of ctaMatches) {
  const text = m[2].replace(/<[^>]+>/g, '').trim();
  if (text.length > 0 && text.length < 100) {
    console.log(` - Text: "${text}" => href: "${m[1]}"`);
  }
}
