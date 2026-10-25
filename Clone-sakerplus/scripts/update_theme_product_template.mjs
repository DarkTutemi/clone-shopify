import fs from 'fs';

const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const THEME_ID = '186607567033';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "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";

async function getAccessToken() {
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials'
    })
  });
  const data = await res.json();
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
    body: JSON.stringify({
      asset: { key, value }
    })
  });
  if (res.ok) {
    console.log(`  ✔ Uploaded theme asset: ${key}`);
    return true;
  } else {
    const err = await res.text();
    console.error(`  ✗ Failed to upload ${key}:`, err.slice(0, 200));
    return false;
  }
}

async function main() {
  const token = await getAccessToken();

  const productTemplate = {
    sections: {
      main: {
        type: "main-product",
        settings: {
          show_vendor: true,
          show_sku: false,
          show_tax_note: false
        }
      },
      reviews: {
        type: "saker-reviews-widget",
        settings: {}
      },
      related: {
        type: "related-products",
        settings: {}
      }
    },
    order: [
      "main",
      "reviews",
      "related"
    ]
  };

  console.log('Uploading dynamic Shopify 2.0 templates/product.json...');
  await uploadThemeAsset(token, 'templates/product.json', JSON.stringify(productTemplate, null, 2));
}

main();
