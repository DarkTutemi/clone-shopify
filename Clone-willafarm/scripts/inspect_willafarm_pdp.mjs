import fs from 'fs';

const html = fs.readFileSync('Clone-willafarm/data/willafarm_pdp_mobile.html', 'utf8');
console.log('PDP HTML size:', html.length);

// Extract all shopify sections on PDP
const sections = [...html.matchAll(/id=["']shopify-section-([^"']+)["']/g)].map(m => m[1]);
console.log('PDP Sections:\n', sections);

// Search for sticky bar or ATC
const stickyMatches = [...html.matchAll(/class=["'][^"']*(?:sticky|floating|fixed|drawer)[^"']*["']/gi)].map(m => m[0]);
console.log('Sticky/Floating classes on PDP:', [...new Set(stickyMatches)].slice(0, 15));

// Check bundle selector on Willa Farm PDP
const bundleMatches = [...html.matchAll(/class=["'][^"']*(?:bundle|tier|variant|purchase|offer)[^"']*["']/gi)].map(m => m[0]);
console.log('Bundle/Variant classes on PDP:', [...new Set(bundleMatches)].slice(0, 15));
