import fs from 'fs';

const html = fs.readFileSync('Clone-sakerplus/data/curl_landing_step2.html', 'utf8');

// Find form, buy buttons, packages, prices
const forms = [...html.matchAll(/<form[\s\S]*?<\/form>/gi)];
console.log('Forms count:', forms.length);

const buttons = [...html.matchAll(/<(?:button|a)[^>]*>([\s\S]*?)<\/(?:button|a)>/gi)]
  .map(m => m[1].replace(/<[^>]+>/g, '').trim())
  .filter(t => t.length > 3 && t.length < 50 && (t.toLowerCase().includes('get') || t.toLowerCase().includes('buy') || t.toLowerCase().includes('order') || t.toLowerCase().includes('add') || t.toLowerCase().includes('claim')));

console.log('Action buttons in landing step 2:', [...new Set(buttons)]);

// Look for package titles
const packages = [...html.matchAll(/class=["'][^"']*(?:title|package|bundle|item-name)[^"']*["'][^>]*>([\s\S]*?)<\/[a-z0-9]+>/gi)]
  .map(m => m[1].replace(/<[^>]+>/g, '').trim())
  .filter(t => t.toLowerCase().includes('pc') || t.toLowerCase().includes('fence') || t.toLowerCase().includes('kit'));

console.log('Package titles found:', [...new Set(packages)]);
