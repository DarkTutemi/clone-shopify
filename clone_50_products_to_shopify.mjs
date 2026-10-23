
const SHOP_DOMAIN = 'vwpb1k-8z.myshopify.com';
const CLIENT_ID = '82d6aaab9e73809cb37b6643302b1255';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "SHOPIFY_SECRET_TOKEN";
const COLLECTION_ID = 493136052378; // bestseller-old

const PRODUCT_URLS = [
  "https://trybronoir.com/products/bronoir%E2%84%A2-skin-pro-with-copper-grounding-allround-barefoot-shoes-kopie",
  "https://trybronoir.com/products/bronoir-cosycloud-boot-warm-comfy-winter-barefoot-boot-bogo",
  "https://trybronoir.com/products/hikers-bogo",
  "https://trybronoir.com/products/bronoir%E2%84%A2-flex-barefoot-shoes-1-1-free",
  "https://trybronoir.com/products/bronoir%E2%84%A2-lift",
  "https://trybronoir.com/products/bronoir%E2%84%A2-freestride-winter-barefoot-shoes",
  "https://trybronoir.com/products/bronoir%E2%84%A2-arctic-2-0-winter-barefoot-shoes-1-1-free",
  "https://trybronoir.com/products/bronoir%E2%84%A2-high-pro-winter-barefoot-shoes-1-1-free",
  "https://trybronoir.com/products/bronoir%E2%84%A2-hike-barefoot-shoes-1-1-free",
  "https://trybronoir.com/products/bronoir%E2%84%A2-sport-pro-barefoot-shoes-1-1-free",
  "https://trybronoir.com/products/bronoir%E2%84%A2-fleece-winter-barefoot-shoes-1-1-free",
  "https://trybronoir.com/products/bronoir-streets-casual-everyday-barefoot-shoes-1-1-free",
  "https://trybronoir.com/products/bronoir%E2%84%A2-sport-pro-barefoot-shoes-1",
  "https://trybronoir.com/products/bronoir%E2%84%A2-military-barefoot-shoes-1-1-free",
  "https://trybronoir.com/products/bronoir%E2%84%A2-runner-pro-barefoot-shoes-big-sizes-1-1-gratis",
  "https://trybronoir.com/products/bronoir%E2%84%A2-autumn-2-0-barefoot-shoes",
  "https://trybronoir.com/products/bronoir%E2%84%A2-warmers-fleece-lined-non-slip-winter-boots-for-pain-free-walking",
  "https://trybronoir.com/products/bronoir-air-barefoot-shoes-1-1-free",
  "https://trybronoir.com/products/bronoir-workers-casual-everyday-barefoot-shoes-1-1-free",
  "https://trybronoir.com/products/bronoir%E2%84%A2-sports-barefoot-shoes-1-1-free",
  "https://trybronoir.com/products/bronoir%E2%84%A2-sky-barefoot-shoes",
  "https://trybronoir.com/products/bronoir%E2%84%A2-snowpiercer-winter-barefoot-shoes-1-1-free",
  "https://trybronoir.com/products/bronoir-ayelith-lightweight-arch-supportive-walking-sandals",
  "https://trybronoir.com/products/bronoir%E2%84%A2-drifters-barefoot-shoes-1-1-free",
  "https://trybronoir.com/products/bronoir%E2%84%A2-insulated-winter-barefoot-shoes-1",
  "https://trybronoir.com/products/bronoir%E2%84%A2-limited-barefoot-shoes-1-1-free",
  "https://trybronoir.com/products/bronoir%E2%84%A2-sports-barefoot-shoes",
  "https://trybronoir.com/products/bronoir%E2%84%A2-feel-barefoot-shoes",
  "https://trybronoir.com/products/hiking-footwear-high-pro-winter-barefoot-shoes",
  "https://trybronoir.com/products/bronoir%E2%84%A2-drifters-barefoot-shoes",
  "https://trybronoir.com/products/bronoir%E2%84%A2-limited-barefoot-shoes",
  "https://trybronoir.com/products/bronoir%E2%84%A2-warmers-fleece-lined-non-slip-winter-boots-for-pain-free-walking-1",
  "https://trybronoir.com/products/bronoir-nola-cozy-elegant-supportive-ballerinas-for-daily-comfort",
  "https://trybronoir.com/products/bronoir%E2%84%A2-arctic-2-0-winter-barefoot-shoes-1",
  "https://trybronoir.com/products/bronoir%E2%84%A2-ergo-streets-orthopedic-sneakers-for-pain-free-walking-1",
  "https://trybronoir.com/products/bronoir%E2%84%A2-feel-barefoot-shoes-1-1-free",
  "https://trybronoir.com/products/bronoir%E2%84%A2-arctic-barefoot-shoes",
  "https://trybronoir.com/products/bronoir%E2%84%A2-force-barefoot-shoes",
  "https://trybronoir.com/products/bronoir%E2%84%A2-insulated-winter-barefoot-shoes-2",
  "https://trybronoir.com/products/bronoir%E2%84%A2-vista-barefoot-shoes",
  "https://trybronoir.com/products/bronoir%E2%84%A2-arctic-2-0-winter-barefoot-shoes",
  "https://trybronoir.com/products/bronoir%E2%84%A2-insulated-winter-barefoot-shoes",
  "https://trybronoir.com/products/bronoir%E2%84%A2-lift-elegant-supportive-ballerinas-for-daily-comfort",
  "https://trybronoir.com/products/bronoir%E2%84%A2-flex-barefoot-shoes-limited-spring-offer",
  "https://trybronoir.com/products/bronoir%E2%84%A2-myava-lightweight-arch-supportive-walking-sandals",
  "https://trybronoir.com/products/bronoir%E2%84%A2-stridea-lightweight-arch-supportive-walking-sandals",
  "https://trybronoir.com/products/bronoir%E2%84%A2-skin-pro-with-copper-grounding-allround-barefoot-shoes-buy-2-get-1-free",
  "https://trybronoir.com/products/hikers",
  "https://trybronoir.com/products/bronoir%E2%84%A2-runner-pro-barefoot-shoes",
  "https://trybronoir.com/products/bronoir%E2%84%A2-military-barefoot-shoes"
];

