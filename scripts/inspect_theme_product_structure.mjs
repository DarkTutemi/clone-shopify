import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

async function main() {
  const token = await getAccessToken();
  const headers = {
    'X-Shopify-Access-Token': token,
    'Content-Type': 'application/json'
  };

  const themeId = 187597717689; // Live theme
  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${themeId}/assets.json?asset[key]=templates/product.json`, { headers });
  const data = await res.json();
  console.log('templates/product.json on Live Theme 187597717689:');
  console.log(data.asset?.value);

  // Also check if there's a specific product template or sections
  const mainSecRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${themeId}/assets.json?asset[key]=sections/willa-main-product.liquid`, { headers });
  const mainSecData = await mainSecRes.json();
  console.log('willa-main-product.liquid exists?', !!mainSecData.asset);

  const zavelynPdpRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${themeId}/assets.json?asset[key]=sections/zavelyn-pdp-main.liquid`, { headers });
  const zavelynPdpData = await zavelynPdpRes.json();
  console.log('zavelyn-pdp-main.liquid exists?', !!zavelynPdpData.asset);
}

main().catch(console.error);
