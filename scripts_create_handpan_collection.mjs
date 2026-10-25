const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP = 'dsdujr-vn.myshopify.com';

async function getAccessToken() {
  const res = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
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

const productIds = [15459315220665, 15459315581113, 15459318890681];

async function run() {
  const token = await getAccessToken();
  console.log('Got access token. Creating Custom Collection "Zavelyn Handpans"...');

  // Check if collection already exists
  const checkRes = await fetch(`https://${SHOP}/admin/api/2024-10/custom_collections.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const checkData = await checkRes.json();
  let collection = checkData.custom_collections.find(c => c.title.toLowerCase() === 'zavelyn handpans' || c.handle === 'zavelyn-handpans');

  if (!collection) {
    const payload = {
      custom_collection: {
        title: 'Zavelyn Handpans',
        handle: 'zavelyn-handpans',
        body_html: `
          <p>Immerse yourself in acoustic tranquility with handcrafted <strong>Zavelyn Steel Tongue Handpan Drums</strong>. Tuned with surgical precision to <strong>432 Hz</strong> natural harmonic frequencies, our instruments promote deep relaxation, mindfulness, yoga, sound therapy, and joyful musical exploration for all ages.</p>
        `,
        image: {
          src: 'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/PandaDrumPro_White.webp?v=1716783328',
          alt: 'Zavelyn Handpans Collection'
        },
        published: true
      }
    };

    const cRes = await fetch(`https://${SHOP}/admin/api/2024-10/custom_collections.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token
      },
      body: JSON.stringify(payload)
    });
    const cData = await cRes.json();
    if (!cRes.ok || !cData.custom_collection) {
      throw new Error(`Failed to create collection: ${JSON.stringify(cData)}`);
    }
    collection = cData.custom_collection;
    console.log(`  ✔ Successfully created collection: "${collection.title}" (ID: ${collection.id})`);
  } else {
    console.log(`  ℹ Collection already exists: "${collection.title}" (ID: ${collection.id})`);
  }

  // Add the 3 products to this collection via Collects API
  console.log('Adding exactly 3 Handpan products to collection...');
  for (const pId of productIds) {
    const colRes = await fetch(`https://${SHOP}/admin/api/2024-10/collects.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token
      },
      body: JSON.stringify({
        collect: {
          collection_id: collection.id,
          product_id: pId
        }
      })
    });
    const colData = await colRes.json();
    if (colRes.ok && colData.collect) {
      console.log(`  ✔ Added product ${pId} to collection`);
    } else {
      console.log(`  ℹ Product ${pId} collect response:`, JSON.stringify(colData.errors || colData));
    }
  }

  console.log('\n✔ Zavelyn Handpans collection setup complete!');
}

run().catch(console.error);
