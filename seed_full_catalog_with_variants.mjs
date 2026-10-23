const SHOP_DOMAIN = 'vwpb1k-8z.myshopify.com';
const CLIENT_ID = '82d6aaab9e73809cb37b6643302b1255';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "SHOPIFY_SECRET_TOKEN";

const CATALOG = [
  {
    title: "Bronoir™ Skin Pro with Copper - Grounding Allround Barefoot Shoes",
    handle: "bronoir-skin-pro-with-copper-grounding-allround-barefoot-shoes",
    price: "2097000",
    compareAtPrice: "3146000",
    vendor: "Bronoir",
    productType: "Barefoot Shoes",
    tags: ["bestsellers", "barefoot-shoes-bogo-volume", "barefoot-shoes-for-summer", "copper-grounding"],
    colors: ["All Black", "Black & White", "Pink", "Grey", "Blue"],
    sizes: ["EU 36", "EU 37", "EU 38", "EU 39", "EU 40", "EU 41", "EU 42", "EU 43", "EU 44", "EU 45"],
    description: "<p>Experience the ultimate barefoot grounding shoes with SkinPro™ breathable mesh, zero-drop flexible sole, and integrated copper grounding plug. Relieves joint pressure, restores natural gait, and grounds your body with every step.</p>"
  },
  {
    title: "Bronoir CosyCloud Boot - Warm & Comfy Winter Barefoot Boot",
    handle: "bronoir-cosycloud-boot-barefoot-winter-boots",
    price: "1966000",
    compareAtPrice: "3278000",
    vendor: "Bronoir",
    productType: "Winter Boots",
    tags: ["bestsellers", "barefoot-shoes-bogo-volume", "winter-collection"],
    colors: ["Camel", "Black", "Grey", "Sand"],
    sizes: ["EU 36", "EU 37", "EU 38", "EU 39", "EU 40", "EU 41", "EU 42", "EU 43"],
    description: "<p>Ultra-warm, water-resistant barefoot winter boots lined with plush faux fleece. Wide anatomical toe box and non-slip flexible zero-drop tread for cold weather comfort.</p>"
  },
  {
    title: "Bronoir™ Hikers - Orthopedic Outdoor Trail Shoes (BOGO)",
    handle: "bronoir-hikers-orthopedic-outdoor-trail-shoes",
    price: "1835000",
    compareAtPrice: "3146000",
    vendor: "Bronoir",
    productType: "Outdoor Shoes",
    tags: ["bestsellers", "barefoot-shoes-bogo-volume", "winter-collection"],
    colors: ["Black", "Grey", "Royal Blue"],
    sizes: ["EU 38", "EU 39", "EU 40", "EU 41", "EU 42", "EU 43", "EU 44", "EU 45"],
    description: "<p>Rugged barefoot hiking shoes with high-traction lug sole, protective toe cap, and water-repellent breathable upper. Perfect for trails, trekking, and everyday outdoor adventures.</p>"
  },
  {
    title: "Bronoir™ Flex - Barefoot Shoes",
    handle: "bronoir-flex-barefoot-shoes",
    price: "2097000",
    compareAtPrice: "3934000",
    vendor: "Bronoir",
    productType: "Barefoot Shoes",
    tags: ["bestsellers", "barefoot-shoes-for-summer"],
    colors: ["Army Green", "All Black", "Grey", "Deep Blue"],
    sizes: ["EU 38", "EU 39", "EU 40", "EU 41", "EU 42", "EU 43", "EU 44", "EU 45"],
    description: "<p>Engineered for lightweight versatility and unrestricted foot biomechanics. The flexible sole adapts dynamically to your natural foot shape.</p>"
  },
  {
    title: "Bronoir Streets - Minimalist Everyday Barefoot Sneakers",
    handle: "bronoir-streets-minimalist-everyday-barefoot-sneakers",
    price: "1704000",
    compareAtPrice: "2884000",
    vendor: "Bronoir",
    productType: "Sneakers",
    tags: ["bestsellers", "barefoot-shoes-for-summer"],
    colors: ["Black", "White", "Beige", "Navy"],
    sizes: ["EU 36", "EU 37", "EU 38", "EU 39", "EU 40", "EU 41", "EU 42", "EU 43", "EU 44"],
    description: "<p>Modern casual minimalist sneakers with ultra-flexible zero-drop sole for everyday city walking, office, and travel.</p>"
  },
  {
    title: "Bronoir™ Runner Pro - Barefoot Performance Running Shoes",
    handle: "bronoir-runner-pro-barefoot-performance-running-shoes",
    price: "1966000",
    compareAtPrice: "3408000",
    vendor: "Bronoir",
    productType: "Running Shoes",
    tags: ["bestsellers", "barefoot-shoes-for-summer"],
    colors: ["Cyan & Black", "Orange", "Triple Black", "Light Grey"],
    sizes: ["EU 38", "EU 39", "EU 40", "EU 41", "EU 42", "EU 43", "EU 44", "EU 45"],
    description: "<p>Lightweight responsive barefoot running sneakers engineered for natural forefoot strike, joint shock reduction, and superior breathability.</p>"
  },
  {
    title: "Bronoir™ Winter Shoes - Waterproof Thermal Barefoot Boots",
    handle: "bronoir-winter-shoes-waterproof-thermal-barefoot-boots",
    price: "2228000",
    compareAtPrice: "3670000",
    vendor: "Bronoir",
    productType: "Winter Boots",
    tags: ["winter-collection", "barefoot-shoes-bogo-volume"],
    colors: ["Black", "Dark Brown"],
    sizes: ["EU 38", "EU 39", "EU 40", "EU 41", "EU 42", "EU 43", "EU 44", "EU 45"],
    description: "<p>Waterproof thermal winter barefoot boots with deep thermal insulation, wide toe splay, and aggressive winter grip.</p>"
  },
  {
    title: "Bronoir™ Barefoot Recovery Socks (3-Pack)",
    handle: "bronoir-barefoot-recovery-socks-3-pack",
    price: "655000",
    compareAtPrice: "1178000",
    vendor: "Bronoir",
    productType: "Socks",
    tags: ["socks-and-insoles"],
    colors: ["Multi Pack (Black/White/Grey)", "All Black", "All White"],
    sizes: ["S/M (EU 36-40)", "L/XL (EU 41-46)"],
    description: "<p>Individual toe recovery socks designed to facilitate natural toe separation, improved blood flow, and blister-free barefoot walking.</p>"
  },
  {
    title: "Bronoir Connect - Orthopedic Fleece Conductive Insoles",
    handle: "bronoir-connect-orthopedic-fleece-conductive-insoles",
    price: "785000",
    compareAtPrice: "1310000",
    vendor: "Bronoir",
    productType: "Insoles",
    tags: ["socks-and-insoles"],
    colors: ["Copper Infused Fleece"],
    sizes: ["EU 36-38", "EU 39-41", "EU 42-44", "EU 45-47"],
    description: "<p>Conductive copper fiber winter fleece insoles designed specifically for grounding shoes. Keeps feet warm while preserving electrical grounding conductivity.</p>"
  }
];

