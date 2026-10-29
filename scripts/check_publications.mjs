import { getAccessToken, SHOP } from './batch1_config.mjs';

async function main() {
  const token = await getAccessToken();
  const query = `{
    publications(first: 10) {
      edges {
        node {
          id
          name
        }
      }
    }
    product(id: "gid://shopify/Product/15474563907769") {
      id
      title
      status
      publishedAt
      resourcePublicationsV2(first: 5) {
        edges {
          node {
            isPublished
            publication {
              name
            }
          }
        }
      }
    }
  }`;

  const res = await fetch(`https://${SHOP}/admin/api/2026-10/graphql.json`, {
    method: 'POST',
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query })
  });

  const data = await res.json();
  console.log(JSON.stringify(data.data, null, 2));
}

main().catch(console.error);
