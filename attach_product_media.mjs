const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "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";

const PRODUCT_IMAGES = {
  "bronoir-skin-pro-with-copper-grounding-allround-barefoot-shoes": [
    "https://trybronoir.com/cdn/shop/files/1_d283c748-1cd3-4e3e-4af5-6dca50e41f7e.jpg",
    "https://trybronoir.com/cdn/shop/files/2_88849b20-1b22-491c-a1d2-067da847b719.jpg",
    "https://trybronoir.com/cdn/shop/files/3_4bc2b662-8706-4b95-a226-9d32d0391d1e.jpg",
    "https://trybronoir.com/cdn/shop/files/4_65f0e960-9fa6-40e1-b4c6-be2555aa0350.jpg"
  ],
  "bronoir-cosycloud-boot-barefoot-winter-boots": [
    "https://trybronoir.com/cdn/shop/files/main_imageSa8643830040d46f19c743a84c795910cn_800x.jpg?v=1764746902",
    "https://trybronoir.com/cdn/shop/files/2_a8860335-eb99-433a-9355-2dda6fef77b5.jpg"
  ],
  "bronoir-hikers-orthopedic-outdoor-trail-shoes": [
    "https://trybronoir.com/cdn/shop/files/2_9dd806bd-89a0-46a8-85e2-073b17201138_1080x.jpg?v=1761602551",
    "https://trybronoir.com/cdn/shop/files/1_6f4ffbd0-29c4-42b7-84bc-2f95fc7ce682.jpg"
  ],
  "bronoir-flex-barefoot-shoes": [
    "https://trybronoir.com/cdn/shop/files/products_46_1000x_736a9b94-959c-45aa-a7f0-cc026ecd1ad6_1000x.webp?v=1761602395",
    "https://trybronoir.com/cdn/shop/files/products_47_1000x_4a11f71a-ec38-4e50-93a5-1d6eb4fae1ff_1000x.webp"
  ],
  "bronoir-streets-minimalist-everyday-barefoot-sneakers": [
    "https://trybronoir.com/cdn/shop/files/DeinAbschnittstext_11_1080x.png?v=1761602494",
    "https://trybronoir.com/cdn/shop/files/DeinAbschnittstext_12_1080x.png"
  ],
  "bronoir-runner-pro-barefoot-performance-running-shoes": [
    "https://trybronoir.com/cdn/shop/files/freiluftkind_linkblock_sneaker_v2_jpg_958fde39-1c1f-4ce0-bf8a-6bf04474f161.png?v=1761594767&width=600",
    "https://trybronoir.com/cdn/shop/files/freiluftkind_linkblock_sneaker_v2.jpg_1.png?v=1761594764"
  ],
  "bronoir-winter-shoes-waterproof-thermal-barefoot-boots": [
    "https://trybronoir.com/cdn/shop/files/Frame_1000004753.png?v=1761594210&width=600",
    "https://trybronoir.com/cdn/shop/files/3_a8860335-eb99-433a-9355-2dda6fef77b5.jpg"
  ],
  "bronoir-barefoot-recovery-socks-3-pack": [
    "https://trybronoir.com/cdn/shop/files/Frame1000005214.png?v=1761673627&width=600"
  ],
  "bronoir-connect-orthopedic-fleece-conductive-insoles": [
    "https://trybronoir.com/cdn/shop/files/Frame1000005214.png?v=1761673627&width=600"
  ]
};

async function getAccessToken() {
  const tokenUrl = `https://${SHOP_DOMAIN}/admin/oauth/access_token`;
  const res = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials'
    })
  });
  const data = await res.json();
  if (!data.access_token) {
    throw new Error(`Failed to obtain access token: ${JSON.stringify(data)}`);
  }
  return data.access_token;
}

async function main() {
  const token = await getAccessToken();
  console.log('Got access token:', token.substring(0, 10) + '...');

  async function graphql(query, variables = {}) {
    const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token
      },
      body: JSON.stringify({ query, variables })
    });
    const json = await res.json();
    if (json.errors) {
      console.error('GraphQL Error:', JSON.stringify(json.errors, null, 2));
    }
    return json.data;
  }

  // Fetch all products
  const prodsData = await graphql(`
    query {
      products(first: 50) {
        nodes {
          id
          title
          handle
          media(first: 10) {
            nodes {
              id
            }
          }
        }
      }
    }
  `);

  const products = prodsData?.products?.nodes || [];
  console.log(`Found ${products.length} products on store.`);

  for (const prod of products) {
    console.log(`\nProduct: ${prod.title} (handle: ${prod.handle})`);
    const images = PRODUCT_IMAGES[prod.handle] || [];
    if (images.length === 0) {
      console.log('No specific images configured for', prod.handle);
      continue;
    }

    if (prod.media && prod.media.nodes.length > 0) {
      console.log(`  Already has ${prod.media.nodes.length} media items.`);
      continue;
    }

    const mediaInput = images.map(url => ({
      originalSource: url,
      mediaContentType: "IMAGE"
    }));

    console.log(`  Uploading ${mediaInput.length} media items...`);
    const mediaRes = await graphql(`
      mutation createMedia($productId: ID!, $media: [CreateMediaInput!]!) {
        productCreateMedia(productId: $productId, media: $media) {
          media {
            id
            status
          }
          mediaUserErrors {
            field
            message
          }
        }
      }
    `, {
      productId: prod.id,
      media: mediaInput
    });

    if (mediaRes?.productCreateMedia?.mediaUserErrors?.length > 0) {
      console.warn('  Media errors:', mediaRes.productCreateMedia.mediaUserErrors);
    } else {
      console.log(`  ✅ Successfully uploaded ${mediaRes?.productCreateMedia?.media?.length || 0} images!`);
    }
  }

  console.log('\n--- ALL PRODUCT MEDIA UPLOAD COMPLETE ---');
}

main().catch(console.error);
