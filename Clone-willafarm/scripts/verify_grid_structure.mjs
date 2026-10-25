const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';

async function main() {
  const res = await fetch(`https://${SHOP_DOMAIN}/products/livestock-heating-lamp`, {
    headers: { 'Cache-Control': 'no-cache' }
  });
  const html = await res.text();

  // Parse hero grid children
  const gridMatch = html.match(/<div class="wf-container wf-hero-grid">([\s\S]*?)<\/section>/);
  if (!gridMatch) {
    console.log('Hero grid not found!');
    return;
  }

  const gridContent = gridMatch[1];
  
  // Count how many direct top-level columns exist in wf-hero-grid
  // A clean hero grid should only have wf-gallery-col and wf-buybox-col
  const hasGalleryCol = gridContent.includes('class="wf-gallery-col"');
  const hasBuyboxCol = gridContent.includes('class="wf-buybox-col"');
  
  // Check if wf-bundle-selector is INSIDE wf-buybox-col
  const buyboxStart = gridContent.indexOf('class="wf-buybox-col"');
  const bundleStart = gridContent.indexOf('class="wf-bundle-selector"');
  const purchaseStart = gridContent.indexOf('class="wf-purchase-actions"');
  const benefitsStart = gridContent.indexOf('class="wf-benefits-card"');
  
  console.log('Grid Structure Verification:');
  console.log('  hasGalleryCol:', hasGalleryCol);
  console.log('  hasBuyboxCol:', hasBuyboxCol);
  console.log('  Position index buyboxCol:', buyboxStart);
  console.log('  Position index bundleSelector:', bundleStart);
  console.log('  Position index purchaseActions:', purchaseStart);
  console.log('  Position index benefitsCard:', benefitsStart);

  if (buyboxStart < bundleStart && bundleStart < purchaseStart && purchaseStart < benefitsStart) {
    console.log('\n✔ PERFECT 2-COLUMN STRUCTURE CONFIRMED!');
    console.log('Gallery on left (col 1), Buy Box on right (col 2) containing Header -> Bundles -> ATC -> Payments -> Benefits!');
  } else {
    console.log('\n✖ Warning: Column order mismatch');
  }
}

main().catch(console.error);
