import fs from 'fs';

const html = fs.readFileSync('Clone-navage/data/sinusitis_page.html', 'utf8');
const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
if (headMatch) {
  const headStyles = [...headMatch[1].matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(m => m[1]);
  console.log('Head styles count:', headStyles.length);
  headStyles.forEach((s, i) => {
    console.log(`\n--- Head Style [${i + 1}] (length: ${s.length}) ---`);
    console.log(s.substring(0, 400));
  });
}
