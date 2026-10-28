import fs from 'fs';
import { spawn } from 'child_process';
import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const LIVE_THEME_ID = '187597717689';
const DRAFT_THEME_ID = '187708571833';

const ASSETS_TO_SYNC = [
  'sections/zavelyn-pdp-main.liquid',
  'snippets/botanaroots-bundle-upsell.liquid',
  'assets/botanaroots-bundle.css',
  'assets/botanaroots-bundle.js',
  'snippets/botanaroots-faq-accordion.liquid',
  'sections/zavelyn-pdp-description-fallback.liquid',
  'sections/zavelyn-pdp-faq.liquid',
  'templates/product.json'
];

async function main() {
  const token = await getAccessToken();

  // Create backup dir
  const backupDir = `backups/live_theme_pre_deploy_${Date.now()}`;
  fs.mkdirSync(backupDir, { recursive: true });
  console.log(`✓ Created backup directory: ${backupDir}`);

  // Step 1: Backup all current live assets
  console.log('\n--- STEP 1: BACKING UP CURRENT LIVE ASSETS ---');
  for (const key of ASSETS_TO_SYNC) {
    const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${LIVE_THEME_ID}/assets.json?asset[key]=${encodeURIComponent(key)}`, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    if (res.ok) {
      const data = await res.json();
      if (data.asset?.value) {
        const localPath = `${backupDir}/${key.replace(/\//g, '__')}`;
        fs.writeFileSync(localPath, data.asset.value);
        console.log(`  Backed up: ${key} (${data.asset.value.length} chars)`);
      } else {
        console.log(`  Asset ${key} does not exist yet on live theme (new asset)`);
      }
    } else {
      console.log(`  Asset ${key} does not exist yet on live theme (HTTP ${res.status})`);
    }
    await new Promise(r => setTimeout(r, 200));
  }

  // Step 2: Fetch tested assets from Draft Theme and upload to Live Theme
  console.log('\n--- STEP 2: SYNCING TESTED ASSETS FROM DRAFT TO LIVE ---');
  for (const key of ASSETS_TO_SYNC) {
    // Read from Draft Theme
    const draftRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${DRAFT_THEME_ID}/assets.json?asset[key]=${encodeURIComponent(key)}`, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    const draftData = await draftRes.json();
    if (!draftData.asset?.value) {
      throw new Error(`Failed to read ${key} from Draft Theme!`);
    }
    const assetContent = draftData.asset.value;

    // Upload to Live Theme
    const uploadRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${LIVE_THEME_ID}/assets.json`, {
      method: 'PUT',
      headers: {
        'X-Shopify-Access-Token': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ asset: { key, value: assetContent } })
    });
    const uploadData = await uploadRes.json();
    if (uploadData.asset) {
      console.log(`  ✓ Successfully deployed to LIVE Theme: ${key} (${assetContent.length} chars)`);
    } else {
      throw new Error(`Failed to upload ${key} to Live Theme: ${JSON.stringify(uploadData)}`);
    }
    await new Promise(r => setTimeout(r, 300));
  }

  console.log('\n======================================================');
  console.log('✓ ALL ASSETS SUCCESSFULLY DEPLOYED TO LIVE THEME 187597717689');
  console.log('======================================================\n');
}

main().catch(console.error);
