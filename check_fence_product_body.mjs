import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP = 'dsdujr-vn.myshopify.com';
const PRODUCT_ID = '15454946951353';

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
  const res = await fetch(`https://${SHOP}/admin/api/2024-10/products/${PRODUCT_ID}.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  const p = data.product;
  fs.writeFileSync('live_fence_post_product.json', JSON.stringify(p, null, 2));
  fs.writeFileSync('live_fence_post_body.html', p.body_html || '');
  console.log('Saved live_fence_post_body.html, length:', p.body_html?.length);

  // Check if body has any GIFs currently
  const gifs = p.body_html?.match(/https?:\/\/[^"'\s]+\.gif(?:\?[^"'\s]*)?/gi) || [];
  console.log(`Current GIFs in product body on Shopify (${gifs.length}):`, gifs);
}

run().catch(console.error);
