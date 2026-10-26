async function main() {
  const res = await fetch('https://tryzavelyn.com/');
  const html = await res.text();
  
  // Extract all zv-prod-card blocks
  const cardRegex = /<div class="zv-prod-card"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g;
  let match;
  let count = 0;
  
  const matches = html.match(/<div class="zv-prod-card"[\s\S]*?<\/div>\s*<\/div>/g) || [];
  console.log(`Found ${matches.length} matches with simple regex`);

  // Let's regex search for images inside zv-prod-media
  const mediaRegex = /<a href="([^"]*)" class="zv-prod-media">([\s\S]*?)<\/a>/g;
  while ((match = mediaRegex.exec(html)) !== null) {
    count++;
    const url = match[1];
    const inner = match[2];
    const imgSrcs = [];
    const srcRegex = /src="([^"]*)"/g;
    let sm;
    while ((sm = srcRegex.exec(inner)) !== null) {
      imgSrcs.push(sm[1]);
    }
    console.log(`Card ${count}: URL = ${url}`);
    console.log(`  Images:`, imgSrcs);
  }
}

main().catch(console.error);
