import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const DRAFT_THEME_ID = '187597717689';

async function updateComparisonElixir() {
  const token = await getAccessToken();
  const headers = { 'X-Shopify-Access-Token': token, 'Content-Type': 'application/json' };

  const key = 'sections/zavelyn-comparison-elixir.liquid';
  const getUrl = `https://${SHOP}/admin/api/${API_VERSION}/themes/${DRAFT_THEME_ID}/assets.json?asset[key]=${encodeURIComponent(key)}`;
  const res = await fetch(getUrl, { headers });
  const data = await res.json();
  let val = data.asset?.value || '';

  console.log('Matches in', key, ':', val.match(/risk[- ]free|60[- ]day|90[- ]day/gi));

  let modified = val
    .replaceAll('<td><strong>Risk-Free Guarantee</strong></td>', '<td><strong>Satisfaction Guarantee</strong></td>')
    .replaceAll('60-Day 100% Money-Back Trial', '30-Day Money-Back Guarantee')
    .replaceAll('60-Day Risk-Free Guarantee', '30-Day Money-Back Guarantee')
    .replaceAll('Risk-Free Guarantee', 'Satisfaction Guarantee');

  if (modified !== val) {
    const putUrl = `https://${SHOP}/admin/api/${API_VERSION}/themes/${DRAFT_THEME_ID}/assets.json`;
    const putRes = await fetch(putUrl, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ asset: { key, value: modified } })
    });
    const putData = await putRes.json();
    if (putData.asset) {
      console.log(`[SUCCESS] Updated ${key}`);
    } else {
      console.error(`[ERROR] Failed to update ${key}:`, putData.errors);
    }
  } else {
    console.log(`No changes needed for ${key}`);
  }
}

updateComparisonElixir();