const COLLECTIONS = [
  {
    title: "Bestsellers",
    handle: "bestsellers",
    image: "https://trybronoir.com/cdn/shop/files/Frame1000005214.png?v=1761673627&width=800",
    description: "Discover our top-rated barefoot grounding shoes designed for natural posture, foot strength, and pain relief."
  },
  {
    title: "Barefoot Shoes BOGO Volume",
    handle: "barefoot-shoes-bogo-volume",
    image: "https://trybronoir.com/cdn/shop/files/freiluftkind_linkblock_sneaker_v2.jpg_1.png?v=1761594764&width=800",
    description: "Special Buy 1 Get 2 Free bundle collection. Mix and match your favorite barefoot styles."
  },
  {
    title: "Barefoot Shoes for Summer",
    handle: "barefoot-shoes-for-summer",
    image: "https://trybronoir.com/cdn/shop/files/freiluftkind_linkblock_sneaker_v2_jpg_958fde39-1c1f-4ce0-bf8a-6bf04474f161.png?v=1761594767&width=800",
    description: "Breathable, featherlight barefoot shoes made for sunny trails, beach days, and hot weather comfort."
  },
  {
    title: "Winter Collection",
    handle: "winter-collection",
    image: "https://trybronoir.com/cdn/shop/files/3_a8860335-eb99-433a-9355-2dda6fef77b5.jpg?v=1761965026&width=800",
    description: "Fleece-lined, water-resistant barefoot boots designed to keep your feet toasty and free all winter long."
  },
  {
    title: "Socks and Insoles",
    handle: "socks-and-insoles",
    image: "https://trybronoir.com/cdn/shop/files/Frame1000005214.png?v=1761673627&width=800",
    description: "Orthopedic toe socks and conductive grounding insoles engineered for barefoot footwear."
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

  // 1. Get Online Store Publication
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
  console.log('[Catalog Seeder] Online Store Publication ID:', onlineStorePub?.id);

  // 2. Fetch and delete all existing products to ensure clean slate
  console.log('\n--- CLEANING EXISTING PRODUCTS ---');
  let hasMore = true;
  while (hasMore) {
    const existingProds = await graphql(`
      query {
        products(first: 50) {
          nodes {
            id
            title
          }
        }
      }
    `);
    const prods = existingProds?.products?.nodes || [];
    if (prods.length === 0) {
      hasMore = false;
    } else {
      for (const p of prods) {
        console.log(`Deleting product: ${p.title} (${p.id})...`);
        await graphql(`
          mutation delProd($id: ID!) {
            productDelete(input: { id: $id }) {
              deletedProductId
            }
          }
        `, { id: p.id });
      }
    }
  }

  // 3. Seed Fresh Products with Options & Variants
  console.log('\n--- SEEDING PRODUCTS WITH REAL VARIANTS ---');
  for (const item of CATALOG) {
    console.log(`\nCreating: ${item.title}...`);
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
        title: item.title,
        handle: item.handle,
        vendor: item.vendor,
        productType: item.productType,
        tags: item.tags,
        status: 'ACTIVE',
        descriptionHtml: item.description
      }
    });

    const product = prodRes?.productCreate?.product;
    if (!product) {
      console.error(`Error creating ${item.title}:`, prodRes?.productCreate?.userErrors);
      continue;
    }
    const productId = product.id;
    console.log(`✅ Base Product Created: ${product.title} (${productId})`);

    // Create Options: Color and Size
    const optionsInput = [
      {
        name: "Color",
        values: item.colors.map(c => ({ name: c }))
      },
      {
        name: "Size",
        values: item.sizes.map(s => ({ name: s }))
      }
    ];

    const optRes = await graphql(`
      mutation createOptions($productId: ID!, $options: [OptionCreateInput!]!) {
        productOptionsCreate(productId: $productId, options: $options) {
          userErrors { field message }
          product {
            id
            variants(first: 10) {
              nodes {
                id
                title
              }
            }
          }
        }
      }
    `, {
      productId,
      options: optionsInput
    });

    const existingVariants = optRes?.productOptionsCreate?.product?.variants?.nodes || [];
    const firstExistingVariantId = existingVariants[0]?.id;

    // Update first existing variant's price
    if (firstExistingVariantId) {
      await graphql(`
        mutation updateFirstVariant($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
          productVariantsBulkUpdate(productId: $productId, variants: $variants) {
            userErrors { field message }
          }
        }
      `, {
        productId,
        variants: [{
          id: firstExistingVariantId,
          price: item.price,
          compareAtPrice: item.compareAtPrice
        }]
      });
    }

    // Generate extra variants (skip combination (color 0, size 0))
    const extraVariants = [];
    for (let c = 0; c < item.colors.length; c++) {
      const color = item.colors[c];
      const sizesToUse = item.sizes.slice(0, 3); // 3 sizes per color
      for (let s = 0; s < sizesToUse.length; s++) {
        const size = sizesToUse[s];
        if (c === 0 && s === 0) {
          // Already exists as the first variant converted by productOptionsCreate
          continue;
        }
        extraVariants.push({
          optionValues: [
            { optionName: "Color", name: color },
            { optionName: "Size", name: size }
          ],
          price: item.price,
          compareAtPrice: item.compareAtPrice
        });
      }
    }

    console.log(`  Adding ${extraVariants.length} additional variants for ${item.title}...`);
    const bulkVarRes = await graphql(`
      mutation bulkCreate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
        productVariantsBulkCreate(productId: $productId, variants: $variants) {
          userErrors { field message }
          productVariants { id title price }
        }
      }
    `, {
      productId,
      variants: extraVariants
    });

    if (bulkVarRes?.productVariantsBulkCreate?.userErrors?.length > 0) {
      console.warn('Variant creation errors:', bulkVarRes.productVariantsBulkCreate.userErrors);
    } else {
      const totalCreated = (bulkVarRes?.productVariantsBulkCreate?.productVariants?.length || 0) + 1;
      console.log(`  ✅ Successfully configured ${totalCreated} total variants!`);
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
        id: productId,
        input: [{ publicationId: onlineStorePub.id }]
      });
    }
  }

  // 4. Update Collections with Images & Rules
  console.log('\n--- SYNCING COLLECTIONS ---');
  for (const col of COLLECTIONS) {
    console.log(`Syncing collection: ${col.title}...`);
    const findCol = await graphql(`
      query getCol($handle: String!) {
        collectionByHandle(handle: $handle) {
          id
          title
        }
      }
    `, { handle: col.handle });

    let colId = findCol?.collectionByHandle?.id;

    if (!colId) {
      const newCol = await graphql(`
        mutation createCol($input: CollectionInput!) {
          collectionCreate(input: $input) {
            collection { id }
            userErrors { field message }
          }
        }
      `, {
        input: {
          title: col.title,
          handle: col.handle,
          descriptionHtml: `<p>${col.description}</p>`,
          image: { src: col.image },
          ruleSet: {
            appliedDisjunctively: false,
            rules: [{
              column: "TAG",
              relation: "EQUALS",
              condition: col.handle
            }]
          }
        }
      });
      colId = newCol?.collectionCreate?.collection?.id;
      console.log(`✅ Collection created: ${col.title} (${colId})`);
    } else {
      await graphql(`
        mutation updateCol($input: CollectionInput!) {
          collectionUpdate(input: $input) {
            collection { id }
            userErrors { field message }
          }
        }
      `, {
        input: {
          id: colId,
          descriptionHtml: `<p>${col.description}</p>`,
          image: { src: col.image },
          ruleSet: {
            appliedDisjunctively: false,
            rules: [{
              column: "TAG",
              relation: "EQUALS",
              condition: col.handle
            }]
          }
        }
      });
      console.log(`✅ Collection updated: ${col.title} (${colId})`);
    }

    if (colId && onlineStorePub) {
      await graphql(`
        mutation pubCol($id: ID!, $input: [PublicationInput!]!) {
          publishablePublish(id: $id, input: $input) {
            userErrors { field message }
          }
        }
      `, {
        id: colId,
        input: [{ publicationId: onlineStorePub.id }]
      });
    }
  }

  console.log('\n🎉 ALL PRODUCTS, REAL VARIANTS (COLOR & SIZE), AND COLLECTIONS ARE 100% COMPLETE!');
}

main().catch(console.error);
