import fs from 'fs';

const html = fs.readFileSync('Clone-willafarm/data/willafarm_home_desktop.html', 'utf8');

// Font faces & font links
const fonts = [...html.matchAll(/@font-face\s*\{([^}]+)\}/gi)].map(m => m[1]);
console.log('Font faces count:', fonts.length);
fonts.slice(0, 5).forEach((f, i) => console.log(`Font ${i+1}:`, f.replace(/\s+/g, ' ')));

const fontLinks = [...html.matchAll(/<link[^>]+fonts[^>]+>/gi)].map(m => m[0]);
console.log('Font links:', fontLinks);

// CSS variables in :root
const rootMatches = [...html.matchAll(/:root\s*\{([^}]+)\}/gi)].map(m => m[1]);
console.log('Root blocks:', rootMatches.length);
if (rootMatches.length > 0) {
  const vars = rootMatches[0].split(';').map(v => v.trim()).filter(v => v.startsWith('--'));
  console.log('Sample root vars:', vars.slice(0, 20));
}

// Find colors
const colorMatches = [...html.matchAll(/#[0-9a-fA-F]{6}/g)].map(m => m[0].toLowerCase());
const colorCounts = {};
colorMatches.forEach(c => colorCounts[c] = (colorCounts[c] || 0) + 1);
const topColors = Object.entries(colorCounts).sort((a, b) => b[1] - a[1]).slice(0, 15);
console.log('Top colors:\n', topColors);

// Inspect Header markup
const headerMatch = html.match(/<header[^>]*>([\s\S]*?)<\/header>/i);
if (headerMatch) {
  console.log('Header length:', headerMatch[1].length);
  fs.writeFileSync('Clone-willafarm/data/willafarm_header.html', headerMatch[0]);
}

// Inspect Announcement bar
const annMatch = html.match(/class=["'][^"']*announcement[^"']*["'][^>]*>([\s\S]*?)<\/div>/i);
if (annMatch) {
  console.log('Announcement bar:', annMatch[0].slice(0, 300));
}

// Inspect Shopify section IDs and types
const sections = [...html.matchAll(/id=["']shopify-section-([^"']+)["']/g)].map(m => m[1]);
console.log('Shopify sections count:', sections.length);
console.log('Sections:\n', sections);
