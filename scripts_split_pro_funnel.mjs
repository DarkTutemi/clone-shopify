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

  // Split by section comments
  const secParts = liquid.split(/<!--\s*([0-9]+\.[^>]+)-->/);
  console.log('Total parts:', secParts.length);
  console.log('Part 0 (Header/CSS):\n', secParts[0].slice(0, 1000));
  if (secParts[0].length > 1000) {
    console.log('... Part 0 tail:\n', secParts[0].slice(-500));
  }
  for (let i = 1; i < secParts.length; i += 2) {
    const secName = secParts[i].trim();
    const secBody = secParts[i+1] || '';
    console.log(`Part ${Math.floor(i/2) + 1}: ${secName} (length: ${secBody.length})`);
  }
}

run().catch(console.error);
