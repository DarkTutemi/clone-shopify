import fs from 'fs';
import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const TARGET_THEME_ID = '187597717689';
const PREVIOUS_LIVE_ID = '186607567033';

async function publishTheme() {
  console.log('========================================================================');
  console.log('ZAVELYN 2.0 — LIVE PUBLISH EXECUTION');
  console.log(`Publishing Theme ID: ${TARGET_THEME_ID} to role: "main"`);
  console.log(`Preserving Old Live Theme ID: ${PREVIOUS_LIVE_ID} as backup`);
  console.log('========================================================================\n');

  const token = await getAccessToken();
  const headers = {
    'X-Shopify-Access-Token': token,
    'Content-Type': 'application/json'
  };

  // Step 1: Check current themes state
  console.log('Step 1: Checking pre-publish themes status...');
  const preRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes.json`, { headers });
  const preData = await preRes.json();
  const currentMain = preData.themes.find(t => t.role === 'main');
  console.log(`Current Main Theme: "${currentMain?.name}" (ID: ${currentMain?.id})`);

  if (currentMain?.id == TARGET_THEME_ID) {
    console.log(`Theme ${TARGET_THEME_ID} is already published as main!`);
  } else {
    // Step 2: Publish Theme by setting role: "main"
    console.log(`\nStep 2: Publishing Theme ${TARGET_THEME_ID} to role: "main"...`);
    const pubUrl = `https://${SHOP}/admin/api/${API_VERSION}/themes/${TARGET_THEME_ID}.json`;
    const pubRes = await fetch(pubUrl, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        theme: {
          role: 'main'
        }
      })
    });
    const pubData = await pubRes.json();

    if (!pubData.theme || pubData.errors) {
      console.error('[CRITICAL ERROR] Failed to publish theme:', pubData.errors);
      process.exit(1);
    }
    console.log(`[SUCCESS] Theme updated: "${pubData.theme.name}" (ID: ${pubData.theme.id}) is now role: "${pubData.theme.role}"!`);
  }

  // Step 3: Verify themes list
  console.log('\nStep 3: Verifying themes list post-publish...');
  const postRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes.json`, { headers });
  const postData = await postRes.json();
  const newMain = postData.themes.find(t => t.role === 'main');
  const oldMain = postData.themes.find(t => t.id == PREVIOUS_LIVE_ID);

  console.log(`Active Live Theme (main): "${newMain?.name}" (ID: ${newMain?.id})`);
  console.log(`Preserved Backup Theme: "${oldMain?.name}" (ID: ${oldMain?.id}, Role: "${oldMain?.role}")`);

  // Step 4: Live Storefront Verification (NO PREVIEW PARAMETER)
  console.log('\nStep 4: Live Storefront Verification (Direct Production URL, no preview parameter)...');
  const liveUrls = [
    { label: 'Live Homepage', url: 'https://tryzavelyn.com/' },
    { label: 'Live Universal PDP', url: 'https://tryzavelyn.com/products/zavelyn-sensory-floor-mats' },
    { label: 'Live Hero Handpan PDP', url: 'https://tryzavelyn.com/products/zavelyn-handpan-master' },
    { label: 'Live Handpans Collection', url: 'https://tryzavelyn.com/collections/zavelyn-handpans' }
  ];

  const verificationResults = [];

  for (const item of liveUrls) {
    try {
      const liveRes = await fetch(item.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Zavelyn-Live-Validator/2.0'
        }
      });
      const html = await liveRes.text();
      const hasElixirCss = html.includes('zavelyn-elixir') || html.includes('zavelyn');
      const hasProhibited = html.match(/\b(60[- ]day\s*(money[- ]back\s*)?guarantee|90[- ]day\s*(sound\s*)?guarantee|60[- ]night\s*risk[- ]free\s*trial)\b/gi);
      const has30Day = /30[- ]day/i.test(html);

      const check = {
        label: item.label,
        url: item.url,
        status: liveRes.status,
        htmlLength: html.length,
        hasZavelynThemeCode: hasElixirCss,
        has30DayGuarantee: has30Day,
        prohibitedMatches: hasProhibited ? [...new Set(hasProhibited)] : []
      };
      console.log(`[VERIFY ${liveRes.status == 200 ? 'PASS' : 'FAIL'}] ${item.label} (${item.url}):`);
      console.log(`  -> Status: ${liveRes.status} | Bytes: ${html.length} | Zavelyn 2.0 Code: ${hasElixirCss} | 30-Day: ${has30Day} | Prohibited: ${check.prohibitedMatches.length}`);
      verificationResults.push(check);
    } catch (err) {
      console.error(`Error verifying ${item.url}:`, err.message);
    }
  }

  const manifest = {
    publishTimestamp: new Date().toISOString(),
    publishedTheme: newMain,
    preservedTheme: oldMain,
    liveVerifications: verificationResults
  };

  fs.writeFileSync('scripts/live_publish_manifest.json', JSON.stringify(manifest, null, 2));
  console.log('\nPublish manifest saved to scripts/live_publish_manifest.json');
}

publishTheme();
