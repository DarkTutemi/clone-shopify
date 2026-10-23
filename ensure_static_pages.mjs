import fs from 'fs';

const CLIENT_ID = '82d6aaab9e73809cb37b6643302b1255';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "SHOPIFY_SECRET_TOKEN";
const SHOP_DOMAIN = 'vwpb1k-8z.myshopify.com';

async function getAccessToken() {
  const tokenRes = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials'
    })
  });
  const data = await tokenRes.json();
  return data.access_token;
}

const requiredPages = [
  { title: 'Our Story', handle: 'our-story', template_suffix: 'our-story' },
  { title: 'Customer Reviews', handle: 'customer-reviews', template_suffix: 'customer-reviews' },
  { title: 'Contact Us', handle: 'contact', template_suffix: 'contact' }
];

async function ensurePages() {
  const token = await getAccessToken();
  console.log('Got token. Checking pages on store...');

  const listRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2026-01/pages.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const listData = await listRes.json();
  const existingPages = listData.pages || [];

  for (const rp of requiredPages) {
    const existing = existingPages.find(p => p.handle === rp.handle);
    if (existing) {
      console.log(`Page "${rp.title}" already exists (ID: ${existing.id}). Updating template suffix to "${rp.template_suffix}"...`);
      await fetch(`https://${SHOP_DOMAIN}/admin/api/2026-01/pages/${existing.id}.json`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': token
        },
        body: JSON.stringify({
          page: {
            id: existing.id,
            template_suffix: rp.template_suffix
          }
        })
      });
    } else {
      console.log(`Creating page "${rp.title}" with handle "${rp.handle}" and template "${rp.template_suffix}"...`);
      const createRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2026-01/pages.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': token
        },
        body: JSON.stringify({
          page: {
            title: rp.title,
            handle: rp.handle,
            body_html: '<p></p>',
            template_suffix: rp.template_suffix
          }
        })
      });
      const createData = await createRes.json();
      console.log(`  ✔ Created page: ${createData.page?.id}`);
    }
  }
  console.log('All static pages ensured.');
}

ensurePages().catch(console.error);
