import fs from 'fs';

const html = fs.readFileSync('Clone-sakerplus/data/extracted_article_body.html', 'utf8');
const sections = html.split(/id=["']section-\d+["']/);

sections.forEach((sec, i) => {
  const text = sec.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const gifs = [...sec.matchAll(/https?:\/\/[^"'\s]+\.gif/gi)].map(m => m[0]);
  const imgs = [...sec.matchAll(/https:\/\/cdn\.myshopage\.com\/[^"'\s]+/gi)].map(m => m[0]);
  if (text.length > 20 || gifs.length > 0) {
    console.log(`\n================ Section ${i} ================`);
    if (gifs.length) console.log('GIFs:', gifs);
    if (imgs.length) console.log('Images:', imgs.slice(0, 2));
    console.log('Text preview:', text.slice(0, 300));
  }
});
