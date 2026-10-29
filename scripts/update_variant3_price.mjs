import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { getAccessToken, SHOP } from './batch1_config.mjs';

const VARIANT_ID = 67953654300857;
const TARGET_PRICE = "107.99";
const COMPARE_AT_PRICE = "269.99";

async function updateVariantPrice() {
  const token = await getAccessToken();

  console.log(`Updating Variant ${VARIANT_ID} price to $${TARGET_PRICE} (compare at $${COMPARE_AT_PRICE})...`);
  const res = await fetch(`https://${SHOP}/admin/api/2026-10/variants/${VARIANT_ID}.json`, {
    method: 'PUT',
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      variant: {
        id: VARIANT_ID,
        price: TARGET_PRICE,
        compare_at_price: COMPARE_AT_PRICE
      }
    })
  });

  const data = await res.json();
  if (data.variant) {
    console.log(`✓ Variant ${VARIANT_ID} updated successfully!`);
    console.log(`  Title: ${data.variant.title}`);
    console.log(`  Price: $${data.variant.price}`);
    console.log(`  Compare At Price: $${data.variant.compare_at_price}`);
  } else {
    console.error('Failed to update variant:', data);
  }
}

updateVariantPrice().catch(console.error);
