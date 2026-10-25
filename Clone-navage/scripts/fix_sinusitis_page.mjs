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
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      asset: { key, value }
    })
  });
  const data = await res.json();
  if (data.errors) {
    throw new Error(`Upload ${key} failed: ${JSON.stringify(data.errors)}`);
  }
  console.log(`✔ Uploaded ${key} (${value.length} bytes)`);
  return data.asset;
}

async function main() {
  const token = await getAccessToken();
  console.log('Got access token.');

  // 1. Build Perfect Combined CSS
  const headStyle = fs.readFileSync('Clone-navage/data/head_style_1.css', 'utf8');
  const themeCss = fs.readFileSync('Clone-navage/data/navage-theme.css', 'utf8');

  const bannerCss = `
  /* Top Banner Styles */
  .ng-banner-anc {
    background: #0d1b2e !important;
    width: 100% !important;
    padding: 16px 24px !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    position: relative !important;
    box-sizing: border-box !important;
    z-index: 1001 !important;
  }
  .ng-banner-anc__inner {
    display: flex !important;
    align-items: center !important;
    gap: 12px !important;
    flex-wrap: wrap !important;
    justify-content: center !important;
    max-width: 100% !important;
  }
  .ng-banner-anc__tag {
    background: #f5df4d !important;
    color: #0d1b2e !important;
    font-size: 11px !important;
    font-weight: 800 !important;
    text-transform: uppercase !important;
    letter-spacing: 0.06em !important;
    padding: 3px 8px !important;
    border-radius: 3px !important;
    white-space: nowrap !important;
    line-height: 1.4 !important;
    flex-shrink: 0 !important;
  }
  .ng-banner-anc__text {
    font-size: 16px !important;
    font-weight: 400 !important;
    color: rgba(255,255,255,0.88) !important;
    margin: 0 !important;
    line-height: 1.4 !important;
  }
  .ng-banner-anc__text strong {
    color: #ffffff !important;
    font-weight: 700 !important;
  }
  .ng-banner-anc__divider {
    width: 2px !important;
    height: 16px !important;
    background: rgba(255,255,255,0.2) !important;
    flex-shrink: 0 !important;
  }
  .ng-banner-anc__link {
    font-size: 16px !important;
    font-weight: 700 !important;
    color: #4fd7d8 !important;
    text-decoration: underline !important;
    text-underline-offset: 3px !important;
    white-space: nowrap !important;
    line-height: 1.4 !important;
  }
  .ng-banner-anc__link:hover {
    color: #ffffff !important;
  }
  .ng-banner-anc__dismiss {
    position: absolute !important;
    top: 50% !important;
    right: 20px !important;
    transform: translateY(-50%) !important;
    background: transparent !important;
    border: none !important;
    color: rgba(255,255,255,0.6) !important;
    font-size: 22px !important;
    line-height: 1 !important;
    cursor: pointer !important;
    padding: 4px 8px !important;
  }
  .ng-banner-anc__dismiss:hover {
    color: #ffffff !important;
  }
  @media (max-width: 768px) {
    .ng-banner-anc {
      padding: 10px 14px !important;
    }
    .ng-banner-anc__inner {
      font-size: 13px !important;
      gap: 6px !important;
    }
    .ng-banner-anc__text, .ng-banner-anc__link {
      font-size: 13px !important;
    }
  }

  /* Editorial Story Layout Fixes */
  body.template-page--sinusitis-sufferer {
    background-color: #f5f5f7 !important;
    color: #333333 !important;
    font-family: 'Roboto', -apple-system, sans-serif !important;
    line-height: 1.65 !important;
  }
  .section__color-wrapper {
    background-color: transparent !important;
    padding: 32px 0 !important;
  }
  .content-box--large {
    max-width: 840px !important;
    margin: 0 auto !important;
    padding: 0 20px !important;
    box-sizing: border-box !important;
  }
  .content-box--text-center {
    text-align: center !important;
  }
  .content-box--text-left {
    text-align: left !important;
  }
  .heading.h2 {
    font-family: 'Roboto Condensed', sans-serif !important;
    font-size: 36px !important;
    font-weight: 700 !important;
    line-height: 1.25 !important;
    color: #074174 !important;
    margin: 24px 0 16px 0 !important;
    letter-spacing: -0.5px !important;
  }
  @media (max-width: 768px) {
    .heading.h2 {
      font-size: 26px !important;
    }
  }
  .text-container p {
    font-size: 17px !important;
    line-height: 1.7 !important;
    color: #2c3e50 !important;
    margin-bottom: 18px !important;
  }
  .text-container p em {
    color: #074174 !important;
    font-size: 19px !important;
    display: block !important;
    margin-top: 6px !important;
    font-style: italic !important;
  }
  .text-container ul {
    margin: 16px 0 24px 24px !important;
    padding: 0 !important;
  }
  .text-container ul li {
    font-size: 16px !important;
    line-height: 1.65 !important;
    color: #2c3e50 !important;
    margin-bottom: 10px !important;
  }

  /* Full-width and Story Images */
  .DP__image-with-text-simple, .DP__banner-image-simple {
    max-width: 1100px !important;
    margin: 30px auto !important;
    padding: 0 16px !important;
    box-sizing: border-box !important;
  }
  .dsgn-pck__image-container img, .dsgn-pck__background img {
    max-width: 100% !important;
    height: auto !important;
    display: block !important;
    border-radius: 8px !important;
    margin: 0 auto !important;
  }

  /* Offer Section & Product Grid */
  .ai-text-module-aofe4yxfrm2xou2jmmaigenblocke9c14c7aetykr {
    background-color: #ffffff !important;
    padding: 36px 20px !important;
    border-radius: 12px !important;
    max-width: 960px !important;
    margin: 40px auto 20px !important;
    box-shadow: 0 4px 20px rgba(0,0,0,0.06) !important;
  }
  .ai-text-module__headline-aofe4yxfrm2xou2jmmaigenblocke9c14c7aetykr {
    font-size: 32px !important;
    color: #074174 !important;
    font-weight: 700 !important;
    margin-bottom: 12px !important;
  }
  .ai-text-module__subheadline-aofe4yxfrm2xou2jmmaigenblocke9c14c7aetykr {
    font-size: 18px !important;
    color: #218dc8 !important;
    margin-bottom: 16px !important;
  }
  .ai-featured-products-av3zuskjnwwhic3bttaigenblock445d9f7jpdp3w {
    max-width: 960px !important;
    margin: 0 auto 50px !important;
    padding: 0 16px !important;
  }
  .ai-featured-products__container-av3zuskjnwwhic3bttaigenblock445d9f7jpdp3w {
    display: grid !important;
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 28px !important;
  }
  @media (max-width: 768px) {
    .ai-featured-products__container-av3zuskjnwwhic3bttaigenblock445d9f7jpdp3w {
      grid-template-columns: 1fr !important;
    }
  }
  .ai-featured-products__product-av3zuskjnwwhic3bttaigenblock445d9f7jpdp3w {
    background: #ffffff !important;
    border: 1px solid #e1e8ed !important;
    border-radius: 12px !important;
    padding: 24px !important;
    box-shadow: 0 4px 15px rgba(0,0,0,0.05) !important;
    display: flex !important;
    flex-direction: column !important;
    align-items: center !important;
    text-align: center !important;
    transition: transform 0.2s ease, box-shadow 0.2s ease !important;
  }
  .ai-featured-products__product-av3zuskjnwwhic3bttaigenblock445d9f7jpdp3w:hover {
    transform: translateY(-4px) !important;
    box-shadow: 0 8px 25px rgba(0,0,0,0.1) !important;
  }
  .ai-featured-products__title-av3zuskjnwwhic3bttaigenblock445d9f7jpdp3w {
    font-size: 20px !important;
    font-weight: 700 !important;
    color: #074174 !important;
    margin: 14px 0 8px !important;
  }
  .ai-featured-products__price-av3zuskjnwwhic3bttaigenblock445d9f7jpdp3w {
    font-size: 22px !important;
    font-weight: 700 !important;
    color: #074174 !important;
    margin-bottom: 16px !important;
  }
  .ai-featured-products__button-av3zuskjnwwhic3bttaigenblock445d9f7jpdp3w {
    display: inline-block !important;
    background: #074174 !important;
    color: #ffffff !important;
    font-size: 16px !important;
    font-weight: 700 !important;
    padding: 12px 36px !important;
    border-radius: 30px !important;
    text-decoration: none !important;
    transition: background 0.2s ease !important;
    margin-top: auto !important;
  }
  .ai-featured-products__button-av3zuskjnwwhic3bttaigenblock445d9f7jpdp3w:hover {
    background: #218dc8 !important;
  }
  `;

  const finalCss = headStyle + '\n' + bannerCss + '\n' + themeCss;
  console.log('Final CSS total bytes:', Buffer.byteLength(finalCss, 'utf8'));

  // Upload CSS
  await uploadThemeAsset(token, 'assets/navage-sinusitis.css', finalCss);

  // 2. Build Perfect Liquid Template
  const rawHtml = fs.readFileSync('Clone-navage/data/sinusitis_page.html', 'utf8');

  // Extract Content
  const firstContent = rawHtml.indexOf('id="shopify-section-template--27702861398296__rich_text_bEickp"');
  const footerPos = rawHtml.indexOf('id="shopify-section-sections--27702862315800__footer"');
  let contentHtml = rawHtml.substring(rawHtml.lastIndexOf('<div', firstContent), rawHtml.lastIndexOf('</div>', footerPos));

  // Extract Footer
  const footerStart = rawHtml.lastIndexOf('<div', footerPos);
  const footerHtml = rawHtml.substring(footerStart, rawHtml.indexOf('<!-- END sections: sections--27702862315800__footer', footerStart)) + '</div>';

  // Sanitize URLs
  function clean(str) {
    return str
      .replace(/src=["']\/\/([^"']+)["']/g, 'src="https://$1"')
      .replace(/srcset=["']\/\/([^"']+)["']/g, 'srcset="https://$1"')
      .replace(/src=["']\/cdn\//g, 'src="https://navage.com/cdn/')
      .replace(/srcset=["']\/cdn\//g, 'srcset="https://navage.com/cdn/')
      .replace(/https:\/\/navage\.com\/products\/navage-advanced-nose-cleaner/g, '/products/navage-advanced-nose-cleaner')
      .replace(/href=["']\/products\/navage-advanced-nose-cleaner["']/g, 'href="/products/navage-advanced-nose-cleaner"')
      .replace(/https:\/\/navage\.com\/products\/navage-starter-bundle/g, '/products/navage-starter-bundle')
      .replace(/href=["']\/products\/navage-starter-bundle["']/g, 'href="/products/navage-starter-bundle"')
      .replace(/<script[^>]+src=["'][^"']*(?:klaviyo|facebook|googletagmanager|tiktok|luckyorange|hotjar|clarity)[^"']*["'][^>]*><\/script>/gi, '')
      .replace(/<script[^>]*>[\s\S]*?(?:fbq\(|gtag\(|klaviyo\.push)[\s\S]*?<\/script>/gi, '');
  }

  const cleanContent = clean(contentHtml);
  const cleanFooter = clean(footerHtml);

  const perfectLiquid = `{% layout none %}
<!doctype html>
<html class="no-js" lang="{{ request.locale.iso_code }}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  <title>Naväge Nasal Care - Sinusitis Sufferer</title>
  <meta name="description" content="Discover how Naväge helps sinusitis sufferers breathe easier and relieve congestion naturally without pills.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,700;0,900;1,400&family=Roboto+Condensed:wght@400;700&display=swap" rel="stylesheet">
  {{ 'navage-sinusitis.css' | asset_url | stylesheet_tag }}
</head>
<body class="template-page template-page--sinusitis-sufferer">

  <!-- Top Announcement Banner -->
  <div class="ng-banner-anc" role="banner" id="ng-banner-anc">
    <div class="ng-banner-anc__inner">
      <span class="ng-banner-anc__tag">New</span>
      <span class="ng-banner-anc__text">
        <strong>Meet the Naväge Advanced Nose Cleaner. </strong>Your Naväge, leveled up — Digital Controls, 3 Comfort Settings &amp; More!
      </span>
      <span class="ng-banner-anc__divider" aria-hidden="true"></span>
      <a href="/products/navage-advanced-nose-cleaner" class="ng-banner-anc__link">See what's new →</a>
    </div>
    <button type="button" class="ng-banner-anc__dismiss" id="ng-banner-anc-dismiss" aria-label="Dismiss announcement">×</button>
  </div>

  <!-- Navage Header -->
  <div id="shopify-section-header" class="shopify-section shopify-section--header" style="position: sticky; top: 0; z-index: 1000; background: #074174; box-shadow: 0 2px 10px rgba(0,0,0,0.15);">
    <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 14px 24px; display: flex; align-items: center; justify-content: space-between;">
      <a href="/pages/sinusitis-sufferer" class="header__logo-link" style="display: flex; align-items: center;">
        <img class="header__logo-image" src="https://navage.com/cdn/shop/files/logo_420x.png?v=1720725569" alt="Naväge Nasal Care" style="height: 38px; width: auto; display: block;">
      </a>
      <div style="display: flex; align-items: center; gap: 28px;">
        <a href="/products/navage-advanced-nose-cleaner" style="color: #ffffff; font-weight: 700; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; transition: color 0.2s;" onmouseover="this.style.color='#4fd7d8'" onmouseout="this.style.color='#ffffff'">Advanced Nose Cleaner</a>
        <a href="/products/navage-starter-bundle" style="color: #ffffff; font-weight: 700; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px; transition: color 0.2s;" onmouseover="this.style.color='#4fd7d8'" onmouseout="this.style.color='#ffffff'">Starter Bundle</a>
        <a href="/cart" style="color: #074174; background: #ffffff; display: flex; align-items: center; gap: 8px; padding: 8px 18px; border-radius: 20px; font-weight: 700; font-size: 14px; text-decoration: none;">
          <svg width="18" height="18" viewBox="0 0 20 18" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 1h14l1 16H2L3 1z"/>
            <path d="M7 4v0a3 3 0 003 3v0a3 3 0 003-3v0"/>
          </svg>
          <span>Cart</span>
        </a>
      </div>
    </div>
  </div>

  <!-- Main Content Story / Advertorial -->
  <main id="main" role="main" class="anchor">
    ${cleanContent}
  </main>

  <!-- Navage Footer -->
  <div id="shopify-section-footer" class="shopify-section shopify-section--footer" style="background: #074174; color: #ffffff; padding: 50px 0 30px;">
    ${cleanFooter}
  </div>

  <script>
    (function () {
      var STORAGE_KEY = 'ng-banner-dismissed-2026';
      var banner = document.getElementById('ng-banner-anc');
      var dismissBtn = document.getElementById('ng-banner-anc-dismiss');
      if (banner && dismissBtn) {
        if (localStorage.getItem(STORAGE_KEY)) {
          banner.style.display = 'none';
        }
        dismissBtn.addEventListener('click', function () {
          banner.style.display = 'none';
          try { localStorage.setItem(STORAGE_KEY, '1'); } catch (e) {}
        });
      }
    })();
  </script>
</body>
</html>
`;

  // Upload Template
  await uploadThemeAsset(token, 'templates/page.sinusitis-sufferer.liquid', perfectLiquid);
  console.log('✔ Complete update deployed successfully!');
}

main().catch(console.error);
