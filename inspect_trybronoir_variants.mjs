const HANDLES = [
  "bronoir-skin-pro-with-copper-grounding-allround-barefoot-shoes",
  "bronoir-cosycloud-boot-barefoot-winter-boots",
  "bronoir-hikers-orthopedic-outdoor-shoes",
  "hiking-footwear-flex",
  "bronoir-streets",
  "bronoir-runner-pro-barefoot-performance-running-shoes"
];

async function main() {
  for (const h of HANDLES) {
    try {
      const res = await fetch(`https://trybronoir.com/products/${h}.js`);
      if (res.status === 200) {
        const p = await res.json();
        console.log(`\n=== PRODUCT: ${p.title} (${h}) ===`);
        console.log('Options:', JSON.stringify(p.options));
        console.log(`Total Variants: ${p.variants.length}`);
        const colorVarImages = {};
        for (const v of p.variants) {
          const color = v.option1 || v.option2;
          if (v.featured_image && !colorVarImages[color]) {
            colorVarImages[color] = v.featured_image.src;
          }
        }
        console.log('Color -> Variant Image:', JSON.stringify(colorVarImages, null, 2));
      } else {
        console.log(`Product ${h}: status ${res.status}`);
      }
    } catch (e) {
      console.error(e);
    }
  }
}
main();
