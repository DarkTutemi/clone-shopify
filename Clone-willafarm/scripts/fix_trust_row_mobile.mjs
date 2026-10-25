import fs from 'fs';

const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const THEME_ID = '186607567033';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || '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';

async function getAccessToken() {
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`OAuth error: ${JSON.stringify(data)}`);
  return data.access_token;
}

async function uploadThemeAsset(token, key, value) {
  const url = `https://${SHOP_DOMAIN}/admin/api/2024-10/themes/${THEME_ID}/assets.json`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({ asset: { key, value } })
  });
  const data = await res.json();
  if (res.ok) {
    console.log(`  ✔ Uploaded: ${key}`);
    return true;
  } else {
    console.error(`  ✗ Failed ${key}:`, JSON.stringify(data.errors || data));
    return false;
  }
}

async function main() {
  console.log('--- Fixing Mobile Trust Row: 1 Single Row on Mobile ---');
  const token = await getAccessToken();

  let liquid = fs.readFileSync('Clone-willafarm/theme/sections/heating-lamp-funnel.liquid', 'utf8');

  // Find the mobile media query rule for wf-trust-row
  const oldMobileRule = /\.wf-trust-row\s*\{\s*flex-direction:\s*column;\s*gap:\s*6px;\s*align-items:\s*center;\s*\}/;

  const newMobileRule = `.wf-trust-row {
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      gap: 6px;
    }
    .wf-trust-badge-item {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 10px;
      font-weight: 600;
      line-height: 1.25;
      flex: 1 1 0;
      text-align: left;
    }
    .wf-tb-icon {
      font-size: 13px;
      flex-shrink: 0;
    }`;

  if (!liquid.match(oldMobileRule)) {
    throw new Error('oldMobileRule not found in liquid file!');
  }

  liquid = liquid.replace(oldMobileRule, newMobileRule);
  fs.writeFileSync('Clone-willafarm/theme/sections/heating-lamp-funnel.liquid', liquid);
  console.log('Saved Clone-willafarm/theme/sections/heating-lamp-funnel.liquid');

  // Also update build script
  let buildScript = fs.readFileSync('Clone-willafarm/scripts/build_willa_heating_lamp_pdp.mjs', 'utf8');
  buildScript = buildScript.replace(oldMobileRule, newMobileRule);
  fs.writeFileSync('Clone-willafarm/scripts/build_willa_heating_lamp_pdp.mjs', buildScript);
  console.log('Saved Clone-willafarm/scripts/build_willa_heating_lamp_pdp.mjs');

  // Upload to Shopify
  console.log('Uploading updated section to Shopify theme...');
  const ok = await uploadThemeAsset(token, 'sections/heating-lamp-funnel.liquid', liquid);
  if (!ok) throw new Error('Theme asset upload failed');

  console.log('✔ Successfully deployed mobile trust row fix to Shopify Theme 186607567033!');
}

main().catch(console.error);
