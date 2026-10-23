async function test() {
  const res = await fetch('https://trybronoir.com/collections/bestseller-old');
  const html = await res.text();
  
  // Look for image containing '62,000' or banner text
  const imgMatches = html.match(/https?:\/\/[^"'\s]+\.(?:png|jpg|webp)[^"'\s]*/gi) || [];
  const files = imgMatches.filter(u => u.includes('cdn/shop/files/'));
  const unique = Array.from(new Set(files));
  
  console.log('Unique files in collection page:');
  unique.forEach(u => console.log(u));
}

test().catch(console.error);
