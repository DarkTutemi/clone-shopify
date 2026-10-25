import fs from 'fs';

const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
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

const sleep = ms => new Promise(r => setTimeout(r, ms));

const TOP_COLLECTIONS = [
  { handle: 'home-improvement', title: 'Home Improvement' },
  { handle: 'best-sellers', title: 'Best Sellers' },
  { handle: 'garden-tools', title: 'Garden Tools' },
  { handle: 'power-tools', title: 'Power Tools' },
  { handle: 'hand-tools', title: 'Hand Tools' },
  { handle: 'woodworking-tools', title: 'Woodworking Tools' },
  { handle: 'outdoor-tools', title: 'Outdoor Tools' },
  { handle: 'all-products', title: 'All Products' },
  { handle: 'sale', title: 'Sale' },
  { handle: 'deals-of-the-day', title: 'Deals of the Day' }
];

async function main() {
  const token = await getAccessToken();
  console.log('Got access token.');

  // Fetch existing collections
  const existRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-01/custom_collections.json?limit=250`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const existData = await existRes.json();
  const existingHandles = new Map((existData.custom_collections || []).map(c => [c.handle, c.id]));

  for (const coll of TOP_COLLECTIONS) {
    let collId = existingHandles.get(coll.handle);
    if (!collId) {
      console.log(`Creating collection: ${coll.title} (${coll.handle})...`);
      const createRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-01/custom_collections.json`, {
        method: 'POST',
        headers: {
          'X-Shopify-Access-Token': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          custom_collection: {
            title: coll.title,
            handle: coll.handle,
            published: true
          }
        })
      });

      if (createRes.ok) {
        const createData = await createRes.json();
        collId = createData.custom_collection.id;
        console.log(`  ✔ Created collection ID: ${collId}`);
      } else {
        const err = await createRes.text();
        console.error(`  ✗ Error creating ${coll.handle}:`, err.slice(0, 150));
      }
      await sleep(600);
    } else {
      console.log(`Collection exists: ${coll.title} (ID: ${collId})`);
    }
  }

  // Link products to Best Sellers collection
  const bestSellersId = existingHandles.get('best-sellers') || (await (await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-01/custom_collections.json`, { headers: { 'X-Shopify-Access-Token': token } })).json()).custom_collections?.find(c => c.handle === 'best-sellers')?.id;
  
  if (bestSellersId) {
    console.log(`\nLinking seeded products to Best Sellers (ID: ${bestSellersId})...`);
    const prodsRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-01/products.json?limit=250`, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    const prodsData = await prodsRes.json();
    const prods = prodsData.products || [];

    for (const p of prods) {
      try {
        await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-01/collects.json`, {
          method: 'POST',
          headers: {
            'X-Shopify-Access-Token': token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            collect: {
              collection_id: bestSellersId,
              product_id: p.id
            }
          })
        });
      } catch (e) {}
      await sleep(250);
    }
    console.log(`✔ Linked ${prods.length} products to Best Sellers!`);
  }

  console.log('\nTop collections setup complete!');
}

main();
