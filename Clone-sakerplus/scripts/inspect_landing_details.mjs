import fs from 'fs';

const html = fs.readFileSync('Clone-sakerplus/data/heating_lamp/landing.html', 'utf8');
console.log('Landing HTML size:', html.length);

const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
console.log('Title:', titleMatch ? titleMatch[1] : 'None');

const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
console.log('CSS style length:', styleMatch ? styleMatch[1].length : 0);

const nuxtStart = html.indexOf('<div data-server-rendered="true" id="__nuxt">');
const scriptsStart = html.indexOf('<script', nuxtStart);
console.log('Nuxt start:', nuxtStart, 'Scripts start:', scriptsStart);

if (nuxtStart !== -1 && scriptsStart !== -1) {
  const nuxtHtml = html.substring(nuxtStart, scriptsStart);
  console.log('Nuxt HTML length:', nuxtHtml.length);
  fs.writeFileSync('Clone-sakerplus/data/heating_lamp/extracted_landing_dom.html', nuxtHtml);
  
  const textOnly = nuxtHtml.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  console.log('Text preview (first 500 chars):');
  console.log(textOnly.substring(0, 500));
}

// Find links/buttons
const ctaMatches = [...html.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)];
console.log('Found CTAs count:', ctaMatches.length);
ctaMatches.slice(0, 10).forEach((m, idx) => {
  const href = m[1];
  const inner = m[2].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');
  console.log(`[CTA ${idx + 1}] href="${href}" text="${inner.substring(0, 80)}"`);
});
