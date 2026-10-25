const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const PRODUCT_ID = 15460831953081;

const COLLECTIONS = [
  510391353529, // All Products
  510391222457, // Power & Precision Tools
  510391189689, // Garden Tools
  510409539769, // Lawn, Garden & Outdoor
  510391156921  // Best Sellers
];

async function addCollects() {
  const tokenRes = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const { access_token } = await tokenRes.json();

  for (const colId of COLLECTIONS) {
    const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/collects.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': access_token },
      body: JSON.stringify({
        collect: {
          product_id: PRODUCT_ID,
          collection_id: colId
        }
      })
    });
    const data = await res.json();
    if (data.collect) {
      console.log(`  ✔ Added to collection ${colId}`);
    } else {
      console.log(`  ℹ Collection ${colId}:`, data.errors || data);
    }
  }
  console.log('Collection linkage complete!');
}

addCollects().catch(console.error);
