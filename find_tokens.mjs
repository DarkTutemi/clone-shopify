import fs from 'fs';

async function findTokens() {
  const url = 'https://trybronoir.com/products/bronoir%E2%84%A2-limited-barefoot-shoes';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  const text = await res.text();

  // Search for anything matching token in script tags or inline js
  const matches = text.match(/api_token|public_token|shop_token|apiToken|publicToken/gi) || [];
  console.log('Matches:', matches);

  // Search for judge.me script tag src
  const scriptTags = text.match(/<script[^>]*src=["'][^"']*judge\.me[^"']*["'][^>]*>/gi) || [];
  console.log('Judge.me script tags:', scriptTags);

  // Search for any shopify app block or asset related to judgeme
  const jdgmAssets = text.match(/[^"'\s]*jdgm[^"'\s]*/gi) || [];
  console.log('Unique jdgm strings (sample):', [...new Set(jdgmAssets)].slice(0, 30));
}

findTokens();
