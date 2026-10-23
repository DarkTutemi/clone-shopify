import fs from 'fs';

const html = fs.readFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/products_turmeric-glow-soap.html', 'utf8');

function extractSection(id) {
  const startTag = `<div id="shopify-section-${id}"`;
  const startIdx = html.indexOf(startTag);
  if (startIdx === -1) return null;
  
  // Find closing of this section or next section
  const nextSectionIdx = html.indexOf('<div id="shopify-section-', startIdx + startTag.length);
  const endIdx = nextSectionIdx !== -1 ? nextSectionIdx : html.length;
  return html.substring(startIdx, endIdx);
}

const sections = [
  'template--19526978371718__section_marquee_et38kb',
  'template--19526978371718__main',
  'template--19526978371718__section_reviews_slider_UQ3V97',
  'template--19526978371718__section_what_to_expect_nXxXNh',
  'template--19526978371718__section_before_after_results_qhVhtt',
  'template--19526978371718__section_ingredients_info_V8yJF8',
  'template--19526978371718__pdp_faqs_section_KnrD9Y',
  'template--19526978371718__pdp_moneyback_section_8zFwEK'
];

for (const sec of sections) {
  const content = extractSection(sec);
  console.log(`\n=================== ${sec} (length: ${content?.length}) ===================`);
  if (content) {
    // print first 500 chars clean
    const cleanText = content.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<style[\s\S]*?<\/style>/gi, '');
    console.log(cleanText.substring(0, 400).trim());
  }
}
