import fs from 'fs';

const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const THEME_ID = '186607567033';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || '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';

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
    console.log(`  ✔ Uploaded: ${key}`);
    return true;
  } else {
    const err = await res.text();
    console.error(`  ✗ Failed ${key}:`, err.slice(0, 200));
    return false;
  }
}

async function main() {
  const token = await getAccessToken();
  console.log('Got access token. Deploying Willa Farms UX/UI storefront to Zavelyn...');

  // 1. Upload CSS
  console.log('\n[1/6] Uploading assets/willafarm-theme.css...');
  const css = fs.readFileSync('Clone-willafarm/theme/assets/willafarm-theme.css', 'utf-8');
  await uploadThemeAsset(token, 'assets/willafarm-theme.css', css);

  // 2. Upload Sections
  console.log('\n[2/6] Uploading Willa Sections...');
  const sectionsToUpload = [
    'willa-header.liquid',
    'willa-hero.liquid',
    'willa-facts.liquid',
    'willa-featured-product.liquid',
    'willa-collections-grid.liquid',
    'willa-featured-collection.liquid',
    'willa-steps.liquid',
    'willa-comparison.liquid',
    'willa-reviews.liquid',
    'willa-faq.liquid',
    'willa-footer.liquid',
    'willa-cart-drawer.liquid',
    'willa-main-collection.liquid',
    'willa-main-product.liquid'
  ];

  for (const s of sectionsToUpload) {
    const content = fs.readFileSync(`Clone-willafarm/theme/sections/${s}`, 'utf-8');
    await uploadThemeAsset(token, `sections/${s}`, content);
  }

  // 3. Header & Footer groups
  console.log('\n[3/6] Uploading header-group.json and footer-group.json...');
  const headerGroup = JSON.stringify({
    name: "Header group",
    type: "header",
    sections: {
      "willa-header": {
        "type": "willa-header",
        "settings": {}
      }
    },
    "order": ["willa-header"]
  }, null, 2);
  await uploadThemeAsset(token, 'sections/header-group.json', headerGroup);

  const footerGroup = JSON.stringify({
    name: "Footer group",
    type: "footer",
    sections: {
      "willa-footer": {
        "type": "willa-footer",
        "settings": {}
      }
    },
    "order": ["willa-footer"]
  }, null, 2);
  await uploadThemeAsset(token, 'sections/footer-group.json', footerGroup);

  // 4. Templates
  console.log('\n[4/6] Uploading index.json & collection/product templates...');
  const indexJson = JSON.stringify({
    sections: {
      "hero": { "type": "willa-hero", "settings": {} },
      "facts": { "type": "willa-facts", "settings": {} },
      "featured_offer": { "type": "willa-featured-product", "settings": {} },
      "categories": { "type": "willa-collections-grid", "settings": {} },
      "best_sellers": { "type": "willa-featured-collection", "settings": {} },
      "steps": { "type": "willa-steps", "settings": {} },
      "comparison": { "type": "willa-comparison", "settings": {} },
      "reviews": { "type": "willa-reviews", "settings": {} },
      "faq": { "type": "willa-faq", "settings": {} }
    },
    order: [
      "hero",
      "facts",
      "featured_offer",
      "categories",
      "best_sellers",
      "steps",
      "comparison",
      "reviews",
      "faq"
    ]
  }, null, 2);
  await uploadThemeAsset(token, 'templates/index.json', indexJson);

  // Collection template
  const collectionLiquid = `{% layout 'theme' %}\n{% section 'willa-main-collection' %}\n`;
  await uploadThemeAsset(token, 'templates/collection.liquid', collectionLiquid);

  // Product template
  const productLiquid = `{% layout 'theme' %}\n{% section 'willa-main-product' %}\n`;
  await uploadThemeAsset(token, 'templates/product.willa.liquid', productLiquid);
  await uploadThemeAsset(token, 'templates/product.liquid', productLiquid);

  // 5. Update layout/theme.liquid
  console.log('\n[5/6] Updating layout/theme.liquid with Willa styling & cart drawer...');
  let themeLiquid = fs.readFileSync('Clone-willafarm/backup/layout_theme.liquid', 'utf-8');

  // Add willafarm-theme.css before </head>
  if (!themeLiquid.includes('willafarm-theme.css')) {
    themeLiquid = themeLiquid.replace('</head>', `  {{ 'willafarm-theme.css' | asset_url | stylesheet_tag }}\n</head>`);
  }

  // Ensure body has class willa-body
  if (!themeLiquid.includes('willa-body')) {
    themeLiquid = themeLiquid.replace('<body class="', '<body class="willa-body ');
  }

  // Add willa-cart-drawer before </body>
  if (!themeLiquid.includes("willa-cart-drawer")) {
    themeLiquid = themeLiquid.replace('</body>', `  {% section 'willa-cart-drawer' %}\n</body>`);
  }

  await uploadThemeAsset(token, 'layout/theme.liquid', themeLiquid);

  console.log('\n🚀 [6/6] DEPLOYMENT COMPLETE! All Willa Farms UX/UI elements are live on Zavelyn!');
  console.log('Homepage: https://tryzavelyn.com/');
  console.log('Best Sellers: https://tryzavelyn.com/collections/best-sellers');
  console.log('Sample PDP: https://tryzavelyn.com/products/sakerplus-livestock-heating-lamp');
}

main().catch(console.error);
