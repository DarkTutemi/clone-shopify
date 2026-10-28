/**
 * NORMALIZE POLICY MESSAGING ON DRAFT THEME 187597717689
 * Aligns all guarantee & return messaging with Shopify's official 30-day refund policy.
 * Backs up each asset before modifying.
 * Strictly READ-ONLY on live theme; only modifies Draft Theme 187597717689.
 */
import fs from 'fs';
import path from 'path';
import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const DRAFT_THEME_ID = '187597717689';
const PRE_FIX_DIR = 'backups/draft_theme_policy_pre_fix';

if (!fs.existsSync(PRE_FIX_DIR)) {
  fs.mkdirSync(PRE_FIX_DIR, { recursive: true });
}

async function fetchAsset(key, token) {
  const getUrl = `https://${SHOP}/admin/api/${API_VERSION}/themes/${DRAFT_THEME_ID}/assets.json?asset[key]=${encodeURIComponent(key)}`;
  const res = await fetch(getUrl, { headers: { 'X-Shopify-Access-Token': token } });
  const data = await res.json();
  return data.asset?.value || '';
}

async function saveAsset(key, value, token) {
  const putUrl = `https://${SHOP}/admin/api/${API_VERSION}/themes/${DRAFT_THEME_ID}/assets.json`;
  const res = await fetch(putUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      asset: {
        key,
        value
      }
    })
  });
  return await res.json();
}

function normalizePolicyText(content, isJson) {
  let updated = content;

  // 1. 60/90 Day guarantees -> 30-Day
  updated = updated.replace(/60-day\s*(money-back\s*)?guarantee/gi, '30-Day Money-Back Guarantee')
                   .replace(/90-day\s*(money-back\s*)?guarantee/gi, '30-Day Money-Back Guarantee')
                   .replace(/60-day\s*clean\s*sweep\s*(money-back\s*)?guarantee/gi, '30-Day Clean Sweep Guarantee')
                   .replace(/90-day\s*sound\s*guarantee/gi, '30-Day Sound Guarantee')
                   .replace(/60-night\s*risk-free\s*trial/gi, '30-Day Money-Back Guarantee')
                   .replace(/60-day\s*guarantee/gi, '30-Day Guarantee')
                   .replace(/90-day\s*guarantee/gi, '30-Day Guarantee')
                   .replace(/90-day\s*sound/gi, '30-Day Sound')
                   .replace(/90-day\s*money\s*back/gi, '30-Day Money Back')
                   .replace(/60-day\s*money\s*back/gi, '30-Day Money Back')
                   .replace(/60-day\s*risk-free\s*(money-back\s*)?guarantee/gi, '30-Day Money-Back Guarantee')
                   .replace(/60-DAY\s*RISK-FREE\s*MONEY-BACK\s*GUARANTEE/g, '30-DAY MONEY-BACK GUARANTEE')
                   .replace(/60-DAY\s*MONEY-BACK\s*GUARANTEE/g, '30-DAY MONEY-BACK GUARANTEE')
                   .replace(/90-day\s*risk-free\s*trial/gi, '30-Day Return Window')
                   .replace(/60-day\s*100%\s*money-back\s*trial/gi, '30-Day Return Policy')
                   .replace(/60-day\s*trial/gi, '30-Day Return Policy')
                   .replace(/90-day\s*trial/gi, '30-Day Return Policy')
                   .replace(/100%\s*risk-free\s*happiness\s*guarantee/gi, '30-Day Satisfaction Guarantee')
                   .replace(/risk-free\s*60-day\s*money-back\s*guarantee\s*with\s*zero\s*hassle\.?/gi, 'Standard 30-day return policy for peace of mind.')
                   .replace(/try\s*it\s*completely\s*risk-free\s*for\s*60\s*days/gi, 'Enjoy a 30-day return policy per store guidelines')
                   .replace(/60\s*days\s*of\s*receiving\s*your\s*order/gi, '30 days of receiving your order')
                   .replace(/tell\s*us\s*within\s*60\s*days\s*of\s*delivery/gi, 'Tell us within 30 days of delivery');

  // 2. Risk-free trial in JSON FAQ answers
  if (isJson) {
    updated = updated.replace(/We offer a 90-Day Risk-Free Trial\./gi, 'We offer a standard 30-day return policy.')
                     .replace(/We offer a 60-Day Risk-Free Trial\./gi, 'We offer a standard 30-day return policy.')
                     .replace(/90-Day Sound Guarantee/gi, '30-Day Sound Guarantee')
                     .replace(/60-Day Sound Guarantee/gi, '30-Day Sound Guarantee');
  }

  return updated;
}

async function fixPolicies() {
  console.log('=== FIXING POLICY DISCREPANCIES IN DRAFT THEME 187597717689 ===\n');
  const discrepancies = JSON.parse(fs.readFileSync('scripts/draft_theme_policy_discrepancies.json', 'utf8'));
  const uniqueKeys = [...new Set(discrepancies.map(d => d.key))];
  console.log(`Found ${uniqueKeys.length} files needing policy normalization in Draft Theme.`);

  const token = await getAccessToken();
  let modifiedCount = 0;

  for (let i = 0; i < uniqueKeys.length; i++) {
    const key = uniqueKeys[i];
    console.log(`[${i + 1}/${uniqueKeys.length}] Processing ${key}...`);

    const originalContent = await fetchAsset(key, token);
    if (!originalContent) {
      console.warn(`Could not fetch ${key}, skipping.`);
      continue;
    }

    // 1. Save Pre-Fix Backup
    const backupPath = path.join(PRE_FIX_DIR, key.replace(/\//g, '__'));
    fs.writeFileSync(backupPath, originalContent, 'utf8');

    // 2. Normalize content
    const isJson = key.endsWith('.json');
    const updatedContent = normalizePolicyText(originalContent, isJson);

    if (updatedContent !== originalContent) {
      // Validate JSON syntax if JSON file
      if (isJson) {
        try {
          JSON.parse(updatedContent);
        } catch (jsonErr) {
          console.error(`ERROR: JSON syntax validation failed on ${key}! Not saving. Reason:`, jsonErr.message);
          continue;
        }
      }

      // Save to Shopify Draft Theme
      const saveRes = await saveAsset(key, updatedContent, token);
      if (saveRes.asset) {
        console.log(`  -> Successfully normalized and saved ${key} on Draft Theme!`);
        modifiedCount++;
      } else {
        console.error(`  -> Failed to save ${key}:`, JSON.stringify(saveRes));
      }
    } else {
      console.log(`  -> No changes needed for ${key}.`);
    }

    // Delay between asset updates
    await new Promise(r => setTimeout(r, 600));
  }

  console.log(`\nPolicy normalization completed! Updated ${modifiedCount}/${uniqueKeys.length} files in Draft Theme.`);
}

fixPolicies().catch(console.error);
