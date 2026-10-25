import fs from 'fs';

const html = fs.readFileSync('Clone-sakerplus/data/heating_lamp/curl_news.html', 'utf8');

// Find style tag
const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
const cssContent = styleMatch ? styleMatch[1] : '';
console.log('CSS content length:', cssContent.length);

// Find Nuxt rendered DOM
const nuxtStart = html.indexOf('<div data-server-rendered="true" id="__nuxt">');
const scriptsStart = html.indexOf('<script', nuxtStart);
console.log('Nuxt start:', nuxtStart, 'Scripts start:', scriptsStart);

const nuxtHtml = html.substring(nuxtStart, scriptsStart);
console.log('Nuxt HTML length:', nuxtHtml.length);

// Save nuxtHtml and css for inspection
fs.writeFileSync('Clone-sakerplus/data/heating_lamp/extracted_news_dom.html', nuxtHtml);
fs.writeFileSync('Clone-sakerplus/data/heating_lamp/extracted_news_css.css', cssContent);

// Let's inspect text content of extracted_news_dom
const textOnly = nuxtHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
console.log('Text preview (first 500 chars):');
console.log(textOnly.substring(0, 500));
console.log('Text preview (last 500 chars):');
console.log(textOnly.substring(textOnly.length - 500));

// Search for CTA buttons inside nuxtHtml
const ctaMatches = [...nuxtHtml.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)];
console.log('Found CTAs in DOM count:', ctaMatches.length);
ctaMatches.forEach((m, idx) => {
  const href = m[1];
  const inner = m[2].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');
  console.log(`[CTA ${idx + 1}] href="${href}" text="${inner}"`);
});
