import { getAccessToken, SHOP } from './batch1_config.mjs';
import fs from 'fs';
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

async function main() {
  const token = await getAccessToken();
  const res = await fetch(`https://${SHOP}/admin/api/2024-01/themes.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  console.log('Themes on store:');
  let liveTheme = null;
  let draftTheme = null;

  for (const t of data.themes) {
    console.log(`- ID: ${t.id} | Name: ${t.name} | Role: ${t.role}`);
    if (t.role === 'main') liveTheme = t;
    if (t.id === 187720335545) draftTheme = t;
  }

  console.log('\nLive Theme target:', liveTheme);
  console.log('Draft Theme source:', draftTheme);
}

main().catch(console.error);
