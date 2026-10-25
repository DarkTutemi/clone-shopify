const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';

async function main() {
  const res = await fetch(`https://${SHOP_DOMAIN}/products/livestock-heating-lamp`, {
    headers: { 'Cache-Control': 'no-cache' }
  });
  const html = await res.text();

  // Find media query rule
  const mqMatch = html.match(/@media \(max-width: 767px\)[\s\S]*?\.wf-trust-row\s*\{[\s\S]*?\}/);
  console.log('Mobile media query rule for wf-trust-row:');
  console.log(mqMatch ? mqMatch[0] : 'Not found');
}

main().catch(console.error);
