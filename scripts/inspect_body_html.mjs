import fs from 'fs';
import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const PRODUCT_ID = '15461545935033';

async function main() {
  const token = await getAccessToken();
  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/products/${PRODUCT_ID}.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  const bodyHtml = data.product.body_html;
  fs.writeFileSync('draft_working/botanaroots_body_html.html', bodyHtml);
  console.log('Saved botanaroots_body_html.html, length:', bodyHtml.length);

  // Search for FAQ markers or headers
  console.log('Includes <!-- FAQ Section -->:', bodyHtml.includes('<!-- FAQ Section -->'));
  console.log('Includes Frequently Asked Questions:', bodyHtml.includes('Frequently Asked Questions'));
  console.log('Includes <!-- Verified Customer Reviews Section -->:', bodyHtml.includes('<!-- Verified Customer Reviews Section -->'));
}

main().catch(console.error);
