import fs from 'fs';
import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const rollbackPayload = [
  {
    id: 'gid://shopify/Product/15454947901625',
    title: 'Zavelyn Sensory Floor Mats',
    handle: 'sakerplus®-tpu-sensory-textured-floor-mats',
    seo: {
      title: null,
      description: null
    }
  },
  {
    id: 'gid://shopify/Product/15454948163769',
    title: 'Zavelyn Non-Slip Drawer Liner',
    handle: 'sakerplus®-tearable-non-slip-drawer-liner',
    seo: {
      title: null,
      description: null
    }
  },
  {
    id: 'gid://shopify/Product/15454948556985',
    title: 'Zavelyn Shelf & Drawer Liner',
    handle: 'sakerplus®-tearable-shelf-liner-and-drawer-liner',
    seo: {
      title: null,
      description: null
    }
  }
];

async function rollbackBatch1() {
  const token = await getAccessToken();
  console.log('Initiating Batch 1 Rollback...');

  for (const item of rollbackPayload) {
    const query = `
      mutation revertProduct($input: ProductInput!) {
        productUpdate(input: $input) {
          product {
            id
            title
            handle
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token
      },
      body: JSON.stringify({ query, variables: { input: item } })
    });

    const json = await res.json();
    console.log(`Reverted ${item.id}:`, JSON.stringify(json.data?.productUpdate));
  }
  console.log('Batch 1 rollback completed.');
}

export { rollbackBatch1, rollbackPayload };
