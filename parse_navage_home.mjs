import fs from 'fs';

const html = fs.readFileSync('h:/Shopify-Clone/Clone-navage/data/navage_home_raw.html', 'utf8');

console.log('--- HEADINGS ON NAVAGE HOMEPAGE ---');
const headings = [...html.matchAll(/<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim()).filter(Boolean);
console.log(headings.slice(0, 25));

console.log('\n--- BUTTONS / LINKS ---');
const buttons = [...html.matchAll(/<(?:a|button)[^>]*class=["'][^"']*(?:btn|button)[^"']*["'][^>]*>([\s\S]*?)<\/(?:a|button)>/gi)]
  .map(m => m[1].replace(/<[^>]+>/g, '').trim())
  .filter(b => b.length > 0 && b.length < 50);
console.log([...new Set(buttons)].slice(0, 15));

console.log('\n--- KEY IMAGES & LOGOS ---');
const logos = [...html.matchAll(/src=["']([^"']*(?:logo|press|shark|gma|ent|badge)[^"']*)["']/gi)].map(m => m[1]);
console.log([...new Set(logos)]);
