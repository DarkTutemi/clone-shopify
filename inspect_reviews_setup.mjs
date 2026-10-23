import fs from 'fs';

async function test() {
  const url = 'https://trybronoir.com/products/bronoir%E2%84%A2-limited-barefoot-shoes';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  const text = await res.text();
  console.log('Status:', res.status, 'Length:', text.length);
  
  const jdgmWidget = text.match(/<div id=['"]judgeme_product_reviews['"][^>]*>/);
  console.log('JDGM Widget:', jdgmWidget ? jdgmWidget[0] : 'None');

  const jdgmMatches = text.match(/https:\/\/[^"'\s]*judge\.me[^"'\s]*/g) || [];
  console.log('Judge.me URLs:', [...new Set(jdgmMatches)]);

  // Check if there are reviews in the initial HTML or if they load via API
  const reviewMatch = text.match(/class=['"]jdgm-rev /g);
  console.log('Initial jdgm-rev count in HTML:', reviewMatch ? reviewMatch.length : 0);

  // Check shop ID or public token
  const tokenMatch = text.match(/jdgm_shop_token|jdgm_public_token|shop_domain|shop_id/gi);
  console.log('Tokens found:', tokenMatch);

  // Search for Judge.me API endpoint calls or shop token
  const apiMatch = text.match(/api\/v1\/reviews[^\s"']+/g);
  console.log('API matches:', apiMatch);
}

test();
