async function test() {
  const res = await fetch('https://trybronoir.com/');
  const html = await res.text();
  const ugcIdx = html.indexOf('They are talking about');
  if (ugcIdx !== -1) {
    const chunk = html.substring(ugcIdx, ugcIdx + 15000);
    console.log('--- UGC CHUNK ---');
    console.log(chunk.substring(0, 3000));
    
    // Look for mp4 or video links
    const vids = [...chunk.matchAll(/https:\/\/[^"'`\s>]+\.(?:mp4|webm|m3u8)/gi)];
    console.log('Found video links in UGC:', vids.map(v => v[0]));
  }
}
test().catch(console.error);
