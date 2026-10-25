import fs from 'fs';

const html = fs.readFileSync('Clone-navage/data/sinusitis_page.html', 'utf8');
console.log('HTML Total length:', html.length);

const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
console.log('Title:', titleMatch ? titleMatch[1] : 'N/A');

// Extract all stylesheets
const cssLinks = [...html.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["']/gi)].map(m => m[1]);
console.log('CSS links count:', cssLinks.length);
console.log('CSS links:', cssLinks.slice(0, 5));

// Check main container
const mainMatch = html.match(/<main[\s\S]*?<\/main>/i);
console.log('Main element exists?', !!mainMatch, mainMatch ? mainMatch[0].length : 0);

// Check if there are template sections or zipify or pagefly or custom theme sections
const sections = [...html.matchAll(/class=["']([^"']*(?:shopify-section|section|banner|offer|bundle)[^"']*)["']/gi)].map(m => m[1]);
console.log('Found notable section classes (sample):', [...new Set(sections)].slice(0, 15));

// Check products links
const productLinks = [...html.matchAll(/href=["']([^"']*(?:products|cart|checkout)[^"']*)["']/gi)].map(m => m[1]);
console.log('Product/Cart links found:', [...new Set(productLinks)]);

// Extract inline styles
const styleMatches = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(m => m[1]);
console.log('Inline style tags count:', styleMatches.length);
console.log('Total inline style length:', styleMatches.reduce((acc, s) => acc + s.length, 0));
