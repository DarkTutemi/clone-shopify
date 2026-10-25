import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const PRODUCT_ID = '15454946951353';

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
  console.log('Got access token.');

  // First fetch current product
  const getRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/products/${PRODUCT_ID}.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const currentProd = (await getRes.json()).product;
  console.log(`Current product: ${currentProd.title} (${currentProd.variants.length} variants)`);
  currentProd.variants.forEach(v => console.log(`- ${v.id}: ${v.title} $${v.price}`));

  // Desired variants:
  // Buy 2: $72.99 (compare $145.98)
  // Buy 4: $138.68 (compare $291.96) -> Extra 5% Off ($145.98 * 0.95 = 138.68)
  // Buy 6: $186.12 (compare $437.94) -> Extra 15% Off ($218.97 * 0.85 = 186.12)
  const newVariants = [
    {
      title: 'Buy 2',
      option1: 'Buy 2',
      price: '72.99',
      compare_at_price: '145.98',
      sku: 'ZAV-FENCE-02',
      inventory_policy: 'continue'
    },
    {
      title: 'Buy 4',
      option1: 'Buy 4',
      price: '138.68',
      compare_at_price: '291.96',
      sku: 'ZAV-FENCE-04',
      inventory_policy: 'continue'
    },
    {
      title: 'Buy 6',
      option1: 'Buy 6',
      price: '186.12',
      compare_at_price: '437.94',
      sku: 'ZAV-FENCE-06',
      inventory_policy: 'continue'
    }
  ];

  // Update product options first to ["Buy 2", "Buy 4", "Buy 6"]
  const updatePayload = {
    product: {
      id: PRODUCT_ID,
      options: [
        {
          name: 'Bundle',
          values: ['Buy 2', 'Buy 4', 'Buy 6']
        }
      ],
      variants: newVariants
    }
  };

  const putRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/products/${PRODUCT_ID}.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify(updatePayload)
  });

  const putData = await putRes.json();
  if (putData.product) {
    console.log('✔ Successfully updated product variants!');
    console.log('New variants count:', putData.product.variants.length);
    putData.product.variants.forEach(v => {
      console.log(`- ${v.id}: "${v.title}" | Price: $${v.price} | Compare: $${v.compare_at_price} | Policy: ${v.inventory_policy}`);
    });
  } else {
    console.error('✗ Failed to update variants:', JSON.stringify(putData, null, 2));
  }
}

main().catch(console.error);
