import fs from 'fs';

async function inspectProductReviewHtml(url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const html = await res.text();
  
  const jdgmIdx = html.indexOf('id=\'judgeme_product_reviews\'') !== -1 ? html.indexOf('id=\'judgeme_product_reviews\'') : html.indexOf('id="judgeme_product_reviews"');
  console.log(`URL: ${url}`);
  console.log(`jdgmIdx: ${jdgmIdx}`);
  if (jdgmIdx !== -1) {
    const chunk = html.slice(jdgmIdx, jdgmIdx + 4000);
    console.log('Chunk:');
    console.log(chunk);
  }
}

async function run() {
  await inspectProductReviewHtml('https://trybronoir.com/products/bronoir%E2%84%A2-vista-barefoot-shoes');
  console.log('========================================================================');
  await inspectProductReviewHtml('https://trybronoir.com/products/bronoir%E2%84%A2-lift-elegant-supportive-ballerinas-for-daily-comfort');
}

run();
