import fs from 'fs';

const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || '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';

async function getAccessToken() {
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await res.json();
  return data.access_token;
}

async function shopifyGraphQL(token, query, variables = {}) {
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({ query, variables })
  });
  return await res.json();
}

async function run() {
  const token = await getAccessToken();

  // Create 50% OFF Code Discount
  const create50Mutation = `
    mutation discountCodeBasicCreate($basicCodeDiscount: DiscountCodeBasicInput!) {
      discountCodeBasicCreate(basicCodeDiscount: $basicCodeDiscount) {
        codeDiscountNode {
          id
          codeDiscount {
            ... on DiscountCodeBasic {
              title
              codes(first: 5) { edges { node { code } } }
              status
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

  const startsAt = new Date().toISOString();

  // 1. Create 50% OFF Discount Code: SAVE50
  const input50 = {
    title: "50% OFF TODAY - Storewide Special",
    code: "SAVE50",
    startsAt: startsAt,
    customerGets: {
      value: {
        percentage: 0.50
      },
      items: {
        all: true
      }
    },
    appliesOncePerCustomer: false,
    combinesWith: {
      productDiscounts: true,
      orderDiscounts: true,
      shippingDiscounts: true
    }
  };

  const res50 = await shopifyGraphQL(token, create50Mutation, { basicCodeDiscount: input50 });
  console.log('Result 50% (SAVE50):', JSON.stringify(res50, null, 2));

  // 2. Also create ZAVELYN50 and 50OFF codes
  for (const extraCode of ["50OFF", "ZAVELYN50"]) {
    const input = {
      ...input50,
      title: `${extraCode} - 50% OFF Storewide`,
      code: extraCode
    };
    const res = await shopifyGraphQL(token, create50Mutation, { basicCodeDiscount: input });
    console.log(`Result (${extraCode}):`, JSON.stringify(res, null, 2));
  }

  // 3. Create EXTRA10 Bundle Discount Code
  const input10 = {
    title: "BEST VALUE - Extra 10% OFF Bundle",
    code: "EXTRA10",
    startsAt: startsAt,
    customerGets: {
      value: {
        percentage: 0.10
      },
      items: {
        all: true
      }
    },
    appliesOncePerCustomer: false,
    combinesWith: {
      productDiscounts: true,
      orderDiscounts: true,
      shippingDiscounts: true
    }
  };
  const res10 = await shopifyGraphQL(token, create50Mutation, { basicCodeDiscount: input10 });
  console.log('Result Extra 10% (EXTRA10):', JSON.stringify(res10, null, 2));

  // 4. Create LAMP10 code
  const inputLamp10 = {
    ...input10,
    title: "Livestock Heating Lamp - Extra 10% OFF",
    code: "LAMP10"
  };
  const resLamp10 = await shopifyGraphQL(token, create50Mutation, { basicCodeDiscount: inputLamp10 });
  console.log('Result LAMP10:', JSON.stringify(resLamp10, null, 2));

  // 5. Create Free Shipping Automatic Discount over $49
  const freeShippingMutation = `
    mutation discountAutomaticFreeShippingCreate($freeShippingAutomaticDiscount: DiscountAutomaticFreeShippingInput!) {
      discountAutomaticFreeShippingCreate(freeShippingAutomaticDiscount: $freeShippingAutomaticDiscount) {
        automaticDiscountNode {
          id
          automaticDiscount {
            ... on DiscountAutomaticFreeShipping {
              title
              status
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

  const freeShipInput = {
    title: "Free US Shipping Over $49",
    startsAt: startsAt,
    minimumRequirement: {
      subtotal: {
        greaterThanOrEqualToSubtotal: "49.00"
      }
    },
    destinationSelection: {
      all: true
    },
    combinesWith: {
      productDiscounts: true,
      orderDiscounts: true
    }
  };
  const resFreeShip = await shopifyGraphQL(token, freeShippingMutation, { freeShippingAutomaticDiscount: freeShipInput });
  console.log('Result Free Shipping ($49+):', JSON.stringify(resFreeShip, null, 2));
}

run().catch(console.error);
