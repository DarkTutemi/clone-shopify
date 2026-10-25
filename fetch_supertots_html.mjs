import fs from 'fs';

async function fetchHtml() {
  const res = await fetch('https://www.super-tots.com/products/supertots-food-pacifier', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  const html = await res.text();
  fs.writeFileSync('supertots_page.html', html);
  console.log('Saved supertots_page.html, size:', html.length);

  // Extract all img srcs
  const imgMatches = [...html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)].map(m => m[1]);
  console.log('Total img srcs found:', imgMatches.length);
  const shopifyImgs = imgMatches.filter(s => s.includes('cdn.shopify.com') || s.includes('.png') || s.includes('.jpg'));
  console.log('Shopify/Media images:', [...new Set(shopifyImgs)].slice(0, 20));
}

fetchHtml().catch(console.error);
