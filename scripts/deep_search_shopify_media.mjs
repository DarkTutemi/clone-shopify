import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

async function searchAllMedia() {
  const token = await getAccessToken();

  let hasNext = true;
  let cursor = null;
  let allFiles = [];

  while (hasNext && allFiles.length < 250) {
    const query = `
      query getFiles($cursor: String) {
        files(first: 100, after: $cursor, reverse: true) {
          pageInfo {
            hasNextPage
            endCursor
          }
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

    const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token
      },
      body: JSON.stringify({ query, variables: { cursor } })
    });

    const json = await res.json();
    const edges = json.data?.files?.edges || [];
    allFiles.push(...edges);
    hasNext = json.data?.files?.pageInfo?.hasNextPage;
    cursor = json.data?.files?.pageInfo?.endCursor;
  }

  console.log(`Scanned ${allFiles.length} files from Shopify.`);
  const matching = allFiles.filter(f => {
    const url = f.node?.image?.url || '';
    const alt = f.node?.image?.altText || '';
    return /mask|eye|face|red|light|therapy|beauty|skin|care|device/i.test(url + ' ' + alt);
  });

  console.log(`Found ${matching.length} matching files:`);
  matching.forEach((f, i) => {
    const img = f.node?.image;
    console.log(`[${i}] ${f.node?.createdAt} | ${img?.width}x${img?.height} | ${img?.url?.split('?')[0]} | alt: "${img?.altText || ''}"`);
  });
}

searchAllMedia().catch(console.error);
