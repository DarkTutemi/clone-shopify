import fs from 'fs';
import path from 'path';

const rawData = JSON.parse(fs.readFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/raw_products.json', 'utf8'));
const OUTPUT_DIR = 'h:/Shopify-Clone/Clone-earthlyderm/data';

// We have 4 products in raw_products.json:
// 1. african-black-soap ("Anti-Acne & Blemish Bar.")
// 2. turmeric-fade-glow-bar ("Turmeric Fade & Glow Bar.")
// 3. turmeric-fade-glow-bar-razor-bumps ("Turmeric Glow Bar")
// 4. turmeric-glow-soap ("Turmeric Fade & Glow Bar.")

// Let's read the deep HTML from the crawled pages
const turmericHtml = fs.readFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/products_turmeric-glow-soap.html', 'utf8');
const blackSoapHtml = fs.readFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/products_african-black-soap.html', 'utf8');

function extractRichDescription(html, handle) {
  // Extract custom sections:
  // 1. What to expect
  const wte = html.match(/id=['"]shopify-section-[^'"]*section_what_to_expect[^'"]*['"][\s\S]*?<\/section>/i)?.[0] || '';
  // 2. Before & After
  const ba = html.match(/id=['"]shopify-section-[^'"]*section_before_after_results[^'"]*['"][\s\S]*?<\/section>/i)?.[0] || '';
  // 3. Ingredients info
  const ing = html.match(/id=['"]shopify-section-[^'"]*section_ingredients_info[^'"]*['"][\s\S]*?<\/section>/i)?.[0] || '';
  // 4. FAQ
  const faq = html.match(/id=['"]shopify-section-[^'"]*pdp_faqs_section[^'"]*['"][\s\S]*?<\/div>\s*<\/div>/i)?.[0] || '';
  // 5. Moneyback
  const mb = html.match(/id=['"]shopify-section-[^'"]*pdp_moneyback_section[^'"]*['"][\s\S]*?<\/div>\s*<\/div>/i)?.[0] || '';

  // Combine into rich description body
  return {
    wte,
    ba,
    ing,
    faq,
    mb,
    fullDescription: [wte, ba, ing, faq, mb].filter(Boolean).join('\n\n')
  };
}

const turmericRich = extractRichDescription(turmericHtml, 'turmeric-glow-soap');
const blackSoapRich = extractRichDescription(blackSoapHtml, 'african-black-soap');

const catalog = [];

for (const p of rawData.products) {
  let rich;
  let category;
  if (p.handle.includes('african') || p.handle.includes('black')) {
    rich = blackSoapRich;
    category = 'black_soap';
  } else {
    rich = turmericRich;
    category = 'turmeric_soap';
  }

  catalog.push({
    id: p.id,
    title: p.title,
    handle: p.handle,
    productType: p.product_type || 'Soap Bar',
    vendor: 'Earthly Derm',
    category,
    bodyHtml: rich.fullDescription,
    hasRichDescription: rich.fullDescription.length > 500,
    sections: {
      wteLength: rich.wte.length,
      baLength: rich.ba.length,
      ingLength: rich.ing.length,
      faqLength: rich.faq.length,
      mbLength: rich.mb.length
    },
    variants: p.variants.map(v => ({
      id: v.id,
      title: v.title,
      option1: v.option1,
      price: v.price,
      compare_at_price: v.compare_at_price,
      sku: v.sku,
      requires_shipping: v.requires_shipping,
      available: v.available
    })),
    images: p.images.map(img => ({
      id: img.id,
      src: img.src,
      alt: img.alt || p.title,
      width: img.width,
      height: img.height
    }))
  });
}

fs.writeFileSync(path.join(OUTPUT_DIR, 'catalog_harvested.json'), JSON.stringify(catalog, null, 2), 'utf8');
console.log(`Saved ${catalog.length} enriched products to catalog_harvested.json`);
catalog.forEach(c => {
  console.log(`- ${c.title} (${c.handle}): ${c.variants.length} variants, ${c.images.length} images, Rich HTML: ${c.bodyHtml.length} bytes`);
});
