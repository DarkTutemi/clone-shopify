import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { getAccessToken, SHOP } from './batch1_config.mjs';
import { patchedBogoJsContent } from './patch_bogo_js.mjs';

const API_VERSION = '2026-10';
const LIVE_THEME_ID = '187597717689'; // Live Theme

async function deployToLive() {
  console.log('========================================================================');
  console.log(`DEPLOYING MINIMAL BOGO PATCH TO LIVE THEME ${LIVE_THEME_ID}...`);
  console.log('========================================================================\n');

  const token = await getAccessToken();

  console.log('Uploading updated assets/botanaroots-bogo.js to Live Theme...');
  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${LIVE_THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      asset: {
        key: 'assets/botanaroots-bogo.js',
        value: patchedBogoJsContent
      }
    })
  });

  const data = await res.json();
  if (data.asset) {
    console.log(`✓ Successfully updated assets/botanaroots-bogo.js on Live Theme ${LIVE_THEME_ID}!`);
    console.log(`  Updated at: ${data.asset.updated_at}`);
    console.log(`  Size: ${data.asset.size} bytes`);
  } else {
    throw new Error('Failed to deploy to Live Theme: ' + JSON.stringify(data));
  }
}

deployToLive().catch(console.error);
