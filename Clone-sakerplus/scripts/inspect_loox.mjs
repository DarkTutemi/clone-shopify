import fs from 'fs';

async function inspectLoox() {
  const pageRes = await fetch('https://www.sakerplus.com/products/sakerplus%C2%AE-tpu-sensory-textured-floor-mats', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const html = await pageRes.text();
  
  // Find loox script or config
  const scriptMatches = [...html.matchAll(/<script[\s\S]*?<\/script>/gi)];
  for (const m of scriptMatches) {
    if (m[0].includes('loox') && m[0].includes('data') || m[0].includes('Loox')) {
      if (m[0].length < 2000) {
        console.log('Loox script block:\n', m[0]);
      }
    }
  }

  // Check if loox reviews HTML is in the page
  const looxReviewsBlock = html.match(/id=["']looxReviews["'][\s\S]*?<\/div>/i);
  if (looxReviewsBlock) {
    console.log('looxReviews element:', looxReviewsBlock[0].slice(0, 500));
  }
}

inspectLoox();
