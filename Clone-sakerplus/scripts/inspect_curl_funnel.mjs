import fs from 'fs';

const html = fs.readFileSync('Clone-sakerplus/data/curl_funnel.html', 'utf8');
console.log('HTML length:', html.length);

const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
console.log('Title:', titleMatch ? titleMatch[1] : 'N/A');

const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
console.log('H1:', h1Match ? h1Match[1].replace(/<[^>]+>/g, '').trim() : 'N/A');

// Search for product handles or checkouts
const links = [...html.matchAll(/href=["']([^"']+)["']/gi)].map(m => m[1]);
const relevantLinks = links.filter(l => l.includes('product') || l.includes('checkout') || l.includes('cart') || l.includes('saker'));
console.log('Relevant links in funnel:', [...new Set(relevantLinks)].slice(0, 15));

// Check if there are bundle packages, offers, pricing
const priceMatches = [...html.matchAll(/\$\d+(?:\.\d{2})?/g)].map(m => m[0]);
console.log('Prices found in page:', [...new Set(priceMatches)].slice(0, 15));

// Check sections / layout structure
const sections = [...html.matchAll(/class=["']([^"']*(?:section|container|funnel|offer|review|advertorial)[^"']*)["']/gi)].map(m => m[1]);
console.log('Classes found (sample):', [...new Set(sections)].slice(0, 10));
