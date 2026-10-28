import fs from 'fs';
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { getAccessToken, SHOP } from './batch1_config.mjs';

async function checkShipping() {
  const token = await getAccessToken();
  const headers = {
    'X-Shopify-Access-Token': token,
    'Content-Type': 'application/json'
  };

  try {
    // REST shipping_zones.json
    const res = await fetch(`https://${SHOP}/admin/api/2024-10/shipping_zones.json`, { headers });
    const data = await res.json();
    for (const sz of data.shipping_zones || []) {
      console.log(`ZONE: ${sz.name} (id: ${sz.id})`);
      console.log('Price-based rates:', JSON.stringify(sz.price_based_shipping_rates, null, 2));
      console.log('Weight-based rates:', JSON.stringify(sz.weight_based_shipping_rates, null, 2));
      console.log('Carrier rates:', JSON.stringify(sz.carrier_shipping_rate_providers, null, 2));
    }
  } catch (err) {
    console.error('REST error:', err.message);
  }

  try {
    // GraphQL deliveryProfiles
    const query = `
      query {
        deliveryProfiles(first: 5) {
          nodes {
            id
            name
            profileLocationGroups {
              locationGroup {
                id
              }
              locationGroupZones(first: 5) {
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
    const gqlRes = await fetch(`https://${SHOP}/admin/api/2024-10/graphql.json`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query })
    });
    const gqlData = await gqlRes.json();
    console.log('DELIVERY_PROFILES_GQL:', JSON.stringify(gqlData, null, 2));
  } catch (err) {
    console.error('GQL error:', err.message);
  }
}

checkShipping();
