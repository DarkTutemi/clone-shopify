import fs from 'fs';

const html = fs.readFileSync('Clone-sakerplus/data/curl_ultrasonic_funnel.html', 'utf-8');
const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
if (bodyMatch) {
  console.log('Body length:', bodyMatch[1].length);
  const nuxtMatch = bodyMatch[1].match(/<div id="__layout"[\s\S]*?<\/div>\s*<\/div>/i);
  console.log('Layout match length:', nuxtMatch ? nuxtMatch[0].length : 'Not found');
  fs.writeFileSync('Clone-sakerplus/data/ultrasonic_body.html', bodyMatch[1]);
}
