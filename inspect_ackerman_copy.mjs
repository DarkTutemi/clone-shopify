import fs from 'fs';

const html = fs.readFileSync('ackerman_page.html', 'utf8');

// Find sections with product features, description, specifications
const descMatches = html.match(/<div[^>]*class="[^"]*product[^"]*description[^"]*"[^>]*>([\s\S]*?)<\/div>/i)
  || html.match(/<article[^>]*>([\s\S]*?)<\/article>/i)
  || html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);

if (descMatches) {
  console.log('Found main content snippet:', descMatches[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').substring(0, 1000));
}

// Check for all images in img.staticdj.com
const staticDjImages = Array.from(new Set(html.match(/https:\/\/img\.staticdj\.com\/[a-zA-Z0-9_-]+(?:\.[a-zA-Z0-9]+)?/g) || []));
console.log('staticdj images found:', staticDjImages.length);
console.log(staticDjImages);

fs.writeFileSync('ackerman_dj_images.json', JSON.stringify(staticDjImages, null, 2));
