const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const PRODUCT_ID = '15460831953081';

async function reorderImages() {
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
  console.log('Current images:');
  product.images.forEach(img => console.log(`  ID: ${img.id} | Position: ${img.position} | Src: ${img.src}`));

  // Find package_1_battery and move to position 1
  const pkg1 = product.images.find(img => img.src.includes('package_1_battery'));
  if (pkg1) {
    console.log(`Setting ${pkg1.id} to position 1...`);
    await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/products/${PRODUCT_ID}/images/${pkg1.id}.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': access_token },
      body: JSON.stringify({ image: { id: pkg1.id, position: 1 } })
    });
    console.log('✔ Updated position of package_1_battery to 1!');
  }
}

reorderImages().catch(console.error);
