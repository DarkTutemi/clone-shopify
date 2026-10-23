async function test() {
  const res = await fetch('https://trybronoir.com/');
  const html = await res.text();
  const ugcIdx = html.indexOf('They are talking about');
  if (ugcIdx !== -1) {
    const chunk = html.substring(ugcIdx, ugcIdx + 30000);
    const sources = [...chunk.matchAll(/<source\s+src=["']([^"']+)["']/gi)];
    console.log('Video sources found:', sources.length);
    for (const s of sources) {
      console.log('https:' + s[1]);
    }

    const posters = [...chunk.matchAll(/poster=["']([^"']+)["']/gi)];
    console.log('Posters found:', posters.length);
    for (const p of posters) {
      console.log('https:' + p[1]);
    }
  }
}
test().catch(console.error);
