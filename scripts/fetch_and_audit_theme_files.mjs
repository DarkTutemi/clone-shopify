import fs from 'fs';
import path from 'path';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || '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';
const SHOP = 'dsdujr-vn.myshopify.com';
const THEME_ID = '186607567033';

async function getAccessToken() {
  const tRes = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await tRes.json();
  return data.access_token;
}

async function fetchAsset(key, token) {
  const res = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${THEME_ID}/assets.json?asset[key]=${encodeURIComponent(key)}`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const json = await res.json();
  return json.asset?.value || '';
}

async function main() {
  const token = await getAccessToken();
  const keys = [
    'layout/theme.liquid',
    'sections/willa-header.liquid',
    'sections/willa-featured-product.liquid',
    'sections/willa-collections-grid.liquid',
    'sections/willa-featured-collection.liquid',
    'sections/willa-footer.liquid'
  ];

  const outDir = 'c:/Users/Admin/Desktop/CLONE SPF/theme_audit';
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  for (const k of keys) {
    const val = await fetchAsset(k, token);
    const saveName = k.replace(/[\/\\]/g, '_');
    fs.writeFileSync(path.join(outDir, saveName), val, 'utf8');
    console.log(`Saved ${k} (${val.length} bytes) to ${saveName}`);
  }

  // Also check cart drawer
  const assetsRes = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${THEME_ID}/assets.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const { assets } = await assetsRes.json();
  const cartAssets = assets.filter(a => a.key.includes('cart'));
  console.log('Cart-related assets in theme:', cartAssets.map(a => a.key));

  for (const c of cartAssets) {
    const val = await fetchAsset(c.key, token);
    const saveName = c.key.replace(/[\/\\]/g, '_');
    fs.writeFileSync(path.join(outDir, saveName), val, 'utf8');
    console.log(`Saved ${c.key} (${val.length} bytes)`);
  }
}

main().catch(console.error);
