import fs from 'fs';
import path from 'path';

const dataDir = 'h:/Shopify-Clone/Clone-earthlyderm/data';
if (fs.existsSync(dataDir)) {
  const files = fs.readdirSync(dataDir);
  console.log('Files in data:', files);
  for (const f of files) {
    if (f.includes('review') || f.includes('slider')) {
      console.log('--- File:', f);
      const text = fs.readFileSync(path.join(dataDir, f), 'utf8');
      const matches = text.match(/https?:\/\/[^\s"'<>]+|\/\/earthlyderm\.com[^\s"'<>]+/g) || [];
      const imgMatches = matches.filter(m => m.includes('.png') || m.includes('.jpg') || m.includes('.jpeg') || m.includes('.webp') || m.includes('Before'));
      console.log('Images:', Array.from(new Set(imgMatches)));
    }
  }
} else {
  console.log('No data dir found');
}
