import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const LIVE_THEME_ID = '187597717689';

async function listLiveThemeTemplates() {
  const token = await getAccessToken();
  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${LIVE_THEME_ID}/assets.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  const assets = data.assets || [];

  const productTemplates = assets.filter(a => a.key.startsWith('templates/product'));
  const cartAssets = assets.filter(a => a.key.includes('cart'));
  const checkoutAssets = assets.filter(a => a.key.includes('checkout'));

  console.log('--- Product Templates on Live Theme ---');
  console.log(productTemplates.map(a => a.key));

  console.log('\n--- Cart Assets on Live Theme ---');
  console.log(cartAssets.map(a => a.key));

  console.log('\n--- Checkout Assets on Live Theme ---');
  console.log(checkoutAssets.map(a => a.key));
}

listLiveThemeTemplates().catch(console.error);
