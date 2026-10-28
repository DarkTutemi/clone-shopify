import fs from 'fs';

const html = fs.readFileSync('draft_working/botanaroots_body_html.html', 'utf8');
const revIdx = html.indexOf('<!-- Verified Customer Reviews Section -->');
if (revIdx !== -1) {
  const revHtml = html.slice(revIdx);
  const imgs = revHtml.match(/<img[^>]+>/g) || [];
  console.log('Images in reviews section:', imgs.length);
  imgs.forEach(i => console.log('Review img:', i));
}
