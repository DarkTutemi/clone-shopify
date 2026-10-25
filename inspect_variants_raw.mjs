import fs from 'fs';

const html = fs.readFileSync('ackerman_page.html', 'utf8');
const idx = html.indexOf('"variants"');
if (idx !== -1) {
  console.log(html.substring(idx, idx + 1000));
} else {
  console.log('No "variants" string found');
}
