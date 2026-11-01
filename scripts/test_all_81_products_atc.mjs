import fs from 'fs';
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { SHOP } from './batch1_config.mjs';

const DOMAIN = `https://${SHOP}`;

async function testAll81Products() {
  const products = JSON.parse(fs.readFileSync('scripts/active_products_list.json', 'utf8'));
  console.log(`Testing Add To Cart via ${DOMAIN} for all ${products.length} active products...`);

  const results = [];
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < products.length; i++) {
    const p = products[i];
    const defaultVariant = p.variants[0];

    try {
      const res = await fetch(`${DOMAIN}/cart/add.js`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          items: [{
            id: defaultVariant.id,
            quantity: 1
          }]
        })
      });

      const status = res.status;
      let body = {};
      try {
        body = await res.json();
      } catch (e) {
        body = { error: 'Failed to parse JSON response' };
      }

      const isSuccess = status === 200 && (body.id || body.items?.[0]?.id);

      if (isSuccess) {
        successCount++;
        results.push({
          index: i + 1,
          productId: p.id,
          handle: p.handle,
          variantId: defaultVariant.id,
          title: p.title,
          price: defaultVariant.price,
          template: p.template_suffix || 'default',
          status: 'SUCCESS',
          httpStatus: status
        });
      } else {
        failCount++;
        results.push({
          index: i + 1,
          productId: p.id,
          handle: p.handle,
          variantId: defaultVariant.id,
          title: p.title,
          price: defaultVariant.price,
          template: p.template_suffix || 'default',
          status: 'FAILED',
          httpStatus: status,
          error: body.description || body.message || JSON.stringify(body)
        });
      }

      // Clear cart periodically
      if ((i + 1) % 15 === 0 || i === products.length - 1) {
        await fetch(`${DOMAIN}/cart/clear.js`, { method: 'POST' });
      }

    } catch (err) {
      failCount++;
      results.push({
        index: i + 1,
        productId: p.id,
        handle: p.handle,
        variantId: defaultVariant.id,
        title: p.title,
        status: 'NETWORK_ERROR',
        error: err.message
      });
    }

    if ((i + 1) % 15 === 0 || i === products.length - 1) {
      console.log(`Progress: ${i + 1}/${products.length} tested (${successCount} OK, ${failCount} failed)`);
    }
  }

  // Clear cart finally
  await fetch(`${DOMAIN}/cart/clear.js`, { method: 'POST' });

  fs.writeFileSync('scripts/all_products_atc_results.json', JSON.stringify({
    total: products.length,
    successCount,
    failCount,
    results
  }, null, 2));

  console.log(`\n=== ATC TEST SUMMARY ===`);
  console.log(`Total Products Tested: ${products.length}`);
  console.log(`Successful: ${successCount}`);
  console.log(`Failed: ${failCount}`);

  const failures = results.filter(r => r.status !== 'SUCCESS');
  if (failures.length > 0) {
    console.log('\nFAILED PRODUCTS:');
    console.table(failures.map(f => ({
      index: f.index,
      handle: f.handle,
      variantId: f.variantId,
      status: f.status,
      error: f.error
    })));
  } else {
    console.log('\nALL 81 ACTIVE PRODUCTS SUCCESSFULLY ADDED TO CART VIA /cart/add.js!');
  }
}

testAll81Products().catch(console.error);
