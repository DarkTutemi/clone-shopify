import { getAccessToken, SHOP } from './batch1_config.mjs';
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

const DRAFT_THEME_ID = 187720335545;

async function main() {
  const token = await getAccessToken();

  // Upload a temporary snippet to test payment_type_svg_tag
  const snippetContent = `
    {% assign types = 'visa,master,american_express,apple_pay,google_pay,shopify_pay,discover' | split: ',' %}
    {% for t in types %}
      <span class="test-icon-{{ t }}">
        {{ t | payment_type_svg_tag: class: 'zv-pay-svg' }}
      </span>
    {% endfor %}
  `;

  const putRes = await fetch(`https://${SHOP}/admin/api/2024-01/themes/${DRAFT_THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ asset: { key: 'snippets/test-payment-icons.liquid', value: snippetContent } })
  });
  console.log('Uploaded test snippet:', putRes.status);
}

main().catch(console.error);
