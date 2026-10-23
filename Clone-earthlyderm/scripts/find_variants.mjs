import fs from 'fs';

const html = fs.readFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/shopify-section-template--19526978371718__main.html', 'utf8');

const regexes = [
  /class="[^"]*bundle[^"]*"/gi,
  /class="[^"]*selector[^"]*"/gi,
  /data-ot-variants/gi,
  /one_time\.js/gi
];

for (const r of regexes) {
  const m = html.match(r);
  console.log(r, 'found:', m ? m.length : 0);
}

// Search for variant IDs from line 18:
// 43082567254150, 43082567221382, 43082567188614
for (const vid of ['43082567254150', '43082567221382', '43082567188614']) {
  let pos = 0;
  while ((pos = html.indexOf(vid, pos)) !== -1) {
    console.log(`Found ${vid} at ${pos}`);
    console.log(html.substring(Math.max(0, pos - 150), Math.min(html.length, pos + 250)));
    console.log('==============================');
    pos += vid.length;
  }
}
