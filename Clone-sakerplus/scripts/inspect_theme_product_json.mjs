import fs from 'fs';

const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const THEME_ID = '186607567033';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "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";

async function getAccessToken() {
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
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

async function main() {
  const token = await getAccessToken();
  const url = `https://${SHOP_DOMAIN}/admin/api/2024-10/themes/${THEME_ID}/assets.json?asset[key]=templates/product.json`;
  const res = await fetch(url, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  console.log('product.json asset status:', res.status);
  if (data.asset?.value) {
    const json = JSON.parse(data.asset.value);
    console.log('product.json sections:', Object.keys(json.sections || {}));
    console.log('product.json order:', json.order);
  } else {
    console.log('No product.json value found or error:', data);
  }
}

main();
