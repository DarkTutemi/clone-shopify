async function findBanner() {
  const res = await fetch('https://trybronoir.com/collections/bestseller-old');
  const html = await res.text();
  
  // Search for images in collection header
  const regex = /<img[^>]+src="([^">]+)"/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const src = match[1];
    if (src.includes('files') && !src.includes('logo') && !src.includes('icon') && !src.includes('currency')) {
      console.log('Found candidate img:', src);
    }
  }
}

findBanner().catch(console.error);
