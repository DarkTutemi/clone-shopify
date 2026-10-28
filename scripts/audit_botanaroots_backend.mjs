import fs from 'fs';
import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

async function auditBotanaRoots() {
  console.log('========================================================================');
  console.log('AUDIT BOTANAROOTS BACKEND & STORE CONFIGURATION');
  console.log('========================================================================\n');

  const token = await getAccessToken();
  const headers = {
    'X-Shopify-Access-Token': token,
    'Content-Type': 'application/json'
  };

  // 1. Audit Themes
  console.log('1. Checking Themes...');
  const themesRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes.json`, { headers });
  const themesData = await themesRes.json();
  console.log('Themes:');
  for (const t of themesData.themes) {
    console.log(`- ID: ${t.id} | Name: "${t.name}" | Role: "${t.role}"`);
  }
  const liveTheme = themesData.themes.find(t => t.role === 'main');
  console.log(`Current Live Theme: ID ${liveTheme?.id} ("${liveTheme?.name}")\n`);

  // 2. Fetch Product Data for BotanaRoots
  console.log('2. Fetching BotanaRoots Product via GraphQL...');
  const query = `
    query getProduct($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        handle
        status
        templateSuffix
        descriptionHtml
        vendor
        productType
        totalInventory
        options {
          id
          name
          values
        }
        variants(first: 50) {
          nodes {
            id
            title
            sku
            price
            compareAtPrice
            inventoryQuantity
            selectedOptions {
              name
              value
            }
          }
        }
        images(first: 20) {
          nodes {
            id
            url
            altText
            width
            height
          }
        }
      }
    }
  `;

  const gqlRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query,
      variables: { handle: 'zavelyn-botanaroots-organic-batana-hair-growth-oil' }
    })
  });
  const gqlData = await gqlRes.json();
  const product = gqlData.data?.productByHandle;

  if (!product) {
    console.error('Product not found by handle!');
  } else {
    console.log(`Product ID: ${product.id}`);
    console.log(`Title: ${product.title}`);
    console.log(`Handle: ${product.handle}`);
    console.log(`Status: ${product.status}`);
    console.log(`Template Suffix: ${product.templateSuffix || '(default product.json)'}`);
    console.log(`Total Inventory: ${product.totalInventory}`);
    console.log('\nOptions:');
    product.options.forEach(o => console.log(`- ${o.name}: [${o.values.join(', ')}]`));
    console.log('\nVariants:');
    product.variants.nodes.forEach(v => {
      console.log(`- ID: ${v.id} | Title: "${v.title}" | SKU: ${v.sku} | Price: $${v.price} | Compare: $${v.compareAtPrice || 'N/A'} | Inv: ${v.inventoryQuantity} | Options: ${JSON.stringify(v.selectedOptions)}`);
    });
    console.log(`\nImages count: ${product.images.nodes.length}`);
  }

  // 3. Check Discounts
  console.log('\n3. Checking Automatic Discounts & Codes...');
  const discQuery = `
    query {
      discountNodes(first: 20) {
        nodes {
          id
          discount {
            __typename
            ... on DiscountAutomaticApp {
              title
              status
            }
            ... on DiscountAutomaticBasic {
              title
              status
              summary
            }
            ... on DiscountAutomaticBxgy {
              title
              status
              summary
            }
            ... on DiscountAutomaticFreeShipping {
              title
              status
              summary
            }
            ... on DiscountCodeBasic {
              title
              status
              summary
            }
          }
        }
      }
    }
  `;
  const discRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query: discQuery })
  });
  const discData = await discRes.json();
  const discounts = discData.data?.discountNodes?.nodes || [];
  console.log(`Found ${discounts.length} discounts:`);
  discounts.forEach(d => {
    console.log(`- Typename: ${d.discount.__typename} | Title: "${d.discount.title}" | Status: ${d.discount.status}`);
  });

  // 4. Check Shipping Configuration (Free shipping threshold / Standard shipping)
  console.log('\n4. Checking Shipping Profiles / Delivery Profiles...');
  const shipQuery = `
    query {
      deliveryProfiles(first: 10) {
        nodes {
          id
          name
          default
          profileLocationGroups {
            locationGroup {
              id
            }
            locationGroupZones(first: 10) {
              nodes {
                zone {
                  id
                  name
                  countries {
                    code {
                      countryCode
                    }
                  }
                }
                methodDefinitions(first: 10) {
                  nodes {
                    id
                    name
                    active
                    rateProvider {
                      __typename
                      ... on DeliveryRateDefinition {
                        price {
                          amount
                          currencyCode
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
  const shipRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query: shipQuery })
  });
  const shipData = await shipRes.json();
  const profiles = shipData.data?.deliveryProfiles?.nodes || [];
  console.log(`Found ${profiles.length} delivery profiles:`);
  profiles.forEach(p => {
    console.log(`Profile: ${p.name} (default: ${p.default})`);
    p.profileLocationGroups.forEach(lg => {
      lg.locationGroupZones.nodes.forEach(z => {
        console.log(`  Zone: ${z.zone.name}`);
        z.methodDefinitions.nodes.forEach(m => {
          console.log(`    Method: ${m.name} | Active: ${m.active} | Rate: $${m.rateProvider?.price?.amount || 'N/A'}`);
        });
      });
    });
  });

  // Save audit data
  const result = {
    themes: themesData.themes,
    product,
    discounts,
    deliveryProfiles: profiles
  };
  fs.writeFileSync('scripts/botanaroots_backend_audit.json', JSON.stringify(result, null, 2));
  console.log('\nAudit complete! Saved to scripts/botanaroots_backend_audit.json');
}

auditBotanaRoots();
