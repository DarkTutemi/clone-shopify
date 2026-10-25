import fs from 'fs';

async function scrapeLanding() {
  const res = await fetch('https://selenepets.com/products/fun-8-page-16-1', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  const html = await res.text();
  fs.writeFileSync('selenepets_page.html', html);
  console.log('Saved selenepets_page.html, size:', html.length);

  // Extract all img srcs
  const imgMatches = [...html.matchAll(/(?:https?:)?\/\/[^\s"'<>]+\.(?:jpg|jpeg|png|webp|gif)(?:\?[^"'<>\s]*)?/gi)].map(m => {
    let url = m[0];
    if (url.startsWith('//')) url = 'https:' + url;
    return url.replace(/&amp;/g, '&');
  });

  const shopifyImgs = [...new Set(imgMatches)].filter(s => s.includes('cdn/shop') || s.includes('files/') || s.includes('products/'));
  fs.writeFileSync('selenepets_found_images.json', JSON.stringify(shopifyImgs, null, 2));
  console.log('Unique shopify images:', shopifyImgs.length);

  const headings = [...html.matchAll(/<h[1-4][^>]*>(.*?)<\/h[1-4]>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim()).filter(Boolean);
  console.log('Headings found:', headings.slice(0, 15));
}

scrapeLanding().catch(console.error);
