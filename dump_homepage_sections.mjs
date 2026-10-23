import fs from 'fs';

const html = fs.readFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/homepage.html', 'utf8');

function getSectionContent(sectionId) {
  const marker = `id="shopify-section-${sectionId}"`;
  const idx = html.indexOf(marker);
  if (idx === -1) return '';
  const nextIdx = html.indexOf('id="shopify-section-', idx + marker.length);
  return html.substring(idx, nextIdx !== -1 ? nextIdx : idx + 30000);
}

const sections = [
  'sections--19526978502790__vs_announcement_bar_gYqhaU',
  'sections--19526978502790__header',
  'template--19526977814662__section_hero_banner_2_NFRiTr',
  'template--19526977814662__section_promo_bar_W6txNw',
  'template--19526977814662__section_what_to_expect_nXxXNh',
  'template--19526977814662__pdp_glow_section_txREF8',
  'template--19526977814662__section_image_with_text_NRBaL6',
  'template--19526977814662__pdp_faqs_section_3tWAzC',
  'template--19526977814662__pdp_moneyback_section_8zFwEK',
  'sections--19526978470022__footer'
];

for (const s of sections) {
  const content = getSectionContent(s);
  console.log(`\n================ SECTION: ${s} (length: ${content.length}) ================`);
  const clean = content.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '').replace(/[\t\r\n ]+/g, ' ');
  console.log(clean.substring(0, 300));
  fs.writeFileSync(`h:/Shopify-Clone/Clone-earthlyderm/data/sec_${s}.html`, content);
}
console.log('Saved raw sections to data/sec_*.html');
