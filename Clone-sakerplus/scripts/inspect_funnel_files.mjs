import fs from 'fs';

['curl_news.html', 'landing.html', 'order.html'].forEach(f => {
  const p = 'Clone-sakerplus/data/heating_lamp/' + f;
  if (fs.existsSync(p)) {
    const s = fs.statSync(p);
    const content = fs.readFileSync(p, 'utf8');
    const title = content.match(/<title>([^<]+)<\/title>/i)?.[1];
    const h1 = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, '').trim();
    console.log(`\n=== ${f} (${s.size} bytes) ===`);
    console.log('Title:', title);
    console.log('H1:', h1);
    
    // Check links
    const hrefs = content.match(/href=["']([^"']+)["']/gi) || [];
    const uniqueHrefs = [...new Set(hrefs.map(h => h.replace(/href=["']|["']/gi, '')))];
    const ctas = uniqueHrefs.filter(h => h.includes('funnel') || h.includes('order') || h.includes('landing') || h.includes('cart'));
    console.log('CTAs:', ctas);
  }
});
