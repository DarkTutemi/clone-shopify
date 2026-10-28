import fs from 'fs';

const html = fs.readFileSync('scripts/prod1_storefront_response.html', 'utf8');

const tm = html.match(/<title>([^<]+)<\/title>/i);
console.log('Rendered <title>:', tm ? tm[1].trim() : 'null');

const mm = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
console.log('Rendered <meta name="description">:', mm ? mm[1].trim() : 'null');

const cm = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);
console.log('Rendered <link rel="canonical">:', cm ? cm[1].trim() : 'null');
