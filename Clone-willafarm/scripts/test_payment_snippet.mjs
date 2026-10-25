const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const THEME_ID = '186607567033';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || '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';

async function main() {
  const tRes = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const tData = await tRes.json();
  const token = tData.access_token;

  // Let's create a temporary test snippet to test payment_type_svg_tag
  const testLiquid = `<!-- TEST PAYMENT ICONS -->
<div id="test-payment-container">
  {% assign default_types = 'visa,master,american_express,discover,paypal,apple_pay,google_pay,shopify_pay' | split: ',' %}
  {% for type in default_types %}
    <span class="test-icon-{{ type }}">{{ type | payment_type_svg_tag }}</span>
  {% endfor %}
</div>`;

  const upRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/themes/${THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ asset: { key: 'snippets/test-payment-icons.liquid', value: testLiquid } })
  });
  console.log('Upload test snippet:', upRes.status);
}
main();
