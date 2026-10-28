import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { SHOP } from './batch1_config.mjs';

async function testCartAdd() {
  const variantId = '68035793158329'; // Buy 4 Get 4 FREE 60ml on draft product
  const res = await fetch(`https://${SHOP}/cart/add.js`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      items: [{
        id: variantId,
        quantity: 1
      }]
    })
  });
  console.log('Status:', res.status);
  const data = await res.json();
  console.log('Response:', data);
}

testCartAdd().catch(console.error);
