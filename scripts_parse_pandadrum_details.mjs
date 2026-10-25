import fs from 'fs';

for (const name of ['pro', 'plus', 'mini']) {
  const html = fs.readFileSync(`Clone-pandadrum/${name}.html`, 'utf8');
  console.log(`\n================= ${name.toUpperCase()} =================`);

  // Search for "What you'll get"
  const getIdx = html.indexOf("What you'll get");
  if (getIdx !== -1) {
    console.log("WHAT YOU GET:\n", html.slice(getIdx, getIdx + 1000).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
  }

  // Search for "Specifications" or "Specs"
  const specIdx = html.indexOf("Specification");
  if (specIdx !== -1) {
    console.log("SPECIFICATIONS:\n", html.slice(specIdx, specIdx + 800).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
  }

  // Search for "Frequency" or "Scale" or "Tone"
  const scaleMatches = [...html.matchAll(/(?:Frequency|Scale|Tuning|Material|Diameter|Weight)[^<]{0,200}/gi)];
  if (scaleMatches.length > 0) {
    console.log("SCALE / TUNING DETAILS:");
    scaleMatches.slice(0, 6).forEach(m => console.log(' - ' + m[0].replace(/\s+/g, ' ').trim()));
  }

  // Search for FAQ
  const faqIdx = html.indexOf("FAQ");
  if (faqIdx !== -1) {
    console.log("FAQ CHUNK:\n", html.slice(faqIdx, faqIdx + 1200).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
  }
}
