const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP = 'dsdujr-vn.myshopify.com';

async function check() {
  const tRes = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const token = (await tRes.json()).access_token;
  const prodRes = await fetch(`https://${SHOP}/admin/api/2024-10/products.json?limit=50`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const { products } = await prodRes.json();
  for (const p of products) {
    if (p.body_html) {
      const ext = p.body_html.match(/src=["'](https?:\/\/(?!cdn\.shopify\.com)[^"']+)["']/g);
      if (ext) {
        console.log(`- ${p.title} (${p.handle}): ${ext.length} external images`);
      }
    }
  }
}
check().catch(console.error);
