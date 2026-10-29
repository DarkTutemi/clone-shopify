import { getAccessToken, SHOP } from './batch1_config.mjs';

async function main() {
  const token = await getAccessToken();
  const mutation = `mutation {
    publishablePublish(
      id: "gid://shopify/Product/15474563907769",
      input: [{ publicationId: "gid://shopify/Publication/225336393913" }]
    ) {
      publishable {
        availablePublicationsCount {
          count
        }
      }
      userErrors {
        field
        message
      }
    }
  }`;

  const res = await fetch(`https://${SHOP}/admin/api/2026-10/graphql.json`, {
    method: 'POST',
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: mutation })
  });

  const data = await res.json();
  console.log('Publish result:', JSON.stringify(data, null, 2));

  // Also update product status to active and published_at
  const resRest = await fetch(`https://${SHOP}/admin/api/2026-10/products/15474563907769.json`, {
    method: 'PUT',
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      product: {
        id: 15474563907769,
        status: 'active',
        published_at: new Date().toISOString()
      }
    })
  });
  const dataRest = await resRest.json();
  console.log('Rest update status:', dataRest.product?.status, 'published_at:', dataRest.product?.published_at);
}

main().catch(console.error);
