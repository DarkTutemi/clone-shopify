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

  const legacyTemplates = [
    'templates/product.thoson-magtrack.liquid',
    'templates/product.srefalsteam.liquid',
    'templates/product.yeoman-sweep.liquid'
  ];

  if (!fs.existsSync('Clone-willafarm/backup')) {
    fs.mkdirSync('Clone-willafarm/backup', { recursive: true });
  }

  for (const key of legacyTemplates) {
    console.log(`Checking ${key}...`);
    const res = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${THEME_ID}/assets.json?asset[key]=${encodeURIComponent(key)}`, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    const d = await res.json();
    if (d.asset && d.asset.value) {
      const backupPath = 'Clone-willafarm/backup/' + key.replace(/[\/\\]/g, '_');
      fs.writeFileSync(backupPath, d.asset.value, 'utf8');
      console.log(`  ✔ Backed up to ${backupPath}`);

      // Delete the legacy liquid template
      const delRes = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${THEME_ID}/assets.json?asset[key]=${encodeURIComponent(key)}`, {
        method: 'DELETE',
        headers: { 'X-Shopify-Access-Token': token }
      });
      const delData = await delRes.json();
      console.log(`  ✔ Deleted ${key}:`, delData);
    } else {
      console.log(`  ℹ ${key} does not exist or has no content`);
    }
  }

  // Now upload templates/product.thoson-magtrack.json
  const thosonJson = JSON.stringify({
    name: "Thoson MagTrack Funnel",
    wrapper: "div#shopify-section-thoson-magtrack",
    sections: {
      "main": {
        type: "thoson-magtrack-funnel",
        settings: {}
      }
    },
    order: ["main"]
  }, null, 2);

  const putRes = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      asset: {
        key: 'templates/product.thoson-magtrack.json',
        value: thosonJson
      }
    })
  });
  const putData = await putRes.json();
  console.log('Upload product.thoson-magtrack.json:', putData);
}

run().catch(console.error);
