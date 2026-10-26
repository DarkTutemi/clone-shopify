import fs from 'fs';

const txt = fs.readFileSync('scripts/buybox_zone_summary.txt', 'utf-8');
const faqPos = txt.indexOf('kc-faq__item');
if (faqPos !== -1) {
  const beforeFaq = txt.substring(faqPos - 4000, faqPos + 3000);
  fs.writeFileSync('scripts/kitty_around_faq.html', beforeFaq, 'utf-8');
  console.log('Saved kitty_around_faq.html');
}
