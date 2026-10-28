import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "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";
const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';

async function getAccessToken() {
  const tokenRes = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials'
    })
  });
  const data = await tokenRes.json();
  return data.access_token;
}

async function main() {
  const token = await getAccessToken();

  // Search all products containing botana
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2026-01/products.json?limit=250`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  const botanaProds = data.products.filter(p => p.title.toLowerCase().includes('botana') || p.handle.toLowerCase().includes('botana'));
  console.log(`Found ${botanaProds.length} botana products:`);
  botanaProds.forEach(p => {
    console.log(`\nProduct ID: ${p.id} | Title: "${p.title}" | Handle: "${p.handle}" | Status: ${p.status}`);
    console.log('Options:', JSON.stringify(p.options));
    console.log('Variants:');
    p.variants.forEach(v => {
      console.log(` - ID: ${v.id} | Title: "${v.title}" | Price: $${v.price} | Compare: $${v.compare_at_price} | SKU: ${v.sku}`);
    });
  });
}

main().catch(console.error);
