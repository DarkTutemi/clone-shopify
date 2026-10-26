// Using native fetch in Node 22

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP = 'dsdujr-vn.myshopify.com';

async function main() {
  const tRes = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await tRes.json();
  const token = data.access_token;

  const res = await fetch(`https://${SHOP}/admin/api/2024-10/products.json?limit=30&fields=id,title,handle,image,images`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const pData = await res.json();
  for (const p of pData.products) {
    if (p.image) {
      console.log(`[${p.handle}]: ${p.title} -> ${p.image.src}`);
    }
  }
}

main();
