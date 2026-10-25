import fs from 'fs';

function extractSections(htmlPath, name) {
  console.log(`\n==================================================`);
  console.log(`HTML AUDIT: ${name} (${htmlPath})`);
  console.log(`==================================================`);
  if (!fs.existsSync(htmlPath)) {
    console.log('File does not exist!');
    return;
  }
  const html = fs.readFileSync(htmlPath, 'utf8');
  console.log(`HTML length: ${html.length} chars`);

  // Extract all H1, H2, H3
  const headings = [];
  const hRegex = /<(h[1-3])[^>]*>([\s\S]*?)<\/\1>/gi;
  let m;
  while ((m = hRegex.exec(html)) !== null) {
    const text = m[2].replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');
    if (text.length > 0 && text.length < 150) {
      headings.push(`${m[1].toUpperCase()}: ${text}`);
    }
  }
  console.log(`Found ${headings.length} headings:`);
  headings.slice(0, 15).forEach(h => console.log('  ' + h));

  // Extract FAQ questions
  const faqs = [];
  const faqRegex = /(?:<summary[^>]*>|<h[2-4][^>]*class="[^"]*faq[^"]*"[^>]*>)([\s\S]*?)(?:<\/summary>|<\/h[2-4]>)/gi;
  while ((m = faqRegex.exec(html)) !== null) {
    const q = m[1].replace(/<[^>]+>/g, '').trim();
    if (q.length > 5) faqs.push(q);
  }
  console.log(`Found ${faqs.length} FAQs:`, faqs.slice(0, 6));

  // Check for videos
  const videos = html.match(/<video[^>]*src=[\"']([^\"']+)[\"']/gi) || [];
  const mp4s = html.match(/https:\/\/[^\"\'\s\)]+\.mp4/gi) || [];
  console.log(`Videos found:`, [...new Set(mp4s)]);

  // Check for reviews / testimonials
  const reviewMatches = html.match(/(?:verified|review|testimonial|stars)[\s\S]{1,100}/gi) || [];
  console.log(`Review indicators found: ${reviewMatches.length}`);
}

extractSections('Clone-thoson/data/product.html', 'Thoson MagTrack');
extractSections('Clone-srefalsteam/data/product.html', 'Srefal Steam Pro');
extractSections('Clone-yeoman/data/the-yeoman-sweep.html', 'Yeoman Sweep');
