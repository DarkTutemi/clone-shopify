import fs from 'fs';

async function inspectHomepage() {
  const res = await fetch('https://www.sakerplus.com', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const html = await res.text();
  
  // Find all sections
  const sectionMatches = [...html.matchAll(/id=["']shopify-section-([^"']+)["']/gi)];
  const sections = sectionMatches.map(m => m[1]);
  console.log('Homepage Shopify sections count:', sections.length);
  console.log('Sections list:');
  sections.forEach((s, idx) => console.log(` ${idx + 1}. ${s}`));

  // Extract navigation menu items
  const menuMatches = [...html.matchAll(/<a[^>]+href=["']\/collections\/([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)];
  const menuItems = menuMatches.map(m => ({
    handle: m[1],
    text: m[2].replace(/<[^>]+>/g, '').trim()
  })).filter(m => m.text && !m.text.includes('\n') && m.text.length < 40);
  
  const uniqueMenu = [];
  const seenMenu = new Set();
  for (const m of menuItems) {
    if (!seenMenu.has(m.text)) {
      seenMenu.add(m.text);
      uniqueMenu.push(m);
    }
  }
  console.log('\nMain Navigation items count:', uniqueMenu.length);
  console.log('Main Navigation preview:', uniqueMenu.slice(0, 15));
}

inspectHomepage();
