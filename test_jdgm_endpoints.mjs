import fs from 'fs';

async function testJdgmApi() {
  const shopDomain = '2e83893828402.myshopify.com';
  // Let's test Judge.me endpoints
  const endpoints = [
    `https://judge.me/api/v1/reviews?shop_domain=${shopDomain}&page=1&per_page=10`,
    `https://api.judge.me/reviews/reviews_for_widget?shop_domain=${shopDomain}&product_id=8244526252132&page=1`,
    `https://judge.me/reviews/reviews_for_widget?shop_domain=${shopDomain}&product_id=8244526252132&page=1`,
    `https://api.judge.me/api/v1/widgets/product_review?shop_domain=${shopDomain}&product_id=8244526252132`,
    `https://judge.me/api/v1/widgets/product_review?shop_domain=${shopDomain}&product_id=8244526252132`
  ];

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json, text/javascript, */*; q=0.01'
        }
      });
      console.log(`URL: ${url}`);
      console.log(`Status: ${res.status}`);
      const text = await res.text();
      console.log(`Response length: ${text.length}`);
      console.log(`Preview:`, text.slice(0, 300));
      console.log('-------------------------------------------');
    } catch (e) {
      console.error(`Error for ${url}:`, e.message);
    }
  }
}

testJdgmApi();
