import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

async function main() {
  const token = await getAccessToken();
  const fileNames = [
    'zavelyn-botana-asset-1.jpg',
    'zavelyn-botana-asset-2.jpg',
    'zavelyn-botana-asset-3.png',
    'zavelyn-botana-asset-4.png',
    'zavelyn-botana-asset-5.png',
    'zavelyn-botana-asset-6.png',
    'zavelyn-botana-asset-7.webp',
    'zavelyn-botana-asset-8.webp'
  ];

  // Try checking files via GraphQL
  const query = `
    query {
      files(first: 20, query: "zavelyn-botana-asset") {
        edges {
          node {
            ... on MediaImage {
              image {
                url
              }
            }
          }
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
  console.log('Files result:\n', JSON.stringify(data, null, 2));
}

main().catch(console.error);
