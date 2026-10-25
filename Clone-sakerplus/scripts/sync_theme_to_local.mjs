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

async function downloadAsset(token, key) {
  const url = `https://${SHOP_DOMAIN}/admin/api/2024-10/themes/${THEME_ID}/assets.json?asset[key]=${encodeURIComponent(key)}`;
  const res = await fetch(url, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.asset?.value;
}

async function main() {
  const token = await getAccessToken();

  const keysToSync = [
    'sections/fence-post-advertorial.liquid',
    'sections/saker-homepage-hero.liquid',
    'sections/saker-trust-badges.liquid',
    'sections/saker-reviews-widget.liquid',
    'templates/page.fence-funnel.liquid',
    'templates/product.json',
    'templates/index.json',
    'assets/fence-advertorial.css'
  ];

  for (const k of keysToSync) {
    const val = await downloadAsset(token, k);
    if (val) {
      const destPath = path.join('Clone-sakerplus/theme', k);
      fs.mkdirSync(path.dirname(destPath), { recursive: true });
      fs.writeFileSync(destPath, val, 'utf8');
      console.log(`✔ Synced ${k} to Clone-sakerplus/theme/${k}`);
    }
  }
}

main();
