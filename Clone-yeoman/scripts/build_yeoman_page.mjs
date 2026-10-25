import fs from 'fs';

const html = fs.readFileSync('Clone-yeoman/data/the-yeoman-sweep.html', 'utf8');

// 1. Extract Head Assets (fonts, meta)
const headContent = `
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
  <title>The Yeoman Sweep – Field &amp; Harvest Co</title>
  <meta name="description" content="The World's First Lawn Tool That Ends The Raking, Leaf Blowing And The Painful Bending. Clears Up The Yard With Ease.">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
`;

// 2. Extract Header
const headerStart = html.indexOf('id="shopify-section-sections--17602498986027__header_section"');
let headerHtml = '';
if (headerStart !== -1) {
  const start = html.lastIndexOf('<header', headerStart);
  const end = html.indexOf('</header>', start) + 9;
  headerHtml = html.substring(start, end);
}
console.log('Header extracted length:', headerHtml.length);

// 3. Extract Main Section
const mainHtml = fs.readFileSync('Clone-yeoman/data/product_main_section.html', 'utf8');
console.log('Original main section length:', mainHtml.length);

// Modify mainHtml for 21 inch ONLY:
// a) Replace variant selector buttons in .sup-ladder
const ladderRegex = /<div class="sup-ladder">[\s\S]*?<\/div>/i;
const single21Ladder = `<div class="sup-ladder">
  <button type="button"
          class="sup-tier is-active"
          data-tier
          data-pack="21 in"
          data-units="1"
          data-unlocks="false"
          aria-pressed="true"
          style="width: 100%; border: 2px solid #C0653F; background: #FBF6EC;">
    <span class="sup-radio" aria-hidden="true" style="border-color: #C0653F; background: #C0653F;"></span>
    <span>
      <span class="sup-tier-name" style="font-weight: 800; font-size: 18px; color: #241A13;">21 inch</span>
      <span class="sup-tier-meta" style="color: #54463A;">
        <span>Small to medium yards and quick touch-ups</span>
      </span>
    </span>
    <span class="sup-tier-price" data-tier-price>
      <span data-tier-now style="font-weight: 800; color: #C0653F; font-size: 20px;">$229.99</span>
      <span class="sup-tier-was" data-tier-was style="text-decoration: line-through; color: #8A7866; margin-left: 8px;">$289.99</span>
    </span>
  </button>
</div>`;

let modifiedMain = mainHtml.replace(ladderRegex, single21Ladder);

// b) Update hidden variant ID to our live seeded variant ID 67918044954809
modifiedMain = modifiedMain.replace(/value="45323703779371"/g, 'value="67918044954809"');
modifiedMain = modifiedMain.replace(/id="sup-variant-id" value="[^"]*"/, 'id="sup-variant-id" value="67918044954809"');

// c) Update spec table from 26 in to 21 in
modifiedMain = modifiedMain.replace(/<dt>Sweep path<\/dt>\s*<dd>26 in<\/dd>/g, '<dt>Sweep path</dt><dd>21 in</dd>');

// d) Update JavaScript variants array to contain ONLY 21 in
const variantsJsRegex = /var variants = \[[\s\S]*?\];/i;
const singleVariantJs = `var variants = [{
  id: 67918044954809,
  pack: "21 in",
  color: "",
  price: 22999,
  compare: 28999,
  priceStr: "$229.99",
  compareStr: "$289.99",
  image: "https://cdn.shopify.com/s/files/1/0651/8299/0379/files/hf_20260913_100130_cc5a08ed-b3ec-4abb-95bc-a45bfdb72b96.png?v=1789293761",
  available: true
}];`;

modifiedMain = modifiedMain.replace(variantsJsRegex, singleVariantJs);

