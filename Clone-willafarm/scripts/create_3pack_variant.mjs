const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || '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';

async function main() {
  const tRes = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const tData = await tRes.json();
  const token = tData.access_token;

  // Check product options
  const pRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/products/15455757336761.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const pData = await pRes.json();
  console.log('Options:', pData.product.options);
  console.log('Existing Variants:', pData.product.variants.map(v => ({ id: v.id, title: v.title, price: v.price })));

  // Check if 3 Pack already exists
  const existing3Pack = pData.product.variants.find(v => v.title.toLowerCase().includes('3 pack') || v.option1?.toLowerCase().includes('3 pack'));
  if (existing3Pack) {
    console.log('3 Pack already exists with ID:', existing3Pack.id);
    return;
  }

  // Create 3 Pack variant
  const optName = pData.product.options[0]?.name || 'Title';
  const newVarPayload = {
    variant: {
      option1: "3 Pack",
      price: "119.99",
      compare_at_price: "269.99",
      sku: "PT131318-3PACK",
      requires_shipping: true
    }
  };

  const createRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/products/15455757336761/variants.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify(newVarPayload)
  });
  const createData = await createRes.json();
  if (createRes.ok) {
    console.log('✔ Successfully created 3 Pack variant: ID =', createData.variant.id, 'Price =', createData.variant.price);
  } else {
    console.error('Failed to create variant:', createData);
  }
}

main().catch(console.error);
