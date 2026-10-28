import fs from 'fs';
import path from 'path';
import { getAccessToken, SHOP } from './batch1_config.mjs';
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

const LIVE_THEME_ID = 187597717689; // Live Theme "Zavelyn 2.0"
const DRAFT_THEME_ID = 187720335545; // Source of truth tested Draft Theme

async function uploadAsset(token, key, value, isBinary = false) {
  const payload = { asset: { key } };
  if (isBinary) {
    payload.asset.attachment = value.toString('base64');
  } else {
    payload.asset.value = value;
  }

  const res = await fetch(`https://${SHOP}/admin/api/2024-01/themes/${LIVE_THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (res.ok && data.asset) {
    console.log(`✓ Uploaded ${key} (${data.asset.size || value.length} bytes) to Live Theme`);
    return true;
  } else {
    console.error(`✗ Failed to upload ${key} to Live Theme:`, data);
    throw new Error(`Upload failed for ${key}: ` + JSON.stringify(data));
  }
}

async function getAsset(token, themeId, key) {
  const res = await fetch(`https://${SHOP}/admin/api/2024-01/themes/${themeId}/assets.json?asset[key]=${encodeURIComponent(key)}`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.asset;
}

async function main() {
  console.log(`=== EXECUTING SAFE DEPLOYMENT OF vFIT TO LIVE THEME (${LIVE_THEME_ID}) ===`);
  const token = await getAccessToken();

  // 0. Double-check Live Theme role
  const themesRes = await fetch(`https://${SHOP}/admin/api/2024-01/themes/${LIVE_THEME_ID}.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const themeData = await themesRes.json();
  if (themeData.theme.role !== 'main') {
    throw new Error(`Target theme ${LIVE_THEME_ID} is not role main: ${themeData.theme.role}`);
  }
  console.log(`✓ Confirmed Live Theme: "${themeData.theme.name}" (ID: ${LIVE_THEME_ID}, role: main)`);

  // 1. Back up current Live Theme sections/zavelyn-pdp-main.liquid
  const backupDir = `backups/live_pre_deploy_vfit_${Date.now()}`;
  fs.mkdirSync(backupDir, { recursive: true });
  const livePdpMain = await getAsset(token, LIVE_THEME_ID, 'sections/zavelyn-pdp-main.liquid');
  fs.writeFileSync(`${backupDir}/sections__zavelyn-pdp-main.liquid`, livePdpMain.value);
  console.log(`✓ Safety backup created: ${backupDir}/sections__zavelyn-pdp-main.liquid`);

  // 2. Upload the 8 Gallery Images to Live Theme
  const mediaFiles = [
    'eyemask_source_hd.jpg',
    'eyemask_slide_2.jpg',
    'eyemask_slide_3.jpg',
    'eyemask_slide_4.jpg',
    'facemask_source_hd.jpg',
    'facemask_slide_2.jpg',
    'facemask_slide_3.jpg',
    'facemask_slide_4.jpg'
  ];

  console.log('\n--- 1. UPLOADING GALLERY IMAGES TO LIVE THEME ---');
  for (const filename of mediaFiles) {
    const filePath = path.resolve('prototypes/vfit-selfcare-upsell/media', filename);
    if (fs.existsSync(filePath)) {
      const buf = fs.readFileSync(filePath);
      await uploadAsset(token, `assets/${filename}`, buf, true);
    } else {
      throw new Error(`Required media asset missing: ${filePath}`);
    }
  }

  // 3. Upload snippets/vfit-selfcare-upsell.liquid to Live Theme
  console.log('\n--- 2. UPLOADING SNIPPET TO LIVE THEME ---');
  const snippetPath = path.resolve('snippets/vfit-selfcare-upsell.liquid');
  const snippetContent = fs.readFileSync(snippetPath, 'utf8');
  await uploadAsset(token, 'snippets/vfit-selfcare-upsell.liquid', snippetContent, false);

  // 4. Fetch the verified sections/zavelyn-pdp-main.liquid from Draft Theme and upload to Live Theme
  console.log('\n--- 3. SYNCING TESTED PDP SECTION TO LIVE THEME ---');
  const draftPdpAsset = await getAsset(token, DRAFT_THEME_ID, 'sections/zavelyn-pdp-main.liquid');
  if (!draftPdpAsset || !draftPdpAsset.value) {
    throw new Error('Could not fetch verified sections/zavelyn-pdp-main.liquid from Draft Theme');
  }

  // Extra safety sanity check on content
  if (!draftPdpAsset.value.includes("product.handle == 'zavelyn-botanaroots-organic-batana-hair-growth-oil'")) {
    throw new Error('SANITY CHECK FAILED: BotanaRoots isolation block missing from payload!');
  }
  if (!draftPdpAsset.value.includes("product.handle == 'zavelyn-vfit-red-light-intimate-wellness-device'")) {
    throw new Error('SANITY CHECK FAILED: vFit Buy Box block missing from payload!');
  }
  if (!draftPdpAsset.value.includes("zvClaimOfferBtn")) {
    throw new Error('SANITY CHECK FAILED: Claim offer button missing from payload!');
  }
  if (!draftPdpAsset.value.includes("vfit-selfcare-upsell")) {
    throw new Error('SANITY CHECK FAILED: vfit-selfcare-upsell render snippet missing from payload!');
  }

  await uploadAsset(token, 'sections/zavelyn-pdp-main.liquid', draftPdpAsset.value, false);

  console.log('\n✨ LIVE THEME DEPLOYMENT COMPLETED SUCCESSFULLY!');
}

main().catch(err => {
  console.error('Fatal in deploy_vfit_to_live_theme:', err);
  process.exit(1);
});
