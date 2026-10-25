import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "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";
const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const THEME_ID = '186607567033';

async function fetchWithRetry(url, options, maxRetries = 5, delay = 1000) {
  for (let i = 1; i <= maxRetries; i++) {
    try {
      const res = await fetch(url, options);
      return res;
    } catch (err) {
      console.warn(`[Retry ${i}/${maxRetries}] ${err.message}. Retrying in ${delay}ms...`);
      if (i === maxRetries) throw err;
      await new Promise(r => setTimeout(r, delay));
      delay *= 1.5;
    }
  }
}

async function uploadFile(key, localPath, token) {
  const value = fs.readFileSync(localPath, 'utf8');
  console.log(`Uploading ${key} (${value.length} bytes) to theme ${THEME_ID}...`);

  const res = await fetchWithRetry(`https://${SHOP_DOMAIN}/admin/api/2025-01/themes/${THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      asset: { key, value }
    })
  });

  const data = await res.json();
  if (data.errors) {
    console.error(`Error uploading ${key}:`, data.errors);
  } else {
    console.log(`✔ Successfully updated: ${key} at ${data.asset?.updated_at}`);
  }
}

async function main() {
  console.log('Authenticating...');
  const tokenRes = await fetchWithRetry(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials'
    })
  });

  const { access_token } = await tokenRes.json();
  if (!access_token) throw new Error('Token failed');

  await uploadFile('sections/bronoir-collection.liquid', 'Clone-trybronoir/sections/bronoir-collection.liquid', access_token);
  await uploadFile('snippets/bronoir-product-card.liquid', 'Clone-trybronoir/snippets/bronoir-product-card.liquid', access_token);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
