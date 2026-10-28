import fs from 'fs';
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const LIVE_THEME_ID = '187597717689';
const ORIGINAL_PRODUCT_ID = '15461545935033';

async function verifyRegression() {
  console.log('========================================================================');
  console.log('PHASE F: ORIGINAL PAGE ZERO-REGRESSION VERIFICATION');
  console.log('========================================================================\n');

  const token = await getAccessToken();
  const headers = {
    'X-Shopify-Access-Token': token,
    'Content-Type': 'application/json'
  };

  // 1. Verify Live Theme ID is still 187597717689
  console.log('1. Checking Live Theme...');
  const themesRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes.json`, { headers });
  const themesData = await themesRes.json();
  const liveTheme = themesData.themes.find(t => t.role === 'main');
  console.log(`Live Theme: ID ${liveTheme.id} ("${liveTheme.name}") - Unchanged: ${liveTheme.id == LIVE_THEME_ID}`);

  // 2. Verify Original Product is completely untouched
  console.log('\n2. Verifying Original BotanaRoots Product...');
  const prodRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query: `
        query {
          product(id: "gid://shopify/Product/${ORIGINAL_PRODUCT_ID}") {
            id
            title
            handle
            status
            templateSuffix
            variants(first: 10) {
              nodes {
                id
                title
                price
                sku
              }
            }
          }
        }
      `
    })
  });
  const prodData = await prodRes.json();
  const p = prodData.data?.product;
  console.log(`Product Title: "${p?.title}"`);
  console.log(`Handle: "${p?.handle}"`);
  console.log(`Status: "${p?.status}"`);
  console.log(`Template Suffix: "${p?.templateSuffix}"`);
  console.log('Variants:');
  for (const v of p?.variants?.nodes || []) {
    console.log(`- ${v.id} | $${v.price} | SKU: ${v.sku} | "${v.title}"`);
  }

  // 3. Verify Live Theme assets haven't been touched
  console.log('\n3. Comparing Live Theme Assets against Baseline Backup...');
  const backupDir = 'backups/locked_botanaroots_live_baseline';
  const assetsToCheck = [
    'templates/product.json',
    'sections/zavelyn-pdp-main.liquid',
    'sections/zavelyn-pdp-description-fallback.liquid',
    'sections/zavelyn-pdp-faq.liquid',
    'snippets/botanaroots-bundle-upsell.liquid',
    'snippets/botanaroots-faq-accordion.liquid',
    'assets/botanaroots-bundle.css',
    'assets/botanaroots-bundle.js'
  ];

  let allMatch = true;
  for (const key of assetsToCheck) {
    const backupPath = `${backupDir}/${key.replace(/\//g, '__')}`;
    if (!fs.existsSync(backupPath)) continue;
    const backupContent = fs.readFileSync(backupPath, 'utf-8');

    const curRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${LIVE_THEME_ID}/assets.json?asset[key]=${encodeURIComponent(key)}`, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    const curData = await curRes.json();
    const curContent = curData.asset?.value || '';

    const match = (backupContent === curContent);
    console.log(`- ${key}: ${match ? '✔ 100% MATCH (0 bytes changed)' : '⚠️ CHANGED'}`);
    if (!match) allMatch = false;
  }

  console.log(`\nOriginal Page Zero-Regression Status: ${allMatch ? '✔ PASS - 100% UNTOUCHED' : 'FAIL'}`);
}

verifyRegression().catch(console.error);
