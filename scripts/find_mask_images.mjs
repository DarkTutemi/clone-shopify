import fs from 'fs';
import path from 'path';

function findImages(dir, results = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      findImages(fullPath, results);
    } else if (/\.(jpg|jpeg|png|webp|avif)$/i.test(entry.name)) {
      if (/mask|eye|face|light|led/i.test(entry.name)) {
        results.push({ name: entry.name, path: fullPath, size: fs.statSync(fullPath).size });
      }
    }
  }
  return results;
}

const found = findImages('.');
console.log(`Found ${found.length} mask/eye/face related images:`);
found.forEach(f => console.log(`- ${f.path} (${f.size} bytes)`));
