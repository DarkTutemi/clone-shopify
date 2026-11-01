import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const LIVE_THEME_ID = '187597717689';

async function inspectAllTemplates() {
  const token = await getAccessToken();

  const templates = [
    'templates/product.json',
    'templates/product.storage-bins.json',
    'templates/product.dentures.json',
    'templates/product.zavelyn-drum-mini.json',
    'templates/product.zavelyn-drum-plus.json',
    'templates/product.zavelyn-drum-pro.json',
    'templates/product.zavelyn-handpan-master.json',
    'templates/product.zavelyn-rain-drum.json',
    'templates/product.sakerplus-livestock-heating-lamp.json',
    'templates/product.thoson-magtrack.json',
    'templates/product.srefalsteam.json',
    'templates/product.yeoman-sweep.json'
  ];

  for (const tpl of templates) {
    const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${LIVE_THEME_ID}/assets.json?asset[key]=${tpl}`, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    const data = await res.json();
    if (data.asset) {
      const val = JSON.parse(data.asset.value);
      const sections = Object.entries(val.sections || {}).map(([key, sec]) => `${key}: (${sec.type})`);
      console.log(`\n=== ${tpl} ===`);
      console.log('Sections:', sections);
    } else {
      console.log(`\n=== ${tpl} === NOT FOUND`);
    }
  }
}

inspectAllTemplates().catch(console.error);
