import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';
import fs from 'fs';

const DRAFT_THEME_ID = '187926020281'; // ZAVELYN — IMMERSIVE SHOWROOM V4.0 — DRAFT (UNPUBLISHED)
const LIVE_THEME_ID = '187597717689'; // Zavelyn 2.0 (LIVE - MUST NOT MODIFY!)

async function uploadAsset(key, content, token) {
  const url = `https://${SHOP}/admin/api/${API_VERSION}/themes/${DRAFT_THEME_ID}/assets.json`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      asset: {
        key: key,
        value: content
      }
    })
  });

  const data = await res.json();
  if (data.asset) {
    console.log(`  ✓ Uploaded ${key} (${content.length} chars)`);
    return true;
  } else {
    console.error(`  ✗ Failed to upload ${key}:`, JSON.stringify(data));
    return false;
  }
}

async function main() {
  console.log(`======================================================`);
  console.log(`ZAVELYN V4.0 THEME DEPLOYMENT`);
  console.log(`Target: UNPUBLISHED DRAFT THEME ${DRAFT_THEME_ID}`);
  console.log(`Live Theme: ${LIVE_THEME_ID} (PROTECTED - NOT TOUCHED)`);
  console.log(`======================================================\n`);

  const token = await getAccessToken();

  // 1. Assets
  const assetsToUpload = [
    { key: 'assets/zavelyn-v4-tokens.css', path: 'assets/zavelyn-v4-tokens.css' },
    { key: 'assets/zavelyn-v4-stores.css', path: 'assets/zavelyn-v4-stores.css' },
    { key: 'assets/zavelyn-v4-showroom.css', path: 'assets/zavelyn-v4-showroom.css' },
    { key: 'assets/zavelyn-v4-pdp.css', path: 'assets/zavelyn-v4-pdp.css' },
    { key: 'assets/zavelyn-v4-showroom.js', path: 'assets/zavelyn-v4-showroom.js' },
    { key: 'assets/zavelyn-v4-pdp.js', path: 'assets/zavelyn-v4-pdp.js' }
  ];

  console.log('--- Uploading Assets ---');
  for (const item of assetsToUpload) {
    const content = fs.readFileSync(item.path, 'utf8');
    await uploadAsset(item.key, content, token);
  }

  // 2. Snippets
  const snippetsToUpload = [
    { key: 'snippets/zavelyn-v4-quickview.liquid', path: 'snippets/zavelyn-v4-quickview.liquid' }
  ];

  console.log('\n--- Uploading Snippets ---');
  for (const item of snippetsToUpload) {
    const content = fs.readFileSync(item.path, 'utf8');
    await uploadAsset(item.key, content, token);
  }

  // 3. Sections
  const sectionsToUpload = [
    { key: 'sections/zavelyn-v4-hero.liquid', path: 'sections/zavelyn-v4-hero.liquid' },
    { key: 'sections/zavelyn-v4-stores.liquid', path: 'sections/zavelyn-v4-stores.liquid' },
    { key: 'sections/zavelyn-v4-showroom.liquid', path: 'sections/zavelyn-v4-showroom.liquid' },
    { key: 'sections/zavelyn-v4-pdp-main.liquid', path: 'sections/zavelyn-v4-pdp-main.liquid' },
    { key: 'sections/zavelyn-v4-pdp-story.liquid', path: 'sections/zavelyn-v4-pdp-story.liquid' }
  ];

  console.log('\n--- Uploading Sections ---');
  for (const item of sectionsToUpload) {
    const content = fs.readFileSync(item.path, 'utf8');
    await uploadAsset(item.key, content, token);
  }

  // 4. Templates
  const templatesToUpload = [
    { key: 'templates/index.json', path: 'templates/index.v4.json' },
    { key: 'templates/collection.showroom.json', path: 'templates/collection.showroom.json' },
    { key: 'templates/collection.json', path: 'templates/collection.showroom.json' },
    { key: 'templates/product.showroom.json', path: 'templates/product.showroom.json' },
    { key: 'templates/product.json', path: 'templates/product.json' }
  ];

  console.log('\n--- Uploading Templates ---');
  for (const item of templatesToUpload) {
    const content = fs.readFileSync(item.path, 'utf8');
    await uploadAsset(item.key, content, token);
  }

  console.log(`\n======================================================`);
  console.log(`✅ DEPLOYMENT COMPLETE!`);
  console.log(`Preview URL: https://${SHOP}/?preview_theme_id=${DRAFT_THEME_ID}`);
  console.log(`======================================================`);
}

main().catch(console.error);
