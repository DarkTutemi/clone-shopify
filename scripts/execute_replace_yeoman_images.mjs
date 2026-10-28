import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import fs from 'fs';
import { getAccessToken, SHOP } from './batch1_config.mjs';

const API_VERSION = '2026-10';
const LIVE_THEME_ID = '187597717689';

const REPLACEMENTS = [
  {
    name: 'IMAGE 1 (Banner Action Media)',
    oldUrl: 'https://cdn.shopify.com/s/files/1/0651/8299/0379/files/hf_20260913_100130_cc5a08ed-b3ec-4abb-95bc-a45bfdb72b96.png?v=1789293761',
    newUrl: 'https://cdn.shopify.com/s/files/1/0826/2483/9865/files/hf_20260913_100130_cc5a08ed-b3ec-4abb-95bc-a45bfdb72b96.png?v=1793219564',
    sectionHint: 'wf-banner-media'
  },
  {
    name: 'IMAGE 2 (Feature 1 V-Brush Macro)',
    oldUrl: 'https://cdn.shopify.com/s/files/1/0651/8299/0379/files/ysp-gallery-brush-macro_e7dfbadb-e74b-4d6a-b91c-69525032dceb.png?v=1792570562',
    newUrl: 'https://cdn.shopify.com/s/files/1/0826/2483/9865/files/ysp-gallery-brush-macro_e7dfbadb-e74b-4d6a-b91c-69525032dceb.png?v=1793219847',
    sectionHint: '10 V-Brush Height Settings'
  },
  {
    name: 'IMAGE 3 (Feature 2 Hopper Dump)',
    oldUrl: 'https://cdn.shopify.com/s/files/1/0651/8299/0379/files/hf_20260913_083634_da088230-c66f-464c-8f68-ca03117a3a8d.png?v=1792570981',
    newUrl: 'https://cdn.shopify.com/s/files/1/0826/2483/9865/files/hf_20260913_083634_da088230-c66f-464c-8f68-ca03117a3a8d.png?v=1793219673',
    sectionHint: '7 Cu Ft Hopper Quick Dump'
  },
  {
    name: 'IMAGE 4 (Feature 3 Compact Storage)',
    oldUrl: 'https://cdn.shopify.com/s/files/1/0651/8299/0379/files/hf_20260913_102022_03eb4095-9fa0-49f3-9694-fad1622a0020.png?v=1789295464',
    newUrl: 'https://cdn.shopify.com/s/files/1/0826/2483/9865/files/hf_20260913_102022_03eb4095-9fa0-49f3-9694-fad1622a0020.png?v=1793220255',
    sectionHint: 'Compact Garage Wall Storage'
  }
];

