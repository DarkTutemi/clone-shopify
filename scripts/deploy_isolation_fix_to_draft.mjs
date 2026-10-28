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

  // 1. Fetch current sections/zavelyn-pdp-main.liquid from draft theme
  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${DRAFT_THEME_ID}/assets.json?asset[key]=sections/zavelyn-pdp-main.liquid`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  let content = data.asset.value;

  console.log(`Current zavelyn-pdp-main.liquid length: ${content.length}`);

  // Replace gallery blocks condition to isolate Botanaroots
  const targetPattern = `          {%- assign gallery_blocks = section.blocks | where: "type", "gallery_image" -%}\n          {%- if gallery_blocks.size > 0 -%}`;
  
  const replacement = `          {%- assign is_botanaroots = false -%}
          {%- if product.handle == 'zavelyn-botanaroots-organic-batana-hair-growth-oil' -%}
            {%- assign is_botanaroots = true -%}
          {%- endif -%}

          {%- assign gallery_blocks = section.blocks | where: "type", "gallery_image" -%}
          {%- if is_botanaroots and gallery_blocks.size > 0 -%}`;

  if (!content.includes(targetPattern)) {
    console.error('Target pattern for gallery condition not found!');
    process.exit(1);
  }

  content = content.replace(targetPattern, replacement);

  // In the else branch, change limit: 8 to all images
  const targetThumbLoop = `{% for image in product.images limit: 8 %}`;
  const replaceThumbLoop = `{% for image in product.images %}`;
  if (content.includes(targetThumbLoop)) {
    content = content.replace(targetThumbLoop, replaceThumbLoop);
    console.log('✓ Updated fallback thumbnail loop to display all product images');
  }

  // Upload updated sections/zavelyn-pdp-main.liquid to DRAFT THEME
  await uploadAsset(token, DRAFT_THEME_ID, 'sections/zavelyn-pdp-main.liquid', content);

  // 2. Fetch and update sections/zavelyn-pdp-faq.liquid
  const faqRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${DRAFT_THEME_ID}/assets.json?asset[key]=sections/zavelyn-pdp-faq.liquid`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const faqData = await faqRes.json();
  let faqContent = faqData.asset.value;

  // In zavelyn-pdp-faq.liquid:
  // For botanaroots: already outputs nothing.
  // For other products: only render if zv_faq_count > 0, using product's specific questions.
  const faqTarget = `{%- if product.handle == 'zavelyn-botanaroots-organic-batana-hair-growth-oil' -%}
  {%- comment -%}BotanaRoots renders interactive accordion at position 2 in description fallback{%- endcomment -%}
{%- elsif section.settings.enable_section != false -%}`;

  const faqReplacement = `{%- include 'zavelyn-pdp-data' -%}
{%- if product.handle == 'zavelyn-botanaroots-organic-batana-hair-growth-oil' -%}
  {%- comment -%}BotanaRoots renders interactive accordion at position 2 in description fallback{%- endcomment -%}
{%- elsif zv_faq_count > 0 and section.settings.enable_section != false -%}`;

  if (faqContent.includes(faqTarget)) {
    faqContent = faqContent.replace(faqTarget, faqReplacement);
    
    // Also make sure the section header shows product-specific title or generic
    const faqSubTarget = `<p class="zv-section-subtitle">{{ section.settings.subheading | default: 'Everything you need to know about Zavelyn BotanaRoots.' }}</p>`;
    const faqSubReplacement = `<p class="zv-section-subtitle">{{ zv_vp_title | default: product.title }} Questions & Answers</p>`;
    if (faqContent.includes(faqSubTarget)) {
      faqContent = faqContent.replace(faqSubTarget, faqSubReplacement);
    }

    // And make sure ext_blocks only applies if zv_faq_count is 0 or remove Botana questions from other products
    const extBlocksTarget = `{%- assign ext_blocks = section.blocks | where: "type", "faq_item" -%}
      {%- if ext_blocks.size > 0 -%}`;
    const extBlocksReplacement = `{%- if zv_faq_count > 0 -%}`;
    if (faqContent.includes(extBlocksTarget)) {
      // Find the else block and adjust
      faqContent = faqContent.replace(extBlocksTarget, extBlocksReplacement);
      console.log('✓ Adjusted FAQ block rendering to prioritize product-specific questions');
    }

    await uploadAsset(token, DRAFT_THEME_ID, 'sections/zavelyn-pdp-faq.liquid', faqContent);
  } else {
    console.log('FAQ target pattern not found, checking existing content...');
  }

  console.log('\nSUCCESS: Isolation changes uploaded to DRAFT THEME ONLY (187720335545)');
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
