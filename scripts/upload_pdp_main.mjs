import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import fs from 'fs';
import { getAccessToken, SHOP } from './batch1_config.mjs';

const LIVE_THEME_ID = '187597717689';
const DEV_THEME_ID = '187736654009';

async function uploadPdpMain() {
  const token = await getAccessToken();
  const content = fs.readFileSync('./sections/zavelyn-pdp-main.liquid', 'utf8');

  for (const themeId of [DEV_THEME_ID, LIVE_THEME_ID]) {
    const res = await fetch(`https://${SHOP}/admin/api/2024-01/themes/${themeId}/assets.json`, {
      method: 'PUT',
      headers: { 'X-Shopify-Access-Token': token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ asset: { key: 'sections/zavelyn-pdp-main.liquid', value: content } })
    });
    const data = await res.json();
    if (data.asset) console.log('Successfully uploaded zavelyn-pdp-main.liquid to theme ' + themeId);
    else console.error('Failed on ' + themeId, data);
  }
}

uploadPdpMain().catch(console.error);
