import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const DRAFT_THEME_ID = '187597717689';

async function fetchAsset(key, token) {
  const getUrl = `https://${SHOP}/admin/api/${API_VERSION}/themes/${DRAFT_THEME_ID}/assets.json?asset[key]=${encodeURIComponent(key)}`;
  const res = await fetch(getUrl, { headers: { 'X-Shopify-Access-Token': token } });
  const data = await res.json();
  return data.asset?.value || '';
}

async function saveAsset(key, value, token) {
  const putUrl = `https://${SHOP}/admin/api/${API_VERSION}/themes/${DRAFT_THEME_ID}/assets.json`;
  const res = await fetch(putUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({ asset: { key, value } })
  });
  return await res.json();
}

async function cleanRiskFree() {
  const token = await getAccessToken();

  // 1. willa-comparison.liquid
  console.log('Cleaning sections/willa-comparison.liquid...');
  let comp = await fetchAsset('sections/willa-comparison.liquid', token);
  comp = comp.replace(/<td><strong>Risk-Free Guarantee<\/strong><\/td>/g, '<td><strong>Satisfaction Guarantee</strong></td>')
             .replace(/Risk-Free/gi, 'Satisfaction');
  await saveAsset('sections/willa-comparison.liquid', comp, token);

  // 2. willa-reviews.liquid
  console.log('Cleaning sections/willa-reviews.liquid...');
  let rev = await fetchAsset('sections/willa-reviews.liquid', token);
  rev = rev.replace(/Total risk-free satisfaction guarantee on all orders/gi, '30-Day satisfaction guarantee on all orders')
           .replace(/risk-free/gi, 'confidence-backed');
  await saveAsset('sections/willa-reviews.liquid', rev, token);

  // 3. zavelyn-pdp-main.liquid
  console.log('Cleaning sections/zavelyn-pdp-main.liquid...');
  let pdp = await fetchAsset('sections/zavelyn-pdp-main.liquid', token);
  pdp = pdp.replace(/100%\s*risk-free\s*trial/gi, 'peace of mind guarantee')
           .replace(/zero risk to try in your home or shop/gi, 'protected by our 30-day return policy')
           .replace(/Try \{\{ product\.title \}\} completely risk-free\./gi, 'Order {{ product.title }} with complete confidence.')
           .replace(/completely risk-free/gi, 'with confidence')
           .replace(/risk-free/gi, 'guaranteed');
  await saveAsset('sections/zavelyn-pdp-main.liquid', pdp, token);

  // 4. zavelyn-pdp-shipping.liquid
  console.log('Cleaning sections/zavelyn-pdp-shipping.liquid...');
  let ship = await fetchAsset('sections/zavelyn-pdp-shipping.liquid', token);
  ship = ship.replace(/Risk-free 30-Day Money-Back Guarantee with zero hassle\./gi, 'Standard 30-day return policy for peace of mind.')
             .replace(/Risk-free/gi, 'Standard');
  await saveAsset('sections/zavelyn-pdp-shipping.liquid', ship, token);

  console.log('All remaining risk-free phrases cleaned from Draft Theme!');
}

cleanRiskFree().catch(console.error);
