import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP = 'dsdujr-vn.myshopify.com';
const THEME_ID = '186607567033';

async function getAccessToken() {
  const tRes = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await tRes.json();
  return data.access_token;
}

async function fixNavAndRedirects() {
  const token = await getAccessToken();

  // 1. Fetch header-group.json
  console.log('Fetching sections/header-group.json...');
  const assetRes = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${THEME_ID}/assets.json?asset[key]=sections/header-group.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const assetData = await assetRes.json();
  const headerGroup = JSON.parse(assetData.asset.value);

  // Update navigation blocks inside header-group
  let modified = false;
  for (const [secKey, secVal] of Object.entries(headerGroup.sections)) {
    if (secVal.blocks) {
      for (const [bKey, bVal] of Object.entries(secVal.blocks)) {
        if (bVal.settings?.link === '/collections/handpans') {
          console.log(`Fixing handpan link in block ${bKey}`);
          bVal.settings.link = '/collections/zavelyn-handpans';
          modified = true;
        }
        if (bVal.settings?.link === '/collections/fence-farm') {
          console.log(`Fixing fence-farm link in block ${bKey}`);
          bVal.settings.link = '/collections/fence-and-farm';
          modified = true;
        }
      }
    }
  }

  if (modified) {
    console.log('Updating sections/header-group.json on theme...');
    const putRes = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${THEME_ID}/assets.json`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token
      },
      body: JSON.stringify({
        asset: {
          key: 'sections/header-group.json',
          value: JSON.stringify(headerGroup, null, 2)
        }
      })
    });
    const putData = await putRes.json();
    console.log('✔ Updated header-group.json:', putData.asset?.key ? 'SUCCESS' : putData);
  } else {
    console.log('No modifications needed in header-group.json');
  }

  // 2. Create 301 URL Redirects in Shopify
  console.log('\nConfiguring 301 redirects in Shopify...');
  const redirects = [
    { path: '/collections/handpans', target: '/collections/zavelyn-handpans' },
    { path: '/collections/fence-farm', target: '/collections/fence-and-farm' }
  ];

  // List existing redirects first
  const existingRedRes = await fetch(`https://${SHOP}/admin/api/2024-10/redirects.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const existingData = await existingRedRes.json();
  const existingList = existingData.redirects || [];

  for (const r of redirects) {
    const exists = existingList.find(x => x.path === r.path);
    if (exists) {
      console.log(`Redirect for ${r.path} -> ${exists.target} already exists (ID: ${exists.id})`);
      if (exists.target !== r.target) {
        console.log(`Updating redirect ${exists.id} to ${r.target}...`);
        await fetch(`https://${SHOP}/admin/api/2024-10/redirects/${exists.id}.json`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': token
          },
          body: JSON.stringify({ redirect: { id: exists.id, target: r.target } })
        });
      }
    } else {
      console.log(`Creating redirect: ${r.path} -> ${r.target}`);
      const createRes = await fetch(`https://${SHOP}/admin/api/2024-10/redirects.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': token
        },
        body: JSON.stringify({ redirect: r })
      });
      const created = await createRes.json();
      console.log('Created:', created.redirect?.id ? 'SUCCESS' : created);
    }
  }

  console.log('\n✔ Verification:');
  for (const r of redirects) {
    const res = await fetch(`https://${SHOP}${r.path}`, { redirect: 'manual' });
    console.log(`${r.path} HTTP Status: ${res.status} Location: ${res.headers.get('location')}`);
  }
}

fixNavAndRedirects();
