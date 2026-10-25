async function main() {
  const res = await fetch('https://tryzavelyn.com/products/sakerplus-livestock-heating-lamp', {
    headers: { 'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1' }
  });
  console.log('Status:', res.status);
  const text = await res.text();
  console.log('Length:', text.length);
  const titleMatch = text.match(/<title>([^<]+)<\/title>/i);
  console.log('Title:', titleMatch ? titleMatch[1] : 'No title');
  const hasFunnel = text.includes('saker-heating-lamp-funnel') || text.includes('heating_lamp_funnel');
  console.log('Has heating lamp funnel:', hasFunnel);
  const sections = [...text.matchAll(/id=['"]shopify-section-([^'"]+)['"]/g)].map(m => m[1]);
  console.log('Live sections rendered:', sections);
}
main().catch(console.error);
