// inspect_4_collections.mjs
// Crawls the 4 collections on trybronoir.com and extracts:
// 1. Banner image URLs (desktop & mobile)
// 2. Titles & handles of all products in that collection
// 3. Countdown or header features

import fs from 'fs';

const COLLECTIONS = [
  'winter-collection',
  'socks-and-insoles',
  'barefoot-shoes-bogo-volume',
  'bestsellers'
];

async function inspectCollection(handle) {
  const url = `https://trybronoir.com/collections/${handle}`;
  console.log(`\n========================================`);
  console.log(`Fetching ${url}...`);
  const res = await fetch(url);
  const html = await res.text();
  
  // Find banners
  const bannerMatches = html.match(/(\/\/[^\s\"\'\<\>]+\.(jpg|png|webp))/gi) || [];
  const banners = [...new Set(bannerMatches.filter(u => u.includes('banner') || u.includes('usp') || u.includes('hero') || u.includes('slide') || u.includes('nye')))];
  
  // Find product handles / links
  const prodMatches = html.match(/\/products\/[a-zA-Z0-9%\-_]+/g) || [];
  const cleanHandles = [...new Set(prodMatches.map(p => decodeURIComponent(p.replace('/products/', ''))))];
  
  // Find titles from html
  const titles = [];
  const regex = /<a[^>]*class="[^"]*product-item__title[^"]*"[^>]*>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const t = match[1].replace(/<[^>]*>/g, '').trim();
    if (t) titles.push(t);
  }

  return {
    handle,
    banners,
    productCount: cleanHandles.length,
    handles: cleanHandles,
    sampleTitles: titles.slice(0, 10)
  };
}

async function run() {
  const results = {};
  for (const h of COLLECTIONS) {
    results[h] = await inspectCollection(h);
    console.log(`[${h}] Found ${results[h].productCount} products, Banners:`, results[h].banners);
  }
  fs.writeFileSync('collections_inspection_result.json', JSON.stringify(results, null, 2));
  console.log('\nSaved report to collections_inspection_result.json');
}

run();
