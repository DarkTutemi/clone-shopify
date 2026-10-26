import fs from 'fs';
const prods = JSON.parse(fs.readFileSync('scripts/raw_5_products.json', 'utf8'));

for (const p of prods) {
  console.log('====================================================');
  console.log(`PRODUCT: ${p.title} (${p.handle})`);

  // 1. Tables
  const tableMatches = [...p.body_html.matchAll(/<table[^>]*>([\s\S]*?)<\/table>/gi)];
  if (tableMatches.length > 0) {
    console.log(`  Found ${tableMatches.length} tables:`);
    tableMatches.forEach((t, idx) => {
      const rows = [...t[1].matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)].map(r => {
        return [...r[1].matchAll(/<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi)].map(c => c[1].replace(/<[^>]+>/g, '').trim());
      });
      console.log(`    Table ${idx + 1} (${rows.length} rows):`, rows.slice(0, 4));
    });
  } else {
    console.log('  No tables found.');
  }

  // 2. Lists (ul, ol)
  const ulMatches = [...p.body_html.matchAll(/<ul[^>]*>([\s\S]*?)<\/ul>/gi)];
  console.log(`  Found ${ulMatches.length} unordered lists:`);
  ulMatches.forEach((ul, idx) => {
    const lis = [...ul[1].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map(li => li[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
    console.log(`    UL ${idx + 1} (${lis.length} items):`, lis.slice(0, 3));
  });

  // 3. Inline images
  const imgMatches = [...p.body_html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)].map(m => m[1]);
  console.log(`  Found ${imgMatches.length} inline images:`, imgMatches);
}
