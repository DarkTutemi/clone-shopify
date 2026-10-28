import fs from 'fs';
import { getAccessToken, SHOP } from './batch1_config.mjs';

async function main() {
  const token = await getAccessToken();
  const prodRes = await fetch(`https://${SHOP}/admin/api/2024-01/products.json?handle=zavelyn-vfit-red-light-intimate-wellness-device`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const prodData = await prodRes.json();
  const product = prodData.products[0];
  fs.writeFileSync('draft_working/vfit_live_product_full.json', JSON.stringify(product, null, 2), 'utf8');
  fs.writeFileSync('draft_working/vfit_live_body_html.html', product.body_html, 'utf8');
  console.log('Saved vFit body_html (length:', product.body_html.length, ')');

  const revIdx = product.body_html.indexOf('Real Reviews from Over 100,000+ Women');
  console.log('Review index:', revIdx);
  console.log('Ending slice of body_html:');
  console.log(product.body_html.substring(revIdx - 50));
}

main().catch(console.error);
