import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';

async function getAccessToken() {
  const tokenRes = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await tokenRes.json();
  return data.access_token;
}

async function main() {
  const token = await getAccessToken();
  console.log('Got access token.');

  let products = [];
  let url = `https://${SHOP_DOMAIN}/admin/api/2024-10/products.json?limit=250`;
  while (url) {
    const res = await fetch(url, { headers: { 'X-Shopify-Access-Token': token } });
    const data = await res.json();
    products = products.concat(data.products || []);
    const linkHeader = res.headers.get('link');
    if (linkHeader && linkHeader.includes('rel="next"')) {
      const match = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
      url = match ? match[1] : null;
    } else {
      url = null;
    }
  }

  console.log(`Fetched ${products.length} products from Shopify.`);

  const needsUpdate = [];
  for (const p of products) {
    for (const v of p.variants) {
      if (v.inventory_policy !== 'continue') {
        needsUpdate.push({ productId: p.id, productTitle: p.title, variantId: v.id, variantTitle: v.title, current: v.inventory_policy });
      }
    }
  }

  console.log(`Total variants needing update to continue selling: ${needsUpdate.length}`);
  if (needsUpdate.length > 0) {
    console.log('Sample needing update:', needsUpdate.slice(0, 5));
  }
}

main().catch(console.error);
