import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import fs from 'fs';
import { getAccessToken, SHOP } from './batch1_config.mjs';

const THEMES = [
  { id: '187597717689', name: 'Zavelyn 2.0 (LIVE THEME)' },
  { id: '187708571833', name: '[Draft] Zavelyn - BotanaRoots Mobile & Modular (USER PREVIEW THEME)' },
  { id: '187736654009', name: '[Dev Test] Zavelyn - BotanaRoots BOGO Page' },
  { id: '187720335545', name: '[Draft] Zavelyn - Fix Non-Botana Products' },
  { id: '187702804665', name: '[Draft Preview] Zavelyn - BotanaRoots Bundle' }
];

async function uploadTemplateAll() {
  const token = await getAccessToken();
  const templateContent = fs.readFileSync('templates/product.storage-bins.json', 'utf8');

  for (const t of THEMES) {
    const res = await fetch(`https://${SHOP}/admin/api/2026-10/themes/${t.id}/assets.json`, {
      method: 'PUT',
      headers: { 'X-Shopify-Access-Token': token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ asset: { key: 'templates/product.storage-bins.json', value: templateContent } })
    });
    const data = await res.json();
    console.log(`Theme ${t.name} (${t.id}):`, data.asset ? '✓ SUCCESS' : `✗ ${JSON.stringify(data)}`);
  }
}

uploadTemplateAll().catch(console.error);
