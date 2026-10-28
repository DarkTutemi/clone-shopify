import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const DRAFT_THEME_ID = '187597717689';

async function fixWillaReviews() {
  const token = await getAccessToken();
  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${DRAFT_THEME_ID}/assets.json?asset[key]=sections/willa-reviews.liquid`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  let val = data.asset?.value || '';

  val = val.replace(/90-day peace of mind/gi, '30-day peace of mind')
           .replace(/The 90-day guarantee/gi, 'The 30-day guarantee')
           .replace(/90-Day Money-Back/gi, '30-Day Money-Back')
           .replace(/90-Day/gi, '30-Day')
           .replace(/60-Day/gi, '30-Day');

  const putRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${DRAFT_THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ asset: { key: 'sections/willa-reviews.liquid', value: val } })
  });
  console.log('willa-reviews.liquid updated on Draft Theme:', putRes.status === 200);
}

fixWillaReviews().catch(console.error);
