import fs from 'fs';

const html = fs.readFileSync('ali_page.html', 'utf8');
const apis = html.match(/https?:\/\/[^"'\s]+(?:mtop|api|detail|gateway)[^"'\s]*/gi) || [];
console.log('Found APIs:', apis);

// Check itemId in html
const itemMatches = html.match(/"itemId":"?(\d+)"?/g);
console.log('Item matches:', itemMatches);

// Check any product data
const matches = html.match(/"[^"]*title[^"]*":\s*"[^"]+"/gi);
console.log('Title matches:', matches?.slice(0, 10));
