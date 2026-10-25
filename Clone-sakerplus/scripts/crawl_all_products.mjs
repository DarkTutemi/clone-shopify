import fs from 'fs';
import path from 'path';

const TARGET_URL = 'https://www.sakerplus.com';
const OUTPUT_FILE = 'Clone-sakerplus/data/catalog_harvested.json';

async function fetchWithRetry(url, retries = 3, delay = 1000) {
  for (let i = 1; i <= retries; i++) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      if (res.ok) return res;
    } catch (e) {
      if (i === retries) throw e;
      await new Promise(r => setTimeout(r, delay));
    }
  }
}

async function main() {
  console.log('Fetching all products from /products.json...');
  let products = [];
  let page = 1;
  while (true) {
    const url = `${TARGET_URL}/products.json?limit=250&page=${page}`;
    const res = await fetchWithRetry(url);
    if (!res || !res.ok) {
      console.log(`Page ${page} failed or finished.`);
      break;
    }
    const data = await res.json();
    if (!data.products || data.products.length === 0) {
      console.log(`Page ${page} returned 0 products.`);
      break;
    }
    products.push(...data.products);
    console.log(`  Page ${page}: +${data.products.length} (Total: ${products.length})`);
    if (data.products.length < 250) break;
    page++;
  }

  console.log(`Total products harvested from /products.json: ${products.length}`);
  
  // Clean & normalize products
  const normalized = products.map(p => ({
    id: p.id,
    title: p.title,
    handle: p.handle,
    body_html: p.body_html || '',
    vendor: p.vendor || 'Sakerplus',
    product_type: p.product_type || '',
    tags: Array.isArray(p.tags) ? p.tags : (p.tags ? p.tags.split(',').map(t => t.trim()) : []),
    variants: p.variants.map(v => ({
      id: v.id,
      title: v.title,
      price: v.price,
      compare_at_price: v.compare_at_price,
      sku: v.sku,
      position: v.position,
      option1: v.option1,
      option2: v.option2,
      option3: v.option3
    })),
    options: p.options || [],
    images: p.images ? p.images.map(img => typeof img === 'string' ? img : img.src) : []
  }));

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(normalized, null, 2));
  console.log(`Saved ${normalized.length} products to ${OUTPUT_FILE}`);
}

main();
