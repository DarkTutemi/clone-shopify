import fs from 'fs';
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { getAccessToken, SHOP } from './batch1_config.mjs';

const API_VERSION = '2026-10';
const DEV_THEME_ID = '187736654009'; // Unpublished Development Theme

async function main() {
  const token = await getAccessToken();

  // 1. Read live zavelyn-pdp-main.liquid from backup
  let liveMain = fs.readFileSync('backups/live_zavelyn-pdp-main.liquid', 'utf8');

  // 2. Prepend product assignment so product object is fully available in page template
  const prepend = `{%- assign product = all_products['zavelyn-botanaroots-organic-batana-hair-growth-oil'] -%}\n`;
  liveMain = prepend + liveMain;

  // 3. Replace botanaroots-bundle-upsell with botanaroots-bogo-bundle
  const oldBundleCall = `{%- render 'botanaroots-bundle-upsell',
                img_buy3: section.settings.botana_img_buy3,
                img_buy2: section.settings.botana_img_buy2,
                img_buy1: section.settings.botana_img_buy1,
                img_upsell: section.settings.botana_img_upsell
            -%}`;

  const newBundleCall = `{%- render 'botanaroots-bogo-bundle',
                img_buy4: section.settings.botana_img_buy3,
                img_buy2: section.settings.botana_img_buy2,
                img_buy1: section.settings.botana_img_buy1,
                img_upsell: section.settings.botana_img_upsell
            -%}`;

  if (liveMain.includes(oldBundleCall)) {
    liveMain = liveMain.replace(oldBundleCall, newBundleCall);
    console.log('✓ Replaced bundle render call with botanaroots-bogo-bundle.');
  } else {
    // try looser replace
    liveMain = liveMain.replace(
      /{%- render 'botanaroots-bundle-upsell'[\s\S]*?-%}/,
      newBundleCall
    );
    console.log('✓ Replaced bundle render call via regex.');
  }

  // 4. Update schema name
  liveMain = liveMain.replace('"name": "Zavelyn PDP Main"', '"name": "BotanaRoots BOGO PDP Main"');

  // 5. Upload to DEV_THEME_ID (187736654009)
  console.log(`Uploading sections/botanaroots-bogo-pdp.liquid to theme ${DEV_THEME_ID}...`);
  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${DEV_THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      asset: {
        key: 'sections/botanaroots-bogo-pdp.liquid',
        value: liveMain
      }
    })
  });

  const data = await res.json();
  if (data.asset) {
    console.log('✓ Successfully uploaded sections/botanaroots-bogo-pdp.liquid to Dev Theme!');
  } else {
    console.error('Error uploading section:', JSON.stringify(data));
  }
}

main().catch(console.error);
