import fs from 'fs';

async function main() {
  const tabsRes = await fetch('http://localhost:9222/json');
  const tabs = await tabsRes.json();
  const trackTab = tabs.find(t => t.url?.includes('track-order') || (t.type === 'page' && t.webSocketDebuggerUrl));
  if (!trackTab) throw new Error('No tab found');

  const ws = new WebSocket(trackTab.webSocketDebuggerUrl);
  let idCounter = 1;
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = idCounter++;
      const handler = evt => {
        const msg = JSON.parse(evt.data.toString());
        if (msg.id === id) {
          ws.removeEventListener('message', handler);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await new Promise(r => ws.addEventListener('open', r));
  console.log('Connected to CDP. Reloading https://tryzavelyn.com/pages/track-order ...');

  await send('Page.navigate', { url: 'https://tryzavelyn.com/pages/track-order' });
  await new Promise(r => setTimeout(r, 4500));

  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: false
  });

  const dom = await send('Runtime.evaluate', {
    expression: `
      (() => {
        const title = document.title;
        const h1 = document.querySelector('h1')?.innerText?.trim();
        const hasHeader = Boolean(document.querySelector('.willa-header, header[class*="header"]'));
        const hasFooter = Boolean(document.querySelector('.willa-footer, footer[class*="footer"]'));
        const hasTabs = Boolean(document.querySelector('.zv-track-tabs'));
        const hasFaq = document.querySelectorAll('.zv-faq-item').length;
        const hasMilestones = document.querySelectorAll('.zv-milestone-card').length;
        return { title, h1, hasHeader, hasFooter, hasTabs, hasFaq, hasMilestones };
      })()
    `,
    returnByValue: true
  });

  console.log('Live Track Order Verification Result:');
  console.log(JSON.stringify(dom.result.value, null, 2));

  // Capture Screenshot
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('track_order_fixed.png', Buffer.from(shot.data, 'base64'));
  console.log('✔ Saved screenshot to track_order_fixed.png');

  ws.close();
}

main().catch(console.error);
