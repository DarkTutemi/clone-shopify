import fs from 'fs';

const html = fs.readFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/homepage.html', 'utf8');

const idx = html.indexOf('template--19526977814662__section_hero_banner_2_NFRiTr');
console.log('Hero banner snippet:');
console.log(html.substring(idx, idx + 4000));
