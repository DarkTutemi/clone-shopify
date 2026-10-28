import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

async function checkPages() {
  const token = await getAccessToken();
  const query = `
    query {
      pages(first: 50) {
        nodes {
          id
          title
          handle
          templateSuffix
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
    body: JSON.stringify({ query })
  });
  const data = await res.json();
  console.log('Pages count:', data.data?.pages?.nodes?.length);
  for (const p of (data.data?.pages?.nodes || [])) {
    console.log(`Page: "${p.title}" | Handle: ${p.handle} | Template: ${p.templateSuffix || '(default)'}`);
  }
}
checkPages();
