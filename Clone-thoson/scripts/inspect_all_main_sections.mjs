import fs from 'fs';

const html = fs.readFileSync('Clone-thoson/data/product.html', 'utf8');
const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
if (!mainMatch) {
  console.log('No main tag found');
  process.exit(1);
}

const mainHtml = mainMatch[1];
const re = /<(section|div)\s+id="shopify-section-([^"]+)"/g;
let m;
const list = [];
while ((m = re.exec(mainHtml)) !== null) {
  list.push({ tag: m[1], id: m[2], index: m.index });
}

console.log(`Found ${list.length} sections in <main>:`);
list.forEach((s, i) => {
  const nextIdx = i < list.length - 1 ? list[i+1].index : mainHtml.length;
  const chunk = mainHtml.slice(s.index, nextIdx);
  console.log(`[${i+1}] <${s.tag}> ID: ${s.id} | Size: ${chunk.length} bytes`);
});
