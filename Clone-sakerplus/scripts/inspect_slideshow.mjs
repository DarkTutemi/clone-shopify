import fs from 'fs';

async function inspectSlideshow() {
  const res = await fetch('https://www.sakerplus.com', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const html = await res.text();

  const idx = html.indexOf('slideshow_CV9g7g');
  if (idx !== -1) {
    console.log('Slideshow section HTML snippet:');
    const snippet = html.slice(idx, idx + 2500);
    console.log(snippet);

    const images = [...snippet.matchAll(/src=["']([^"']+)["']/gi)].map(m => m[1]);
    console.log('Slideshow image sources:', images);
  } else {
    console.log('slideshow_CV9g7g not found directly');
  }
}

inspectSlideshow();
