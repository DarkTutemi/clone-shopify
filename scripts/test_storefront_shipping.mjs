import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

async function testCartShipping(variantId, quantity) {
  // Clear cart
  await fetch('https://tryzavelyn.com/cart/clear.js', { method: 'POST' });

  // Add variant
  const addRes = await fetch('https://tryzavelyn.com/cart/add.js', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: variantId, quantity: quantity })
  });
  const addData = await addRes.json();
  console.log(`\nAdded variant ${variantId} (x${quantity}): ${addData.title} - Price: $${(addData.price/100).toFixed(2)}`);

  // Check shipping rates
  const shipRes = await fetch('https://tryzavelyn.com/cart/shipping_rates.json?shipping_address[zip]=90210&shipping_address[country]=United%20States&shipping_address[province]=California');
  const shipData = await shipRes.json();
  console.log('Shipping rates:', JSON.stringify(shipData, null, 2));
}

async function main() {
  console.log('Testing Storefront Shipping Rates for US:');
  // Buy 2 variant: 68082098471097 ($39.98)
  await testCartShipping(68082098471097, 1);

  // Buy 4 variant: 68082098438329 ($79.96)
  await testCartShipping(68082098438329, 1);

  // Buy 6 variant: 68082098405561 ($101.95)
  await testCartShipping(68082098405561, 1);
}

main().catch(console.error);
