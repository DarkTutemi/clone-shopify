import fs from 'fs';
import path from 'path';

function findLargeFiles(dir, thresholdMB = 50) {
  let largeFiles = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      largeFiles = largeFiles.concat(findLargeFiles(fullPath, thresholdMB));
    } else {
      const stats = fs.statSync(fullPath);
      const sizeMB = stats.size / (1024 * 1024);
      if (sizeMB > thresholdMB) {
        largeFiles.push({ path: fullPath, sizeMB: sizeMB.toFixed(2) });
      }
    }
  }
  return largeFiles;
}

const large = findLargeFiles('backups', 50);
console.log('Files > 50MB:', large);
