import { getAccessToken, SHOP } from './batch1_config.mjs';
import fs from 'fs';
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

const LIVE_THEME_ID = 187597717689;
const DRAFT_THEME_ID = 187720335545;

async function getAsset(token, themeId, key) {
  const res = await fetch(`https://${SHOP}/admin/api/2024-01/themes/${themeId}/assets.json?asset[key]=${encodeURIComponent(key)}`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.asset;
}

async function main() {
  console.log('=== BACKING UP AND COMPARING LIVE THEME WITH DRAFT THEME ===');
  const token = await getAccessToken();

  const backupDir = `backups/live_pre_vfit_deploy_${Date.now()}`;
  fs.mkdirSync(backupDir, { recursive: true });

  // 1. Fetch current Live Theme sections/zavelyn-pdp-main.liquid
  const livePdpMain = await getAsset(token, LIVE_THEME_ID, 'sections/zavelyn-pdp-main.liquid');
  if (livePdpMain) {
    fs.writeFileSync(`${backupDir}/sections__zavelyn-pdp-main.liquid`, livePdpMain.value);
    console.log(`✓ Backed up Live Theme sections/zavelyn-pdp-main.liquid (${livePdpMain.value.length} bytes)`);
  } else {
    throw new Error('Could not fetch live sections/zavelyn-pdp-main.liquid');
  }

  // 2. Fetch current Draft Theme sections/zavelyn-pdp-main.liquid
  const draftPdpMain = await getAsset(token, DRAFT_THEME_ID, 'sections/zavelyn-pdp-main.liquid');
  if (draftPdpMain) {
    fs.writeFileSync(`${backupDir}/draft_sections__zavelyn-pdp-main.liquid`, draftPdpMain.value);
    console.log(`✓ Fetched Draft Theme sections/zavelyn-pdp-main.liquid (${draftPdpMain.value.length} bytes)`);
  }

  // 3. Check snippets/vfit-selfcare-upsell.liquid on Live vs Draft
  const liveUpsellSnippet = await getAsset(token, LIVE_THEME_ID, 'snippets/vfit-selfcare-upsell.liquid');
  console.log(`Live Theme has snippets/vfit-selfcare-upsell.liquid: ${!!liveUpsellSnippet}`);

  const draftUpsellSnippet = await getAsset(token, DRAFT_THEME_ID, 'snippets/vfit-selfcare-upsell.liquid');
  console.log(`Draft Theme has snippets/vfit-selfcare-upsell.liquid: ${!!draftUpsellSnippet}`);
  if (draftUpsellSnippet) {
    fs.writeFileSync(`${backupDir}/snippets__vfit-selfcare-upsell.liquid`, draftUpsellSnippet.value);
  }

  // 4. Check image assets on Live Theme
  const images = [
    'assets/eyemask_source_hd.jpg',
    'assets/eyemask_slide_2.jpg',
    'assets/eyemask_slide_3.jpg',
    'assets/eyemask_slide_4.jpg',
    'assets/facemask_source_hd.jpg',
    'assets/facemask_slide_2.jpg',
    'assets/facemask_slide_3.jpg',
    'assets/facemask_slide_4.jpg'
  ];

  console.log('\nChecking gallery images on Live Theme:');
  for (const imgKey of images) {
    const asset = await getAsset(token, LIVE_THEME_ID, imgKey);
    console.log(`- ${imgKey}: ${asset ? 'EXISTS (' + asset.size + ' bytes)' : 'MISSING'}`);
  }

  // 5. Check BotanaRoots protection in both
  console.log('\nVerifying BotanaRoots handle isolation in both:');
  console.log(`Live Theme contains botanaroots-bundle-upsell: ${livePdpMain.value.includes('botanaroots-bundle-upsell')}`);
  console.log(`Draft Theme contains botanaroots-bundle-upsell: ${draftPdpMain.value.includes('botanaroots-bundle-upsell')}`);

  console.log(`\n✓ Backup saved to: ${backupDir}`);
}

main().catch(console.error);
