
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "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";
const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';

const PRODUCTS = [
  {
    title: "Bronoir™ Skin Pro with Copper - Grounding Allround Barefoot Shoes",
    handle: "bronoir-skin-pro-copper-grounding",
    price: "2097000",
    compareAtPrice: "3146000",
    vendor: "Bronoir",
    productType: "Barefoot Shoes",
    tags: ["bestsellers", "barefoot-shoes-bogo-volume", "barefoot-shoes-for-summer", "copper-grounding"],
    images: [
      "https://trybronoir.com/cdn/shop/files/1_1_800x.png",
      "https://trybronoir.com/cdn/shop/files/2_1_800x.png",
      "https://trybronoir.com/cdn/shop/files/3_1_800x.png",
      "https://trybronoir.com/cdn/shop/files/4_1_800x.png"
    ],
    description: "<p>Experience the ultimate barefoot grounding shoes with SkinPro™ breathable mesh, zero-drop flexible sole, and integrated copper grounding plug.</p>"
  },
  {
    title: "Bronoir CosyCloud Boot - Barefoot Winter Boots",
    handle: "bronoir-cosycloud-boot",
    price: "1835000",
    compareAtPrice: "3670000",
    vendor: "Bronoir",
    productType: "Winter Boots",
    tags: ["bestsellers", "barefoot-shoes-bogo-volume", "winter-collection"],
    images: [
      "https://trybronoir.com/cdn/shop/files/CosyCloud_Boot_1_800x.png",
      "https://trybronoir.com/cdn/shop/files/CosyCloud_Boot_2_800x.png"
    ],
    description: "<p>Ultra-warm, water-resistant barefoot winter boots lined with plush faux fleece. Wide toe box and non-slip flexible zero-drop tread.</p>"
  },
  {
    title: "Bronoir™ Runner Pro - Barefoot Performance Running Shoes",
    handle: "bronoir-runner-pro",
    price: "1966000",
    compareAtPrice: "3408000",
    vendor: "Bronoir",
    productType: "Running Shoes",
    tags: ["bestsellers", "barefoot-shoes-for-summer"],
    images: [
      "https://trybronoir.com/cdn/shop/files/RunnerPro_1_800x.png",
      "https://trybronoir.com/cdn/shop/files/RunnerPro_2_800x.png"
    ],
    description: "<p>Engineered for natural gait, agility, and joint shock reduction. Lightweight responsive barefoot running sneaker with wide toe box.</p>"
  },
  {
    title: "Bronoir Streets - Minimalist Everyday Barefoot Sneakers",
    handle: "bronoir-streets",
    price: "1704000",
    compareAtPrice: "2884000",
    vendor: "Bronoir",
    productType: "Sneakers",
    tags: ["bestsellers", "barefoot-shoes-for-summer"],
    images: [
      "https://trybronoir.com/cdn/shop/files/Streets_1_800x.png"
    ],
    description: "<p>Modern casual minimalist sneakers with ultra-flexible zero-drop sole for everyday city walking, office, and travel.</p>"
  },
  {
    title: "Bronoir™ Hikers - Orthopedic Outdoor Trail Shoes",
    handle: "bronoir-hikers",
    price: "2228000",
    compareAtPrice: "3934000",
    vendor: "Bronoir",
    productType: "Outdoor Shoes",
    tags: ["bestsellers", "barefoot-shoes-bogo-volume", "winter-collection"],
    images: [
      "https://trybronoir.com/cdn/shop/files/Hikers_1_800x.png"
    ],
    description: "<p>Rugged barefoot hiking shoes with high-traction lug sole, protective toe cap, and water-repellent breathable upper.</p>"
  },
  {
    title: "Bronoir™ Air - Ultra-Lightweight Breathable Summer Shoes",
    handle: "bronoir-air",
    price: "1441000",
    compareAtPrice: "2622000",
    vendor: "Bronoir",
    productType: "Summer Shoes",
    tags: ["barefoot-shoes-for-summer"],
    images: [
      "https://trybronoir.com/cdn/shop/files/Air_1_800x.png"
    ],
    description: "<p>Featherlight barefoot shoes designed for maximum airflow, quick-drying comfort, and all-day natural foot freedom.</p>"
  },
  {
    title: "Bronoir™ Warmers - Fleece-Lined Winter Barefoot Boots",
    handle: "bronoir-warmers-fleece",
    price: "1966000",
    compareAtPrice: "3670000",
    vendor: "Bronoir",
    productType: "Winter Boots",
    tags: ["winter-collection", "barefoot-shoes-bogo-volume"],
    images: [
      "https://trybronoir.com/cdn/shop/files/Warmers_1_800x.png"
    ],
    description: "<p>Cozy fleece-lined barefoot boots that protect feet from freezing cold while maintaining natural toe splay and posture.</p>"
  },
  {
    title: "Bronoir™ Ortho Clouds - Orthopedic Arch Insoles",
    handle: "bronoir-ortho-clouds-insoles",
    price: "523000",
    compareAtPrice: "1046000",
    vendor: "Bronoir",
    productType: "Insoles",
    tags: ["socks-and-insoles"],
    images: [
      "https://trybronoir.com/cdn/shop/files/Insoles_1_800x.png"
    ],
    description: "<p>Targeted pressure-relief orthopedic insoles designed for natural barefoot shoes. Enhances heel cushioning without affecting zero-drop.</p>"
  },
  {
    title: "Bronoir Connect - Orthopedic Fleece Conductive Insoles",
    handle: "bronoir-connect-conductive-insoles",
    price: "785000",
    compareAtPrice: "1310000",
    vendor: "Bronoir",
    productType: "Insoles",
    tags: ["socks-and-insoles"],
    images: [
      "https://trybronoir.com/cdn/shop/files/Connect_Insoles_1_800x.png"
    ],
    description: "<p>Conductive copper fiber winter fleece insoles designed specifically for grounding shoes. Keeps feet warm while preserving electrical grounding conductivity.</p>"
  }
];

