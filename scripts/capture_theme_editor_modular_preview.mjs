import fs from 'fs';
import { spawn } from 'child_process';

const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity-ide/brain/d0f634e2-c9dd-4bad-bdb2-3c956abea303';
const OUTPUT_DIR = 'assets/botanaroots_qa_after_refactor';
const PORT = 9272;

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// Read local images for thumbnail rendering
const b64Buy3 = fs.existsSync('assets/botana-bundle-buy3.webp') ? fs.readFileSync('assets/botana-bundle-buy3.webp').toString('base64') : '';
const b64Buy2 = fs.existsSync('assets/botana-bundle-buy2.webp') ? fs.readFileSync('assets/botana-bundle-buy2.webp').toString('base64') : '';
const b64Buy1 = fs.existsSync('assets/botana-bundle-buy1.webp') ? fs.readFileSync('assets/botana-bundle-buy1.webp').toString('base64') : '';
const b64Up = fs.existsSync('assets/botana-bundle-upgrade-size.webp') ? fs.readFileSync('assets/botana-bundle-upgrade-size.webp').toString('base64') : '';

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
  body { background: #E4E5E7; padding: 30px; display: flex; justify-content: center; gap: 20px; }
  .shopify-editor-window {
    width: 440px;
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
  .editor-content { padding: 18px; display: flex; flex-direction: column; gap: 14px; }
  .section-breadcrumb { font-size: 12px; color: #6D7175; font-weight: 500; }
  .section-name { font-size: 16px; font-weight: 800; color: #202223; margin-top: 2px; }
  
  .setting-group-header {
    margin-top: 4px;
    padding-top: 12px;
    border-top: 1px solid #E1E3E5;
    font-size: 12.5px;
    font-weight: 800;
    color: #17433C;
    letter-spacing: 0.4px;
    display: flex;
    align-items: center;
    gap: 6px;
    text-transform: uppercase;
  }
  .setting-item { display: flex; flex-direction: column; gap: 5px; }
  .setting-label { font-size: 12px; font-weight: 600; color: #202223; }
  .setting-info { font-size: 11px; color: #6D7175; line-height: 1.3; }
  
  .image-picker-box {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px;
    background: #F6F6F7;
    border: 1px solid #C9CCCF;
    border-radius: 8px;
  }
  .image-preview-thumb {
    width: 60px;
    height: 48px;
    background: #FFFFFF;
    border: 1px solid #E1E3E5;
    border-radius: 6px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .image-preview-thumb img { max-width: 100%; max-height: 100%; object-fit: contain; }
  .image-picker-details { flex: 1; }
  .image-name { font-size: 11.5px; font-weight: 600; color: #202223; }
  .image-actions { display: flex; gap: 8px; margin-top: 3px; }
  .btn-action { font-size: 11px; color: #008060; background: none; border: none; cursor: pointer; text-decoration: underline; }
  
  .range-box {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .range-slider {
    flex: 1;
    height: 5px;
    border-radius: 3px;
    background: #008060;
    outline: none;
    -webkit-appearance: none;
  }
  .range-val {
    font-size: 12px;
    font-weight: 700;
    color: #202223;
    background: #F1F2F3;
    padding: 3px 7px;
    border-radius: 4px;
    min-width: 50px;
    text-align: center;
  }

  .text-input {
    padding: 8px 10px;
    border: 1px solid #C9CCCF;
    border-radius: 6px;
    font-size: 12.5px;
    color: #202223;
    background: #FFFFFF;
  }

  .blocks-section {
    background: #F9FAFB;
    border: 1px solid #E5E7EB;
    border-radius: 8px;
    padding: 10px;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .blocks-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    font-weight: 700;
    color: #374151;
  }
  .block-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #FFFFFF;
    border: 1px solid #D1D5DB;
    border-radius: 6px;
    padding: 8px 10px;
    font-size: 12px;
  }
  .block-left {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .block-drag {
    color: #9CA3AF;
    cursor: grab;
    font-size: 14px;
  }
  .block-title {
    font-weight: 600;
    color: #1F2937;
  }
  .block-sub {
    font-size: 11px;
    color: #6B7280;
  }
  .block-actions {
    color: #008060;
    font-size: 11px;
    font-weight: 600;
    cursor: pointer;
  }
</style>
</head>
<body>

<div class="shopify-editor-window">
  <div class="editor-header">
    <div class="editor-title">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#008060"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
      <span>Shopify Theme Customizer</span>
    </div>
    <span class="editor-badge">[Draft Clone] 187708571833</span>
  </div>

  <div class="editor-content">
    <div class="section-breadcrumb">Templates &rsaquo; BotanaRoots PDP</div>
    <div class="section-name">Product Main (Zavelyn PDP Main V2)</div>

    <!-- SIZE UPSELL SETTINGS -->
    <div class="setting-group-header">
      <span>📐 Size Upsell Image & Sizing</span>
    </div>

    <div class="setting-item">
      <label class="setting-label">Size Upsell Graphic (120ml Upgrade)</label>
      <div class="image-picker-box">
        <div class="image-preview-thumb">
          <img src="data:image/webp;base64,${b64Up}" alt="Upsell Preview">
        </div>
        <div class="image-picker-details">
          <div class="image-name">a867f031-c378-4948-b172-9ede56b8c973.png</div>
          <div class="image-actions">
            <span class="btn-action">Change</span>
            <span class="btn-action">Edit</span>
          </div>
        </div>
      </div>
      <span class="setting-info">Custom graphic for 120ml bottle size upgrade card.</span>
    </div>

    <div class="setting-item">
      <label class="setting-label">Desktop Image Width (px)</label>
      <div class="range-box">
        <div class="range-slider"></div>
        <span class="range-val">135 px</span>
      </div>
    </div>

    <div class="setting-item">
      <label class="setting-label">Mobile Image Width (px)</label>
      <div class="range-box">
        <div class="range-slider"></div>
        <span class="range-val">115 px</span>
      </div>
    </div>

    <div class="setting-item">
      <label class="setting-label">Upsell Heading</label>
      <input type="text" class="text-input" value="Double the Size!">
    </div>

    <!-- BUNDLE CUSTOM IMAGES -->
    <div class="setting-group-header">
      <span>📦 Quantity Bundle Images & Badges</span>
    </div>

    <div class="setting-item">
      <label class="setting-label">Buy 3 Card Image</label>
      <div class="image-picker-box">
        <div class="image-preview-thumb">
          <img src="data:image/webp;base64,${b64Buy3}" alt="Buy 3">
        </div>
        <div class="image-picker-details">
          <div class="image-name">b1ac7e73-94fa-4026-949e-f07ca0ed6a56.png</div>
          <div class="image-actions">
            <span class="btn-action">Change</span>
          </div>
        </div>
      </div>
    </div>

    <div class="setting-item">
      <label class="setting-label">Buy 3 Banner Text</label>
      <input type="text" class="text-input" value="BEST VALUE · FREE SHIPPING · EXTRA 20% OFF">
    </div>

    <div class="setting-item">
      <label class="setting-label">Buy 2 Card Image</label>
      <div class="image-picker-box">
        <div class="image-preview-thumb">
          <img src="data:image/webp;base64,${b64Buy2}" alt="Buy 2">
        </div>
        <div class="image-picker-details">
          <div class="image-name">Zavelyn_Batana_Oil_Botanical_Duo.png</div>
          <div class="image-actions">
            <span class="btn-action">Change</span>
          </div>
        </div>
      </div>
    </div>

    <!-- MODULAR TRUST CARDS BLOCKS -->
    <div class="setting-group-header">
      <span>🛡️ Trust Cards (Modular Blocks)</span>
    </div>

    <div class="blocks-section">
      <div class="blocks-header">
        <span>Blocks (3 of 8)</span>
        <span style="color: #008060; cursor: pointer;">+ Add Trust Card</span>
      </div>
      <div class="block-item">
        <div class="block-left">
          <span class="block-drag">&#8942;&#8942;</span>
          <div>
            <div class="block-title">30-Day Returns</div>
            <div class="block-sub">Icon: Return / Shield</div>
          </div>
        </div>
        <span class="block-actions">Edit</span>
      </div>
      <div class="block-item">
        <div class="block-left">
          <span class="block-drag">&#8942;&#8942;</span>
          <div>
            <div class="block-title">Free Tracked Shipping</div>
            <div class="block-sub">Icon: Shipping / Truck</div>
          </div>
        </div>
        <span class="block-actions">Edit</span>
      </div>
      <div class="block-item">
        <div class="block-left">
          <span class="block-drag">&#8942;&#8942;</span>
          <div>
            <div class="block-title">Safe 256-Bit SSL</div>
            <div class="block-sub">Icon: Lock / Security</div>
          </div>
        </div>
        <span class="block-actions">Edit</span>
      </div>
    </div>

    <!-- SHORT FAQ BLOCKS -->
    <div class="setting-group-header">
      <span>❓ Short FAQ (Modular Accordion Blocks)</span>
    </div>

    <div class="blocks-section">
      <div class="blocks-header">
        <span>FAQ Blocks (3 items)</span>
        <span style="color: #008060; cursor: pointer;">+ Add FAQ Item</span>
      </div>
      <div class="block-item">
        <div class="block-left">
          <span class="block-drag">&#8942;&#8942;</span>
          <div>
            <div class="block-title">How does the 30-Day Return Guarantee work?</div>
            <div class="block-sub">Default Open: False</div>
          </div>
        </div>
        <span class="block-actions">Edit</span>
      </div>
      <div class="block-item">
        <div class="block-left">
          <span class="block-drag">&#8942;&#8942;</span>
          <div>
            <div class="block-title">Shipping, Delivery & Returns</div>
            <div class="block-sub">Default Open: False</div>
          </div>
        </div>
        <span class="block-actions">Edit</span>
      </div>
      <div class="block-item">
        <div class="block-left">
          <span class="block-drag">&#8942;&#8942;</span>
          <div>
            <div class="block-title">Is payment safe and encrypted?</div>
            <div class="block-sub">Default Open: False</div>
          </div>
        </div>
        <span class="block-actions">Edit</span>
      </div>
    </div>

  </div>
</div>

</body>
</html>
`;

async function main() {
  const tmpFile = `${process.env.TEMP}\\theme_editor_preview_${Date.now()}.html`;
  fs.writeFileSync(tmpFile, html);

  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${process.env.TEMP}\\chrome-editor-preview-${Date.now()}`,
    '--headless=new',
    '--disable-gpu',
    '--window-size=1200,1400',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1200));
  const res = await fetch(`http://127.0.0.1:${PORT}/json`);
  const tabs = await res.json();
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
          resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });
  }

  const fileUrl = `file:///${tmpFile.replace(/\\/g, '/')}`;
  await send('Page.navigate', { url: fileUrl });
  await new Promise(r => setTimeout(r, 1000));

  const shot = await send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true
  });

  const buf = Buffer.from(shot.data, 'base64');
  fs.writeFileSync(`${OUTPUT_DIR}/shopify_theme_editor_modular_blocks_preview.png`, buf);
  fs.writeFileSync(`${ARTIFACT_DIR}/shopify_theme_editor_modular_blocks_preview.png`, buf);
  console.log(`📸 Saved Theme Editor Screenshot: shopify_theme_editor_modular_blocks_preview.png (${Math.round(buf.length / 1024)} KB)`);

  chromeProc.kill();
  try { fs.unlinkSync(tmpFile); } catch(e){}
}

main().catch(console.error);
