import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP = 'dsdujr-vn.myshopify.com';

async function getAccessToken() {
  const res = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials'
    })
  });
  const data = await res.json();
  return data.access_token;
}

async function run() {
  const token = await getAccessToken();
  const query = `
    query {
      files(first: 8, sortKey: CREATED_AT, reverse: true) {
        edges {
          node {
            ... on MediaImage {
              id
              createdAt
              image {
                url
                altText
                width
                height
              }
            }
          }
        }
      }
    }
  `;
  const res = await fetch(`https://${SHOP}/admin/api/2024-10/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({ query })
  });
  const data = await res.json();
  console.log(JSON.stringify(data.data.files.edges, null, 2));

  // Let's download the 6 images to inspection folder
  fs.mkdirSync('scratch_colors', { recursive: true });
  for (const edge of data.data.files.edges) {
    const url = edge.node.image?.url;
    if (!url) continue;
    const name = url.split('/').pop().split('?')[0];
    const imgRes = await fetch(url);
    const buf = Buffer.from(await imgRes.arrayBuffer());
    fs.writeFileSync(`scratch_colors/${name}`, buf);
    console.log(`Saved scratch_colors/${name} (${buf.length} bytes)`);
  }
}

run().catch(console.error);
