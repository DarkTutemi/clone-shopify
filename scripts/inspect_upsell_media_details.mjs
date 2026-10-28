import fs from 'fs';
import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

async function main() {
  const data = JSON.parse(fs.readFileSync('scripts/live_vfit_products_dump.json', 'utf8'));

  for (const [handle, item] of Object.entries(data)) {
    const p = item.rest;
    console.log(`\n============================`);
    console.log(`Handle: ${handle}`);
    console.log(`Title: ${p.title}`);
    console.log(`Body HTML length:`, p.body_html ? p.body_html.length : 0);
    if (p.body_html) {
      console.log(`Body preview:\n`, p.body_html.substring(0, 300));
      const imgs = p.body_html.match(/https?:\/\/[^\s"'<>]+\.(?:jpg|jpeg|png|webp|avif|gif)/gi) || [];
      console.log(`Found ${imgs.length} image URLs in body_html:`, imgs);
    }
  }

  // Also query GraphQL files in Shopify to see if high-res images for eye mask and face mask exist
  const token = await getAccessToken();
  const fileQuery = `
    query getFiles {
      files(first: 50, query: "mask OR eye OR face OR vfit OR joylux") {
        edges {
          node {
            ... on MediaImage {
              id
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
  console.log(`\nShopify Files matching mask/eye/face/vfit:`);
  const files = gqlData.data?.files?.edges || [];
  files.forEach((f, idx) => {
    if (f.node?.image?.url) {
      console.log(`  [${idx}] ${f.node.image.url} (${f.node.image.width}x${f.node.image.height}) - alt: "${f.node.image.altText || ''}"`);
    }
  });
}

main().catch(console.error);
