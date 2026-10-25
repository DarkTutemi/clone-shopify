import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "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";
const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';

async function listProducts() {
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
  
  const query = `
    {
      products(first: 100) {
        edges {
          node {
            id
            handle
            title
            productType
            tags
          }
        }
      }
    }
  `;
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': access_token
    },
    body: JSON.stringify({ query })
  });
  const data = await res.json();
  const prods = data.data.products.edges.map(e => e.node);
  console.log('Total store products:', prods.length);

  // Group by category
  const groups = {
    ballerinas: [],
    sandals: [],
    winter_boots: [],
    force: [],
    limited: [],
    vista: [],
    barefoot_sneakers: []
  };

  for (const p of prods) {
    const h = p.handle.toLowerCase();
    if (h.includes('ballerina') || h.includes('nola') || h.includes('lift')) {
      groups.ballerinas.push(h);
    } else if (h.includes('sandal') || h.includes('ayelith') || h.includes('myava') || h.includes('stridea')) {
      groups.sandals.push(h);
    } else if (h.includes('warmer') || h.includes('winter') || h.includes('arctic') || h.includes('snowpiercer') || h.includes('fleece') || h.includes('cosycloud') || h.includes('insulated') || h.includes('high-pro')) {
      groups.winter_boots.push(h);
    } else if (h.includes('force')) {
      groups.force.push(h);
    } else if (h.includes('limited')) {
      groups.limited.push(h);
    } else if (h.includes('vista')) {
      groups.vista.push(h);
    } else {
      groups.barefoot_sneakers.push(h);
    }
  }

  console.log('Group counts:', {
    ballerinas: groups.ballerinas.length,
    sandals: groups.sandals.length,
    winter_boots: groups.winter_boots.length,
    force: groups.force.length,
    limited: groups.limited.length,
    vista: groups.vista.length,
    barefoot_sneakers: groups.barefoot_sneakers.length
  });

  fs.writeFileSync('all_store_products_grouped.json', JSON.stringify({ prods, groups }, null, 2));
}

listProducts();
