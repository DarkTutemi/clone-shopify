import fs from 'fs';
import { spawn } from 'child_process';

const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity-ide/brain/d0f634e2-c9dd-4bad-bdb2-3c956abea303';
const PORT = 9253;

// Convert local images to base64 so they render directly in headless Chrome
const b64Buy3 = fs.readFileSync('assets/botana-bundle-buy3.webp').toString('base64');
const b64Buy2 = fs.readFileSync('assets/botana-bundle-buy2.webp').toString('base64');
const b64Buy1 = fs.readFileSync('assets/botana-bundle-buy1.webp').toString('base64');
const b64Up = fs.readFileSync('assets/botana-bundle-upgrade-size.webp').toString('base64');

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
  body { background: #E4E5E7; padding: 30px; display: flex; justify-content: center; }
  .shopify-editor-window {
    width: 420px;
    background: #FFFFFF;
    border-radius: 12px;
    box-shadow: 0 10px 35px rgba(0,0,0,0.15);
    border: 1px solid #D2D5D8;
    overflow: hidden;
  }
  .editor-header {
    background: #1A1A1A;
    color: #FFFFFF;
    padding: 14px 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .editor-title { font-size: 13.5px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
  .editor-badge { background: #303030; color: #E3E3E3; font-size: 11px; padding: 3px 8px; border-radius: 4px; font-weight: 600; }
  .editor-content { padding: 20px; display: flex; flex-direction: column; gap: 16px; }
  .section-breadcrumb { font-size: 12px; color: #6D7175; font-weight: 500; }
  .section-name { font-size: 17px; font-weight: 800; color: #202223; margin-top: 2px; }
  .setting-group-header {
    margin-top: 6px;
    padding-top: 14px;
    border-top: 1px solid #E1E3E5;
    font-size: 13px;
    font-weight: 800;
    color: #202223;
    letter-spacing: 0.3px;
    display: flex;
    align-items: center;
    gap: 6px;
    text-transform: uppercase;
  }
  .setting-item { display: flex; flex-direction: column; gap: 5px; }
  .setting-label { font-size: 12.5px; font-weight: 600; color: #202223; }
  .setting-info { font-size: 11.5px; color: #6D7175; line-height: 1.3; }
  .image-picker-box {
    display: flex;
    align-items: center;
    gap: 12px;
    background: #F6F6F7;
    border: 1.5px solid #C9CCCF;
    border-radius: 8px;
    padding: 10px 12px;
    cursor: pointer;
    transition: all 0.2s;
  }
  .image-picker-box:hover { border-color: #008060; background: #F1F8F5; }
  .img-thumb {
    width: 54px;
    height: 46px;
    background: #FFFFFF;
    border: 1px solid #E1E3E5;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    flex-shrink: 0;
  }
  .img-thumb img { max-width: 100%; max-height: 100%; object-fit: contain; }
  .picker-meta { flex: 1; min-width: 0; }
  .picker-filename { font-size: 12px; font-weight: 700; color: #202223; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .picker-action { font-size: 11.5px; color: #008060; font-weight: 600; margin-top: 2px; }
  .editor-footer {
    padding: 14px 20px;
    background: #FAFBFB;
    border-top: 1px solid #E1E3E5;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .btn-save {
    background: #008060;
    color: #FFFFFF;
    font-size: 12.5px;
    font-weight: 700;
    padding: 8px 18px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
  }
</style>
</head>
<body>
  <div class="shopify-editor-window">
    <div class="editor-header">
      <div class="editor-title">
        <span>Shopify Theme Customizer</span>
      </div>
      <span class="editor-badge">Theme: [Draft] Zavelyn 187702804665</span>
    </div>
    <div class="editor-content">
      <div>
        <div class="section-breadcrumb">Templates &gt; Product (zavelyn-botanaroots-organic-batana...)</div>
        <div class="section-name">Zavelyn PDP Main V2</div>
      </div>

      <div class="setting-group-header">
        <span>⚙️ BotanaRoots Bundle Custom Images</span>
      </div>

      <!-- Setting 1: Buy 3 -->
      <div class="setting-item">
        <div class="setting-label">Buy 3 Card Image (botana_img_buy3)</div>
        <div class="setting-info">Custom product image for Buy 3 bundle card (leave empty to use default)</div>
        <div class="image-picker-box">
          <div class="img-thumb"><img src="data:image/webp;base64,${b64Buy3}"></div>
          <div class="picker-meta">
            <div class="picker-filename">botana-bundle-buy3.webp</div>
            <div class="picker-action">Select image · Explore free images</div>
          </div>
        </div>
      </div>

      <!-- Setting 2: Buy 2 -->
      <div class="setting-item">
        <div class="setting-label">Buy 2 Card Image (botana_img_buy2)</div>
        <div class="setting-info">Custom product image for Buy 2 bundle card (leave empty to use default)</div>
        <div class="image-picker-box">
          <div class="img-thumb"><img src="data:image/webp;base64,${b64Buy2}"></div>
          <div class="picker-meta">
            <div class="picker-filename">botana-bundle-buy2.webp</div>
            <div class="picker-action">Select image · Explore free images</div>
          </div>
        </div>
      </div>

      <!-- Setting 3: Buy 1 -->
      <div class="setting-item">
        <div class="setting-label">Buy 1 Card Image (botana_img_buy1)</div>
        <div class="setting-info">Custom product image for Buy 1 bundle card (leave empty to use default)</div>
        <div class="image-picker-box">
          <div class="img-thumb"><img src="data:image/webp;base64,${b64Buy1}"></div>
          <div class="picker-meta">
            <div class="picker-filename">botana-bundle-buy1.webp</div>
            <div class="picker-action">Select image · Explore free images</div>
          </div>
        </div>
      </div>

      <!-- Setting 4: Upsell -->
      <div class="setting-item">
        <div class="setting-label">Size Upsell Image (botana_img_upsell)</div>
        <div class="setting-info">Custom graphic for 120ml bottle size upgrade card (leave empty to use default)</div>
        <div class="image-picker-box">
          <div class="img-thumb"><img src="data:image/webp;base64,${b64Up}"></div>
          <div class="picker-meta">
            <div class="picker-filename">botana-bundle-upgrade-size.webp</div>
            <div class="picker-action">Select image · Explore free images</div>
          </div>
        </div>
      </div>
    </div>
    <div class="editor-footer">
      <span style="font-size:11.5px;color:#6D7175;">Auto-applied to BotanaRoots bundle</span>
      <button class="btn-save">Save Theme</button>
    </div>
  </div>
</body>
</html>`;

const tmpHtmlPath = 'scratch_editor_preview.html';
fs.writeFileSync(tmpHtmlPath, html);

const userDataDir = `${process.env.TEMP}\\chrome-editor-shot-${Date.now()}`;
const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  `--remote-debugging-port=${PORT}`,
  `--user-data-dir=${userDataDir}`,
  '--headless=new',
  '--disable-gpu',
  '--window-size=550,920',
  'about:blank'
]);

async function run() {
  let tabs = null;
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 400));
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json`);
      tabs = await res.json();
      if (tabs && tabs.length > 0) break;
    } catch (e) {}
  }

  const tab = tabs.find(t => t.type === 'page') || tabs[0];
  const ws = new WebSocket(tab.webSocketDebuggerUrl);

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

  await new Promise(r => ws.addEventListener('open', r));
  const fileUrl = 'file:///' + process.cwd().replace(/\\/g, '/') + '/' + tmpHtmlPath;
  await send('Page.navigate', { url: fileUrl });
  await new Promise(r => setTimeout(r, 1200));

  const shot = await send('Page.captureScreenshot', { format: 'png' });
  const buf = Buffer.from(shot.data, 'base64');
  fs.writeFileSync('assets/botanaroots_qa/botana_theme_editor_image_settings.png', buf);
  fs.writeFileSync(`${ARTIFACT_DIR}/botana_theme_editor_image_settings.png`, buf);
  console.log('✓ Successfully captured Theme Editor settings screenshot:', buf.length, 'bytes');

  chromeProc.kill();
  if (fs.existsSync(tmpHtmlPath)) fs.unlinkSync(tmpHtmlPath);
}

run().catch(console.error);
