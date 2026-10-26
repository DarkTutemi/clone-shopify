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

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function executeTitleChanges() {
  const plan = JSON.parse(fs.readFileSync('scripts/title_change_plan.json', 'utf-8'));
  const toChange = plan.filter(p => p.changed);
  console.log(`Starting title updates for ${toChange.length} products...`);

  const token = await getAccessToken();
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < toChange.length; i++) {
    const item = toChange[i];
    console.log(`[${i + 1}/${toChange.length}] Updating Product ID: ${item.id}`);
    console.log(`   Old: "${item.oldTitle}"`);
    console.log(`   New: "${item.newTitle}"`);

    try {
      const res = await fetch(`https://${SHOP}/admin/api/2024-10/products/${item.id}.json`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': token
        },
        body: JSON.stringify({
          product: {
            id: item.id,
            title: item.newTitle
          }
        })
      });

      if (!res.ok) {
        const err = await res.text();
        console.error(`❌ Failed to update product ${item.id}: ${res.status} - ${err}`);
        failCount++;
      } else {
        const data = await res.json();
        console.log(`✔ Success: "${data.product.title}"`);
        successCount++;
      }
    } catch (e) {
      console.error(`❌ Network error updating product ${item.id}:`, e.message);
      failCount++;
    }

    // Rate limiting: sleep 350ms between requests
    await sleep(350);
  }

  console.log('\n=========================================');
  console.log(`Title cleanup complete!`);
  console.log(`✔ Successful updates: ${successCount}`);
  console.log(`❌ Failed updates: ${failCount}`);
  console.log('=========================================');
}

executeTitleChanges();
