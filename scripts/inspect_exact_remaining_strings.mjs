import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const DRAFT_THEME_ID = '187597717689';

async function checkRemaining() {
  const token = await getAccessToken();
  const keys = [
    'sections/willa-comparison.liquid',
    'sections/willa-faq.liquid',
    'sections/willa-reviews.liquid',
    'sections/zavelyn-pdp-main.liquid',
    'sections/zavelyn-pdp-shipping.liquid'
  ];

  for (const k of keys) {
    const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${DRAFT_THEME_ID}/assets.json?asset[key]=${encodeURIComponent(k)}`, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    const data = await res.json();
    const val = data.asset?.value || '';
    const lines = val.split('\n');
    lines.forEach((l, idx) => {
      if (/\b(60[- ]day|90[- ]day|risk[- ]free)\b/i.test(l)) {
        console.log(`[${k}:${idx + 1}] ${l.trim().slice(0, 140)}`);
      }
    });
  }
}

checkRemaining().catch(console.error);
