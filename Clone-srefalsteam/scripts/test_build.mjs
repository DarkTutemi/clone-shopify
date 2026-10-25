import fs from 'fs';

const seeded = JSON.parse(fs.readFileSync('Clone-srefalsteam/data/seeded_product.json', 'utf8'));
const fullHtml = fs.readFileSync('Clone-srefalsteam/data/product.html', 'utf8');

console.log('Seeded product:', seeded);

// Extract main tag
const mainMatch = fullHtml.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
if (!mainMatch) {
  throw new Error('No main tag found');
}

let mainHtml = mainMatch[1];
console.log('Extracted main HTML, initial length:', mainHtml.length);

// 1. Replace old product ID and variant ID with new live IDs
const OLD_VARIANT_ID = '56604272591174';
const NEW_VARIANT_ID = String(seeded.variantId);
const OLD_PRODUCT_ID = '15562968269126';
const NEW_PRODUCT_ID = String(seeded.productId);

console.log(`Replacing old variant ID ${OLD_VARIANT_ID} -> ${NEW_VARIANT_ID}`);
console.log(`Replacing old product ID ${OLD_PRODUCT_ID} -> ${NEW_PRODUCT_ID}`);

mainHtml = mainHtml.replaceAll(OLD_VARIANT_ID, NEW_VARIANT_ID);
mainHtml = mainHtml.replaceAll(OLD_PRODUCT_ID, NEW_PRODUCT_ID);

// 2. Replace empty bundler container with authentic Special Deal HTML
const bundlePlaceholder = '<div class="atlas-bundler-render bundle-qty-deal"></div>';
const bundleRenderedHtml = `
<div class="atlas-bundler-render bundle-qty-deal">
  <div class="bundle-qty-deal__header" style="text-align: center; margin-bottom: 8px;">
    <span class="bundle-qty-deal__title" style="font-weight: 800; font-size: 13px; letter-spacing: 1.5px; text-transform: uppercase; color: #111;">SPECIAL DEAL</span>
  </div>
  <div class="bundle-qty-option selected" style="border: 2px solid #111; border-radius: 8px; overflow: hidden; background: #fff; cursor: pointer; position: relative;">
    <div class="bundle-qty-option-inner" style="display: flex; align-items: center; justify-content: space-between; padding: 14px 16px; position: relative;">
      <div style="display: flex; align-items: center; gap: 12px;">
        <input type="radio" checked name="bundle-deal" style="width: 20px; height: 20px; accent-color: #1b3040; margin: 0; cursor: pointer;">
        <div>
          <div style="font-weight: 700; font-size: 16px; color: #111; line-height: 1.2;">Promo Clean</div>
          <div style="display: flex; align-items: center; gap: 4px; font-size: 12px; color: #666; margin-top: 4px;">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
            <span>Limited Time Offer</span>
          </div>
        </div>
      </div>
      <div style="text-align: right;">
        <div style="position: absolute; top: 0; right: 0; background: #000; color: #fff; font-size: 11px; font-weight: 800; padding: 4px 10px; border-bottom-left-radius: 8px; letter-spacing: 0.5px;">40%OFF + 1 FREE GIFT</div>
        <div style="margin-top: 14px;">
          <span style="font-size: 20px; font-weight: 800; color: #111;">$89.99</span>
          <span style="font-size: 14px; color: #888; text-decoration: line-through; margin-left: 6px;">$149.99</span>
        </div>
      </div>
    </div>
    <div class="bundle-qty-gift-bar" style="background: #293e50; color: #ffffff; padding: 10px 16px; display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 700; border-top: 1px solid rgba(255,255,255,0.1);">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"></path><path d="M18 12a2 2 0 0 0-2 2c0 1.1.9 2 2 2h4v-4h-4z"></path></svg>
      <span>+FREE 4x Attachment Nozzles</span>
    </div>
  </div>
</div>
`;

if (mainHtml.includes(bundlePlaceholder)) {
  mainHtml = mainHtml.replace(bundlePlaceholder, bundleRenderedHtml);
  console.log('✔ Replaced bundle placeholder with Special Deal box!');
} else {
  console.log('⚠ Could not find bundle placeholder in mainHtml');
}

// 3. Remove external Heroku / Cloudflare / Dropshipt bundle scripts that block or throw errors
mainHtml = mainHtml.replace(/<script>[\s\S]*?app\.helloatlas\.io[\s\S]*?<\/script>/gi, '');
mainHtml = mainHtml.replace(/<script[^>]+src="[^"]*progressive-gift-monitor[^"]*"[^>]*><\/script>/gi, '');

console.log('Processed main HTML length:', mainHtml.length);
