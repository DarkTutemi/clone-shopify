import fs from 'fs';

async function testLooxApi() {
  const shop = 'a52d7c-98.myshopify.com';
  const looxId = '7GiGt8f0rB';
  const prodId = '15432367931694';

  const urls = [
    `https://loox.io/api/reviews?shop=${shop}&product_id=${prodId}`,
    `https://loox.io/widget/${looxId}/reviews?product_id=${prodId}`,
    `https://loox.io/widget/${looxId}/reviews`,
    `https://loox.io/api/widget/${looxId}/reviews?productId=${prodId}`
  ];

  for (const u of urls) {
    try {
      const r = await fetch(u, {
        headers: { 'User-Agent': 'Mozilla/5.0' }
      });
      console.log(`URL: ${u} => status: ${r.status}, type: ${r.headers.get('content-type')}`);
      if (r.ok) {
        const text = await r.text();
        console.log('  Preview:', text.slice(0, 200));
      }
    } catch (e) {
      console.log(`URL: ${u} => error: ${e.message}`);
    }
  }
}

testLooxApi();
