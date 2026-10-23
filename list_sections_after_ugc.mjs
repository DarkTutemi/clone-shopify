async function test() {
  const res = await fetch('https://trybronoir.com/');
  const html = await res.text();
  const ugcPos = html.indexOf('They are talking about');
  console.log('UGC pos:', ugcPos);
  
  // Find all shopify-section tags after ugcPos
  const re = /<div\s+id=["'](shopify-section-[^"']+)["']/g;
  re.lastIndex = ugcPos;
  let m;
  while ((m = re.exec(html)) !== null) {
    console.log('Section found after UGC:', m[1]);
  }
}
test().catch(console.error);
