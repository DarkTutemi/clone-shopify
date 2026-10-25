import fs from 'fs';

const html = fs.readFileSync('Clone-yeoman/data/product_main_section.html', 'utf8');

// Extract all text blocks and headings
const headings = [...html.matchAll(/<(h[1-6])[^>]*>([\s\S]*?)<\/\1>/gi)].map(m => `${m[1]}: ${m[2].replace(/<[^>]+>/g, '').trim()}`);
console.log('Headings in main section:\n', headings);

// Find styles in this section
const styles = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(m => m[1]);
console.log('\nStyles count in main section:', styles.length);
console.log('Total style length:', styles.reduce((acc, s) => acc + s.length, 0));

// Find form or add to cart button
const formMatch = html.match(/<form[^>]+action=["'][^"']*\/cart\/add["'][\s\S]*?<\/form>/i);
console.log('\nAdd to cart form exists?', !!formMatch);

// Print first 2000 chars of main section (without style tags)
const textClean = html.replace(/<style[\s\S]*?<\/style>/gi, '').substring(0, 2500);
console.log('\nClean HTML snippet:\n', textClean);
