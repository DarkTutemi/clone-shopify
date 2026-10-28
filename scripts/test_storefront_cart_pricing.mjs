import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

const STORE_DOMAIN = 'https://tryzavelyn.com';

async function testStorefrontCart() {
  console.log('Testing Storefront cart with proper headers...');

  const variantsToTest = [
    { name: 'Buy 1 Pure Raw (60ml)', id: 67980643598521 },
    { name: 'Buy 2 Pure Raw (2x 60ml)', id: 67980643664057 },
    { name: 'Buy 3 Pure Raw (3x 60ml)', id: 67980643729593 }
  ];

  for (const vt of variantsToTest) {
    // 1. Visit homepage or cart to get fresh session cookie
    const headRes = await fetch(`${STORE_DOMAIN}/cart.js`, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
    });
    const c1 = headRes.headers.getSetCookie ? headRes.headers.getSetCookie() : [headRes.headers.get('set-cookie')];
    let cookie = (c1 || []).filter(Boolean).map(c => c.split(';')[0]).join('; ');

    // 2. Clear cart
    await fetch(`${STORE_DOMAIN}/cart/clear.js`, {
      method: 'POST',
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', 'Cookie': cookie }
    });

    // 3. Add 1 qty of variant
    const addRes = await fetch(`${STORE_DOMAIN}/cart/add.js`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Cookie': cookie
      },
      body: JSON.stringify({ items: [{ id: vt.id, quantity: 1 }] })
    });
    if (!addRes.ok) {
      const errText = await addRes.text();
      console.log(`Add Failed with status ${addRes.status}:`, errText.slice(0, 300));
      continue;
    }
    const addData = await addRes.json();

    // 4. Query cart.js
    const cartRes = await fetch(`${STORE_DOMAIN}/cart.js`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Cookie': cookie
      }
    });
    const cartData = await cartRes.json();
    const item = cartData.items?.[0];

    console.log(`\n======================================================`);
    console.log(`Variant: ${vt.name} (ID: ${vt.id})`);
    console.log(`Cart Item Title: "${item?.title}"`);
    console.log(`Line Item Price: $${(item?.price / 100).toFixed(2)}`);
    console.log(`Original Line Price: $${(item?.original_price / 100).toFixed(2)}`);
    console.log(`Final Line Price: $${(item?.final_price / 100).toFixed(2)}`);
    console.log(`Cart Subtotal: $${(cartData.total_price / 100).toFixed(2)}`);
    console.log(`Discounts Applied: ${JSON.stringify(cartData.cart_level_discount_applications)}`);
    console.log(`Item Discounts: ${JSON.stringify(item?.discounts)}`);

    // 5. Query Shipping rate for this cart
    const ratesRes = await fetch(`${STORE_DOMAIN}/cart/shipping_rates.json?shipping_address%5Bzip%5D=90210&shipping_address%5Bcountry%5D=United+States&shipping_address%5Bprovince%5D=California`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        'Cookie': cookie
      }
    });
    const ratesData = await ratesRes.json();
    const rate = ratesData.shipping_rates?.[0];
    console.log(`Shipping Method: "${rate?.name}" | Price: $${rate?.price}`);
    console.log(`Estimated Delivery: ${rate?.delivery_days ? rate.delivery_days.join(' - ') + ' days' : 'N/A'}`);

    // Clear cart
    await fetch(`${STORE_DOMAIN}/cart/clear.js`, {
      method: 'POST',
      headers: { 'User-Agent': 'Mozilla/5.0', 'Cookie': cookie }
    });
  }
}

testStorefrontCart().catch(console.error);
