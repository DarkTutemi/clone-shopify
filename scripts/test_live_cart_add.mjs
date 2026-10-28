import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { SHOP } from './batch1_config.mjs';

async function main() {
  console.log('Testing /cart/add.js with active BOGO variant 68035793158329...');
  const res = await fetch(`https://${SHOP}/cart/add.js`, {
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
          'Bottle Size': '60ml',
          'Bottles to Ship': '8',
          'Paid Bottles': '4',
          'Free Bottles': '4',
          'Manual Fulfillment': 'SHIP 8 × 60ML BOTTLES (4 Paid + 4 Free)'
        }
      }]
    })
  });

  console.log('Add to cart status:', res.status);
  const data = await res.json();
  console.log('Added item:', {
    id: data.id,
    title: data.title,
    price: (data.price / 100).toFixed(2),
    properties: data.properties
  });

  // Verify cart
  const cartRes = await fetch(`https://${SHOP}/cart.js`);
  const cart = await cartRes.json();
  console.log('Cart count:', cart.item_count, 'Total:', (cart.total_price / 100).toFixed(2));

  // Clean cart
  await fetch(`https://${SHOP}/cart/clear.js`, { method: 'POST' });
  console.log('Cart cleared successfully.');
}

main().catch(console.error);
