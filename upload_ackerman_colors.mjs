import fs from 'fs';
import path from 'path';

const THEME_ID = '186607567033';
const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';

async function getAccessToken() {
  const tokenRes = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await tokenRes.json();
  return data.access_token;
}

async function uploadThemeAsset(token, filename, buffer) {
  const base64 = buffer.toString('base64');
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-01/themes/${THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      asset: {
        key: `assets/${filename}`,
        attachment: base64
      }
    })
  });
  const data = await res.json();
  if (data.errors) throw new Error(`Asset upload error: ${JSON.stringify(data.errors)}`);
  return data.asset.public_url;
}

async function main() {
  const token = await getAccessToken();
  const dir = 'ackerman_media';
  const colors = [
    { name: 'Black', url: 'https://img.staticdj.com/e2f3b08ce1b128639e748e3bfb50c97a.jpeg', filename: 'zavelyn-thermoglove-black.jpeg' },
    { name: 'Gray', url: 'https://img.staticdj.com/bf026bca5128cb614e155e41e596b0bc.jpg', filename: 'zavelyn-thermoglove-gray.jpg' }
  ];

  const currentUploaded = JSON.parse(fs.readFileSync(path.join(dir, 'uploaded_urls.json'), 'utf8'));

  for (const c of colors) {
    console.log(`Downloading ${c.name} glove from ${c.url}...`);
    const resp = await fetch(c.url);
    const buf = Buffer.from(await resp.arrayBuffer());
    fs.writeFileSync(path.join(dir, c.filename), buf);

    console.log(`Uploading to Shopify theme as ${c.filename}...`);
    const pubUrl = await uploadThemeAsset(token, c.filename, buf);
    currentUploaded.push({
      index: currentUploaded.length + 1,
      source: c.url,
      filename: c.filename,
      publicUrl: pubUrl,
      colorTag: c.name
    });
    console.log(`✔ Uploaded ${c.name}: ${pubUrl}`);
  }

  fs.writeFileSync(path.join(dir, 'uploaded_urls.json'), JSON.stringify(currentUploaded, null, 2));
  console.log('Saved updated uploaded_urls.json');
}

main().catch(console.error);
