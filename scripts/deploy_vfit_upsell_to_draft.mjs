import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';
import fs from 'fs';

const DRAFT_THEME_ID = '187720335545';

async function uploadAsset(token, themeId, key, value) {
  const url = `https://${SHOP}/admin/api/${API_VERSION}/themes/${themeId}/assets.json`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      asset: { key, value }
    })
  });
  const data = await res.json();
  if (data.errors) {
    throw new Error(`Upload error for ${key}: ${JSON.stringify(data.errors)}`);
  }
  console.log(`✓ Uploaded ${key} to Draft Theme ${themeId} (${value.length} chars)`);
}

async function main() {
  const token = await getAccessToken();

  // 1. Upload snippets/vfit-selfcare-upsell.liquid
  const snippetContent = fs.readFileSync('snippets/vfit-selfcare-upsell.liquid', 'utf8');
  await uploadAsset(token, DRAFT_THEME_ID, 'snippets/vfit-selfcare-upsell.liquid', snippetContent);

  // 2. Fetch sections/zavelyn-pdp-main.liquid from Draft Theme
  const mainRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${DRAFT_THEME_ID}/assets.json?asset[key]=sections/zavelyn-pdp-main.liquid`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const mainData = await mainRes.json();
  let mainContent = mainData.asset.value;

  console.log(`Current draft zavelyn-pdp-main.liquid length: ${mainContent.length}`);

  const target = `<!-- STICKY ADD TO CART BAR -->`;
  const injection = `{%- if product.handle == 'zavelyn-vfit-red-light-intimate-wellness-device' -%}
  {%- render 'vfit-selfcare-upsell' -%}
{%- endif -%}

<!-- STICKY ADD TO CART BAR -->`;

  if (!mainContent.includes(target)) {
    throw new Error('Target string "<!-- STICKY ADD TO CART BAR -->" not found in draft pdp main!');
  }

  // Check if already injected
  if (mainContent.includes("render 'vfit-selfcare-upsell'")) {
    console.log('vfit-selfcare-upsell already injected in draft');
  } else {
    mainContent = mainContent.replace(target, injection);
    console.log('✓ Successfully injected vfit-selfcare-upsell into sections/zavelyn-pdp-main.liquid');
    await uploadAsset(token, DRAFT_THEME_ID, 'sections/zavelyn-pdp-main.liquid', mainContent);
  }

  console.log('\nSUCCESS: vFit Self-Care Upsell (Version A) deployed to DRAFT THEME (187720335545)');
}

main().catch(err => {
  console.error('Fatal during draft deployment:', err);
  process.exit(1);
});
