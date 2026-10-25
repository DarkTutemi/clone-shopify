const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const THEME_ID = '186607567033';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || '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';

async function main() {
  const tRes = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const tData = await tRes.json();
  const token = tData.access_token;

  for (const t of [
    'templates/product.thoson-magtrack.liquid',
    'templates/product.srefalsteam.liquid'
  ]) {
    const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/themes/${THEME_ID}/assets.json?asset[key]=${encodeURIComponent(t)}`, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    const d = await res.json();
    console.log(`=== ${t} === (first 200 chars)`);
    console.log(d.asset?.value?.slice(0, 200));
  }
}

main().catch(console.error);
