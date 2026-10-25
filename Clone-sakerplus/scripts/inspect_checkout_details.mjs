import fs from 'fs';

const html = fs.readFileSync('Clone-sakerplus/data/heating_lamp/checkout.html', 'utf8');
console.log('Checkout HTML size:', html.length);

const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
console.log('Title:', titleMatch ? titleMatch[1] : 'None');

const nuxtStart = html.indexOf('<div data-server-rendered="true" id="__nuxt">');
const scriptsStart = html.indexOf('<script', nuxtStart);
console.log('Nuxt start:', nuxtStart, 'Scripts start:', scriptsStart);

if (nuxtStart !== -1 && scriptsStart !== -1) {
  const nuxtHtml = html.substring(nuxtStart, scriptsStart);
  console.log('Nuxt HTML length:', nuxtHtml.length);
  fs.writeFileSync('Clone-sakerplus/data/heating_lamp/extracted_checkout_dom.html', nuxtHtml);
  
  const textOnly = nuxtHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  console.log('Text preview (first 500 chars):');
  console.log(textOnly.substring(0, 500));
}
