import fs from 'fs';

function extractUrls(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const text = fs.readFileSync(filePath, 'utf8');
  const regex = /https?:\/\/[^\s"'<>]+\.(?:jpg|jpeg|png|webp)/gi;
  const matches = text.match(regex) || [];
  return matches;
}

const f1 = extractUrls('Clone-sakerplus/data/heating_lamp/landing.html');
const f2 = extractUrls('Clone-sakerplus/data/heating_lamp/extracted_landing_dom.html');
const all = [...new Set([...f1, ...f2])];
console.log('Total unique images in original landing:', all.length);
all.forEach((url, i) => console.log(`${i}: ${url}`));
