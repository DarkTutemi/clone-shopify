import { getAccessToken, SHOP } from './batch1_config.mjs';
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

const LIVE_THEME_ID = 187597717689;

async function main() {
  const token = await getAccessToken();

  // 1. Get product info from Shopify Admin
  const prodRes = await fetch(`https://${SHOP}/admin/api/2024-01/products.json?handle=zavelyn-vfit-red-light-intimate-wellness-device`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const prodData = await prodRes.json();
  const product = prodData.products[0];
  console.log('Product ID:', product.id);
  console.log('Product Title:', product.title);
  console.log('Template Suffix:', product.template_suffix);

  // 2. Check which template file is used
  const templateName = product.template_suffix ? `templates/product.${product.template_suffix}.json` : 'templates/product.json';
  console.log('Template file to look for:', templateName);

  // 3. Fetch template from Live Theme
  const tplRes = await fetch(`https://${SHOP}/admin/api/2024-01/themes/${LIVE_THEME_ID}/assets.json?asset[key]=${templateName}`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const tplData = await tplRes.json();
  if (tplData.asset) {
    console.log('Template content:', tplData.asset.value);
  } else {
    console.log('Template asset error:', tplData);
  }
}

main().catch(console.error);
