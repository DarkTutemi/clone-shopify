import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

async function testTiming() {
  console.log('Testing network timing from local environment...');

  for (let i = 1; i <= 3; i++) {
    console.log(`\n--- Test run ${i} ---`);
    const t0 = Date.now();

    // 1. Add to cart
    const addRes = await fetch('https://tryzavelyn.com/cart/add.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        items: [{
          id: '68035793158329',
          quantity: 1,
          properties: {
            'Offer': 'BUY 4 GET 4 FREE',
            'Formula': 'Pure Raw',
            'Bottle Size': '60ml'
          }
        }]
      })
    });
    const t1 = Date.now();
    console.log(`POST /cart/add.js status: ${addRes.status} in ${t1 - t0}ms`);

    // 2. Update cart (order note)
    const updateRes = await fetch('https://tryzavelyn.com/cart/update.js', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        note: 'MANUAL FULFILLMENT NOTE'
      })
    });
    const t2 = Date.now();
    console.log(`POST /cart/update.js status: ${updateRes.status} in ${t2 - t1}ms`);

    // 3. Clear cart
    const clearRes = await fetch('https://tryzavelyn.com/cart/clear.js', { method: 'POST' });
    const t3 = Date.now();
    console.log(`POST /cart/clear.js in ${t3 - t2}ms`);
  }
}

testTiming().catch(console.error);
