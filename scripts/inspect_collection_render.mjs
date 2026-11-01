async function inspect() {
  const url = 'https://tryzavelyn.com/collections/home-improvement?view=showroom&preview_theme_id=187926020281';
  const res = await fetch(url);
  const html = await res.text();
  console.log('Title:', html.match(/<title>([^<]+)<\/title>/)?.[1]);
  
  const mIdx = html.indexOf('id="MainContent"');
  if (mIdx !== -1) {
    console.log('MainContent HTML:');
    console.log(html.substring(mIdx, mIdx + 1500));
  } else {
    console.log('MainContent not found!');
  }
}

inspect().catch(console.error);
