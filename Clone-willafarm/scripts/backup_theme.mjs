import fs from 'fs';

const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const THEME_ID = '186607567033';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || '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';

async function getAccessToken() {
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials'
    })
  });
  const data = await res.json();
  return data.access_token;
}

async function main() {
  const token = await getAccessToken();
  console.log('Got access token.');

  fs.mkdirSync('Clone-willafarm/backup', { recursive: true });
  fs.mkdirSync('Clone-willafarm/data', { recursive: true });
  fs.mkdirSync('Clone-willafarm/scripts', { recursive: true });
  fs.mkdirSync('Clone-willafarm/theme/sections', { recursive: true });
  fs.mkdirSync('Clone-willafarm/theme/snippets', { recursive: true });
  fs.mkdirSync('Clone-willafarm/theme/templates', { recursive: true });
  fs.mkdirSync('Clone-willafarm/reports', { recursive: true });

  // 1. Create a Shopify Theme duplicate for safety
  console.log('Duplicating active theme 186607567033 as backup...');
  const dupRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/themes.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      theme: {
        name: 'Backup Zavelyn Pre-WillaFarms (' + new Date().toISOString().split('T')[0] + ')',
        role: 'unpublished',
        src: `https://${SHOP_DOMAIN}/admin/api/2024-10/themes/${THEME_ID}.json`
      }
    })
  });
  const dupData = await dupRes.json();
  console.log('Backup theme creation response:', dupData.theme?.id, dupData.theme?.name);

  // 2. Download crucial layout and index files locally
  const assetsToBackup = [
    'templates/index.json',
    'config/settings_data.json',
    'sections/header-group.json',
    'sections/footer-group.json',
    'layout/theme.liquid'
  ];

  for (const assetKey of assetsToBackup) {
    try {
      const aRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/themes/${THEME_ID}/assets.json?asset[key]=${assetKey}`, {
        headers: { 'X-Shopify-Access-Token': token }
      });
      const aData = await aRes.json();
      if (aData.asset?.value) {
        const safeName = assetKey.replace(/\//g, '_');
        fs.writeFileSync(`Clone-willafarm/backup/${safeName}`, aData.asset.value);
        console.log(`  Saved backup: ${assetKey} (${aData.asset.value.length} bytes)`);
      }
    } catch (e) {
      console.error(`  Error backing up ${assetKey}:`, e.message);
    }
  }

  console.log('✔ Theme backup complete!');
}

main().catch(console.error);
