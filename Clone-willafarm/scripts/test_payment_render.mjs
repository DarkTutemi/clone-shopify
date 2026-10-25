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

  // Let's check sections/heating-lamp-funnel.liquid
  const aRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/themes/${THEME_ID}/assets.json?asset[key]=sections/heating-lamp-funnel.liquid`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const aData = await aRes.json();
  const content = aData.asset?.value;

  // Test replacing wf-payment-icons with payment_type_svg_tag
  const oldSnippet = `<div class="wf-payment-icons">
            <img src="https://cdn.myshopage.com/32c690d7-b984-40d7-d6a0-62fe13714000.png" alt="Guaranteed Safe Checkout" referrerpolicy="no-referrer">
          </div>`;

  const newSnippet = `<div class="wf-payment-icons">
            <span class="wf-payment-secure-text">🔒 Guaranteed Safe &amp; Secure Checkout</span>
            <ul class="wf-payment-list" role="list">
              {% assign payment_types = shop.enabled_payment_types %}
              {% if payment_types == empty or payment_types.size == 0 %}
                {% assign payment_types = 'visa,master,american_express,discover,paypal,apple_pay,google_pay,shopify_pay' | split: ',' %}
              {% endif %}
              {% for type in payment_types %}
                <li class="wf-payment-item">
                  {{ type | payment_type_svg_tag: class: 'wf-payment-svg' }}
                </li>
              {% endfor %}
            </ul>
          </div>`;

  if (!content.includes('wf-payment-icons')) {
    console.log('wf-payment-icons not found in section!');
    return;
  }

  const updated = content.replace(oldSnippet, newSnippet);
  
  const upRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/themes/${THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ asset: { key: 'sections/heating-lamp-funnel.liquid', value: updated } })
  });
  console.log('Update section status:', upRes.status);

  // Now fetch live page to see the rendered HTML
  await new Promise(r => setTimeout(r, 1500));
  const pageRes = await fetch(`https://${SHOP_DOMAIN}/products/livestock-heating-lamp`);
  const pageHtml = await pageRes.text();
  const match = pageHtml.match(/<div class="wf-payment-icons">[\s\S]*?<\/div>/);
  console.log('\nRendered HTML in browser:');
  console.log(match ? match[0] : 'Not found');
}

main().catch(console.error);
