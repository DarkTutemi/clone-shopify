import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { getAccessToken, SHOP } from './batch1_config.mjs';

const THEME_ID = '187736654009';

async function waitThemeReady() {
  const token = await getAccessToken();
  console.log(`Checking theme ${THEME_ID} readiness...`);

  for (let i = 0; i < 15; i++) {
    const res = await fetch(`https://${SHOP}/admin/api/2026-10/themes/${THEME_ID}/assets.json`, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    if (res.ok) {
      const data = await res.json();
      const count = data.assets?.length || 0;
      console.log(`Attempt ${i + 1}: Theme has ${count} assets.`);
      if (count > 50) {
        console.log(`✔ Theme ${THEME_ID} is ready!`);
        return true;
      }
    } else {
      console.log(`Attempt ${i + 1}: Status ${res.status}`);
    }
    await new Promise(r => setTimeout(r, 2000));
  }
}

waitThemeReady().catch(console.error);
