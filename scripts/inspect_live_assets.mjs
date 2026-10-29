import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { getAccessToken, SHOP } from './batch1_config.mjs';

const LIVE_THEME_ID = '187597717689';

async function inspectLiveAssets() {
  const token = await getAccessToken();

  console.log('=== CHECKING ASSETS ON LIVE THEME (187597717689) ===');

  // 1. Check templates/product.storage-bins.json
  const resTpl = await fetch(`https://${SHOP}/admin/api/2026-10/themes/${LIVE_THEME_ID}/assets.json?asset[key]=templates/product.storage-bins.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const dataTpl = await resTpl.json();
  console.log('\ntemplates/product.storage-bins.json exists:', !!dataTpl.asset);
  if (dataTpl.asset) {
    console.log('Content:\n', dataTpl.asset.value);
  }

  // 2. Check sections/zavelyn-storage-bins-body.liquid
  const resBody = await fetch(`https://${SHOP}/admin/api/2026-10/themes/${LIVE_THEME_ID}/assets.json?asset[key]=sections/zavelyn-storage-bins-body.liquid`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const dataBody = await resBody.json();
  console.log('\nsections/zavelyn-storage-bins-body.liquid exists:', !!dataBody.asset);

  // 3. Check sections/zavelyn-pdp-main.liquid
  const resMain = await fetch(`https://${SHOP}/admin/api/2026-10/themes/${LIVE_THEME_ID}/assets.json?asset[key]=sections/zavelyn-pdp-main.liquid`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const dataMain = await resMain.json();
  const mainVal = dataMain.asset?.value || '';
  console.log('\nsections/zavelyn-pdp-main.liquid size:', mainVal.length);
  console.log('Includes storage-bins branch:', mainVal.includes('zavelyn-foldable-zippered-storage-bins'));
}

inspectLiveAssets().catch(console.error);
