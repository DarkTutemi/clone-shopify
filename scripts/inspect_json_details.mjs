import fs from 'fs';
import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const DRAFT_THEME_ID = '187597717689';

async function inspectMatches() {
  const token = await getAccessToken();
  const headers = { 'X-Shopify-Access-Token': token };

  const targets = [
    'config/settings_data.json',
    'templates/page.zavelyn-handpans.json',
    'templates/product.zavelyn-handpan-master.json',
    'templates/page.cdf.json',
    'templates/product.cdf.json'
  ];

  for (const key of targets) {
    const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${DRAFT_THEME_ID}/assets.json?asset[key]=${encodeURIComponent(key)}`, { headers });
    const data = await res.json();
    const val = data.asset?.value || '';
    console.log(`\n=== ${key} ===`);
    const lines = val.split('\n');
    lines.forEach((l, idx) => {
      if (/90[- ]day|60[- ]day|risk[- ]free/i.test(l)) {
        console.log(`Line ${idx + 1}: ${l.trim()}`);
      }
    });
  }
}
inspectMatches();
