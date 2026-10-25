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

async function main() {
  const token = await getAccessToken();
  console.log('Got access token.');

  // Fetch existing collections
  const existRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-01/custom_collections.json?limit=250`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const existData = await existRes.json();
  const existingHandles = new Map((existData.custom_collections || []).map(c => [c.handle, c.id]));
  console.log(`Currently ${existingHandles.size} custom collections in store.`);

  const collections = JSON.parse(fs.readFileSync('Clone-sakerplus/data/collections_harvested.json', 'utf8'));

  // Prioritize collections with products
  const activeColls = collections.filter(c => c.productCount > 0);
  console.log(`Active collections with products to create: ${activeColls.length}`);

  for (let i = 0; i < activeColls.length; i++) {
    const coll = activeColls[i];
    let collId = existingHandles.get(coll.handle);

    if (!collId) {
      console.log(`[${i + 1}/${activeColls.length}] Creating collection: ${coll.title} (${coll.handle})...`);
      try {
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
          existingHandles.set(coll.handle, collId);
          console.log(`  ✔ Created! ID: ${collId}`);
        } else {
          const err = await createRes.text();
          console.error(`  ✗ Error creating collection (${createRes.status}):`, err.slice(0, 150));
        }
      } catch (e) {
        console.error(`  ✗ Network error:`, e.message);
      }
      await sleep(500);
    }
  }

  console.log(`\nAll active collections verified/created!`);
}

main();
