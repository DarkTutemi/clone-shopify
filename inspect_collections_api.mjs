import fs from 'fs';

const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';

async function main() {
  const tokenRes = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const { access_token } = await tokenRes.json();
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-01/custom_collections.json`, {
    headers: { 'X-Shopify-Access-Token': access_token }
  });
  const data = await res.json();
  console.log('Custom collections:');
  data.custom_collections?.forEach(c => console.log(c.id, c.handle, c.title, '--> desc:', c.body_html));

  const sRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-01/smart_collections.json`, {
    headers: { 'X-Shopify-Access-Token': access_token }
  });
  const sData = await sRes.json();
  console.log('Smart collections:');
  sData.smart_collections?.forEach(c => console.log(c.id, c.handle, c.title, '--> desc:', c.body_html));
}

main().catch(console.error);
