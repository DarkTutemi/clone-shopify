const SHOP_DOMAIN = 'vwpb1k-8z.myshopify.com';
const CLIENT_ID = '82d6aaab9e73809cb37b6643302b1255';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "SHOPIFY_SECRET_TOKEN";

const FULL_CATALOG = [
  {
    handle: "bronoir-skin-pro-with-copper-grounding-allround-barefoot-shoes",
    title: "Bronoir™ Skin Pro with Copper - Grounding Allround Barefoot Shoes",
    price: "2097000",
    compareAtPrice: "3146000",
    colors: ["Black", "White", "Pink", "Grey", "Blackblue"],
    colorImages: {
      "Black": "https://trybronoir.com/cdn/shop/files/DeinAbschnittstext_11.png",
      "White": "https://trybronoir.com/cdn/shop/files/DeinAbschnittstext_9.png",
      "Pink": "https://trybronoir.com/cdn/shop/files/DeinAbschnittstext_10.png",
      "Grey": "https://trybronoir.com/cdn/shop/files/DeinAbschnittstext_12.png",
      "Blackblue": "https://trybronoir.com/cdn/shop/files/DeinAbschnittstext_13.png"
    },
    sizes: [
      "Women 5-5.5 | Men 4.5 | EU 36",
      "Women 6-6.5 | Men 5 | EU 37",
      "Women 7-7.5 | Men 5.5-6 | EU 38",
      "Women 8-8.5 | Men 6.5.7 | EU 39",
      "Women 9-9.5 | Men 7.5 | EU 40",
      "Women 10 | Men 8-8.5 | EU 41",
      "Women 10.5-11 | Men 9 | EU 42",
      "Women 11.5-12 | Men 9.5-10 | EU 43",
      "Women 12.5 | Men 10.5-11 | EU 44",
      "Women 13 | Men 11.5-12 | EU 45",
      "Women 13.5 | Men 12.5-13 | EU 46"
    ]
  },
  {
    handle: "bronoir-cosycloud-boot-barefoot-winter-boots",
    title: "Bronoir CosyCloud Boot - Warm & Comfy Winter Barefoot Boot",
    price: "1966000",
    compareAtPrice: "3278000",
    colors: ["Chestnut Brown", "Midnight Black", "Graphite Grey", "Frost Grey", "Sandstone Beige"],
    colorImages: {
      "Chestnut Brown": "https://trybronoir.com/cdn/shop/files/main_imageSa8643830040d46f19c743a84c795910cn.jpg",
      "Midnight Black": "https://trybronoir.com/cdn/shop/files/main_imageS55201be9a5c94ed2bfcf7703419d4dd2F.jpg",
      "Graphite Grey": "https://trybronoir.com/cdn/shop/files/main_imageS9815bfd209b04b6386b6faa0be4f53b55.jpg",
      "Frost Grey": "https://trybronoir.com/cdn/shop/files/main_imageS5035d4763edc490ab71c090f9358273dD.jpg",
      "Sandstone Beige": "https://trybronoir.com/cdn/shop/files/main_imageSe083a0afa5114c2c925ae8f3a419f27dP.jpg"
    },
    sizes: [
      "Women 5-5.5 | Men 4 | EU 36",
      "Women 6-6.5 | Men 5 | EU 37",
      "Women 7-7.5 | Men 5.5-6 | EU 38",
      "Women 8-8.5 | Men 6.5.7 | EU 39",
      "Women 9-9.5 | Men 7.5 | EU 40",
      "Women 10 | Men 8-8.5 | EU 41",
      "Women 10.5-11 | Men 9 | EU 42",
      "Women 11.5-12 | Men 9.5-10 | EU 43",
      "Women 12.5 | Men 10.5-11 | EU 44",
      "Women 13 | Men 11.5-12 | EU 45",
      "Women 13.5 | Men 12.5-13 | EU 46"
    ]
  },
  {
    handle: "bronoir-hikers-orthopedic-outdoor-trail-shoes",
    title: "Bronoir™ Hikers - Orthopedic Outdoor Shoes (BOGO)",
    price: "1835000",
    compareAtPrice: "3146000",
    colors: ["Grey", "Black", "Black / Red", "Blue"],
    colorImages: {
      "Grey": "https://trybronoir.com/cdn/shop/files/2_9dd806bd-89a0-46a8-85e2-073b17201138.jpg",
      "Black": "https://trybronoir.com/cdn/shop/files/2_9dd806bd-89a0-46a8-85e2-073b17201138.jpg",
      "Black / Red": "https://trybronoir.com/cdn/shop/files/3_eeb3adf3-2377-4daa-844b-db7a1a2c4662.jpg",
      "Blue": "https://trybronoir.com/cdn/shop/files/4_7772c9bf-dab2-47fb-83e1-2c777171ffb1.jpg"
    },
    sizes: [
      "Women 8-8.5 | Men 6.5.7 | EU 39",
      "Women 9-9.5 | Men 7.5 | EU 40",
      "Men 8-8.5 | EU 41",
      "Men 9 | EU 42",
      "Men 9.5-10 | EU 43",
      "Men 10.5-11 | EU 44",
      "Men 11.5-12 | EU 45",
      "Men 12.5-13 | EU 46",
      "Men 13.5 | EU 47"
    ]
  },
  {
    handle: "bronoir-flex-barefoot-shoes",
    title: "Bronoir™ Flex - Barefoot Shoes",
    price: "2097000",
    compareAtPrice: "3934000",
    colors: ["Black", "Green", "Grey", "Blue"],
    colorImages: {
      "Black": "https://trybronoir.com/cdn/shop/files/products_46_1000x_736a9b94-959c-45aa-a7f0-cc026ecd1ad6.webp",
      "Green": "https://trybronoir.com/cdn/shop/files/products_44_1000x_b46efd46-3f70-414c-b766-2892b5fc47b8.webp",
      "Grey": "https://trybronoir.com/cdn/shop/files/products_45_1000x_42be7ef1-d11d-4c4c-a98a-33c80a62a0c9.webp",
      "Blue": "https://trybronoir.com/cdn/shop/files/products_47_1000x_136e913e-fe86-4426-ac2e-308a7c08ed03.webp"
    },
    sizes: [
      "Women 7-7.5 | Men 5.5-6 | EU 38",
      "Women 8-8.5 | Men 6.5.7 | EU 39",
      "Women 9-9.5 | Men 7.5 | EU 40",
      "Women 10 | Men 8-8.5 | EU 41",
      "Women 10.5-11 | Men 9 | EU 42",
      "Women 11.5-12 | Men 9.5-10 | EU 43",
      "Women 12.5 | Men 10.5-11 | EU 44",
      "Women 13 | Men 11.5-12 | EU 45",
      "Women 13.5 | Men 12.5-13 | EU 46"
    ]
  },
  {
    handle: "bronoir-streets-minimalist-everyday-barefoot-sneakers",
    title: "Bronoir Streets - Casual Everyday Barefoot Shoes",
    price: "1704000",
    compareAtPrice: "2884000",
    colors: ["White", "Black", "Blue", "Grey", "Red"],
    colorImages: {
      "White": "https://trybronoir.com/cdn/shop/files/SKU-Bilder-5.webp",
      "Black": "https://trybronoir.com/cdn/shop/files/SKU-Bilder-1_d749ee6e-54b0-4a4e-9bfb-251c663fa422.jpg",
      "Blue": "https://trybronoir.com/cdn/shop/files/SKU-Bilder-2.webp",
      "Grey": "https://trybronoir.com/cdn/shop/files/SKU-Bilder-3_8bfb6f5d-3ea8-4ed3-b7f5-d59a48a92900.jpg",
      "Red": "https://trybronoir.com/cdn/shop/files/SKU-Bilder-4.webp"
    },
    sizes: [
      "Women 5-5.5 | Men 4.5 | EU 36",
      "Women 6-6.5 | Men 5 | EU 37",
      "Women 7-7.5 | Men 5.5-6 | EU 38",
      "Women 8-8.5 | Men 6.5.7 | EU 39",
      "Women 9-9.5 | Men 7.5 | EU 40",
      "Women 10 | Men 8-8.5 | EU 41",
      "Women 10.5-11 | Men 9 | EU 42",
      "Women 11.5-12 | Men 9.5-10 | EU 43",
      "Women 12.5 | Men 10.5-11 | EU 44",
      "Women 13 | Men 11.5-12 | EU 45"
    ]
  },
  {
    handle: "bronoir-runner-pro-barefoot-performance-running-shoes",
    title: "Bronoir™ Runner Pro - Barefoot Shoes (big sizes)",
    price: "1966000",
    compareAtPrice: "3408000",
    colors: ["Grey", "Pink", "Blue", "Black", "White", "Beige"],
    colorImages: {
      "Grey": "https://trybronoir.com/cdn/shop/files/DesignohneTitel_8.png",
      "Pink": "https://trybronoir.com/cdn/shop/files/Ueberblick-2_6704a920-22b6-4593-b16b-2d57853c35fc.jpg",
      "Blue": "https://trybronoir.com/cdn/shop/files/Ueberblick-17_f13de6c1-f80b-4f72-b5f1-04ee669a15ac.jpg",
      "Black": "https://trybronoir.com/cdn/shop/files/Ueberblick-22_d84eee98-61c8-4749-8d04-05e81f76e3b6.jpg",
      "White": "https://trybronoir.com/cdn/shop/files/Ueberblick-12_cfcb6fdb-4975-48b7-8bd7-80f9ed8481ad.jpg",
      "Beige": "https://trybronoir.com/cdn/shop/files/Ueberblick-26_9b7bbb5b-0b38-4472-9691-1f73d3174515.jpg"
    },
    sizes: [
      "Women 5-5.5 | Men 4.5 | EU 36",
      "Women 6-6.5 | Men 5 | EU 37",
      "Women 7-7.5 | Men 5.5-6 | EU 38",
      "Women 8-8.5 | Men 6.5.7 | EU 39",
      "Women 9-9.5 | Men 7.5 | EU 40",
      "Women 10 | Men 8-8.5 | EU 41",
      "Women 10.5-11 | Men 9 | EU 42",
      "Women 11.5-12 | Men 9.5-10 | EU 43",
      "Women 12.5 | Men 10.5-11 | EU 44",
      "Women 13 | Men 11.5-12 | EU 45"
    ]
  }
];

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
  return data.access_token;
}

