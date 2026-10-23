async function test() {
  const res = await fetch('https://trybronoir.com/');
  const html = await res.text();
  const matches = [...html.matchAll(/src=["'](\/\/trybronoir\.com\/cdn\/shop\/files\/[^"']+)["']/gi)];
  for (const m of matches) {
    const u = 'https:' + m[1];
    if (u.includes('warranty') || u.includes('dollar') || u.includes('money') || u.includes('footprint') || u.includes('truck') || u.includes('streamline') || u.includes('lucide')) {
      const chk = await fetch(u, { method: 'HEAD' });
      console.log(chk.status, u);
    }
  }
}
test().catch(console.error);
