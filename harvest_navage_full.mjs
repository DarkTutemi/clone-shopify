import fs from 'fs';
import path from 'path';

const TARGET_URL = 'https://navage.com';
const OUTPUT_DIR = 'h:/Shopify-Clone/Clone-navage/data';

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function fetchWithRetry(url, options = {}, retries = 3, delay = 1000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        },
        ...options
      });
      return res;
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise(r => setTimeout(r, delay));
      delay *= 1.5;
    }
  }
}

async function runHarvest() {
  console.log('====================================================');
  console.log('🟡 PHASE 2: DEEP RECON & HARVESTING FOR NAVAGE.COM');
  console.log('====================================================\n');

  // STEP 1: Harvest Products
  console.log('[1/5] Fetching all products from /products.json...');
  const prodRes = await fetchWithRetry(`${TARGET_URL}/products.json?limit=250`);
  const prodJson = await prodRes.json();
  const rawProducts = prodJson.products || [];
  console.log(`  ✔ Found ${rawProducts.length} products in /products.json.`);

  const catalog = [];
  for (let i = 0; i < rawProducts.length; i++) {
    const p = rawProducts[i];
    console.log(`  [${i + 1}/${rawProducts.length}] Processing product: ${p.title} (${p.handle})...`);

    let bodyHtml = p.body_html || '';
    // Deep scrape live page if bodyHtml is simple
    let livePageDetails = {};
    try {
      const pageRes = await fetchWithRetry(`${TARGET_URL}/products/${p.handle}`);
      if (pageRes.ok) {
        const pageHtml = await pageRes.text();
        
        // Extract meta description
        const metaDescMatch = pageHtml.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
        const metaDesc = metaDescMatch ? metaDescMatch[1] : '';

        // Extract breadcrumb or category
        const bcMatch = [...pageHtml.matchAll(/<a[^>]*class=["'][^"']*breadcrumb[^"']*["'][^>]*>([^<]*)<\/a>/gi)].map(m => m[1].trim());

        // Extract FAQ items if any
        const faqItems = [];
        const faqMatches = [...pageHtml.matchAll(/<div[^>]*class=["'][^"']*faq[^"']*["'][^>]*>[\s\S]*?<\/div>/gi)];

        livePageDetails = {
          metaDescription: metaDesc,
          breadcrumbs: bcMatch
        };

        // If bodyHtml is short, check for main product description or blocks in pageHtml
        if (bodyHtml.length < 100) {
          const descMatch = pageHtml.match(/class=["'][^"']*product-meta__description[^"']*["']>([\s\S]*?)<\/div>/i)
            || pageHtml.match(/class=["'][^"']*rte[^"']*["']>([\s\S]*?)<\/div>/i);
          if (descMatch) {
            bodyHtml = descMatch[1].trim();
          }
        }
      }
    } catch (e) {
      console.warn(`    ⚠️ Could not fetch live page for ${p.handle}: ${e.message}`);
    }

    catalog.push({
      id: p.id,
      title: p.title,
      handle: p.handle,
      vendor: p.vendor || 'Naväge',
      productType: p.product_type || 'Nasal Care',
      tags: Array.isArray(p.tags) ? p.tags : (p.tags ? p.tags.split(',').map(t => t.trim()) : []),
      bodyHtml,
      hasRichDescription: bodyHtml.trim().length > 30,
      variantsCount: p.variants ? p.variants.length : 0,
      imagesCount: p.images ? p.images.length : 0,
      options: p.options || [],
      variants: (p.variants || []).map(v => ({
        id: v.id,
        title: v.title,
        price: v.price,
        compareAtPrice: v.compare_at_price,
        sku: v.sku,
        available: v.available !== false,
        option1: v.option1,
        option2: v.option2,
        option3: v.option3,
        featuredImage: v.featured_image
      })),
      images: (p.images || []).map(img => ({
        id: img.id,
        src: img.src,
        alt: img.alt || p.title,
        width: img.width,
        height: img.height
      })),
      livePageDetails
    });
  }

  fs.writeFileSync(path.join(OUTPUT_DIR, 'catalog_harvested.json'), JSON.stringify(catalog, null, 2), 'utf8');
  console.log(`  ✔ Catalog saved: ${catalog.length} products.\n`);

  // STEP 2: Harvest Collections
  console.log('[2/5] Fetching Collections metadata & product links...');
  const collectionHandles = [
    'products',
    'products-nose-cleaner-bundles',
    'all',
    'saltpods',
    'accessories',
    'replacement-parts',
    'wholesale',
    'home-page',
    'navage-baby-products',
    'alkalol-saltpod',
    'saline-mist',
    'navage-ear',
    'navage-day-deals',
    'nasal-care',
    'respiratory-care',
    'saline-refills',
    'products-nasal-care-condensed'
  ];

  const collectionsData = [];
  for (const handle of collectionHandles) {
    console.log(`  Fetching collection: ${handle}...`);
    try {
      const colRes = await fetchWithRetry(`${TARGET_URL}/collections/${handle}/products.json?limit=250`);
      let colProducts = [];
      if (colRes.ok) {
        const colJson = await colRes.json();
        colProducts = colJson.products || [];
      }

      // Also fetch HTML to get collection title, banner, description
      let title = handle.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      let description = '';
      let bannerImage = '';

      const htmlRes = await fetchWithRetry(`${TARGET_URL}/collections/${handle}`);
      if (htmlRes.ok) {
        const html = await htmlRes.text();
        const titleMatch = html.match(/<h1[^>]*>([^<]*)<\/h1>/i);
        if (titleMatch && titleMatch[1].trim()) {
          title = titleMatch[1].trim();
        }
        const descMatch = html.match(/class=["'][^"']*collection__description[^"']*["']>([\s\S]*?)<\/div>/i);
        if (descMatch) {
          description = descMatch[1].trim();
        }
        const imgMatch = html.match(/class=["'][^"']*collection__image[^"']*["'][^>]*src=["']([^"']*)["']/i);
        if (imgMatch) {
          bannerImage = imgMatch[1];
        }
      }

      collectionsData.push({
        handle,
        title,
        description,
        bannerImage,
        productCount: colProducts.length,
        productHandles: colProducts.map(cp => cp.handle)
      });
      console.log(`    ✔ ${title} (${colProducts.length} products)`);
    } catch (e) {
      console.warn(`    ⚠️ Failed fetching collection ${handle}: ${e.message}`);
    }
  }

  fs.writeFileSync(path.join(OUTPUT_DIR, 'collections_harvested.json'), JSON.stringify(collectionsData, null, 2), 'utf8');
  console.log(`  ✔ Collections saved: ${collectionsData.length} collections.\n`);

  // STEP 3: Harvest Homepage Structure & Media
  console.log('[3/5] Scraping Homepage Sections, Banners & Brand Assets...');
  const homeRes = await fetchWithRetry(`${TARGET_URL}/`);
  const homeHtml = await homeRes.text();

  // Extract logo
  const logoMatch = homeHtml.match(/<img[^>]*class=["'][^"']*header__logo-image[^"']*["'][^>]*src=["']([^"']*)["']/i)
    || homeHtml.match(/<img[^>]*alt=["'][^"']*nav[aä]ge[^"']*["'][^>]*src=["']([^"']*)["']/i);
  const logoUrl = logoMatch ? logoMatch[1] : '';

  // Extract all high-res images on homepage
  const homeImages = [...new Set([...homeHtml.matchAll(/src=["'](https:\/\/[^"']+\.(?:png|jpg|jpeg|webp|svg)[^"']*)["']/gi)].map(m => m[1]))];

  // Extract all video tags & background videos
  const videoUrls = [...new Set([...homeHtml.matchAll(/src=["'](https:\/\/[^"']+\.(?:mp4|webm)[^"']*)["']/gi)].map(m => m[1]))];

  // Extract theme CSS links
  const cssUrls = [...new Set([...homeHtml.matchAll(/href=["'](https:\/\/[^"']+\.css[^"']*)["']/gi)].map(m => m[1]))];

  // Extract fonts
  const fontUrls = [...new Set([...homeHtml.matchAll(/href=["'](https:\/\/[^"']+(?:fonts|woff2|woff)[^"']*)["']/gi)].map(m => m[1]))];

  const homepageData = {
    title: homeHtml.match(/<title>([^<]+)<\/title>/)?.[1] || 'Navage Nasal Care',
    logoUrl,
    imagesCount: homeImages.length,
    homeImages: homeImages.slice(0, 50),
    videoUrls,
    cssUrls,
    fontUrls
  };

  fs.writeFileSync(path.join(OUTPUT_DIR, 'homepage_assets_harvested.json'), JSON.stringify(homepageData, null, 2), 'utf8');
  fs.writeFileSync(path.join(OUTPUT_DIR, 'navage_home_raw.html'), homeHtml, 'utf8');
  console.log(`  ✔ Homepage data saved. Found logo: ${logoUrl}, ${homeImages.length} images, ${videoUrls.length} videos.\n`);

  // STEP 4: Harvest Key Content Pages
  console.log('[4/5] Scraping Essential Content Pages...');
  const keyPages = [
    'faqs',
    'about',
    '30-day-no-risk-trial',
    'quickstart-instructions',
    'cleaning-instructions',
    'owner-s-manual',
    'shipping',
    'returns-and-refunds',
    'contact-navage',
    'patents',
    'nasal-irrigation-works',
    'reviews'
  ];

  const pagesData = [];
  for (const pageHandle of keyPages) {
    try {
      const pageRes = await fetchWithRetry(`${TARGET_URL}/pages/${pageHandle}`);
      if (pageRes.ok) {
        const html = await pageRes.text();
        const pageTitle = html.match(/<h1[^>]*>([^<]*)<\/h1>/i)?.[1]?.trim() || pageHandle;
        const pageBody = html.match(/class=["'][^"']*(?:rte|page__content|article__content)[^"']*["']>([\s\S]*?)<\/div>/i)?.[1]?.trim() || '';
        pagesData.push({
          handle: pageHandle,
          title: pageTitle,
          bodyHtml: pageBody,
          url: `${TARGET_URL}/pages/${pageHandle}`
        });
        console.log(`    ✔ Harvested page: ${pageTitle} (/pages/${pageHandle})`);
      }
    } catch (e) {
      console.warn(`    ⚠️ Error harvesting page ${pageHandle}: ${e.message}`);
    }
  }

  fs.writeFileSync(path.join(OUTPUT_DIR, 'pages_harvested.json'), JSON.stringify(pagesData, null, 2), 'utf8');
  console.log(`  ✔ Key pages saved: ${pagesData.length} pages.\n`);

  // STEP 5: Audit & Checkpoint Gate 2
  console.log('====================================================');
  console.log('🎉 PHASE 2 CHECKPOINT AUDIT:');
  console.log(`  - Products Harvested: ${catalog.length}/41`);
  console.log(`  - Products with Rich Content: ${catalog.filter(p => p.hasRichDescription).length}/${catalog.length}`);
  console.log(`  - Collections Harvested: ${collectionsData.length}/17`);
  console.log(`  - Essential Pages Harvested: ${pagesData.length}`);
  console.log(`  - Brand Assets: Logo, ${homeImages.length} images, ${videoUrls.length} videos`);
  console.log('All raw data stored cleanly in Clone-navage/data/');
  console.log('====================================================\n');
}

runHarvest().catch(console.error);
