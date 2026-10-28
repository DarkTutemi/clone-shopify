import fs from 'fs';
import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const DRAFT_THEME_ID = '187702804665';

async function uploadAsset(token, key, content, isBinary = false) {
  const url = `https://${SHOP}/admin/api/${API_VERSION}/themes/${DRAFT_THEME_ID}/assets.json`;
  const body = {
    asset: {
      key: key
    }
  };
  if (isBinary) {
    body.asset.attachment = content; // base64 string
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
  console.log(`Deploying BotanaRoots Scoped Bundle Component to Theme ${DRAFT_THEME_ID}...`);
  const token = await getAccessToken();

  // 1. Upload 4 WebP images
  const images = [
    'botana-bundle-buy1.webp',
    'botana-bundle-buy2.webp',
    'botana-bundle-buy3.webp',
    'botana-bundle-upgrade-size.webp'
  ];

  for (const imgName of images) {
    const buf = fs.readFileSync(`assets/${imgName}`);
    const b64 = buf.toString('base64');
    await uploadAsset(token, `assets/${imgName}`, b64, true);
  }

  // 2. Upload CSS & JS
  const css = fs.readFileSync('assets/botanaroots-bundle.css', 'utf8');
  await uploadAsset(token, 'assets/botanaroots-bundle.css', css, false);

  const js = fs.readFileSync('assets/botanaroots-bundle.js', 'utf8');
  await uploadAsset(token, 'assets/botanaroots-bundle.js', js, false);

  // 3. Upload Snippet
  const snippet = fs.readFileSync('snippets/botanaroots-bundle-upsell.liquid', 'utf8');
  await uploadAsset(token, 'snippets/botanaroots-bundle-upsell.liquid', snippet, false);

  // 4. Update sections/zavelyn-pdp-main.liquid on theme 187702804665
  console.log('\nFetching current sections/zavelyn-pdp-main.liquid from theme...');
  let pdpMain = await fetchAsset(token, 'sections/zavelyn-pdp-main.liquid');
  if (!pdpMain) {
    console.error('Could not fetch sections/zavelyn-pdp-main.liquid');
    return;
  }

  // Backup original
  fs.writeFileSync('scripts/draft_zavelyn_pdp_main_original.liquid', pdpMain);
  console.log('Saved original pdp main to scripts/draft_zavelyn_pdp_main_original.liquid');

  // Check if already modified
  if (pdpMain.includes('botanaroots-bundle-upsell')) {
    console.log('botanaroots-bundle-upsell is already included in sections/zavelyn-pdp-main.liquid');
  } else {
    // We want to replace the bundle + CTA section for BotanaRoots specifically
    // Locate the variant swatches / bundle offers start
    const targetStart = '<!-- Color / Style Swatches (if multi-variant with attribute options) -->';
    const targetEnd = '<!-- TRUST CHIPS (.kc-trust) -->';

    const sIdx = pdpMain.indexOf(targetStart);
    const eIdx = pdpMain.indexOf(targetEnd);

    if (sIdx !== -1 && eIdx !== -1) {
      const originalBlock = pdpMain.substring(sIdx, eIdx);
      const replacementBlock = `{%- if product.handle == 'zavelyn-botanaroots-organic-batana-hair-growth-oil' -%}
            {%- render 'botanaroots-bundle-upsell' -%}
          {%- else -%}
            ${originalBlock}
          {%- endif -%}\n          `;

      pdpMain = pdpMain.substring(0, sIdx) + replacementBlock + pdpMain.substring(eIdx);
      fs.writeFileSync('scripts/draft_zavelyn_pdp_main_modified.liquid', pdpMain);
      await uploadAsset(token, 'sections/zavelyn-pdp-main.liquid', pdpMain, false);
      console.log('✓ Successfully integrated scoped BotanaRoots bundle hook in sections/zavelyn-pdp-main.liquid');
    } else {
      console.error('Could not locate exact injection markers in sections/zavelyn-pdp-main.liquid');
    }
  }

  console.log('\n========================================================================');
  console.log('DEPLOYMENT TO DRAFT PREVIEW THEME COMPLETE');
  console.log(`Preview URL: https://${SHOP}/products/zavelyn-botanaroots-organic-batana-hair-growth-oil?preview_theme_id=${DRAFT_THEME_ID}`);
  console.log('========================================================================\n');
}

main().catch(console.error);
