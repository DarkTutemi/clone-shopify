import fs from 'fs';

const html = fs.readFileSync('Clone-thoson/data/product.html', 'utf8');

// Find all <style> blocks in <head>
const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
if (headMatch) {
  const headHtml = headMatch[1];
  const styleTags = headHtml.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || [];
  console.log(`Found ${styleTags.length} <style> tags in <head>.`);
  let rootStyles = '';
  styleTags.forEach((s, idx) => {
    if (s.includes(':root') || s.includes('--color-') || s.includes('--font-') || s.includes('thx-')) {
      console.log(`Style tag [${idx+1}] has :root or theme variables (size ${s.length})`);
      rootStyles += s + '\n';
    }
  });
  fs.writeFileSync('Clone-thoson/data/thx_root_vars.css', rootStyles);
  console.log('Saved thx_root_vars.css, size:', rootStyles.length);
}
