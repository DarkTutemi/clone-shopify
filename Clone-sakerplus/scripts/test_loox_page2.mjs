async function testPage2() {
  const r = await fetch('https://loox.io/widget/7GiGt8f0rB/reviews?limit=50&page=2&language=en', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  console.log('Status:', r.status);
  const text = await r.text();
  console.log('Length:', text.length);
  const match = text.match(/data-url=["']([^"']+)["']/);
  console.log('Next data-url:', match ? match[1] : null);
}

testPage2();
