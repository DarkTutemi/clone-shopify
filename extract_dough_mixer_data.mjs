import fs from 'fs';

async function extractAllData() {
  const html1 = fs.existsSync('target_dough_mixer.html') ? fs.readFileSync('target_dough_mixer.html', 'utf-8') : '';
  const html2 = fs.existsSync('target_dough_mixer_step2.html') ? fs.readFileSync('target_dough_mixer_step2.html', 'utf-8') : '';
  const html3 = fs.existsSync('target_dough_mixer_order.html') ? fs.readFileSync('target_dough_mixer_order.html', 'utf-8') : '';

  const allHtml = [html1, html2, html3].join('\n');

  // Find all image URLs
  const imgRegex = /https?:\/\/[^\s"'\)]+?\.(?:png|jpg|jpeg|webp|gif)/gi;
  const matches = allHtml.match(imgRegex) || [];
  const uniqueImages = [...new Set(matches)].filter(u => {
    return !u.includes('analytics') && !u.includes('facebook') && !u.includes('google') && !u.includes('pixel') && !u.includes('clarity');
  });

  console.log(`Found ${uniqueImages.length} relevant images.`);
  fs.writeFileSync('dough_mixer_all_images.json', JSON.stringify(uniqueImages, null, 2));

  // Extract article paragraphs from step 1 (advertorial)
  const pRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  const pList = [];
  let m;
  while ((m = pRegex.exec(html1)) !== null) {
    const text = m[1].replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
    if (text.length > 20) pList.push(text);
  }
  console.log(`Found ${pList.length} advertorial paragraphs.`);
  fs.writeFileSync('dough_mixer_advertorial_paragraphs.json', JSON.stringify(pList, null, 2));

  // Extract review cards from order / step 2
  const reviews = [];
  const reviewMatchRegex = /class="[^"]*review[^"]*"[^>]*>([\s\S]*?)<\/div>/gi;
  // Or extract texts containing "Verified Buyer"
  const lines = allHtml.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('Verified Buyer')) {
      const chunk = lines.slice(Math.max(0, i - 10), Math.min(lines.length, i + 25)).join('\n');
      reviews.push(chunk.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
    }
  }
  console.log(`Found ${reviews.length} review mentions.`);
  fs.writeFileSync('dough_mixer_reviews.json', JSON.stringify(reviews, null, 2));
}

extractAllData().catch(console.error);
