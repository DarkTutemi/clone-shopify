import fs from 'fs';

const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';

async function getAccessToken() {
  const tokenRes = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await tokenRes.json();
  return data.access_token;
}

const targetHandles = [
  'zavelyn-vfit-red-light-intimate-wellness-device',
  'zavelyn-sculptcomfort-wirefree-breast-shapewear-bra',
  'zavelyn-supertots-fresh-food-fruit-feeder-pacifier',
  'zavelyn-airclear-plugin-negative-ion-air-purifier',
  'zavelyn-flawlessblend-color-changing-foundation-stick',
  'zavelyn-pureflow-wireless-stainless-steel-pet-water-fountain',
  'zavelyn-gravityglider-indestructible-stunt-rc-jet',
  'zavelyn-megalifters-heavy-duty-alloy-rc-construction-fleet',
  'zavelyn-botanaroots-organic-batana-hair-growth-oil',
  'zavelyn-thermoglove-smart-thermostatic-heated-fingerless-gloves'
];

async function main() {
  const token = await getAccessToken();
  console.log('Fetching all 10 products from Shopify API...\n');

  const report = [];

  for (let i = 0; i < targetHandles.length; i++) {
    const handle = targetHandles[i];
    const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-01/products.json?handle=${handle}`, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    const data = await res.json();
    const p = data.products?.[0];

    if (!p) {
      console.error(`❌ Product NOT found: ${handle}`);
      continue;
    }

    const allContinue = p.variants.every(v => v.inventory_policy === 'continue');
    const allNoTrack = p.variants.every(v => v.inventory_management === null);
    const allShip = p.variants.every(v => v.requires_shipping === true);

    report.push({
      num: i + 1,
      title: p.title,
      handle: p.handle,
      liveUrl: `https://tryzavelyn.com/products/${p.handle}`,
      variantsCount: p.variants.length,
      imagesCount: p.images.length,
      priceRange: `${p.variants[0].price} - ${p.variants[p.variants.length - 1].price}`,
      options: p.options.map(o => `${o.name} (${o.values.length})`).join(', '),
      inventory_policy_all_continue: allContinue,
      inventory_management_null: allNoTrack,
      requires_shipping_true: allShip
    });
  }

  console.table(report);
  fs.writeFileSync('all_10_products_audit_report.json', JSON.stringify(report, null, 2));
}

main().catch(console.error);
