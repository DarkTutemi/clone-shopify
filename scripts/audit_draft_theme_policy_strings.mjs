import fs from 'fs';
import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const DRAFT_THEME_ID = '187597717689';

async function auditDraftThemePolicies() {
  const token = await getAccessToken();
  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${DRAFT_THEME_ID}/assets.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  const assets = data.assets || [];

  // Filter text assets (liquid, json)
  const targetAssets = assets.filter(a => {
    return (a.key.startsWith('sections/') ||
            a.key.startsWith('snippets/') ||
            a.key.startsWith('templates/') ||
            a.key.startsWith('config/') ||
            a.key.startsWith('layout/')) &&
           (a.key.endsWith('.liquid') || a.key.endsWith('.json'));
  });

  console.log(`Scanning ${targetAssets.length} code assets in Draft Theme ${DRAFT_THEME_ID} for policy consistency...`);

  const guaranteeRegex = /\b(60[- ]day|90[- ]day|risk[- ]free\s*(trial|guarantee)?)\b/gi;
  const matches = [];

  for (let i = 0; i < targetAssets.length; i++) {
    const a = targetAssets[i];
    try {
      const getUrl = `https://${SHOP}/admin/api/${API_VERSION}/themes/${DRAFT_THEME_ID}/assets.json?asset[key]=${encodeURIComponent(a.key)}`;
      const aRes = await fetch(getUrl, { headers: { 'X-Shopify-Access-Token': token } });
      const aData = await aRes.json();
      const val = aData.asset?.value || '';

      const found = val.match(guaranteeRegex);
      if (found) {
        // Find line numbers and snippets
        const lines = val.split('\n');
        lines.forEach((line, lineIdx) => {
          if (guaranteeRegex.test(line)) {
            matches.push({
              key: a.key,
              line: lineIdx + 1,
              content: line.trim().slice(0, 160)
            });
          }
        });
      }
    } catch (err) {
      console.warn(`Error scanning ${a.key}:`, err.message);
    }
  }

  console.log(`\nFound ${matches.length} policy discrepancy lines across Draft Theme assets:`);
  matches.forEach(m => console.log(`[${m.key}:${m.line}] ${m.content}`));

  fs.writeFileSync('scripts/draft_theme_policy_discrepancies.json', JSON.stringify(matches, null, 2), 'utf8');
}

auditDraftThemePolicies().catch(console.error);
