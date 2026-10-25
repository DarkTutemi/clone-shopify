import fs from 'fs';

async function check() {
  const res = await fetch('https://tryzavelyn.com/pages/sinusitis-sufferer');
  const html = await res.text();
  const linkMatches = [...html.matchAll(/<link[^>]+stylesheet[^>]+>/gi)].map(m => m[0]);
  console.log('Stylesheet links in rendered page:', linkMatches);
  
  const cssUrlMatch = html.match(/href=["']([^"']*navage-sinusitis\.css[^"']*)["']/i);
  if (cssUrlMatch) {
    console.log('Found CSS URL:', cssUrlMatch[1]);
    const cssRes = await fetch(cssUrlMatch[1].startsWith('//') ? 'https:' + cssUrlMatch[1] : cssUrlMatch[1]);
    const cssText = await cssRes.text();
    console.log('CSS fetch status:', cssRes.status, 'length:', cssText.length);
  } else {
    console.log('NO navage-sinusitis.css LINK FOUND!');
  }
}
check();
