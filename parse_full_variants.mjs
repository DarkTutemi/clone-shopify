async function main() {
  const res = await fetch('https://trybronoir.com/products/bronoir-skin-pro-with-copper-grounding-allround-barefoot-shoes');
  const html = await res.text();
  
  const scripts = [...html.matchAll(/<script[^>]*type=["']application\/json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  for (const s of scripts) {
    if (s[1].includes('"variants"') || s[1].includes('"optionValues"')) {
      try {
        const data = JSON.parse(s[1].trim());
        console.log('Product title:', data.title);
        console.log('Options:', data.options?.map(o => ({ name: o.name, values: o.optionValues?.map(v => v.name) })));
        if (data.variants) {
          console.log(`Variants count: ${data.variants.length}`);
          console.log('Sample variant:', JSON.stringify(data.variants[0], null, 2));
        }
      } catch (e) {
        // Continue
      }
    }
  }
}
main();
