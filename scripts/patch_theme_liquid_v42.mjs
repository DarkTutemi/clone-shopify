import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const DRAFT_THEME_ID = '187926020281';

async function patch() {
  const token = await getAccessToken();
  const getRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${DRAFT_THEME_ID}/assets.json?asset[key]=layout/theme.liquid`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await getRes.json();
  let val = data.asset?.value || '';

  if (!val.includes('zavelyn-v4-stores.css')) {
    val = val.replace(
      "{{ 'zavelyn-v4-tokens.css' | asset_url | stylesheet_tag }}",
      "{{ 'zavelyn-v4-tokens.css' | asset_url | stylesheet_tag }}\n    {{ 'zavelyn-v4-stores.css' | asset_url | stylesheet_tag }}"
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
    console.log('✓ Successfully linked zavelyn-v4-stores.css in layout/theme.liquid:', !!putData.asset);
  } else {
    console.log('Already includes zavelyn-v4-stores.css');
  }
}

patch().catch(console.error);
