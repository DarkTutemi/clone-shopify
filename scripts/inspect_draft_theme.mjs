import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { getAccessToken, SHOP } from './batch1_config.mjs';

const DRAFT_THEME_ID = '187708571833';

async function inspectDraftTheme() {
  const token = await getAccessToken();

  console.log(`=== CHECKING ASSETS ON DRAFT THEME (${DRAFT_THEME_ID}) ===`);

  const resTpl = await fetch(`https://${SHOP}/admin/api/2024-01/themes/${DRAFT_THEME_ID}/assets.json?asset[key]=templates/product.storage-bins.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  console.log('Template check status:', resTpl.status);
  if (resTpl.ok) {
    const dataTpl = await resTpl.json();
    console.log('Template exists:', !!dataTpl.asset);
  } else {
    console.log('Template does NOT exist on theme', DRAFT_THEME_ID);
  }
}

inspectDraftTheme().catch(console.error);
