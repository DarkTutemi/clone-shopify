import fs from 'fs';

const html = fs.readFileSync('Clone-pandadrum/collection_page.html', 'utf8');

const imgRegex = /https:\/\/cdn\.shopify\.com\/s\/files\/[^"'\s\)]+/gi;
const matches = [...new Set(html.match(imgRegex) || [])];

console.log(`Found ${matches.length} unique CDN URLs:`);
matches.slice(0, 30).forEach(u => console.log(u));
fs.writeFileSync('Clone-pandadrum/all_cdn_urls.json', JSON.stringify(matches, null, 2), 'utf8');
