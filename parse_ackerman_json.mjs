import fs from 'fs';

const html = fs.readFileSync('ackerman_page.html', 'utf8');

// Find all JSON arrays of images like [{"src":...}]
const imgArrayMatch = html.match(/\[\{"src":"\\\/\\\/img\.staticdj\.com[^\]]+\]/);
if (imgArrayMatch) {
  const unescaped = imgArrayMatch[0].replace(/\\\//g, '/');
  try {
    const list = JSON.parse(unescaped);
    console.log('Parsed images list:', list);
    fs.writeFileSync('ackerman_gallery_images.json', JSON.stringify(list, null, 2));
  } catch (e) {
    console.log('Parse error:', e.message);
  }
}

// Find variants list
const varMatch = html.match(/"variants":\s*(\[\{[\s\S]*?\}\])/);
if (varMatch) {
  try {
    const vars = JSON.parse(varMatch[1]);
    console.log('Parsed variants count:', vars.length);
    console.log(vars.map(v => ({ title: v.title, price: v.price, option1: v.option1, image: v.image })));
  } catch (e) {
    console.log('Variant parse error:', e.message);
  }
}
