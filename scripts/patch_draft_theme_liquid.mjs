import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const DRAFT_THEME_ID = '187926020281';

async function patchThemeLiquid() {
  const token = await getAccessToken();
  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${DRAFT_THEME_ID}/assets.json?asset[key]=layout/theme.liquid`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  let val = data.asset?.value || '';

  if (!val.includes('zavelyn-v4-tokens.css')) {
    val = val.replace(
      "{{ 'zavelyn-pdp-body.css' | asset_url | stylesheet_tag }}",
      "{{ 'zavelyn-pdp-body.css' | asset_url | stylesheet_tag }}\n    {{ 'zavelyn-v4-tokens.css' | asset_url | stylesheet_tag }}"
    );

    const putRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${DRAFT_THEME_ID}/assets.json`, {
      method: 'PUT',
      headers: {
        'X-Shopify-Access-Token': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        asset: {
          key: 'layout/theme.liquid',
          value: val
        }
      })
    });

    const putData = await putRes.json();
    console.log('Updated theme.liquid on draft theme:', !!putData.asset);
  } else {
    console.log('Already included.');
  }
}

patchThemeLiquid().catch(console.error);
