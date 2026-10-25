const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP = 'dsdujr-vn.myshopify.com';
const COLLECTION_ID = 510448337081;

async function run() {
  const tRes = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const token = (await tRes.json()).access_token;

  const res = await fetch(`https://${SHOP}/admin/api/2024-10/custom_collections/${COLLECTION_ID}.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      custom_collection: {
        id: COLLECTION_ID,
        template_suffix: 'zavelyn-handpans'
      }
    })
  });
  const data = await res.json();
  console.log('Updated collection template_suffix:', data.custom_collection ? data.custom_collection.template_suffix : data);
}

run().catch(console.error);
