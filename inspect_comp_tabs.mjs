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
  const comp = await getAsset(token, 'sections/zhp-comparison.liquid');
  console.log('--- zhp-comparison.liquid ---');
  comp.split('\n').forEach((l, i) => {
    if (l.includes('Diameter') || l.includes('Size') || l.includes('dimension') || l.includes('pro') || l.includes('Pro') || l.includes('15') || l.includes('14') || l.includes('13')) {
      console.log(`L${i+1}: ${l.trim()}`);
    }
  });

  const tabs = await getAsset(token, 'sections/zhp-model-tabs.liquid');
  console.log('\n--- zhp-model-tabs.liquid ---');
  tabs.split('\n').forEach((l, i) => {
    if (l.includes('Diameter') || l.includes('Size') || l.includes('dimension') || l.includes('pro') || l.includes('Pro') || l.includes('15') || l.includes('14') || l.includes('13')) {
      console.log(`L${i+1}: ${l.trim()}`);
    }
  });
}

run().catch(console.error);
