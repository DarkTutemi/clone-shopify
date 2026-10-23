import puppeteer from 'puppeteer';
import fs from 'fs';

async function dumpSections() {
  const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222' });
  const pages = await browser.pages();
  const page = pages.find(p => p.url().includes('trybronoir.com/products/bronoir%E2%84%A2-warmers'));
  if (!page) {
    console.log('trybronoir page not found');
    return;
  }
  
  const sections = await page.evaluate(() => {
    const list = Array.from(document.querySelectorAll('.icartShopifyCartContent > div, .icartShopifyCartContent > section'));
    return list.map(s => ({
      id: s.id,
      className: s.className,
      outerHTML: s.outerHTML
    }));
  });
  
  fs.writeFileSync('trybronoir_warmers_sections.json', JSON.stringify(sections, null, 2));
  console.log('Saved', sections.length, 'sections');
}

dumpSections();
