import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

async function verifyCompliance() {
  const token = await getAccessToken();

  // 1. Verify variants inventory policy and quantity
  const productIds = [
    { handle: 'vfit', id: '15461356011705' },
    { handle: 'eyeMask', id: '15469511213241' },
    { handle: 'faceMask', id: '15469512163513' }
  ];

  console.log('=== 1. INVENTORY VERIFICATION (LIVE ADMIN API) ===');
  for (const item of productIds) {
    const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/products/${item.id}.json`, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    const data = await res.json();
    const p = data.product;
    console.log(`Product: ${p.title} (${item.handle})`);
    p.variants.forEach(v => {
      console.log(`  Variant ID: ${v.id} | Price: $${v.price} | Compare: $${v.compare_at_price}`);
      console.log(`  Inventory Item ID: ${v.inventory_item_id}`);
      console.log(`  Inventory Policy: ${v.inventory_policy}`);
      console.log(`  Inventory Quantity: ${v.inventory_quantity}`);
    });
  }

  // 2. Verify store policies (Shipping, Refund)
  console.log('\n=== 2. STORE POLICIES (LIVE SHOP REST / GRAPHQL) ===');
  const policyRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/policies.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  if (policyRes.ok) {
    const pData = await policyRes.json();
    pData.policies?.forEach(pol => {
      console.log(`Policy: ${pol.title} (${pol.handle})`);
      console.log(`  Updated at: ${pol.updated_at}`);
      console.log(`  Snippet: ${pol.body?.substring(0, 150)}...`);
    });
  } else {
    console.log('Could not fetch policies.json directly.');
  }

  // 3. Verify shop details
  const shopRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/shop.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const shopData = await shopRes.json();
  console.log('\n=== 3. SHOP CONFIGURATION ===');
  console.log(`Shop Name: ${shopData.shop?.name}`);
  console.log(`Domain: ${shopData.shop?.domain}`);
  console.log(`Currency: ${shopData.shop?.currency}`);
  console.log(`Taxes Included: ${shopData.shop?.taxes_included}`);
}

verifyCompliance().catch(console.error);
