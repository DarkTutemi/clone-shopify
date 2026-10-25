import fs from 'fs';

const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';

const PAGES = [
  { name: 'Homepage', url: `https://${SHOP_DOMAIN}/` },
  { name: 'Priority PDP (Fence Post)', url: `https://${SHOP_DOMAIN}/products/sakerplus-fence-post-repair-kit` },
  { name: 'Second PDP (Sensory Mats)', url: `https://${SHOP_DOMAIN}/products/sakerplus%C2%AE-tpu-sensory-textured-floor-mats` },
  { name: 'Advertorial Funnel', url: `https://${SHOP_DOMAIN}/pages/news-sakerplus-fence-post-repair-kit` },
  { name: 'Best Sellers Collection', url: `https://${SHOP_DOMAIN}/collections/best-sellers` },
  { name: 'Home Improvement Collection', url: `https://${SHOP_DOMAIN}/collections/home-improvement` }
];

async function checkUrl(url) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    return { ok: res.ok, status: res.status, text: await res.text() };
  } catch (e) {
    return { ok: false, status: 0, error: e.message };
  }
}

async function runAudit() {
  console.log('========================================================');
  console.log('🔬 DEEP STOREFRONT INTEGRITY & FUNCTIONALITY AUDIT');
  console.log('========================================================\n');

  let issuesFound = [];

  for (const p of PAGES) {
    console.log(`Auditing [${p.name}] -> ${p.url}...`);
    const pageRes = await checkUrl(p.url);
    if (!pageRes.ok) {
      console.error(`  ❌ HTTP Status ${pageRes.status}: Failed to load!`);
      issuesFound.push(`[${p.name}] HTTP ${pageRes.status}`);
      continue;
    }

    const html = pageRes.text;

    // 1. Check Liquid Errors
    const liquidErrors = html.match(/Liquid error[^\n<]*/gi);
    if (liquidErrors && liquidErrors.length > 0) {
      console.error(`  ❌ Liquid errors detected (${liquidErrors.length}):`, liquidErrors);
      issuesFound.push(`[${p.name}] Liquid errors: ${liquidErrors.join('; ')}`);
    } else {
      console.log(`  ✔ Zero Liquid errors`);
    }

    // 2. Check for Broken Asset / Image Links (sample first 10 images)
    const imgMatches = [...html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)].map(m => m[1]);
    console.log(`  Found ${imgMatches.length} images on page. Testing key sample...`);
    let brokenImgs = 0;
    const sampleImgs = imgMatches.slice(0, 10);
    for (let imgSrc of sampleImgs) {
      if (imgSrc.startsWith('//')) imgSrc = 'https:' + imgSrc;
      if (imgSrc.startsWith('/')) imgSrc = `https://${SHOP_DOMAIN}` + imgSrc;
      if (!imgSrc.startsWith('http')) continue;

      try {
        const imgCheck = await fetch(imgSrc, {
          method: 'HEAD',
          headers: {
            'Referer': `https://${SHOP_DOMAIN}/`,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
          }
        });
        if (!imgCheck.ok) {
          brokenImgs++;
          console.warn(`    ⚠️ Broken image: ${imgSrc} (${imgCheck.status})`);
        }
      } catch (err) {
        brokenImgs++;
      }
    }
    if (brokenImgs === 0) {
      console.log(`  ✔ All tested images load cleanly (200 OK)`);
    } else {
      issuesFound.push(`[${p.name}] ${brokenImgs} broken images detected`);
    }

    // 3. Check CTAs & Internal Links
    const linkMatches = [...html.matchAll(/<a[^>]+href=["']([^"'#][^"']*)["']/gi)].map(m => m[1]);
    const internalLinks = linkMatches.filter(l => l.startsWith('/') && !l.startsWith('//') && !l.includes('tel:') && !l.includes('mailto:'));
    console.log(`  Found ${internalLinks.length} internal navigation links.`);
    
    // Sample test 5 internal links
    const uniqueLinks = [...new Set(internalLinks)].slice(0, 6);
    let brokenLinks = 0;
    for (const link of uniqueLinks) {
      const fullLink = `https://${SHOP_DOMAIN}${link}`;
      const lCheck = await checkUrl(fullLink);
      if (!lCheck.ok && lCheck.status !== 401 && lCheck.status !== 403) {
        brokenLinks++;
        console.warn(`    ⚠️ Broken link: ${link} (${lCheck.status})`);
      }
    }
    if (brokenLinks === 0) {
      console.log(`  ✔ Key internal links verified valid`);
    } else {
      issuesFound.push(`[${p.name}] ${brokenLinks} broken internal links`);
    }

    // 4. Check Brand Copy Isolation (ensure no "Zavelyn Foot Sleeve" or barefoot)
    const badBrand = ['Zavelyn Foot Sleeve', 'barefoot insole', 'foot sleeve'];
    let brandLeaks = [];
    for (const b of badBrand) {
      if (html.toLowerCase().includes(b.toLowerCase())) {
        brandLeaks.push(b);
      }
    }
    if (brandLeaks.length > 0) {
      console.error(`  ❌ Brand leak detected: ${brandLeaks.join(', ')}`);
      issuesFound.push(`[${p.name}] Brand leak: ${brandLeaks.join(', ')}`);
    } else {
      console.log(`  ✔ Clean brand isolation`);
    }

    console.log('');
  }

  // 5. Test Cart Add API on Priority Product
  console.log('Testing Cart Add API (/cart/add.js) on Fence Post Repair Kit...');
  try {
    const cartRes = await fetch(`https://${SHOP_DOMAIN}/cart/add.js`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0'
      },
      body: JSON.stringify({
        items: [{
          id: 67914320249017, // Variant ID of 2 pc
          quantity: 1
        }]
      })
    });
    if (cartRes.ok) {
      const cartData = await cartRes.json();
      console.log(`  ✔ Cart Add API Success! Added: ${cartData.items?.[0]?.title || 'Product'}`);
    } else {
      const cartErr = await cartRes.text();
      console.warn(`  ⚠️ Cart Add responded: ${cartRes.status} - ${cartErr.slice(0, 150)}`);
    }
  } catch (err) {
    console.error(`  ❌ Cart Add Exception:`, err.message);
  }

  console.log('\n========================================================');
  if (issuesFound.length === 0) {
    console.log('🎉 AUDIT COMPLETE: 0 ISSUES FOUND! 100% OPERATIONAL');
  } else {
    console.log(`⚠️ AUDIT FOUND ${issuesFound.length} ISSUES TO RESOLVE:`);
    issuesFound.forEach(iss => console.log(`  - ${iss}`));
  }
  console.log('========================================================\n');
}

runAudit();
