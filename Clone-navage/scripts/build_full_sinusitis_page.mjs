import fs from 'fs';
import path from 'path';

// Ensure directories exist
fs.mkdirSync('Clone-navage/theme/assets', { recursive: true });
fs.mkdirSync('Clone-navage/theme/templates', { recursive: true });
fs.mkdirSync('Clone-navage/theme/sections', { recursive: true });

const rawHtml = fs.readFileSync('Clone-navage/data/sinusitis_page.html', 'utf8');

// 1. Prepare CSS
let css = fs.readFileSync('Clone-navage/data/navage-theme.css', 'utf8');
// Fix any relative protocol URLs in CSS
css = css.replace(/url\(\/\//g, 'url(https://');
fs.writeFileSync('Clone-navage/theme/assets/navage-sinusitis.css', css, 'utf8');
console.log('✔ Prepared navage-sinusitis.css, size:', css.length);

// 2. Extract Head Elements (fonts, inline styles, variables)
const styleTags = [...rawHtml.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(m => m[0]);
console.log('Found style tags:', styleTags.length);

// Extract all inline stylesheets inside head
const headMatch = rawHtml.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
let headContent = '';
if (headMatch) {
  // Extract CSS variables and font links
  const fontLinks = [...headMatch[1].matchAll(/<link[^>]+fonts[^>]+>/gi)].map(m => m[0]).join('\n');
  const preconnects = [...headMatch[1].matchAll(/<link[^>]+preconnect[^>]+>/gi)].map(m => m[0]).join('\n');
  headContent = `
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, height=device-height, minimum-scale=1.0, maximum-scale=5.0">
  <title>Naväge Nasal Care - Sinusitis Sufferer</title>
  <meta name="description" content="Discover how Naväge helps sinusitis sufferers breathe easier and relieve congestion naturally without pills.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,300;0,400;0,500;0,700;0,900;1,400&family=Roboto+Condensed:wght@400;700&display=swap" rel="stylesheet">
  ${preconnects}
  {{ 'navage-sinusitis.css' | asset_url | stylesheet_tag }}
`;
}

// 3. Extract the Header Section
const headerStart = rawHtml.indexOf('id="shopify-section-sections--27702862348568__header"');
let headerHtml = '';
if (headerStart !== -1) {
  const headerDivStart = rawHtml.lastIndexOf('<div', headerStart);
  // Find where header ends (before banner or next section)
  const bannerPos = rawHtml.indexOf('class="ai-custom-html-content-aavzxcmrmuwq0ogn4eaigenblock3254b9bzhrkdl"', headerStart);
  if (bannerPos !== -1) {
    const end = rawHtml.lastIndexOf('</div>', bannerPos);
    headerHtml = rawHtml.substring(headerDivStart, end);
  }
}
console.log('Header extracted length:', headerHtml.length);

// 4. Extract Top Announcement Banner
let bannerHtml = '';
const bannerStart = rawHtml.indexOf('class="ng-banner-anc"');
if (bannerStart !== -1) {
  const divStart = rawHtml.lastIndexOf('<div', bannerStart);
  const divEnd = rawHtml.indexOf('</script>', bannerStart) + 9;
  bannerHtml = rawHtml.substring(divStart, divEnd);
}
console.log('Banner extracted length:', bannerHtml.length);

// 5. Extract Content Blocks (all 21 sections)
const firstContentSection = rawHtml.indexOf('id="shopify-section-template--27702861398296__rich_text_bEickp"');
const footerPos = rawHtml.indexOf('id="shopify-section-sections--27702862315800__footer"');

let contentHtml = '';
if (firstContentSection !== -1 && footerPos !== -1) {
  const start = rawHtml.lastIndexOf('<div', firstContentSection);
  const end = rawHtml.lastIndexOf('</div>', footerPos);
  contentHtml = rawHtml.substring(start, end);
}
console.log('Content extracted length:', contentHtml.length);

// 6. Extract Footer
let footerHtml = '';
if (footerPos !== -1) {
  const start = rawHtml.lastIndexOf('<div', footerPos);
  const end = rawHtml.indexOf('<!-- END sections: sections--27702862315800__footer', start);
  const actualEnd = end !== -1 ? end : rawHtml.indexOf('</footer>', start) + 9;
  footerHtml = rawHtml.substring(start, actualEnd) + '</div>';
}
console.log('Footer extracted length:', footerHtml.length);

// 7. Sanitize & Rewrite URLs across all HTML parts
function sanitizeAndRewrite(str) {
  return str
    // Convert protocol-relative image URLs to https
    .replace(/src=["']\/\/([^"']+)["']/g, 'src="https://$1"')
    .replace(/srcset=["']\/\/([^"']+)["']/g, 'srcset="https://$1"')
    // Convert relative CDN URLs to navage.com CDN
    .replace(/src=["']\/cdn\//g, 'src="https://navage.com/cdn/')
    .replace(/srcset=["']\/cdn\//g, 'srcset="https://navage.com/cdn/')
    // Convert product links to our store's cloned products
    .replace(/https:\/\/navage\.com\/products\/navage-advanced-nose-cleaner/g, '/products/navage-advanced-nose-cleaner')
    .replace(/href=["']\/products\/navage-advanced-nose-cleaner["']/g, 'href="/products/navage-advanced-nose-cleaner"')
    .replace(/https:\/\/navage\.com\/products\/navage-starter-bundle/g, '/products/navage-starter-bundle')
    .replace(/href=["']\/products\/navage-starter-bundle["']/g, 'href="/products/navage-starter-bundle"')
    // Strip external trackers and scripts that fail cross-origin
    .replace(/<script[^>]+src=["'][^"']*(?:klaviyo|facebook|googletagmanager|tiktok|luckyorange|hotjar|clarity)[^"']*["'][^>]*><\/script>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?(?:fbq\(|gtag\(|klaviyo\.push)[\s\S]*?<\/script>/gi, '');
}

headerHtml = sanitizeAndRewrite(headerHtml);
bannerHtml = sanitizeAndRewrite(bannerHtml);
contentHtml = sanitizeAndRewrite(contentHtml);
footerHtml = sanitizeAndRewrite(footerHtml);

// 8. Assemble Full Liquid Page Template
const fullPageLiquid = `{% layout none %}
<!doctype html>
<html class="no-js" lang="{{ request.locale.iso_code }}">
<head>
  ${headContent}
  <style>
    /* Global fixes & resets for standalone navage landing page */
    html, body {
      margin: 0;
      padding: 0;
      font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #074174;
      background-color: #ffffff;
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }
    *, *::before, *::after {
      box-sizing: border-box;
    }
    img {
      max-width: 100%;
      height: auto;
      display: block;
    }
    a {
      color: inherit;
      text-decoration: none;
    }
    .header__logo-image {
      max-height: 48px;
      width: auto;
    }
    .ng-banner-anc__link, .button--primary, a.button {
      cursor: pointer;
      transition: all 0.2s ease-in-out;
    }
    .ng-banner-anc__link:hover {
      opacity: 0.9;
    }
    .anchor {
      position: relative;
    }
    /* Sticky header styles */
    .header--sticky {
      position: sticky;
      top: 0;
      z-index: 100;
      background: #074174;
    }
  </style>
</head>
<body class="template-page template-page--sinusitis-sufferer">
  <!-- Top Announcement Banner -->
  ${bannerHtml}

  <!-- Navage Header -->
  <div id="shopify-section-header" class="shopify-section shopify-section--header header--sticky">
    <div class="container" style="max-width: 1300px; margin: 0 auto; padding: 12px 20px; display: flex; align-items: center; justify-content: space-between;">
      <a href="/pages/sinusitis-sufferer" class="header__logo-link" style="display: flex; align-items: center;">
        <img class="header__logo-image" src="https://navage.com/cdn/shop/files/logo_420x.png?v=1720725569" alt="Naväge Nasal Care" style="height: 40px; width: auto;">
      </a>
      <div style="display: flex; align-items: center; gap: 24px;">
        <a href="/products/navage-advanced-nose-cleaner" style="color: #ffffff; font-weight: 700; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px;">Advanced Nose Cleaner</a>
        <a href="/products/navage-starter-bundle" style="color: #ffffff; font-weight: 700; font-size: 15px; text-transform: uppercase; letter-spacing: 0.5px;">Starter Bundle</a>
        <a href="/cart" style="color: #ffffff; display: flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.15); padding: 8px 16px; border-radius: 20px; font-weight: 600;">
          <svg width="20" height="18" viewBox="0 0 20 18" fill="none" stroke="currentColor" stroke-width="1.5">
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
    ${contentHtml}
  </main>

  <!-- Navage Footer -->
  <div id="shopify-section-footer" class="shopify-section shopify-section--footer">
    ${footerHtml}
  </div>

  <script>
    // Safe interactions
    document.addEventListener('DOMContentLoaded', function() {
      // Smooth scroll for anchors
      document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
          var targetId = this.getAttribute('href');
          if (targetId && targetId !== '#') {
            var target = document.querySelector(targetId);
            if (target) {
              e.preventDefault();
              target.scrollIntoView({ behavior: 'smooth' });
            }
          }
        });
      });
    });
  </script>
</body>
</html>
`;

fs.writeFileSync('Clone-navage/theme/templates/page.sinusitis-sufferer.liquid', fullPageLiquid, 'utf8');
console.log('✔ Generated page.sinusitis-sufferer.liquid, total length:', fullPageLiquid.length);
