import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

const STORE_DOMAIN = 'https://tryzavelyn.com';

async function testCheckoutFlow() {
  console.log('Testing checkout flow on tryzavelyn.com...');
  // 1. Clear cart
  const clearRes = await fetch(`${STORE_DOMAIN}/cart/clear.js`, { method: 'POST' });
  const c1 = clearRes.headers.getSetCookie ? clearRes.headers.getSetCookie() : [clearRes.headers.get('set-cookie')];
  let cookies = (c1 || []).filter(Boolean).map(c => c.split(';')[0]);

  // 2. Add an item (e.g. Storage Bins Buy 6: 68082098405561)
  const addRes = await fetch(`${STORE_DOMAIN}/cart/add.js`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookies.join('; ')
    },
    body: JSON.stringify({ items: [{ id: 68082098405561, quantity: 1 }] })
  });
  console.log('Add status:', addRes.status);
  const c2 = addRes.headers.getSetCookie ? addRes.headers.getSetCookie() : [addRes.headers.get('set-cookie')];
  cookies = [...cookies, ...(c2 || [])].filter(Boolean).map(c => c.split(';')[0]);

  // 3. Request /checkout with manual redirect
  const checkoutRes = await fetch(`${STORE_DOMAIN}/checkout`, {
    headers: {
      'Cookie': cookies.join('; '),
      'User-Agent': 'Mozilla/5.0'
    },
    redirect: 'manual'
  });

  console.log('Checkout HTTP Status:', checkoutRes.status);
  const location = checkoutRes.headers.get('location');
  console.log('Checkout Redirect Location:', location);

  if (location) {
    const fullCheckoutUrl = location.startsWith('http') ? location : `${STORE_DOMAIN}${location}`;
    const pageRes = await fetch(fullCheckoutUrl, {
      headers: {
        'Cookie': cookies.join('; '),
        'User-Agent': 'Mozilla/5.0'
      }
    });
    console.log('Checkout Page Final Status:', pageRes.status, 'Final URL:', pageRes.url);
    const html = await pageRes.text();
    console.log('Checkout HTML length:', html.length, 'Contains order summary / payment:', html.includes('order-summary') || html.includes('payment') || html.includes('checkout') || html.includes('shopify-checkout'));
  }
}

testCheckoutFlow().catch(console.error);
