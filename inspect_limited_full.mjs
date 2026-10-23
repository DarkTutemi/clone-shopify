async function inspectLimited() {
  const url = 'https://trybronoir.com/products/bronoir%E2%84%A2-limited-barefoot-shoes';
  const res = await fetch(url);
  const html = await res.text();
  
  // Find all images
  const imgs = [...html.matchAll(/<img[^>]+src="([^">]+)"/g)].map(m => m[1]);
  console.log(`Total images on Limited page: ${imgs.length}`);
  const cdnImgs = [...new Set(imgs.filter(s => s.includes('/cdn/shop/files/')))];
  console.log('CDN files:', cdnImgs.slice(0, 15));

  // Find all h2s
  const h2s = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)].map(m => m[1].replace(/<[^>]+>/g, '').trim()).filter(Boolean);
  console.log('H2s on Limited:', h2s);
}
inspectLimited();
