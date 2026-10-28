async function fetchPdp(handle) {
  const url = `https://tryzavelyn.com/products/${handle}.json`;
  const res = await fetch(url);
  const data = await res.json();
  console.log(`=== ${handle} (.json) ===`);
  console.log('Title:', data.product?.title);
  console.log('Images:', data.product?.images);
}

async function run() {
  await fetchPdp('zavelyn-red-light-eye-care-mask');
  await fetchPdp('zavelyn-led-red-light-face-mask');
  await fetchPdp('zavelyn-vfit-red-light-intimate-wellness-device');
}

run().catch(console.error);
