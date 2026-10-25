import fs from 'fs';

function extractImgsFromHtml(html, pageName) {
  const matches = [...html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)];
  return matches.map(m => {
    const fullTag = m[0];
    const src = m[1];
    const altMatch = fullTag.match(/alt=["']([^"']*)["']/i);
    return {
      page: pageName,
      src,
      alt: altMatch ? altMatch[1] : ''
    };
  });
}

const html1 = fs.readFileSync('target_dough_mixer.html', 'utf-8');
const html2 = fs.readFileSync('target_dough_mixer_step2.html', 'utf-8');
const html3 = fs.readFileSync('target_dough_mixer_order.html', 'utf-8');

const imgs1 = extractImgsFromHtml(html1, 'advertorial');
const imgs2 = extractImgsFromHtml(html2, 'step2_landing');
const imgs3 = extractImgsFromHtml(html3, 'order_checkout');

console.log('Advertorial imgs:', imgs1.length);
console.log('Step 2 imgs:', imgs2.length);
console.log('Order imgs:', imgs3.length);

console.log('\n--- Order Page Images ---');
imgs3.forEach((img, i) => console.log(`${i}: [${img.alt}] ${img.src}`));

fs.writeFileSync('all_page_imgs.json', JSON.stringify({ imgs1, imgs2, imgs3 }, null, 2));
