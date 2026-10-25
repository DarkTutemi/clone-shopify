import fs from 'fs';

const html = fs.readFileSync('Clone-sakerplus/data/curl_ultrasonic_funnel.html', 'utf-8');

const title = html.match(/<title[^>]*>([^<]+)<\/title>/i);
console.log('Title:', title ? title[1].trim() : 'N/A');

const h1s = [...html.matchAll(/<h1[^>]*>([\s\S]*?)<\/h1>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
console.log('H1 headers:', h1s);

const h2s = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
console.log('H2 headers:', h2s.slice(0, 8));

const prices = [...new Set(html.match(/\$\d+(\.\d{2})?/g) || [])];
console.log('Prices:', prices.slice(0, 10));

const imgs = [...html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)].map(m => m[1]);
console.log('Total images:', imgs.length);
console.log('Sample images:', imgs.slice(0, 5));

// Check for packages / quantity options (e.g. 1 kit, 2 kits, etc.)
const pkgMatches = html.match(/(1\s*pc|2\s*pcs?|3\s*pcs?|4\s*pcs?|pack|kit|cutter)/gi);
console.log('Keywords found:', [...new Set(pkgMatches || [])].slice(0, 10));
