import fs from 'fs';
import path from 'path';
import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const DRAFT_THEME_ID = '187597717689';

const BACKUP_DIR = 'backups/draft_theme_json_pre_fix';
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

async function fixJsonPolicies() {
  const token = await getAccessToken();
  const headers = { 'X-Shopify-Access-Token': token, 'Content-Type': 'application/json' };

  const targets = [
    {
      key: 'config/settings_data.json',
      replacements: [
        { from: '60-DAY RISK-FREE TRIAL', to: '30-DAY MONEY-BACK GUARANTEE' }
      ]
    },
    {
      key: 'templates/page.zavelyn-handpans.json',
      replacements: [
        { from: '100% Risk-Free Happiness Guarantee', to: '30-Day 100% Happiness Guarantee' }
      ]
    },
    {
      key: 'templates/product.zavelyn-handpan-master.json',
      replacements: [
        { from: 'What is your risk-free trial and return policy?', to: 'What is your 30-day return policy?' },
        { from: 'return it within 90 days for a full refund.', to: 'return it within 30 days for a full refund.' }
      ]
    },
    {
      key: 'templates/page.cdf.json',
      replacements: [
        { from: 'Try it risk-free for 30 days.', to: 'Try it with our 30-day money-back guarantee.' },
        { from: 'We offer a 30-day risk-free guarantee.', to: 'We offer a standard 30-day money-back guarantee.' }
      ]
    },
    {
      key: 'templates/product.cdf.json',
      replacements: [
        { from: 'Try it risk-free for 30 days.', to: 'Try it with our 30-day money-back guarantee.' },
        { from: 'We offer a 30-day risk-free guarantee.', to: 'We offer a standard 30-day money-back guarantee.' }
      ]
    }
  ];

  for (const item of targets) {
    console.log(`Processing ${item.key}...`);
    const getUrl = `https://${SHOP}/admin/api/${API_VERSION}/themes/${DRAFT_THEME_ID}/assets.json?asset[key]=${encodeURIComponent(item.key)}`;
    const res = await fetch(getUrl, { headers });
    const data = await res.json();
    let val = data.asset?.value;
    if (!val) {
      console.error(`Asset not found: ${item.key}`);
      continue;
    }

    // Save pre-fix backup
    const safeName = item.key.replace(/\//g, '__');
    fs.writeFileSync(path.join(BACKUP_DIR, safeName), val);

    let modified = val;
    for (const r of item.replacements) {
      if (!modified.includes(r.from)) {
        console.warn(`Target string not found in ${item.key}: "${r.from}"`);
      } else {
        modified = modified.replaceAll(r.from, r.to);
        console.log(`Replaced "${r.from}" -> "${r.to}" in ${item.key}`);
      }
    }

    if (modified !== val) {
      const putUrl = `https://${SHOP}/admin/api/${API_VERSION}/themes/${DRAFT_THEME_ID}/assets.json`;
      const putRes = await fetch(putUrl, {
        method: 'PUT',
        headers,
        body: JSON.stringify({ asset: { key: item.key, value: modified } })
      });
      const putData = await putRes.json();
      if (putData.asset) {
        console.log(`[SUCCESS] Updated ${item.key} on Draft Theme ${DRAFT_THEME_ID}`);
      } else {
        console.error(`[ERROR] Failed to update ${item.key}:`, putData.errors);
      }
    } else {
      console.log(`No changes made to ${item.key}`);
    }

    await new Promise(r => setTimeout(r, 200));
  }
}

fixJsonPolicies();
