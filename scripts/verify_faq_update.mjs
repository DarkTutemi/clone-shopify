import fs from 'fs';
import { spawn } from 'child_process';

const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity-ide/brain/d0f634e2-c9dd-4bad-bdb2-3c956abea303';
const OUTPUT_DIR = 'assets/botanaroots_qa_after_refactor';
const DRAFT_THEME_ID = '187708571833';
const URL = `https://tryzavelyn.com/products/zavelyn-botanaroots-organic-batana-hair-growth-oil?preview_theme_id=${DRAFT_THEME_ID}`;
const PORT = 9280;

async function main() {
  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${process.env.TEMP}\\chrome-faq-verify-${Date.now()}`,
    '--headless=new',
    '--disable-gpu',
    '--window-size=1200,1200',
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

  await send('Page.navigate', { url: URL });
  await new Promise(r => setTimeout(r, 6000));

  const faqData = await send('Runtime.evaluate', {
    expression: `(() => {
      const extSection = document.querySelector('#zv-extended-faq');
      if (!extSection) return { found: false };
      const items = Array.from(extSection.querySelectorAll('.zv-faq-item-details, details'));
      return {
        found: true,
        count: items.length,
        items: items.map(d => ({
          question: d.querySelector('summary')?.innerText?.trim(),
          answer: d.querySelector('.zv-faq-answer-panel, .kc-faq__a, p')?.innerText?.trim(),
          open: d.hasAttribute('open')
        }))
      };
    })()`,
    returnByValue: true
  });

  console.log('FAQ verification on Draft Preview:');
  console.log(JSON.stringify(faqData.result?.value, null, 2));

  // Capture screenshot of the updated Extended FAQ section
  await send('Runtime.evaluate', {
    expression: `(() => {
      document.querySelectorAll('#preview-bar-iframe, #shopify-pc__banner, .shopify-preview-bar, iframe, .zv-sticky-atc-wrap').forEach(el => el.remove());
      const section = document.querySelector('#zv-extended-faq');
      if (section) section.scrollIntoView({ block: 'start' });
    })()`
  });
  await new Promise(r => setTimeout(r, 400));

  const coordsRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.querySelector('#zv-extended-faq');
      if (!el) return null;
      const r = el.getBoundingClientRect();
      return { x: r.left + window.scrollX, y: r.top + window.scrollY, width: r.width, height: r.height };
    })()`,
    returnByValue: true
  });

  const coords = coordsRes.result?.value;
  if (coords) {
    const shot = await send('Page.captureScreenshot', {
      format: 'png',
      clip: {
        x: Math.max(0, coords.x - 12),
        y: Math.max(0, coords.y - 12),
        width: coords.width + 24,
        height: coords.height + 24,
        scale: 1
      },
      captureBeyondViewport: true
    });
    const buf = Buffer.from(shot.data, 'base64');
    fs.writeFileSync(`${OUTPUT_DIR}/after_extended_faq_6items.png`, buf);
    fs.writeFileSync(`${ARTIFACT_DIR}/after_extended_faq_6items.png`, buf);
    console.log(`📸 Saved Screenshot: after_extended_faq_6items.png (${Math.round(buf.length / 1024)} KB)`);
  }

  // Also test clicking one of the new user questions to show interactive open state!
  await send('Runtime.evaluate', {
    expression: `(() => {
      // Open the 3rd question: "Can I use this on color-treated, bleached, or chemically straightened hair?"
      const items = Array.from(document.querySelectorAll('#zv-extended-faq details summary'));
      if (items[2]) items[2].click();
    })()`
  });
  await new Promise(r => setTimeout(r, 400));

  const shotOpen = await send('Page.captureScreenshot', {
    format: 'png',
    clip: {
      x: Math.max(0, coords.x - 12),
      y: Math.max(0, coords.y - 12),
      width: coords.width + 24,
      height: coords.height + 100,
      scale: 1
    },
    captureBeyondViewport: true
  });
  const bufOpen = Buffer.from(shotOpen.data, 'base64');
  fs.writeFileSync(`${OUTPUT_DIR}/after_extended_faq_open_user_q.png`, bufOpen);
  fs.writeFileSync(`${ARTIFACT_DIR}/after_extended_faq_open_user_q.png`, bufOpen);
  console.log(`📸 Saved Screenshot: after_extended_faq_open_user_q.png (${Math.round(bufOpen.length / 1024)} KB)`);

  chromeProc.kill();
}

main().catch(console.error);
