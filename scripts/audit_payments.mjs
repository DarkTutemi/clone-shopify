import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP = 'dsdujr-vn.myshopify.com';
const DRAFT_THEME_ID = '187597717689';

async function getAccessToken() {
  const tRes = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await tRes.json();
  return data.access_token;
}

async function fetchAsset(token, key) {
  const res = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${DRAFT_THEME_ID}/assets.json?asset[key]=${encodeURIComponent(key)}`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.asset.value;
}

async function main() {
  const token = await getAccessToken();

  const assetsRes = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${DRAFT_THEME_ID}/assets.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const assetsData = await assetsRes.json();
  const paymentAssets = assetsData.assets.filter(a => a.key.includes('payment') || a.key.includes('icon-') || a.key.includes('badge'));
  console.log('Payment & Badge assets in theme:', paymentAssets.map(a => a.key));

  // Check how footer renders payment icons
  const footerVal = await fetchAsset(token, 'sections/footer.liquid') || await fetchAsset(token, 'sections/willa-footer.liquid');
  if (footerVal) {
    const lines = footerVal.split('\n').filter(l => l.includes('payment'));
    console.log('\nPayment references in footer:', lines.slice(0, 10));
  }
}

main().catch(console.error);
