import fs from 'fs';

const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const THEME_ID = '186607567033';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || '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';

async function getAccessToken() {
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`OAuth error: ${JSON.stringify(data)}`);
  return data.access_token;
}

async function uploadThemeAsset(token, key, value) {
  const url = `https://${SHOP_DOMAIN}/admin/api/2024-10/themes/${THEME_ID}/assets.json`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({ asset: { key, value } })
  });
  const data = await res.json();
  if (res.ok) {
    console.log(`  ✔ Uploaded: ${key}`);
    return true;
  } else {
    console.error(`  ✗ Failed ${key}:`, JSON.stringify(data.errors || data));
    return false;
  }
}

async function main() {
  console.log('--- Updating Payment Icons to Official Shopify Payment SVG Icons ---');
  const token = await getAccessToken();

  let liquidContent = fs.readFileSync('Clone-willafarm/theme/sections/heating-lamp-funnel.liquid', 'utf8');

  // Replace HTML block
  const oldHtmlPattern = /<div class="wf-payment-icons">[\s\S]*?<\/div>/;
  const newHtml = `<div class="wf-payment-icons">
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

  liquidContent = liquidContent.replace(oldHtmlPattern, newHtml);

  // Replace CSS block
  const oldCssPattern = /\.wf-payment-icons\s*\{[\s\S]*?\.wf-payment-icons img\s*\{[\s\S]*?\}/;
  const newCss = `.wf-payment-icons {
    text-align: center;
    margin-top: 18px;
    padding-top: 14px;
    border-top: 1px dashed var(--wf-border);
  }
  .wf-payment-secure-text {
    display: block;
    font-size: 11px;
    font-weight: 700;
    color: var(--wf-muted);
    letter-spacing: 0.5px;
    text-transform: uppercase;
    margin-bottom: 10px;
  }
  .wf-payment-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 8px;
    list-style: none;
    padding: 0;
    margin: 0 auto;
  }
  .wf-payment-item {
    display: inline-flex;
    align-items: center;
    line-height: 0;
  }
  .wf-payment-svg {
    width: 38px;
    height: 24px;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    transition: transform 0.15s ease;
  }
  .wf-payment-svg:hover {
    transform: scale(1.08);
  }`;

  liquidContent = liquidContent.replace(oldCssPattern, newCss);

  fs.writeFileSync('Clone-willafarm/theme/sections/heating-lamp-funnel.liquid', liquidContent);
  console.log('Saved local Clone-willafarm/theme/sections/heating-lamp-funnel.liquid');

  const ok = await uploadThemeAsset(token, 'sections/heating-lamp-funnel.liquid', liquidContent);
  if (!ok) throw new Error('Upload failed');
  console.log('✔ Successfully deployed updated heating-lamp-funnel.liquid to Shopify Theme 186607567033!');
}

main().catch(console.error);
