import fs from 'fs';

const html = fs.readFileSync('Clone-sakerplus/data/heating_lamp/curl_news.html', 'utf8');

// Find body tag
const bodyOpen = html.indexOf('<body');
const bodyClose = html.lastIndexOf('</body>');
console.log('Body indices:', bodyOpen, bodyClose);

const bodyContent = html.substring(bodyOpen, bodyClose + 7);
console.log('Body length:', bodyContent.length);

// Let's find first 1000 chars of body
console.log('--- Body Start ---');
console.log(bodyContent.substring(0, 1000));
console.log('--- Body End ---');
console.log(bodyContent.substring(bodyContent.length - 1000));

// Check what headings or text exist
const headings = bodyContent.match(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/gi) || [];
console.log('Headings count:', headings.length);
headings.forEach(h => console.log('H:', h.replace(/<[^>]+>/g, '').trim()));
