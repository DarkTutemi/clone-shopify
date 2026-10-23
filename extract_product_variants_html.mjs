async function main() {
  const res = await fetch('https://trybronoir.com/products/bronoir-skin-pro-with-copper-grounding-allround-barefoot-shoes');
  const html = await res.text();
  console.log('Status:', res.status);

  // Search for variant JSON in HTML
  const m = html.match(/var\s+meta\s*=\s*(\{[\s\S]*?\});/);
  if (m) {
    console.log('Found meta JSON');
  }

  // Look for product json in script tags
  const scripts = [...html.matchAll(/<script[^>]*type=["']application\/json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  console.log('Found json script tags:', scripts.length);
  for (const s of scripts) {
    if (s[1].includes('"variants"') || s[1].includes('"sku"')) {
      console.log('Found variant script tag:');
      console.log(s[1].substring(0, 1500));
      break;
    }
  }
}
main();
