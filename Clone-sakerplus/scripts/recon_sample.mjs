import fs from 'fs';

async function inspectSample() {
  const pRes = await fetch('https://www.sakerplus.com/products.json?limit=2', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const pData = await pRes.json();
  const prod = pData.products[0];
  console.log('Sample product:', {
    id: prod.id,
    title: prod.title,
    handle: prod.handle,
    body_html_length: prod.body_html ? prod.body_html.length : 0,
    images: prod.images.length,
    variants: prod.variants.length,
    tags: prod.tags
  });

  // Check product page html for reviews / loox
  const pageRes = await fetch('https://www.sakerplus.com/products/' + prod.handle, {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const pageHtml = await pageRes.text();
  console.log('Product page HTML length:', pageHtml.length);
  
  // Look for loox or review elements
  const looxMatches = pageHtml.match(/loox[a-zA-Z0-9_\-\.\:\/]+/gi) || [];
  const uniqueLoox = [...new Set(looxMatches)].slice(0, 15);
  console.log('Loox references:', uniqueLoox);

  // Look for review data in script tags
  const jsonLdMatches = [...pageHtml.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  for (const m of jsonLdMatches) {
    try {
      const data = JSON.parse(m[1]);
      if (data.aggregateRating || data['@type'] === 'Product') {
        console.log('JSON-LD Product Rating:', data.aggregateRating);
      }
    } catch (e) {}
  }
}

inspectSample();