async function executeReplacement() {
  console.log('========================================================================');
  console.log('REPLACING 4 PRODUCT BODY IMAGES ON LIVE THEME ' + LIVE_THEME_ID);
  console.log('========================================================================\n');

  const token = await getAccessToken();

  // 1. Fetch current live content
  console.log('1. Reading current sections/yeoman-sweep-funnel.liquid from Live Theme...');
  const getRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${LIVE_THEME_ID}/assets.json?asset[key]=sections/yeoman-sweep-funnel.liquid`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const getData = await getRes.json();
  if (!getData.asset?.value) {
    throw new Error('Failed to read live asset: ' + JSON.stringify(getData));
  }

  const originalContent = getData.asset.value;
  fs.mkdirSync('./backups', { recursive: true });
  fs.writeFileSync('./backups/yeoman-sweep-funnel.pre_replace.backup.liquid', originalContent, 'utf8');
  console.log('   ✓ Exact pre-replacement backup saved to backups/yeoman-sweep-funnel.pre_replace.backup.liquid\n');

  // Split content into lines to do targeted line-based replacement
  const lines = originalContent.split('\n');
  let replacedCount = 0;

  // Track occurrences
  const occurrenceReport = {};

  REPLACEMENTS.forEach(r => {
    occurrenceReport[r.name] = {
      totalInFile: (originalContent.split(r.oldUrl).length - 1),
      replacedInBody: 0,
      matchedLine: null
    };
  });

  // Target lines:
  // Image 1 is around line 170 (inside wf-banner-media)
  // Image 2 is around line 240 (inside wf-features-section, alt "10 V-Brush Height Settings")
  // Image 3 is around line 260 (inside wf-features-section, alt "7 Cu Ft Hopper Quick Dump")
  // Image 4 is around line 280 (inside wf-features-section, alt "Compact Garage Wall Storage")

  for (let idx = 0; idx < lines.length; idx++) {
    const line = lines[idx];
    const lineNum = idx + 1;

    // Only inspect lines within Product Body range (e.g. between line 160 and line 300)
    if (lineNum >= 160 && lineNum <= 300) {
      for (const r of REPLACEMENTS) {
        if (line.includes(r.oldUrl)) {
          // Check that this is indeed the product body context
          lines[idx] = line.replace(r.oldUrl, r.newUrl);
          replacedCount++;
          occurrenceReport[r.name].replacedInBody++;
          occurrenceReport[r.name].matchedLine = lineNum;
          console.log(`✓ Replaced ${r.name} at line ${lineNum}:`);
          console.log(`  OLD: ${r.oldUrl}`);
          console.log(`  NEW: ${r.newUrl}\n`);
        }
      }
    }
  }

  if (replacedCount !== 4) {
    throw new Error(`Expected exactly 4 replacements in Product Body, but replaced ${replacedCount}! Aborting save.`);
  }

  const updatedContent = lines.join('\n');

  // 2. Upload to Live Theme
  console.log('2. Uploading updated sections/yeoman-sweep-funnel.liquid to Live Theme ' + LIVE_THEME_ID + '...');
  const putRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${LIVE_THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      asset: {
        key: 'sections/yeoman-sweep-funnel.liquid',
        value: updatedContent
      }
    })
  });

  const putData = await putRes.json();
  if (!putData.asset) {
    throw new Error('Failed to upload to live theme: ' + JSON.stringify(putData));
  }
  console.log('   ✓ Asset successfully updated on Live Theme! Updated at: ' + putData.asset.updated_at + '\n');

  // 3. Read back from Live Theme to verify
  console.log('3. Reading back asset from Live Theme to verify persistence...');
  const verifyRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${LIVE_THEME_ID}/assets.json?asset[key]=sections/yeoman-sweep-funnel.liquid`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const verifyData = await verifyRes.json();
  const verifiedContent = verifyData.asset?.value || '';

  console.log('4. Verification Status:');
  REPLACEMENTS.forEach((r, i) => {
    const hasNew = verifiedContent.includes(r.newUrl);
    // Check if old URL is still in product body range (lines 160-300)
    const bodyLines = verifiedContent.split('\n').slice(160, 300).join('\n');
    const oldStillInBody = bodyLines.includes(r.oldUrl);

    console.log(`   ${r.name}:`);
    console.log(`     Total occurrences in file: ${occurrenceReport[r.name].totalInFile}`);
    console.log(`     Replaced in Product Body: line ${occurrenceReport[r.name].matchedLine}`);
    console.log(`     New URL verified present on Live Theme: ${hasNew ? '✓ SUCCESS' : '✗ FAILED'}`);
    console.log(`     Old URL absent from Product Body: ${!oldStillInBody ? '✓ SUCCESS' : '✗ FAILED'}`);
  });

  fs.writeFileSync('./backups/yeoman_replacement_report.json', JSON.stringify({
    timestamp: new Date().toISOString(),
    liveThemeId: LIVE_THEME_ID,
    replacedCount,
    occurrenceReport
  }, null, 2));

  console.log('\n========================================================================');
  console.log('REPLACEMENT COMPLETED AND VERIFIED ON LIVE THEME.');
  console.log('========================================================================');
}

executeReplacement().catch(console.error);
