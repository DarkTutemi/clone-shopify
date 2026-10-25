async function testSuffix() {
  const base = 'https://cdn.myshopage.com/79d22bcb-8381-4891-4c57-d5c616076f00';
  for (const suffix of ['', '/', '/public', '/w800.jpg', '/w1000.jpg', '/w600.png', '/w400.jpg']) {
    const url = base + suffix;
    const res = await fetch(url, {
      headers: {
        'Referer': 'https://m.sakerplus.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    console.log(suffix || '(empty)', '->', res.status, res.headers.get('content-type'), res.headers.get('content-length'));
  }
}
testSuffix();
