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

  const res = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${THEME_ID}/assets.json?asset[key]=sections/zavelyn-drum-pro-funnel.liquid`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  const liquid = data.asset.value;
  console.log('zavelyn-drum-pro-funnel.liquid size:', liquid.length);

  // Find all sections or sections headings in liquid
  const secRegex = /<!--\s*([0-9]+\.[^>]+)-->/g;
  let m;
  console.log('Sections inside zavelyn-drum-pro-funnel.liquid:');
  while ((m = secRegex.exec(liquid)) !== null) {
    console.log(m[1].trim());
  }

  // Check schema at the end
  const schemaIdx = liquid.indexOf('{% schema %}');
  console.log('Schema:\n', liquid.slice(schemaIdx));
}

run().catch(console.error);
