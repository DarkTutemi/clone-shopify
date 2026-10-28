import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP = 'dsdujr-vn.myshopify.com';
const DRAFT_THEME_ID = '187597717689';

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
  console.log('=== BACKUP HANDPANS ASSETS ON DRAFT THEME ===');
  const token = await getAccessToken();

  const backupDir = 'backup_handpans_phase';
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

  const filesToBackup = [
    'templates/collection.zavelyn-handpans.json',
    'sections/zavelyn-handpans-collection.liquid',
    'sections/zhp-marquee.liquid',
    'sections/zhp-hero.liquid',
    'sections/zhp-bestsellers.liquid',
    'sections/zhp-model-tabs.liquid',
    'sections/zhp-what-you-get.liquid',
    'sections/zhp-endorsements.liquid',
    'sections/zhp-comparison.liquid',
    'sections/zhp-buyers-guide.liquid',
    'sections/zhp-reviews.liquid',
    'sections/zhp-faq.liquid',
    'assets/zhp-collection.css',
    'assets/zhp-collection.js',
    'assets/zhp-pdp.css',
    'assets/zhp-pdp.js',
    'templates/product.zavelyn-handpan-master.json',
    'templates/product.zavelyn-drum-pro.json',
    'templates/product.zavelyn-drum-plus.json',
    'templates/product.zavelyn-drum-mini.json',
    'templates/product.zavelyn-rain-drum.json',
    'sections/zhp-pdp-banner.liquid',
    'sections/zhp-pdp-experience.liquid',
    'sections/zhp-pdp-included.liquid',
    'sections/zhp-pdp-specs.liquid',
    'sections/zhp-pdp-reviews.liquid',
    'sections/zhp-pdp-faq.liquid'
  ];

  const manifest = {
    timestamp: new Date().toISOString(),
    draft_theme_id: DRAFT_THEME_ID,
    files: []
  };

  for (const f of filesToBackup) {
    const content = await fetchAsset(token, f);
    if (content !== null) {
      const safeFilename = f.replace(/[\/\\]/g, '__');
      const filePath = path.join(backupDir, safeFilename);
      fs.writeFileSync(filePath, content, 'utf8');

      const hash = crypto.createHash('sha256').update(content).digest('hex');
      manifest.files.push({
        key: f,
        localFile: safeFilename,
        sizeBytes: Buffer.byteLength(content, 'utf8'),
        sha256: hash
      });
      console.log(`✔ Backed up: ${f} (${content.length} chars)`);
    } else {
      console.log(`⚠ Asset not found: ${f}`);
    }
  }

  fs.writeFileSync('backup_manifest_handpans.json', JSON.stringify(manifest, null, 2));
  console.log('Backup completed. Manifest saved to backup_manifest_handpans.json');
}

run().catch(console.error);
