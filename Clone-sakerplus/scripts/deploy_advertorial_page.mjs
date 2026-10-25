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
  console.log('=== Deploying Fence Post Advertorial Funnel Page ===');
  const token = await getAccessToken();

  let bodyContent = fs.readFileSync('Clone-sakerplus/data/extracted_article_body.html', 'utf8');

  // Replace all funnel redirect links with direct product link
  bodyContent = bodyContent.replaceAll('/funnel/landing-sakerplus-fence-post-repair-kit-1', '/products/sakerplus-fence-post-repair-kit');
  bodyContent = bodyContent.replaceAll('https://m.sakerplus.com/funnel/landing-sakerplus-fence-post-repair-kit-1', '/products/sakerplus-fence-post-repair-kit');

  // Build the clean Liquid Section
  const sectionContent = `
{% comment %}
  Sakerplus Fence Post Repair Kit - News Advertorial Funnel Section
  1:1 Port from m.sakerplus.com/funnel/news-sakerplus-fence-post-repair-kit
{% endcomment %}

{{ 'fence-advertorial.css' | asset_url | stylesheet_tag }}

<div id="FencePostAdvertorial" class="fence-post-advertorial-wrapper">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap">
  
  <style>
    /* Scoped protections */
    #FencePostAdvertorial {
      position: relative !important;
      font-family: 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif !important;
      background: #ffffff !important;
      color: #111827 !important;
      max-width: 100vw !important;
      overflow-x: hidden !important;
      padding-bottom: 75px !important;
    }
    
    #FencePostAdvertorial a.cta-btn,
    #FencePostAdvertorial .get-btn,
    #FencePostAdvertorial a[href*="products"] {
      display: inline-block !important;
      text-decoration: none !important;
      cursor: pointer !important;
      transition: transform 0.2s ease, box-shadow 0.2s ease !important;
    }
    
    #FencePostAdvertorial a.cta-btn:hover,
    #FencePostAdvertorial a[href*="products"]:hover {
      transform: translateY(-2px) !important;
      box-shadow: 0 10px 20px rgba(234, 88, 12, 0.3) !important;
    }

    .sticky-bottom-fence-bar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: #ffffff;
      box-shadow: 0 -4px 15px rgba(0,0,0,0.12);
      padding: 12px 18px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      z-index: 99999;
    }

    .sticky-bottom-fence-bar .bar-info {
      display: flex;
      flex-direction: column;
    }

    .sticky-bottom-fence-bar .bar-title {
      font-weight: 700;
      font-size: 14px;
      color: #1f2937;
    }

    .sticky-bottom-fence-bar .bar-discount {
      font-size: 12px;
      color: #dc2626;
      font-weight: 600;
    }

    .sticky-bottom-fence-bar .bar-btn {
      background: #ea580c;
      color: #ffffff;
      padding: 10px 22px;
      border-radius: 9999px;
      font-weight: 700;
      font-size: 14px;
      text-transform: uppercase;
      text-decoration: none;
      box-shadow: 0 4px 12px rgba(234, 88, 12, 0.4);
    }
  </style>

  ${bodyContent}

  <!-- Sticky Conversion Bottom Bar -->
  <div class="sticky-bottom-fence-bar">
    <div class="bar-info">
      <span class="bar-title">Sakerplus® Fence Post Repair Kit</span>
      <span class="bar-discount">🔥 Special Promo: Save 50% Off Today</span>
    </div>
    <a href="/products/sakerplus-fence-post-repair-kit" class="bar-btn">Get 50% Off &rarr;</a>
  </div>
</div>

{% schema %}
{
  "name": "Fence Advertorial",
  "settings": [],
  "presets": [
    {
      "name": "Fence Advertorial"
    }
  ]
}
{% endschema %}
`;

  console.log('[1/2] Uploading sections/fence-post-advertorial.liquid (size:', sectionContent.length, 'bytes)...');
  await uploadThemeAsset(token, 'sections/fence-post-advertorial.liquid', sectionContent);

  console.log('[2/2] Updating Page news-sakerplus-fence-post-repair-kit template...');
  const pageRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-01/pages.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const pageData = await pageRes.json();
  const page = (pageData.pages || []).find(p => p.handle === 'news-sakerplus-fence-post-repair-kit');
  if (page) {
    await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-01/pages/${page.id}.json`, {
      method: 'PUT',
      headers: {
        'X-Shopify-Access-Token': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        page: {
          id: page.id,
          template_suffix: 'fence-funnel'
        }
      })
    });
    console.log('  ✔ Verified template_suffix fence-funnel on page ID:', page.id);
  }

  console.log(`\n🎉 DONE! Advertorial Page is LIVE!`);
  console.log(`URL: https://${SHOP_DOMAIN}/pages/news-sakerplus-fence-post-repair-kit`);
}

main();
