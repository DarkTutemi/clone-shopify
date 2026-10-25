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

async function run() {
  const token = await getAccessToken();
  const listRes = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${THEME_ID}/assets.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const listData = await listRes.json();
  const zhpSections = listData.assets.filter(a => a.key.startsWith('sections/zhp-'));
  
  for (const s of zhpSections) {
    const aRes = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${THEME_ID}/assets.json?asset[key]=${encodeURIComponent(s.key)}`, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    const aData = await aRes.json();
    const val = aData.asset?.value || '';
    if (val.includes('14"') || val.includes("14'") || val.includes('14 in') || val.includes('14-in') || val.includes('35.5')) {
      console.log(`Matched in ${s.key}:`);
      val.split('\n').forEach((l, i) => {
        if (l.includes('14') || l.includes('35.5')) {
          console.log(`  L${i+1}: ${l.trim()}`);
        }
      });
    }
  }
}

run().catch(console.error);
