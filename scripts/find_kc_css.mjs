import fs from 'fs';

async function find() {
  const res = await fetch('https://kittycollective.co/products/wingmate');
  const html = await res.text();
  console.log('HTML length:', html.length, 'has kc-offers:', html.includes('kc-offers'));
  
  const linkMatches = [...html.matchAll(/href="([^"]+\.css[^"]*)"/g)].map(m => m[1]);
  console.log('Found CSS links:', linkMatches.length);
  for (const l of linkMatches) {
    const full = l.startsWith('//') ? 'https:' + l : (l.startsWith('http') ? l : 'https://kittycollective.co' + l);
    try {
      const cRes = await fetch(full);
      const cText = await cRes.text();
      if (cText.includes('kc-offer') || cText.includes('kc-claim-button')) {
        console.log('FOUND in CSS file:', full);
        fs.writeFileSync('scripts/kitty_bundle_styles.css', cText);
      }
    } catch(e) {}
  }
  
  const styles = [...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m => m[1]);
  for (let i = 0; i < styles.length; i++) {
    if (styles[i].includes('kc-offer') || styles[i].includes('kc-claim-button')) {
      console.log('FOUND in style tag ' + i);
      fs.writeFileSync('scripts/kitty_bundle_style_tag.css', styles[i]);
    }
  }
}
find();
