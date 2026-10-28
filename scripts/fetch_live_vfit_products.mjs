import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';
import fs from 'fs';

async function fetchProducts() {
  const token = await getAccessToken();

  const handles = [
    'zavelyn-vfit-red-light-intimate-wellness-device',
    'zavelyn-red-light-eye-care-mask',
    'zavelyn-led-red-light-face-mask'
  ];

  const results = {};

  for (const handle of handles) {
    // 1. Fetch via REST
    const restRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/products.json?handle=${handle}`, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    const restData = await restRes.json();
    const prod = restData.products && restData.products[0];

    // 2. Fetch via GraphQL for complete media details (including videos, alt, width, height)
    const gqlQuery = `
      query getProductByHandle($handle: String!) {
        productByHandle(handle: $handle) {
          id
          title
          handle
          descriptionHtml
          totalInventory
          media(first: 20) {
            edges {
              node {
                mediaContentType
                alt
                preview {
                  image {
                    url
                    width
                    height
                    altText
                  }
                }
                ... on MediaImage {
                  id
                  image {
                    url
                    width
                    height
                    altText
                  }
                }
                ... on Video {
                  id
                  sources {
                    url
                    mimeType
                    format
                    height
                    width
                  }
                }
              }
            }
          }
          variants(first: 20) {
            edges {
              node {
                id
                title
                price
                compareAtPrice
                sku
                availableForSale
                quantityAvailable
                inventoryPolicy
                selectedOptions {
                  name
                  value
                }
                image {
                  url
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
      body: JSON.stringify({ query: gqlQuery, variables: { handle } })
    });
    const gqlData = await gqlRes.json();

    results[handle] = {
      rest: prod,
      graphql: gqlData.data?.productByHandle
    };
  }

  fs.writeFileSync('scripts/live_vfit_products_dump.json', JSON.stringify(results, null, 2));
  console.log('Successfully fetched and saved live product data to scripts/live_vfit_products_dump.json');

  // Print summary
  for (const handle of handles) {
    const item = results[handle];
    const g = item.graphql;
    const r = item.rest;
    console.log(`\n========================================`);
    console.log(`Handle: ${handle}`);
    console.log(`Title: ${g?.title || r?.title}`);
    console.log(`Product ID (REST): ${r?.id} | GraphQL: ${g?.id}`);
    console.log(`Variants:`);
    if (g?.variants?.edges) {
      for (const edge of g.variants.edges) {
        const v = edge.node;
        console.log(`  - Variant ID: ${v.id} (numeric: ${v.id.split('/').pop()})`);
        console.log(`    Title: "${v.title}"`);
        console.log(`    Price: $${v.price} | CompareAt: ${v.compareAtPrice ? '$' + v.compareAtPrice : 'N/A'}`);
        console.log(`    Available: ${v.availableForSale} | Qty: ${v.quantityAvailable} | Policy: ${v.inventoryPolicy}`);
      }
    }
    console.log(`Media count: ${g?.media?.edges?.length || r?.images?.length || 0}`);
    if (g?.media?.edges) {
      g.media.edges.forEach((m, idx) => {
        const n = m.node;
        const imgUrl = n.image?.url || n.preview?.image?.url;
        console.log(`  [${idx}] ${n.mediaContentType}: ${imgUrl ? imgUrl.substring(0, 80) + '...' : 'no-url'}`);
      });
    }
  }
}

fetchProducts().catch(err => {
  console.error('Error fetching live products:', err);
  process.exit(1);
});
