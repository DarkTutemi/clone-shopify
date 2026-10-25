import fs from 'fs';

const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const THEME_ID = '186607567033';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || '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';

async function getAccessToken() {
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await res.json();
  return data.access_token;
}

async function getAllProducts(token) {
  let products = [];
  let sinceId = 0;
  while (true) {
    const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/products.json?limit=250&since_id=${sinceId}`, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    const data = await res.json();
    if (!data.products || data.products.length === 0) break;
    products = products.concat(data.products);
    sinceId = data.products[data.products.length - 1].id;
    if (data.products.length < 250) break;
  }
  return products;
}

async function updateProductTitle(token, id, newTitle) {
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/products/${id}.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      product: {
        id,
        title: newTitle
      }
    })
  });
  const data = await res.json();
  return res.ok;
}

async function run() {
  const token = await getAccessToken();
  console.log('--- Fetching all products from Shopify ---');
  const products = await getAllProducts(token);
  console.log(`Found ${products.length} products.`);

  const toUpdate = [];
  for (const p of products) {
    if (p.title.includes('Zavelyn®') || p.title.includes('®')) {
      const newTitle = p.title.replace(/Zavelyn®/g, 'Zavelyn').replace(/®/g, '').trim();
      toUpdate.push({ id: p.id, oldTitle: p.title, newTitle });
    }
  }

  console.log(`\nProducts to update title (${toUpdate.length}):`);
  toUpdate.forEach(item => {
    console.log(`  - [${item.id}] "${item.oldTitle}" -> "${item.newTitle}"`);
  });

  console.log('\n--- Updating product titles on Shopify ---');
  let successCount = 0;
  for (const item of toUpdate) {
    const ok = await updateProductTitle(token, item.id, item.newTitle);
    if (ok) {
      console.log(`✔ [${item.id}] Updated: "${item.newTitle}"`);
      successCount++;
    } else {
      console.error(`✗ [${item.id}] Failed to update`);
    }
    // Small delay to be polite to rate limits
    await new Promise(r => setTimeout(r, 120));
  }

  console.log(`\nSuccessfully updated ${successCount} / ${toUpdate.length} products.`);
}

run().catch(console.error);
