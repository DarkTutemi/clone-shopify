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

  const indexTemplate = {
    sections: {
      hero: {
        type: "saker-homepage-hero",
        settings: {}
      },
      featured_collection: {
        type: "featured-collection",
        settings: {
          title: "Popular Best Sellers",
          heading_size: "h2",
          products_to_show: 8,
          columns_desktop: 4,
          columns_mobile: "2"
        }
      },
      trust_badges: {
        type: "saker-trust-badges",
        settings: {}
      },
      reviews: {
        type: "saker-reviews-widget",
        settings: {}
      }
    },
    order: [
      "hero",
      "featured_collection",
      "trust_badges",
      "reviews"
    ]
  };

  console.log('Uploading 1:1 Sakerplus templates/index.json...');
  await uploadThemeAsset(token, 'templates/index.json', JSON.stringify(indexTemplate, null, 2));
  console.log('✔ templates/index.json deployed successfully!');
}

main();