// e) Disable external gift IDs that would fail in /cart/add
modifiedMain = modifiedMain.replace(/var GIFT_ALWAYS = parseInt\("[^"]*", 10\);/g, 'var GIFT_ALWAYS = 0;');
modifiedMain = modifiedMain.replace(/var GIFT_LOCKED = parseInt\("[^"]*", 10\);/g, 'var GIFT_LOCKED = 0;');

// f) Fix image URLs to full https
modifiedMain = modifiedMain
  .replace(/src=["']\/\/([^"']+)["']/g, 'src="https://$1"')
  .replace(/data-full=["']\/\/([^"']+)["']/g, 'data-full="https://$1"');

// 4. Extract Footer
const footerStart = html.indexOf('id="shopify-section-sections--17602495986027__fh_footer"') || html.indexOf('id="fh-footer"');
let footerHtml = '';
if (footerStart !== -1) {
  const start = html.lastIndexOf('<footer', footerStart);
  const end = html.indexOf('</footer>', start) + 9;
  footerHtml = html.substring(start, end);
}
console.log('Footer extracted length:', footerHtml.length);

// 5. Assemble Full Liquid Page Template
const fullLiquid = `{% layout none %}
<!doctype html>
<html class="no-js" lang="{{ request.locale.iso_code }}">
<head>
  ${headContent}
  <style>
    /* Global base resets */
    html, body {
      margin: 0;
      padding: 0;
      background: #FBF6EC;
      color: #241A13;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      -webkit-font-smoothing: antialiased;
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

    /* Field & Harvest Top Header Styling */
    .fh-header {
      background: #241A13;
      color: #FBF6EC;
      padding: 14px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 1000;
      box-shadow: 0 2px 10px rgba(0,0,0,0.15);
    }
    .fh-header__logo {
      display: flex;
      align-items: center;
      gap: 10px;
      font-weight: 800;
      font-size: 18px;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: #FBF6EC;
    }
    .fh-header__nav {
      display: flex;
      align-items: center;
      gap: 24px;
    }
    .fh-header__link {
      font-weight: 600;
      font-size: 14px;
      color: #F2E9DA;
      transition: color 0.2s;
    }
    .fh-header__link:hover {
      color: #C0653F;
    }
    .fh-header__cart {
      background: #C0653F;
      color: #ffffff;
      padding: 8px 18px;
      border-radius: 20px;
      font-weight: 700;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: background 0.2s;
    }
    .fh-header__cart:hover {
      background: #9A4A25;
    }

    /* Field & Harvest Footer Styling */
    .fh-footer-custom {
      background: #241A13;
      color: #F2E9DA;
      padding: 60px 24px 30px;
      margin-top: 40px;
      border-top: 1px solid #3D3024;
    }
    .fh-footer-custom .fh-footer__inner {
      max-width: 1200px;
      margin: 0 auto;
    }
    .fh-footer-custom h2, .fh-footer-custom h3 {
      color: #FBF6EC;
    }
    .fh-footer-custom a {
      color: #8A7866;
      transition: color 0.2s;
    }
    .fh-footer-custom a:hover {
      color: #C0653F;
    }
  </style>
</head>
<body class="template-product template-product--the-yeoman-sweep">

  <!-- Header -->
  <header class="fh-header">
    <a href="/products/the-yeoman-sweep" class="fh-header__logo">
      <img src="https://fieldandharvestco.com/cdn/shop/files/Copy_of_COMFORT_CRADLE_Logos_5.png?height=36&v=1765838330" alt="Field &amp; Harvest Co" style="height: 32px; width: auto;">
      <span>Field &amp; Harvest Co</span>
    </a>
    <div class="fh-header__nav">
      <a href="/products/the-yeoman-sweep" class="fh-header__link">The Yeoman Sweep</a>
      <a href="/cart" class="fh-header__cart">
        <svg width="18" height="18" viewBox="0 0 20 18" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M3 1h14l1 16H2L3 1z"/>
          <path d="M7 4v0a3 3 0 003 3v0a3 3 0 003-3v0"/>
        </svg>
        <span>Cart</span>
      </a>
    </div>
  </header>

  <!-- Main Content: The Yeoman Sweep Product Section -->
  <main id="MainContent" role="main">
    ${modifiedMain}
  </main>

  <!-- Footer -->
  <footer class="fh-footer-custom">
    <div class="fh-footer__inner">
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 40px; margin-bottom: 40px;">
        <div>
          <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 12px; color: #FBF6EC;">About The Yeoman Sweep</h3>
          <p style="font-size: 14px; line-height: 1.6; color: #8A7866;">The world's first ergonomic lawn tool engineered to replace rakes and noisy leaf blowers. Heavy-duty steel frame, 3 V-brush sweepers, and instant dump hopper.</p>
        </div>
        <div>
          <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 12px; color: #FBF6EC;">Customer Support</h3>
          <p style="font-size: 14px; line-height: 1.6; color: #8A7866;">60-Day Clean Sweep Guarantee. Free shipping both ways. 2-Year limited warranty included on all orders.</p>
        </div>
        <div>
          <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 12px; color: #FBF6EC;">Fast 2-4 Day Delivery</h3>
          <p style="font-size: 14px; line-height: 1.6; color: #8A7866;">Orders ship within 24 hours from our local fulfillment center. Tracking provided immediately upon dispatch.</p>
        </div>
      </div>
      <div style="border-top: 1px solid #3D3024; padding-top: 24px; text-align: center; font-size: 13px; color: #8A7866;">
        <p>&copy; {{ 'now' | date: '%Y' }} Field &amp; Harvest Co. All rights reserved. Powered by Shopify.</p>
      </div>
    </div>
  </footer>

</body>
</html>
`;

fs.mkdirSync('Clone-yeoman/theme/templates', { recursive: true });
fs.writeFileSync('Clone-yeoman/theme/templates/product.yeoman-sweep.liquid', fullLiquid, 'utf8');
console.log('✔ Successfully generated product.yeoman-sweep.liquid, total bytes:', Buffer.byteLength(fullLiquid, 'utf8'));
