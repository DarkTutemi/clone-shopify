async function inspect(handle) {
  const url = `https://trybronoir.com/products/${handle}`;
  const res = await fetch(url);
  const html = await res.text();
  console.log(`\n=================== ${handle} ===================`);
  
  // Find all sections that have content between main and footer
  const sections = [...html.matchAll(/<div id="shopify-section-(template--[^"]+)"[^>]*>([\s\S]*?)<\/div>\s*<!-- \/shopify-section/g)];
  console.log('Template sections count:', sections.length);
  for (const s of sections) {
    const secId = s[1];
    const content = s[2];
    const textPreview = content.replace(/<style[\s\S]*?<\/style>/gi, '').replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160);
    console.log(`Section: ${secId} | Content: ${textPreview}`);
  }
}

async function run() {
  await inspect('bronoir-nola-cozy-elegant-supportive-ballerinas-for-daily-comfort');
  await inspect('bronoir%E2%84%A2-limited-barefoot-shoes');
  await inspect('bronoir%E2%84%A2-force-barefoot-shoes');
  await inspect('bronoir%E2%84%A2-vista-barefoot-shoes');
}
run();
