import fs from 'fs';

const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || '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';

async function getAccessToken() {
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await res.json();
  return data.access_token;
}

async function createPriceRuleWithCode(token, priceRuleData, codes) {
  // 1. Create Price Rule
  const prRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/price_rules.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({ price_rule: priceRuleData })
  });
  const prJson = await prRes.json();
  if (!prRes.ok) {
    console.error(`Failed to create price rule "${priceRuleData.title}":`, prJson);
    return null;
  }
  const rule = prJson.price_rule;
  console.log(`✔ Created Price Rule: "${rule.title}" (ID: ${rule.id})`);

  // 2. Add Discount Codes
  for (const code of codes) {
    const codeRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/price_rules/${rule.id}/discount_codes.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token
      },
      body: JSON.stringify({ discount_code: { code } })
    });
    const codeJson = await codeRes.json();
    if (codeRes.ok) {
      console.log(`   ✔ Added Code: "${codeJson.discount_code.code}"`);
    } else {
      console.error(`   ✗ Failed to add code "${code}":`, codeJson);
    }
  }

  return rule;
}

async function run() {
  const token = await getAccessToken();
  const startsAt = new Date().toISOString();

  // 1. 50% OFF Discount
  const rule50 = {
    title: 'Zavelyn 50% OFF Today - Special Offer',
    target_type: 'line_item',
    target_selection: 'all',
    allocation_method: 'across',
    value_type: 'percentage',
    value: '-50.0',
    customer_selection: 'all',
    starts_at: startsAt
  };
  await createPriceRuleWithCode(token, rule50, ['SAVE50', '50OFF', 'ZAVELYN50']);

  // 2. Extra 10% OFF Bundle Discount
  const rule10 = {
    title: 'Livestock Lamp Bundle Extra 10% OFF',
    target_type: 'line_item',
    target_selection: 'all',
    allocation_method: 'across',
    value_type: 'percentage',
    value: '-10.0',
    customer_selection: 'all',
    starts_at: startsAt
  };
  await createPriceRuleWithCode(token, rule10, ['EXTRA10', 'LAMP10']);

  // 3. Free US Shipping Over $49
  const ruleFreeShip = {
    title: 'Free US Shipping Over $49',
    target_type: 'shipping_line',
    target_selection: 'all',
    allocation_method: 'each',
    value_type: 'percentage',
    value: '-100.0',
    customer_selection: 'all',
    prerequisite_subtotal_range: {
      greater_than_or_equal_to: '49.00'
    },
    starts_at: startsAt
  };
  await createPriceRuleWithCode(token, ruleFreeShip, ['FREESHIP']);

  console.log('\n--- ALL DISCOUNTS CREATED IN SHOPIFY ADMIN ---');
}

run().catch(console.error);
