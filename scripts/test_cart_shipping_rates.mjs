const STORE_DOMAIN = 'https://tryzavelyn.com';

async function testShippingRates() {
  console.log('Testing live checkout shipping rates via /cart/shipping_rates.json...');

  // Step 1: Add Botana Buy 1 ($39.00)
  let res = await fetch(`${STORE_DOMAIN}/cart/add.js`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ items: [{ id: 67980643598521, quantity: 1 }] })
  });
  const c1 = res.headers.getSetCookie ? res.headers.getSetCookie() : [res.headers.get('set-cookie')];
  const cookie = (c1 || []).filter(Boolean).map(c => c.split(';')[0]).join('; ');

  let cart = await (await fetch(`${STORE_DOMAIN}/cart.js`, { headers: { Cookie: cookie } })).json();
  console.log(`\n--- Cart with 1 bottle ($${(cart.total_price/100).toFixed(2)}) ---`);

  // Query shipping rates
  let ratesRes = await fetch(`${STORE_DOMAIN}/cart/shipping_rates.json?shipping_address%5Bzip%5D=90210&shipping_address%5Bcountry%5D=United+States&shipping_address%5Bprovince%5D=California`, {
    headers: { Cookie: cookie }
  });
  let rates = await ratesRes.json();
  console.log('Shipping rates for $39.00:', JSON.stringify(rates, null, 2));

  // Step 2: Add another item to bring cart >= $49.00 (e.g. 2 bottles = $78.00 or $49.99)
  await fetch(`${STORE_DOMAIN}/cart/add.js`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookie },
    body: JSON.stringify({ items: [{ id: 67980643598521, quantity: 1 }] })
  });
  cart = await (await fetch(`${STORE_DOMAIN}/cart.js`, { headers: { Cookie: cookie } })).json();
  console.log(`\n--- Cart with 2 items ($${(cart.total_price/100).toFixed(2)}) ---`);

  ratesRes = await fetch(`${STORE_DOMAIN}/cart/shipping_rates.json?shipping_address%5Bzip%5D=90210&shipping_address%5Bcountry%5D=United+States&shipping_address%5Bprovince%5D=California`, {
    headers: { Cookie: cookie }
  });
  rates = await ratesRes.json();
  console.log('Shipping rates for $78.00:', JSON.stringify(rates, null, 2));

  // Step 3: Clear cart
  await fetch(`${STORE_DOMAIN}/cart/clear.js`, { method: 'POST', headers: { Cookie: cookie } });
  console.log('\nCart cleaned up.');
}

testShippingRates().catch(console.error);
