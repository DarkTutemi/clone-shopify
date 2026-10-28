import fs from 'fs';
import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

async function main() {
  const token = await getAccessToken();

  // 1. Get themes list to confirm Live theme
  const themesRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const themesData = await themesRes.json();
  const liveTheme = themesData.themes.find(t => t.role === 'main');
  const draftTheme = themesData.themes.find(t => t.id === 187708571833);

  console.log(`Live Theme: ID ${liveTheme?.id} - "${liveTheme?.name}" (role: ${liveTheme?.role})`);
  console.log(`Draft Theme: ID ${draftTheme?.id} - "${draftTheme?.name}" (role: ${draftTheme?.role})`);

  // Candidate assets for BotanaRoots feature
  const candidateKeys = [
    'sections/zavelyn-pdp-main.liquid',
    'snippets/botanaroots-bundle-upsell.liquid',
    'assets/botanaroots-bundle.css',
    'assets/botanaroots-bundle.js',
    'snippets/botanaroots-faq-accordion.liquid',
    'sections/zavelyn-pdp-description-fallback.liquid',
    'sections/zavelyn-pdp-faq.liquid',
    'templates/product.json'
  ];

  const diffReport = [];

  for (const key of candidateKeys) {
    // Fetch from Draft
    const draftAssetRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${draftTheme.id}/assets.json?asset[key]=${encodeURIComponent(key)}`, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    let draftVal = null;
    if (draftAssetRes.ok) {
      try {
        const draftAsset = await draftAssetRes.json();
        draftVal = draftAsset.asset?.value || null;
      } catch (e) {
        console.error('Draft parse err:', key, e.message);
      }
    }
    await new Promise(r => setTimeout(r, 250));

    // Fetch from Live
    const liveAssetRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${liveTheme.id}/assets.json?asset[key]=${encodeURIComponent(key)}`, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    let liveVal = null;
    if (liveAssetRes.ok) {
      try {
        const liveAsset = await liveAssetRes.json();
        liveVal = liveAsset.asset?.value || null;
      } catch (e) {
        console.error('Live parse err:', key, e.message);
      }
    }
    await new Promise(r => setTimeout(r, 250));

    diffReport.push({
      key,
      inDraft: draftVal !== null,
      inLive: liveVal !== null,
      draftSize: draftVal ? draftVal.length : 0,
      liveSize: liveVal ? liveVal.length : 0,
      identical: draftVal === liveVal
    });
  }

  console.log('\n--- ASSET COMPARISON (Draft vs Live) ---');
  console.table(diffReport);
}

main().catch(console.error);
