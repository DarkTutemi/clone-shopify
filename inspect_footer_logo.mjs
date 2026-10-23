async function test() {
  const res = await fetch('https://trybronoir.com/');
  const html = await res.text();
  const fIdx = html.indexOf('<footer');
  const fChunk = html.substring(fIdx, fIdx + 4000);
  const m = fChunk.match(/src="([^"]+)"/);
  if (m) {
    const url = m[1].startsWith('//') ? 'https:' + m[1] : m[1];
    console.log('Footer logo src:', url);
    const chk = await fetch(url, { method: 'HEAD' });
    console.log('Status:', chk.status);
  }
}
test().catch(console.error);
