import fs from 'fs';

const html = fs.readFileSync('joylux_page.html', 'utf-8');
const idx = html.indexOf('Frequently asked question');
console.log('Found FAQ at char:', idx);
console.log(html.substring(idx - 200, idx + 4000));
