import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import fs from 'fs';
import { getAccessToken, SHOP } from './batch1_config.mjs';

const TARGET_THEMES = [
  { id: '187597717689', name: 'Zavelyn 2.0 (LIVE THEME)' },
  { id: '187708571833', name: '[Draft] Zavelyn - BotanaRoots Mobile & Modular (USER PREVIEW THEME)' },
  { id: '187736654009', name: '[Dev Test] Zavelyn - BotanaRoots BOGO Page' },
  { id: '187720335545', name: '[Draft] Zavelyn - Fix Non-Botana Products' },
  { id: '187702804665', name: '[Draft Preview] Zavelyn - BotanaRoots Bundle' }
];

async function deployToAllThemes() {
  const token = await getAccessToken();

  const templateContent = fs.readFileSync('templates/product.storage-bins.json', 'utf8');
  const bodyContent = fs.readFileSync('sections/zavelyn-storage-bins-body.liquid', 'utf8');
  const pdpMainContent = fs.readFileSync('sections/zavelyn-pdp-main.liquid', 'utf8');

  for (const theme of TARGET_THEMES) {
    console.log(`\n======================================================`);
    console.log(`DEPLOYING TO: ${theme.name} (${theme.id})`);
    console.log(`======================================================`);

    // 1. Upload templates/product.storage-bins.json
    const resTpl = await fetch(`https://${SHOP}/admin/api/2026-10/themes/${theme.id}/assets.json`, {
      method: 'PUT',
      headers: { 'X-Shopify-Access-Token': token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ asset: { key: 'templates/product.storage-bins.json', value: templateContent } })
    });
    const dataTpl = await resTpl.json();
    if (dataTpl.asset) console.log(`✓ templates/product.storage-bins.json deployed`);
    else console.error(`✗ Error template:`, dataTpl);

    // 2. Upload sections/zavelyn-storage-bins-body.liquid
    const resBody = await fetch(`https://${SHOP}/admin/api/2026-10/themes/${theme.id}/assets.json`, {
      method: 'PUT',
      headers: { 'X-Shopify-Access-Token': token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ asset: { key: 'sections/zavelyn-storage-bins-body.liquid', value: bodyContent } })
    });
    const dataBody = await resBody.json();
    if (dataBody.asset) console.log(`✓ sections/zavelyn-storage-bins-body.liquid deployed`);
    else console.error(`✗ Error body:`, dataBody);

    // 3. Upload sections/zavelyn-pdp-main.liquid
    const resMain = await fetch(`https://${SHOP}/admin/api/2026-10/themes/${theme.id}/assets.json`, {
      method: 'PUT',
      headers: { 'X-Shopify-Access-Token': token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ asset: { key: 'sections/zavelyn-pdp-main.liquid', value: pdpMainContent } })
    });
    const dataMain = await resMain.json();
    if (dataMain.asset) console.log(`✓ sections/zavelyn-pdp-main.liquid deployed`);
    else console.error(`✗ Error pdp-main:`, dataMain);
  }

  console.log(`\n🎉 ALL TARGET THEMES UPDATED SUCCESSFULLY!`);
}

deployToAllThemes().catch(console.error);
