import fs from 'fs';

async function inspectCollection(handle) {
  const url = `https://www.sakerplus.com/collections/${handle}`;
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const html = await res.text();
  console.log(`\n=== Collection: ${handle} (HTML: ${html.length} bytes) ===`);
  
  // Extract Title
  const titleMatch = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  console.log('Title:', titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : 'N/A');

  // Check for collection banner / image
  const bannerMatches = [...html.matchAll(/<img[^>]+class=["'][^"']*(?:banner|collection|hero)[^"']*["'][^>]*>/gi)];
  console.log('Banner images found:', bannerMatches.length);
  if (bannerMatches.length > 0) {
    console.log('  Banner sample:', bannerMatches[0][0].slice(0, 200));
  }

  // Check for countdown / timer
  const hasCountdown = html.toLowerCase().includes('countdown') || html.toLowerCase().includes('timer') || html.toLowerCase().includes('ends in');
  console.log('Has countdown/timer:', hasCountdown);

  // Check for subcategory bubbles / tabs / filters
  const hasSubcategories = html.includes('subcollection') || html.includes('category-bubble') || html.includes('collection-list');
  console.log('Has subcategories/bubbles:', hasSubcategories);

  // Product cards count on page 1
  const productCards = [...html.matchAll(/href=["']\/products\/([^"'\?]+)/gi)];
  const uniqueProducts = [...new Set(productCards.map(m => m[1]))];
  console.log('Unique products on page 1:', uniqueProducts.length);
  console.log('Sample product handles:', uniqueProducts.slice(0, 5));
}

async function main() {
  await inspectCollection('home-improvement');
  await inspectCollection('garden-tools');
  await inspectCollection('best-sellers');
}

main();
