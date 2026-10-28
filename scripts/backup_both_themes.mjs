import fs from 'fs';
import path from 'path';
import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const LIVE_THEME_ID = '186607567033';
const DRAFT_THEME_ID = '187597717689';

async function backupTheme(themeId, themeName, token) {
  const backupDir = path.join('backups', `${themeName}_${themeId}_${Date.now()}`);
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

  console.log(`\nStarting backup for Theme ${themeId} (${themeName})...`);
  const listRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${themeId}/assets.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const listData = await listRes.json();
  const assets = listData.assets || [];
  console.log(`Found ${assets.length} assets in Theme ${themeId}.`);

  let downloaded = 0;
  for (const a of assets) {
    // Only download text files (liquid, json, css, js, etc.)
    const isBinary = /\.(png|jpg|jpeg|gif|webp|ico|svg|woff|woff2|ttf|eot)$/i.test(a.key);
    try {
      const getUrl = `https://${SHOP}/admin/api/${API_VERSION}/themes/${themeId}/assets.json?asset[key]=${encodeURIComponent(a.key)}`;
      const aRes = await fetch(getUrl, { headers: { 'X-Shopify-Access-Token': token } });
      const aData = await aRes.json();
      const val = aData.asset?.value || aData.asset?.attachment;
      if (val !== undefined) {
        const filePath = path.join(backupDir, a.key.replace(/\//g, path.sep));
        const fileDir = path.dirname(filePath);
        if (!fs.existsSync(fileDir)) fs.mkdirSync(fileDir, { recursive: true });

        if (isBinary && aData.asset?.attachment) {
          fs.writeFileSync(filePath, Buffer.from(aData.asset.attachment, 'base64'));
        } else {
          fs.writeFileSync(filePath, aData.asset?.value || '', 'utf8');
        }
        downloaded++;
      }
    } catch (err) {
      console.warn(`Failed to download ${a.key}:`, err.message);
    }
  }

  console.log(`Theme ${themeId} backup complete! Downloaded ${downloaded}/${assets.length} assets to ${backupDir}`);
  return { themeId, themeName, backupDir, totalAssets: assets.length, downloaded };
}

async function runBackups() {
  const token = await getAccessToken();
  console.log('Obtained OAuth token.');
  const liveBackup = await backupTheme(LIVE_THEME_ID, 'live_theme', token);
  const draftBackup = await backupTheme(DRAFT_THEME_ID, 'draft_theme_zavelyn_2_0', token);

  fs.writeFileSync('scripts/pre_publish_backups_manifest.json', JSON.stringify({
    timestamp: new Date().toISOString(),
    liveTheme: liveBackup,
    draftTheme: draftBackup
  }, null, 2), 'utf8');

  console.log('\nBoth themes successfully backed up! Manifest written to scripts/pre_publish_backups_manifest.json');
}

runBackups().catch(console.error);
