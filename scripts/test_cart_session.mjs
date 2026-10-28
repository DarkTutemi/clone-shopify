import fs from 'fs';

const STORE_DOMAIN = 'https://tryzavelyn.com';
const variantId = '67914347086009'; // Product 1 variant
const expectedProductId = '15454947901625';

async function testCart() {
  console.log('Testing Cart flow with session cookie...');

  // Step 1: Add item and extract Set-Cookie
  const addRes = await fetch(`${STORE_DOMAIN}/cart/add.js`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    body: JSON.stringify({
      items: [{ id: parseInt(variantId), quantity: 1 }]
    })
  });

  console.log('Add HTTP Status:', addRes.status);
  const addJson = await addRes.json();
  console.log('Add JSON:', JSON.stringify(addJson, null, 2));

  // Extract cookies
  const cookies = addRes.headers.getSetCookie ? addRes.headers.getSetCookie() : [addRes.headers.get('set-cookie')];
  const cookieHeader = cookies.map(c => c.split(';')[0]).join('; ');
  console.log('Session Cookie Header:', cookieHeader);

  // Step 2: Query cart with the cookie
  const cartRes = await fetch(`${STORE_DOMAIN}/cart.js`, {
    headers: {
      'Cookie': cookieHeader,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });

  const cartJson = await cartRes.json();
  console.log('Cart Items count:', cartJson.items?.length);
  const item = cartJson.items?.[0];
  if (item) {
    console.log('Item Product ID:', item.product_id, '(Expected:', expectedProductId, ')');
    console.log('Item Variant ID:', item.id, '(Expected:', variantId, ')');
    console.log('Item Title:', item.title);
    console.log('Item Price:', item.price / 100);
    const pass = String(item.product_id) === String(expectedProductId) && String(item.id) === String(variantId);
    console.log('CART VERIFICATION RESULT:', pass ? 'PASS' : 'FAIL');
  }

  // Step 3: Clear cart
  await fetch(`${STORE_DOMAIN}/cart/clear.js`, {
    method: 'POST',
    headers: { 'Cookie': cookieHeader }
  });
  console.log('Cart cleared successfully.');
}

testCart().catch(console.error);
