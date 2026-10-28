import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { getAccessToken, SHOP } from './batch1_config.mjs';

const API_VERSION = '2026-10';

async function main() {
  const token = await getAccessToken();

  const query = `
    query {
      product(id: "gid://shopify/Product/15469942145209") {
        id
        title
        status
        resourcePublicationsV2(first: 10) {
          nodes {
            publication {
              id
              name
            }
            isPublished
          }
        }
      }
      publications(first: 10) {
        nodes {
          id
          name
        }
      }
    }
  `;

  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query })
  });
  const data = await res.json();
  console.log('Result:', JSON.stringify(data.data, null, 2));
}

main().catch(console.error);
