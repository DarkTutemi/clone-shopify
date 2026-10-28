import fs from 'fs';

const html = fs.readFileSync('joylux_page.html', 'utf-8');
console.log('Size:', html.length);

const matches = html.match(/<h[234][^>]*>([^<]+)<\/h[234]>/gi) || [];
console.log('Headings:');
matches.forEach(m => console.log(' -', m.replace(/<[^>]+>/g, '').trim()));

const accordionMatches = html.match(/class=["'][^"']*(?:accordion|faq|collapse|question)[^"']*["']/gi) || [];
console.log('Accordion matches count:', accordionMatches.length);
