import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import fs from 'fs';

const content = fs.readFileSync('sections/zavelyn-pdp-main.liquid', 'utf8');
const lines = content.split('\n');

console.log('--- GALLERY SECTION (lines 400-500) ---');
console.log(lines.slice(400, 500).join('\n'));
