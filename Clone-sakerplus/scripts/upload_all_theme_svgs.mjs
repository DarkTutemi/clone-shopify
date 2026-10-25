import fs from 'fs';
import path from 'path';

const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const THEME_ID = '186607567033';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "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";

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

async function uploadThemeAsset(token, key, value) {
  const url = `https://${SHOP_DOMAIN}/admin/api/2024-10/themes/${THEME_ID}/assets.json`;
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
  return res.ok;
}

async function main() {
  const token = await getAccessToken();
  const assetsDir = 'Clone-sakerplus/theme/assets';
  const svgs = fs.readdirSync(assetsDir).filter(f => f.endsWith('.svg'));

  console.log(`Uploading ${svgs.length} SVG assets to theme...`);
  let successCount = 0;
  for (const svg of svgs) {
    const content = fs.readFileSync(path.join(assetsDir, svg), 'utf-8');
    const ok = await uploadThemeAsset(token, `assets/${svg}`, content);
    if (ok) {
      successCount++;
    } else {
      console.warn(`  ✗ Failed: ${svg}`);
    }
  }
  console.log(`Completed: ${successCount}/${svgs.length} SVGs uploaded!`);
}

main().catch(console.error);
