import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';
import fs from 'fs';
import path from 'path';

const DRAFT_THEME_ID = '187720335545';
const LIVE_THEME_ID = '187597717689';

async function fetchAsset(token, themeId, key) {
  const url = `https://${SHOP}/admin/api/${API_VERSION}/themes/${themeId}/assets.json?asset[key]=${encodeURIComponent(key)}`;
  const res = await fetch(url, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  if (data.errors || !data.asset) {
    throw new Error(`Fetch error for ${key} on theme ${themeId}: ${JSON.stringify(data.errors || data)}`);
  }
  return data.asset.value;
}

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
    throw new Error(`Upload error for ${key} on theme ${themeId}: ${JSON.stringify(data.errors)}`);
  }
  console.log(`✓ Uploaded ${key} to Live Theme ${themeId} (${value.length} chars)`);
}

async function main() {
  const token = await getAccessToken();

  const backupDir = 'backups/pre_sync_live_backup';
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const assetsToSync = [
    'sections/zavelyn-pdp-main.liquid',
    'sections/zavelyn-pdp-faq.liquid'
  ];

  for (const key of assetsToSync) {
    // 1. Backup current live
    const currentLive = await fetchAsset(token, LIVE_THEME_ID, key);
    const backupPath = path.join(backupDir, key.replace('/', '__'));
    fs.writeFileSync(backupPath, currentLive, 'utf8');
    console.log(`✓ Backed up live ${key} -> ${backupPath}`);

    // 2. Fetch tested asset from draft
    const testedDraft = await fetchAsset(token, DRAFT_THEME_ID, key);
    console.log(`✓ Read tested draft ${key} (${testedDraft.length} chars)`);

    // 3. Upload to live
    await uploadAsset(token, LIVE_THEME_ID, key, testedDraft);
  }

  console.log('\nSUCCESS: All isolation assets synchronized to Live Theme (187597717689)');
}

main().catch(err => {
  console.error('Fatal during live sync:', err);
  process.exit(1);
});
