import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "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";
const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const LIVE_THEME_ID = '187597717689';

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

async function main() {
  const token = await getAccessToken();

  const cssRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2026-01/themes/${LIVE_THEME_ID}/assets.json?asset[key]=assets/botanaroots-bundle.css`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const cssData = await cssRes.json();
  if (cssData.asset?.value) {
    fs.writeFileSync('backups/live_botanaroots-bundle.css.bak', cssData.asset.value);
    console.log('Saved backups/live_botanaroots-bundle.css.bak');
  }
}

main().catch(console.error);
