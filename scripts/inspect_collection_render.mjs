async function inspect() {
  const url = 'https://tryzavelyn.com/collections/deals-of-the-day?view=showroom&preview_theme_id=187926020281';
  const res = await fetch(url);
  const html = await res.text();
  console.log('Title:', html.match(/<title>([^<]+)<\/title>/)?.[1]);
  
  const mIdx = html.indexOf('sakerplus®-1500w-flame-effect-oscillating-space-heater');
  if (mIdx !== -1) {
    console.log('Found heater at:', mIdx);
    console.log(html.substring(mIdx - 200, mIdx + 800));
  } else {
    console.log('Heater handle not found in HTML');
  }
}

inspect().catch(console.error);
