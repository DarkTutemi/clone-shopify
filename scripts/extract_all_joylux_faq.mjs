import fs from 'fs';

const html = fs.readFileSync('joylux_page.html', 'utf-8');
const idx = html.indexOf('Frequently asked question');
const endIdx = html.indexOf('</section>', idx) > -1 ? html.indexOf('</section>', idx) : html.indexOf('<!-- Footer', idx);
console.log(html.substring(idx, idx + 8000));
