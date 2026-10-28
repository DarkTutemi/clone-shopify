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

async function findReferences() {
  const token = await getAccessToken();
  const aRes = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${DRAFT_THEME_ID}/assets.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const { assets } = await aRes.json();
  const templates = assets.filter(a => a.key.startsWith('templates/') && a.key.endsWith('.json'));

  console.log(`Checking ${templates.length} templates for shipping section references...`);
  for (const t of templates) {
    const res = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${DRAFT_THEME_ID}/assets.json?asset[key]=${encodeURIComponent(t.key)}`, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    const data = await res.json();
    const val = data.asset?.value || '';
    if (val.includes('shipping') || val.includes('zhp')) {
      const parsed = JSON.parse(val);
      const matchedSections = Object.entries(parsed.sections || {}).filter(([k, v]) => v.type.includes('shipping') || v.type.includes('zhp'));
      if (matchedSections.length > 0) {
        console.log(`\nTemplate: ${t.key}`);
        console.log(matchedSections);
      }
    }
  }
}

findReferences().catch(console.error);
