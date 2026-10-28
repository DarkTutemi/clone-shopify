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

async function run() {
  const token = await getAccessToken();

  // 1. Fetch collection details
  const colRes = await fetch(`https://${SHOP}/admin/api/2024-10/custom_collections.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const customCols = await colRes.json();
  const smartColRes = await fetch(`https://${SHOP}/admin/api/2024-10/smart_collections.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const smartCols = await smartColRes.json();

  const allCols = [...(customCols.custom_collections || []), ...(smartCols.smart_collections || [])];
  const handpanCol = allCols.find(c => c.handle === 'zavelyn-handpans' || c.title.toLowerCase().includes('handpan'));

  console.log('Collection found:', handpanCol ? {
    id: handpanCol.id,
    title: handpanCol.title,
    handle: handpanCol.handle,
    template_suffix: handpanCol.template_suffix,
    body_html_length: handpanCol.body_html?.length || 0,
    body_html_preview: handpanCol.body_html?.slice(0, 200)
  } : 'NOT FOUND');

  // 2. Fetch list of assets on draft theme matching collection or handpan
  const assetsRes = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${DRAFT_THEME_ID}/assets.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const assetsData = await assetsRes.json();
  const allAssets = assetsData.assets || [];

  const collectionAssets = allAssets.filter(a => a.key.includes('collection') || a.key.includes('handpan') || a.key.includes('drum'));
  console.log('Matching assets on Draft Theme:', collectionAssets.map(a => a.key));

  fs.writeFileSync('scripts/audit_handpan_col_raw.json', JSON.stringify({
    handpanCol,
    matchingAssets: collectionAssets.map(a => a.key)
  }, null, 2));
}

run().catch(console.error);
