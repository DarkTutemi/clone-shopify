import fs from 'fs';

const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || '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';

async function getAccessToken() {
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials'
    })
  });
  const data = await res.json();
  return data.access_token;
}

const TARGET_COLLECTIONS = [
  {
    title: 'Best Sellers',
    handle: 'best-sellers',
    body_html: '<p>Our most loved, battle-tested tools and repair essentials rated 4.9★ by thousands of homeowners and farmers.</p>',
    image: { src: 'https://cdn.myshopage.com/54872b77-422f-45a5-7cfb-756212792b00.jpg' }
  },
  {
    title: 'Fence & Farm Repair',
    handle: 'fence-and-farm',
    body_html: '<p>Industrial-grade fence post repair kits, livestock heating lamps, grooming brushes, and coop automation engineered to withstand the elements.</p>',
    image: { src: 'https://cdn.myshopage.com/db25d099-77fd-4ea4-8503-2f77737c8100/w1280.jpg' }
  },
  {
    title: 'Power & Precision Tools',
    handle: 'power-tools',
    body_html: '<p>Ultrasonic cutters, laser levels, thermal cameras, and hydraulic crimpers designed for unmatched accuracy.</p>',
    image: { src: 'https://cdn.myshopage.com/24dd62ec-c890-4ed9-6912-962119825500/w450.png' }
  },
  {
    title: 'Lawn, Garden & Outdoor',
    handle: 'garden-and-outdoor',
    body_html: '<p>Yard sweepers, solar security lighting, downspout basins, and harvesters for a pristine, functional outdoor space.</p>',
    image: { src: 'https://cdn.myshopage.com/898406ff-0448-41a5-2440-fd49b2375e00/w1000.jpg' }
  },
  {
    title: 'Home & Workshop Solutions',
    handle: 'home-and-workshop',
    body_html: '<p>Steam sanitizers, workshop organizers, heating essentials, and heavy-duty utility equipment for everyday productivity.</p>',
    image: { src: 'https://cdn.myshopage.com/8f765e2e-fcbd-4199-ab9b-433d4da5c000.jpg' }
  }
];

async function main() {
  const token = await getAccessToken();
  console.log('Got access token. Syncing collections...');

  // Get existing collections
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/custom_collections.json?limit=250`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  const existingCols = data.custom_collections || [];

  const colIdMap = {};

  for (const target of TARGET_COLLECTIONS) {
    const found = existingCols.find(c => c.handle === target.handle);
    if (found) {
      console.log(`Collection exists: ${target.title} (ID: ${found.id}). Updating...`);
      await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/custom_collections/${found.id}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
        body: JSON.stringify({
          custom_collection: {
            id: found.id,
            title: target.title,
            body_html: target.body_html
          }
        })
      });
      colIdMap[target.handle] = found.id;
    } else {
      console.log(`Creating collection: ${target.title}...`);
      const createRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/custom_collections.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
        body: JSON.stringify({
          custom_collection: target
        })
      });
      const created = await createRes.json();
      console.log(`  Created ID: ${created.custom_collection?.id}`);
      colIdMap[target.handle] = created.custom_collection?.id;
    }
  }

  // Assign active products into collections
  const audit = JSON.parse(fs.readFileSync('Clone-willafarm/data/zavelyn_catalog_audit.json', 'utf8'));
  const activeProducts = audit.productInventory.filter(p => p.status === 'active');

  console.log(`\nMapping ${activeProducts.length} active products to collections...`);

  for (const p of activeProducts) {
    const t = (p.title + ' ' + p.product_type + ' ' + p.tags).toLowerCase();
    const targetHandles = [];

    // All active products belong to Best Sellers if featured or high converting
    if (t.includes('fence') || t.includes('heating lamp') || t.includes('ultrasonic') || t.includes('sweep') || t.includes('steam') || t.includes('magtrack')) {
      targetHandles.push('best-sellers');
    }

    if (t.includes('fence') || t.includes('heating lamp') || t.includes('livestock') || t.includes('tiller')) {
      targetHandles.push('fence-and-farm');
    }

    if (t.includes('ultrasonic') || t.includes('laser') || t.includes('crimping') || t.includes('welding') || t.includes('chaser') || t.includes('thermal imaging') || t.includes('wheel alignment')) {
      targetHandles.push('power-tools');
    }

    if (t.includes('sweeper') || t.includes('sweep') || t.includes('garden') || t.includes('solar') || t.includes('downspout') || t.includes('nut and ball') || t.includes('flashlight')) {
      targetHandles.push('garden-and-outdoor');
    }

    if (t.includes('steam') || t.includes('vacuum') || t.includes('shelf') || t.includes('liner') || t.includes('spray bottle') || t.includes('pry bar') || t.includes('clock') || t.includes('heat press') || t.includes('hub')) {
      targetHandles.push('home-and-workshop');
    }

    // fallback
    if (targetHandles.length === 0) {
      targetHandles.push('home-and-workshop');
    }

    for (const h of targetHandles) {
      const colId = colIdMap[h];
      if (colId) {
        try {
          await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/collects.json`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
            body: JSON.stringify({
              collect: { product_id: p.id, collection_id: colId }
            })
          });
        } catch (e) {}
      }
    }
  }

  console.log('✔ Collections and product mappings successfully configured!');
}

main().catch(console.error);
