import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { getAccessToken, SHOP } from './batch1_config.mjs';

const API_VERSION = '2026-10';

async function main() {
  const token = await getAccessToken();

  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/products/15469942145209.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  const p = data.product;
  console.log('Product ID:', p.id);
  console.log('Title:', p.title);
  console.log('Handle:', p.handle);
  console.log('Status:', p.status);
  console.log('Variants count:', p.variants.length);
  p.variants.forEach(v => {
    console.log(`- ID: ${v.id} | Title: "${v.title}" | Price: $${v.price} | SKU: ${v.sku} | Inv Policy: ${v.inventory_policy}`);
  });
}

main().catch(console.error);
