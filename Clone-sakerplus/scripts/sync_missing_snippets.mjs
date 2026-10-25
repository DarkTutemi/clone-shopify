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
  if (res.ok) {
    console.log(`  ✔ Uploaded: ${key}`);
    return true;
  } else {
    const err = await res.text();
    console.error(`  ✗ Failed ${key}:`, err.slice(0, 150));
    return false;
  }
}

async function main() {
  const token = await getAccessToken();

  const snippets = fs.readdirSync('Clone-sakerplus/theme/snippets').filter(f => f.endsWith('.liquid'));

  for (const s of snippets) {
    const filePath = path.join('Clone-sakerplus/theme/snippets', s);
    const content = fs.readFileSync(filePath, 'utf-8');
    await uploadThemeAsset(token, `snippets/${s}`, content);
  }
}

main().catch(console.error);
