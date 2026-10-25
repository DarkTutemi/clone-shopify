import fs from 'fs';

let dom = fs.readFileSync('Clone-sakerplus/data/heating_lamp/extracted_news_dom.html', 'utf8');

// Replace all links to landingpage with the shopify product page
dom = dom.replaceAll('/funnel/landingpage-sakerplus-livestock-heating-lamp-1', '/products/sakerplus-livestock-heating-lamp');
dom = dom.replaceAll('https://m.sakerplus.com/funnel/landingpage-sakerplus-livestock-heating-lamp-1', '/products/sakerplus-livestock-heating-lamp');

// Replace cf-protected email
dom = dom.replace(/<a[^>]+href=["'][^"']*email-protection[^"']*["'][^>]*>[\s\S]*?<\/a>/gi, '<a href="mailto:support@sakerplus.com" style="color:#666;">support@sakerplus.com</a>');

const templateContent = `{% layout none %}
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  <title>7 Reasons Backyard Farmers Are Ditching Their Old Heat Lamps | Sakerplus®</title>
  <meta name="description" content="Discover why backyard farmers are switching to the Intelligent Auto-Regulating Brooder Lamp. Safe, fireproof, and maintains the perfect temperature automatically.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400;1,700&display=swap">
  {{ 'news-heating-lamp.css' | asset_url | stylesheet_tag }}

  <style>
    /* Reset & Base Scoping */
    html, body {
      margin: 0;
      padding: 0;
      font-family: 'Poppins', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #f7f9fa;
      color: #1a202c;
      -webkit-font-smoothing: antialiased;
    }

    /* Pulse animation for CTA buttons */
    @keyframes btnPulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.03); }
      100% { transform: scale(1); }
    }
    .btnshrink_animation {
      animation: btnPulse 2s infinite ease-in-out;
      display: block;
      text-decoration: none !important;
    }
    .btnshrink_animation:hover {
      filter: brightness(1.08);
      transform: translateY(-2px);
    }

    /* Fixed Sticky Bottom Bar for High Conversions */
    .sticky-bottom-promo-bar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: #ffffff;
      border-top: 1px solid #e2e8f0;
      box-shadow: 0 -4px 20px rgba(0,0,0,0.12);
      padding: 10px 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      z-index: 999999;
      font-family: 'Poppins', sans-serif;
    }
    .sticky-bar-info {
      display: flex;
      flex-direction: column;
    }
    .sticky-bar-title {
      font-size: 14px;
      font-weight: 700;
      color: #1e293b;
    }
    .sticky-bar-discount {
      font-size: 12px;
      font-weight: 600;
      color: #e53e3e;
    }
    .sticky-bar-btn {
      background-color: #4c9a95;
      color: #ffffff !important;
      padding: 10px 24px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 15px;
      text-decoration: none !important;
      transition: background-color 0.2s, transform 0.2s;
      white-space: nowrap;
      box-shadow: 0 4px 12px rgba(76, 154, 149, 0.4);
    }
    .sticky-bar-btn:hover {
      background-color: #3b827e;
      transform: translateY(-1px);
    }
    @media (max-width: 640px) {
      .sticky-bar-title {
        font-size: 12px;
        max-width: 170px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .sticky-bar-btn {
        padding: 9px 16px;
        font-size: 13px;
      }
    }
  </style>
</head>
<body>
  ${dom}

  <!-- Sticky Bottom Conversion Bar -->
  <div class="sticky-bottom-promo-bar">
    <div class="sticky-bar-info">
      <span class="sticky-bar-title">Sakerplus® Livestock Heating Lamp</span>
      <span class="sticky-bar-discount">⚡ Special 50% OFF Limited Time Offer</span>
    </div>
    <a href="/products/sakerplus-livestock-heating-lamp" class="sticky-bar-btn">GET 50% OFF NOW →</a>
  </div>

  <div style="height: 65px;"></div>
</body>
</html>
`;

console.log('Template size:', templateContent.length, 'bytes');
fs.writeFileSync('Clone-sakerplus/data/heating_lamp/page.news-sakerplus-livestock-heating-lamp.liquid', templateContent);
console.log('✔ Successfully created page.news-sakerplus-livestock-heating-lamp.liquid');
