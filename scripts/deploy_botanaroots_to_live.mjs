import fs from 'fs';
import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const LIVE_THEME_ID = '187597717689';

async function uploadAsset(token, key, content, isBinary = false) {
  const url = `https://${SHOP}/admin/api/${API_VERSION}/themes/${LIVE_THEME_ID}/assets.json`;
  const body = {
    asset: { key }
  };
  if (isBinary) {
    body.asset.attachment = content;
  } else {
    body.asset.value = content;
  }

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  if (data.asset) {
    console.log(`✓ Uploaded ${key} to Live Theme ${LIVE_THEME_ID}`);
    return true;
  } else {
    console.error(`✗ Failed to upload ${key}:`, data.errors);
    return false;
  }
}

async function fetchAsset(token, key) {
  const url = `https://${SHOP}/admin/api/${API_VERSION}/themes/${LIVE_THEME_ID}/assets.json?asset[key]=${encodeURIComponent(key)}`;
  const res = await fetch(url, {
    headers: {
      'X-Shopify-Access-Token': token
    }
  });
  const data = await res.json();
  return data.asset?.value || null;
}

async function main() {
  console.log('========================================================================');
  console.log(`DEPLOYING BOTANAROOTS BUNDLE REFINEMENT TO LIVE THEME (${LIVE_THEME_ID})`);
  console.log('========================================================================\n');

  const token = await getAccessToken();

  // 1. Backup Live Theme sections/zavelyn-pdp-main.liquid
  console.log('1. Fetching & Backing up current Live sections/zavelyn-pdp-main.liquid...');
  const currentLivePdpMain = await fetchAsset(token, 'sections/zavelyn-pdp-main.liquid');
  if (!currentLivePdpMain) {
    throw new Error('Failed to fetch live sections/zavelyn-pdp-main.liquid');
  }
  if (!fs.existsSync('backups')) fs.mkdirSync('backups', { recursive: true });
  fs.writeFileSync('backups/live_zavelyn_pdp_main_pre_botanaroots_backup.liquid', currentLivePdpMain);
  console.log('✓ Saved backup to backups/live_zavelyn_pdp_main_pre_botanaroots_backup.liquid');

  // 2. Upload 4 Cleaned WebP Assets
  console.log('\n2. Uploading 4 Clean WebP assets to Live Theme...');
  const images = [
    'botana-bundle-buy1.webp',
    'botana-bundle-buy2.webp',
    'botana-bundle-buy3.webp',
    'botana-bundle-upgrade-size.webp'
  ];
  for (const imgName of images) {
    const buf = fs.readFileSync(`assets/${imgName}`);
    await uploadAsset(token, `assets/${imgName}`, buf.toString('base64'), true);
  }

  // 3. Upload CSS & JS
  console.log('\n3. Uploading CSS & JS to Live Theme...');
  const css = fs.readFileSync('assets/botanaroots-bundle.css', 'utf8');
  await uploadAsset(token, 'assets/botanaroots-bundle.css', css, false);

  const js = fs.readFileSync('assets/botanaroots-bundle.js', 'utf8');
  await uploadAsset(token, 'assets/botanaroots-bundle.js', js, false);

  // 4. Upload Snippet
  console.log('\n4. Uploading snippets/botanaroots-bundle-upsell.liquid to Live Theme...');
  const snippet = fs.readFileSync('snippets/botanaroots-bundle-upsell.liquid', 'utf8');
  await uploadAsset(token, 'snippets/botanaroots-bundle-upsell.liquid', snippet, false);

  // 5. Modify sections/zavelyn-pdp-main.liquid on Live Theme
  console.log('\n5. Injecting Scoped Hook & Schema Settings into Live sections/zavelyn-pdp-main.liquid...');
  let livePdpMain = currentLivePdpMain;

  // A. Schema Settings Injection
  const newSettings = [
    {
      type: "header",
      content: "BotanaRoots Bundle Custom Images"
    },
    {
      type: "image_picker",
      id: "botana_img_buy3",
      label: "Buy 3 Card Image",
      info: "Custom product image for Buy 3 bundle card (leave empty to use default)"
    },
    {
      type: "image_picker",
      id: "botana_img_buy2",
      label: "Buy 2 Card Image",
      info: "Custom product image for Buy 2 bundle card (leave empty to use default)"
    },
    {
      type: "image_picker",
      id: "botana_img_buy1",
      label: "Buy 1 Card Image",
      info: "Custom product image for Buy 1 bundle card (leave empty to use default)"
    },
    {
      type: "image_picker",
      id: "botana_img_upsell",
      label: "Size Upsell Image (120ml Upgrade)",
      info: "Custom graphic for 120ml bottle size upgrade card (leave empty to use default)"
    }
  ];

  if (!livePdpMain.includes('botana_img_buy3')) {
    const schemaStart = livePdpMain.indexOf('{% schema %}');
    const schemaEnd = livePdpMain.indexOf('{% endschema %}');
    if (schemaStart !== -1 && schemaEnd !== -1) {
      const schemaJsonStr = livePdpMain.substring(schemaStart + 12, schemaEnd).trim();
      try {
        const schemaObj = JSON.parse(schemaJsonStr);
        schemaObj.settings = schemaObj.settings || [];
        schemaObj.settings.push(...newSettings);
        const updatedSchemaStr = JSON.stringify(schemaObj, null, 2);
        livePdpMain = livePdpMain.substring(0, schemaStart + 12) + '\n' + updatedSchemaStr + '\n' + livePdpMain.substring(schemaEnd);
        console.log('✓ Successfully injected schema settings');
      } catch (e) {
        console.error('Error parsing schema JSON on live theme:', e);
      }
    }
  }

  // B. Scoped Hook Injection
  const targetStart = '<!-- Color / Style Swatches (if multi-variant with attribute options) -->';
  const targetEnd = '<!-- TRUST CHIPS (.kc-trust) -->';

  const sIdx = livePdpMain.indexOf(targetStart);
  const eIdx = livePdpMain.indexOf(targetEnd);

  if (sIdx !== -1 && eIdx !== -1) {
    const originalBlock = livePdpMain.substring(sIdx, eIdx);
    const replacementBlock = `{%- if product.handle == 'zavelyn-botanaroots-organic-batana-hair-growth-oil' -%}
            {%- render 'botanaroots-bundle-upsell',
                img_buy3: section.settings.botana_img_buy3,
                img_buy2: section.settings.botana_img_buy2,
                img_buy1: section.settings.botana_img_buy1,
                img_upsell: section.settings.botana_img_upsell
            -%}
          {%- else -%}
            ${originalBlock}
          {%- endif -%}\n          `;

    livePdpMain = livePdpMain.substring(0, sIdx) + replacementBlock + livePdpMain.substring(eIdx);
    await uploadAsset(token, 'sections/zavelyn-pdp-main.liquid', livePdpMain, false);
    console.log('✓ Successfully uploaded updated sections/zavelyn-pdp-main.liquid to Live Theme');
  } else {
    throw new Error('Could not find injection markers in live sections/zavelyn-pdp-main.liquid');
  }

  console.log('\n========================================================================');
  console.log('DEPLOYMENT TO LIVE THEME COMPLETE');
  console.log(`Live URL: https://${SHOP}/products/zavelyn-botanaroots-organic-batana-hair-growth-oil`);
  console.log('========================================================================\n');
}

main().catch(err => {
  console.error('Deployment error:', err);
  process.exit(1);
});
