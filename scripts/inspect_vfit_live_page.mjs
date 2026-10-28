import fs from 'fs';

async function fetchVfit() {
  const res = await fetch('https://tryzavelyn.com/products/zavelyn-vfit-red-light-intimate-wellness-device');
  const html = await res.text();
  console.log('HTML length:', html.length);
  const title = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.trim();
  const price = html.match(/id="zvPriceCurrent"[^>]*>([\s\S]*?)<\/span>/i)?.[1]?.trim();
  const compare = html.match(/id="zvPriceCompare"[^>]*>([\s\S]*?)<\/s>/i)?.[1]?.trim();
  const mainImg = html.match(/id="zvMainImg"[^>]*src="([^"]*)"/i)?.[1];
  
  console.log('Title:', title);
  console.log('Price:', price);
  console.log('Compare:', compare);
  console.log('Main Img:', mainImg);

  const start = html.indexOf('class="zv-pdp-layout"');
  const end = html.indexOf('id="zv-product-description"');
  console.log('Layout to description length:', end - start);
  const slice = html.substring(start, end);
  fs.writeFileSync('scripts/vfit_upper_slice.html', slice, 'utf8');
  console.log('Saved scripts/vfit_upper_slice.html');
}
fetchVfit();
