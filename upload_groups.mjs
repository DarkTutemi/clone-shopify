import fs from 'fs';

const CLIENT_ID = '82d6aaab9e73809cb37b6643302b1255';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "SHOPIFY_SECRET_TOKEN";
const SHOP_DOMAIN = 'vwpb1k-8z.myshopify.com';
const THEME_ID = '189572219034';

async function getAccessToken() {
  const tokenRes = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials'
    })
  });
  const data = await tokenRes.json();
  return data.access_token;
}

async function uploadGroupFiles() {
  const token = await getAccessToken();

  for (const rel of ['sections/header-group.json', 'sections/footer-group.json']) {
    const fullPath = `h:/Shopify-Clone/Clone-earthlyderm/${rel}`;
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2026-01/themes/${THEME_ID}/assets.json`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': token
        },
        body: JSON.stringify({
          asset: { key: rel, value: content }
        })
      });
      const data = await res.json();
      console.log(`Upload ${rel}:`, data.asset ? 'SUCCESS' : JSON.stringify(data));
    }
  }
}

uploadGroupFiles().catch(console.error);
