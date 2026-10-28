import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { getAccessToken, SHOP } from './batch1_config.mjs';

const API_VERSION = '2026-10';

async function main() {
  const token = await getAccessToken();

  // 1. Temporarily activate product
  console.log('Activating product 15469942145209 for cart test...');
  const actRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/products/15469942145209.json`, {
    method: 'PUT',
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      product: {
        id: 15469942145209,
        status: 'active'
      }
    })
  });
  const actData = await actRes.json();
  console.log('Product status now:', actData.product.status);

  // 2. Test /cart/add.js
  const cartRes = await fetch(`https://${SHOP}/cart/add.js`, {
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
          'Offer': 'Buy 4 Get 4 FREE',
          'Bottle Size': '60ml',
          'Bottles to Ship': '8'
        }
      }]
    })
  });
  console.log('Cart add status:', cartRes.status);
  const cartData = await cartRes.json();
  console.log('Cart add item:', cartData.id, cartData.title, cartData.price);

  // 3. Clear cart
  await fetch(`https://${SHOP}/cart/clear.js`, { method: 'POST' });
  console.log('Cart cleared.');

  // 4. Set product back to draft
  console.log('Setting product back to draft as per safety rules...');
  const draftRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/products/15469942145209.json`, {
    method: 'PUT',
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      product: {
        id: 15469942145209,
        status: 'draft'
      }
    })
  });
  const draftData = await draftRes.json();
  console.log('Product status restored to:', draftData.product.status);
}

main().catch(console.error);
