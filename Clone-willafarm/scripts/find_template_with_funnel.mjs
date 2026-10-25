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

  // Let's inspect templates/index.json, templates/product.json, and other product templates
  const aRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/themes/${THEME_ID}/assets.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const aData = await aRes.json();
  const jsonTemplates = aData.assets.map(a => a.key).filter(k => k.startsWith('templates/'));

  for (const k of jsonTemplates) {
    const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/themes/${THEME_ID}/assets.json?asset[key]=${encodeURIComponent(k)}`, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    const d = await res.json();
    const val = d.asset?.value || '';
    if (val.includes('heating') || val.includes('funnel') || k === 'templates/index.json' || k === 'templates/product.json') {
      console.log(`\n=== ${k} ===`);
      console.log(val);
    }
  }
}

main().catch(console.error);
