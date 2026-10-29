import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { getAccessToken, SHOP } from './batch1_config.mjs';

async function checkShipping() {
  const token = await getAccessToken();
  const query = `
  query {
    deliveryProfiles(first: 5) {
      edges {
        node {
          id
          name
          default
          profileLocationGroups {
            locationGroupZones(first: 10) {
              edges {
                node {
                  zone {
                    name
                  }
                  methodDefinitions(first: 10) {
                    edges {
                      node {
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
                        methodConditions {
                          field
                          operator
                          conditionCriteria {
                            __typename
                            ... on MoneyV2 {
                              amount
                              currencyCode
                            }
                            ... on Weight {
                              value
                              unit
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
      }
    }
  }`;

  const res = await fetch(`https://${SHOP}/admin/api/2024-01/graphql.json`, {
    method: 'POST',
    headers: { 'X-Shopify-Access-Token': token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

checkShipping().catch(console.error);
