import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP = 'dsdujr-vn.myshopify.com';
const DRAFT_THEME_ID = '187597717689';

async function inspectTpls() {
  const tRes = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const { access_token } = await tRes.json();
  
  for (const k of ['templates/product.json', 'templates/product.willa.json']) {
    const res = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${DRAFT_THEME_ID}/assets.json?asset[key]=${k}`, {
      headers: { 'X-Shopify-Access-Token': access_token }
    });
    const d = await res.json();
    console.log(`\n=================== ${k} ===================`);
    console.log(d.asset?.value);
  }
}

inspectTpls().catch(console.error);
