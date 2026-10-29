import { getAccessToken, SHOP } from './batch1_config.mjs';

async function main() {
  const token = await getAccessToken();

  const ids = [
    'gid://shopify/MediaImage/47447221141689',
    'gid://shopify/MediaImage/47447221174457',
    'gid://shopify/MediaImage/47447221207225'
  ];

  const query = `query getFileUrls($ids: [ID!]!) {
    nodes(ids: $ids) {
      ... on MediaImage {
        id
        fileStatus
        image {
          url
          width
          height
        }
      }
    }
  }`;

  for (let attempt = 1; attempt <= 10; attempt++) {
    console.log(`Checking file status (attempt ${attempt})...`);
    const res = await fetch(`https://${SHOP}/admin/api/2026-10/graphql.json`, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query, variables: { ids } })
    });

    const data = await res.json();
    const nodes = data.data?.nodes || [];
    const allReady = nodes.every(n => n?.image?.url);
    if (allReady) {
      console.log('All images are ready on Shopify CDN:');
      nodes.forEach((n, idx) => {
        console.log(`Image ${idx + 1} (${n.id}): ${n.image.url}`);
      });
      return nodes.map(n => n.image.url);
    }
    await new Promise(r => setTimeout(r, 2000));
  }
}

main().catch(console.error);
