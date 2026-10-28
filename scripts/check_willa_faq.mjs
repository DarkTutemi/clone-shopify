import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

async function checkWillaFaq() {
  const token = await getAccessToken();
  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/187597717689/assets.json?asset[key]=sections/willa-faq.liquid`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  const content = data.asset?.value || '';
  const lines = content.split('\n');
  lines.forEach((l, idx) => {
    if (/90[- ]day/i.test(l)) console.log(`Line ${idx + 1}: ${l.trim()}`);
  });

  // Clean it
  const updated = content.replace(/90[- ]day/gi, '30-Day');
  if (updated !== content) {
    const putRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/187597717689/assets.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
      body: JSON.stringify({ asset: { key: 'sections/willa-faq.liquid', value: updated } })
    });
    console.log('willa-faq.liquid cleaned and updated:', putRes.status === 200);
  }
}

checkWillaFaq().catch(console.error);
