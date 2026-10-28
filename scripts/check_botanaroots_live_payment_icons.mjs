import puppeteer from 'puppeteer';

async function main() {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto('https://tryzavelyn.com/products/zavelyn-botanaroots-organic-batana-hair-growth-oil', { waitUntil: 'networkidle2' });
  
  const paymentIconsInfo = await page.evaluate(() => {
    const icons = Array.from(document.querySelectorAll('.zv-payment-icons-row .zv-payment-icon, .zv-payment-icons-row svg'));
    return icons.map(el => ({
      tagName: el.tagName,
      className: el.className,
      innerHTMLPreview: el.innerHTML.substring(0, 100),
      outerHTMLPreview: el.outerHTML.substring(0, 150),
      rect: el.getBoundingClientRect()
    }));
  });

  console.log('BotanaRoots payment icons count:', paymentIconsInfo.length);
  console.log('Sample icon:', JSON.stringify(paymentIconsInfo[0], null, 2));

  await browser.close();
}

main().catch(console.error);
