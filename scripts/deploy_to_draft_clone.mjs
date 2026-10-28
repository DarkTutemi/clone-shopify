import fs from 'fs';
import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const DRAFT_THEME_ID = '187708571833'; // STRICTLY UNPUBLISHED DRAFT THEME

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
    console.log(`✓ Uploaded ${key} to Draft Theme ${DRAFT_THEME_ID}`);
    return true;
  } else {
    console.error(`✗ Failed to upload ${key}:`, data.errors);
    return false;
  }
}

async function main() {
  console.log('========================================================================');
  console.log(`DEPLOYING BOTANAROOTS MOBILE FIX & MODULAR REFACTOR TO DRAFT (${DRAFT_THEME_ID})`);
  console.log('LIVE THEME 187597717689 REMAINS UNTOUCHED');
  console.log('========================================================================\n');

  const token = await getAccessToken();

  // 1. Upload CSS
  console.log('1. Uploading assets/botanaroots-bundle.css...');
  const css = fs.readFileSync('assets/botanaroots-bundle.css', 'utf8');
  await uploadAsset(token, 'assets/botanaroots-bundle.css', css, false);

  // 2. Upload Snippet
  console.log('\n2. Uploading snippets/botanaroots-bundle-upsell.liquid...');
  const snippet = fs.readFileSync('draft_working/snippets_botanaroots-bundle-upsell-refactored.liquid', 'utf8');
  await uploadAsset(token, 'snippets/botanaroots-bundle-upsell.liquid', snippet, false);

  // 3. Upload sections/zavelyn-pdp-main.liquid
  console.log('\n3. Uploading sections/zavelyn-pdp-main.liquid...');
  const pdpMain = fs.readFileSync('draft_working/sections_zavelyn-pdp-main-refactored.liquid', 'utf8');
  await uploadAsset(token, 'sections/zavelyn-pdp-main.liquid', pdpMain, false);

  // 4. Upload sections/zavelyn-pdp-faq.liquid
  console.log('\n4. Uploading sections/zavelyn-pdp-faq.liquid...');
  const pdpFaq = fs.readFileSync('draft_working/sections_zavelyn-pdp-faq-refactored.liquid', 'utf8');
  await uploadAsset(token, 'sections/zavelyn-pdp-faq.liquid', pdpFaq, false);

  // 5. Upload templates/product.json
  console.log('\n5. Uploading templates/product.json...');
  const productJson = fs.readFileSync('draft_working/templates_product_refactored.json', 'utf8');
  await uploadAsset(token, 'templates/product.json', productJson, false);

  console.log('\n========================================================================');
  console.log(`DEPLOYMENT COMPLETE TO DRAFT THEME ${DRAFT_THEME_ID}`);
  console.log(`Preview URL: https://${SHOP}/products/zavelyn-botanaroots-organic-batana-hair-growth-oil?preview_theme_id=${DRAFT_THEME_ID}`);
  console.log('========================================================================\n');
}

main().catch(err => {
  console.error('Deployment error:', err);
  process.exit(1);
});
