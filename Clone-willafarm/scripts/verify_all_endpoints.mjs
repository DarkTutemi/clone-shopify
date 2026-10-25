async function verifyAllEndpoints() {
  const urls = [
    'https://tryzavelyn.com/',
    'https://tryzavelyn.com/collections/best-sellers',
    'https://tryzavelyn.com/collections/fence-and-farm',
    'https://tryzavelyn.com/collections/power-tools',
    'https://tryzavelyn.com/collections/garden-and-outdoor',
    'https://tryzavelyn.com/collections/home-and-workshop',
    'https://tryzavelyn.com/collections/all-products',
    'https://tryzavelyn.com/products/sakerplus-fence-post-repair-kit',
    'https://tryzavelyn.com/products/sakerplus-livestock-heating-lamp',
    'https://tryzavelyn.com/products/saker-cordless-ultrasonic-cutter-and-grinder',
    'https://tryzavelyn.com/products/the-yeoman-sweep',
    'https://tryzavelyn.com/products/srefalsteam',
    'https://tryzavelyn.com/products/thoson-magtrack'
  ];

  console.log('Running Storefront Verification Sweep...');
  let allPass = true;

  for (const url of urls) {
    try {
      const res = await fetch(url);
      const text = await res.text();
      const hasLiquidError = text.includes('Liquid error');
      const is404 = text.includes('404 Not Found') || res.status === 404;
      const pass = res.status === 200 && text.length > 5000 && !is404 && !hasLiquidError;
      
      console.log(`[${pass ? '✔ PASS' : '✗ FAIL'}] ${url} | Status: ${res.status} | Size: ${text.length} bytes | Liquid Error: ${hasLiquidError}`);
      if (!pass) allPass = false;
    } catch (e) {
      console.log(`[✗ ERROR] ${url} | ${e.message}`);
      allPass = false;
    }
  }

  console.log(`\nOVERALL SWEEP RESULT: ${allPass ? 'ALL 13 ENDPOINTS PASS 100%' : 'SOME ENDPOINTS FAILED'}`);
}
verifyAllEndpoints();
