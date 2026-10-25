import fs from 'fs';

const html = fs.readFileSync('Clone-navage/data/sinusitis_page.html', 'utf8');
const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
if (headMatch) {
  const headStyles = [...headMatch[1].matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(m => m[1]);
  fs.writeFileSync('Clone-navage/data/head_style_1.css', headStyles[0]);
  console.log('Saved head_style_1.css, length:', headStyles[0].length);
}