const COLLECTIONS = [
  {
    title: "Bestsellers",
    handle: "bestsellers",
    rule: { column: "TAG", relation: "EQUALS", condition: "bestsellers" }
  },
  {
    title: "Barefoot Shoes BOGO Volume",
    handle: "barefoot-shoes-bogo-volume",
    rule: { column: "TAG", relation: "EQUALS", condition: "barefoot-shoes-bogo-volume" }
  },
  {
    title: "Barefoot Shoes for Summer",
    handle: "barefoot-shoes-for-summer",
    rule: { column: "TAG", relation: "EQUALS", condition: "barefoot-shoes-for-summer" }
  },
  {
    title: "Winter Collection",
    handle: "winter-collection",
    rule: { column: "TAG", relation: "EQUALS", condition: "winter-collection" }
  },
  {
    title: "Socks and Insoles",
    handle: "socks-and-insoles",
    rule: { column: "TAG", relation: "EQUALS", condition: "socks-and-insoles" }
  }
];

async function main() {
  console.log('[Catalog Seeder] Authenticating with Client Credentials...');
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
  if (!access_token) throw new Error('Could not obtain access token');
  console.log('[Catalog Seeder] Token obtained successfully!');

  const graphql = async (query, variables = {}) => {
    const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2025-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': access_token
      },
      body: JSON.stringify({ query, variables })
    });
    const json = await res.json();
    if (json.errors) {
      console.error('GraphQL Error:', JSON.stringify(json.errors, null, 2));
    }
    return json.data;
  };

  // Get Online Store Publication
  const pubRes = await graphql(`
    query {
      publications(first: 10) {
        nodes {
          id
          name
        }
      }
    }
  `);
  const onlineStorePub = pubRes?.publications?.nodes?.find(p => p.name === 'Online Store');

  // 1. Seed Collections
  console.log('\n--- SEEDING COLLECTIONS ---');
  for (const col of COLLECTIONS) {
    console.log(`Checking/Creating Collection: ${col.title}...`);
    const colRes = await graphql(`
      mutation collectionCreate($input: CollectionInput!) {
        collectionCreate(input: $input) {
          collection {
            id
            handle
            title
          }
          userErrors {
            field
            message
          }
        }
      }
    `, {
      input: {
        title: col.title,
        handle: col.handle,
        ruleSet: {
          appliedDisjunctively: false,
          rules: [col.rule]
        }
      }
    });

    if (colRes?.collectionCreate?.collection) {
      const colId = colRes.collectionCreate.collection.id;
      console.log(`✅ Collection Created: ${col.title} (${colId})`);
      if (onlineStorePub) {
        await graphql(`
          mutation publishCol($id: ID!, $input: [PublicationInput!]!) {
            publishablePublish(id: $id, input: $input) {
              userErrors { field message }
            }
          }
        `, {
          id: colId,
          input: [{ publicationId: onlineStorePub.id }]
        });
      }
    } else {
      console.log(`ℹ️ Collection may already exist: ${col.title}`);
    }
  }

  // 2. Seed Products
  console.log('\n--- SEEDING ALL PRODUCTS ---');
  for (const prod of PRODUCTS) {
    console.log(`Creating product: ${prod.title}...`);
    const prodRes = await graphql(`
      mutation createProduct($input: ProductCreateInput!) {
        productCreate(product: $input) {
          product {
            id
            handle
            title
            variants(first: 5) {
              nodes {
                id
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `, {
      input: {
        title: prod.title,
        handle: prod.handle,
        vendor: prod.vendor,
        productType: prod.productType,
        tags: prod.tags,
        status: 'ACTIVE',
        descriptionHtml: prod.description
      }
    });

    const product = prodRes?.productCreate?.product;
    if (product) {
      console.log(`✅ Created Product: ${product.title} (ID: ${product.id})`);

      // Update variant price
      if (product.variants?.nodes?.length > 0) {
        const variantId = product.variants.nodes[0].id;
        await graphql(`
          mutation updatePrice($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
            productVariantsBulkUpdate(productId: $productId, variants: $variants) {
              userErrors { field message }
            }
          }
        `, {
          productId: product.id,
          variants: [{
            id: variantId,
            price: prod.price,
            compareAtPrice: prod.compareAtPrice
          }]
        });
      }

      // Publish to Online Store
      if (onlineStorePub) {
        await graphql(`
          mutation pubProd($id: ID!, $input: [PublicationInput!]!) {
            publishablePublish(id: $id, input: $input) {
              userErrors { field message }
            }
          }
        `, {
          id: product.id,
          input: [{ publicationId: onlineStorePub.id }]
        });
      }
    } else {
      console.log(`⚠️ Skip or UserErrors on ${prod.title}:`, prodRes?.productCreate?.userErrors);
    }
  }

  console.log('\n🎉 ALL CATALOG ITEMS & COLLECTIONS SEEDED AND PUBLISHED!');
}

main().catch(console.error);
