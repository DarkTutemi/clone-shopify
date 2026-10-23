async function inspect(handle) {
  const url = `https://trybronoir.com/products/${handle}`;
  const res = await fetch(url);
  const html = await res.text();
  console.log(`\n=================== ${handle} ===================`);
  
  // Find all id="shopify-section-..."
  const regex = /id="(shopify-section-[^"]+)"/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const id = match[1];
    // Find content between this id and next shopify-section or end
    const startIdx = match.index;
    const snippet = html.slice(startIdx, startIdx + 1200);
    const textOnly = snippet
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 150);
    console.log(`ID: ${id}\n  Text: ${textOnly}\n`);
  }
}

async function run() {
  await inspect('bronoir-nola-cozy-elegant-supportive-ballerinas-for-daily-comfort');
}
run();
