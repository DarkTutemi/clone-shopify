import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const DRAFT_THEME_ID = '187926020281';
const LIVE_THEME_ID = '187597717689';

async function listThemeAssets() {
  const token = await getAccessToken();
  console.log(`Checking Draft Theme ID: ${DRAFT_THEME_ID} (Live Theme ID is ${LIVE_THEME_ID} - PROTECTED)`);
  const url = `https://${SHOP}/admin/api/2024-01/themes/${DRAFT_THEME_ID}/assets.json`;
  const res = await fetch(url, {
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json'
    }
  });
  const data = await res.json();
  if (data.assets) {
    const templates = data.assets.filter(a => a.key.startsWith('templates/product'));
    console.log('Product templates on draft theme:');
    templates.forEach(t => console.log(' - ' + t.key));
    
    // Check if templates/product.json exists on the draft theme
    const prodJson = data.assets.find(a => a.key === 'templates/product.json');
    if (prodJson) {
      console.log('\nFound templates/product.json on draft theme! Fetching content...');
      const pUrl = `https://${SHOP}/admin/api/2024-01/themes/${DRAFT_THEME_ID}/assets.json?asset[key]=templates/product.json`;
      const pRes = await fetch(pUrl, {
        headers: { 'X-Shopify-Access-Token': token }
      });
      const pData = await pRes.json();
      console.log('Full templates/product.json:');
      console.log(pData.asset?.value);
      fs.writeFileSync('templates/product.json.draft_backup', pData.asset?.value || '');
      console.log('Saved to templates/product.json.draft_backup');
    } else {
      console.log('templates/product.json DOES NOT EXIST on draft theme!');
    }
  } else {
    console.error('Error fetching assets:', data);
  }
}

listThemeAssets().catch(console.error);
