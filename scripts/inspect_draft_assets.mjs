import fs from 'fs';
import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const DRAFT_THEME_ID = '187597717689';

async function inspectDraftAssets() {
  const token = await getAccessToken();
  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${DRAFT_THEME_ID}/assets.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  const assets = data.assets || [];
  console.log(`Draft Theme ${DRAFT_THEME_ID} has ${assets.length} assets.`);

  const categories = {};
  for (const a of assets) {
    const dir = a.key.split('/')[0];
    categories[dir] = (categories[dir] || 0) + 1;
  }
  console.log('Assets breakdown:', categories);

  // Filter templates
  const productTemplates = assets.filter(a => a.key.startsWith('templates/product'));
  console.log('\nProduct templates in Draft Theme:');
  productTemplates.forEach(t => console.log(' - ' + t.key));

  fs.writeFileSync('scripts/draft_theme_assets_list.json', JSON.stringify(assets, null, 2), 'utf8');
}

inspectDraftAssets().catch(console.error);
