import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

async function main() {
  const token = await getAccessToken();
  const query = `
    query {
      files(first: 50, query: "batana OR botana") {
        edges {
          node {
            ... on MediaImage {
              id
              image {
                url
              }
              alt
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
  console.log('Botana files found:');
  data.data?.files?.edges?.forEach(e => {
    console.log(e.node.id, e.node.image?.url);
  });
}

main().catch(console.error);
