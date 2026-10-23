import fs from 'fs';

async function main() {
  const url = 'https://earthlyderm.com/collections/earthly-derm/products/turmeric-glow-soap?variant=43082567221382';
  console.log('Fetching', url);
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  const html = await res.text();
  fs.writeFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/pdp_original.html', html);
  console.log('Saved raw HTML, size:', html.length);

  // Find sections
  const sectionIds = [
    'shopify-section-template--19526978371718__section_marquee_et38kb',
    'shopify-section-template--19526978371718__main',
    'shopify-section-template--19526978371718__section_reviews_slider_UQ3V97',
    'shopify-section-template--19526978371718__section_what_to_expect_nXxXNh',
    'shopify-section-template--19526978371718__section_before_after_results_qhVhtt',
    'shopify-section-template--19526978371718__section_ingredients_info_V8yJF8',
    'shopify-section-template--19526978371718__pdp_faqs_section_KnrD9Y',
    'shopify-section-template--19526978371718__pdp_moneyback_section_8zFwEK'
  ];

  for (let i = 0; i < sectionIds.length; i++) {
    const sId = sectionIds[i];
    const needle = `id="${sId}"`;
    const start = html.indexOf(needle);
    if (start === -1) {
      console.log(`Section ${sId} not found`);
      continue;
    }
    // find start tag '<div ' or '<section ' before needle
    const tagStart = html.lastIndexOf('<', start);
    
    // find next section start or footer
    let nextStart = -1;
    if (i < sectionIds.length - 1) {
      const nextNeedle = `id="${sectionIds[i+1]}"`;
      const nextPos = html.indexOf(nextNeedle);
      if (nextPos !== -1) {
        nextStart = html.lastIndexOf('<', nextPos);
      }
    } else {
      nextStart = html.indexOf('shopify-section-sections--19526978470022__footer');
      if (nextStart !== -1) nextStart = html.lastIndexOf('<', nextStart);
    }

    const secHtml = nextStart !== -1 ? html.substring(tagStart, nextStart) : html.substring(tagStart, tagStart + 20000);
    fs.writeFileSync(`h:/Shopify-Clone/Clone-earthlyderm/data/${sId}.html`, secHtml);
    console.log(`Saved ${sId}.html, size: ${secHtml.length}`);
  }
}

main().catch(console.error);
