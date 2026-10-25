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

  const res = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${THEME_ID}/assets.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  const liquidAssets = data.assets.filter(a => a.key.endsWith('.liquid'));

  console.log(`Checking ${liquidAssets.length} liquid files for stars...`);

  const starMatches = [];

  for (const a of liquidAssets) {
    const aRes = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${THEME_ID}/assets.json?asset[key]=${encodeURIComponent(a.key)}`, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    const aData = await aRes.json();
    if (!aData.asset || !aData.asset.value) continue;
    const content = aData.asset.value;

    if (content.includes('★') || content.includes('star') || content.includes('trustpilot')) {
      // Find lines with stars
      const lines = content.split('\n');
      lines.forEach((line, idx) => {
        if (line.includes('★') || line.includes('trustpilot') || (line.includes('star') && (line.includes('rating') || line.includes('review') || line.includes('wf-stars') || line.includes('zhp-stars')))) {
          starMatches.push({
            file: a.key,
            lineNum: idx + 1,
            text: line.trim()
          });
        }
      });
    }
  }

  console.log(`Found ${starMatches.length} star references:`);
  starMatches.forEach(m => {
    console.log(`[${m.file}:${m.lineNum}] ${m.text}`);
  });
}

run().catch(console.error);
