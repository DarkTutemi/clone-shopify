const fs = require('fs');

async function main() {
  const res = await fetch('https://trybronoir.com/');
  const html = await res.text();
  const idx = html.indexOf('They are talking about');
  if (idx !== -1) {
    const chunk = html.slice(idx, idx + 10000);
    fs.writeFileSync('ugc_section_raw.html', chunk);
    console.log('Saved ugc_section_raw.html');
  } else {
    console.log('Could not find section string');
  }
}
main();
