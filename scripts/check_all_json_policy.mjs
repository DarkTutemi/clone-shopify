import fs from 'fs';
import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const DRAFT_THEME_ID = '187597717689';

async function checkJsonTemplates() {
  const token = await getAccessToken();
  const headers = { 'X-Shopify-Access-Token': token, 'Content-Type': 'application/json' };

  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${DRAFT_THEME_ID}/assets.json`, { headers });
  const data = await res.json();
  const jsonAssets = data.assets.filter(a => a.key.endsWith('.json') && (a.key.startsWith('templates/') || a.key.startsWith('sections/') || a.key.startsWith('config/')));
  console.log(`Auditing ${jsonAssets.length} JSON template/section/config assets on Draft Theme ${DRAFT_THEME_ID}...`);

  const matchesFound = [];

  for (const asset of jsonAssets) {
    try {
      const aRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${DRAFT_THEME_ID}/assets.json?asset[key]=${encodeURIComponent(asset.key)}`, { headers });
      const aData = await aRes.json();
      const val = aData.asset?.value || '';
      const matches = val.match(/(90[- ]day|60[- ]day|risk[- ]free)/gi);
      if (matches) {
        console.log(`[MATCH] ${asset.key}: ${[...new Set(matches)].join(', ')}`);
        matchesFound.push({ key: asset.key, matches: [...new Set(matches)], val });
      }
      // brief pause to avoid 429
      await new Promise(r => setTimeout(r, 80));
    } catch (err) {
      console.error(`Error fetching ${asset.key}:`, err.message);
    }
  }

  console.log(`Audit complete. Found ${matchesFound.length} JSON assets with policy matches.`);
  fs.writeFileSync('scripts/json_policy_matches.json', JSON.stringify(matchesFound, null, 2));
}

checkJsonTemplates();
