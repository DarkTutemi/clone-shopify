import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const DRAFT_THEME_ID = '187597717689';

async function checkDraftThemeDirect() {
  const token = await getAccessToken();
  const keys = [
    'sections/header-group.json',
    'sections/willa-header.liquid',
    'sections/willa-comparison.liquid',
    'sections/willa-faq.liquid',
    'sections/willa-reviews.liquid',
    'sections/willa-cart-drawer.liquid',
    'sections/zavelyn-pdp-main.liquid',
    'sections/zavelyn-pdp-shipping.liquid'
  ];

  for (const k of keys) {
    const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${DRAFT_THEME_ID}/assets.json?asset[key]=${encodeURIComponent(k)}`, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    const data = await res.json();
    const val = data.asset?.value || '';
    const has60 = /60[- ]day/i.test(val);
    const has90 = /90[- ]day/i.test(val);
    const hasRiskFree = /risk[- ]free\s*(trial|guarantee)?/i.test(val);
    const has30 = /30[- ]day/i.test(val);
    console.log(`[DRAFT ${k}] 60-day: ${has60} | 90-day: ${has90} | Risk-Free: ${hasRiskFree} | 30-day: ${has30}`);
  }
}

checkDraftThemeDirect().catch(console.error);
