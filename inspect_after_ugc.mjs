async function test() {
  const res = await fetch('https://trybronoir.com/');
  const html = await res.text();
  const ugcIdx = html.indexOf('They are talking about');
  if (ugcIdx !== -1) {
    const afterUgc = html.substring(ugcIdx + 20000);
    // Find all sections or major headings after UGC
    const headings = [...afterUgc.matchAll(/<h[1-4][^>]*>([\s\S]*?)<\/h[1-4]>/gi)];
    console.log('Headings after UGC:');
    for (const h of headings) {
      const text = h[1].replace(/<[^>]+>/g, '').trim();
      if (text) console.log('-', text);
    }

    const sections = [...afterUgc.matchAll(/id=["'](shopify-section-[^"']+)["']/gi)];
    console.log('\nSections after UGC:');
    for (const s of sections) {
      console.log('*', s[1]);
    }
  }
}
test().catch(console.error);
