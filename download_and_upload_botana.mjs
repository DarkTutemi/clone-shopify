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
  const dir = 'botana_media';
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const rawList = JSON.parse(fs.readFileSync('botana_extracted_images.json', 'utf8'));
  // Select top 12 unique media assets
  const targetUrls = rawList.slice(0, 14);

  const uploadedUrls = [];

  for (let i = 0; i < targetUrls.length; i++) {
    const srcUrl = targetUrls[i];
    const ext = srcUrl.split('?')[0].split('.').pop() || 'jpg';
    const localFile = path.join(dir, `botana_asset_${i + 1}.${ext}`);
    const assetFilename = `zavelyn-botana-asset-${i + 1}.${ext}`;

    try {
      console.log(`[${i + 1}/${targetUrls.length}] Downloading ${srcUrl.substring(0, 60)}...`);
      const resp = await fetch(srcUrl);
      if (!resp.ok) {
        console.warn(`Failed to download ${srcUrl}: ${resp.statusText}`);
        continue;
      }
      const arrayBuf = await resp.arrayBuffer();
      const buf = Buffer.from(arrayBuf);
      fs.writeFileSync(localFile, buf);

      console.log(`Uploading to Shopify theme as ${assetFilename}...`);
      const publicUrl = await uploadThemeAsset(token, assetFilename, buf);
      uploadedUrls.push({
        index: i + 1,
        source: srcUrl,
        filename: assetFilename,
        publicUrl: publicUrl
      });
      console.log(`✔ Uploaded: ${publicUrl}`);
    } catch (e) {
      console.error(`Error on asset ${i + 1}:`, e.message);
    }
  }

  fs.writeFileSync(path.join(dir, 'uploaded_urls.json'), JSON.stringify(uploadedUrls, null, 2));
  console.log(`\n🎉 Successfully processed ${uploadedUrls.length} assets! Saved to ${dir}/uploaded_urls.json`);
}

main().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
