import fs from 'fs';
import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const batch3Ids = [
  '15454948982969', // Flame Effect Space Heater
  '15454949998777', // Handheld Steam Cleaner
  '15454950850745', // Bathroom Exhaust Fan with Light
  '15454951211193', // Outdoor Solar Street Lights
  '15454951801017', // Portable Camping Fan with Light
  '15454954193081', // Tactical MOLLE Utility Vest
  '15454954750137', // Smart Hygrometer Thermometer Clock
  '15454955372729', // 3-in-1 Drywall Board Cutter
  '15454956355769', // Digital Mini Heat Press Machine
  '15454958158009'  // 50FT LED Jobsite String Lights
];

async function shopifyGQL(query, variables = {}, token) {
  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({ query, variables })
  });
  return await res.json();
}

async function run() {
  const token = await getAccessToken();
  const fullData = {};

  for (const id of batch3Ids) {
    const res = await shopifyGQL(`
      query getFullProd($id: ID!) {
        product(id: $id) {
          id
          title
          handle
          productType
          vendor
          tags
          description
          descriptionHtml
          variants(first: 10) {
            nodes {
              id
              title
              price
              sku
            }
          }
        }
      }
    `, { id: `gid://shopify/Product/${id}` }, token);

    fullData[id] = res.data?.product;
    console.log(`[PULLED] ${id} - ${fullData[id]?.title}`);
  }

  fs.writeFileSync('scripts/batch3_full_sources.json', JSON.stringify(fullData, null, 2), 'utf8');
  console.log('Saved to scripts/batch3_full_sources.json');
}

run().catch(console.error);
