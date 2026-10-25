import fs from 'fs';

const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const THEME_ID = '186607567033';

async function main() {
  const tokenRes = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const { access_token } = await tokenRes.json();
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-01/themes/${THEME_ID}/assets.json`, {
    headers: { 'X-Shopify-Access-Token': access_token }
  });
  const data = await res.json();
  const collectionAssets = data.assets.filter(a => 
    a.key.includes('collection') || 
    a.key.includes('card') || 
    a.key.includes('grid') || 
    a.key.includes('product-item') ||
    a.key.includes('product-grid') ||
    a.key.includes('willa')
  );
  console.log('Matching theme assets found:', collectionAssets.length);
  collectionAssets.forEach(a => console.log(' ', a.key));
}

main().catch(console.error);
