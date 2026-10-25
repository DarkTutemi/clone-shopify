import fs from 'fs';

const html1 = fs.readFileSync('Clone-sakerplus/data/curl_funnel.html', 'utf8');
const html2 = fs.readFileSync('Clone-sakerplus/data/curl_landing_step2.html', 'utf8');

console.log('=== Step 1: News Advertorial ===');
const title1 = html1.match(/class=["'][^"']*news-title[^"']*["'][^>]*>([\s\S]*?)<\/(?:div|h1|h2|p)>/i);
console.log('Headline:', title1 ? title1[1].replace(/<[^>]+>/g, '').trim() : 'N/A');

console.log('\n=== Step 2: Offer Landing Page ===');
const title2 = html2.match(/<title>([^<]+)<\/title>/i);
console.log('Title:', title2 ? title2[1] : 'N/A');

const offers = [...html2.matchAll(/class=["'][^"']*(?:bundle|package|variant|price|tier|discount)[^"']*["']/gi)];
console.log('Offer/Package classes in step 2:', offers.length);

const links2 = [...html2.matchAll(/href=["']([^"']+)["']/gi)].map(m => m[1]);
console.log('Links in step 2 (sample):', [...new Set(links2)].slice(0, 10));
