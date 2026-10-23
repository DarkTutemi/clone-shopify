async function test() {
  const res = await fetch('https://trybronoir.com/');
  const html = await res.text();
  const matches = [...html.matchAll(/https:\/\/trybronoir\.com\/cdn\/shop\/files\/[^"'`\s>]+\.(?:jpg|jpeg|png|webp)/gi)];
  const urls = [...new Set(matches.map(m => m[0]))];
  console.log('Found', urls.length, 'unique URLs');
  for (const u of urls) {
    if (u.toLowerCase().includes('skin') || u.toLowerCase().includes('copper') || u.toLowerCase().includes('barefoot') || u.toLowerCase().includes('1_') || u.toLowerCase().includes('frame')) {
      const chk = await fetch(u, { method: 'HEAD' });
      if (chk.status === 200) {
        console.log('200 OK:', u);
      }
    }
  }
}
test().catch(console.error);
