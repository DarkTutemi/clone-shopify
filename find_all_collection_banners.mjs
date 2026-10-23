async function getBanner(handle) {
  try {
    const res = await fetch(`https://trybronoir.com/collections/${handle}`);
    const html = await res.text();
    const imgs = html.match(/(\/\/[^\s\"\'\<\>]+\.(jpg|png|webp))/gi) || [];
    const bannerImgs = imgs.filter(url => url.includes('banner') || url.includes('usp') || url.includes('hero') || url.includes('slide'));
    console.log(`[${handle}] Banners found:`, [...new Set(bannerImgs)].slice(0, 5));
  } catch (err) {
    console.error(handle, err.message);
  }
}

async function run() {
  await getBanner('barefoot-shoes-for-summer');
  await getBanner('winter-collection');
  await getBanner('socks-and-insoles');
  await getBanner('barefoot-shoes-bogo-volume');
  await getBanner('bestsellers');
}

run();
