async function probe() {
  const res = await fetch('https://navage.com/products/navage-advanced-nose-cleaner');
  const html = await res.text();
  console.log('Has yotpo:', html.includes('yotpo'));
  console.log('Has judgeme:', html.includes('jdgm'));
  console.log('Has stamped:', html.includes('stamped'));
  console.log('Has okendo:', html.includes('okendo'));
  console.log('Has bazaarvoice:', html.includes('bazaarvoice'));

  const scripts = [...html.matchAll(/src=["']([^"']+)["']/g)]
    .map(m => m[1])
    .filter(s => /review|rating|yotpo|okendo|judge|stamped|bazaar/i.test(s));
  console.log('Review scripts:', scripts);

  const reviewClasses = [...html.matchAll(/class=["']([^"']*review[^"']*)["']/gi)]
    .map(m => m[1])
    .slice(0, 10);
  console.log('Review classes sample:', reviewClasses);
}

probe().catch(console.error);
