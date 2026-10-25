import fs from 'fs';
import path from 'path';

const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const THEME_ID = '186607567033';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || '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';
const PRODUCT_ID = '15455757336761';

async function getAccessToken() {
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await res.json();
  return data.access_token;
}

async function getThemeAsset(token, key) {
  const url = `https://${SHOP_DOMAIN}/admin/api/2024-10/themes/${THEME_ID}/assets.json?asset[key]=${encodeURIComponent(key)}`;
  const res = await fetch(url, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  return data.asset ? data.asset.value : null;
}

async function downloadFile(url, dest) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.writeFileSync(dest, buffer);
    console.log(`  ✔ Saved: ${dest} (${buffer.length} bytes)`);
    return true;
  } catch (e) {
    console.error(`  ✗ Failed to download ${url}:`, e.message);
    return false;
  }
}

async function run() {
  console.log('=== AUDITING IMAGES FOR ZAVELYN LIVESTOCK HEATING LAMP ===');
  const token = await getAccessToken();

  // 1. Check Product Media via Admin API
  console.log('\n--- 1. Shopify Product Media (Admin API) ---');
  const pRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/products/${PRODUCT_ID}.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const pData = await pRes.json();
  const productImages = pData.product?.images || [];
  console.log(`Found ${productImages.length} product images in Shopify catalog:`);
  productImages.forEach((img, i) => {
    console.log(`  [${i+1}] ID: ${img.id} | Alt: "${img.alt || ''}" | SRC: ${img.src}`);
  });

  // 2. Check live theme template: templates/product.sakerplus-livestock-heating-lamp.json
  console.log('\n--- 2. Live Theme Template (product.sakerplus-livestock-heating-lamp.json) ---');
  const liveTemplateStr = await getThemeAsset(token, 'templates/product.sakerplus-livestock-heating-lamp.json');
  if (liveTemplateStr) {
    fs.writeFileSync('Clone-willafarm/theme/templates/product.sakerplus-livestock-heating-lamp.json', liveTemplateStr);
    const parsed = JSON.parse(liveTemplateStr);
    const blocks = parsed.sections?.main?.blocks || {};
    console.log('Template blocks count:', Object.keys(blocks).length);
    for (const [k, b] of Object.entries(blocks)) {
      if (b.type === 'gallery_image') {
        console.log(`  Gallery block [${k}]: ${b.settings?.image_url}`);
      } else if (b.settings?.image_url) {
        console.log(`  Block [${k}] (${b.type}): ${b.settings.image_url}`);
      }
    }
  }

  // 3. Check live theme section: sections/heating-lamp-funnel.liquid
  console.log('\n--- 3. Live Theme Section (sections/heating-lamp-funnel.liquid) ---');
  const liveFunnelStr = await getThemeAsset(token, 'sections/heating-lamp-funnel.liquid');
  if (liveFunnelStr) {
    fs.writeFileSync('Clone-willafarm/theme/sections/heating-lamp-funnel.liquid', liveFunnelStr);
    console.log('Synchronized local sections/heating-lamp-funnel.liquid with live theme.');
    
    // Extract image URLs in section
    const imgMatches = liveFunnelStr.match(/https:\/\/[^\"\'\s\)]+\.(?:png|jpg|jpeg|webp)/gi) || [];
    const uniqueThemeImgs = [...new Set(imgMatches)];
    console.log(`Found ${uniqueThemeImgs.length} unique image URLs in funnel section.`);
  }

  // 4. Scrape Live PDP HTML
  console.log('\n--- 4. Live PDP HTML Inspection (https://tryzavelyn.com/products/livestock-heating-lamp) ---');
  const pdpRes = await fetch(`https://tryzavelyn.com/products/livestock-heating-lamp?t=${Date.now()}`);
  const pdpHtml = await pdpRes.text();
  
  // Extract all img src
  const imgSrcRegex = /<img[^>]+src=[\"']([^\"']+)[\"']/gi;
  let match;
  const liveImgs = new Set();
  while ((match = imgSrcRegex.exec(pdpHtml)) !== null) {
    let src = match[1];
    if (src.startsWith('//')) src = 'https:' + src;
    liveImgs.add(src);
  }
  console.log(`Found ${liveImgs.size} <img> tags on live PDP.`);
  for (const src of liveImgs) {
    console.log(`  - ${src}`);
  }

  // 5. Download and Backup All User Images locally
  console.log('\n--- 5. Backing up all custom user images locally ---');
  const backupDir = 'Clone-willafarm/backup/user_images_' + Date.now();
  fs.mkdirSync(backupDir, { recursive: true });

  // Backup catalog images
  for (let i = 0; i < productImages.length; i++) {
    const url = productImages[i].src;
    const ext = path.extname(url.split('?')[0]) || '.png';
    const dest = path.join(backupDir, `catalog_img_${i+1}_${productImages[i].id}${ext}`);
    await downloadFile(url, dest);
  }

  // Also check recently uploaded files to Shopify CDN
  const cdnImgs = [...liveImgs].filter(u => u.includes('cdn.shopify.com/s/files'));
  for (let i = 0; i < cdnImgs.length; i++) {
    const url = cdnImgs[i];
    const filename = path.basename(url.split('?')[0]);
    const dest = path.join(backupDir, `pdp_cdn_${filename}`);
    if (!fs.existsSync(dest)) {
      await downloadFile(url, dest);
    }
  }

  console.log(`\n✔ Backup complete in: ${backupDir}`);
}

run().catch(console.error);
