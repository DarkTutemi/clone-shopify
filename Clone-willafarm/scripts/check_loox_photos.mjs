async function crawlLooxPhotos() {
  for (let page = 1; page <= 5; page++) {
    const res = await fetch(`https://loox.io/widget/7GiGt8f0rB/reviews?limit=100&page=${page}&language=en`);
    const html = await res.text();
    const imgs = [...html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*alt=["']([^"']*)["']/gi)];
    console.log(`Page ${page} photos:`, imgs.length);
    imgs.slice(0, 10).forEach(m => console.log(`  ${m[2]} => ${m[1]}`));
  }
}
crawlLooxPhotos();