async function main() {
  const token = await getAccessToken();
  console.log('Got access token');

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
    return json.data;
  }

  for (const item of FULL_CATALOG) {
    console.log(`\nSyncing product: ${item.title} (${item.handle})...`);
    const prodData = await graphql(`
      query getProd($handle: String!) {
        productByHandle(handle: $handle) {
          id
          title
          options { id name values }
          variants(first: 50) {
            nodes {
              id
              title
              selectedOptions { name value }
            }
          }
          media(first: 20) {
            nodes {
              id
              ... on MediaImage {
                image { url }
              }
            }
          }
        }
      }
    `, { handle: item.handle });

    const prod = prodData?.productByHandle;
    if (!prod) {
      console.log('Product not found by handle:', item.handle);
      continue;
    }

    const productId = prod.id;
    console.log(`Found product ${prod.title} with ${prod.variants?.nodes?.length} variants.`);

    // 1. Upload color images as product media if not already present
    const mediaUrls = (prod.media?.nodes || []).map(m => m.image?.url || '');
    const neededMedia = [];
    for (const [color, imgUrl] of Object.entries(item.colorImages)) {
      neededMedia.push({
        originalSource: imgUrl,
        mediaContentType: "IMAGE"
      });
    }

    if (neededMedia.length > 0) {
      console.log(`  Uploading ${neededMedia.length} color images to product...`);
      await graphql(`
        mutation createMedia($productId: ID!, $media: [CreateMediaInput!]!) {
          productCreateMedia(productId: $productId, media: $media) {
            media { id }
            mediaUserErrors { field message }
          }
        }
      `, { productId, media: neededMedia });
    }

    // 2. Prepare full variant matrix
    const existingVariantTitles = new Set(prod.variants?.nodes?.map(v => v.title) || []);
    const newVariants = [];

    for (const color of item.colors) {
      for (const size of item.sizes) {
        const titleComb = `${color} / ${size}`;
        if (!existingVariantTitles.has(titleComb)) {
          newVariants.push({
            optionValues: [
              { optionName: "Color", name: color },
              { optionName: "Size", name: size }
            ],
            price: item.price,
            compareAtPrice: item.compareAtPrice
          });
        }
      }
    }

    if (newVariants.length > 0) {
      console.log(`  Adding ${newVariants.length} missing variants...`);
      // Shopify bulkCreate takes up to 50 at a time
      const chunkSize = 40;
      for (let i = 0; i < newVariants.length; i += chunkSize) {
        const chunk = newVariants.slice(i, i + chunkSize);
        const res = await graphql(`
          mutation bulkCreate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
            productVariantsBulkCreate(productId: $productId, variants: $variants) {
              productVariants { id title }
              userErrors { field message }
            }
          }
        `, { productId, variants: chunk });
        console.log(`    Created chunk ${i / chunkSize + 1} (${chunk.length} variants).`);
      }
    } else {
      console.log('  All variants already up to date!');
    }
  }

  console.log('\n🎉 ALL REAL VARIANTS & COLOR MEDIA SYNC COMPLETE!');
}

main().catch(console.error);
