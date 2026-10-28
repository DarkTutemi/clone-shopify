const STORE_DOMAIN = 'https://tryzavelyn.com';
const DRAFT_THEME_ID = '187597717689';
const testVariantId = 67914347086009; // Zavelyn Sensory Textured Floor Mats

async function testCart() {
  console.log('Testing Draft Theme Cart flow...');

  // 1. Visit preview URL to get initial cookies
  const initRes = await fetch(`${STORE_DOMAIN}/?preview_theme_id=${DRAFT_THEME_ID}`, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
    redirect: 'manual'
  });
  const c1 = initRes.headers.getSetCookie ? initRes.headers.getSetCookie() : [initRes.headers.get('set-cookie')];
  const cookie1 = (c1 || []).filter(Boolean).map(c => c.split(';')[0]).join('; ');

  // 2. Add to cart
  const addRes = await fetch(`${STORE_DOMAIN}/cart/add.js`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookie1,
      'User-Agent': 'Mozilla/5.0'
    },
    body: JSON.stringify({ items: [{ id: testVariantId, quantity: 1 }] })
  });

  console.log('Add HTTP Status:', addRes.status);
  const addJson = await addRes.json();
  console.log('Add Response Item ID:', addJson.id || addJson.items?.[0]?.id);

  const c2 = addRes.headers.getSetCookie ? addRes.headers.getSetCookie() : [addRes.headers.get('set-cookie')];
  const cookie2 = [...(c1 || []), ...(c2 || [])].filter(Boolean).map(c => c.split(';')[0]).join('; ');

  // 3. Query Cart
  const cartRes = await fetch(`${STORE_DOMAIN}/cart.js`, {
    headers: {
      'Cookie': cookie2,
      'User-Agent': 'Mozilla/5.0'
    }
  });
  const cartJson = await cartRes.json();
  console.log('Cart Items Count:', cartJson.item_count);
  console.log('Cart Total Price: $' + (cartJson.total_price / 100).toFixed(2));
  console.log('Cart Item Title:', cartJson.items?.[0]?.title);

  // 4. Clear Cart
  await fetch(`${STORE_DOMAIN}/cart/clear.js`, {
    method: 'POST',
    headers: { 'Cookie': cookie2 }
  });
  console.log('Cart cleared successfully.');
}

testCart().catch(console.error);
