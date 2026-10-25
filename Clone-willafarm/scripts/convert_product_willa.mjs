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

  // 1. Delete legacy templates/product.willa.liquid
  await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/themes/${THEME_ID}/assets.json?asset[key]=templates/product.willa.liquid`, {
    method: 'DELETE',
    headers: { 'X-Shopify-Access-Token': token }
  });

  // 2. Upload modern templates/product.willa.json
  const productJson = {
    sections: {
      "main": {
        type: "willa-main-product",
        blocks: {
          "acc_desc": { type: "accordion_item", settings: { title: "Product Description", use_product_description: true, open_default: true } },
          "acc_shipping": { type: "accordion_item", settings: { title: "Shipping & Delivery Information", content: "Orders are dispatched within 24 hours from our US warehouses. Free standard shipping is automatically applied to orders over $49. Delivery takes 3–5 business days with live tracking.", use_product_description: false, open_default: false } },
          "acc_warranty": { type: "accordion_item", settings: { title: "Warranty & Returns", content: "We offer an unconditional 90-day money-back guarantee. If you are not completely satisfied, email support@tryzavelyn.com for an immediate exchange or refund.", use_product_description: false, open_default: false } }
        },
        block_order: ["acc_desc", "acc_shipping", "acc_warranty"],
        settings: {
          show_breadcrumbs: true,
          enable_sticky_atc: true,
          badge_text: "SPECIAL OFFER"
        }
      }
    },
    order: ["main"]
  };

  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/themes/${THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ asset: { key: 'templates/product.willa.json', value: JSON.stringify(productJson, null, 2) } })
  });
  console.log('product.willa.json upload result:', res.status);
}

main().catch(console.error);
