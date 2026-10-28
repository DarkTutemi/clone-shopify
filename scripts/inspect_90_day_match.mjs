async function findMatch() {
  const res = await fetch('https://tryzavelyn.com/products/zavelyn-sensory-floor-mats');
  const html = await res.text();
  const lines = html.split('\n');
  lines.forEach((l, idx) => {
    if (/90[- ]day/i.test(l)) {
      console.log(`Live Store Line ${idx + 1}: ${l.trim().slice(0, 160)}`);
    }
  });

  const prevRes = await fetch('https://tryzavelyn.com/products/zavelyn-sensory-floor-mats?preview_theme_id=187597717689');
  const prevHtml = await prevRes.text();
  const prevLines = prevHtml.split('\n');
  prevLines.forEach((l, idx) => {
    if (/90[- ]day/i.test(l)) {
      console.log(`Draft Preview Line ${idx + 1}: ${l.trim().slice(0, 160)}`);
    }
  });
}

findMatch().catch(console.error);
