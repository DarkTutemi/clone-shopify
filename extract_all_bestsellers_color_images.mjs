const PRODUCTS = [
  {
    name: "CosyCloud Boot",
    url: "https://trybronoir.com/products/bronoir-cosycloud-boot-barefoot-winter-boots"
  },
  {
    name: "Hikers",
    url: "https://trybronoir.com/products/bronoir-hikers-orthopedic-outdoor-shoes"
  },
  {
    name: "Flex",
    url: "https://trybronoir.com/products/hiking-footwear-flex"
  },
  {
    name: "Streets",
    url: "https://trybronoir.com/products/bronoir-streets"
  },
  {
    name: "Runner Pro",
    url: "https://trybronoir.com/products/bronoir-runner-pro-barefoot-performance-running-shoes"
  }
];

async function main() {
  const result = {};
  for (const p of PRODUCTS) {
    try {
      const res = await fetch(p.url);
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
                  colorImages[color] = v.image;
                }
              }
              result[p.name] = {
                title: data.title,
                options: data.options?.map(o => ({ name: o.name, values: o.optionValues?.map(v => v.name) })),
                colorImages
              };
              break;
            }
          } catch(e) {}
        }
      }
    } catch (e) {
      console.error(p.name, e);
    }
  }
  console.log(JSON.stringify(result, null, 2));
}
main();
