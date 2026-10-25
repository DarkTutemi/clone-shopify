import fs from 'fs';

async function main() {
  const tokenRes = await fetch('https://dsdujr-vn.myshopify.com/admin/oauth/access_token', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      client_id: '172e9e29abd0fe12f671d8441479c7c2',
      client_secret: process.env.SHOPIFY_API_SECRET || "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",
      grant_type: 'client_credentials'
    })
  });
  const { access_token } = await tokenRes.json();

  const catalog = JSON.parse(fs.readFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/catalog_harvested.json', 'utf8'));

  const res = await fetch('https://dsdujr-vn.myshopify.com/admin/api/2026-01/graphql.json', {
    method: 'POST',
    headers: {
      'X-Shopify-Access-Token': access_token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: `query { products(first: 20) { edges { node { id handle } } } }`
    })
  });
  const gqlData = await res.json();
  const storeProducts = gqlData.data.products.edges.map(e => e.node);

  for (const p of catalog) {
    const match = storeProducts.find(sp => sp.handle === p.handle);
    if (!match) continue;
    let fixedHtml = p.bodyHtml || '';
    if (fixedHtml.startsWith('id="shopify-section-')) {
      fixedHtml = '<div ' + fixedHtml;
    }
    p.bodyHtml = fixedHtml;

    const updateRes = await fetch('https://dsdujr-vn.myshopify.com/admin/api/2026-01/graphql.json', {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': access_token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: `mutation productUpdate($input: ProductInput!) {
          productUpdate(input: $input) {
            product { id handle }
            userErrors { field message }
          }
        }`,
        variables: {
          input: {
            id: match.id,
            descriptionHtml: fixedHtml
          }
        }
      })
    });
    const upData = await updateRes.json();
    console.log('Updated product:', p.handle, upData?.data?.productUpdate?.product?.id, upData?.data?.productUpdate?.userErrors);
  }

  fs.writeFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/catalog_harvested.json', JSON.stringify(catalog, null, 2));
  console.log('All products updated successfully.');
}

main().catch(console.error);
