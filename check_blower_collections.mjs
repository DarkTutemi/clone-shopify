const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';

async function checkCollections() {
  const tokenRes = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const { access_token } = await tokenRes.json();

  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/custom_collections.json`, {
    headers: { 'X-Shopify-Access-Token': access_token }
  });
  const data = await res.json();
  console.log('Custom collections:');
  data.custom_collections?.forEach(c => console.log(`  ${c.id} - ${c.title} (${c.handle})`));

  const smartRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/smart_collections.json`, {
    headers: { 'X-Shopify-Access-Token': access_token }
  });
  const smartData = await smartRes.json();
  console.log('Smart collections:');
  smartData.smart_collections?.forEach(c => console.log(`  ${c.id} - ${c.title} (${c.handle})`));
}

checkCollections().catch(console.error);
