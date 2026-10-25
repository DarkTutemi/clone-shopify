import fs from 'fs';

function parseLanding() {
  const html = fs.readFileSync('cheese_grater_raw.html', 'utf8');
  console.log('Landing HTML size:', html.length);

  // Find all images and GIFs
  const imgUrls = [...html.matchAll(/https:\/\/cdn\.myshopage\.com\/[a-f0-9-/_]+(\.jpg|\.png|\.gif|\.webp)?/gi)].map(m => m[0]);
  const uniqueUrls = [...new Set(imgUrls)];
  console.log('Total unique myshopage images in landing:', uniqueUrls.length);

  const gifs = uniqueUrls.filter(u => u.includes('gif') || u.includes('.gif'));
  console.log('GIFs found:', gifs);

  // Extract headings
  const hMatches = [...html.matchAll(/<(h[1-4]|div)[^>]*class="[^"]*(title|heading)[^"]*"[^>]*>(.*?)<\/\1>/gis)]
    .map(m => m[3].replace(/<[^>]+>/g, '').trim())
    .filter(t => t.length > 5 && t.length < 150);
  console.log('Headings found in landing:', [...new Set(hMatches)].slice(0, 20));

  // Write all unique image URLs to a file
  fs.writeFileSync('cheese_grater_image_urls.json', JSON.stringify(uniqueUrls, null, 2), 'utf8');
}

parseLanding();
