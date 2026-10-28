import fs from 'fs';
import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const DRAFT_THEME_ID = '187702804665';

async function uploadAsset(token, key, content, isBinary = false) {
  const url = `https://${SHOP}/admin/api/${API_VERSION}/themes/${DRAFT_THEME_ID}/assets.json`;
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
    console.log(`✓ Uploaded ${key}`);
    return true;
  } else {
    console.error(`✗ Failed to upload ${key}:`, data.errors);
    return false;
  }
}

async function fetchAsset(token, key) {
  const url = `https://${SHOP}/admin/api/${API_VERSION}/themes/${DRAFT_THEME_ID}/assets.json?asset[key]=${encodeURIComponent(key)}`;
  const res = await fetch(url, {
    headers: {
      'X-Shopify-Access-Token': token
    }
  });
  const data = await res.json();
  return data.asset?.value || null;
}

async function main() {
  console.log(`=== Deploying Final Refinements to Draft Theme ${DRAFT_THEME_ID} ===\n`);
  const token = await getAccessToken();

  // 1. Upload CSS
  console.log('1. Uploading assets/botanaroots-bundle.css...');
  const css = fs.readFileSync('assets/botanaroots-bundle.css', 'utf8');
  await uploadAsset(token, 'assets/botanaroots-bundle.css', css, false);

  // 2. Upload JS
  console.log('2. Uploading assets/botanaroots-bundle.js...');
  const js = fs.readFileSync('assets/botanaroots-bundle.js', 'utf8');
  await uploadAsset(token, 'assets/botanaroots-bundle.js', js, false);

  // 3. Upload Snippet
  console.log('3. Uploading snippets/botanaroots-bundle-upsell.liquid...');
  const snippet = fs.readFileSync('snippets/botanaroots-bundle-upsell.liquid', 'utf8');
  await uploadAsset(token, 'snippets/botanaroots-bundle-upsell.liquid', snippet, false);

  // 4. Update sections/zavelyn-pdp-main.liquid schema & render call
  console.log('4. Fetching and updating sections/zavelyn-pdp-main.liquid...');
  let pdpMain = await fetchAsset(token, 'sections/zavelyn-pdp-main.liquid');
  if (!pdpMain) {
    throw new Error('Could not fetch sections/zavelyn-pdp-main.liquid from theme');
  }

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

  // Check if schema already contains botana_img_buy3
  if (!pdpMain.includes('botana_img_buy3')) {
    // Find schema JSON
    const schemaStart = pdpMain.indexOf('{% schema %}');
    const schemaEnd = pdpMain.indexOf('{% endschema %}');
    if (schemaStart !== -1 && schemaEnd !== -1) {
      const schemaJsonStr = pdpMain.substring(schemaStart + 12, schemaEnd).trim();
      try {
        const schemaObj = JSON.parse(schemaJsonStr);
        schemaObj.settings = schemaObj.settings || [];
        schemaObj.settings.push(...newSettings);
        const updatedSchemaStr = JSON.stringify(schemaObj, null, 2);
        pdpMain = pdpMain.substring(0, schemaStart + 12) + '\n' + updatedSchemaStr + '\n' + pdpMain.substring(schemaEnd);
        console.log('✓ Successfully injected 4 image_picker settings into schema');
      } catch (e) {
        console.error('Error parsing schema JSON:', e);
      }
    }
  } else {
    console.log('✓ Schema already contains botana_img_buy3 settings');
  }

  // B. Update render call to pass section settings
  const oldRender = "{%- render 'botanaroots-bundle-upsell' -%}";
  const newRender = `{%- render 'botanaroots-bundle-upsell',
              img_buy3: section.settings.botana_img_buy3,
              img_buy2: section.settings.botana_img_buy2,
              img_buy1: section.settings.botana_img_buy1,
              img_upsell: section.settings.botana_img_upsell
          -%}`;

  if (pdpMain.includes(oldRender)) {
    pdpMain = pdpMain.replace(oldRender, newRender);
    console.log('✓ Successfully passed image settings into render tag');
  } else if (pdpMain.includes('img_buy3: section.settings.botana_img_buy3')) {
    console.log('✓ Render tag already passes image settings');
  } else {
    console.warn('Could not find old render tag to replace');
  }

  // Upload updated sections/zavelyn-pdp-main.liquid
  await uploadAsset(token, 'sections/zavelyn-pdp-main.liquid', pdpMain, false);

  console.log('\n========================================================================');
  console.log('ALL REFINEMENTS DEPLOYED SUCCESSFULLY TO DRAFT THEME 187702804665');
  console.log(`Preview: https://${SHOP}/products/zavelyn-botanaroots-organic-batana-hair-growth-oil?preview_theme_id=${DRAFT_THEME_ID}`);
  console.log('========================================================================\n');
}

main().catch(console.error);
