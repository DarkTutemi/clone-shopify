import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import fs from 'fs';
import { getAccessToken, SHOP } from './batch1_config.mjs';

async function backup() {
  const token = await getAccessToken();
  const liveThemeId = '187597717689';

  console.log('Fetching live sections/heating-lamp-funnel.liquid...');
  const res = await fetch(`https://${SHOP}/admin/api/2026-10/themes/${liveThemeId}/assets.json?asset[key]=sections/heating-lamp-funnel.liquid`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  if (data.asset?.value) {
    fs.mkdirSync('./backups', { recursive: true });
    fs.writeFileSync('./backups/heating-lamp-funnel.live.backup.liquid', data.asset.value, 'utf8');
    console.log(`✓ Successfully saved backup: backups/heating-lamp-funnel.live.backup.liquid (${data.asset.value.length} chars)`);
  } else {
    console.error('Failed to backup:', data);
  }
}

backup().catch(console.error);
