import fs from 'fs';

async function checkApiCall() {
  const url = 'https://trybronoir.com/products/bronoir%E2%84%A2-limited-barefoot-shoes';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  const text = await res.text();

  // Find occurrences of reviews_for_widget
  let idx = 0;
  while ((idx = text.indexOf('reviews_for_widget', idx)) !== -1) {
    console.log('Snippet around reviews_for_widget:');
    console.log(text.slice(Math.max(0, idx - 100), idx + 200));
    console.log('---');
    idx += 18;
  }

  // Look for judge.me script settings
  const jdgmSettings = text.match(/jdgm\.settings\s*=\s*\{[^}]+\}/i) || text.match(/jdgmSettings\s*=\s*\{[^}]+\}/i);
  console.log('Settings:', jdgmSettings ? jdgmSettings[0] : 'None');

  // Look for jdgm object
  const jdgmObj = text.match(/window\.jdgm\s*=\s*\{[^}]+\}/i);
  console.log('window.jdgm:', jdgmObj ? jdgmObj[0] : 'None');

  // Look for jdgm script tags
  const scripts = text.match(/<script[^>]*judge\.me[^>]*>[\s\S]*?<\/script>/gi);
  console.log('JDGM script tags count:', scripts ? scripts.length : 0);
  if (scripts) {
    scripts.forEach((s, i) => console.log(`Script ${i}:`, s.slice(0, 300)));
  }
}

checkApiCall();
