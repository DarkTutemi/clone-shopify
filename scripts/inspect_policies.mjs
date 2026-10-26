async function main() {
  const r = await fetch('https://tryzavelyn.com/policies/shipping-policy');
  const t = await r.text();
  const m = t.match(/<div class="shopify-policy__body">([\s\S]*?)<\/div>/);
  if (m) console.log(m[1].substring(0, 800));

  const r2 = await fetch('https://tryzavelyn.com/policies/refund-policy');
  const t2 = await r2.text();
  const m2 = t2.match(/<div class="shopify-policy__body">([\s\S]*?)<\/div>/);
  if (m2) console.log('\nREFUND POLICY:\n' + m2[1].substring(0, 800));
}

main().catch(console.error);
