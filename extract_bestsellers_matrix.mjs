const URLS = [
  "https://trybronoir.com/products/bronoir%E2%84%A2-skin-pro-with-copper-grounding-allround-barefoot-shoes-kopie",
  "https://trybronoir.com/products/bronoir-cosycloud-boot-warm-comfy-winter-barefoot-boot-bogo",
  "https://trybronoir.com/products/hikers-bogo",
  "https://trybronoir.com/products/bronoir%E2%84%A2-flex-barefoot-shoes-1-1-free",
  "https://trybronoir.com/products/bronoir-streets-casual-everyday-barefoot-shoes-1-1-free",
  "https://trybronoir.com/products/bronoir%E2%84%A2-runner-pro-barefoot-shoes-big-sizes-1-1-gratis"
];

async function main() {
  const catalog = [];
  for (const u of URLS) {
    try {
      const res = await fetch(u);
      const html = await res.text();
      const scripts = [...html.matchAll(/<script[^>]*type=["']application\/json["'][^>]*>([\s\S]*?)<\/script>/gi)];
      for (const s of scripts) {
        if (s[1].includes('"variants"') && s[1].includes('"options"')) {
          try {
            const data = JSON.parse(s[1].trim());
            if (data.title && !data.title.includes('Gift Card')) {
              const colorImages = {};
              for (const v of data.variants || []) {
                const color = v.options?.[0];
                if (color && !colorImages[color] && v.image) {
                  colorImages[color] = v.image.startsWith('//') ? 'https:' + v.image : v.image;
                }
              }
              catalog.push({
                title: data.title,
                url: u,
                options: data.options?.map(o => ({ name: o.name, values: o.optionValues?.map(v => v.name) })),
                colorImages,
                variantsCount: data.variants?.length
              });
              break;
            }
          } catch(e) {}
        }
      }
    } catch(e) {
      console.error(e);
    }
  }
  console.log(JSON.stringify(catalog, null, 2));
}
main();
