import fs from 'fs';
import path from 'path';
import { getAccessToken, SHOP } from './batch1_config.mjs';
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

const LIVE_THEME_ID = 187597717689;
const DRAFT_THEME_ID = 187720335545;

async function getThemeAsset(token, themeId, key) {
  const res = await fetch(`https://${SHOP}/admin/api/2024-01/themes/${themeId}/assets.json?asset[key]=${encodeURIComponent(key)}`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  if (!res.ok) throw new Error(`Failed to get asset ${key} from theme ${themeId}: ${res.status}`);
  const data = await res.json();
  return data.asset.value;
}

async function uploadThemeAsset(token, themeId, key, value) {
  const res = await fetch(`https://${SHOP}/admin/api/2024-01/themes/${themeId}/assets.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({ asset: { key, value } })
  });
  const data = await res.json();
  if (!res.ok || !data.asset) {
    throw new Error(`Failed to upload ${key} to theme ${themeId}: ` + JSON.stringify(data));
  }
  console.log(`✓ Uploaded ${key} (${data.asset.size} bytes) to Theme ${themeId}`);
}

async function deleteThemeAsset(token, themeId, key) {
  try {
    await fetch(`https://${SHOP}/admin/api/2024-01/themes/${themeId}/assets.json?asset[key]=${encodeURIComponent(key)}`, {
      method: 'DELETE',
      headers: { 'X-Shopify-Access-Token': token }
    });
  } catch (e) {}
}

async function main() {
  console.log('=== FIXING PAYMENT BADGES DIRECTLY ON LIVE THEME & DRAFT THEME ===');
  const token = await getAccessToken();

  // Clean up any test snippet
  await deleteThemeAsset(token, DRAFT_THEME_ID, 'snippets/test-payment-icons.liquid');

  // 1. Fetch current live template
  const liveContent = await getThemeAsset(token, LIVE_THEME_ID, 'sections/zavelyn-pdp-main.liquid');
  const backupDir = path.join(process.cwd(), 'backups', `live_pre_payment_fix_${Date.now()}`);
  fs.mkdirSync(backupDir, { recursive: true });
  fs.writeFileSync(path.join(backupDir, 'sections__zavelyn-pdp-main.liquid'), liveContent, 'utf8');
  console.log(`✓ Backed up live sections/zavelyn-pdp-main.liquid to ${backupDir}`);

  // 2. Identify the target markup block to replace
  const startMarker = '<!-- Payment Icons -->';
  const endMarker = '{%- endunless -%}';

  const startIndex = liveContent.indexOf(startMarker);
  if (startIndex === -1) {
    throw new Error('Start marker "<!-- Payment Icons -->" not found in live sections/zavelyn-pdp-main.liquid');
  }

  const endIndex = liveContent.indexOf(endMarker, startIndex);
  if (endIndex === -1) {
    throw new Error('End marker "{%- endunless -%}" not found after start marker');
  }

  const oldPaymentMarkup = liveContent.substring(startIndex, endIndex);
  console.log(`✓ Found old payment markup block (${oldPaymentMarkup.length} chars)`);

  const newPaymentMarkup = `<!-- SHOPIFY OFFICIAL PAYMENT BADGES -->
          <div class="zv-payment-icons-wrapper" role="region" aria-label="Accepted payment methods">
            <div class="zv-payment-icons-row">
              {% assign payment_types = 'visa,master,american_express,apple_pay,google_pay,shopify_pay,discover' | split: ',' %}
              {% for type in payment_types %}
                <span class="zv-payment-icon" title="{{ type | replace: '_', ' ' | capitalize }}">
                  {{ type | payment_type_svg_tag: class: 'zv-pay-svg' }}
                </span>
              {% endfor %}
            </div>
          </div>
        `;

  let updatedContent = liveContent.replace(oldPaymentMarkup, newPaymentMarkup);

  // 3. Update CSS styling for payment icons
  const oldCssPattern = /\.zv-payment-icons-row\s*\{[^}]*\}\s*\.zv-pay-icon\s*\{[^}]*\}/;
  const newCss = `.zv-payment-icons-wrapper {
  margin: 14px 0 10px;
  width: 100%;
}
.zv-payment-icons-row {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  margin: 0;
}
.zv-payment-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.zv-payment-icon svg,
.zv-payment-icon .zv-pay-svg,
.zv-pay-icon {
  width: 38px;
  height: 24px;
  display: block;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
  transition: transform 0.15s ease;
}
.zv-payment-icon:hover svg,
.zv-payment-icon:hover .zv-pay-svg {
  transform: translateY(-1px);
}`;

  if (!oldCssPattern.test(updatedContent)) {
    throw new Error('Could not match old CSS block (.zv-payment-icons-row / .zv-pay-icon) in liquid template');
  }

  updatedContent = updatedContent.replace(oldCssPattern, newCss);
  console.log('✓ Successfully replaced payment markup and CSS rules in memory');

  // Save local copy
  fs.writeFileSync('draft_working/sections_zavelyn-pdp-main-fixed-icons.liquid', updatedContent, 'utf8');

  // 4. Upload directly to Live Theme
  console.log(`\nDeploying to LIVE THEME (${LIVE_THEME_ID})...`);
  await uploadThemeAsset(token, LIVE_THEME_ID, 'sections/zavelyn-pdp-main.liquid', updatedContent);

  // 5. Upload also to Draft Theme to maintain 100% parity
  console.log(`Deploying to DRAFT THEME (${DRAFT_THEME_ID})...`);
  await uploadThemeAsset(token, DRAFT_THEME_ID, 'sections/zavelyn-pdp-main.liquid', updatedContent);

  console.log('\n=== FIX DEPLOYED SUCCESSFULLY TO BOTH LIVE AND DRAFT THEMES ===');
}

main().catch(err => {
  console.error('Fatal error during deployment:', err);
  process.exit(1);
});
