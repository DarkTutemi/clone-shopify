import fs from 'fs';

const html = fs.readFileSync('draft_working/botanaroots_body_html.html', 'utf8');

const url1 = 'https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-botana-asset-3.png?v=1792936261';
const url2 = 'https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-botana-asset-4.png?v=1792936264';
const url3 = 'https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-botana-asset-5.png?v=1792936267';
const url4 = 'https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-botana-asset-6.png?v=1792936270';

console.log('Includes url1:', html.includes(url1));
console.log('Includes url2:', html.includes(url2));
console.log('Includes url3:', html.includes(url3));
console.log('Includes url4:', html.includes(url4));
