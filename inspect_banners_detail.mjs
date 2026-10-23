// inspect_banners_detail.mjs
import fs from 'fs';

const pages = ['bestsellers', 'socks-and-insoles', 'barefoot-shoes-bogo-volume', 'winter-collection'];

async function run() {
  for (const p of pages) {
    const url = `https://trybronoir.com/collections/${p}`;
    const res = await fetch(url);
    const html = await res.text();
    console.log(`\n=================== ${p} ===================`);
    
    // Check for countdown / announcement
    const hasCountdown = html.includes('countdown') || html.includes('timer') || html.includes('buy 1 get 1');
    console.log('Has countdown / timer keyword:', hasCountdown);

    // Look for top section before product grid
    const firstSection = html.slice(0, html.indexOf('product-facet') > -1 ? html.indexOf('product-facet') : 10000);
    const imgMatches = firstSection.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi) || [];
    console.log('Images before product grid:');
    imgMatches.forEach(img => console.log('  ', img));

    // Also search for any background-image or banner class
    const bannerClasses = firstSection.match(/<[^>]+class=["'][^"']*(banner|hero|promo|featured)[^"']*["'][^>]*>/gi) || [];
    console.log('Banner/Hero classes:');
    bannerClasses.slice(0, 5).forEach(b => console.log('  ', b));
  }
}

run();
