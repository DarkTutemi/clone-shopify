import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { getAccessToken, SHOP } from './batch1_config.mjs';

const API_VERSION = '2026-10';
const PRODUCT_ID = 'gid://shopify/Product/15469942145209';
const FIRST_VARIANT_ID = 'gid://shopify/ProductVariant/68035793158329';

async function configureVariants() {
  const token = await getAccessToken();
  const headers = {
    'X-Shopify-Access-Token': token,
    'Content-Type': 'application/json'
  };

  // 1. Update the first variant (Buy 4 Get 4 FREE / 60ml)
  console.log('1. Updating first variant (Buy 4 Get 4 FREE / 60ml)...');
  const updateMutation = `
    mutation productVariantsBulkUpdate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        productVariants {
          id
          title
          price
          sku
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const updateVars = {
    productId: PRODUCT_ID,
    variants: [
      {
        id: FIRST_VARIANT_ID,
        price: '159.96',
        compareAtPrice: '319.92',
        inventoryPolicy: 'CONTINUE',
        inventoryItem: {
          sku: 'ZAV-BTR-BOGO-8X60-PURE',
          tracked: false
        }
      }
    ]
  };

  const updateRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query: updateMutation, variables: updateVars })
  });
  const updateData = await updateRes.json();
  console.log('Update first variant result:', JSON.stringify(updateData, null, 2));

  // 2. Create the remaining 5 variants using productVariantsBulkCreate
  console.log('2. Creating remaining 5 variants...');
  const createMutation = `
    mutation productVariantsBulkCreate($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkCreate(productId: $productId, variants: $variants) {
        productVariants {
          id
          title
          price
          sku
          selectedOptions {
            name
            value
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const newVariantsInput = [
    {
      optionValues: [
        { optionName: 'Offer', name: 'Buy 4 Get 4 FREE' },
        { optionName: 'Bottle Size', name: '120ml' }
      ],
      price: '239.96',
      compareAtPrice: '479.92',
      inventoryPolicy: 'CONTINUE',
      inventoryItem: {
        sku: 'ZAV-BTR-BOGO-8X120-PURE',
        tracked: false
      }
    },
    {
      optionValues: [
        { optionName: 'Offer', name: 'Buy 2 Get 2 FREE' },
        { optionName: 'Bottle Size', name: '60ml' }
      ],
      price: '79.98',
      compareAtPrice: '159.96',
      inventoryPolicy: 'CONTINUE',
      inventoryItem: {
        sku: 'ZAV-BTR-BOGO-4X60-PURE',
        tracked: false
      }
    },
    {
      optionValues: [
        { optionName: 'Offer', name: 'Buy 2 Get 2 FREE' },
        { optionName: 'Bottle Size', name: '120ml' }
      ],
      price: '119.98',
      compareAtPrice: '239.96',
      inventoryPolicy: 'CONTINUE',
      inventoryItem: {
        sku: 'ZAV-BTR-BOGO-4X120-PURE',
        tracked: false
      }
    },
    {
      optionValues: [
        { optionName: 'Offer', name: 'Buy 1' },
        { optionName: 'Bottle Size', name: '60ml' }
      ],
      price: '39.99',
      compareAtPrice: '79.98',
      inventoryPolicy: 'CONTINUE',
      inventoryItem: {
        sku: 'ZAV-BTR-BOGO-1X60-PURE',
        tracked: false
      }
    },
    {
      optionValues: [
        { optionName: 'Offer', name: 'Buy 1' },
        { optionName: 'Bottle Size', name: '120ml' }
      ],
      price: '49.99',
      compareAtPrice: '99.98',
      inventoryPolicy: 'CONTINUE',
      inventoryItem: {
        sku: 'ZAV-BTR-BOGO-1X120-PURE',
        tracked: false
      }
    }
  ];

  const createRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query: createMutation, variables: { productId: PRODUCT_ID, variants: newVariantsInput } })
  });
  const createData = await createRes.json();
  console.log('Create variants result:', JSON.stringify(createData, null, 2));
}

configureVariants().catch(console.error);
