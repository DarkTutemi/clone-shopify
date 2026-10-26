import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP = 'dsdujr-vn.myshopify.com';

async function getAccessToken() {
  const tRes = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await tRes.json();
  return data.access_token;
}

async function getAllProducts() {
  const token = await getAccessToken();
  let products = [];
  let sinceId = 0;
  while (true) {
    const res = await fetch(`https://${SHOP}/admin/api/2024-10/products.json?limit=250&since_id=${sinceId}`, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    const data = await res.json();
    if (!data.products || data.products.length === 0) break;
    products.push(...data.products);
    sinceId = data.products[data.products.length - 1].id;
  }
  return { token, products };
}

async function main() {
  const { products } = await getAllProducts();
  console.log(`Fetched ${products.length} products.`);
  
  const productList = products.map(p => ({
    id: p.id,
    handle: p.handle,
    title: p.title
  }));

  fs.writeFileSync('scripts/products_list.json', JSON.stringify(productList, null, 2));
  console.log('Saved to scripts/products_list.json');
}

main();
