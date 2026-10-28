async function readRefundPolicy() {
  const res = await fetch('https://tryzavelyn.com/policies/refund-policy');
  const html = await res.text();
  const m = html.match(/<div class="shopify-policy__body">([\s\S]*?)<\/div>/i);
  if (m) {
    const text = m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    console.log('Policy snippet:', text.slice(0, 400));
  } else {
    console.log('Could not find shopify-policy__body');
  }
}

readRefundPolicy().catch(console.error);
