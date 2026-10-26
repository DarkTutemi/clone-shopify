async function main() {
  const r1 = await fetch('https://tryzavelyn.com/policies/privacy-policy');
  const t1 = await r1.text();
  const m1 = t1.match(/<div class="shopify-policy__body">([\s\S]*?)<\/div>/);
  if (m1) {
    const raw = m1[1];
    const placeholders = raw.match(/\[[^\]]+\]/g);
    console.log('Privacy Policy Placeholders:', placeholders);
  }

  const r2 = await fetch('https://tryzavelyn.com/policies/terms-of-service');
  const t2 = await r2.text();
  const m2 = t2.match(/<div class="shopify-policy__body">([\s\S]*?)<\/div>/);
  if (m2) {
    const raw = m2[1];
    const placeholders = raw.match(/\[[^\]]+\]/g);
    console.log('Terms of Service Placeholders:', placeholders);
  }
}

main().catch(console.error);
