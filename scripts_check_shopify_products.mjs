const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP = 'dsdujr-vn.myshopify.com';

async function run() {
  const tRes = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const token = (await tRes.json()).access_token;

  const res = await fetch(`https://${SHOP}/admin/api/2024-10/products.json?limit=50`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  console.log('--- ALL PRODUCTS ON STORE ---');
  console.log(`Total count: ${data.products.length}`);
  data.products.forEach(p => {
    console.log(`- ID: ${p.id} | Title: "${p.title}" | Handle: "${p.handle}" | Suffix: "${p.template_suffix}" | Variants: ${p.variants.length}`);
  });

  // Check collections as well
  const cRes = await fetch(`https://${SHOP}/admin/api/2024-10/custom_collections.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const cData = await cRes.json();
  console.log('\n--- CUSTOM COLLECTIONS ---');
  cData.custom_collections.forEach(c => {
    console.log(`- ID: ${c.id} | Title: "${c.title}" | Handle: "${c.handle}"`);
  });

  const scRes = await fetch(`https://${SHOP}/admin/api/2024-10/smart_collections.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const scData = await scRes.json();
  console.log('\n--- SMART COLLECTIONS ---');
  scData.smart_collections.forEach(c => {
    console.log(`- ID: ${c.id} | Title: "${c.title}" | Handle: "${c.handle}"`);
  });
}

run().catch(console.error);
