import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { getAccessToken, SHOP } from './batch1_config.mjs';

const API_VERSION = '2026-10';
const LIVE_THEME_ID = '187597717689';
const ORIGINAL_PRODUCT_ID = '15461545935033';

async function main() {
  const token = await getAccessToken();

  // 1. Verify original product status & variants
  const pRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/products/${ORIGINAL_PRODUCT_ID}.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const pData = await pRes.json();
  const prod = pData.product;
  console.log('=== ORIGINAL PRODUCT INTEGRITY ===');
  console.log('ID:', prod.id);
  console.log('Title:', prod.title);
  console.log('Handle:', prod.handle);
  console.log('Status:', prod.status);
  console.log('Variants count:', prod.variants.length);

  // 2. Verify Live Theme role is main
  const tRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${LIVE_THEME_ID}.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const tData = await tRes.json();
  console.log('\n=== LIVE THEME INTEGRITY ===');
  console.log('Theme ID:', tData.theme.id);
  console.log('Theme Name:', tData.theme.name);
  console.log('Theme Role:', tData.theme.role); // Must be 'main'
}

main().catch(console.error);
