const handles = [
  'bronoir%E2%84%A2-skin-pro-with-copper-grounding-allround-barefoot-shoes-kopie',
  'bronoir-cosycloud-boot-warm-comfy-winter-barefoot-boot-bogo',
  'hikers-bogo',
  'bronoir%E2%84%A2-flex-barefoot-shoes-1-1-free',
  'bronoir%E2%84%A2-lift',
  'bronoir%E2%84%A2-freestride-winter-barefoot-shoes',
  'bronoir%E2%84%A2-arctic-2-0-winter-barefoot-shoes-1-1-free',
  'bronoir%E2%84%A2-high-pro-winter-barefoot-shoes-1-1-free',
  'bronoir%E2%84%A2-hike-barefoot-shoes-1-1-free',
  'bronoir%E2%84%A2-sport-pro-barefoot-shoes-1-1-free',
  'bronoir%E2%84%A2-fleece-winter-barefoot-shoes-1-1-free',
  'bronoir-streets-casual-everyday-barefoot-shoes-1-1-free',
  'bronoir%E2%84%A2-sport-pro-barefoot-shoes-1',
  'bronoir%E2%84%A2-military-barefoot-shoes-1-1-free',
  'bronoir%E2%84%A2-runner-pro-barefoot-shoes-big-sizes-1-1-gratis',
  'bronoir%E2%84%A2-autumn-2-0-barefoot-shoes',
  'bronoir%E2%84%A2-warmers-fleece-lined-non-slip-winter-boots-for-pain-free-walking',
  'bronoir-air-barefoot-shoes-1-1-free',
  'bronoir-workers-casual-everyday-barefoot-shoes-1-1-free',
  'bronoir%E2%84%A2-sports-barefoot-shoes-1-1-free',
  'bronoir%E2%84%A2-sky-barefoot-shoes',
  'bronoir%E2%84%A2-snowpiercer-winter-barefoot-shoes-1-1-free',
  'bronoir-ayelith-lightweight-arch-supportive-walking-sandals',
  'bronoir%E2%84%A2-drifters-barefoot-shoes-1-1-free',
  'bronoir%E2%84%A2-insulated-winter-barefoot-shoes-1',
  'bronoir%E2%84%A2-limited-barefoot-shoes-1-1-free',
  'bronoir%E2%84%A2-sports-barefoot-shoes',
  'bronoir%E2%84%A2-feel-barefoot-shoes',
  'hiking-footwear-high-pro-winter-barefoot-shoes',
  'bronoir%E2%84%A2-drifters-barefoot-shoes',
  'bronoir%E2%84%A2-limited-barefoot-shoes',
  'bronoir%E2%84%A2-warmers-fleece-lined-non-slip-winter-boots-for-pain-free-walking-1',
  'bronoir-nola-cozy-elegant-supportive-ballerinas-for-daily-comfort',
  'bronoir%E2%84%A2-arctic-2-0-winter-barefoot-shoes-1',
  'bronoir%E2%84%A2-ergo-streets-orthopedic-sneakers-for-pain-free-walking-1',
  'bronoir%E2%84%A2-feel-barefoot-shoes-1-1-free',
  'bronoir%E2%84%A2-arctic-barefoot-shoes',
  'bronoir%E2%84%A2-force-barefoot-shoes',
  'bronoir%E2%84%A2-insulated-winter-barefoot-shoes-2',
  'bronoir%E2%84%A2-vista-barefoot-shoes',
  'bronoir%E2%84%A2-arctic-2-0-winter-barefoot-shoes',
  'bronoir%E2%84%A2-insulated-winter-barefoot-shoes',
  'bronoir%E2%84%A2-lift-elegant-supportive-ballerinas-for-daily-comfort',
  'bronoir%E2%84%A2-flex-barefoot-shoes-limited-spring-offer',
  'bronoir%E2%84%A2-myava-lightweight-arch-supportive-walking-sandals',
  'bronoir%E2%84%A2-stridea-lightweight-arch-supportive-walking-sandals',
  'bronoir%E2%84%A2-skin-pro-with-copper-grounding-allround-barefoot-shoes-buy-2-get-1-free',
  'hikers',
  'bronoir%E2%84%A2-runner-pro-barefoot-shoes',
  'bronoir%E2%84%A2-military-barefoot-shoes'
];

async function scan() {
  const result = {
    hasCustomInfo: [],
    hasProductContent: [],
    other: []
  };

  for (const h of handles) {
    try {
      const res = await fetch(`https://trybronoir.com/products/${h}`);
      if (!res.ok) continue;
      const html = await res.text();
      const customInfo = html.includes('custom_info_block');
      const prodContent = html.includes('product-content');
      if (customInfo) result.hasCustomInfo.push(h);
      else if (prodContent) result.hasProductContent.push(h);
      else result.other.push(h);
    } catch(e) {}
  }

  console.log(`Has custom_info_block (${result.hasCustomInfo.length}):`, result.hasCustomInfo);
  console.log(`Has product-content (${result.hasProductContent.length}):`, result.hasProductContent);
  console.log(`Other (${result.other.length}):`, result.other);
}

scan();
