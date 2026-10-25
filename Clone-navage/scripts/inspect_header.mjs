import fs from 'fs';

const html = fs.readFileSync('Clone-navage/data/sinusitis_page.html', 'utf8');

const headerIdx = html.indexOf('shopify-section--header');
if (headerIdx !== -1) {
  const start = html.lastIndexOf('<div', headerIdx);
  const end = html.indexOf('<!-- END sections', headerIdx);
  console.log('Header snippet length:', end - start);
  console.log('Header preview:\n', html.substring(start, start + 1200));
} else {
  console.log('No header found');
}
