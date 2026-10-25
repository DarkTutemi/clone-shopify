import fs from 'fs';

const html = fs.readFileSync('Clone-sakerplus/data/loox_sample.html', 'utf8');

// Find grid items or review cards
const cardMatches = [...html.matchAll(/<div[^>]*class=["'][^"']*grid-item[^"']*["'][\s\S]*?<\/div>\s*<\/div>\s*<\/div>/gi)];
console.log('Grid items found:', cardMatches.length);

// Extract author, rating, body, date, product info
const authorMatches = [...html.matchAll(/class=["']block author[^"']*["'][^>]*>([^<]+)<\/div>/gi)];
console.log('Authors found:', authorMatches.map(m => m[1].trim()).slice(0, 10));

const titleMatches = [...html.matchAll(/class=["'][^"']*title[^"']*["'][^>]*>([^<]+)<\/div>/gi)];
console.log('Review titles found:', titleMatches.map(m => m[1].trim()).slice(0, 5));

const bodyMatches = [...html.matchAll(/class=["'][^"']*main-text[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi)];
console.log('Review bodies found:', bodyMatches.map(m => m[1].trim()).slice(0, 5));

// Check total review count from header
const headerMatch = html.match(/class=["'][^"']*reviews-count[^"']*["'][^>]*>([^<]+)<\/span>/i) || html.match(/(\d+[\d,]*)\s*reviews/i);
console.log('Total review count text:', headerMatch ? headerMatch[0] : null);
