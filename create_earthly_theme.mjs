import fs from 'fs';

const CLIENT_ID = '82d6aaab9e73809cb37b6643302b1255';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "SHOPIFY_SECRET_TOKEN";
const SHOP_DOMAIN = 'vwpb1k-8z.myshopify.com';

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

async function createEarthlyTheme() {
  const token = await getAccessToken();
  console.log('Got token.');

  // Create theme "Clone-earthlyderm"
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2026-01/themes.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      theme: {
        name: 'Clone-earthlyderm',
        role: 'unpublished'
      }
    })
  });
  const data = await res.json();
  console.log('Created Theme response:', data);
  if (data.theme?.id) {
    fs.writeFileSync('h:/Shopify-Clone/Clone-earthlyderm/theme_id.json', JSON.stringify({ theme_id: data.theme.id }, null, 2));
    console.log(`Saved Theme ID: ${data.theme.id}`);
  }
}

createEarthlyTheme().catch(console.error);
