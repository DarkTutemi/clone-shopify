async function main() {
  const res = await fetch('https://trybronoir.com/products/bronoir-skin-pro-with-copper-grounding-allround-barefoot-shoes');
  const html = await res.text();
  
  const scripts = [...html.matchAll(/<script[^>]*type=["']application\/json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  for (const s of scripts) {
    if (s[1].includes('"variants"') && s[1].includes('"Black"')) {
      const data = JSON.parse(s[1].trim());
      const colorImages = {};
      for (const v of data.variants) {
        const color = v.options[0];
        if (!colorImages[color] && v.image) {
          colorImages[color] = v.image;
        }
      }
      console.log('Skin Pro Color -> Image:');
      console.log(JSON.stringify(colorImages, null, 2));
      break;
    }
  }
}
main();
