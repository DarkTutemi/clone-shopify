import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP = 'dsdujr-vn.myshopify.com';
const DRAFT_THEME_ID = '187597717689';

async function getAccessToken() {
  const tRes = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await tRes.json();
  return data.access_token;
}

async function fetchAsset(token, key) {
  const res = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${DRAFT_THEME_ID}/assets.json?asset[key]=${encodeURIComponent(key)}`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.asset?.value || null;
}

async function run() {
  const token = await getAccessToken();
  const keys = [
    'sections/srefalsteam-funnel.liquid',
    'sections/thoson-magtrack-funnel.liquid',
    'sections/yeoman-sweep-funnel.liquid',
    'sections/heating-lamp-funnel.liquid',
    'sections/zhp-pdp-hero.liquid',
    'sections/offer-balm.liquid',
    'sections/offer-cdf.liquid',
    'sections/offer-device.liquid',
    'sections/offer-zavelyn.liquid',
    'sections/offer-landing.liquid'
  ];

  for (const k of keys) {
    const val = await fetchAsset(token, k);
    console.log(`\n=== ${k} ===`);
    if (val) {
      console.log(`Size: ${val.length} bytes`);
      // Check if it has a buy box / form
      console.log('Has <form:', val.includes('<form'));
      console.log('Has /cart/add:', val.includes('/cart/add'));
      console.log('Includes snippets:', val.match(/\{%\s*(?:render|include)\s+['"][^'"]+['"]/g));
    } else {
      console.log('NOT FOUND in theme');
    }
  }
}

run();
