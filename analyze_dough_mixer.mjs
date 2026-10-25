import fs from 'fs';


async function analyzePage() {
  const html = fs.readFileSync('target_dough_mixer.html', 'utf-8');
  console.log('HTML read, length:', html.length);

  // Search for price, variants, shopify product json or funnel checkout
  const productJsonMatch = html.match(/var meta = (\{.*?\});/);
  if (productJsonMatch) {
    console.log('Found meta JSON');
  }

  // Look for script tags with product or variant data
  const scriptRegex = /<script[^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  let scriptsCount = 0;
  while ((match = scriptRegex.exec(html)) !== null) {
    scriptsCount++;
    const s = match[1];
    if (s.includes('variants') && (s.includes('price') || s.includes('sku'))) {
      console.log('Script with variants found! Length:', s.length);
      fs.writeFileSync('target_script_variants.js', s);
    }
  }

  // Find all images
  const imgRegex = /<img[^>]+src=["']([^"']+)["']/gi;
  const images = new Set();
  while ((match = imgRegex.exec(html)) !== null) {
    images.add(match[1]);
  }
  console.log('Total unique images found:', images.size);
  fs.writeFileSync('target_images.json', JSON.stringify([...images], null, 2));

  // Find buy section / product section / cta
  const ctaLinks = [...html.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi)].map(m => ({
    href: m[1],
    text: m[2].replace(/<[^>]+>/g, '').trim()
  })).filter(a => a.text.length > 0 && a.text.length < 50);
  console.log('Sample CTAs / Links:', ctaLinks.slice(0, 15));

  // Find headers
  const headers = [...html.matchAll(/<h[1-4][^>]*>(.*?)<\/h[1-4]>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim());
  console.log('Headers count:', headers.length);
  console.log('Sample headers:', headers.slice(0, 10));
}

analyzePage().catch(console.error);
