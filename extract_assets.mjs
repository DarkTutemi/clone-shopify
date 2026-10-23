import fs from 'fs';
import { execSync } from 'child_process';

try {
  const cmd = `curl.exe -s -L -A "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36" https://trybronoir.com/`;
  const html = execSync(cmd).toString('utf8');
  
  // Extract images
  const regex = /https:\/\/trybronoir\.com\/cdn\/shop\/files\/[^"'\\s\?]+/g;
  const matches = [...new Set(html.match(regex) || [])];
  
  // Also look for cdn.shopify.com/s/files
  const regex2 = /\/\/trybronoir\.com\/cdn\/shop\/files\/[^"'\\s\?]+/g;
  const matches2 = (html.match(regex2) || []).map(u => 'https:' + u);
  
  const allImages = [...new Set([...matches, ...matches2])];
  console.log(`Found ${allImages.length} images on Trybronoir!`);
  fs.writeFileSync('Clone-trybronoir/data/original_images.json', JSON.stringify(allImages, null, 2));
  
  allImages.forEach(img => console.log(img));
} catch(e) {
  console.error('Error:', e.message);
}
