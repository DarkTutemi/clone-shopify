import fs from 'fs';
import * as cheerio from 'cheerio';

const html = fs.readFileSync('Clone-sakerplus/data/heating_lamp/curl_news.html', 'utf8');
const $ = cheerio.load(html);

console.log('Title:', $('title').text());
console.log('Stylesheets count:', $('link[rel=stylesheet]').length);
$('link[rel=stylesheet]').each((i, el) => console.log('CSS:', $(el).attr('href')));
console.log('Inline style tags:', $('style').length);
let totalInlineCss = 0;
$('style').each((i, el) => { totalInlineCss += $(el).html().length; });
console.log('Total inline CSS length:', totalInlineCss);
console.log('App root id/class:', $('#__nuxt').length ? '#__nuxt' : ($('#__layout').length ? '#__layout' : 'other'));
console.log('Links count:', $('a').length);
const links = [];
$('a').each((i, el) => {
  const href = $(el).attr('href');
  const text = $(el).text().trim().replace(/\s+/g, ' ');
  if (href && !links.some(l => l.href === href)) links.push({ href, text });
});
console.log('Sample links:', JSON.stringify(links, null, 2));

console.log('Images count:', $('img').length);
const sampleImgs = [];
$('img').each((i, el) => {
  const src = $(el).attr('src') || $(el).attr('data-src');
  if (src && !sampleImgs.includes(src)) sampleImgs.push(src);
});
console.log('Unique images count:', sampleImgs.length);
console.log('First 5 images:', sampleImgs.slice(0, 5));
