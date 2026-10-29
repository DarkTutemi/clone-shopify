import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import fs from 'fs';
import { getAccessToken, SHOP } from './batch1_config.mjs';

const API_VERSION = '2026-10';
const LIVE_THEME_ID = '187597717689';
const DEV_THEME_ID = '187736654009';

async function uploadAsset(themeId, key, content) {
  const token = await getAccessToken();
  console.log(`Uploading ${key} to Theme ${themeId}...`);
  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${themeId}/assets.json`, {
    method: 'PUT',
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      asset: {
        key,
        value: content
      }
    })
  });
  const data = await res.json();
  if (data.errors) {
    throw new Error(`Failed to upload ${key} to theme ${themeId}: ${JSON.stringify(data.errors)}`);
  }
  console.log(`Successfully uploaded ${key} to Theme ${themeId} (size: ${content.length} chars)`);
}

async function main() {
  const bodyContent = fs.readFileSync('sections/zavelyn-dentures-body.liquid', 'utf-8');

  // Deploy to Dev Theme first
  await uploadAsset(DEV_THEME_ID, 'sections/zavelyn-dentures-body.liquid', bodyContent);

  // Deploy to Live Theme
  await uploadAsset(LIVE_THEME_ID, 'sections/zavelyn-dentures-body.liquid', bodyContent);

  console.log('Dentures body section updated successfully on both Live and Dev themes!');
}

main().catch(console.error);
