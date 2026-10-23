import fs from 'fs';

for (const f of ['products_turmeric-glow-soap.html', 'products_african-black-soap.html']) {
  const html = fs.readFileSync(`h:/Shopify-Clone/Clone-earthlyderm/data/${f}`, 'utf8');
  const articles = [...html.matchAll(/<article[^>]*class=['"][^'"]*loox-review[^'"]*['"][\s\S]*?<\/article>/gi)];
  console.log(`${f}: ${articles.length} reviews`);
}
