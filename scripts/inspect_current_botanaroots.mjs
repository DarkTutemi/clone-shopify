import fs from 'fs';

async function inspectCurrentPDP() {
  const url = 'https://tryzavelyn.com/products/zavelyn-botanaroots-organic-batana-hair-growth-oil';
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  const html = await res.text();
  console.log('HTTP Status:', res.status);
  console.log('HTML Length:', html.length);

  // Check which sections are included
  const sectionMatches = [...html.matchAll(/id="shopify-section-([^"]+)"/g)].map(m => m[1]);
  console.log('Rendered Sections:', [...new Set(sectionMatches)]);

  // Check bundle markup
  const bundleMatch = html.includes('bundle') || html.includes('package') || html.includes('Buy 1');
  console.log('Has bundle text:', bundleMatch);

  // Check template
  const templateMatch = html.match(/template-product[^\s"']*/);
  console.log('Body template class:', templateMatch ? templateMatch[0] : 'N/A');

  fs.writeFileSync('scripts/current_botanaroots_pdp_sample.html', html.slice(0, 50000));
}

inspectCurrentPDP();
