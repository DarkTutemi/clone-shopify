import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP = 'dsdujr-vn.myshopify.com';
const THEME_ID = '186607567033';

async function getAccessToken() {
  const res = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials'
    })
  });
  const data = await res.json();
  return data.access_token;
}

async function run() {
  const token = await getAccessToken();
  console.log('Got access token');

  // 1. Fetch current templates/collection.zavelyn-handpans.json from live theme
  const tplRes = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${THEME_ID}/assets.json?asset[key]=templates/collection.zavelyn-handpans.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const tplData = await tplRes.json();
  fs.writeFileSync('Clone-pandadrum/live_template_collection.zavelyn-handpans.json', tplData.asset.value, 'utf8');
  console.log('Saved live_template_collection.zavelyn-handpans.json:');
  console.log(tplData.asset.value);

  // 2. Fetch current sections/zhp-bestsellers.liquid or any other zhp section
  const secRes = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${THEME_ID}/assets.json?asset[key]=sections/zhp-bestsellers.liquid`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const secData = await secRes.json();
  fs.writeFileSync('Clone-pandadrum/live_zhp-bestsellers.liquid', secData.asset ? secData.asset.value : 'none', 'utf8');

  // 3. Check 3 handpan products on Shopify API to see if their images changed
  const handles = ['zavelyn-drum-pro', 'zavelyn-drum-plus', 'zavelyn-drum-mini'];
  for (const h of handles) {
    const pRes = await fetch(`https://${SHOP}/admin/api/2024-10/products.json?handle=${h}`, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    const pData = await pRes.json();
    const p = pData.products[0];
    console.log(`\nProduct ${p.title}:`);
    console.log('Images count:', p.images.length);
    p.images.forEach((img, i) => console.log(`  [${i}]: ${img.id} -> ${img.src}`));
  }
}

run().catch(console.error);
