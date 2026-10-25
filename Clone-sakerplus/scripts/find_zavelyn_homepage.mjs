async function check() {
  const res = await fetch('https://dsdujr-vn.myshopify.com/');
  const html = await res.text();
  const lines = html.split('\n');
  lines.forEach((l, i) => {
    if (l.toLowerCase().includes('zavelyn')) {
      console.log(`Line ${i + 1}: ${l.trim().slice(0, 200)}`);
    }
  });
}
check();
