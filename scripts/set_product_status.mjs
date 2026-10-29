import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { getAccessToken, SHOP } from './batch1_config.mjs';

const PRODUCT_ID = '15474869960889';

async function setStatus(status) {
  const token = await getAccessToken();
  const res = await fetch(`https://${SHOP}/admin/api/2026-10/products/${PRODUCT_ID}.json`, {
    method: 'PUT',
    headers: { 'X-Shopify-Access-Token': token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ product: { id: PRODUCT_ID, status } })
  });
  const data = await res.json();
  console.log(`Product ${PRODUCT_ID} status updated to: ${data.product?.status}`);
}

const statusArg = process.argv[2] || 'active';
setStatus(statusArg).catch(console.error);
