async function extract(url) {
  const res = await fetch(url);
  const html = await res.text();
  const headings = [...html.matchAll(/<h[23][^>]*>(.*?)<\/h[23]>/g)].map(m => m[1].replace(/<[^>]+>/g, '').trim()).filter(Boolean);
  console.log('--- URL:', url);
  console.log('Headings:', headings);
}

async function run() {
  await extract('https://trybronoir.com/products/bronoir%E2%84%A2-skin-pro-with-copper-grounding-allround-barefoot-shoes');
  await extract('https://trybronoir.com/products/bronoir-ayelith-lightweight-arch-supportive-walking-sandals');
}
run();
