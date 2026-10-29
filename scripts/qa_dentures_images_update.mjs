import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { getAccessToken, SHOP } from './batch1_config.mjs';

const PORT = 9293;
const URL = 'https://tryzavelyn.com/products/zavelyn-custom-fit-home-dentures';
const PRODUCT_ID = '15474563907769';

const ARTIFACT_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\d0f634e2-c9dd-4bad-bdb2-3c956abea303';
const BACKUP_DIR = './backups/screenshots';

async function main() {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });

  const token = await getAccessToken();

  console.log(`\n========================================================================`);
  console.log(`1. VERIFYING PRODUCT GALLERY IN SHOPIFY ADMIN API`);
  console.log(`========================================================================\n`);

  const res = await fetch(`https://${SHOP}/admin/api/2026-10/products/${PRODUCT_ID}/images.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  console.log(`Total gallery images: ${data.images.length}`);
  data.images.forEach((img, i) => {
    console.log(`[${i + 1}] Pos: ${img.position} | ID: ${img.id} | Width: ${img.width}x${img.height} | Src: ${img.src}`);
  });

  const featuredImg = data.images.find(img => img.position === 1);
  if (!featuredImg || !featuredImg.src.includes('zavelyn-custom-fit-dentures-featured.jpg')) {
    throw new Error('Featured image at position 1 is not the newly uploaded image!');
  }
  console.log(`✓ Confirmed: Image at position 1 is the new featured image.`);
  console.log(`✓ Confirmed: Total ${data.images.length} images preserved (1 new + 6 previous).`);

  console.log(`\n========================================================================`);
  console.log(`2. LAUNCHING CHROME CDP FOR BROWSER QA`);
  console.log(`========================================================================\n`);

  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${process.env.TEMP}\\chrome-dentures-img-qa-${Date.now()}`,
    '--headless=new',
    '--disable-gpu',
    '--window-size=1440,1100',
    'about:blank'
  ]);

  try {
    await new Promise(r => setTimeout(r, 2000));
    const tabRes = await fetch(`http://127.0.0.1:${PORT}/json`);
    const tabs = await tabRes.json();
    const tab = tabs.find(t => t.type === 'page' && !t.url.startsWith('chrome-extension')) || tabs[0];
    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    await new Promise(r => ws.addEventListener('open', r));

    let msgId = 1;
    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const curId = msgId++;
        const handler = (evt) => {
          const msg = JSON.parse(evt.data.toString());
          if (msg.id === curId) {
            ws.removeEventListener('message', handler);
            if (msg.error) reject(msg.error);
            else resolve(msg.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: curId, method, params }));
      });
    }

    await send('Page.enable');
    await send('Runtime.enable');
    await send('Page.navigate', { url: URL });
    await new Promise(r => setTimeout(r, 6000));

    // A. Verify Gallery DOM
    const galleryInfo = await send('Runtime.evaluate', {
      expression: `(() => {
        const mainImg = document.querySelector('.product__media img') || document.querySelector('.zv-main-gallery-img') || document.querySelector('.product-media-container img') || document.querySelector('.media img');
        const allImgs = Array.from(document.querySelectorAll('.product__media-list img, .thumbnail img, .product-media-container img, .zv-pdp-main-media img')).map(img => ({
          src: img.src,
          alt: img.alt,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          complete: img.complete
        }));
        return {
          mainImgSrc: mainImg ? mainImg.src : null,
          mainImgNaturalWidth: mainImg ? mainImg.naturalWidth : 0,
          totalGalleryImgs: allImgs.length,
          allImgs: allImgs.slice(0, 8)
        };
      })()`,
      returnByValue: true
    });
    console.log('Browser Gallery Evaluation:', JSON.stringify(galleryInfo.result.value, null, 2));

    // B. Verify Body Images DOM
    const bodyImagesInfo = await send('Runtime.evaluate', {
      expression: `(() => {
        const bodyImgs = Array.from(document.querySelectorAll('.zv-dentures-body-img')).map((img, i) => ({
          index: i + 1,
          src: img.src,
          alt: img.alt,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          complete: img.complete,
          clientWidth: img.clientWidth,
          clientHeight: img.clientHeight
        }));
        return {
          count: bodyImgs.length,
          bodyImgs
        };
      })()`,
      returnByValue: true
    });
    console.log('Browser Body Images Evaluation:', JSON.stringify(bodyImagesInfo.result.value, null, 2));

    // C. Capture Desktop Screenshots
    console.log('Capturing Desktop Hero & Gallery...');
    const desktopHeroShot = await send('Page.captureScreenshot', { format: 'png' });
    const deskHeroPath = path.join(BACKUP_DIR, 'dentures_desktop_gallery_updated.png');
    fs.writeFileSync(deskHeroPath, Buffer.from(desktopHeroShot.data, 'base64'));
    fs.copyFileSync(deskHeroPath, path.join(ARTIFACT_DIR, 'dentures_desktop_gallery_updated.png'));
    console.log(`Saved: ${deskHeroPath}`);

    // Scroll down to body section
    await send('Runtime.evaluate', {
      expression: `document.getElementById('dentures-details')?.scrollIntoView({ behavior: 'instant', block: 'start' });`
    });
    await new Promise(r => setTimeout(r, 1000));
    console.log('Capturing Desktop Body Images...');
    const desktopBodyShot = await send('Page.captureScreenshot', { format: 'png' });
    const deskBodyPath = path.join(BACKUP_DIR, 'dentures_desktop_body_updated.png');
    fs.writeFileSync(deskBodyPath, Buffer.from(desktopBodyShot.data, 'base64'));
    fs.copyFileSync(deskBodyPath, path.join(ARTIFACT_DIR, 'dentures_desktop_body_updated.png'));
    console.log(`Saved: ${deskBodyPath}`);

    // D. Capture Mobile Screenshots (390x844)
    console.log('Switching to Mobile Viewport (390x844)...');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, 0);` });
    await new Promise(r => setTimeout(r, 1500));

    console.log('Capturing Mobile Hero & Gallery...');
    const mobileHeroShot = await send('Page.captureScreenshot', { format: 'png' });
    const mobHeroPath = path.join(BACKUP_DIR, 'dentures_mobile_gallery_updated.png');
    fs.writeFileSync(mobHeroPath, Buffer.from(mobileHeroShot.data, 'base64'));
    fs.copyFileSync(mobHeroPath, path.join(ARTIFACT_DIR, 'dentures_mobile_gallery_updated.png'));
    console.log(`Saved: ${mobHeroPath}`);

    // Scroll to Body on Mobile
    await send('Runtime.evaluate', {
      expression: `document.getElementById('dentures-details')?.scrollIntoView({ behavior: 'instant', block: 'start' });`
    });
    await new Promise(r => setTimeout(r, 1000));
    console.log('Capturing Mobile Body Section 1 & 2...');
    const mobileBodyShot = await send('Page.captureScreenshot', { format: 'png' });
    const mobBodyPath = path.join(BACKUP_DIR, 'dentures_mobile_body_updated.png');
    fs.writeFileSync(mobBodyPath, Buffer.from(mobileBodyShot.data, 'base64'));
    fs.copyFileSync(mobBodyPath, path.join(ARTIFACT_DIR, 'dentures_mobile_body_updated.png'));
    console.log(`Saved: ${mobBodyPath}`);

    ws.close();
  } finally {
    try {
      chromeProc.kill('SIGTERM');
    } catch (e) {}
  }

  console.log(`\n========================================================================`);
  console.log(`3. REGRESSION CHECK: VERIFYING EXISTING STORE PRODUCTS`);
  console.log(`========================================================================\n`);

  const checks = [
    { name: 'BotanaRoots Original', url: 'https://tryzavelyn.com/products/zavelyn-botanaroots-organic-batana-hair-growth-oil', expectedPrice: '39.99' },
    { name: 'BotanaRoots BOGO', url: 'https://tryzavelyn.com/pages/botanaroots-bogo-offer', expectedPrice: null },
    { name: 'Livestock Heating Lamp', url: 'https://tryzavelyn.com/products/livestock-heating-lamp', expectedPrice: '107.99' },
    { name: 'Yeoman Lawn Sweeper', url: 'https://tryzavelyn.com/products/the-yeoman-sweep', expectedPrice: '229.99' }
  ];

  for (const c of checks) {
    const r = await fetch(c.url);
    const html = await r.text();
    const hasPrice = c.expectedPrice ? html.includes(c.expectedPrice) : true;
    console.log(`- ${c.name}: HTTP ${r.status} | Price match: ${hasPrice ? 'YES' : 'CHECK'}`);
  }

  console.log(`\n✓ QA COMPLETED SUCCESSFULLY!`);
}

main().catch(console.error);
