import fs from 'fs';
const prods = JSON.parse(fs.readFileSync('scripts/raw_5_products.json', 'utf8'));

for (const p of prods) {
  console.log('==================================================');
  console.log('PRODUCT:', p.title);
  console.log('HANDLE:', p.handle);
  console.log('HTML LENGTH:', p.body_html.length);
  console.log('IMAGES COUNT:', p.images.length);

  // Extract all headings
  const hMatches = [...p.body_html.matchAll(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
  console.log('HEADINGS:', hMatches);

  // Extract strong tags that look like section titles
  const strongs = [...p.body_html.matchAll(/<strong>(.*?)<\/strong>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim()).filter(s => s.length > 3 && s.length < 80);
  console.log('STRONGS (first 10):', strongs.slice(0, 10));

  // Check tables
  const tables = [...p.body_html.matchAll(/<table[^>]*>([\s\S]*?)<\/table>/gi)];
  console.log('TABLES COUNT:', tables.length);

  // Check inline images in description
  const inlineImgs = [...p.body_html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)].map(m => m[1]);
  console.log('INLINE IMAGES COUNT:', inlineImgs.length);
}
