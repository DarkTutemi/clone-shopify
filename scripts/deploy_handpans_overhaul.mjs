import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP = 'dsdujr-vn.myshopify.com';
const DRAFT_THEME_ID = '187597717689';
const LIVE_THEME_ID = '186607567033';

if (DRAFT_THEME_ID === LIVE_THEME_ID) {
  throw new Error('CRITICAL SAFETY FAILURE: TARGETING LIVE THEME IS FORBIDDEN!');
}

async function getAccessToken() {
  const tRes = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await tRes.json();
  return data.access_token;
}

async function uploadAsset(token, key, value) {
  const res = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${DRAFT_THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({ asset: { key, value } })
  });
  const data = await res.json();
  if (data.asset) {
    console.log(`✔ Uploaded to Draft Theme (${DRAFT_THEME_ID}): ${key}`);
    return true;
  } else {
    console.error(`✗ Failed to upload: ${key}`, JSON.stringify(data.errors || data));
    return false;
  }
}

async function run() {
  console.log('=== DEPLOYING HANDPANS OVERHAUL TO DRAFT THEME ===');
  const token = await getAccessToken();

  const filesToUpload = [
    'assets/zhp-collection.css',
    'assets/zhp-collection.js',
    'assets/zhp-pdp.css',
    'sections/zhp-marquee.liquid',
    'sections/zhp-hero.liquid',
    'sections/zhp-bestsellers.liquid',
    'sections/zhp-comparison.liquid',
    'sections/zhp-model-tabs.liquid',
    'sections/zhp-buyers-guide.liquid',
    'sections/zhp-what-you-get.liquid',
    'sections/zhp-faq.liquid',
    'templates/collection.zavelyn-handpans.json',
    'sections/zhp-pdp-banner.liquid',
    'sections/zhp-pdp-experience.liquid',
    'sections/zhp-pdp-included.liquid',
    'sections/zhp-pdp-specs.liquid',
    'sections/zhp-pdp-faq.liquid',
    'templates/product.zavelyn-handpan-master.json',
    'templates/product.zavelyn-drum-pro.json',
    'templates/product.zavelyn-drum-plus.json',
    'templates/product.zavelyn-drum-mini.json',
    'templates/product.zavelyn-rain-drum.json'
  ];

  let successCount = 0;
  for (const f of filesToUpload) {
    if (!fs.existsSync(f)) {
      console.error(`File missing locally: ${f}`);
      continue;
    }
    const content = fs.readFileSync(f, 'utf8');
    const ok = await uploadAsset(token, f, content);
    if (ok) successCount++;
  }

  console.log(`\nDeployment finished: ${successCount}/${filesToUpload.length} files successfully uploaded.`);
}

run().catch(console.error);
