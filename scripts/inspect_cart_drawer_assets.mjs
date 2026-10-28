import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { getAccessToken, SHOP } from './batch1_config.mjs';

const API_VERSION = '2026-10';
const LIVE_THEME_ID = '187597717689';

async function main() {
  const token = await getAccessToken();

  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${LIVE_THEME_ID}/assets.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  const cartAssets = data.assets.filter(a => a.key.includes('cart') || a.key.includes('drawer'));
  console.log('Cart assets:', cartAssets.map(a => a.key));

  for (const asset of cartAssets) {
    if (asset.key.endsWith('.liquid') || asset.key.endsWith('.js')) {
      const aRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${LIVE_THEME_ID}/assets.json?asset[key]=${asset.key}`, {
        headers: { 'X-Shopify-Access-Token': token }
      });
      const aData = await aRes.json();
      console.log(`\n=== ${asset.key} === (len: ${aData.asset.value.length})`);
      const val = aData.asset.value;
      // find open function
      const openMatches = val.match(/(function\s+[a-zA-Z0-9_]*open[a-zA-Z0-9_]*|\.open\s*=|openDrawer|openCart|cart:refresh|cart:open)/gi);
      console.log('Matches in', asset.key, ':', openMatches);
    }
  }
}

main().catch(console.error);
