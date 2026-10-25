import fs from 'fs';

function inspectFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log(`${filePath} does not exist`);
    return;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  console.log(`\n=== ${filePath} (length: ${content.length}) ===`);

  // Find all GIFs
  const gifRegex = /https?:\/\/[^"'\s]+\.gif(?:\?[^"'\s]*)?/gi;
  const gifs = Array.from(new Set(content.match(gifRegex) || []));
  console.log(`Found ${gifs.length} GIFs:`);
  gifs.forEach((g, i) => console.log(`  [${i+1}] ${g}`));

  // Check title or headings
  const h1 = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (h1) console.log('H1:', h1[1].replace(/<[^>]+>/g, '').trim());

  const h2s = content.match(/<h2[^>]*>([\s\S]*?)<\/h2>/gi) || [];
  console.log(`H2s (${h2s.length}):`);
  h2s.slice(0, 5).forEach(h => console.log('  -', h.replace(/<[^>]+>/g, '').trim()));
}

inspectFile('Clone-sakerplus/data/fence_post_product_page.html');
inspectFile('Clone-sakerplus/data/extracted_article_body.html');
inspectFile('Clone-sakerplus/data/funnel_fence_post.html');
