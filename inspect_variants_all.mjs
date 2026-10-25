import fs from 'fs';

const html = fs.readFileSync('ackerman_page.html', 'utf8');
const idx = html.indexOf('"variants"');
console.log(html.substring(idx, idx + 4000));
