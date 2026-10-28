import fs from 'fs';
import { getAccessToken, SHOP } from './batch1_config.mjs';
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

const LIVE_THEME_ID = 187597717689;

async function main() {
  const token = await getAccessToken();
  const res = await fetch(`https://${SHOP}/admin/api/2024-01/themes/${LIVE_THEME_ID}/assets.json?asset[key]=sections/zavelyn-pdp-main.liquid`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  const content = data.asset.value;
  fs.writeFileSync('draft_working/live_current_pdp_main.liquid', content, 'utf8');
  console.log(`Downloaded sections/zavelyn-pdp-main.liquid from Live Theme (${content.length} chars)`);

  const paymentIndex = content.indexOf('zv-payment-icons-row');
  if (paymentIndex !== -1) {
    console.log('Found zv-payment-icons-row at char', paymentIndex);
    console.log(content.substring(paymentIndex - 100, paymentIndex + 1200));
  } else {
    console.log('zv-payment-icons-row NOT found in live file!');
  }
}

main().catch(console.error);
