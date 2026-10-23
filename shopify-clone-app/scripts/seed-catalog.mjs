/**
 * Shopify Catalog & Reviews Seeder Engine
 * Uses Shopify Admin GraphQL API to upload Products, Variants, Media, Reviews & Metafields
 */
import fs from 'fs';
import path from 'path';

export async function seedCatalog({
  shopDomain,
  accessToken,
  productsDataPath,
  reviewsDataPath,
  upsellDataPath
}) {
  const endpoint = `https://${shopDomain}/admin/api/2026-10/graphql.json`;

  async function graphqlRequest(query, variables = {}) {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken
      },
      body: JSON.stringify({ query, variables })
    });
    const json = await res.json();
    if (json.errors) {
      throw new Error(`GraphQL Error: ${JSON.stringify(json.errors)}`);
    }
    return json.data;
  }

  // 1. Load data
  const rawProducts = fs.existsSync(productsDataPath) ? JSON.parse(fs.readFileSync(productsDataPath, 'utf8')) : [];
  const rawReviews = fs.existsSync(reviewsDataPath) ? JSON.parse(fs.readFileSync(reviewsDataPath, 'utf8')) : [];
  const rawUpsell = fs.existsSync(upsellDataPath) ? JSON.parse(fs.readFileSync(upsellDataPath, 'utf8')) : null;

  console.log(`[Seeder] Loaded ${rawProducts.length} products to seed into ${shopDomain}`);

  for (const prod of rawProducts) {
    console.log(`[Seeder] Seeding product: ${prod.title}`);

    // Build media sources for auto-ingestion by Shopify
    const mediaList = (prod.images || []).map((url) => ({
      originalSource: url,
      mediaContentType: 'IMAGE'
    }));

    // Product Create Mutation
    const productCreateMutation = `
      mutation createProduct($input: ProductInput!, $media: [CreateMediaInput!]) {
        productCreate(input: $input, media: $media) {
          product {
            id
            title
            handle
            variants(first: 50) {
              nodes {
                id
                title
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

    const productInput = {
      title: prod.title,
      descriptionHtml: prod.descriptionHtml || `<p>${prod.title}</p>`,
      vendor: prod.vendor || 'Clone Brand',
      productType: prod.productType || 'General',
      tags: prod.tags || ['cloned', 'best-seller'],
      status: 'ACTIVE'
    };

    const createResult = await graphqlRequest(productCreateMutation, {
      input: productInput,
      media: mediaList
    });

    if (createResult.productCreate.userErrors?.length) {
      console.warn(`[Seeder] Warning creating product:`, createResult.productCreate.userErrors);
      continue;
    }

    const createdProduct = createResult.productCreate.product;
    const productId = createdProduct.id;
    console.log(`[Seeder] Successfully created product ${productId} (${createdProduct.handle})`);

    // Attach Metafields (Reviews & Upsells)
    const metafields = [];

    if (rawReviews.length > 0) {
      metafields.push({
        ownerId: productId,
        namespace: 'custom',
        key: 'product_reviews',
        type: 'json',
        value: JSON.stringify(rawReviews)
      });
      metafields.push({
        ownerId: productId,
        namespace: 'reviews',
        key: 'rating_count',
        type: 'number_integer',
        value: String(rawReviews.length)
      });
      const avg = (rawReviews.reduce((sum, r) => sum + (r.rating || 5), 0) / rawReviews.length).toFixed(1);
      metafields.push({
        ownerId: productId,
        namespace: 'reviews',
        key: 'rating',
        type: 'rating',
        value: JSON.stringify({ value: avg, scale_min: '1.0', scale_max: '5.0' })
      });
    }

    if (rawUpsell) {
      metafields.push({
        ownerId: productId,
        namespace: 'custom',
        key: 'bundle_tiers',
        type: 'json',
        value: JSON.stringify(rawUpsell.bundles || rawUpsell)
      });
    }

    if (metafields.length > 0) {
      const metafieldsSetMutation = `
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
      `;
      await graphqlRequest(metafieldsSetMutation, { metafields });
      console.log(`[Seeder] Attached ${metafields.length} metafields to product.`);
    }
  }

  console.log(`[Seeder] Catalog seeding completed successfully.`);
}
