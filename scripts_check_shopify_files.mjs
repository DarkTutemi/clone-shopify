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
      files(first: 100, sortKey: CREATED_AT, reverse: true) {
        edges {
          node {
            ... on MediaImage {
              id
              image {
                url
                altText
              }
            }
            ... on GenericFile {
              id
              url
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
  console.log('Top 15 files:');
  data.data.files.edges.slice(0, 15).forEach(e => {
    const url = e.node.image ? e.node.image.url : e.node.url;
    console.log(e.node.id, url);
  });
}

run().catch(console.error);
