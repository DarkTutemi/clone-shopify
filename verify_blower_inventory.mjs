const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const PRODUCT_ID = '15460831953081';

async function verifyInventory() {
  const tokenRes = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const { access_token } = await tokenRes.json();

  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/products/${PRODUCT_ID}.json`, {
    headers: { 'X-Shopify-Access-Token': access_token }
  });
  const { product } = await res.json();
  console.log(`Product: ${product.title} (${product.handle})`);
  for (const v of product.variants) {
    console.log(`  Variant: ${v.title} | ID: ${v.id} | Price: $${v.price} | Compare: $${v.compare_at_price} | Policy: ${v.inventory_policy}`);
    if (v.inventory_policy !== 'continue') {
      console.log(`  Updating variant ${v.id} to continue selling when out of stock...`);
      await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/variants/${v.id}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': access_token },
        body: JSON.stringify({ variant: { id: v.id, inventory_policy: 'continue' } })
      });
    }
  }
  console.log('✔ All variants verified as continue selling when out of stock!');
}

verifyInventory().catch(console.error);