async function getAccessToken() {
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials'
    })
  });
  const data = await res.json();
  return data.access_token;
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  console.log('=== Starting Clone of 50 Products from trybronoir.com ===');
  const token = await getAccessToken();
  console.log('Obtained Admin API access token.');

  // Fetch existing products in store to check handles
  const existingRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-01/products.json?limit=250`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const existingData = await existingRes.json();
  const existingHandles = new Set((existingData.products || []).map(p => p.handle));
  const existingIdMap = new Map((existingData.products || []).map(p => [p.handle, p.id]));
  console.log(`Found ${existingHandles.size} existing products in store.`);

  let createdCount = 0;
  let linkedCount = 0;

  for (let i = 0; i < PRODUCT_URLS.length; i++) {
    const rawUrl = PRODUCT_URLS[i];
    console.log(`\n[${i + 1}/${PRODUCT_URLS.length}] Processing: ${rawUrl}`);

    let sourceProd = null;
    try {
      const res = await fetch(rawUrl + '.js');
      if (!res.ok) {
        console.error(`  Failed to fetch ${rawUrl}.js (Status ${res.status})`);
        continue;
      }
      sourceProd = await res.json();
    } catch (e) {
      console.error(`  Fetch error for ${rawUrl}:`, e.message);
      continue;
    }

    const cleanHandle = sourceProd.handle.replace(/™/g, '').toLowerCase();

    // Check if product already exists
    let targetProductId = existingIdMap.get(cleanHandle) || existingIdMap.get(sourceProd.handle);

    if (!targetProductId) {
      console.log(`  Creating product: "${sourceProd.title}" (handle: ${cleanHandle})...`);

      // Prepare images (top 10 max to stay fast)
      const images = (sourceProd.images || []).slice(0, 10).map(imgUrl => {
        const fullUrl = imgUrl.startsWith('//') ? 'https:' + imgUrl : imgUrl;
        return { src: fullUrl };
      });

      // Prepare options
      const options = (sourceProd.options || []).map(opt => ({
        name: opt.name
      }));

      // Prepare variants
      const variants = (sourceProd.variants || []).slice(0, 80).map(v => {
        return {
          option1: v.option1,
          option2: v.option2,
          option3: v.option3,
          price: (v.price / 100).toString(),
          compare_at_price: v.compare_at_price ? (v.compare_at_price / 100).toString() : null,
          sku: v.sku || '',
          requires_shipping: true
        };
      });

      const payload = {
        product: {
          title: sourceProd.title,
          body_html: sourceProd.description || '',
          vendor: 'Bronoir',
          product_type: 'Shoes',
          handle: cleanHandle,
          tags: (sourceProd.tags || []).join(', ') + ', bestseller',
          options: options.length > 0 ? options : [{ name: 'Title' }],
          variants: variants.length > 0 ? variants : [{ price: '1966000', title: 'Default Title' }],
          images: images
        }
      };

      try {
        const createRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-01/products.json`, {
          method: 'POST',
          headers: {
            'X-Shopify-Access-Token': token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (createRes.ok) {
          const createData = await createRes.json();
          targetProductId = createData.product.id;
          console.log(`  ✓ Created successfully! ID: ${targetProductId}`);
          createdCount++;
        } else {
          const errText = await createRes.text();
          console.error(`  ✗ Create failed (${createRes.status}):`, errText.slice(0, 200));
        }
      } catch (e) {
        console.error(`  ✗ Network error creating product:`, e.message);
      }
    } else {
      console.log(`  ✓ Product already exists with ID: ${targetProductId}`);
    }

    // Attach to collection bestseller-old
    if (targetProductId) {
      try {
        const collectRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-01/collects.json`, {
          method: 'POST',
          headers: {
            'X-Shopify-Access-Token': token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            collect: {
              collection_id: COLLECTION_ID,
              product_id: targetProductId
            }
          })
        });
        if (collectRes.ok) {
          console.log(`  ✓ Linked to collection bestseller-old`);
          linkedCount++;
        } else if (collectRes.status === 422) {
          // Already in collection
          console.log(`  ✓ Already in collection bestseller-old`);
          linkedCount++;
        } else {
          console.warn(`  ! Link status: ${collectRes.status}`);
        }
      } catch (e) {
        console.error(`  Failed linking to collection:`, e.message);
      }
    }

    // Rate-limiting delay (500ms between calls)
    await sleep(600);
  }

  console.log(`\n========================================`);
  console.log(`All done! Created: ${createdCount}, Linked: ${linkedCount}`);
  console.log(`========================================`);
}

main().catch(console.error);
