const SHOP_DOMAIN = 'vwpb1k-8z.myshopify.com';
const CLIENT_ID = '82d6aaab9e73809cb37b6643302b1255';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "SHOPIFY_SECRET_TOKEN";

async function main() {
  const tokenRes = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials'
    })
  });
  const { access_token } = await tokenRes.json();
  console.log('Access token acquired:', access_token?.slice(0, 10));

  const query = `
    query {
      products(first: 20) {
        nodes {
          id
          title
          handle
          status
          tags
          variants(first: 10) {
            nodes {
              id
              title
              price
            }
          }
        }
      }
      collections(first: 20) {
        nodes {
          id
          title
          handle
          productsCount {
            count
          }
          ruleSet {
            rules {
              column
              relation
              condition
            }
          }
        }
      }
    }
  `;

  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': access_token
    },
    body: JSON.stringify({ query })
  });
  const data = await res.json();
  console.log('Collections:');
  console.log(JSON.stringify(data.data.collections.nodes, null, 2));
  console.log('\nProducts count:', data.data.products.nodes.length);
  console.log('Products:');
  data.data.products.nodes.forEach(p => {
    console.log(`- ${p.title} (Status: ${p.status}, Variants: ${p.variants.nodes.length}, Tags: [${p.tags.join(', ')}])`);
  });
}

main().catch(console.error);
