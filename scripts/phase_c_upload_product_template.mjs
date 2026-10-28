import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { getAccessToken, SHOP } from './batch1_config.mjs';

const API_VERSION = '2026-10';
const THEME_ID = '187736654009'; // Unpublished Development Theme

const productTemplateJson = JSON.stringify({
  sections: {
    main: {
      type: "botanaroots-bogo-main",
      settings: {}
    }
  },
  order: [
    "main"
  ]
}, null, 2);

async function uploadProductTemplate() {
  const token = await getAccessToken();
  console.log(`Uploading templates/product.botanaroots-bogo.json to Theme ${THEME_ID}...`);

  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      asset: {
        key: 'templates/product.botanaroots-bogo.json',
        value: productTemplateJson
      }
    })
  });
  const data = await res.json();
  if (data.asset?.key) {
    console.log(`✔ Successfully uploaded templates/product.botanaroots-bogo.json to Theme ${THEME_ID}`);
  } else {
    console.error('Upload Error:', JSON.stringify(data));
  }
}

uploadProductTemplate().catch(console.error);
