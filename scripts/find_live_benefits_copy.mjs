import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { getAccessToken, SHOP } from './batch1_config.mjs';

const API_VERSION = '2026-10';

async function findLiveBenefitsCopy() {
  const token = await getAccessToken();
  const headers = {
    'X-Shopify-Access-Token': token,
    'Content-Type': 'application/json'
  };

  // 1. Verify Live Theme
  console.log('1. Checking Live Theme...');
  const themesRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query: `
        query {
          themes(first: 10, roles: [MAIN]) {
            nodes {
              id
              name
              role
            }
          }
        }
      `
    })
  });
  const themesData = await themesRes.json();
  const liveTheme = themesData.data?.themes?.nodes?.[0];
  const liveThemeId = liveTheme?.id.split('/').pop();
  console.log(`Live Theme: ID ${liveThemeId} ("${liveTheme?.name}")`);

  // 2. Fetch templates/product.json from Live Theme
  console.log('\n2. Checking templates/product.json on Live Theme...');
  const tplRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${liveThemeId}/assets.json?asset[key]=templates/product.json`, { headers });
  const tplData = await tplRes.json();
  const tplJson = tplData.asset?.value || '';

  if (tplJson.includes('Engineered for maximum') || tplJson.includes('Heavy-Duty') || tplJson.includes('Instant High Performance')) {
    console.log('FOUND matches in templates/product.json!');
  } else {
    console.log('Not in templates/product.json settings.');
  }

  // 3. Fetch sections/zavelyn-pdp-main.liquid from Live Theme
  console.log('\n3. Checking sections/zavelyn-pdp-main.liquid on Live Theme...');
  const secRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${liveThemeId}/assets.json?asset[key]=sections/zavelyn-pdp-main.liquid`, { headers });
  const secData = await secRes.json();
  const secLiquid = secData.asset?.value || '';

  if (secLiquid.includes('Engineered for maximum') || secLiquid.includes('Heavy-Duty') || secLiquid.includes('Instant High Performance')) {
    console.log('FOUND matches in sections/zavelyn-pdp-main.liquid!');
    const lines = secLiquid.split('\n');
    lines.forEach((l, idx) => {
      if (l.includes('Engineered for maximum') || l.includes('Heavy-Duty') || l.includes('Instant High Performance')) {
        console.log(`Line ${idx + 1}: ${l.trim()}`);
      }
    });
  } else {
    console.log('Not in sections/zavelyn-pdp-main.liquid directly.');
  }

  // 4. Check other sections/snippets if not found above
  if (!tplJson.includes('Engineered for maximum') && !secLiquid.includes('Engineered for maximum')) {
    console.log('\n4. Searching other assets on Live Theme for "Engineered for maximum"...');
    const assetsListRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${liveThemeId}/assets.json`, { headers });
    const { assets } = await assetsListRes.json();
    const candidateAssets = assets.filter(a => a.key.includes('pdp') || a.key.includes('benefit') || a.key.includes('main') || a.key.includes('product'));
    for (const ca of candidateAssets) {
      const aRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${liveThemeId}/assets.json?asset[key]=${encodeURIComponent(ca.key)}`, { headers });
      const aData = await aRes.json();
      const val = aData.asset?.value || '';
      if (val.includes('Engineered for maximum') || val.includes('Heavy-Duty')) {
        console.log(`FOUND in asset: ${ca.key}!`);
      }
    }
  }
}

findLiveBenefitsCopy().catch(console.error);
