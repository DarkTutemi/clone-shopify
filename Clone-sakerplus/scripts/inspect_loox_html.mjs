import fs from 'fs';

async function inspectLooxHtml() {
  const r = await fetch('https://loox.io/widget/7GiGt8f0rB/reviews?limit=50', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const html = await r.text();
  console.log('Loox reviews HTML length:', html.length);
  
  // Search for review items
  const reviewBlocks = [...html.matchAll(/class=["'][^"']*review-item[^"']*["'][\s\S]*?<\/div>/gi)];
  console.log('review items match count:', reviewBlocks.length);

  // Check data-review or json inside
  const jsonMatches = [...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)];
  for (const m of jsonMatches) {
    if (m[1].includes('reviews') || m[1].includes('rating')) {
      console.log('Script tag in Loox page:\n', m[1].slice(0, 300));
    }
  }

  // Save sample to file
  fs.writeFileSync('Clone-sakerplus/data/loox_sample.html', html);
  console.log('Saved to Clone-sakerplus/data/loox_sample.html');
}

inspectLooxHtml();
