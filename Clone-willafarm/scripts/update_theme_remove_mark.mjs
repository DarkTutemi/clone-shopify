import fs from 'fs';

const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const THEME_ID = '186607567033';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || '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';

async function getAccessToken() {
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await res.json();
  return data.access_token;
}

async function uploadThemeAsset(token, key, value) {
  const url = `https://${SHOP_DOMAIN}/admin/api/2024-10/themes/${THEME_ID}/assets.json`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ asset: { key, value } })
  });
  const data = await res.json();
  if (res.ok) console.log(`  ✔ Uploaded: ${key}`);
  else console.error(`  ✗ Failed: ${key}`, JSON.stringify(data.errors || data));
}

async function run() {
  const token = await getAccessToken();

  const themeFiles = [
    'layout/theme.liquid',
    'sections/heating-lamp-funnel.liquid',
    'sections/willa-comparison.liquid',
    'sections/willa-featured-collection.liquid',
    'sections/willa-featured-product.liquid',
    'sections/willa-footer.liquid',
    'sections/willa-header.liquid',
    'sections/willa-hero.liquid',
    'sections/willa-reviews.liquid',
    'templates/product.json',
    'templates/product.sakerplus-livestock-heating-lamp.json'
  ];

  for (const fileKey of themeFiles) {
    const localPath = `Clone-willafarm/theme/${fileKey}`;
    if (!fs.existsSync(localPath)) {
      // Try to fetch from Shopify
      const fetchUrl = `https://${SHOP_DOMAIN}/admin/api/2024-10/themes/${THEME_ID}/assets.json?asset[key]=${encodeURIComponent(fileKey)}`;
      const res = await fetch(fetchUrl, { headers: { 'X-Shopify-Access-Token': token } });
      const data = await res.json();
      if (data.asset?.value) {
        fs.mkdirSync(localPath.substring(0, localPath.lastIndexOf('/')), { recursive: true });
        fs.writeFileSync(localPath, data.asset.value);
      } else {
        continue;
      }
    }

    let content = fs.readFileSync(localPath, 'utf8');
    if (content.includes('Zavelyn®')) {
      const updated = content.replace(/Zavelyn®/g, 'Zavelyn');
      fs.writeFileSync(localPath, updated);
      await uploadThemeAsset(token, fileKey, updated);
      console.log(`✔ Replaced Zavelyn® -> Zavelyn in ${fileKey}`);
    }
  }

  console.log('\n--- ALL THEME FILES UPDATED ---');
}

run().catch(console.error);
