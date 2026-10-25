import fs from 'fs';

const html = fs.readFileSync('Clone-sakerplus/data/curl_funnel.html', 'utf8');

// Find all style tags and link rel=stylesheet
const styles = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(m => m[1]);
console.log('Inline style blocks count:', styles.length);

const links = [...html.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]*>/gi)].map(m => m[0]);
console.log('External stylesheet links:');
links.forEach(l => console.log(' -', l));

// Check total size of styles
const totalStyleChars = styles.reduce((acc, s) => acc + s.length, 0);
console.log(`Total inline CSS size: ${(totalStyleChars / 1024).toFixed(1)} KB`);

// Find the main article container
const articleMatch = html.match(/<div[^>]*class=["'][^"']*funnel-content-box[^"']*["'][\s\S]*?(?=<footer|<div class=["'][^"']*footer|<\/body>)/i);
if (articleMatch) {
  console.log(`Found article content! Length: ${articleMatch[0].length} chars`);
  fs.writeFileSync('Clone-sakerplus/data/extracted_article_body.html', articleMatch[0]);
  console.log('Saved to Clone-sakerplus/data/extracted_article_body.html');
}
