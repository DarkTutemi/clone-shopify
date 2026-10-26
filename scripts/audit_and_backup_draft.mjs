import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP = 'dsdujr-vn.myshopify.com';
const DRAFT_THEME_ID = '187597717689';
const LIVE_THEME_ID = '186607567033';

async function getAccessToken() {
  const tRes = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await tRes.json();
  return data.access_token;
}

async function fetchAsset(token, themeId, key) {
  const res = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${themeId}/assets.json?asset[key]=${encodeURIComponent(key)}`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`Failed to fetch ${key}: ${res.statusText}`);
  }
  const data = await res.json();
  return data.asset?.value || null;
}

async function run() {
  console.log("=== STEP 1: SAFETY VERIFICATION & BACKUP ===");
  console.log(`Live Theme ID: ${LIVE_THEME_ID} (FROZEN - NEVER TOUCH)`);
  console.log(`Draft Theme ID: ${DRAFT_THEME_ID} (TARGET)`);

  const token = await getAccessToken();

  // Verify theme names & roles
  const themesRes = await fetch(`https://${SHOP}/admin/api/2024-10/themes.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const themesData = await themesRes.json();
  const draftTheme = themesData.themes.find(t => String(t.id) === DRAFT_THEME_ID);
  const liveTheme = themesData.themes.find(t => String(t.id) === LIVE_THEME_ID);

  console.log(`Verified Live Theme: "${liveTheme?.name}" (role: ${liveTheme?.role})`);
  console.log(`Verified Draft Theme: "${draftTheme?.name}" (role: ${draftTheme?.role})`);

  if (liveTheme?.role !== 'main') {
    console.warn(`WARNING: Live theme role is ${liveTheme?.role}`);
  }
  if (draftTheme?.role === 'main') {
    throw new Error("CRITICAL SAFETY HALT: Draft theme ID is marked as main! Halting immediately.");
  }

  const filesToBackup = [
    'templates/product.json',
    'sections/zavelyn-pdp-main.liquid',
    'snippets/zavelyn-pdp-data.liquid',
    'sections/zavelyn-pdp-value-prop.liquid',
    'sections/zavelyn-pdp-features.liquid',
    'sections/zavelyn-pdp-storytelling.liquid',
    'sections/zavelyn-pdp-steps.liquid',
    'sections/zavelyn-pdp-specs.liquid',
    'sections/zavelyn-pdp-comparison.liquid',
    'sections/zavelyn-pdp-included.liquid',
    'sections/zavelyn-pdp-faq.liquid',
    'assets/zavelyn-pdp-body.css',
    'layout/theme.liquid'
  ];

  const backupDir = path.resolve('draft_theme_backup');
  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir, { recursive: true });
  }

  const manifest = {
    timestamp: new Date().toISOString(),
    draft_theme_id: DRAFT_THEME_ID,
    draft_theme_name: draftTheme?.name,
    live_theme_id: LIVE_THEME_ID,
    live_theme_name: liveTheme?.name,
    files: []
  };

  for (const key of filesToBackup) {
    const content = await fetchAsset(token, DRAFT_THEME_ID, key);
    if (content === null) {
      console.log(`[BACKUP] ${key}: NOT FOUND on Draft Theme`);
      manifest.files.push({ key, exists: false });
    } else {
      const hash = crypto.createHash('sha256').update(content, 'utf8').digest('hex');
      const safeFileName = key.replace(/[\/\\]/g, '__');
      const filePath = path.join(backupDir, safeFileName);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`[BACKUP] ${key} -> ${safeFileName} (${content.length} bytes, sha256: ${hash.slice(0, 10)}...)`);
      manifest.files.push({ key, exists: true, size: content.length, sha256: hash, backupFile: safeFileName });
    }
  }

  fs.writeFileSync(path.join(backupDir, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`✔ Backup complete! Manifest written to ${path.join(backupDir, 'manifest.json')}`);
}

run().catch(err => {
  console.error("Backup failed:", err);
  process.exit(1);
});
