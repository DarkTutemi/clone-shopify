import fs from 'fs';
import path from 'path';

const TARGET_URL = 'https://earthlyderm.com';
const OUTPUT_DIR = 'h:/Shopify-Clone/Clone-earthlyderm/data';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function fetchJSON(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return await res.json();
}

async function fetchText(url) {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return await res.text();
}

async function main() {
  console.log('--- RECON EARTHLYDERM ---');
  // 1. Products
  const prodData = await fetchJSON(`${TARGET_URL}/products.json?limit=250`);
  console.log(`Discovered ${prodData.products?.length || 0} products in /products.json`);
  fs.writeFileSync(path.join(OUTPUT_DIR, 'raw_products.json'), JSON.stringify(prodData, null, 2));

  // 2. Collections
  const colData = await fetchJSON(`${TARGET_URL}/collections.json?limit=250`);
  console.log(`Discovered ${colData.collections?.length || 0} collections in /collections.json`);
  fs.writeFileSync(path.join(OUTPUT_DIR, 'raw_collections.json'), JSON.stringify(colData, null, 2));

  // 3. Inspect target pages
  const pages = [
    'https://earthlyderm.com/',
    'https://earthlyderm.com/pages/our-story',
    'https://earthlyderm.com/pages/customer-reviews',
    'https://earthlyderm.com/pages/contact',
    'https://earthlyderm.com/collections/earthly-derm',
    'https://earthlyderm.com/products/turmeric-glow-soap',
    'https://earthlyderm.com/products/african-black-soap',
    'https://earthlyderm.com/policies/refund-policy',
    'https://earthlyderm.com/policies/shipping-policy',
    'https://earthlyderm.com/policies/terms-of-service',
    'https://earthlyderm.com/policies/privacy-policy'
  ];

  const harvestedPages = {};
  for (const p of pages) {
    try {
      console.log(`Fetching HTML for ${p}...`);
      const html = await fetchText(p);
      const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
      harvestedPages[p] = {
        title: titleMatch ? titleMatch[1].trim() : '',
        length: html.length,
        hasJudgeMe: html.includes('jdgm') || html.includes('judge.me'),
        hasLoox: html.includes('loox'),
        hasYotpo: html.includes('yotpo'),
        hasStamped: html.includes('stamped')
      };
      // save html sample for key pages
      const safeName = p.replace(/https?:\/\/earthlyderm\.com\/?/, '').replace(/\//g, '_') || 'homepage';
      fs.writeFileSync(path.join(OUTPUT_DIR, `${safeName}.html`), html);
    } catch (e) {
      console.error(`Failed to fetch ${p}:`, e.message);
    }
  }

  fs.writeFileSync(path.join(OUTPUT_DIR, 'pages_summary.json'), JSON.stringify(harvestedPages, null, 2));
  console.log('✔ Phase 2 initial recon complete.');
}

main().catch(console.error);
