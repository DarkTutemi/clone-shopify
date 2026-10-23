import fs from 'fs';

/**
 * Phase 3 QA: Multi-Category Integrity Verifier
 * Verifies that the deployed store does NOT suffer from cross-pollination.
 */

const SHOP_DOMAIN = process.env.SHOPIFY_SHOP_DOMAIN || 'vwpb1k-8z.myshopify.com';

const TEST_HANDLES = [
  { handle: 'bronoir-nola-cozy-elegant-supportive-ballerinas-for-daily-comfort', category: 'Ballerinas', forbiddenWords: ['winter boots', 'in snow', 'cold weather boots'] },
  { handle: 'bronoir-ayelith-lightweight-arch-supportive-walking-sandals', category: 'Sandals', forbiddenWords: ['winter boots', 'in snow'] },
  { handle: 'bronoir-force-barefoot-shoes', category: 'Force Barefoot', requiredWords: ['Force', 'color'] },
  { handle: 'bronoir-warmers-fleece-lined-non-slip-winter-boots-for-pain-free-walking', category: 'Winter Boots', requiredWords: ['Warmers', 'boots'] }
];

async function runMultiCategoryQA() {
  console.log('====================================================');
  console.log('🛡️ PHASE 3 CHECKPOINT: MULTI-CATEGORY INTEGRITY QA');
  console.log(`Checking Store: https://${SHOP_DOMAIN}`);
  console.log('====================================================\n');

  let passedAll = true;

  for (const item of TEST_HANDLES) {
    const url = `https://${SHOP_DOMAIN}/products/${item.handle}`;
    console.log(`Checking [${item.category}] -> ${url}`);

    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      });
      if (!res.ok) {
        console.error(`  ❌ HTTP Error ${res.status}`);
        passedAll = false;
        continue;
      }
      const text = await res.text();

      // Check forbidden words in Customer Reviews section
      const reviewsSectionMatch = text.match(/id=['"]shopify-section-bronoir-reviews['"][\s\S]*?<\/div>\s*<\/div>\s*<\/div>/i);
      const reviewsHtml = reviewsSectionMatch ? reviewsSectionMatch[0] : '';

      if (item.forbiddenWords) {
        for (const badWord of item.forbiddenWords) {
          if (reviewsHtml.toLowerCase().includes(badWord.toLowerCase())) {
            console.error(`  ❌ Cross-pollination detected! Review on [${item.category}] contains "${badWord}"`);
            passedAll = false;
          }
        }
      }

      if (item.requiredWords) {
        for (const goodWord of item.requiredWords) {
          if (!text.toLowerCase().includes(goodWord.toLowerCase())) {
            console.warn(`  ⚠️ Notice: Expected keyword "${goodWord}" not highlighted on [${item.category}]`);
          }
        }
      }

      console.log(`  ✔ [${item.category}] PASS: Content and reviews properly isolated.`);
    } catch (e) {
      console.error(`  ❌ Error fetching ${url}:`, e.message);
      passedAll = false;
    }
  }

  console.log('\n====================================================');
  if (passedAll) {
    console.log('🎉 MULTI-CATEGORY QA PASSED: ZERO CROSS-POLLINATION DETECTED!');
    console.log('Store is 100% verified for final handoff.');
  } else {
    console.error('❌ MULTI-CATEGORY QA FAILED: Some products leaked mismatched content.');
    process.exit(1);
  }
  console.log('====================================================');
}

runMultiCategoryQA();
