import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { getAccessToken, SHOP } from './batch1_config.mjs';

const API_VERSION = '2026-10';

async function investigateDiscrepancy() {
  console.log('================================================================');
  console.log('P0: INVESTIGATING LIVE PRICE DISCREPANCY & CHECKOUT PRICING');
  console.log('================================================================\n');

  const token = await getAccessToken();
  const headers = {
    'X-Shopify-Access-Token': token,
    'Content-Type': 'application/json'
  };

  // 1. Query GraphQL 2026-10 for BotanaRoots product variants
  console.log(`1. Querying Product Variants via Admin API ${API_VERSION}...`);
  const prodQuery = `
    query {
      product(id: "gid://shopify/Product/15461545935033") {
        id
        title
        handle
        variants(first: 10) {
          nodes {
            id
            title
            sku
            price
            compareAtPrice
            inventoryQuantity
            inventoryPolicy
          }
        }
      }
    }
  `;
  const prodRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query: prodQuery })
  });
  const prodData = await prodRes.json();
  console.log('Backend Variants (Admin API 2026-10):');
  for (const v of prodData.data?.product?.variants?.nodes || []) {
    console.log(`- ${v.id} | SKU: ${v.sku} | Price: $${v.price} | CompareAt: $${v.compareAtPrice} | Title: "${v.title}"`);
  }

  // 2. Query any Active Discount Nodes via Admin API 2026-10
  console.log(`\n2. Querying Active Discount Nodes via Admin API ${API_VERSION}...`);
  const discQuery = `
    query {
      discountNodes(first: 20) {
        nodes {
          id
          discount {
            __typename
            ... on DiscountAutomaticBxgy {
              title
              status
              summary
            }
            ... on DiscountAutomaticBasic {
              title
              status
              summary
            }
            ... on DiscountCodeBasic {
              title
              status
              summary
            }
            ... on DiscountAutomaticApp {
              title
              status
            }
          }
        }
      }
    }
  `;
  const discRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query: discQuery })
  });
  const discData = await discRes.json();
  console.log('Active Discounts:');
  for (const d of discData.data?.discountNodes?.nodes || []) {
    const disc = d.discount;
    if (disc?.status === 'ACTIVE') {
      console.log(`- [${disc.__typename}] "${disc.title}" : ${disc.summary || 'App Discount'}`);
    }
  }

  // 3. Test Actual Storefront Cart & Checkout prices for each variant
  console.log('\n3. Testing Storefront /cart/add.js and checkout line price for each variant...');
  const STORE_DOMAIN = 'https://tryzavelyn.com';

  const variantsToTest = [
    { name: 'Buy 1 Pure Raw', id: 67980643598521 },
    { name: 'Buy 1 Rosemary', id: 67980643631289 },
    { name: 'Buy 2 Pure Raw', id: 67980643664057 },
    { name: 'Buy 2 Rosemary', id: 67980643696825 },
    { name: 'Buy 3 Pure Raw', id: 67980643729593 },
    { name: 'Buy 3 Rosemary', id: 67980643762361 }
  ];

  for (const vt of variantsToTest) {
    // Clear cart first
    const initRes = await fetch(`${STORE_DOMAIN}/cart/clear.js`, { method: 'POST' });
    const c1 = initRes.headers.getSetCookie ? initRes.headers.getSetCookie() : [initRes.headers.get('set-cookie')];
    const cookie = (c1 || []).filter(Boolean).map(c => c.split(';')[0]).join('; ');

    // Add variant
    const addRes = await fetch(`${STORE_DOMAIN}/cart/add.js`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Cookie: cookie },
      body: JSON.stringify({ items: [{ id: vt.id, quantity: 1 }] })
    });
    const addData = await addRes.json();

    // Query cart
    const cartRes = await fetch(`${STORE_DOMAIN}/cart.js`, { headers: { Cookie: cookie } });
    const cartData = await cartRes.json();

    const lineItem = cartData.items?.[0];
    const cartPrice = lineItem ? (lineItem.final_price / 100).toFixed(2) : 'N/A';
    const originalPrice = lineItem ? (lineItem.original_price / 100).toFixed(2) : 'N/A';
    const totalCart = (cartData.total_price / 100).toFixed(2);

    console.log(`- ${vt.name} (ID: ${vt.id}): Cart Line Price = $${cartPrice} | Cart Subtotal = $${totalCart}`);
  }

  // Clear cart after testing
  await fetch(`${STORE_DOMAIN}/cart/clear.js`, { method: 'POST' });
  console.log('\n✔ Test completed & cart cleared.');
}

investigateDiscrepancy().catch(console.error);
