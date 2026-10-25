import fs from 'fs';

async function inspectHomepageStyling() {
  const res = await fetch('https://www.sakerplus.com', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const html = await res.text();
  
  // Find logo URL
  const logoMatches = [...html.matchAll(/<img[^>]+(?:class|alt|src)=["'][^"']*(?:logo|brand)[^"']*["'][^>]*>/gi)];
  console.log('Logo matches count:', logoMatches.length);
  if (logoMatches.length > 0) {
    console.log('Logo img tag:', logoMatches[0][0]);
  }

  // Find announcement text
  const annMatch = html.match(/class=["'][^"']*(?:announcement|slick-text|ticker|top-bar)[^"']*["'][\s\S]*?<\/div>/i);
  if (annMatch) {
    console.log('Announcement snippet:', annMatch[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 200));
  }

  // Find hero slideshow images
  const heroImages = [...html.matchAll(/<img[^>]+class=["'][^"']*(?:slideshow|hero|banner)[^"']*["'][^>]*>/gi)];
  console.log('Hero images found:', heroImages.length);
  for (const h of heroImages.slice(0, 3)) {
    console.log(' - Hero img:', h[0].slice(0, 200));
  }
}

inspectHomepageStyling();
