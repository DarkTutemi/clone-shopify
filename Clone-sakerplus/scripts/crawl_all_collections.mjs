import fs from 'fs';
import path from 'path';

const COLLECTIONS_LIST_FILE = 'Clone-sakerplus/data/sitemap_collections.json';
const OUTPUT_FILE = 'Clone-sakerplus/data/collections_harvested.json';

async function fetchWithRetry(url, retries = 3, delay = 800) {
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

async function processCollection(collUrl) {
  const handle = collUrl.split('/collections/')[1].replace(/\/$/, '');
  try {
    const pUrl = `https://www.sakerplus.com/collections/${handle}/products.json?limit=250`;
    const pRes = await fetchWithRetry(pUrl);
    let productHandles = [];
    if (pRes && pRes.ok) {
      const pData = await pRes.json();
      productHandles = pData.products ? pData.products.map(p => p.handle) : [];
    }

    const title = handle
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    return {
      url: collUrl,
      handle: handle,
      title: title,
      productCount: productHandles.length,
      productHandles: productHandles
    };
  } catch (e) {
    return {
      url: collUrl,
      handle: handle,
      title: handle,
      productCount: 0,
      productHandles: []
    };
  }
}

async function main() {
  const collectionUrls = JSON.parse(fs.readFileSync(COLLECTIONS_LIST_FILE, 'utf8'));
  console.log(`Starting concurrent harvest for ${collectionUrls.length} collections...`);
  
  const harvested = [];
  const CONCURRENCY = 8;
  
  for (let i = 0; i < collectionUrls.length; i += CONCURRENCY) {
    const chunk = collectionUrls.slice(i, i + CONCURRENCY);
    const results = await Promise.all(chunk.map(processCollection));
    harvested.push(...results);
    console.log(`  Processed ${harvested.length}/${collectionUrls.length} collections...`);
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(harvested, null, 2));
  console.log(`\nHarvested all ${harvested.length} collections into ${OUTPUT_FILE}`);
}

main();
