import fs from 'fs';
import path from 'path';

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

async function backupAssets() {
  const token = await getAccessToken();
  const keys = [
    'sections/announcement-bar.liquid',
    'config/settings_data.json',
    'sections/zavelyn-pdp-main.liquid',
    'assets/zavelyn-elixir.css',
    'assets/willa-product.css',
    'sections/cart-drawer.liquid',
    'sections/willa-main-collection.liquid',
    'layout/theme.liquid'
  ];

  const backupDir = 'draft_theme_pre_fix_backup';
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });

  for (const k of keys) {
    const val = await fetchAsset(token, k);
    if (val) {
      const safeName = k.replace(/\//g, '__');
      fs.writeFileSync(path.join(backupDir, safeName), val, 'utf8');
      console.log(`Backed up ${k} (${val.length} bytes)`);
    } else {
      console.log(`Asset ${k} not found!`);
    }
  }
}

backupAssets();
