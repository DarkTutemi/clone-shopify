import fs from 'fs';

const html = fs.readFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/homepage.html', 'utf8');

const regex = /<[^>]+block--heading_YmWzfw[^>]*>[\s\S]*?<\/[^>]+>/gi;
const m = regex.exec(html);
console.log('Heading HTML:', m ? m[0] : 'not found');

const subRegex = /<[^>]+block--subtitle_Ke8U7e[^>]*>[\s\S]*?<\/[^>]+>/gi;
const sub = subRegex.exec(html);
console.log('Subtitle HTML:', sub ? sub[0] : 'not found');

const btnRegex = /<[^>]+block--button_PHErQg[^>]*>[\s\S]*?<\/[^>]+>/gi;
const btn = btnRegex.exec(html);
console.log('Button HTML:', btn ? btn[0] : 'not found');
