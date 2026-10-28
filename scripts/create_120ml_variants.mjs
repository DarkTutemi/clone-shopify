import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "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";
const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const PRODUCT_ID = '15461545935033';

async function getAccessToken() {
  const tokenRes = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials'
    })
  });
  const data = await tokenRes.json();
  return data.access_token;
}

async function main() {
  const token = await getAccessToken();

  const newVariants = [
    {
      option1: 'Buy 1 (1x 120ml Bottle - 60-Day Supply)',
      option2: '100% Pure Raw Honduran Batana (120ml)',
      price: '49.99',
      compare_at_price: '100.00',
      sku: 'ZAV-BOTANA-1PK-PURE-120ML',
      inventory_policy: 'continue',
      requires_shipping: true
    },
    {
      option1: 'Buy 1 (1x 120ml Bottle - 60-Day Supply)',
      option2: 'Batana + Rosemary Scalp Infusion (120ml)',
      price: '49.99',
      compare_at_price: '100.00',
      sku: 'ZAV-BOTANA-1PK-ROSE-120ML',
      inventory_policy: 'continue',
      requires_shipping: true
    },
    {
      option1: 'Buy 2 (2x 120ml Bottles - 120-Day Intensive Course)',
      option2: '100% Pure Raw Honduran Batana (120ml)',
      price: '99.98',
      compare_at_price: '200.00',
      sku: 'ZAV-BOTANA-2PK-PURE-120ML',
      inventory_policy: 'continue',
      requires_shipping: true
    },
    {
      option1: 'Buy 2 (2x 120ml Bottles - 120-Day Intensive Course)',
      option2: 'Batana + Rosemary Scalp Infusion (120ml)',
      price: '99.98',
      compare_at_price: '200.00',
      sku: 'ZAV-BOTANA-2PK-ROSE-120ML',
      inventory_policy: 'continue',
      requires_shipping: true
    },
    {
      option1: 'Buy 3 (3x 120ml Bottles - 180-Day Restoration - Best Value)',
      option2: '100% Pure Raw Honduran Batana (120ml)',
      price: '125.99',
      compare_at_price: '300.00',
      sku: 'ZAV-BOTANA-3PK-PURE-120ML',
      inventory_policy: 'continue',
      requires_shipping: true
    },
    {
      option1: 'Buy 3 (3x 120ml Bottles - 180-Day Restoration - Best Value)',
      option2: 'Batana + Rosemary Scalp Infusion (120ml)',
      price: '125.99',
      compare_at_price: '300.00',
      sku: 'ZAV-BOTANA-3PK-ROSE-120ML',
      inventory_policy: 'continue',
      requires_shipping: true
    }
  ];

  console.log(`Adding ${newVariants.length} 120ml variants to Product ${PRODUCT_ID}...`);
  const createdVariants = [];

  for (const v of newVariants) {
    const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2026-01/products/${PRODUCT_ID}/variants.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token
      },
      body: JSON.stringify({ variant: v })
    });

    const data = await res.json();
    if (!res.ok) {
      console.error(`Failed to create variant ${v.sku}:`, res.status, data);
    } else {
      console.log(`✓ Created: ID=${data.variant.id} | Title="${data.variant.title}" | Price=$${data.variant.price} | SKU=${data.variant.sku}`);
      createdVariants.push(data.variant);
    }
    await new Promise(r => setTimeout(r, 300));
  }

  fs.writeFileSync('backups/created_120ml_variants.json', JSON.stringify(createdVariants, null, 2));
  console.log('\nSaved backups/created_120ml_variants.json');
}

main().catch(console.error);
