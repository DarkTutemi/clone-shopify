import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

async function listAllFiles() {
  const token = await getAccessToken();
  const fileQuery = `
    query getRecentFiles {
      files(first: 100, reverse: true) {
        edges {
          node {
            ... on MediaImage {
              id
              createdAt
              image {
                url
                width
                height
                altText
              }
            }
          }
        }
      }
    }
  `;

  const gqlRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({ query: fileQuery })
  });
  const gqlData = await gqlRes.json();
  const files = gqlData.data?.files?.edges || [];
  console.log(`Total files found: ${files.length}`);
  files.forEach((f, idx) => {
    const img = f.node?.image;
    if (img?.url) {
      console.log(`[${idx}] ${f.node.createdAt} | ${img.width}x${img.height} | ${img.url.split('/').pop().split('?')[0]} | alt: "${img.altText || ''}"`);
    }
  });
}

listAllFiles().catch(console.error);
