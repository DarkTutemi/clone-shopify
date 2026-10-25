const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "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";

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

function cleanFilename(url) {
  if (!url) return '';
  const parts = url.split('?')[0].split('/');
  return parts[parts.length - 1];
}

async function main() {
  console.log('=== Syncing Variant Images for all 50 Products ===');
  const token = await getAccessToken();

  for (let i = 0; i < PRODUCT_URLS.length; i++) {
    const rawUrl = PRODUCT_URLS[i];
    console.log(`\n[${i + 1}/${PRODUCT_URLS.length}] Processing: ${rawUrl}`);

    let sourceProd = null;
    try {
      const res = await fetch(rawUrl + '.js');
      if (!res.ok) continue;
      sourceProd = await res.json();
    } catch (e) {
      console.error(`  Fetch error for ${rawUrl}:`, e.message);
      continue;
    }

    const cleanHandle = sourceProd.handle.replace(/™/g, '').toLowerCase();

    // Map source colors to their source image filenames
    const colorToSourceFilename = {};
    for (const v of sourceProd.variants || []) {
      const color = v.option1 || v.option2;
      if (color && v.featured_image && v.featured_image.src) {
        if (!colorToSourceFilename[color]) {
          colorToSourceFilename[color] = cleanFilename(v.featured_image.src);
        }
      }
    }

    // Get product from our store
    let targetProd = null;
    try {
      const getRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-01/products.json?handle=${cleanHandle}`, {
        headers: { 'X-Shopify-Access-Token': token }
      });
      const getData = await getRes.json();
      targetProd = (getData.products || [])[0];
      if (!targetProd) {
        const getRes2 = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-01/products.json?handle=${sourceProd.handle}`, {
          headers: { 'X-Shopify-Access-Token': token }
        });
        const getData2 = await getRes2.json();
        targetProd = (getData2.products || [])[0];
      }
    } catch (e) {
      console.error('  Error fetching store product:', e.message);
      continue;
    }

    if (!targetProd) {
      console.warn(`  ! Store product not found for handle: ${cleanHandle}`);
      continue;
    }

    console.log(`  Found store product ID: ${targetProd.id} (${targetProd.title})`);

    // Map store image filenames to store image IDs
    const filenameToImageId = {};
    for (const img of targetProd.images || []) {
      const fn = cleanFilename(img.src);
      filenameToImageId[fn] = img.id;
    }

    // Map color to store image ID
    const colorToImageId = {};
    for (const [color, srcFn] of Object.entries(colorToSourceFilename)) {
      // Find matching filename in store images
      for (const [storeFn, imgId] of Object.entries(filenameToImageId)) {
        if (storeFn.includes(srcFn) || srcFn.includes(storeFn) || storeFn.replace(/_\d+x/, '') === srcFn.replace(/_\d+x/, '')) {
          colorToImageId[color] = imgId;
          break;
        }
      }
      // If direct match failed, match by index if possible
      if (!colorToImageId[color] && targetProd.images && targetProd.images.length > 0) {
        const colorIdx = Object.keys(colorToSourceFilename).indexOf(color);
        if (targetProd.images[colorIdx]) {
          colorToImageId[color] = targetProd.images[colorIdx].id;
        }
      }
    }

    console.log(`  Color -> Image ID mapping:`, colorToImageId);

    // Update variants
    let needsUpdate = false;
    const updatedVariants = (targetProd.variants || []).map(v => {
      const color = v.option1 || v.option2;
      const targetImgId = colorToImageId[color];
      if (targetImgId && v.image_id !== targetImgId) {
        needsUpdate = true;
        return { id: v.id, image_id: targetImgId };
      }
      return { id: v.id, image_id: v.image_id || targetImgId || null };
    });

    if (needsUpdate) {
      try {
        const updateRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-01/products/${targetProd.id}.json`, {
          method: 'PUT',
          headers: {
            'X-Shopify-Access-Token': token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            product: {
              id: targetProd.id,
              variants: updatedVariants
            }
          })
        });
        if (updateRes.ok) {
          console.log(`  ✓ Successfully updated variant image links for ${targetProd.title}!`);
        } else {
          console.error(`  ✗ Failed to update variants (${updateRes.status}):`, (await updateRes.text()).slice(0, 150));
        }
      } catch (e) {
        console.error('  Error updating product:', e.message);
      }
    } else {
      console.log(`  ✓ Variants already properly mapped.`);
    }

    await sleep(400);
  }

  console.log('\n=== Variant Images Sync Complete! ===');
}

main().catch(console.error);
