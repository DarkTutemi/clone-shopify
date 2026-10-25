import fs from 'fs';

const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const THEME_ID = '186607567033';

async function getAccessToken() {
  const tokenRes = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await tokenRes.json();
  return data.access_token;
}

async function uploadAsset(token, key, value) {
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-01/themes/${THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({ asset: { key, value } })
  });
  const data = await res.json();
  if (data.errors) throw new Error(`Asset error on ${key}: ${JSON.stringify(data.errors)}`);
  return data;
}

async function main() {
  const token = await getAccessToken();

  // 1. Upload section
  const sectionContent = fs.readFileSync('sections_zavelyn_track_order.liquid', 'utf8');
  console.log('Uploading sections/zavelyn-track-order.liquid...');
  await uploadAsset(token, 'sections/zavelyn-track-order.liquid', sectionContent);
  console.log('✔ Uploaded sections/zavelyn-track-order.liquid');

  // 2. Upload template page.track-order.json (without "layout": "offer")
  const templatePayload = {
    sections: {
      main: {
        type: 'zavelyn-track-order',
        settings: {}
      }
    },
    order: ['main']
  };

  console.log('Updating templates/page.track-order.json...');
  await uploadAsset(token, 'templates/page.track-order.json', JSON.stringify(templatePayload, null, 2));
  console.log('✔ Updated templates/page.track-order.json');
}

main().catch(console.error);
