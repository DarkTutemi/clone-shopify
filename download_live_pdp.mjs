import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP = 'dsdujr-vn.myshopify.com';
const THEME_ID = '186607567033';

async function getAccessToken() {
  const res = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  return (await res.json()).access_token;
}

async function getAsset(token, key) {
  const res = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${THEME_ID}/assets.json?asset[key]=${encodeURIComponent(key)}`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  return data.asset ? data.asset.value : null;
}

async function run() {
  const token = await getAccessToken();
  const hero = await getAsset(token, 'sections/zhp-pdp-hero.liquid');
  fs.writeFileSync('Clone-pandadrum/live_zhp-pdp-hero.liquid', hero);
  console.log('Saved Clone-pandadrum/live_zhp-pdp-hero.liquid');

  const specs = await getAsset(token, 'sections/zhp-pdp-specs.liquid');
  fs.writeFileSync('Clone-pandadrum/live_zhp-pdp-specs.liquid', specs);
  console.log('Saved Clone-pandadrum/live_zhp-pdp-specs.liquid');

  const proTpl = await getAsset(token, 'templates/product.zavelyn-drum-pro.json');
  fs.writeFileSync('Clone-pandadrum/live_template_product.zavelyn-drum-pro.json', proTpl);
  console.log('Saved Clone-pandadrum/live_template_product.zavelyn-drum-pro.json');
}

run().catch(console.error);
