import fs from 'fs';

const html = fs.readFileSync('Clone-sakerplus/data/loox_sample.html', 'utf8');

// Find a single review card
const cardMatch = html.match(/<div[^>]*class=["'][^"']*grid-item[^"']*["'][\s\S]*?(?=<div[^>]*class=["'][^"']*grid-item[^"']*["']|$)/i);
if (cardMatch) {
  console.log('Single card snippet (first 1500 chars):\n', cardMatch[0].slice(0, 1500));
}
