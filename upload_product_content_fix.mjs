import fs from 'fs';

const CLIENT_ID = '82d6aaab9e73809cb37b6643302b1255';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "SHOPIFY_SECRET_TOKEN";
const SHOP_DOMAIN = 'vwpb1k-8z.myshopify.com';
const THEME_ID = '189555966106';

async function fetchWithRetry(url, options, maxRetries = 5, delay = 1000) {
  for (let i = 1; i <= maxRetries; i++) {
    try {
      const res = await fetch(url, options);
      return res;
    } catch (err) {
      console.warn(`[Retry ${i}/${maxRetries}] Fetch failed: ${err.message}. Waiting ${delay}ms...`);
      if (i === maxRetries) throw err;
      await new Promise(r => setTimeout(r, delay));
      delay *= 1.5;
    }
  }
}

async function upload() {
  console.log('Authenticating with Shopify Admin...');
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
  if (!access_token) {
    throw new Error('Could not get access token');
  }

  const value = fs.readFileSync('Clone-trybronoir/sections/bronoir-product-content.liquid', 'utf8');
  console.log(`Uploading sections/bronoir-product-content.liquid (${value.length} bytes) to theme ${THEME_ID}...`);

  const putRes = await fetchWithRetry(`https://${SHOP_DOMAIN}/admin/api/2025-01/themes/${THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': access_token
    },
    body: JSON.stringify({
      asset: {
        key: 'sections/bronoir-product-content.liquid',
        value
      }
    })
  });

  const data = await putRes.json();
  if (data.errors) {
    console.error('Upload Error:', data.errors);
  } else {
    console.log('Successfully updated:', data.asset?.key, 'at', data.asset?.updated_at);
  }
}

upload().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
