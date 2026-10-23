import fs from 'fs';
import * as cheerio from 'cheerio';

async function main() {
  const url = 'https://earthlyderm.com/collections/earthly-derm/products/turmeric-glow-soap?variant=43082567221382';
  console.log('Fetching', url);
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  const html = await res.text();
  fs.writeFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/pdp_original.html', html);
  console.log('Saved raw HTML, size:', html.length);

  const $ = cheerio.load(html);
  
  // Extract main product section
  const mainSec = $('#shopify-section-template--19526978371718__main').html();
  fs.writeFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/pdp_main_section.html', mainSec || '');

  // Extract all sections
  $('.shopify-section').each((i, el) => {
    const id = $(el).attr('id');
    console.log('Section found:', id);
  });
}

main().catch(console.error);
