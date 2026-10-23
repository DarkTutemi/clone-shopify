import fs from 'fs';

function extractProductContent(filename, handle) {
  const html = fs.readFileSync(`h:/Shopify-Clone/Clone-earthlyderm/data/${filename}`, 'utf8');

  // 1. Title, subtitle, badge
  const title = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, '').trim();
  
  // 2. Short description / bullet points in main buy box
  const buyBoxBullets = [...html.matchAll(/<li[^>]*class=['"][^'"]*(usp|benefit|feature|bullet)[^'"]*['"][^>]*>([\s\S]*?)<\/li>/gi)].map(m => m[2].replace(/<[^>]+>/g, '').trim());

  // 3. What to expect section
  const wteMatch = html.match(/id=['"]shopify-section-[^'"]*section_what_to_expect[^'"]*['"][\s\S]*?<\/section>/i)?.[0];
  
  // 4. Before & after results
  const baMatch = html.match(/id=['"]shopify-section-[^'"]*section_before_after_results[^'"]*['"][\s\S]*?<\/section>/i)?.[0];

  // 5. Ingredients info
  const ingMatch = html.match(/id=['"]shopify-section-[^'"]*section_ingredients_info[^'"]*['"][\s\S]*?<\/section>/i)?.[0];

  // 6. PDP FAQs
  const faqMatch = html.match(/id=['"]shopify-section-[^'"]*pdp_faqs_section[^'"]*['"][\s\S]*?<\/div>\s*<\/div>/i)?.[0];

  // 7. Moneyback section
  const mbMatch = html.match(/id=['"]shopify-section-[^'"]*pdp_moneyback_section[^'"]*['"][\s\S]*?<\/div>\s*<\/div>/i)?.[0];

  return {
    handle,
    title,
    hasWte: !!wteMatch,
    wteLength: wteMatch?.length || 0,
    hasBeforeAfter: !!baMatch,
    baLength: baMatch?.length || 0,
    hasIngredients: !!ingMatch,
    ingLength: ingMatch?.length || 0,
    hasFaq: !!faqMatch,
    faqLength: faqMatch?.length || 0,
    hasMoneyback: !!mbMatch,
    mbLength: mbMatch?.length || 0
  };
}

const t = extractProductContent('products_turmeric-glow-soap.html', 'turmeric-glow-soap');
const a = extractProductContent('products_african-black-soap.html', 'african-black-soap');
console.log('Turmeric content analysis:', t);
console.log('African black soap content analysis:', a);
