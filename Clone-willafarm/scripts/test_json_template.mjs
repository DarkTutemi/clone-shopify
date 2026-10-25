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

  // Check heating-lamp-funnel.liquid schema on Shopify
  const sRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/themes/${THEME_ID}/assets.json?asset[key]=sections/heating-lamp-funnel.liquid`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const sData = await sRes.json();
  const content = sData.asset?.value || '';
  console.log('heating-lamp-funnel schema slice:');
  const schemaIndex = content.lastIndexOf('{% schema %}');
  console.log(content.slice(schemaIndex, schemaIndex + 500));

  // Now try uploading templates/product.sakerplus-livestock-heating-lamp.json
  const productJson = {
    sections: {
      "main": {
        type: "heating-lamp-funnel",
        blocks: {
          "bundle_2": {
            type: "bundle_package",
            settings: {
              badge: "BEST SELLER • 50% OFF • FREE SHIPPING",
              is_best_seller: true,
              title: "2 Pack (Light + US Switch Cord)",
              description: "<span>✔ 2x Zavelyn® Intelligent Heating Lamps</span><br><span>✔ 2x US-Standard Heavy-Duty Switch Cords</span><br><span>✔ Only $44.99/set • Free Express Shipping</span>",
              variant_id: "67930179436729",
              price: "89.99",
              old_price: "179.99",
              image_url: "https://cdn.myshopage.com/4574c936-7435-4b05-2934-ed1e12887e00.png"
            }
          }
        },
        block_order: ["bundle_2"],
        settings: {}
      }
    },
    order: ["main"]
  };

  const uRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/themes/${THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ asset: { key: 'templates/product.sakerplus-livestock-heating-lamp.json', value: JSON.stringify(productJson, null, 2) } })
  });
  const uData = await uRes.json();
  console.log('Upload result:', JSON.stringify(uData));
}

main().catch(console.error);
