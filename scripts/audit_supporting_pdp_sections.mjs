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
  return data.asset.value;
}

async function main() {
  const token = await getAccessToken();

  const sectionsToInspect = [
    'sections/willa-reviews.liquid',
    'sections/willa-faq.liquid',
    'sections/willa-comparison.liquid',
    'sections/willa-facts.liquid',
    'sections/willa-steps.liquid',
    'snippets/trustpilot-stars.liquid'
  ];

  for (const s of sectionsToInspect) {
    const val = await fetchAsset(token, s);
    if (val) {
      console.log(`\n=== ${s} (${val.length} bytes) ===`);
      console.log(val.substring(0, 400));
    } else {
      console.log(`\n=== ${s} NOT FOUND ===`);
    }
  }
}

main().catch(console.error);
