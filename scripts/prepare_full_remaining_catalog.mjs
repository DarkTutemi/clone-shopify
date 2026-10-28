import fs from 'fs';

const plan = JSON.parse(fs.readFileSync('scripts/ZAVELYN_SEO_CATALOG_MIGRATION_PLAN.json', 'utf8'));
const scan = JSON.parse(fs.readFileSync('scripts/live_full_catalog_scan.json', 'utf8'));

const completedIds = [
  '15454947901625',
  '15454948163769',
  '15454948556985',
  '15454949540025',
  '15454950490297',
  '15454952882361',
  '15454953177273',
  '15454955765945',
  '15454959403193',
  '15454960517305',
  '15454961565881',
  '15454963073209',
  '15454963433657'
];

// Clean trademark symbols
function cleanText(str) {
  if (!str) return '';
  return str.replace(/[\u2122\u00AE]/g, '').replace(/\s+/g, ' ').trim();
}

const remainingProducts = scan.remainingProducts; // 63 items
console.log(`Processing ${remainingProducts.length} remaining active products...`);

const preparedItems = [];
const exceptions = [];

for (const live of remainingProducts) {
  const rawId = live.id.replace('gid://shopify/Product/', '');
  const planItem = plan.find(p => p.productId === rawId);

  if (!planItem) {
    exceptions.push({
      productId: rawId,
      title: live.title,
      handle: live.handle,
      reason: 'MISSING_FROM_MIGRATION_PLAN',
      action: 'NEEDS_OWNER_REVIEW'
    });
    continue;
  }

  // Pre-check proposed fields
  let proposedTitle = cleanText(planItem.proposedProductTitle || live.title);
  let proposedSeoTitle = cleanText(planItem.proposedSeoPageTitle || proposedTitle);
  let proposedMetaDesc = cleanText(planItem.proposedMetaDescription || '');

  // Ensure no duplicate 'Zavelyn' in SEO Title
  const zavelynMatches = proposedSeoTitle.match(/Zavelyn/gi);
  if (zavelynMatches && zavelynMatches.length > 1) {
    // Keep only the suffix | Zavelyn
    proposedSeoTitle = proposedSeoTitle.replace(/Zavelyn\s*[-|–]\s*/i, '').replace(/\s*\|\s*Zavelyn/i, '') + ' | Zavelyn';
  } else if (!proposedSeoTitle.includes('Zavelyn')) {
    proposedSeoTitle = `${proposedSeoTitle} | Zavelyn`;
  }

  // Clean guarantees
  proposedMetaDesc = proposedMetaDesc.replace(/60-day\s*(money-back\s*)?guarantee/gi, '30-day return policy')
                                     .replace(/90-day\s*(money-back\s*)?guarantee/gi, '30-day return policy')
                                     .replace(/100%\s*risk-free/gi, 'satisfaction-focused')
                                     .replace(/100%\s*money-back/gi, 'standard 30-day returns');

  // Fact check specific items
  if (rawId === '15454949998777') { // Steam cleaner
    proposedTitle = 'Zavelyn Handheld Steam Cleaner';
    proposedSeoTitle = 'Handheld Steam Cleaner for Home & Auto | Zavelyn';
    proposedMetaDesc = 'Clean kitchen tiles, grout lines, and car upholstery with 1050W pressurized high-temperature steam. Loosens grime and dirt across sealed home surfaces.';
  } else if (rawId === '15454954193081') { // Tactical vest
    proposedTitle = 'Zavelyn Tactical MOLLE Utility Vest';
    proposedSeoTitle = 'Tactical MOLLE Utility Vest with Modular Webbing | Zavelyn';
    proposedMetaDesc = 'Organize gear and pouches with an adjustable tactical vest crafted from water-resistant Oxford fabric. Features modular MOLLE webbing and breathable mesh.';
  } else if (rawId === '15454951211193') { // Solar street lights
    proposedTitle = 'Zavelyn Outdoor Solar Street Lights';
    proposedSeoTitle = 'Outdoor Solar Street Light with Motion Sensor | Zavelyn';
    proposedMetaDesc = 'Illuminate yards and driveways with outdoor solar street lights featuring 220° wide-angle LED coverage, dusk-to-dawn sensors, and motion-activated modes.';
  } else if (rawId === '15454954750137') { // Hygrometer clock
    proposedTitle = 'Zavelyn Smart Hygrometer Thermometer Clock';
    proposedSeoTitle = 'Retro Pixel Thermometer & Hygrometer Desk Clock | Zavelyn';
    proposedMetaDesc = 'Track indoor temperature and humidity on an animated retro pixel display clock. Features 30-second reading updates, mechanical joystick, and USB battery.';
  } else if (rawId === '15454948982969') { // Space heater
    proposedTitle = 'Zavelyn Flame Effect Space Heater';
    proposedSeoTitle = '1500W Flame Effect Oscillating Space Heater | Zavelyn';
    proposedMetaDesc = 'Warm indoor rooms with a 1500W PTC oscillating tower heater featuring a decorative 3D flame effect, remote control, and built-in tip-over shutoff.';
  } else if (rawId === '15454958158009') { // String lights
    proposedTitle = 'Zavelyn 50FT LED Jobsite String Lights';
    proposedSeoTitle = '50FT Linkable LED Jobsite Construction Lights | Zavelyn';
    proposedMetaDesc = 'Light up workspaces with a 50ft linkable construction string light set featuring five IP65-rated 10W LED heads, protective cages, and hanging carabiners.';
  }

  // Ensure Meta Description length is well-balanced (130-160 chars)
  if (proposedMetaDesc.length > 160) {
    // Truncate at last sentence or word boundary
    const trimmed = proposedMetaDesc.slice(0, 157);
    const lastPeriod = trimmed.lastIndexOf('.');
    if (lastPeriod > 130) {
      proposedMetaDesc = trimmed.slice(0, lastPeriod + 1);
    } else {
      const lastSpace = trimmed.lastIndexOf(' ');
      proposedMetaDesc = trimmed.slice(0, lastSpace) + '.';
    }
  }

  preparedItems.push({
    productId: rawId,
    gid: live.id,
    currentLiveTitle: live.title,
    currentHandle: live.handle,
    status: live.status,
    proposedTitle,
    proposedSeoTitle,
    proposedMetaDesc,
    titleCharCount: proposedTitle.length,
    seoTitleCharCount: proposedSeoTitle.length,
    metaDescCharCount: proposedMetaDesc.length,
    adsRisk: planItem.adsTrafficRisk || 'ADS TRAFFIC UNKNOWN',
    variantsCount: live.variants?.nodes?.length || 1,
    primaryVariant: live.variants?.nodes?.[0]
  });
}

console.log(`Prepared items count: ${preparedItems.length}`);
console.log(`Exceptions count: ${exceptions.length}`);

// Split into batches of up to 10
const batches = [];
for (let i = 0; i < preparedItems.length; i += 10) {
  batches.push(preparedItems.slice(i, i + 10));
}

console.log(`Generated ${batches.length} batches:`);
batches.forEach((b, idx) => {
  console.log(`- Batch ${idx + 3}: ${b.length} products (IDs: ${b.map(p => p.productId).join(', ')})`);
});

fs.writeFileSync('scripts/prepared_batches_3_to_9.json', JSON.stringify({
  totalProducts: preparedItems.length,
  batchCount: batches.length,
  batches
}, null, 2), 'utf8');

fs.writeFileSync('scripts/catalog_exceptions_pre.json', JSON.stringify(exceptions, null, 2), 'utf8');
console.log('\nSaved prepared batches to scripts/prepared_batches_3_to_9.json');
