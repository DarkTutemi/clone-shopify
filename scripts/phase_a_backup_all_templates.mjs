import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP = 'dsdujr-vn.myshopify.com';
const DRAFT_THEME_ID = '187597717689';
const LIVE_THEME_ID = '186607567033';

if (DRAFT_THEME_ID === LIVE_THEME_ID) {
  throw new Error('SAFETY CHECK FAILED: Cannot target live theme!');
}

async function getAccessToken() {
  const tRes = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await tRes.json();
  return data.access_token;
}

async function fetchAsset(token, key) {
  const res = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${DRAFT_THEME_ID}/assets.json?asset[key]=${encodeURIComponent(key)}`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.asset?.value || null;
}

async function run() {
  console.log('=== PHASE A: AUDIT & COMPREHENSIVE BACKUP ===');
  const token = await getAccessToken();

  const backupDir = 'backup_phase_a_templates';
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

  const templatesToBackup = [
    'templates/product.json',
    'templates/product.srefalsteam.json',
    'templates/product.thoson-magtrack.json',
    'templates/product.yeoman-sweep.json',
    'templates/product.sakerplus-livestock-heating-lamp.json',
    'templates/product.zavelyn-drum-pro.json',
    'templates/product.zavelyn-drum-plus.json',
    'templates/product.zavelyn-drum-mini.json',
    'templates/product.zavelyn-handpan-master.json',
    'templates/product.zavelyn-rain-drum.json',
    'templates/product.zavelyn-foot-sleeves.json',
    'templates/product.device.json',
    'templates/product.cdf.json',
    'templates/product.zavelyn.json',
    'templates/product.balm.json',
    'templates/product.regrip.json',
    'templates/product.willa.json'
  ];

  const sectionsToBackup = [
    'sections/srefalsteam-funnel.liquid',
    'sections/thoson-magtrack-funnel.liquid',
    'sections/yeoman-sweep-funnel.liquid',
    'sections/heating-lamp-funnel.liquid',
    'sections/zhp-pdp-hero.liquid',
    'sections/zhp-pdp-banner.liquid',
    'sections/zhp-pdp-experience.liquid',
    'sections/zhp-pdp-included.liquid',
    'sections/zhp-pdp-specs.liquid',
    'sections/zhp-pdp-shipping.liquid',
    'sections/zhp-pdp-reviews.liquid',
    'sections/zhp-pdp-faq.liquid',
    'sections/zhp-pdp-sticky-bar.liquid',
    'sections/offer-balm.liquid',
    'sections/offer-cdf.liquid',
    'sections/offer-device.liquid',
    'sections/offer-zavelyn.liquid',
    'sections/offer-landing.liquid',
    'sections/zavelyn-pdp-main.liquid',
    'sections/zavelyn-pdp-shipping.liquid',
    'snippets/zavelyn-pdp-data.liquid'
  ];

  const manifest = {
    timestamp: new Date().toISOString(),
    themeId: DRAFT_THEME_ID,
    shop: SHOP,
    assets: {}
  };

  const allKeys = [...templatesToBackup, ...sectionsToBackup];

  for (const k of allKeys) {
    const content = await fetchAsset(token, k);
    if (content !== null) {
      const hash = crypto.createHash('sha256').update(content).digest('hex');
      const filename = k.replace(/\//g, '__');
      fs.writeFileSync(path.join(backupDir, filename), content, 'utf8');
      manifest.assets[k] = {
        size: content.length,
        sha256: hash,
        savedTo: filename
      };
      console.log(`Backed up ${k}: ${content.length} bytes (SHA: ${hash.slice(0, 10)}...)`);
    } else {
      console.log(`[Optional/Missing] ${k} not found on remote theme`);
    }
  }

  fs.writeFileSync('backup_manifest_phase_a.json', JSON.stringify(manifest, null, 2), 'utf8');
  console.log(`\nManifest generated with ${Object.keys(manifest.assets).length} files.`);
}

run().catch(err => {
  console.error('Phase A Error:', err);
  process.exit(1);
});
