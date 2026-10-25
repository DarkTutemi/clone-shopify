import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "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";
const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const THEME_ID = '186607567033';

async function getAccessToken() {
  const tokenRes = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials'
    })
  });
  const data = await tokenRes.json();
  return data.access_token;
}

async function run() {
  const token = await getAccessToken();
  console.log('Got token:', token ? 'YES' : 'NO');

  // Check themes
  const themesRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-01/themes.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const themesData = await themesRes.json();
  console.log('Themes on store:', themesData.themes ? themesData.themes.map(t => ({ id: t.id, name: t.name, role: t.role })) : themesData);

  // Upload sections/earthly-pdp-reviews-slider.liquid
  const sliderPath = 'h:/Shopify-Clone/Clone-earthlyderm/sections/earthly-pdp-reviews-slider.liquid';
  if (fs.existsSync(sliderPath)) {
    const content = fs.readFileSync(sliderPath, 'utf8');
    const uploadRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-01/themes/${THEME_ID}/assets.json`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token
      },
      body: JSON.stringify({
        asset: {
          key: 'sections/earthly-pdp-reviews-slider.liquid',
          value: content
        }
      })
    });
    const uploadData = await uploadRes.json();
    console.log('Upload earthly-pdp-reviews-slider.liquid:', uploadData.asset ? 'SUCCESS' : uploadData);
  }

  // Also upload sections/earthly-pdp-main.liquid to ensure SEE IT IN ACTION has perfect styles and scripts
  const mainPath = 'h:/Shopify-Clone/Clone-earthlyderm/sections/earthly-pdp-main.liquid';
  if (fs.existsSync(mainPath)) {
    const content = fs.readFileSync(mainPath, 'utf8');
    const uploadRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-01/themes/${THEME_ID}/assets.json`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token
      },
      body: JSON.stringify({
        asset: {
          key: 'sections/earthly-pdp-main.liquid',
          value: content
        }
      })
    });
    const uploadData = await uploadRes.json();
    console.log('Upload earthly-pdp-main.liquid:', uploadData.asset ? 'SUCCESS' : uploadData);
  }

  // Also upload templates/product.json
  const prodPath = 'h:/Shopify-Clone/Clone-earthlyderm/templates/product.json';
  if (fs.existsSync(prodPath)) {
    const content = fs.readFileSync(prodPath, 'utf8');
    const uploadRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-01/themes/${THEME_ID}/assets.json`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token
      },
      body: JSON.stringify({
        asset: {
          key: 'templates/product.json',
          value: content
        }
      })
    });
    const uploadData = await uploadRes.json();
    console.log('Upload templates/product.json:', uploadData.asset ? 'SUCCESS' : uploadData);
  }
}

run();
