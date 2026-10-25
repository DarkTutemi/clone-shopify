async function main() {
  const res = await fetch('https://tryzavelyn.com/products/sakerplus-livestock-heating-lamp', {
    headers: { 'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1' }
  });
  console.log('HTTP Status:', res.status);
  const html = await res.text();
  console.log('HTML Length:', html.length);

  const checks = {
    title: html.includes('Zavelyn® Intelligent Livestock Heating Lamp'),
    heroBuybox: html.includes('wf-hero-buybox'),
    bundleCards: (html.match(/wf-bundle-card/g) || []).length,
    variant2Pack: html.includes('67930179436729'),
    variant1Pack: html.includes('67930179403961'),
    featureSection: html.includes('Designed for Better Everyday Livestock Care'),
    featureCards: (html.match(/wf-card-item/g) || []).length,
    section3A_split: html.includes('Reliable Warmth for Your Everyday Routine'),
    section3B_steps: html.includes('Simple Setup. Easy Temperature Adjustments.'),
    stepCards: (html.match(/wf-step-card/g) || []).length,
    section3C_specs: html.includes('Product Specifications at a Glance'),
    specCards: (html.match(/wf-spec-card/g) || []).length,
    section3D_trust: (html.match(/wf-tc-card/g) || []).length,
    section4_comparison: html.includes('Zavelyn® vs. Traditional 250W Heat Lamps'),
    compRows: (html.match(/wf-td-feat/g) || []).length,
    section5_reviews: html.includes('What Homesteaders &amp; Farmers Are Saying') || html.includes('What Homesteaders & Farmers Are Saying'),
    reviewCards: (html.match(/wf-review-card/g) || []).length,
    section6_faq: html.includes('Frequently Asked Questions'),
    faqItems: (html.match(/wf-faq-item/g) || []).length,
    stickyBuyBar: html.includes('wf-sticky-buy-bar')
  };

  console.log('\n--- Live PDP Quality Audit ---');
  for (const [key, val] of Object.entries(checks)) {
    console.log(`  ${val ? '✔' : '✖'} ${key}: ${val}`);
  }
}

main().catch(console.error);
