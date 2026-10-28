import fs from 'fs';
import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const ids = [
  '15454949540025',
  '15454950490297',
  '15454952882361',
  '15454953177273',
  '15454955765945',
  '15454959403193',
  '15454960517305',
  '15454961565881',
  '15454963073209',
  '15454963433657'
];

async function run() {
  const token = await getAccessToken();
  const report = {};

  for (const id of ids) {
    const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
      body: JSON.stringify({
        query: `query { product(id: "gid://shopify/Product/${id}") { id title description descriptionHtml } }`
      })
    });
    const data = await res.json();
    const p = data.data?.product;
    report[id] = {
      title: p?.title,
      description: p?.description,
      descriptionHtml: p?.descriptionHtml
    };
    console.log(`[CHECKED] ${id} - ${p?.title}`);
  }

  fs.writeFileSync('scripts/batch2_source_descriptions.json', JSON.stringify(report, null, 2), 'utf8');
  console.log('\nSaved all 10 descriptions to scripts/batch2_source_descriptions.json');
}

run().catch(console.error);
