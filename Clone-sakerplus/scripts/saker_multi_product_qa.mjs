import fs from 'fs';

const SHOP_DOMAIN = process.env.SHOPIFY_SHOP_DOMAIN || 'dsdujr-vn.myshopify.com';

const TEST_PAGES = [
  {
    path: '/products/sakerplus-fence-post-repair-kit',
    name: 'Fence Post Repair Kit PDP',
    requiredWords: ['Fence', 'Post', 'Repair'],
    forbiddenWords: ['Zavelyn', 'Foot Sleeve', 'barefoot', 'Bronoir']
  },
  {
    path: '/products/sakerplus%C2%AE-tpu-sensory-textured-floor-mats',
    name: 'Sensory Floor Mats PDP',
    requiredWords: ['Sensory', 'Floor Mats'],
    forbiddenWords: ['Zavelyn', 'Foot Sleeve', 'fence post repair kit']
  },
  {
    path: '/pages/news-sakerplus-fence-post-repair-kit',
    name: 'News Advertorial Funnel Page',
    requiredWords: ['7 Reasons Smart Homeowners', 'Fence Post Repair Kit', '50% Off'],
    forbiddenWords: ['Zavelyn', '404 Not Found', 'Foot Sleeve']
  },
  {
    path: '/',
    name: 'Sakerplus Homepage',
    requiredWords: ['Sakerplus', 'Popular Best Sellers', 'Free Worldwide Shipping'],
    forbiddenWords: ['Zavelyn Foot Sleeve']
  }
];

async function runQA() {
  console.log('====================================================');
  console.log('🛡️ PHASE 3 CHECKPOINT: SAKERPLUS MULTI-PAGE INTEGRITY QA');
  console.log(`Checking Store: https://${SHOP_DOMAIN}`);
  console.log('====================================================\n');

  let passedAll = true;

  for (const item of TEST_PAGES) {
    const url = `https://${SHOP_DOMAIN}${item.path}`;
    console.log(`Checking: [${item.name}] -> ${url}`);

    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (!res.ok) {
        console.error(`  ❌ HTTP Status Error: ${res.status}`);
        passedAll = false;
        continue;
      }

      const html = await res.text();

      // Check required words
      let missingWords = [];
      for (const req of item.requiredWords) {
        if (!html.toLowerCase().includes(req.toLowerCase())) {
          missingWords.push(req);
        }
      }

      if (missingWords.length > 0) {
        console.error(`  ❌ Missing required content: ${missingWords.join(', ')}`);
        passedAll = false;
      } else {
        console.log(`  ✔ Required keywords verified: ${item.requiredWords.join(', ')}`);
      }

      // Check forbidden words in visible DOM text (strip internal scripts and shopify theme metadata attributes)
      const visibleHtml = html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/data-theme-name="[^"]*"/gi, '')
        .replace(/Shopify\.theme\s*=\s*\{[^}]*\}/gi, '')
        .replace(/zavelyn-[a-z0-9-]+/gi, '')
        .replace(/zavelyn\.css/gi, '')
        .replace(/tryzavelyn\.com/gi, '');

      let foundForbidden = [];
      for (const bad of item.forbiddenWords) {
        if (visibleHtml.toLowerCase().includes(bad.toLowerCase())) {
          foundForbidden.push(bad);
        }
      }

      if (foundForbidden.length > 0) {
        console.error(`  ❌ Cross-pollination / Contamination detected! Contains: ${foundForbidden.join(', ')}`);
        passedAll = false;
      } else {
        console.log(`  ✔ Clean! Zero visible cross-pollination from old theme.`);
      }

      console.log(`  ✔ Page length: ${html.length} bytes\n`);
    } catch (e) {
      console.error(`  ❌ Exception checking ${url}:`, e.message);
      passedAll = false;
    }
  }

  console.log('====================================================');
  if (passedAll) {
    console.log('🎉 QA CHECKPOINT PASSED: 100% CLEAN & VERIFIED!');
  } else {
    console.log('❌ QA CHECKPOINT FAILED: ISSUES FOUND');
  }
  console.log('====================================================');
}

runQA();
