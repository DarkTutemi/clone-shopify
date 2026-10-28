import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { getAccessToken, SHOP } from './batch1_config.mjs';

const API_VERSION = '2026-10';
const LIVE_THEME_ID = '187597717689';
const DEV_THEME_ID = '187736654009';

async function main() {
  const token = await getAccessToken();

  // 1. Get Product
  const prodRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/products/15461545935033.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const prodData = await prodRes.json();
  console.log('=== PRODUCT ===');
  console.log('Title:', prodData.product.title);
  console.log('Handle:', prodData.product.handle);
  console.log('Template suffix:', prodData.product.template_suffix);

  // 2. Determine template key
  const templateKey = prodData.product.template_suffix 
    ? `templates/product.${prodData.product.template_suffix}.json`
    : `templates/product.json`;
  console.log('\n=== TEMPLATE KEY ===', templateKey);

  // 3. Fetch template from Live Theme
  const tplRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${LIVE_THEME_ID}/assets.json?asset[key]=${templateKey}`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const tplData = await tplRes.json();
  if (tplData.asset) {
    console.log('Template found in live theme:');
    const parsed = JSON.parse(tplData.asset.value);
    console.log('Sections order:', parsed.order);
    console.log('Sections keys:', Object.keys(parsed.sections));
    for (const [secKey, secVal] of Object.entries(parsed.sections)) {
      console.log(`- ${secKey}: type = ${secVal.type}`);
    }
  } else {
    console.log('Template fetch response:', tplData);
  }

  // 4. Also check pages
  const pageRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/pages.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const pageData = await pageRes.json();
  console.log('\n=== PAGES ===');
  const bogoPage = pageData.pages.find(p => p.handle === 'botanaroots-bogo-offer');
  if (bogoPage) {
    console.log('Found page botanaroots-bogo-offer:', bogoPage.id, 'template_suffix:', bogoPage.template_suffix);
  } else {
    console.log('No page with handle botanaroots-bogo-offer found yet.');
  }
}

main().catch(console.error);
