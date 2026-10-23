import fs from 'fs';

const SHOP_DOMAIN = 'vwpb1k-8z.myshopify.com';
const CLIENT_ID = '82d6aaab9e73809cb37b6643302b1255';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "SHOPIFY_SECRET_TOKEN";

async function main() {
  console.log('[Seeder] Authenticating with Shopify Client Credentials...');
  const tokenRes = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials'
    })
  });
  const tokenData = await tokenRes.json();
  if (!tokenData.access_token) {
    throw new Error(`Failed to get access token: ${JSON.stringify(tokenData)}`);
  }
  const token = tokenData.access_token;
  console.log('[Seeder] Obtained Admin Token:', token.slice(0, 10) + '...');

  async function graphql(query, variables = {}) {
    const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2025-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token
      },
      body: JSON.stringify({ query, variables })
    });
    const json = await res.json();
    if (json.errors) {
      throw new Error(`GraphQL Error: ${JSON.stringify(json.errors)}`);
    }
    return json.data;
  }

  // 1. Get Shop & Publication IDs
  console.log('[Seeder] Fetching Shop Info and Online Store publication...');
  const shopInfo = await graphql(`
    query {
      shop {
        id
        name
        currencyCode
      }
      publications(first: 5) {
        nodes {
          id
          name
        }
      }
      locations(first: 1) {
        nodes {
          id
        }
      }
    }
  `);

  console.log('[Seeder] Shop:', shopInfo.shop.name, 'Currency:', shopInfo.shop.currencyCode);
  const onlineStorePub = shopInfo.publications.nodes.find(p => p.name === 'Online Store') || shopInfo.publications.nodes[0];

  // 2. Load Extracted Data
  const prodData = JSON.parse(fs.readFileSync('h:/Shopify-Clone/Clone-trybronoir/data/products_variants.json', 'utf8'));
  const reviewsData = JSON.parse(fs.readFileSync('h:/Shopify-Clone/Clone-trybronoir/data/reviews_and_faqs.json', 'utf8'));
  const upsellData = JSON.parse(fs.readFileSync('h:/Shopify-Clone/Clone-trybronoir/data/upsell_rules.json', 'utf8'));

  const images = [
    "https://trybronoir.com/cdn/shop/files/1_7b66df87-a2f0-4383-a0e2-63462a6ca155.webp",
    "https://trybronoir.com/cdn/shop/files/2_ef28f0ee-876b-43fe-a36c-ffdf8fe352b2.webp",
    "https://trybronoir.com/cdn/shop/files/3_572e9a2b-cf00-47b2-9a3e-ca3e84639912.webp",
    "https://trybronoir.com/cdn/shop/files/4_659a8c08-0129-4505-87c0-a7d0c3545b7f.webp"
  ];

  console.log('[Seeder] Creating Product:', prodData.title);
  const createMutation = `
    mutation createProduct($input: ProductCreateInput!, $media: [CreateMediaInput!]) {
      productCreate(product: $input, media: $media) {
        product {
          id
          title
          handle
          variants(first: 10) {
            nodes {
              id
              price
              compareAtPrice
            }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const descriptionHtml = `
    <div class="bronoir-description">
      <p><strong>Experience the Ultimate Barefoot Grounding Shoes.</strong> Designed with an anatomically wide toe box, zero-drop flexible sole, and conductive copper grounding plug for maximum natural alignment, balance, and all-day energy regulation.</p>
      <ul>
        <li><strong>Supports Natural Grounding & Body Balance</strong></li>
        <li><strong>Infused with Copper for Energy Regulation</strong></li>
        <li><strong>Barefoot Feel with Maximum Breathability</strong></li>
        <li><strong>Crafted with SkinPro™ Technology for Comfort & Support</strong></li>
      </ul>
    </div>
  `;

  const productCreateRes = await graphql(createMutation, {
    input: {
      title: prodData.title,
      vendor: 'Bronoir',
      productType: 'Barefoot Shoes',
      tags: prodData.tags,
      status: 'ACTIVE',
      descriptionHtml: descriptionHtml
    },
    media: images.map(url => ({
      originalSource: url,
      mediaContentType: 'IMAGE'
    }))
  });

  if (productCreateRes.productCreate.userErrors?.length) {
    console.error('Errors creating product:', productCreateRes.productCreate.userErrors);
    return;
  }

  const product = productCreateRes.productCreate.product;
  const productId = product.id;
  console.log('[Seeder] Product created successfully! ID:', productId, 'Handle:', product.handle);

  // 3. Update Default Variant Price
  if (product.variants.nodes.length > 0) {
    const defaultVariantId = product.variants.nodes[0].id;
    console.log('[Seeder] Updating default variant price to 2097000 VND...');
    await graphql(`
      mutation updateVariant($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
        productVariantsBulkUpdate(productId: $productId, variants: $variants) {
          productVariants {
            id
            price
            compareAtPrice
          }
          userErrors {
            field
            message
          }
        }
      }
    `, {
      productId: productId,
      variants: [{
        id: defaultVariantId,
        price: "2097000",
        compareAtPrice: "3146000"
      }]
    });
  }

  // 4. Publish Product to Online Store
  if (onlineStorePub) {
    console.log('[Seeder] Publishing product to:', onlineStorePub.name);
    await graphql(`
      mutation publishProduct($id: ID!, $input: [PublicationInput!]!) {
        publishablePublish(id: $id, input: $input) {
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
      }
    `, {
      id: productId,
      input: [{ publicationId: onlineStorePub.id }]
    });
  }

  // 5. Attach Metafields (Reviews & Bundle Tiers)
  console.log('[Seeder] Attaching Reviews & Bundle Metafields...');
  const metafields = [
    {
      ownerId: productId,
      namespace: 'custom',
      key: 'product_reviews',
      type: 'json',
      value: JSON.stringify(reviewsData.reviews)
    },
    {
      ownerId: productId,
      namespace: 'custom',
      key: 'bundle_tiers',
      type: 'json',
      value: JSON.stringify(upsellData.bundles)
    },
    {
      ownerId: productId,
      namespace: 'reviews',
      key: 'rating_count',
      type: 'number_integer',
      value: "12898"
    },
    {
      ownerId: productId,
      namespace: 'reviews',
      key: 'rating',
      type: 'rating',
      value: JSON.stringify({ value: "4.5", scale_min: "1.0", scale_max: "5.0" })
    }
  ];

  await graphql(`
    mutation setMetafields($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields {
          id
          key
        }
        userErrors {
          field
          message
        }
      }
    }
  `, { metafields });

  console.log('🎉 [Seeder] SEEDING COMPLETE! Product is active on store catalog!');
  console.log('Product URL: https://' + SHOP_DOMAIN + '/products/' + product.handle);
}

main().catch(console.error);
