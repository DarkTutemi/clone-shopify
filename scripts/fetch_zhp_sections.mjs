import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP = 'dsdujr-vn.myshopify.com';
const DRAFT_THEME_ID = '187597717689';

async function getAccessToken() {
  const tRes = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await tRes.json();
  return data.access_token;
}

async function fetchAsset(token, key) {
  const res = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${DRAFT_THEME_ID}/assets.json?asset[key]=${encodeURIComponent(key)}`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.asset?.value || null;
}

async function run() {
  const token = await getAccessToken();

  const sectionsToCheck = [
    'sections/zhp-pdp-banner.liquid',
    'sections/zhp-pdp-experience.liquid',
    'sections/zhp-pdp-included.liquid',
    'sections/zhp-pdp-specs.liquid',
    'sections/zhp-hero.liquid',
    'sections/zhp-bestsellers.liquid',
    'sections/zhp-model-tabs.liquid',
    'sections/zhp-what-you-get.liquid',
    'sections/zhp-comparison.liquid',
    'sections/zhp-buyers-guide.liquid',
    'sections/zhp-faq.liquid',
    'sections/zavelyn-handpans-collection.liquid',
    'layout/theme.liquid'
  ];

  const contents = {};
  for (const s of sectionsToCheck) {
    const val = await fetchAsset(token, s);
    contents[s] = val;
    console.log(`Fetched ${s}: ${val ? val.length + ' chars' : 'NOT FOUND'}`);
  }

  fs.writeFileSync('scripts/zhp_sections_contents.json', JSON.stringify(contents, null, 2));
}

run().catch(console.error);
