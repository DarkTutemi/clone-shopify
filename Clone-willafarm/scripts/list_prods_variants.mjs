const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || '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';

async function main() {
  const tRes = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const tData = await tRes.json();
  const token = tData.access_token;

  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/products.json?limit=10`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  data.products.forEach(p => {
    console.log(`Product "${p.title}":`, p.variants.map(v => `${v.title} ($${v.price})`).join(', '));
  });
}

main().catch(console.error);
