import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { getAccessToken, SHOP } from './batch1_config.mjs';

const API_VERSION = '2026-10';
const PRODUCT_ID = 'gid://shopify/Product/15469942145209';

async function inspectVariants() {
  const token = await getAccessToken();
  const headers = {
    'X-Shopify-Access-Token': token,
    'Content-Type': 'application/json'
  };

  const query = `
    query getProduct($id: ID!) {
      product(id: $id) {
        id
        title
        status
        options {
          id
          name
          values
        }
        variants(first: 20) {
          nodes {
            id
            title
            sku
            price
            compareAtPrice
            selectedOptions {
              name
              value
            }
          }
        }
      }
    }
  `;

  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query, variables: { id: PRODUCT_ID } })
  });
  const data = await res.json();
  console.log('PRODUCT OPTIONS & VARIANTS:', JSON.stringify(data.data?.product, null, 2));
}

inspectVariants().catch(console.error);
