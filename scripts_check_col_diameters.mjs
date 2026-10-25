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
  const colJson = JSON.parse(await getAsset(token, 'templates/collection.zavelyn-handpans.json'));
  console.log('Sections in collection:', Object.keys(colJson.sections));
  
  // Check comparison and tabs
  for (const [secKey, sec] of Object.entries(colJson.sections)) {
    const str = JSON.stringify(sec);
    if (str.includes('diameter') || str.includes('Diameter') || str.includes('Inch') || str.includes('inch')) {
      console.log(`Section "${secKey}" (type: ${sec.type}) mentions diameter/inch`);
      // Find matching keys
      for (const [k, v] of Object.entries(sec.settings || {})) {
        if (typeof v === 'string' && (v.includes('inch') || v.includes('Inch') || v.includes('14') || v.includes('13'))) {
          console.log(`  ${k}: ${v}`);
        }
      }
      for (const [bk, bv] of Object.entries(sec.blocks || {})) {
        for (const [k, v] of Object.entries(bv.settings || {})) {
          if (typeof v === 'string' && (v.includes('inch') || v.includes('Inch') || v.includes('14') || v.includes('13'))) {
            console.log(`  block ${bk}.${k}: ${v}`);
          }
        }
      }
    }
  }
}

run().catch(console.error);
