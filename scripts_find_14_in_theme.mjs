import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP = 'dsdujr-vn.myshopify.com';
const THEME_ID = '186607567033';

async function getAccessToken() {
  const res = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  return (await res.json()).access_token;
}

async function getAsset(token, key) {
  const res = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${THEME_ID}/assets.json?asset[key]=${encodeURIComponent(key)}`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  return data.asset ? data.asset.value : null;
}

async function run() {
  const token = await getAccessToken();
  const keys = [
    'templates/product.zavelyn-drum-pro.json',
    'templates/collection.zavelyn-handpans.json',
    'sections/zhp-pdp-hero.liquid',
    'sections/zhp-pdp-specs.liquid',
    'sections/zhp-comparison.liquid',
    'sections/zhp-model-tabs.liquid',
    'sections/zhp-bestsellers.liquid'
  ];

  for (const k of keys) {
    const content = await getAsset(token, k);
    if (!content) {
      console.log(`Key ${k} not found`);
      continue;
    }
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      if (line.includes('14') || line.includes('35.5') || line.toLowerCase().includes('14 in') || line.toLowerCase().includes('14"')) {
        console.log(`[${k}:${idx + 1}] ${line.trim()}`);
      }
    });
  }
}

run().catch(console.error);
