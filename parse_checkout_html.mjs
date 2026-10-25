import fs from 'fs';

function parseCheckoutHtml() {
  const html = fs.readFileSync('cheese_grater_checkout.html', 'utf8');
  console.log('HTML size:', html.length);

  // Search for options
  const re = /(White|Green)[^"']*(1\s*pc|2\s*pcs)/gi;
  const matches = [...html.matchAll(re)].map(m => m[0]);
  console.log('Option matches:', matches);

  // Search for prices
  const priceMatches = [...html.matchAll(/(\d+\.\d{2})/g)].map(m => m[0]);
  const uniquePrices = [...new Set(priceMatches)].filter(p => Number(p) > 20 && Number(p) < 300);
  console.log('Unique prices:', uniquePrices);

  // Extract all image URLs from myshopage
  const imgMatches = [...html.matchAll(/https:\/\/cdn\.myshopage\.com\/[a-f0-9-]+\.(jpg|png|webp|gif)/gi)].map(m => m[0]);
  console.log('Unique image URLs:', [...new Set(imgMatches)]);
}

parseCheckoutHtml();
