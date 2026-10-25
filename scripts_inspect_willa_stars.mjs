import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP = 'dsdujr-vn.myshopify.com';
const THEME_ID = '186607567033';

async function getAccessToken() {
  const res = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials'
    })
  });
  const data = await res.json();
  return data.access_token;
}

async function run() {
  const token = await getAccessToken();

  const files = [
    'sections/willa-featured-product.liquid',
    'sections/willa-footer.liquid',
    'sections/willa-header.liquid',
    'sections/willa-hero.liquid',
    'sections/willa-reviews.liquid',
    'sections/header-group.json'
  ];

  for (const f of files) {
    const res = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${THEME_ID}/assets.json?asset[key]=${f}`, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    const d = await res.json();
    if (!d.asset) continue;
    console.log(`\n=== ${f} ===`);
    const lines = d.asset.value.split('\n');
    lines.forEach((l, i) => {
      if (l.includes('★') || l.includes('star') || l.includes('rating')) {
        console.log(`[${i+1}] ${l.trim()}`);
      }
    });
  }
}

run().catch(console.error);
