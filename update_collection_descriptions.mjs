import fs from 'fs';

const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';

async function getAccessToken() {
  const tokenRes = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await tokenRes.json();
  return data.access_token;
}

async function main() {
  const token = await getAccessToken();

  // Update Best Sellers collection
  console.log('Updating Best Sellers collection description...');
  const res1 = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-01/custom_collections/510391156921.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      custom_collection: {
        id: 510391156921,
        body_html: '<p>Explore our most popular, high-performance innovations loved and verified by over 50,000+ satisfied customers worldwide.</p>'
      }
    })
  });
  const data1 = await res1.json();
  console.log('✔ Updated Best Sellers description:', data1.custom_collection?.body_html);

  // Update All Products collection
  console.log('Updating All Products collection description...');
  const res2 = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-01/custom_collections/510391353529.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      custom_collection: {
        id: 510391353529,
        body_html: '<p>Discover our complete catalog of innovative wellness, lifestyle, and high-performance solutions designed for modern living.</p>'
      }
    })
  });
  const data2 = await res2.json();
  console.log('✔ Updated All Products description:', data2.custom_collection?.body_html);
}

main().catch(console.error);
